// src/content-script.ts
import JSZip from "jszip";
import * as XLSX from "xlsx";

// Function to download all images from the page
async function downloadAllImages() {
  try {
    const images = Array.from(document.querySelectorAll("img"));
    const validImages = images.filter((img) => {
      const { width, height } = img.getBoundingClientRect();
      return (
        width > 50 &&
        height > 50 &&
        img.src &&
        !img.src.startsWith("data:image/svg+xml")
      );
    });

    if (validImages.length === 0) {
      alert("No valid images found on this page.");
      return { success: false, count: 0 };
    }

    const zip = new JSZip();
    const imgFolder = zip.folder("images");

    const imagePromises = validImages.map(async (img, index) => {
      try {
        const response = await fetch(img.src);
        if (!response.ok) throw new Error(`Failed to fetch image: ${img.src}`);

        const blob = await response.blob();
        const filename = `image_${String(index).padStart(
          3,
          "0"
        )}.${getExtensionFromMimeType(blob.type)}`;
        imgFolder?.file(filename, blob);
        return true;
      } catch (error) {
        console.error(`Error processing image ${index}:`, error);
        return false;
      }
    });

    await Promise.all(imagePromises);

    const content = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });

    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    const pageTitle = document.title
      .replace(/[^a-z0-9]/gi, "_")
      .substring(0, 30);
    link.download = `${pageTitle}_images.zip`;
    link.click();
    URL.revokeObjectURL(url);

    return { success: true, count: validImages.length };
  } catch (error) {
    console.error("Error downloading images:", error);
    return { success: false, count: 0 };
  }
}

// Function to download all tables from the page
async function downloadAllTables() {
  try {
    const tables = Array.from(document.querySelectorAll("table"));

    if (tables.length === 0) {
      alert("No tables found on this page.");
      return { success: false, count: 0 };
    }

    let processedCount = 0;

    for (let i = 0; i < tables.length; i++) {
      try {
        const worksheet = XLSX.utils.table_to_sheet(tables[i]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Table ${i + 1}`);

        const pageTitle = document.title
          .replace(/[^a-z0-9]/gi, "_")
          .substring(0, 30);
        const filename = `${pageTitle}_table_${i + 1}.xlsx`;
        XLSX.writeFile(workbook, filename);
        processedCount++;
      } catch (error) {
        console.error(`Error processing table ${i}:`, error);
      }
    }

    return { success: true, count: processedCount };
  } catch (error) {
    console.error("Error downloading tables:", error);
    return { success: false, count: 0 };
  }
}

// Helper function to get file extension from MIME type
function getExtensionFromMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
  };
  return map[mimeType] || "jpg";
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "downloadImages") {
    downloadAllImages().then(sendResponse);
    return true;
  }

  if (request.action === "downloadTables") {
    downloadAllTables().then(sendResponse);
    return true;
  }
});
