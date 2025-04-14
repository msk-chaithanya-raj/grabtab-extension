import { Download, ImageIcon, Table, Loader2 } from "lucide-react";
import { useState } from "react";

export default function App() {
  const [isDownloadingImages, setIsDownloadingImages] = useState(false);
  const [isDownloadingTables, setIsDownloadingTables] = useState(false);
  const [stats, setStats] = useState<{ images: number; tables: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleDownloadImages = async () => {
    setIsDownloadingImages(true);
    setError(null);

    try {
      if (typeof chrome === "undefined" || !chrome.tabs) {
        throw new Error("Chrome APIs are not available");
      }

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab.id) {
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: "downloadImages" },
            (response) => {
              if (chrome.runtime.lastError) {
                setError(
                  "Failed to connect to the page. Please refresh and try again."
                );
                setIsDownloadingImages(false);
                return;
              }

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
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsDownloadingImages(false);
    }
  };

  const handleDownloadTables = async () => {
    setIsDownloadingTables(true);
    setError(null);

    try {
      if (typeof chrome === "undefined" || !chrome.tabs) {
        throw new Error("Chrome APIs are not available");
      }

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab.id) {
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: "downloadTables" },
            (response) => {
              if (chrome.runtime.lastError) {
                setError(
                  "Failed to connect to the page. Please refresh and try again."
                );
                setIsDownloadingTables(false);
                return;
              }

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
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsDownloadingTables(false);
    }
  };

  return (
    <div className="w-[350px] bg-gray-50 text-gray-900 rounded-lg overflow-hidden">
      <header className="bg-gradient-to-r from-emerald-600 to-teal-500 p-4 text-white">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Download className="h-5 w-5" />
          Grab N Download
        </h1>
        <p className="text-xs opacity-90 mt-1">
          Download images and tables with one click
        </p>
      </header>

      <main className="p-4">
        <div className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 p-3 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

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
                  <p className="text-xs text-gray-500">
                    Compressed as ZIP file
                  </p>
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
      </main>
    </div>
  );
}
