setInterval(() => {
    chrome.storage.local.get(['targetWebsite', 'timeLimit', 'timerStarted', 'startTime', 'timeRemaining'], (data) => {
        const { targetWebsite, timerStarted, startTime, timeLimit } = data;

        if (targetWebsite && timerStarted && startTime) {
            const elapsedTime = (Date.now() - startTime) / (1000 * 60); 
            const timeRemaining = timeLimit - elapsedTime;

            if (timeRemaining <= 0) {
                chrome.tabs.query({}, (tabs) => {
                    tabs.forEach((tab) => {
                        const currentUrl = new URL(tab.url).hostname;

                        
                        if (currentUrl.includes(targetWebsite)) {
                            chrome.tabs.update(tab.id, { url: chrome.runtime.getURL("blocked.html") });
                        }
                    });
                });

                
                chrome.storage.local.set({
                    timerStarted: false,
                    startTime: null,
                    timeRemaining: 0
                });
            } else {
                
                chrome.storage.local.set({ timeRemaining: Math.max(0, timeRemaining) });
            }
        }
    });
}, 1000); 

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const currentUrl = new URL(tab.url).hostname;

        chrome.storage.local.get(['targetWebsite', 'timeLimit', 'timerStarted', 'startTime'], (data) => {
            const { targetWebsite, timeLimit, timerStarted, startTime } = data;

            if (targetWebsite && currentUrl.includes(targetWebsite)) {
                if (!timerStarted) {
                    const newStartTime = Date.now();
                    chrome.storage.local.set({
                        timerStarted: true,
                        startTime: newStartTime
                    });
                }
            }
        });
    }
});
