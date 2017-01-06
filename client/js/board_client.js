var socket = io('/BoardService');

var img = document.querySelector("#img1");
socket.on('display', function (urlImg) {
    alert(urlImg);
    document.getElementById("img1").src = urlImg;
});