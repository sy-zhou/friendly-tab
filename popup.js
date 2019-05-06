// message for the user
const BUTTON = "Heyo";
const MESSAGE = "Hope you enjoy the extension!"

// body of popup to add HTML elements to
var content = document.getElementById("message");

// button
var helloBtn = document.createElement("button");
helloBtn.innerHTML = BUTTON;
helloBtn.onclick = function(e) {
    // remove button
    content.removeChild(helloBtn);
    // display message
    var messageDiv =  document.createElement("div");
    messageDiv.innerHTML = MESSAGE;
    content.appendChild(messageDiv);
};

// display button on popup
content.appendChild(helloBtn);