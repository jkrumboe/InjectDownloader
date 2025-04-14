var init 

if (typeof init === "undefined") {
  init = () => {
    //console.debug("Initializing InjectDownloader...")

    // Extract the course name from the page title
    const pageTitleElement = document.querySelector("span.page-title")
    const courseName = pageTitleElement ? pageTitleElement.innerText.trim() : "LearnWebCourse"
    //console.debug("Course name extracted:", courseName)

    // Adjust the padding of the parent div to make it smaller
    const parentDiv = pageTitleElement ? pageTitleElement.parentElement : null
    if (parentDiv) {
      parentDiv.style.padding = "10px" // Set the desired padding value
      //console.debug("Parent div padding adjusted to 10px.")
    }

    // Inject the external CSS file
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = chrome.runtime.getURL("content.css"); // Adjust the path if needed
    // document.head.appendChild(styleLink);

    // Create a container for the "Download All" button at the top
    const downloadAllContainer = document.createElement("div")
    downloadAllContainer.className = "learnweb-downloader-top-button"
    downloadAllContainer.innerHTML = `
              
        <button id="downloadAllTopBtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Open Downloader
        </button>
      `

    // Insert the "Download All" button after the page title
    if (pageTitleElement) {
      pageTitleElement.insertAdjacentElement("afterend", downloadAllContainer)
      //console.debug("Download button inserted after page title.")
    } else {
      document.body.prepend(downloadAllContainer)
      //console.debug("Download button inserted at the beginning of the body.")
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
    //console.debug("Floating action buttons created.")

    // Create file selector modal
    const fileSelector = document.createElement("div")
    fileSelector.className = "learnweb-downloader-file-selector"
    fileSelector.innerHTML = `
        <div class="learnweb-downloader-file-selector-header">
          <div class="learnweb-downloader-file-selector-title">Select Files to Download</div>
          <div class="learnweb-downloader-file-selector-actions-top">
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
      const titleElement = section.querySelector("h3 a");
      if (!titleElement) return;
      const sectionTitle = titleElement.innerText.trim();
      const nextElement = section.nextElementSibling;
      if (!nextElement) return;
    
      const filesInSection = [];
      // Handle normal file links
      nextElement.querySelectorAll('a[href*="mod/resource/view.php?id="]').forEach((link) => {     
        const file = {
          url: link.href,
          filename: link.innerText.trim(),
          section: sectionTitle,
          element: link,
        };
        filesInSection.push(file);
        allFiles.push(file);
      });
    
      // Handle folder links
      nextElement.querySelectorAll('a[href*="mod/folder/view.php?id="]').forEach((link) => {
        const folder = {
          url: link.href,
          folderName: link.innerText.trim(),
          section: sectionTitle,
          element: link,
        };
        fetchFolderContents(folder, filesInSection); // Fetch folder contents
      });
    
      sectionFiles[sectionTitle] = filesInSection;
      //console.debug(`Files collected for section: ${sectionTitle}`, filesInSection);
    });

    // Function to fetch folder contents
    function fetchFolderContents(folder, filesInSection) {
      fetch(folder.url)
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
    
          // Extract file links from the folder page
          const folderFiles = [];
          doc.querySelectorAll('a[href*="pluginfile.php"]').forEach((link) => {
            const file = {
              url: link.href,
              filename: link.innerText.trim(),
              section: folder.section,
              folder: folder.folderName, // Group under folder name
            };
            folderFiles.push(file);
            allFiles.push(file);
          });
    
          // Add folder files as a subsection
          filesInSection.push({
            folderName: folder.folderName,
            files: folderFiles,
          });
    
          //console.debug(`Files collected from folder: ${folder.folderName}`, folderFiles);
        })
        .catch((error) => {
          //console.error(`Failed to fetch folder contents for ${folder.folderName}:`, error);
        });
    }

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
      toggleIcon.innerHTML = "&#9660;";

      sectionCheckbox.checked = true;
      sectionHeader.appendChild(sectionCheckbox);
      sectionHeader.appendChild(sectionLabel);
      sectionHeader.appendChild(toggleIcon);
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

      // Add files and folders
      files.forEach((item) => {
        if (item.folderName) {
          // Render folder as a subsection
          const folderElement = document.createElement("div");
          folderElement.className = "learnweb-downloader-file-selector-folder";

          const folderHeader = document.createElement("div");
          folderHeader.className = "learnweb-downloader-file-selector-folder-header collapsed"; // Start collapsed

          const folderCheckbox = document.createElement("input");
          folderCheckbox.type = "checkbox";
          folderCheckbox.className = "learnweb-downloader-file-checkbox";
          folderCheckbox.dataset.folder = item.folderName;

          const folderLabel = document.createElement("span");
          folderLabel.textContent = item.folderName;

          const folderToggleIcon = document.createElement("span");
          folderToggleIcon.className = "toggle-icon";
          folderToggleIcon.innerHTML = "&#9660;";

          folderCheckbox.checked = true;
          folderHeader.appendChild(folderCheckbox);
          folderHeader.appendChild(folderLabel);
          folderHeader.appendChild(folderToggleIcon);
          folderElement.appendChild(folderHeader);

          // Add event listener to folder checkbox to toggle all files in the folder
          folderCheckbox.addEventListener("change", () => {
            const fileCheckboxes = folderElement.querySelectorAll(
              '.learnweb-downloader-file-selector-file input[type="checkbox"]',
            );
            fileCheckboxes.forEach((checkbox) => {
              checkbox.checked = folderCheckbox.checked;
            });
          });

          // Create a container for the files in this folder
          const folderContent = document.createElement("div");
          folderContent.className = "learnweb-downloader-file-selector-folder-content collapsed"; // Start collapsed

          // Add files to the folder content
          item.files.forEach((file) => {
            const fileElement = document.createElement("div");
            fileElement.className = "learnweb-downloader-file-selector-file";

            const fileCheckbox = document.createElement("input");
            fileCheckbox.type = "checkbox";
            fileCheckbox.className = "learnweb-downloader-file-checkbox";
            fileCheckbox.dataset.url = file.url;
            fileCheckbox.dataset.filename = file.filename;
            fileCheckbox.dataset.section = file.section;
            fileCheckbox.dataset.folder = file.folder || ""; // Include folder info if available
            fileCheckbox.checked = true;

            const fileLabel = document.createElement("span");
            fileLabel.textContent = file.filename;

            fileElement.appendChild(fileCheckbox);
            fileElement.appendChild(fileLabel);
            folderContent.appendChild(fileElement);

            // Add event listener to update folder checkbox state
            fileCheckbox.addEventListener("change", () => {
              const fileCheckboxes = folderContent.querySelectorAll(
                '.learnweb-downloader-file-selector-file input[type="checkbox"]',
              );
              const allChecked = Array.from(fileCheckboxes).every((cb) => cb.checked);
              const someChecked = Array.from(fileCheckboxes).some((cb) => cb.checked);

              folderCheckbox.checked = someChecked;
              folderCheckbox.indeterminate = someChecked && !allChecked;
            });
          });

          folderElement.appendChild(folderContent);
          sectionContent.appendChild(folderElement);

          // Add click event to the folder header to toggle collapse/expand
          folderHeader.addEventListener("click", (event) => {
            if (event.target.type !== "checkbox") {
              // Only toggle the clicked folder, not affecting others
              event.stopPropagation(); // Prevent event bubbling
              folderHeader.classList.toggle("collapsed");
              folderContent.classList.toggle("collapsed");
            }
          });
        } else {
          // Render individual files
          const fileElement = document.createElement("div");
          fileElement.className = "learnweb-downloader-file-selector-file";

          const fileCheckbox = document.createElement("input");
          fileCheckbox.type = "checkbox";
          fileCheckbox.className = "learnweb-downloader-file-checkbox";
          fileCheckbox.dataset.url = item.url;
          fileCheckbox.dataset.filename = item.filename;
          fileCheckbox.dataset.section = item.section;
          fileCheckbox.checked = true;

          const fileLabel = document.createElement("span");
          fileLabel.textContent = item.filename;

          fileElement.appendChild(fileCheckbox);
          fileElement.appendChild(fileLabel);
          sectionContent.appendChild(fileElement);
        }
      });

      sectionElement.appendChild(sectionContent);
      fileSelectorContent.appendChild(sectionElement);

      // Set sections to start expanded (unlike folders)
      // Add click event to the section header to toggle collapse/expand
      sectionHeader.addEventListener("click", (event) => {
        if (event.target.type !== "checkbox") {
          event.stopPropagation(); // Prevent event bubbling
          sectionHeader.classList.toggle("collapsed");
          sectionContent.classList.toggle("collapsed");
        }
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
      const selectedFiles = [];
      const fileCheckboxes = document.querySelectorAll(
        '.learnweb-downloader-file-selector-file input[type="checkbox"]:checked',
      );
    
      fileCheckboxes.forEach((checkbox) => {
        selectedFiles.push({
          url: checkbox.dataset.url,
          filename: checkbox.dataset.filename,
          section: checkbox.dataset.section,
          folder: checkbox.dataset.folder || null, // Include folder info if available
        });
      });
    
      return selectedFiles;
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
              //console.debug("Download initiated:", response)
            } else {
              //console.error("Failed to initiate download:", response.error)
              alert(`Failed to download: ${response.error}`)
            }
          },
        )
      } else {
        //console.error("Chrome runtime is not available.")
        alert("Chrome runtime is not available. Please ensure the extension is properly loaded.")
      }
    }    

    // Add click event to the "Download All" button (top)
    document.getElementById("downloadAllTopBtn").addEventListener("click", () => {
      //console.debug("Download All button (top) clicked.")
      showFileSelector()
    })

    // Add click event to the "Download All" button (FAB)
    document.getElementById("downloadAllFab").addEventListener("click", () => {
      //console.debug("Download All button (FAB) clicked.")
      showFileSelector()
    })

    // Add click event to the "Settings" button
    document.getElementById("downloadSettingsFab").addEventListener("click", () => {
      //console.debug("Settings button clicked.")
      // Ensure chrome is defined
      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage({
          action: "open_settings",
        })
      } else {
        //console.error("Chrome runtime is not available.")
        alert("Chrome runtime is not available. Please ensure the extension is properly loaded.")
      }
    })

    // Add click event to close the file selector
    document.querySelector(".learnweb-downloader-file-selector-close").addEventListener("click", closeFileSelector)

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
  }
  init()
}
