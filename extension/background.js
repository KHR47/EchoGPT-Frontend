chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error("Error enabling side panel on action click:", error));

  chrome.contextMenus.create({
    id: "echogpt-summarize",
    title: "EchoGPT: Summarize Selection",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "echogpt-explain",
    title: "EchoGPT: Explain Selection",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "echogpt-rewrite",
    title: "EchoGPT: Rewrite Selection",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "echogpt-page-summary",
    title: "EchoGPT: Summarize Active Webpage",
    contexts: ["page"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  if (chrome.sidePanel && chrome.sidePanel.open) {
    try {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (err) {
      console.warn("Could not open side panel directly:", err);
    }
  }

  const payload = {
    action: info.menuItemId,
    selectionText: info.selectionText || "",
    pageTitle: tab.title || "Webpage",
    pageUrl: tab.url || "",
    timestamp: Date.now(),
  };

  chrome.storage.local.set({ echogpt_active_context: payload });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_ACTIVE_TAB_CONTEXT") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        sendResponse({
          title: tabs[0].title || "Active Webpage",
          url: tabs[0].url || "",
          favIconUrl: tabs[0].favIconUrl || "",
        });
      } else {
        sendResponse({ title: "Webpage", url: "" });
      }
    });
    return true;
  }
});
