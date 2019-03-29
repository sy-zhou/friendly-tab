let button = document.getElementById("test");

button.onclick = function(e) {
    let tester = e.target.id;
    console.log("o" + tester);
    chrome.storage.sync.set({'testing': 'success'}, function() {
        console.log('success? maybe.');
    });
    chrome.storage.sync.get("testing", function(data) {
        button.textContent = data.testing;
    });
    //chrome.tabs.create({"url": "chrome://newtab"});
    
};