/**
 * The JS file for the new tab.
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
var umbrella_image = document.getElementById("umbrellas");
var time = document.getElementById("time");
var date = document.getElementById("date");
var quoteText = document.getElementById("text");
var quoteSpeaker = document.getElementById("speaker");

var quotes = [];
var currentDay = -1;
var currentMinute = -1;
var today;


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
    var xhr = new XMLHttpRequest();
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
    var siteList = document.getElementsByClassName("site");

    if (!mostVisitedURLs.length) { return; }

    // set in HTML
    for (var i = 0; i < NUM_SITES; ++i) {
        var site = mostVisitedURLs[i];
        var title = site.title;
        if (title.length > MAX_LINK_LENGTH) {
            title = title.substring(0, MAX_LINK_LENGTH) + "...";
        }
        siteList[i].innerHTML = `<a href=${site.url}>${title}</a>`;
    }

}

/**
 * Updates the date shown on the page.
 */
function updateDate() {
    var month = MONTHS[today.getMonth()];
    var day = today.getDate();
    var year = today.getFullYear();
    
    date.innerHTML = `${month} ${day}, ${year}`;
}

/**
 * Updates the time shown on the page.
 */
function updateTime() {
    // retrieving info about time
    var hours = today.getHours();
    var mins = today.getMinutes();

    if (hours < DOUBLE_DIGITS) {hours = "0" + hours};
    if (mins < DOUBLE_DIGITS) {mins = "0" + mins};

    // set in HTML
    time.innerHTML = `${hours}:${mins}`;
}

/**
 * Updates the quote displayed when the web page is opened or at midnight.
 */
function updateQuote() {
    var index = Math.floor(Math.random() * quotes.length);
    const { text, speaker, season_num, episode_num, episode_title } = quotes[index];

    // formatting quote
    var seasonText = "S" + (season_num < DOUBLE_DIGITS ? "0" + season_num : season_num);
    var episodeText = "E" + (episode_num < DOUBLE_DIGITS ? "0" + episode_num : episode_num);

    // set in HTML
    quoteText.innerHTML = `${text}`;
    quoteSpeaker.innerHTML = `<b>${speaker}</b>&ensp;${seasonText}${episodeText}: ${episode_title}`;

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