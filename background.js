browser.action.onClicked.addListener((tab) => {
  // Execute a script in the active tab to grab the entire HTML content
  browser.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.documentElement.outerHTML,
  }).then((results) => {
    if (results && results[0] && results[0].result) {
      const htmlCode = results[0].result;
      
      // Save the captured HTML to local storage temporarily
      browser.storage.local.set({ capturedHtml: htmlCode }).then(() => {
        // Open a new tab with our custom HTML viewer
        browser.tabs.create({ url: browser.runtime.getURL("viewer.html") });
      });
    }
  }).catch((error) => {
    console.error("Failed to capture HTML:", error);
  });
});
