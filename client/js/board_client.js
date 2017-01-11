var socket = io('/BoardService');

var img = document.querySelector("#img1");
socket.on('displayAll', function (urlImg) {
    console.log("displayAll");
    document.getElementById("img1").src = urlImg;
});
socket.on('displayJpg', function (urlImg) {
    console.log("displayJpg");
    document.getElementById("img1").src = urlImg;
});
socket.on('displayGif', function (urlImg) {
    console.log("displayGif");
    document.getElementById("img1").src = "";
});
socket.on('hideAll', function (urlImg) {
    console.log("hideAll");
    document.getElementById("img1").src = "";
});