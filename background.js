
try{

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            chrome.scripting.executeScript({
                files: ['content.js'],
                target: {tabId: tabId}
            });
        }
    });
}catch(e){
    console.log(e);
}
