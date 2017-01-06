var socket = io('/SurfaceService');

socket.on('folder', function (foldercontent) {
    data.innerHTML = foldercontent;
})

window.onload = init;

function init() {
    var data = document.querySelector("#data");

    var datasend = document.querySelector("#datasend");
    // Listener for send button
    datasend.addEventListener("click", function (evt) {
        socket.emit('message', "");
    });
};