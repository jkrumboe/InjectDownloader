var init // Declare init at the top

if (typeof init === "undefined") {
  init = () => {
    console.log("Initializing InjectDownloader...")

    // Extract the course name from the page title
    const pageTitleElement = document.querySelector("h1.page-title")
    const courseName = pageTitleElement ? pageTitleElement.innerText.trim() : "LearnWebCourse"
    console.log("Course name extracted:", courseName)

    // Create a container for the "Download All" button at the top
    const downloadAllContainer = document.createElement("div")
    downloadAllContainer.className = "learnweb-downloader-top-button"
    downloadAllContainer.innerHTML = `
            <style>
                .learnweb-downloader-top-button {
                    margin: 15px 0;
                    text-align: right;
                }
                .learnweb-downloader-top-button button {
                    background-color: #2B6581;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 8px 16px;
                    font-size: 14px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: background-color 0.2s;
                }
                .learnweb-downloader-top-button button:hover {
                    background-color: #1A3E4F;
                }
                .learnweb-downloader-fab-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .learnweb-downloader-fab {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background-color: #2B6581;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 3px 5px rgba(0,0,0,0.3);
                    cursor: pointer;
                    transition: all 0.3s;
                    border: none;
                }
                .learnweb-downloader-fab:hover {
                    background-color: #1A3E4F;
                    transform: scale(1.05);
                }
                .learnweb-downloader-fab-tooltip {
                    position: absolute;
                    right: 70px;
                    background-color: #333;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                    white-space: nowrap;
                }
                .learnweb-downloader-fab:hover .learnweb-downloader-fab-tooltip {
                    opacity: 1;
                }
                .learnweb-downloader-section-button {
                    background-color: #2e2e2e;
                    border: 1px solid #444;
                    border-radius: 4px;
                    padding: 5px 10px;
                    font-size: 13px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    margin-left: 10px;
                    transition: all 0.2s;
                }
                .learnweb-downloader-section-button:hover {
                    background-color: #444;
                }
                .learnweb-downloader-section-button svg {
                    margin-right: 5px;
                    width: 16px;
                    height: 16px;
                }
                .learnweb-downloader-progress-toast {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background-color: #1e1e1e;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    padding: 12px 16px;
                    z-index: 10000;
                    max-width: 350px;
                    display: flex;
                    flex-direction: column;
                    transform: translateY(150%);
                    transition: transform 0.3s ease-out;
                }
                .learnweb-downloader-progress-toast.active {
                    transform: translateY(0);
                }
                .learnweb-downloader-progress-toast-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .learnweb-downloader-progress-toast-title {
                    font-weight: 600;
                    font-size: 14px;
                    color: white;
                }
                .learnweb-downloader-progress-toast-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    font-size: 18px;
                    line-height: 1;
                }
                .learnweb-downloader-progress-bar {
                    height: 6px;
                    background-color: #444;
                    border-radius: 3px;
                    margin: 5px 0;
                    overflow: hidden;
                }
                .learnweb-downloader-progress-bar-inner {
                    height: 100%;
                    background-color: #2B6581;
                    width: 0%;
                    transition: width 0.3s;
                }
                .learnweb-downloader-progress-text {
                    font-size: 12px;
                    color: #666;
                    margin-top: 5px;
                }
                .learnweb-downloader-file-checkbox {
                    margin-right: 8px;
                }
                .learnweb-downloader-file-selector {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: #1e1e1e;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    padding: 24px;
                    z-index: 10001;
                    width: 90%;
                    max-width: 650px;
                    max-height: 60vh;
                    display: none;
                    flex-direction: column;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }

                .learnweb-downloader-file-selector.active {
                    display: flex;
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }

                .learnweb-downloader-file-selector-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #444;
                }

                .learnweb-downloader-file-selector-title {
                    font-weight: 600;
                    font-size: 20px;
                    color: white;
                }

                .learnweb-downloader-file-selector-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    font-size: 24px;
                    line-height: 1;
                    transition: color 0.2s;
                }

                .learnweb-downloader-file-selector-close:hover {
                    color: white;
                }

                .learnweb-downloader-file-selector-content {
                    overflow-y: auto;
                    max-height: calc(80vh - 150px);
                    margin-bottom: 20px;
                    padding-right: 8px;
                }

                .learnweb-downloader-file-selector-section {
                    margin-bottom: 20px;
                    background-color: #2e2e2e;
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .learnweb-downloader-file-selector-section-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    font-weight: 500;
                    color: white;
                    cursor: pointer; 
                    justify-content: space-between; 
                }

                .learnweb-downloader-file-selector-section-header .toggle-icon {
                    margin-left: 10px;
                    transition: transform 0.2s ease;
                }

                .learnweb-downloader-file-selector-section-header.collapsed .toggle-icon {
                    transform: rotate(-90deg); /* Rotate the icon when collapsed */
                }

                .learnweb-downloader-file-selector-section-content {
                    margin-top: 10px;
                    overflow: hidden;
                    transition: max-height 0.3s ease, opacity 0.3s ease;
                    max-height: 500px; /* Adjust based on your content */
                    opacity: 1;
                }

                .learnweb-downloader-file-selector-section-content.collapsed {
                    max-height: 0;
                    opacity: 0;
                }

                .learnweb-downloader-file-selector-section-toggle {
                    margin-left: 8px;
                    font-size: 14px;
                    color: #2B6581;
                    cursor: pointer;
                    background: none;
                    border: none;
                    padding: 4px 8px;
                    border-radius: 4px;
                    transition: background-color 0.2s, color 0.2s;
                }

                .learnweb-downloader-file-selector-section-toggle:hover {
                    background-color: #1A3E4F;
                    color: white;
                }

                .learnweb-downloader-file-selector-file {
                    display: flex;
                    align-items: center;
                    padding: 8px 0;
                    margin-left: 20px;
                    border-bottom: 1px solid #444;
                    color: white;
                }

                .learnweb-downloader-file-selector-file:last-child {
                    border-bottom: none;
                }

                .learnweb-downloader-file-checkbox {
                    margin-right: 12px;
                    cursor: pointer;
                }

                .learnweb-downloader-file-selector-actions {
                    display: flex;
                    justify-content: space-between;
                    padding-top: 16px;
                    border-top: 1px solid #444;
                }

                .learnweb-downloader-file-selector-select-all {
                    background: none;
                    border: none;
                    color: white;
                    background-color: #1A3E4F;
                    cursor: pointer;
                    padding: 8px 12px;
                    font-size: 14px;
                    border-radius: 4px;
                    margin-right: 8px;
                    transition: background-color 0.2s, color 0.2s;
                }

                .learnweb-downloader-file-selector-download {
                    background-color: #4199C1;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 10px 20px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.2s;
                }

                .learnweb-downloader-file-selector-download:hover {
                    background-color: #1A3E4F;
                }
                .learnweb-downloader-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0,0,0,0.5);
                    z-index: 10000;
                    display: none;
                }
                .learnweb-downloader-overlay.active {
                    display: block;
                }
                .learnweb-downloader-mini-progress {
                    width: 50px;
                    height: 5px;
                    background-color: #444;
                    border-radius: 2px;
                    overflow: hidden;
                }
                .learnweb-downloader-mini-progress-inner {
                    height: 100%;
                    background-color: #03dac6;
                    width: 0%;
                }
            </style>
            <button id="downloadAllTopBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Select Files to Download
            </button>
        `

    // Insert the "Download All" button after the page title
    if (pageTitleElement) {
      pageTitleElement.insertAdjacentElement("afterend", downloadAllContainer)
      console.log("Download button inserted after page title.")
    } else {
      document.body.prepend(downloadAllContainer)
      console.log("Download button inserted at the beginning of the body.")
    }

    // Create a floating action button container
    const fabContainer = document.createElement("div")
    fabContainer.className = "learnweb-downloader-fab-container"
    fabContainer.innerHTML = `
            <button id="downloadAllFab" class="learnweb-downloader-fab">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span class="learnweb-downloader-fab-tooltip">Select Files</span>
            </button>
            <button id="downloadSettingsFab" class="learnweb-downloader-fab">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span class="learnweb-downloader-fab-tooltip">Download Settings</span>
            </button>
        `
    document.body.appendChild(fabContainer)
    console.log("Floating action buttons created.")

    // Create progress toast (less intrusive than overlay)
    const progressToast = document.createElement("div")
    progressToast.className = "learnweb-downloader-progress-toast"
    progressToast.innerHTML = `
            <div class="learnweb-downloader-progress-toast-header">
                <div class="learnweb-downloader-progress-toast-title">Downloading Files</div>
                <button class="learnweb-downloader-progress-toast-close">&times;</button>
            </div>
            <div class="learnweb-downloader-progress-bar">
                <div class="learnweb-downloader-progress-bar-inner" id="progressBarInner"></div>
            </div>
            <div class="learnweb-downloader-progress-text" id="progressText">Preparing downloads...</div>
        `
    document.body.appendChild(progressToast)

    // Create file selector modal
    const fileSelector = document.createElement("div")
    fileSelector.className = "learnweb-downloader-file-selector"
    fileSelector.innerHTML = `
        <div class="learnweb-downloader-file-selector-header">
          <div class="learnweb-downloader-file-selector-title">Select Files to Download</div>
          <div class="learnweb-downloader-file-selector-actions">
            <button class="learnweb-downloader-file-selector-select-all" id="selectAllFiles">Select All</button>
            <button class="learnweb-downloader-file-selector-select-all" id="deselectAllFiles">Deselect All</button>
          </div>
          <button class="learnweb-downloader-file-selector-close">&times;</button>
        </div>
        <div class="learnweb-downloader-file-selector-content" id="fileSelectorContent">
          <!-- Sections and files will be populated here -->
        </div>
        <div class="learnweb-downloader-file-selector-actions">
          <button class="learnweb-downloader-file-selector-download" id="downloadSelectedFiles">Download Selected</button>
        </div>
      `
    document.body.appendChild(fileSelector)

    // Create background overlay
    const overlay = document.createElement("div")
    overlay.className = "learnweb-downloader-overlay"
    document.body.appendChild(overlay)

    // Extract file links from each course section and add a "Download" button to each section
    const allFiles = []
    const sectionFiles = {}
    document.querySelectorAll(".course-section-header").forEach((section) => {
      const titleElement = section.querySelector("h3 a")
      if (!titleElement) return
      const sectionTitle = titleElement.innerText.trim()
      const nextElement = section.nextElementSibling
      if (!nextElement) return

      // Create a "Download" button for the section with icon
      const downloadButton = document.createElement("button")
      downloadButton.className = "learnweb-downloader-section-button"
      downloadButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Select Files
            `

      // Find a better place to insert the button (next to the section title)
      const sectionTitleContainer = section.querySelector("h3")
      if (sectionTitleContainer) {
        // Make sure the section title container is properly styled for the button
        sectionTitleContainer.style.display = "flex"
        sectionTitleContainer.style.alignItems = "center"
        sectionTitleContainer.style.justifyContent = "space-between"
        sectionTitleContainer.appendChild(downloadButton)
      } else {
        // Fallback to appending to the section header
        section.appendChild(downloadButton)
      }

      console.log(`Download button added to section: ${sectionTitle}`)

      // Collect files in the section
      const filesInSection = []
      nextElement.querySelectorAll('a[href*="mod/resource/view.php?id="]').forEach((link) => {
        const file = {
          url: link.href,
          filename: link.innerText.trim() + ".pdf",
          section: sectionTitle,
          element: link,
        }
        filesInSection.push(file)
        allFiles.push(file)
      })

      sectionFiles[sectionTitle] = filesInSection
      console.log(`Files collected for section: ${sectionTitle}`, filesInSection)

      // Add click event to the section's "Download" button
      downloadButton.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log(`Download button clicked for section: ${sectionTitle}`)

        // Show file selector with only this section's files
        showFileSelector([sectionTitle])
      })
    })

    // Function to show file selector with specified sections (or all if not specified)
    function showFileSelector(sectionsToShow = null) {
      const fileSelectorContent = document.getElementById("fileSelectorContent");
      fileSelectorContent.innerHTML = "";
  
      const sections = sectionsToShow || Object.keys(sectionFiles);
  
      sections.forEach((sectionTitle) => {
          const files = sectionFiles[sectionTitle];
          if (!files || files.length === 0) return;
  
          const sectionElement = document.createElement("div");
          sectionElement.className = "learnweb-downloader-file-selector-section";
  
          const sectionHeader = document.createElement("div");
          sectionHeader.className = "learnweb-downloader-file-selector-section-header";
  
          const sectionCheckbox = document.createElement("input");
          sectionCheckbox.type = "checkbox";
          sectionCheckbox.className = "learnweb-downloader-file-checkbox";
          sectionCheckbox.dataset.section = sectionTitle;
  
          const sectionLabel = document.createElement("span");
          sectionLabel.textContent = sectionTitle;
  
          const toggleIcon = document.createElement("span");
          toggleIcon.className = "toggle-icon";
          toggleIcon.innerHTML = "&#9660;"; // Down arrow icon
  
          const selectAllButton = document.createElement("button");
          selectAllButton.className = "learnweb-downloader-file-selector-section-toggle";
          selectAllButton.textContent = "Select All";
          selectAllButton.addEventListener("click", () => {
              const checkboxes = sectionElement.querySelectorAll('input[type="checkbox"]');
              checkboxes.forEach((cb) => (cb.checked = true));
          });
  
          const deselectAllButton = document.createElement("button");
          deselectAllButton.className = "learnweb-downloader-file-selector-section-toggle";
          deselectAllButton.textContent = "Deselect All";
          deselectAllButton.addEventListener("click", () => {
              const checkboxes = sectionElement.querySelectorAll('input[type="checkbox"]');
              checkboxes.forEach((cb) => (cb.checked = false));
          });
  
          sectionHeader.appendChild(sectionCheckbox);
          sectionHeader.appendChild(sectionLabel);
          sectionHeader.appendChild(toggleIcon);
          sectionHeader.appendChild(selectAllButton);
          sectionHeader.appendChild(deselectAllButton);
          sectionElement.appendChild(sectionHeader);
  
          // Add event listener to section checkbox to toggle all files in the section
          sectionCheckbox.addEventListener("change", () => {
              const fileCheckboxes = sectionElement.querySelectorAll(
                  '.learnweb-downloader-file-selector-file input[type="checkbox"]',
              );
              fileCheckboxes.forEach((checkbox) => {
                  checkbox.checked = sectionCheckbox.checked;
              });
          });
  
          // Create a container for the files in this section
          const sectionContent = document.createElement("div");
          sectionContent.className = "learnweb-downloader-file-selector-section-content";
  
          // Add files
          files.forEach((file) => {
              const fileElement = document.createElement("div");
              fileElement.className = "learnweb-downloader-file-selector-file";
  
              const fileCheckbox = document.createElement("input");
              fileCheckbox.type = "checkbox";
              fileCheckbox.className = "learnweb-downloader-file-checkbox";
              fileCheckbox.dataset.url = file.url;
              fileCheckbox.dataset.filename = file.filename;
              fileCheckbox.dataset.section = file.section;
              fileCheckbox.checked = true; // Default to checked
  
              const fileLabel = document.createElement("span");
              fileLabel.textContent = file.filename;
  
              fileElement.appendChild(fileCheckbox);
              fileElement.appendChild(fileLabel);
              sectionContent.appendChild(fileElement);
  
              // Add event listener to update section checkbox state
              fileCheckbox.addEventListener("change", () => {
                  const fileCheckboxes = sectionElement.querySelectorAll(
                      '.learnweb-downloader-file-selector-file input[type="checkbox"]',
                  );
                  const allChecked = Array.from(fileCheckboxes).every((cb) => cb.checked);
                  const someChecked = Array.from(fileCheckboxes).some((cb) => cb.checked);
  
                  sectionCheckbox.checked = someChecked;
                  sectionCheckbox.indeterminate = someChecked && !allChecked;
              });
          });
  
          sectionElement.appendChild(sectionContent);
          fileSelectorContent.appendChild(sectionElement);
  
          // Add click event to the section header to toggle collapse/expand
          sectionHeader.addEventListener("click", () => {
              sectionHeader.classList.toggle("collapsed");
              sectionContent.classList.toggle("collapsed");
          });
      });
  
      // Show the file selector and overlay
      fileSelector.classList.add("active");
      overlay.classList.add("active");
  }

    // Function to close file selector
    function closeFileSelector() {
      fileSelector.classList.remove("active")
      overlay.classList.remove("active")
    }

    // Function to get selected files
    function getSelectedFiles() {
      const selectedFiles = []
      const fileCheckboxes = document.querySelectorAll(
        '.learnweb-downloader-file-selector-file input[type="checkbox"]:checked',
      )

      fileCheckboxes.forEach((checkbox) => {
        selectedFiles.push({
          url: checkbox.dataset.url,
          filename: checkbox.dataset.filename,
          section: checkbox.dataset.section,
        })
      })

      return selectedFiles
    }

    // Function to download selected files
    function downloadSelectedFiles() {
      const selectedFiles = getSelectedFiles()

      if (selectedFiles.length === 0) {
        alert("Please select at least one file to download.")
        return
      }

      closeFileSelector()
      startDownload(selectedFiles)
    }

    // Function to start download process
    function startDownload(files) {
      // Show progress toast
      progressToast.classList.add("active")

      // Ensure chrome is defined
      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage(
          {
            action: "download_files",
            courseName: courseName,
            files: files,
          },
          (response) => {
            if (response.success) {
              console.log("Download initiated:", response)
            } else {
              console.error("Failed to initiate download:", response.error)
              progressToast.classList.remove("active")
              alert(`Failed to download: ${response.error}`)
            }
          },
        )
      } else {
        console.error("Chrome runtime is not available.")
        progressToast.classList.remove("active")
        alert("Chrome runtime is not available. Please ensure the extension is properly loaded.")
      }
    }

    // Add click event to the "Download All" button (top)
    document.getElementById("downloadAllTopBtn").addEventListener("click", () => {
      console.log("Download All button (top) clicked.")
      showFileSelector()
    })

    // Add click event to the "Download All" button (FAB)
    document.getElementById("downloadAllFab").addEventListener("click", () => {
      console.log("Download All button (FAB) clicked.")
      showFileSelector()
    })

    // Add click event to the "Settings" button
    document.getElementById("downloadSettingsFab").addEventListener("click", () => {
      console.log("Settings button clicked.")
      // Ensure chrome is defined
      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage({
          action: "open_settings",
        })
      } else {
        console.error("Chrome runtime is not available.")
        alert("Chrome runtime is not available. Please ensure the extension is properly loaded.")
      }
    })

    // Add click event to close the file selector
    document.querySelector(".learnweb-downloader-file-selector-close").addEventListener("click", closeFileSelector)

    // Add click event to close the progress toast
    document.querySelector(".learnweb-downloader-progress-toast-close").addEventListener("click", () => {
      progressToast.classList.remove("active")
    })

    // Add click event to the overlay to close the file selector
    overlay.addEventListener("click", closeFileSelector)

    // Add click event to the "Select All" button
    document.getElementById("selectAllFiles").addEventListener("click", () => {
      const checkboxes = document.querySelectorAll(".learnweb-downloader-file-checkbox")
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true
        checkbox.indeterminate = false
      })
    })

    // Add click event to the "Deselect All" button
    document.getElementById("deselectAllFiles").addEventListener("click", () => {
      const checkboxes = document.querySelectorAll(".learnweb-downloader-file-checkbox")
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false
        checkbox.indeterminate = false
      })
    })

    // Add click event to the "Download Selected" button
    document.getElementById("downloadSelectedFiles").addEventListener("click", downloadSelectedFiles)

    // Listen for download progress updates
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "download_progress") {
          const progressBarInner = document.getElementById("progressBarInner")
          const progressText = document.getElementById("progressText")

          progressBarInner.style.width = `${message.percentage}%`
          progressText.textContent = `Downloading: ${message.currentFile} (${message.completed}/${message.total})`

          if (message.status === "complete" && message.completed === message.total) {
            progressText.textContent = `Completed: ${message.total} files downloaded`
            setTimeout(() => {
              progressToast.classList.remove("active")
            }, 3000)
          }
        } else if (message.action === "file_progress") {
          // We don't need to update individual file progress in the toast
        } else if (message.action === "trigger_download_all") {
          // Trigger file selector from popup
          showFileSelector()
        }
        return true
      })
    }
  }
  init()
}
