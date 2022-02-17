// Initialize button with user's preferred color
let increaseFontButton = document.querySelector(".font__button-increase");
let decreaseFontButton = document.querySelector(".font__button-decrease");

// chrome.storage.sync.get("color", ({ color }) => {
//   increaseFontButton.style.backgroundColor = color;
// });

// When the button is clicked, inject setPageBackgroundColor into current page
increaseFontButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: increaseFont,
  });
});
decreaseFontButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: decreaseFont,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function increaseFont() {
  chrome.storage.sync.get("fontSize", ({ fontSize: currentFontSize }) => {
    document.querySelector(".inline-subs").style.fontSize = currentFontSize + 2 + "px";
    chrome.storage.sync.set({ fontSize: currentFontSize + 2 });
  });
}
function decreaseFont() {
  chrome.storage.sync.get("fontSize", ({ fontSize: currentFontSize }) => {
    document.querySelector(".inline-subs").style.fontSize = currentFontSize - 2 + "px";
    chrome.storage.sync.set({ fontSize: currentFontSize - 2 });
  });
}
