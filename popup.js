// MIT License
// Copyright (c) 2025 Justin Krumbömer
// See LICENSE file in the project root for full license information.

document.addEventListener("DOMContentLoaded", () => {
    // Check if chrome is defined, if not, define a mock object (for testing purposes)
    if (typeof chrome === "undefined" || !chrome.tabs) {
      window.chrome = {
        tabs: {
          query: (queryInfo, callback) => {
            //console.warn("chrome.tabs.query is not available. Using mock data.")
            callback([{ id: 1, url: "https://www.uni-muenster.de/LearnWeb/learnweb2/course/view.php?id=123" }])
          },
          sendMessage: (tabId, message, callback) => {
            //console.warn("chrome.tabs.sendMessage is not available.")
            if (callback) callback()
          },
        },
        runtime: {
          openOptionsPage: () => {
            //console.warn("chrome.runtime.openOptionsPage is not available.")
            window.open("options.html", "_blank")
          },
        },
        storage: {
          local: {
            get: (keys, callback) => {
              //console.warn("chrome.storage.local.get is not available. Using mock data.")
              const mockData = {
                downloadHistory: [
                  {
                    courseName: "Example Course 1",
                    fileCount: 12,
                    timestamp: Date.now() - 86400000,
                  },
                  {
                    courseName: "Example Course 2",
                    fileCount: 5,
                    timestamp: Date.now() - 172800000,
                  },
                ],
              }
              callback(mockData)
            },
          },
        },
      }
    }
  
    // Check if current tab is a LearnWeb page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0]
      const isLearnwebPage = currentTab.url.includes("uni-muenster.de/LearnWeb/learnweb2")
  
      if (isLearnwebPage) {
        document.getElementById("learnwebContent").style.display = "block"
        document.getElementById("notLearnwebContent").style.display = "none"
  
        // Setup download all button
        document.getElementById("downloadAllBtn").addEventListener("click", () => {
          chrome.tabs.sendMessage(currentTab.id, { action: "trigger_download_all" })
          window.close()
        })
      } else {
        document.getElementById("learnwebContent").style.display = "none"
        document.getElementById("notLearnwebContent").style.display = "block"
      }
    })
  
    // Setup settings buttons
    document.getElementById("openSettingsBtn").addEventListener("click", () => {
      chrome.runtime.openOptionsPage()
    })
  
    document.getElementById("openSettingsBtnAlt").addEventListener("click", () => {
      chrome.runtime.openOptionsPage()
    })
  
    // Load download history
    loadDownloadHistory()
  })
  
  function loadDownloadHistory() {
    chrome.storage.local.get("downloadHistory", (data) => {
      const history = data.downloadHistory || []
      const historyContainer = document.getElementById("downloadHistory")
  
      if (history.length === 0) {
        historyContainer.innerHTML = `
                  <div class="history-item">
                      <div class="history-title">No recent downloads</div>
                  </div>
              `
        return
      }
  
      historyContainer.innerHTML = ""
  
      // Show the 5 most recent downloads
      history.slice(0, 5).forEach((item) => {
        const date = new Date(item.timestamp)
        const formattedDate =
          date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  
        historyContainer.innerHTML += `
                  <div class="history-item">
                      <div class="history-title">${item.courseName}</div>
                      <div class="history-meta">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          ${item.fileCount} files
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px;">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          ${formattedDate}
                      </div>
                  </div>
              `
      })
    })
  }
  