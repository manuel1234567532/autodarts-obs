let authToken = null;

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    for (const header of details.requestHeaders) {
      if (header.name.toLowerCase() === "authorization" && header.value.startsWith("Bearer ")) {
        authToken = header.value;
        console.log("[Autodarts Plugin] Bearer-Token gefunden:", authToken);
        break;
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["https://api.autodarts.io/*"] },
  ["requestHeaders", "extraHeaders"]
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_TOKEN") {
    sendResponse({ token: authToken });
  }
});
