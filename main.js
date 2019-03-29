/**
 * The JS file for creating the web page.
 * Quotes retrieved from: http://www.friends-tv.org/epguide.html
 * 
 * @author sy-zhou
 */

console.log("yo");

// constants
const QUOTES_FILE = "quotes.json";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const NUM_SITES = 3;
const MAX_LINK_LENGTH = 30;
const DOUBLE_DIGITS = 10;

// variables
let umbrella_image = document.getElementById("umbrellas");
let time = document.getElementById("time");
let date = document.getElementById("date");
let quoteText = document.getElementById("text");
let quoteSpeaker = document.getElementById("speaker");

let quotes = [];
let currentDay = -1;
let currentMinute = -1;
let today;


/**
 * Updates the quote on page when user clicks on friends_umbrellas.jpg.
 */
umbrella_image.onclick = function() {
    updateQuote();
}


/**
 * Retrieves quotes from QUOTES_FILE and adds them to an array.
 */
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

/**
 * Displays the top sites on the page.
 * 
 * @param mostVisitedURLs an array containing info on the top sites visited by the user 
 */
function loadTopSites(mostVisitedURLs) {
    let siteList = document.getElementsByClassName("site");

    if (!mostVisitedURLs.length) { return; }

    // set in HTML
    for (let i = 0; i < NUM_SITES; ++i) {
        let site = mostVisitedURLs[i];
        let title = site.title;
        if (title.length > MAX_LINK_LENGTH) {
            title = title.substring(0, MAX_LINK_LENGTH) + "...";
        }
        siteList[i].innerHTML = "<a href=" + site.url + ">" + title + "</a>";
    }

}

/**
 * Updates the date shown on the page.
 */
function updateDate() {
    date.innerHTML = MONTHS[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear();
}

/**
 * Updates the time shown on the page.
 */
function updateTime() {
    // retrieving info about time
    let hours = today.getHours();
    let mins = today.getMinutes();

    if (hours < DOUBLE_DIGITS) {hours = "0" + hours};
    if (mins < DOUBLE_DIGITS) {mins = "0" + mins};

    // set in HTML
    time.innerHTML = hours + ":" + mins;
}

/**
 * Updates the quote displayed when the web page is opened or at midnight.
 */
function updateQuote() {
    let index = Math.floor(Math.random() * quotes.length);

    // formatting quote
    let seasonNum = quotes[index]["season_num"];
    let seasonText = "S" + (seasonNum < DOUBLE_DIGITS ? "0" + seasonNum : seasonNum);
    let episodeNum = quotes[index]["episode_num"];
    let episodeText = "E" + (episodeNum < DOUBLE_DIGITS ? "0" + episodeNum : episodeNum);
    let speakerText = "<b>" + quotes[index]["speaker"] + "</b>&ensp;" + seasonText + episodeText + ": " + quotes[index]["episode_title"];

    // set in HTML
    quoteText.innerHTML = quotes[index]["text"];
    quoteSpeaker.innerHTML = speakerText;

}

/**
 * Initialize content on web page by loading the quote and getting a list of top sites.
 */
function init() {
    loadQuotes();
    chrome.topSites.get(loadTopSites);
}

/**
 * Updates the content shown on the page as needed.
 */
function loop() {
    today = new Date();
    if (currentMinute != today.getMinutes()) {
        updateTime();
        currentMinute = today.getMinutes();
    }
    if (currentDay != today.getDate()) {
        updateDate();
        updateQuote();
        currentDay = today.getDate();
    }

    setTimeout(loop, 60);
}

// -------------------------------------------

init();
loop();