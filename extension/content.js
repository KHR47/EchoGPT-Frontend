chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_PAGE_CONTEXT") {
    const selection = window.getSelection()?.toString() || "";

    const clone = document.body.cloneNode(true);
    const elementsToRemove = clone.querySelectorAll("script, style, nav, footer, noscript, svg");
    elementsToRemove.forEach((el) => el.remove());

    const fullText = (clone.innerText || "").replace(/\s+/g, " ").trim().slice(0, 12000);

    sendResponse({
      title: document.title,
      url: window.location.href,
      selectionText: selection.trim(),
      pageText: fullText,
    });
  }
  return true;
});
