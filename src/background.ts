// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Grab N Download extension installed");

  // Initialize default settings
  chrome.storage.sync.get("settings", (data) => {
    if (!data.settings) {
      chrome.storage.sync.set({
        settings: {
          imageQuality: 90,
          imageFormat: "original",
          includeImageAlt: true,
          tableFormat: "xlsx",
          downloadLocation: "downloads",
        },
      });
    }
  });
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "notify") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon-128.png",
      title: request.title || "Grab N Download",
      message: request.message || "",
    });
    sendResponse({ success: true });
  }

  return true;
});
