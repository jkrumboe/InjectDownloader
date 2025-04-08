// Modify the download_files handler in your background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "download_files") {
    try {
      // Use the course name or default if missing
      const mainFolderName = sanitizeFilename(message.courseName || "LearnWebCourse")
      
      // Group files by their section names
      const filesBySection = {}
      message.files.forEach((file) => {
        if (!filesBySection[file.section]) {
          filesBySection[file.section] = []
        }
        filesBySection[file.section].push(file)
      })

      let completedDownloads = 0
      const totalDownloads = message.files.length
      const downloadIds = []
      const downloadTracking = {}

      // Send initial progress update
      chrome.runtime.sendMessage({
        action: "download_progress",
        completed: 0,
        total: totalDownloads,
        percentage: 0,
        currentFile: "Preparing downloads...",
        status: "initializing",
      })

      // Get settings to check configuration options
      chrome.storage.sync.get("settings", (data) => {
        const settings = data.settings || {}
        console.log("Settings loaded:", settings)
        
        // Only check if we should ask before download
        const askBeforeDownload = settings.askBeforeDownload || false
        
        // Iterate over each section and download each file with simplified path structure
        Object.keys(filesBySection).forEach((section) => {
          const sectionFolder = sanitizeFilename(section)
          filesBySection[section].forEach((file) => {
            const originalFilename = file.filename

            // Split filename into base and extension
            let basename = originalFilename
            let extension = ""
            const lastDotIndex = originalFilename.lastIndexOf(".")
            if (lastDotIndex > 0) {
              basename = originalFilename.substring(0, lastDotIndex)
              extension = originalFilename.substring(lastDotIndex)
            } else {
              extension = detectFileType(file.url, originalFilename)
            }

            const sanitizedBasename = sanitizeFilename(basename)
            let finalFilename = sanitizedBasename + extension
            finalFilename = finalFilename.replace(/\.PDF$/i, ".pdf")

            downloadTracking[originalFilename] = { status: "pending", progress: 0 }

            // Simplified path structure without custom download paths
            const mainPath = `${mainFolderName}/${sectionFolder}/${finalFilename}`
            const fallbackPaths = [
              `${mainFolderName}/${finalFilename}`, 
              `${mainFolderName}/file_${Date.now()}.pdf`
            ]
            
            tryDownload({
              url: file.url,
              path: mainPath,
              fallbacks: fallbackPaths,
              saveAs: askBeforeDownload,
              onSuccess: (id) => {
                downloadIds.push(id)
                downloadTracking[originalFilename].id = id
                downloadTracking[originalFilename].status = "downloading"
                
                chrome.runtime.sendMessage({
                  action: "download_progress",
                  currentFile: originalFilename,
                  status: "downloading",
                  completed: completedDownloads,
                  total: totalDownloads,
                  percentage: Math.round((completedDownloads / totalDownloads) * 100),
                })
              },
              onAllFailed: () => {
                completedDownloads++
                downloadTracking[originalFilename].status = "failed"
                chrome.runtime.sendMessage({
                  action: "download_progress",
                  currentFile: originalFilename,
                  status: "failed",
                  completed: completedDownloads,
                  total: totalDownloads,
                  percentage: Math.round((completedDownloads / totalDownloads) * 100),
                })
                console.error(`All download attempts failed for ${originalFilename}`)
              },
            })
          })
        })
      })
      
      // Rest of your existing download tracking code...
  
        // Listen for download progress and completion
        chrome.downloads.onChanged.addListener(function downloadListener(delta) {
          if (downloadIds.includes(delta.id)) {
            let currentFile = "Unknown file"
            for (const [filename, data] of Object.entries(downloadTracking)) {
              if (data.id === delta.id) {
                currentFile = filename
                break
              }
            }
  
            if (delta.bytesReceived) {
              const fileProgress = delta.bytesReceived.current
              const fileTotal = delta.totalBytes?.current || 0
              if (fileTotal > 0) {
                const filePercentage = Math.round((fileProgress / fileTotal) * 100)
                downloadTracking[currentFile].progress = filePercentage
                chrome.runtime.sendMessage({
                  action: "file_progress",
                  filename: currentFile,
                  progress: filePercentage,
                })
              }
            }
  
            if (delta.state && delta.state.current === "complete") {
              completedDownloads++
              downloadTracking[currentFile].status = "complete"
              chrome.runtime.sendMessage({
                action: "download_progress",
                currentFile: currentFile,
                status: "complete",
                completed: completedDownloads,
                total: totalDownloads,
                percentage: Math.round((completedDownloads / totalDownloads) * 100),
              })
              if (completedDownloads === totalDownloads) {
                chrome.downloads.onChanged.removeListener(downloadListener)
  
                // Get settings to check if notifications are enabled
                chrome.storage.sync.get("settings", (data) => {
                  const settings = data.settings || {}
                  const showNotifications = settings.showNotifications !== false
                  if (showNotifications) {
                    chrome.notifications.create({
                      type: "basic",
                      iconUrl: "icons/icon128.png",
                      title: "Downloads Complete",
                      message: `All ${totalDownloads} files have been downloaded to the "${mainFolderName}" folder.`,
                    })
                  }
                })
  
                // Add to download history
                chrome.storage.local.get("downloadHistory", (data) => {
                  const history = data.downloadHistory || []
                  history.unshift({
                    courseName: message.courseName,
                    fileCount: totalDownloads,
                    timestamp: Date.now(),
                  })
  
                  // Keep only the last 20 downloads
                  if (history.length > 20) {
                    history.length = 20
                  }
  
                  chrome.storage.local.set({ downloadHistory: history })
                })
  
                chrome.runtime.sendMessage({
                  action: "downloads_completed",
                  status: "complete",
                })
              }
            }
          }
        })
  
        sendResponse({
          success: true,
          folderName: mainFolderName,
          totalFiles: message.files.length,
        })
      } catch (error) {
        console.error("Error in download_files handler:", error)
        sendResponse({ success: false, error: error.message })
      }
      return true
    } else if (message.action === "open_settings") {
      chrome.runtime.openOptionsPage()
      sendResponse({ success: true })
      return true
    } else if (message.action === "cancel_downloads") {
      // Get all active downloads and cancel them
      chrome.downloads.search({ state: "in_progress" }, (downloads) => {
        downloads.forEach((download) => {
          chrome.downloads.cancel(download.id)
        })
      })
      sendResponse({ success: true })
      return true
    } else {
      sendResponse({ success: false, error: "Unknown message action" })
    }
    return true
  })
  
  /**
   * Recursively attempts to download a file using fallback paths.
   */
  /**
 * Recursively attempts to download a file using fallback paths.
 */
  function tryDownload(options) {
    const { url, path, fallbacks = [], saveAs = false, onSuccess, onAllFailed } = options
    
    // Sanitize the path for Chrome's downloads API
    const safePath = sanitizeDownloadPath(path);
    
    console.log(`Attempting to download: ${url} to ${safePath}`);
    
    chrome.downloads.download(
      {
        url: url,
        filename: safePath,
        saveAs: saveAs,
      },
      (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error(`Download failed for ${safePath}:`, chrome.runtime.lastError)
          if (fallbacks.length > 0) {
            const nextPath = sanitizeDownloadPath(fallbacks.shift());
            console.log(`Trying fallback path: ${nextPath}`)
            tryDownload({
              url,
              path: nextPath,
              fallbacks: fallbacks.map(sanitizeDownloadPath), // Sanitize all fallbacks
              saveAs,
              onSuccess,
              onAllFailed,
            })
          } else {
            if (onAllFailed) onAllFailed()
          }
        } else if (downloadId) {
          console.log("Download started, ID:", downloadId, "Path:", safePath)
          
          // We need to get the actual download path
          // This might be different from what we specified if the user chooses a different location
          if (saveAs) {
            chrome.downloads.search({id: downloadId}, (items) => {
              if (items && items.length > 0 && items[0].filename) {
                if (onSuccess) onSuccess(downloadId, items[0].filename)
              } else {
                if (onSuccess) onSuccess(downloadId, safePath)
              }
            })
          } else {
            if (onSuccess) onSuccess(downloadId, safePath)
          }
        } else {
          if (fallbacks.length > 0) {
            const nextPath = sanitizeDownloadPath(fallbacks.shift());
            tryDownload({
              url,
              path: nextPath,
              fallbacks: fallbacks.map(sanitizeDownloadPath), // Sanitize all fallbacks
              saveAs,
              onSuccess,
              onAllFailed,
            })
          } else {
            if (onAllFailed) onAllFailed()
          }
        }
      },
    )
  }
  
  /**
   * Sanitizes a filename by removing or replacing invalid characters.
   */
  function sanitizeFilename(filename) {
    if (!filename) return "unnamed"
    try {
      const normalized = filename.normalize("NFD")
      const sanitized = normalized
        .replace(/[äÄ]/g, "ae")
        .replace(/[öÖ]/g, "oe")
        .replace(/[üÜ]/g, "ue")
        .replace(/[ß]/g, "ss")
        .replace(/[<>:"/\\|?*]+/g, "_")
        .replace(/[\s]+/g, "_")
        .replace(/[.,;]+/g, "_")
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "_")
        .replace(/[+]+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")
        .replace(/[^\x00-\x7F]/g, "")
      const maxLength = 40
      const truncated = sanitized.length > maxLength ? sanitized.substring(0, maxLength) : sanitized
      return truncated || "unnamed"
    } catch (error) {
      console.error("Error sanitizing filename:", error)
      return `unnamed_${Date.now()}`
    }
  }
  
  // Add this function to your background.js to handle file type detection
  function detectFileType(url, filename) {
    // Default to PDF if we can't determine
    let extension = ".pdf"
  
    // Try to extract extension from filename first
    const filenameMatch = filename.match(/\.([a-zA-Z0-9]+)$/)
    if (filenameMatch) {
      extension = filenameMatch[0].toLowerCase()
    } else {
      // Try to extract from URL
      const urlMatch = url.match(/\.([a-zA-Z0-9]+)(\?|$)/)
      if (urlMatch) {
        extension = "." + urlMatch[1].toLowerCase()
      }
    }
  
    return extension
  }

  // Add this function before the tryDownload function:

/**
 * Sanitizes a download path for Chrome's downloads API.
 * Ensures there are no backslashes, no drive letters, and proper path structure.
 * Also handles removal of Downloads folder nesting.
 */
function sanitizeDownloadPath(path) {
  // Replace backslashes with forward slashes
  let sanitized = path.replace(/\\/g, '/');
  
  // Remove drive letter prefixes (like C:/)
  sanitized = sanitized.replace(/^[A-Za-z]:\//g, '');
  
  // Handle potential Downloads folder nesting issues
  // If the path contains multiple "Downloads" folders, keep only the last part
  const downloadsPattern = /downloads\/.*?downloads\//i;
  while (downloadsPattern.test(sanitized)) {
    sanitized = sanitized.replace(downloadsPattern, 'downloads/');
  }
  
  // Ensure there are no duplicate slashes
  sanitized = sanitized.replace(/\/+/g, '/');
  
  // Remove leading slash if present
  sanitized = sanitized.replace(/^\//, '');
  
  console.log(`Sanitized path: ${path} → ${sanitized}`);
  
  return sanitized;
}
