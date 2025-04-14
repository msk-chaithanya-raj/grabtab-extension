import { useState } from "react";
import { ImageIcon, Table, Download, Loader2 } from "lucide-react";

export default function DownloadOptions() {
  const [isDownloadingImages, setIsDownloadingImages] = useState(false);
  const [isDownloadingTables, setIsDownloadingTables] = useState(false);
  const [stats, setStats] = useState<{ images: number; tables: number } | null>(
    null
  );

  const handleDownloadImages = async () => {
    setIsDownloadingImages(true);

    try {
      // Send message to content script to get all images
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab.id) {
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: "downloadImages" },
            (response) => {
              if (response && response.success) {
                setStats((prev) => ({
                  images: response.count,
                  tables: prev?.tables ?? 0,
                }));
              }
              setIsDownloadingImages(false);
            }
          );
        }
      });
    } catch (error) {
      console.error("Error downloading images:", error);
      setIsDownloadingImages(false);
    }
  };

  const handleDownloadTables = async () => {
    setIsDownloadingTables(true);

    try {
      // Send message to content script to get all tables
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab.id) {
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: "downloadTables" },
            (response) => {
              if (response && response.success) {
                setStats((prev) => ({
                  tables: response.count,
                  images: prev?.images ?? 0,
                }));
              }
              setIsDownloadingTables(false);
            }
          );
        }
      });
    } catch (error) {
      console.error("Error downloading tables:", error);
      setIsDownloadingTables(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Select what you want to download from the current page:
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={handleDownloadImages}
          disabled={isDownloadingImages}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-70"
        >
          <div className="flex items-center">
            <div className="bg-emerald-100 p-2 rounded-lg mr-3">
              <ImageIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium">Download All Images</h3>
              <p className="text-xs text-gray-500">Compressed as ZIP file</p>
            </div>
          </div>
          {isDownloadingImages ? (
            <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
          ) : (
            <Download className="h-5 w-5 text-emerald-600" />
          )}
        </button>

        <button
          onClick={handleDownloadTables}
          disabled={isDownloadingTables}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-70"
        >
          <div className="flex items-center">
            <div className="bg-emerald-100 p-2 rounded-lg mr-3">
              <Table className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium">Download All Tables</h3>
              <p className="text-xs text-gray-500">Saved as Excel files</p>
            </div>
          </div>
          {isDownloadingTables ? (
            <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
          ) : (
            <Download className="h-5 w-5 text-emerald-600" />
          )}
        </button>
      </div>

      {stats && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
          <div className="font-medium mb-1">Download Summary:</div>
          {stats.images !== undefined && (
            <div className="flex items-center gap-1">
              <ImageIcon className="h-4 w-4 text-emerald-600" />
              <span>{stats.images} images downloaded</span>
            </div>
          )}
          {stats.tables !== undefined && (
            <div className="flex items-center gap-1">
              <Table className="h-4 w-4 text-emerald-600" />
              <span>{stats.tables} tables downloaded</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
