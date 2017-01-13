var socket = io('/RemoteControl');

function displayAll() {
	socket.emit('tag', "costumes");
}