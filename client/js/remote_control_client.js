var socket = io('/RemoteControl');
var response = "vide";

function displayAll() {
	socket.emit('displayImg', "");
	console.log("telephone emit displayImg");
}