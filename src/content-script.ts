import JSZip from "jszip";
import * as XLSX from "xlsx";

// Function to download all images from the page
async function downloadAllImages() {
  try {
    // Get all image elements on the page
    const images = Array.from(document.querySelectorAll("img"));

    // Filter out tiny images and icons (optional)
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

    // Create a new zip file
    const zip = new JSZip();
    const imgFolder = zip.folder("images");

    // Get settings from storage
    const { settings } = await chrome.storage.sync.get("settings");

    // Load all images into the zip file
    const imagePromises = validImages.map(async (img, index) => {
      try {
        // Get image data
        const response = await fetch(img.src);
        if (!response.ok) throw new Error(`Failed to fetch image: ${img.src}`);

        const blob = await response.blob();

        // Generate filename
        let filename = "";
        if (settings?.includeImageAlt && img.alt) {
          // Use alt text for filename if available
          filename = `${img.alt
            .replace(/[^a-z0-9]/gi, "_")
            .substring(0, 30)}_${index}.${getExtensionFromMimeType(blob.type)}`;
        } else {
          // Use index-based filename
          filename = `image_${String(index).padStart(
            3,
            "0"
          )}.${getExtensionFromMimeType(blob.type)}`;
        }

        // Add to zip
        imgFolder?.file(filename, blob);
        return true;
      } catch (error) {
        console.error(`Error processing image ${index}:`, error);
        return false;
      }
    });

    // Wait for all images to be processed
    await Promise.all(imagePromises);

    // Generate the zip file
    const content = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9,
      },
    });

    // Create a download link and trigger download
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;

    // Get page title for the zip filename
    const pageTitle = document.title
      .replace(/[^a-z0-9]/gi, "_")
      .substring(0, 30);
    link.download = `${pageTitle}_images.zip`;
    link.click();

    // Clean up
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
    // Get all table elements on the page
    const tables = Array.from(document.querySelectorAll("table"));

    if (tables.length === 0) {
      alert("No tables found on this page.");
      return { success: false, count: 0 };
    }

    // Get settings from storage
    const { settings } = await chrome.storage.sync.get("settings");
    const tableFormat = settings?.tableFormat || "xlsx";

    // Process each table
    let processedCount = 0;

    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];

      try {
        // Convert table to worksheet
        const worksheet = XLSX.utils.table_to_sheet(table);

        // Create workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Table ${i + 1}`);

        // Generate filename
        const pageTitle = document.title
          .replace(/[^a-z0-9]/gi, "_")
          .substring(0, 30);
        const filename = `${pageTitle}_table_${i + 1}.${tableFormat}`;

        // Write and download the file
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
    return true; // Indicates async response
  }

  if (request.action === "downloadTables") {
    downloadAllTables().then(sendResponse);
    return true; // Indicates async response
  }
});
