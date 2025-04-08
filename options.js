// Save settings to chrome.storage
document.getElementById("saveSettings").addEventListener("click", () => {
  let downloadPath = document.getElementById("defaultDownloadPath").value.trim();
  
  // Simple path sanitization - just replace backslashes with forward slashes
  downloadPath = downloadPath.replace(/\\/g, "/");
  
  // Remove any drive letters or absolute path indicators for safety
  downloadPath = downloadPath.replace(/^[A-Za-z]:\//g, "");
  
  // Ensure there are no duplicate slashes
  downloadPath = downloadPath.replace(/\/+/g, "/");
  
  // Remove leading slash if present
  downloadPath = downloadPath.replace(/^\//, "");
  
  const settings = {
    defaultDownloadPath: downloadPath,
    askBeforeDownload: document.getElementById("askBeforeDownload").checked,
    showNotifications: document.getElementById("showNotifications").checked,
    useMinimalProgress: document.getElementById("useMinimalProgress").checked,
    fileNaming: document.getElementById("fileNaming").value,
    autoDetectFileType: document.getElementById("autoDetectFileType").checked,
    createFolderStructure: document.getElementById("createFolderStructure").checked,
    rememberFileSelection: document.getElementById("rememberFileSelection").checked,
  }

  chrome.storage.sync.set({ settings: settings }, () => {
    const status = document.getElementById("status")
    const statusText = document.getElementById("statusText")

    statusText.textContent = "Settings saved successfully!"
    status.className = "status status-success visible"

    setTimeout(() => {
      status.className = "status status-success"
    }, 3000)
  })
});
  
// Load settings from chrome.storage
document.addEventListener("DOMContentLoaded", () => {
  // Check if chrome is defined, if not, define a mock object (for testing purposes)
  if (typeof chrome === "undefined" || !chrome.storage) {
    window.chrome = {
      storage: {
        sync: {
          get: (keys, callback) => {
            console.warn("chrome.storage.sync.get is not available. Using mock data.")
            const mockData = {
              settings: {
                defaultDownloadPath: "",
                askBeforeDownload: false,
                showNotifications: true,
                useMinimalProgress: true,
                fileNaming: "original",
                autoDetectFileType: true,
                createFolderStructure: true,
                rememberFileSelection: true,
              }
            }
            callback(mockData)
          },
          set: (items, callback) => {
            console.warn("chrome.storage.sync.set is not available. Data will not be saved.")
            if (callback) {
              callback()
            }
          },
        },
      },
      runtime: {
        lastError: null,
      },
    }
  }

  chrome.storage.sync.get("settings", (data) => {
    if (data.settings) {
      document.getElementById("defaultDownloadPath").value = data.settings.defaultDownloadPath || "";
      document.getElementById("askBeforeDownload").checked = !!data.settings.askBeforeDownload;
      document.getElementById("showNotifications").checked = data.settings.showNotifications !== false // Default to true
      document.getElementById("useMinimalProgress").checked = data.settings.useMinimalProgress !== false // Default to true
      document.getElementById("fileNaming").value = data.settings.fileNaming || "original"
      document.getElementById("autoDetectFileType").checked = data.settings.autoDetectFileType !== false // Default to true
      document.getElementById("createFolderStructure").checked = data.settings.createFolderStructure !== false // Default to true
      document.getElementById("rememberFileSelection").checked = data.settings.rememberFileSelection !== false // Default to true
    }
  })
});
