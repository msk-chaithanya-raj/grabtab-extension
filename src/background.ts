// src/background.ts
// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "notify") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "favicon.ico",
      title: request.title || "Grab N Download",
      message: request.message || "",
    });
    sendResponse({ success: true });
  }

  return true;
});
