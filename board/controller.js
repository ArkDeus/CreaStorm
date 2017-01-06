'use strict';

var socket = io('/BoardService');
// var urlServer = "http://localhost:8081"
// var response = "vide";




var img = document.querySelector("#img1");
socket.on('display', function(urlImg){
	//alert(urlImg);
	document.getElementById("img1").src = urlImg;

    // img.innerHTML = document.getElementById("img1")[0].setAttribute("src", urlImg);
})



// var datasend = document.querySelector("#datasend");
// // Listener for send button
// datasend.addEventListener("click", function(evt) {
//     sendMessage();
// });
// sends the chat message to the server
// function sendMessage() {
//     socket.emit('message', "");
// }
