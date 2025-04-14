import { useState, useEffect } from "react";
import { Save } from "lucide-react";

type Settings = {
  imageQuality: number;
  imageFormat: "original" | "jpg" | "png";
  includeImageAlt: boolean;
  tableFormat: "xlsx" | "csv";
  downloadLocation: string;
};

type imageFormat = "original" | "jpg" | "png";
type tableFormat = "xlsx" | "csv";

const defaultSettings: Settings = {
  imageQuality: 90,
  imageFormat: "original",
  includeImageAlt: true,
  tableFormat: "xlsx",
  downloadLocation: "downloads",
};

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load settings from chrome.storage
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get("settings", (data) => {
        if (data.settings) {
          setSettings(data.settings);
        }
      });
    }
  }, []);

  const handleSaveSettings = () => {
    // Save settings to chrome.storage
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.set({ settings }, () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Image Quality
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="10"
              max="100"
              value={settings.imageQuality}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  imageQuality: Number.parseInt(e.target.value),
                })
              }
              className="w-full"
            />
            <span className="text-sm">{settings.imageQuality}%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image Format</label>
          <select
            value={settings.imageFormat}
            onChange={(e) =>
              setSettings({
                ...settings,
                imageFormat: e.target.value as imageFormat,
              })
            }
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="original">Original Format</option>
            <option value="jpg">Convert to JPG</option>
            <option value="png">Convert to PNG</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="includeImageAlt"
            checked={settings.includeImageAlt}
            onChange={(e) =>
              setSettings({ ...settings, includeImageAlt: e.target.checked })
            }
            className="rounded text-emerald-600"
          />
          <label htmlFor="includeImageAlt" className="text-sm">
            Include image alt text in filenames
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Table Format</label>
          <select
            value={settings.tableFormat}
            onChange={(e) =>
              setSettings({
                ...settings,
                tableFormat: e.target.value as tableFormat,
              })
            }
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Download Location
          </label>
          <input
            type="text"
            value={settings.downloadLocation}
            onChange={(e) =>
              setSettings({ ...settings, downloadLocation: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="downloads/grab-n-download"
          />
        </div>

        <button
          onClick={handleSaveSettings}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          <Save className="h-4 w-4" />
          Save Settings
          {isSaved && (
            <span className="text-xs bg-white text-emerald-600 px-2 py-0.5 rounded-full">
              Saved!
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
