setTimeout(function () {
  // Your code here...
  //do what you need here
  chrome.storage.sync.set({ fontSize: 22 });
  document.querySelector(".transcript").click();
  const captionWrapper = document.createElement("div");
  captionWrapper.classList.add("caption_wrapper");
  document.querySelector(".info").insertAdjacentElement("beforeend", captionWrapper);
  document.querySelector(".caption_wrapper").innerHTML = `
    <div style="width: 100vw; bottom: 50px; display: flex; flex-flow: row; justify-content: center; background-color: rgba(255,0,0,0); z-index: 3; position: fixed"">
                  <div
                    class="inline-subs"
                    style="background-color: rgba(8, 8, 8, 0.75); font-size: 22px; display: flex; flex-flow: row; justify-content: center; color: rgb(255, 255, 255); padding: 0.25rem; border-radius: 0.25rem"
                  >Welcome to Echo360 Closed Captions by Yi Hein Builds
                  </div>
                </div>
    `;

  function turnOptionOff(option) {
    document.querySelector(".Nav").style.display = `${option ? "none" : "flex"}`;
    document.querySelector(".transcript-panel").style.display = `${option ? "none" : "flex"}`;
    document.querySelector(".institutionInfo").style.display = `${option ? "none" : "flex"}`;
    document.querySelector(".echo-logo").style.display = `${option ? "none" : "flex"}`;
    document.querySelector(".courseName").style.display = `${option ? "none" : "flex"}`;
    document.querySelector(".sidebar").style.flex = `${option ? "0 0" : "0 0 30vw"}`;
    document.querySelector(".transcript-panel").style.width = `${option ? "0" : "30vw"}`;
  }

  function updateSubtitle() {
    chrome.storage.sync.get("fontSize", ({ fontSize }) => {
      const width = document.querySelector(".screens").getBoundingClientRect().width;
      document.querySelector(".caption_wrapper").innerHTML = `
                    <div style="width: ${width}px; bottom: 50px; display: flex; flex-flow: row; justify-content: center; background-color: rgba(255,0,0,0); z-index: 3; position: fixed">
                      <div
                        class="inline-subs"
                        draggable="true"
                        style="background-color: rgba(8, 8, 8, 0.75); font-size: ${fontSize}px; display: flex; flex-flow: row; justify-content: center; color: rgb(255, 255, 255); padding: 0.25rem 0.5rem 0.25rem 0.5rem; border-radius: 0.25rem"
                      >
                      </div>
                    </div>
                    `;
      if (!document.querySelector(".highlight")?.textContent) return;
      const text = document.querySelector(".highlight").textContent;
      document.querySelector(".inline-subs").textContent = text;
    });
  }
  try {
    const observer = new MutationObserver(updateSubtitle);
    observer.observe(document.querySelector(".transcript-cues"), {
      attributes: true,
      childList: true,
      subtree: true,
    });
    turnOptionOff(true);
    document.querySelector(".sidebar").style.flex = "0 0";
    document.querySelector(".close-btn").remove();
    document.querySelector(".class-date").innerHTML += `
    <button class="more_options" style=" background-color: #000f19; color: #00aee4; font-weight:900; font: inherit; border: none;border-radius: 0.25rem; font-size: 13px; position: relative;">More Options</button>
`;
    document.querySelector(".more_options").onclick = (e) => {
      if (document.querySelector(".more_options").textContent === "More Options") {
        turnOptionOff(false);
        document.querySelector(".more_options").textContent = "Hide Options";
      } else {
        turnOptionOff(true);
        document.querySelector(".more_options").textContent = "More Options";
      }
    };

    // Enable drag and drop
    function dragstart_handler(ev) {
      // Add the target element's id to the data transfer object
      ev.dataTransfer.setData("text/plain", ev.target.id);
      ev.dataTransfer.dropEffect = "move";
    }
    const dragableElement = document.querySelector(".inline-subs");
    // Add the ondragstart event listener
    dragableElement.addEventListener("dragstart", dragstart_handler);

    // enable transcript panel
    const openTranscriptButton = document.querySelector(".actions");
    function showTranscript() {
      document.querySelector(".transcript-panel").style = "";
      document.querySelector(".sidebar").style.flex = "0 0 30vw";
      document.querySelector(".transcript-panel").style.width = "30vw";
      openTranscriptButton.innerHTML = `
      <button class="close_transcript" style="background-color: #00aee4; color: #000f19; font: inherit; border: none;border-radius: 0.25rem; font-size: 13px">Hide Transcripot</button>
      `;
      document.querySelector(".close_transcript").onclick = hideTranscript;
    }
    function hideTranscript() {
      document.querySelector(".transcript-panel").style.display = "none";
      document.querySelector(".sidebar").style.flex = "0 0";
      openTranscriptButton.innerHTML = `
        <button class="open_transcript" style="background-color: #00aee4; color: #000f19; font: inherit; border: none; border-radius: 0.25rem; font-size: 13px">Show Transcript</button>
        `;
      document.querySelector(".open_transcript").onclick = showTranscript;
    }

    openTranscriptButton.innerHTML = `
      <button class="open_transcript" style="background-color: #00aee4; color: #000f19; font: inherit; border: none; border-radius: 0.25rem; font-size: 13px">Show Transcript</button>
      `;
    document.querySelector(".open_transcript").onclick = showTranscript;
  } catch (error) {
    console.error(error);
    document.querySelector(
      ".caption_wrapper"
    ).innerHTML = `<div class="inline-subs" style="width: 100vw; background-color: white; bottom: 50px; font-size: 22px; display: flex; flex-flow: row; justify-content: center; background-color: rgba(255,0,0,0); z-index: 3; position: fixed; color: red;"><p>ERROR: Refresh the page, open transcript panel, paste the code again<p></div>`;
  }
}, 2000);
