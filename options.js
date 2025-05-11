// MIT License
// Copyright (c) 2025 Justin Krumbömer
// See LICENSE file in the project root for full license information.

document.getElementById("saveSettings").addEventListener("click", () => {
  let downloadPath = "";
 
  const downloadPathElement = document.getElementById("defaultDownloadPath");
  if (downloadPathElement) {
    downloadPath = downloadPathElement.value.trim();
    
    // Path sanitization
    downloadPath = downloadPath.replace(/\\/g, "/");
    downloadPath = downloadPath.replace(/^[A-Za-z]:\//g, "");
    downloadPath = downloadPath.replace(/\/+/g, "/");
    downloadPath = downloadPath.replace(/^\//, "");
  }
  
  const settings = {
    defaultDownloadPath: downloadPath,
    //askBeforeDownload: document.getElementById("askBeforeDownload")?.checked || false,
    showNotifications: document.getElementById("showNotifications")?.checked !== false,
    createFolderStructure: document.getElementById("createFolderStructure")?.checked !== false,
    rememberFileSelection: document.getElementById("rememberFileSelection")?.checked !== false,
  }

  chrome.storage.sync.set({ settings: settings }, () => {
    const status = document.getElementById("status")
    const statusText = document.getElementById("statusText")

    if (status && statusText) {
      statusText.textContent = "Settings saved successfully!"
      status.className = "status status-success visible"

      setTimeout(() => {
        status.className = "status status-success"
      }, 3000)
    }
  })
});
  
// Load settings from chrome.storage
document.addEventListener("DOMContentLoaded", () => {
  if (typeof chrome === "undefined" || !chrome.storage) {
    window.chrome = {
      storage: {
        sync: {
          get: (keys, callback) => {
            //console.warn("chrome.storage.sync.get is not available. Using mock data.")
            const mockData = {
              settings: {
                defaultDownloadPath: "",
                // askBeforeDownload: false,
                showNotifications: true,
                createFolderStructure: true,
                rememberFileSelection: true,
              }
            }
            callback(mockData)
          },
          set: (items, callback) => {
            //console.warn("chrome.storage.sync.set is not available. Data will not be saved.")
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
      const defaultDownloadPath = document.getElementById("defaultDownloadPath");
      if (defaultDownloadPath) {
        defaultDownloadPath.value = data.settings.defaultDownloadPath || "";
      }
      
      /*
      const askBeforeDownload = document.getElementById("askBeforeDownload");
      if (askBeforeDownload) {
        askBeforeDownload.checked = !!data.settings.askBeforeDownload;
      }*/
      
      const showNotifications = document.getElementById("showNotifications");
      if (showNotifications) {
        showNotifications.checked = data.settings.showNotifications !== false;
      }
      document.getElementById("createFolderStructure").checked = data.settings.createFolderStructure !== false 
      document.getElementById("rememberFileSelection").checked = data.settings.rememberFileSelection !== false
    }
  })
});
