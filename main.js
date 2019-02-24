console.log("yo");

// constants
const quotesFile = "quotes.json";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// variables
let time = document.getElementById("time");
let date = document.getElementById("date");
let quoteText = document.getElementById("text");
let quoteSpeaker = document.getElementById("speaker");
let quotes = [];
let currentDay = 0;
let currentMinute = 0;
let today;


function loadQuotes() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", quotesFile, false);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            quotes = JSON.parse(xhr.responseText);
        }
    }
    xhr.send(null);
}

function updateDate() {
    let hours = today.getHours();
    let mins = today.getMinutes();

    if (hours < 10) {hours = "0" + hours};
    if (mins < 10) {mins = "0" + mins};

    time.innerHTML = hours + ":" + mins;
    date.innerHTML = months[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear();
}

function updateQuote() {
    let index = Math.floor(Math.random() * quotes.length);
    let speakerText = "<b>" + quotes[index]["speaker"] + "</b> Season " + quotes[index]["season"] + ": " + quotes[index]["episode"];

    quoteText.innerHTML = quotes[index]["text"];
    quoteSpeaker.innerHTML = speakerText;

}

function loop() {
    today = new Date();
    if (currentMinute != today.getMinutes()) {
        updateDate();
        currentMinute = today.getMinutes();
    }
    if (currentDay != today.getDate()) {
        updateQuote();
        currentDay = today.getDate();
    }

    setTimeout(loop, 60);
}

loadQuotes();
loop();