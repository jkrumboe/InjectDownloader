if(typeof init === 'undefined') {
    const init = function() {
        const injectElement = document.createElement('div');
        injectElement.className = 'injected-Download-Section';
        injectElement.innerHTML = `
            <div class="download-section">
                <button class="download-button">Download</button>
            </div>
        `;

        const pageTitleElement = document.querySelector('h1.page-title');
        if (pageTitleElement) {
            pageTitleElement.insertAdjacentElement('afterend', injectElement);
        } else {
            document.body.appendChild(injectElement);
        }

        const courseSectionHeaders = document.querySelectorAll('.course-section-header');
        courseSectionHeaders.forEach(header => {
            const downloadButton = document.createElement('button');
            downloadButton.className = 'download-button';
            downloadButton.textContent = 'Download';
            header.appendChild(downloadButton);
        });
    }
    init();
}