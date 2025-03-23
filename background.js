chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "download_files") {
        try {
            // Use the course name or default if missing
            const mainFolderName = sanitizeFilename(message.courseName || "LearnWebCourse");
            // Group files by their section names
            const filesBySection = {};
            message.files.forEach((file) => {
                if (!filesBySection[file.section]) {
                    filesBySection[file.section] = [];
                }
                filesBySection[file.section].push(file);
            });

            let completedDownloads = 0;
            const totalDownloads = message.files.length;
            const downloadIds = [];
            const downloadTracking = {};

            // Send initial progress update
            chrome.runtime.sendMessage({
                action: "download_progress",
                completed: 0,
                total: totalDownloads,
                percentage: 0,
                currentFile: "Preparing downloads...",
                status: "initializing"
            });

            // Iterate over each section and download each file with fallback paths
            Object.keys(filesBySection).forEach((section) => {
                const sectionFolder = sanitizeFilename(section);
                filesBySection[section].forEach((file) => {
                    const originalFilename = file.filename;

                    // Split filename into base and extension
                    let basename = originalFilename;
                    let extension = "";
                    const lastDotIndex = originalFilename.lastIndexOf('.');
                    if (lastDotIndex > 0) {
                        basename = originalFilename.substring(0, lastDotIndex);
                        extension = originalFilename.substring(lastDotIndex);
                    } else {
                        extension = ".pdf";
                    }

                    const sanitizedBasename = sanitizeFilename(basename);
                    let finalFilename = sanitizedBasename + extension;
                    finalFilename = finalFilename.replace(/\.PDF$/i, '.pdf');

                    downloadTracking[originalFilename] = { status: "pending", progress: 0 };

                    tryDownload({
                        url: file.url,
                        path: `${mainFolderName}/${sectionFolder}/${finalFilename}`,
                        fallbacks: [
                            `${mainFolderName}/${finalFilename}`,
                            `${mainFolderName}/file_${Date.now()}.pdf`
                        ],
                        onSuccess: (id) => {
                            downloadIds.push(id);
                            downloadTracking[originalFilename].id = id;
                            downloadTracking[originalFilename].status = "downloading";

                            chrome.runtime.sendMessage({
                                action: "download_progress",
                                currentFile: originalFilename,
                                status: "downloading",
                                completed: completedDownloads,
                                total: totalDownloads,
                                percentage: Math.round((completedDownloads / totalDownloads) * 100)
                            });
                        },
                        onAllFailed: () => {
                            completedDownloads++;
                            downloadTracking[originalFilename].status = "failed";
                            chrome.runtime.sendMessage({
                                action: "download_progress",
                                currentFile: originalFilename,
                                status: "failed",
                                completed: completedDownloads,
                                total: totalDownloads,
                                percentage: Math.round((completedDownloads / totalDownloads) * 100)
                            });
                            console.error(`All download attempts failed for ${originalFilename}`);
                        }
                    });
                });
            });

            // Listen for download progress and completion
            chrome.downloads.onChanged.addListener(function downloadListener(delta) {
                if (downloadIds.includes(delta.id)) {
                    let currentFile = "Unknown file";
                    for (const [filename, data] of Object.entries(downloadTracking)) {
                        if (data.id === delta.id) {
                            currentFile = filename;
                            break;
                        }
                    }

                    if (delta.bytesReceived) {
                        const fileProgress = delta.bytesReceived.current;
                        const fileTotal = delta.totalBytes?.current || 0;
                        if (fileTotal > 0) {
                            const filePercentage = Math.round((fileProgress / fileTotal) * 100);
                            downloadTracking[currentFile].progress = filePercentage;
                            chrome.runtime.sendMessage({
                                action: "file_progress",
                                filename: currentFile,
                                progress: filePercentage
                            });
                        }
                    }

                    if (delta.state && delta.state.current === "complete") {
                        completedDownloads++;
                        downloadTracking[currentFile].status = "complete";
                        chrome.runtime.sendMessage({
                            action: "download_progress",
                            currentFile: currentFile,
                            status: "complete",
                            completed: completedDownloads,
                            total: totalDownloads,
                            percentage: Math.round((completedDownloads / totalDownloads) * 100)
                        });
                        if (completedDownloads === totalDownloads) {
                            chrome.downloads.onChanged.removeListener(downloadListener);
                            chrome.notifications.create({
                                type: "basic",
                                iconUrl: "logo128.png",
                                title: "Downloads Complete",
                                message: `All ${totalDownloads} files have been downloaded to the "${mainFolderName}" folder.`,
                            });
                            chrome.runtime.sendMessage({
                                action: "downloads_completed",
                                status: "complete"
                            });
                        }
                    }
                }
            });

            sendResponse({
                success: true,
                folderName: mainFolderName,
                totalFiles: message.files.length,
            });
        } catch (error) {
            console.error("Error in download_files handler:", error);
            sendResponse({ success: false, error: error.message });
        }
        return true;
    } else {
        sendResponse({ success: false, error: "Unknown message action" });
    }
    return true;
});

/**
 * Recursively attempts to download a file using fallback paths.
 */
function tryDownload(options) {
    const { url, path, fallbacks = [], onSuccess, onAllFailed } = options;
    chrome.downloads.download(
        {
            url: url,
            filename: path,
            saveAs: false,
        },
        (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error(`Download failed for ${path}:`, chrome.runtime.lastError);
                if (fallbacks.length > 0) {
                    const nextPath = fallbacks.shift();
                    console.log(`Trying fallback path: ${nextPath}`);
                    tryDownload({
                        url,
                        path: nextPath,
                        fallbacks,
                        onSuccess,
                        onAllFailed
                    });
                } else {
                    if (onAllFailed) onAllFailed();
                }
            } else if (downloadId) {
                console.log("Download started, ID:", downloadId, "Path:", path);
                if (onSuccess) onSuccess(downloadId);
            } else {
                if (fallbacks.length > 0) {
                    const nextPath = fallbacks.shift();
                    tryDownload({ url, path: nextPath, fallbacks, onSuccess, onAllFailed });
                } else {
                    if (onAllFailed) onAllFailed();
                }
            }
        }
    );
}

/**
 * Sanitizes a filename by removing or replacing invalid characters.
 */
function sanitizeFilename(filename) {
    if (!filename) return "unnamed";
    try {
        const normalized = filename.normalize('NFD');
        const sanitized = normalized
            .replace(/[äÄ]/g, 'ae')
            .replace(/[öÖ]/g, 'oe')
            .replace(/[üÜ]/g, 'ue')
            .replace(/[ß]/g, 'ss')
            .replace(/[<>:"/\\|?*]+/g, "_")
            .replace(/[\s]+/g, "_")
            .replace(/[.,;]+/g, "_")
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, "_")
            .replace(/[+]+/g, "_")
            .replace(/_+/g, "_")
            .replace(/^_|_$/g, "")
            .replace(/[^\x00-\x7F]/g, "");
        const maxLength = 40;
        const truncated = sanitized.length > maxLength ? sanitized.substring(0, maxLength) : sanitized;
        return truncated || "unnamed";
    } catch (error) {
        console.error("Error sanitizing filename:", error);
        return `unnamed_${Date.now()}`;
    }
}