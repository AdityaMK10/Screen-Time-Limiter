
document.getElementById('blockForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const website = document.getElementById('website').value.trim();
    const time = parseInt(document.getElementById('time').value, 10);

    if (website && time > 0) {
        chrome.storage.local.set({
            targetWebsite: website,
            timeLimit: time,
            timerStarted: false,
            startTime: null,
            timeRemaining: time
        }, () => {
            alert(`Timer set for ${website} with a ${time} minute limit.`);
        });
    } else {
        alert('Please enter valid website and time values.');
    }
});


function updateCountdownDisplay() {
    chrome.storage.local.get(['targetWebsite', 'timeRemaining'], (data) => {
        const { targetWebsite, timeRemaining } = data;
        const currentSite = document.getElementById('currentSite');
        const timeDisplay = document.getElementById('timeRemaining');

        if (targetWebsite) {
            currentSite.textContent = targetWebsite;
            timeDisplay.textContent = timeRemaining > 0 
                ? `${Math.floor(timeRemaining)} minutes remaining`
                : 'Time expired';
        } else {
            currentSite.textContent = 'None';
            timeDisplay.textContent = 'Not set';
        }
    });
}


setInterval(updateCountdownDisplay, 1000);
