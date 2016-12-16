
// We need to use the express framework: have a real web servler that knows how to send mime types etc.
var express=require('express');
// to access to the file system to read folder content
var filesystem = require("fs");

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
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client.html');
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

var json = "";

// Quand un client se connecte, on le note dans la console

io.sockets.on('connection', function (socket) {
    console.log("un client connecté");
    socket.emit('message', 'Vous êtes bien connecté !');

    // Quand le serveur reçoit un signal de type "message" du client
    socket.on('message', function (message) {
        // clear the json var
        json = "{";
        var result =  _getAllFilesFromFolder("node_modules");
        // send the json to the client
        // hack : remove the 2 last characters to remove the last ",}" and replace by "}}"
        socket.emit('folder', result.substring(0, result.length - 2) + "}}");
    });
});

var _getAllFilesFromFolder = function(dir) {
    // remove the last "," when we have a recursion
    if(json.length>2){
        if(json.substring(json.length - 1, json.length) === ",}"){
            json = json.substring(0, json.length - 2) + "}";
        }
    }
    
    json += "   \"" + dir.split('/').pop() + "\": {";

    filesystem.readdirSync(dir).forEach(function(file) {
        file = dir+'/'+file;
        var stat = filesystem.statSync(file);

        // if it's a directory we open the folder
        if (stat && stat.isDirectory()) {
            _getAllFilesFromFolder(file);
        } else {
            var filename = file.split(/(\\|\/)/g).pop();
            var fileext = filename.split('.').pop();
            filename = filename.substring(0, filename.length - 1 - fileext.length);
            if(filename.length > 0){
                json += "\"" + filename + "\": " + "\"" + filename + "." + fileext + "\","; 
            }
        }
    });
    // 
    json = json.substring(0, json.length - 1);
    json += "},";
    return json;
};