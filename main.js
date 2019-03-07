console.log("yo");
// http://www.friends-tv.org/epguide.html

// constants
const QUOTES_FILE = "quotes.json";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const NUM_SITES = 3;
const MAX_LINK_LENGTH = 30;
const DOUBLE_DIGITS = 10;

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
    xhr.open("GET", QUOTES_FILE, false);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            quotes = JSON.parse(xhr.responseText);
        }
    }
    xhr.send(null);
}

function loadTopSites(mostVisitedURLs) {
    let siteList = document.getElementsByClassName("site");

    if (!mostVisitedURLs.length) {
        //siteList.innerText = "An error occurred. :(";
        return;
    }

    for (let i = 0; i < NUM_SITES; ++i) {
        let site = mostVisitedURLs[i];
        let title = site.title;
        if (title.length > MAX_LINK_LENGTH) {
            title = title.substring(0, MAX_LINK_LENGTH) + "...";
        }
        siteList[i].innerHTML = "<a href=" + site.url + ">" + title + "</a>";
    }

}

function updateDate() {
    let hours = today.getHours();
    let mins = today.getMinutes();

    if (hours < DOUBLE_DIGITS) {hours = "0" + hours};
    if (mins < DOUBLE_DIGITS) {mins = "0" + mins};

    time.innerHTML = hours + ":" + mins;
    date.innerHTML = MONTHS[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear();
}

function updateQuote() {
    let index = Math.floor(Math.random() * quotes.length);

    let seasonNum = quotes[index]["season_num"];
    let seasonText = "S" + (seasonNum < DOUBLE_DIGITS ? "0" + seasonNum : seasonNum);
    let episodeNum = quotes[index]["episode_num"];
    let episodeText = "E" + (episodeNum < DOUBLE_DIGITS ? "0" + episodeNum : episodeNum);
    
    let speakerText = "<b>" + quotes[index]["speaker"] + "</b>&ensp;" + seasonText + episodeText + ": " + quotes[index]["episode_title"];

    quoteText.innerHTML = quotes[index]["text"];
    quoteSpeaker.innerHTML = speakerText;

}

function init() {
    loadQuotes();
    chrome.topSites.get(loadTopSites);
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

init();
loop();