// var server1 = require('./DeviceService/device_server');
// var server2 = require('./SurfaceService/surface_server');

// We need to use the express framework: have a real web servler that knows how to send mime types etc.
var express = require('express');

// Init globals variables for each module required
var app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

// launch the http server on given port
server.listen(8080);

// Indicate where static files are located. Without this, no external js file, no css...  
app.use(express.static(__dirname + '/'));

// routing
// if somebody try to access to the root
app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Vous avez trouvé le point d\'origine du web !');
});

// route for the 'SurfaceService' namespace
app.get('/SurfaceService', function (req, res) {
    res.sendFile(__dirname + '/client/surface_client.html');
});

// namespace
// manage the event on the namespace 'SurfaceService'
var surface_nsp = io.of('/SurfaceService');
surface_nsp.on('connection', function (socket) {
    var surface_server = require('./server/surface_server');
    console.log("un client connecté sur le namespace");
    socket.emit('message', 'Vous êtes bien connecté sur le namespace!');

    // Quand le serveur reçoit un signal de type "message" du client
    socket.on('message', function (message) {
        var result = surface_server.getAllFilesFromFolder("node_modules");
        // send the json to the client
        // hack : remove the 2 last characters to remove the last ",}" and replace by "}}"
        socket.emit('folder', "{" + result.substring(0, result.length - 2) + "}}");
    });
});