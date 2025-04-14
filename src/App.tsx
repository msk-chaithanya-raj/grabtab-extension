import { useState } from "react";
import { Download, Settings, Info } from "lucide-react";
import DownloadOptions from "./components/DownloadOptions";
import SettingsPanel from "./components/SettingsPanel";
import AboutPanel from "./components/AboutPanel";

type Tab = "download" | "settings" | "about";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("download");

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
        {activeTab === "download" && <DownloadOptions />}
        {activeTab === "settings" && <SettingsPanel />}
        {activeTab === "about" && <AboutPanel />}
      </main>

      <footer className="border-t border-gray-200 flex justify-around">
        <button
          onClick={() => setActiveTab("download")}
          className={`flex flex-col items-center py-2 px-4 flex-1 ${
            activeTab === "download"
              ? "text-emerald-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Download className="h-5 w-5" />
          <span className="text-xs mt-1">Download</span>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center py-2 px-4 flex-1 ${
            activeTab === "settings"
              ? "text-emerald-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Settings</span>
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`flex flex-col items-center py-2 px-4 flex-1 ${
            activeTab === "about"
              ? "text-emerald-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Info className="h-5 w-5" />
          <span className="text-xs mt-1">About</span>
        </button>
      </footer>
    </div>
  );
}
