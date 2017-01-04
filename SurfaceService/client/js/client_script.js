var socket = io.connect('http://localhost:8080');
socket.on('message', function(message) {
    alert('Le serveur a un message pour vous : ' + message);
})

socket.on('folder', function(foldercontent){
    data.innerHTML = foldercontent;
})

var data = document.querySelector("#data");

var datasend = document.querySelector("#datasend");
// Listener for send button
datasend.addEventListener("click", function(evt) {
    sendMessage();
});
// sends the chat message to the server
function sendMessage() {
    //var message = data.value;
    //data.value = "";
    socket.emit('message', "hello");
}