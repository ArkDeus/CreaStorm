'use strict';

var socket = io('/RemoteControl');
// var urlServer = "http://localhost:8081"
var response = "vide";

function displayAll() {
	socket.emit('displayImg', "");
	console.log("telephone emit displayImg");
	// alert("clic");
 //    var xmlHttp = new XMLHttpRequest();
 //    xmlHttp.open( "GET", urlServer + "/displayAll", false ); // false for synchronous request
 //    xmlHttp.send( null );
 //    response = xmlHttp.responseText;

 // 	// document.getElementById('response').innerHTML = "test";
 // 	document.getElementById("p1").innerHTML = "displayAll : " + response;
 //    return xmlHttp.responseText;
}



socket.on('message', function(message) {
    alert('Le serveur a un message pour vous : ' + message);
})
// var img = document.querySelector("#img1");
// socket.on('displayImg', function(urlImg){
    
// })



// var datasend = document.querySelector("#datasend");
// // Listener for send button
// datasend.addEventListener("click", function(evt) {
//     sendMessage();
// });
// sends the chat message to the server
// function sendMessage() {
//     socket.emit('message', "");
// }
