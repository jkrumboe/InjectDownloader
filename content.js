if (typeof init === 'undefined') {
    const init = function() {
        console.log("Initializing InjectDownloader...");

        // Extract the course name from the page title
        const pageTitleElement = document.querySelector("h1.page-title");
        const courseName = pageTitleElement ? pageTitleElement.innerText.trim() : "LearnWebCourse";
        console.log("Course name extracted:", courseName);

        // Create a container for the "Download All" button
        const downloadAllContainer = document.createElement('div');
        downloadAllContainer.className = 'injected-download-all';
        downloadAllContainer.innerHTML = `
            <button id="downloadAllButton" class="download-button">Download All</button>
        `;
        console.log("Download All button created.");

        // Insert the "Download All" button after the page title
        if (pageTitleElement) {
            pageTitleElement.insertAdjacentElement('afterend', downloadAllContainer);
            console.log("Download All button inserted after page title.");
        } else {
            document.body.prepend(downloadAllContainer);
            console.log("Download All button inserted at the beginning of the body.");
        }

        // Extract file links from each course section and add a "Download" button to each section
        const files = [];
        document.querySelectorAll(".course-section-header").forEach((section) => {
            const titleElement = section.querySelector("h3 a");
            if (!titleElement) return;
            const sectionTitle = titleElement.innerText.trim();
            const nextElement = section.nextElementSibling;
            if (!nextElement) return;

            // Create a "Download" button for the section
            const downloadButton = document.createElement('button');
            downloadButton.className = 'download-button';
            downloadButton.textContent = 'Download';
            section.appendChild(downloadButton);
            console.log(`Download button added to section: ${sectionTitle}`);

            // Collect files in the section
            const sectionFiles = [];
            nextElement.querySelectorAll('a[href*="mod/resource/view.php?id="]').forEach((link) => {
                sectionFiles.push({
                    url: link.href,
                    filename: link.innerText.trim() + ".pdf",
                    section: sectionTitle,
                });
            });

            // Add section files to the global files list
            files.push(...sectionFiles);
            console.log(`Files collected for section: ${sectionTitle}`, sectionFiles);

            // Add click event to the section's "Download" button
            downloadButton.addEventListener('click', () => {
                console.log(`Download button clicked for section: ${sectionTitle}`);
                chrome.runtime.sendMessage({
                    action: "download_files",
                    courseName: courseName,
                    files: sectionFiles,
                }, (response) => {
                    if (response.success) {
                        console.log("Download initiated for section:", sectionTitle, response);
                    } else {
                        console.error("Failed to initiate download for section:", sectionTitle, response.error);
                    }
                });
            });
        });

        // Add click event to the "Download All" button
        document.getElementById('downloadAllButton').addEventListener('click', () => {
            console.log("Download All button clicked.");
            chrome.runtime.sendMessage({
                action: "download_files",
                courseName: courseName,
                files: files,
            }, (response) => {
                if (response.success) {
                    console.log("Download all initiated:", response);
                } else {
                    console.error("Failed to initiate download all:", response.error);
                }
            });
        });
    };
    init();
}