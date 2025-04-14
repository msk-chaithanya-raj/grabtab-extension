import { Github, Coffee, Heart } from "lucide-react";

export default function AboutPanel() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">About Grab N Download</h2>

      <div className="text-sm text-gray-600 space-y-3">
        <p>
          Grab N Download is a Chrome extension that allows you to download all
          images and tables from any webpage with just one click.
        </p>

        <div>
          <h3 className="font-medium text-gray-800 mb-1">Features:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Download all images as a compressed ZIP file</li>
            <li>Download all tables as Excel files</li>
            <li>Customize image quality and format</li>
            <li>Choose between Excel and CSV formats for tables</li>
            <li>Fast and optimized performance</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-1">Version:</h3>
          <p>1.0.0</p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <a
            href="https://github.com/yourusername/grab-n-download"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>

          <a
            href="https://www.buymeacoffee.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            <Coffee className="h-4 w-4" />
            Buy me a coffee
          </a>
        </div>

        <div className="pt-2 text-center text-xs text-gray-500">
          Made with <Heart className="h-3 w-3 inline text-red-500" /> by Your
          Name
        </div>
      </div>
    </div>
  );
}
