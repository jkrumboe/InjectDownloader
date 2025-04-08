var init 

if (typeof init === "undefined") {
  init = () => {
    console.debug("Initializing InjectDownloader...")

    // Extract the course name from the page title
    const pageTitleElement = document.querySelector("h1.page-title")
    const courseName = pageTitleElement ? pageTitleElement.innerText.trim() : "LearnWebCourse"
    console.debug("Course name extracted:", courseName)

    // Create a container for the "Download All" button at the top
    const downloadAllContainer = document.createElement("div")
    downloadAllContainer.className = "learnweb-downloader-top-button"
    downloadAllContainer.innerHTML = `
              <style>
          /* Main Button Styles */
          .learnweb-downloader-top-button {
            margin: 15px 0;
            text-align: right;
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
          
          .learnweb-downloader-top-button button {
            background-color: #2B6581;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 10px 18px;
            font-size: 14px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .learnweb-downloader-top-button button:hover {
            background-color: #1A3E4F;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            transform: translateY(-1px);
          }
          
          .learnweb-downloader-top-button button:active {
            transform: translateY(0);
          }
          
          /* File Selector Modal */
          .learnweb-downloader-file-selector {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            background-color: #252525;
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
            padding: 24px;
            z-index: 10001;
            width: 90%;
            height: 55vh;
            max-width: 700px;
            max-height: 80vh;
            display: none;
            flex-direction: column;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid #3a3a3a;
          }
          
          .learnweb-downloader-file-selector.active {
            display: flex;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          
          /* Header */
          .learnweb-downloader-file-selector-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #3a3a3a;
          }
          
          .learnweb-downloader-file-selector-title {
            font-weight: 600;
            font-size: 22px;
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .learnweb-downloader-file-selector-title svg {
            width: 20px;
            height: 20px;
          }
          
          .learnweb-downloader-file-selector-close {
            background: none;
            border: none;
            cursor: pointer;
            color: #888;
            padding: 4px;
            font-size: 24px;
            line-height: 1;
            transition: all 0.2s;
            border-radius: 4px;
          }
          
          .learnweb-downloader-file-selector-close:hover {
            color: white;
            background-color: rgba(255,255,255,0.1);
          }
          
          /* Content Area */
          .learnweb-downloader-file-selector-content {
            height: 100%;
            overflow-y: auto;
            max-height: calc(70vh - 180px);
            padding-right: 12px;
            margin-bottom: 20px;
            scrollbar-width: thin;
            scrollbar-color: #3a3a3a #252525;
          }
          
          .learnweb-downloader-file-selector-content::-webkit-scrollbar {
            width: 8px;
          }
          
          .learnweb-downloader-file-selector-content::-webkit-scrollbar-track {
            background: #252525;
            border-radius: 4px;
          }
          
          .learnweb-downloader-file-selector-content::-webkit-scrollbar-thumb {
            background-color: #3a3a3a;
            border-radius: 4px;
          }
          
          /* Sections */
          .learnweb-downloader-file-selector-section {
            margin-bottom: 16px;
            background-color: #2e2e2e;
            border-radius: 10px;
            padding: 0;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #3a3a3a;
          }
          
          .learnweb-downloader-file-selector-section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
            font-weight: 500;
            color: white;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          .learnweb-downloader-file-selector-section-header:hover {
            background-color: rgba(255,255,255,0.05);
          }
          
          .learnweb-downloader-file-selector-section-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 15px;
          }
          
          .learnweb-downloader-file-selector-section-title svg {
            width: 18px;
            height: 18px;
            color: #2B6581;
          }
          
          .learnweb-downloader-file-selector-section-toggle {
            color: #888;
            transition: transform 0.3s ease;
          }
          
          .learnweb-downloader-file-selector-section-header.collapsed .learnweb-downloader-file-selector-section-toggle {
            transform: rotate(-90deg);
          }
          
          .learnweb-downloader-file-selector-section-content {
            max-height: 1000px;
            align-items: center;
            transition: max-height 0.3s ease, opacity 0.2s ease;
            opacity: 1;
          }
          
          .learnweb-downloader-file-selector-section-content.collapsed {
            max-height: 0;
            opacity: 0;
          }

          .learnweb-downloader-file-selector-folder {
            width: 90%;
            margin-left: 5%;
            margin-right: 5%;
            margin-top: 10px;
            margin-bottom: 10px;
            padding: 10px;
            align-items: center;
            background-color:rgb(36, 36, 36);
            border-radius: 8px;
          }

          .learnweb-downloader-file-selector-folder-header {
            display: flex;
            align-items: center;
            background-color:rgb(36, 36, 36);
            justify-content: space-between;
            cursor: pointer;
          }

          .learnweb-downloader-file-selector-folder-header.collapsed {
            background-color: rgba(36, 36, 36);
          }

          .learnweb-downloader-file-selector-folder-content {
            margin-top: 10px;
            padding-left: 20px;
            max-height: 1000px;
            transition: max-height 0.3s ease, opacity 0.2s ease;
            opacity: 1;
          }

          .learnweb-downloader-file-selector-folder-content.collapsed {
            max-height: 0;
            opacity: 0;
          }
          
          /* File Items */
          .learnweb-downloader-file-selector-file {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background-color: rgba(0,0,0,0.1);
            transition: background-color 0.2s;
            border-top: 1px solid #3a3a3a;
          }
          
          .learnweb-downloader-file-selector-file:hover {
            background-color: rgba(255,255,255,0.03);
          }
          
          .learnweb-downloader-file-selector-file:last-child {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }
          
          .learnweb-downloader-file-checkbox {
            appearance: none;
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid #555;
            border-radius: 4px;
            margin-right: 12px;
            cursor: pointer;
            position: relative;
            transition: all 0.2s;
          }
          
          .learnweb-downloader-file-checkbox:checked {
            background-color: #2B6581;
            border-color: #2B6581;
          }
          
          .learnweb-downloader-file-checkbox:checked::after {
            content: "✓";
            position: absolute;
            color: white;
            font-size: 12px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          
          .learnweb-downloader-file-info {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          .learnweb-downloader-file-name {
            color: white;
            font-size: 14px;
            margin-bottom: 4px;
          }
          
          .learnweb-downloader-file-meta {
            color: #888;
            font-size: 12px;
            display: flex;
            gap: 12px;
          }
          
          .learnweb-downloader-file-icon {
            margin-right: 12px;
            color: #888;
          }
          
          /* Footer Actions */
          .learnweb-downloader-file-selector-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 16px;
            border-top: 1px solid #3a3a3a;
            bottom: 0;
          }

          .learnweb-downloader-file-selector-actions-top {
            display: flex;
            flex-direction: row;
            width: auto;
            gap: 8px;
          }
          
          .learnweb-downloader-file-selector-select-all {
            background-color: #2B6581;
            color: white;
            cursor: pointer;
            padding: 8px 16px;
            font-size: 14px;
            border-radius: 6px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .learnweb-downloader-file-selector-select-all:hover {
            background-color: #1A3E4F;
          }
          
          .learnweb-downloader-file-selector-download {
            background-color: #2B6581;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 10px 24px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .learnweb-downloader-file-selector-download:hover {
            background-color: #1A3E4F;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          
          .learnweb-downloader-file-selector-download:disabled {
            background-color: #3a3a3a;
            color: #666;
            cursor: not-allowed;
          }
          
          /* Overlay */
          .learnweb-downloader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.6);
            z-index: 10000;
            display: none;
            backdrop-filter: blur(4px);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .learnweb-downloader-overlay.active {
            display: block;
            opacity: 1;
          }
          
          /* Empty State */
          .learnweb-downloader-empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            color: #666;
            text-align: center;
          }
          
          .learnweb-downloader-empty-state svg {
            width: 48px;
            height: 48px;
            margin-bottom: 16px;
            color: #3a3a3a;
          }
          
          .learnweb-downloader-empty-state p {
            margin: 0;
            font-size: 14px;
          }
          
          /* Responsive Adjustments */
          @media (max-width: 600px) {
            .learnweb-downloader-file-selector {
              width: 95%;
              padding: 16px;
            }
            
            .learnweb-downloader-file-selector-title {
              font-size: 18px;
            }

            .learnweb-downloader-file-selector-actions-top {
              flex-direction: column-reverse;
              gap: 12px;
            }
            
            .learnweb-downloader-file-selector-actions {
              flex-direction: column-reverse;
              gap: 12px;
              bottom: 0;
            }
            
            .learnweb-downloader-file-selector-select-all,
            .learnweb-downloader-file-selector-download {
              width: 100%;
              justify-content: center;
            }
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
      console.debug("Download button inserted after page title.")
    } else {
      document.body.prepend(downloadAllContainer)
      console.debug("Download button inserted at the beginning of the body.")
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
    console.debug("Floating action buttons created.")

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
          filename: link.innerText.trim() + ".pdf",
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
      console.debug(`Files collected for section: ${sectionTitle}`, filesInSection);
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
    
          console.debug(`Files collected from folder: ${folder.folderName}`, folderFiles);
        })
        .catch((error) => {
          console.error(`Failed to fetch folder contents for ${folder.folderName}:`, error);
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
        folderHeader.className = "learnweb-downloader-file-selector-folder-header";

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
        folderContent.className = "learnweb-downloader-file-selector-folder-content";

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

        folderHeader.classList.toggle("collapsed");
        folderContent.classList.toggle("collapsed");

        // Add click event to the folder header to toggle collapse/expand
        folderHeader.addEventListener("click", (event) => {

          if (event.target.type !== "checkbox") {
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

    sectionHeader.classList.toggle("collapsed");
    sectionContent.classList.toggle("collapsed");

    // Add click event to the section header to toggle collapse/expand
    sectionHeader.addEventListener("click", (event) => {

          if (event.target.type !== "checkbox") {
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
              console.debug("Download initiated:", response)
            } else {
              console.error("Failed to initiate download:", response.error)
              alert(`Failed to download: ${response.error}`)
            }
          },
        )
      } else {
        console.error("Chrome runtime is not available.")
        alert("Chrome runtime is not available. Please ensure the extension is properly loaded.")
      }
    }

    // Add click event to the "Download All" button (top)
    document.getElementById("downloadAllTopBtn").addEventListener("click", () => {
      console.debug("Download All button (top) clicked.")
      showFileSelector()
    })

    // Add click event to the "Download All" button (FAB)
    document.getElementById("downloadAllFab").addEventListener("click", () => {
      console.debug("Download All button (FAB) clicked.")
      showFileSelector()
    })

    // Add click event to the "Settings" button
    document.getElementById("downloadSettingsFab").addEventListener("click", () => {
      console.debug("Settings button clicked.")
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
