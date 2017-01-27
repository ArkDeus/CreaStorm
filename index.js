// We need to use the express framework: have a real web servler that knows how to send mime types etc.
var express = require('express');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var remote_server = require('./server/remote_server');
var surface_server = require('./server/surface_server');

var project_name;

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

// route for the 'DeviceService' namespace
app.get('/DeviceService', function (req, res) {
    res.sendFile(__dirname + '/client/device_client.html');
});

app.post('/DeviceService', function (req, res) {
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.imgUploadDir = path.join(__dirname, '/Projects/'+project_name);


    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
        fs.rename(file.path, path.join(form.imgUploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);

});

// route for the "RemoteControl" namespace
app.get('/RemoteControl', function (req, res) {
    res.sendFile(__dirname + '/client/remote_control_client.html');
});

// route for the 'BoardService' namespace
app.get('/BoardService', function (req, res) {
    res.sendFile(__dirname + '/client/board_client.html');
});

// namespace
// manage the event on the namespace 'SurfaceService'
var surface_nsp = io.of('/SurfaceService');
surface_nsp.on('connection', function (socket) {
    var surface_server = require('./server/surface_server');
    console.log("un client connecté sur le SurfaceService");

    socket.on("getProjectList",function(){
        var projectList = remote_server.getAllProjectsName();
        socket.emit("returnProjectList",projectList);
    });

    socket.on("getImagesFromProject",function(projectname){
        console.log(projectname);
       var images = surface_server.getAllImages(projectname);
        socket.emit("returnAllImages",images);
    });

    socket.on("getAllTags",function(projectname){
        var tags = surface_server.getAllTagFromProject(projectname);
        socket.emit("returnAllTags", tags);
    })


});

// manage the event on the namespace 'DeviceService'
var device_nsp = io.of('/DeviceService');
device_nsp.on('connection', function (socket) {
    console.log("un client connecté sur le DeviceService");
    socket.on('addToJson', function(message){
        var imgData = require('./Projects/' + project_name + '/medias.json');
        imgData['medias'].push(JSON.parse(message));
        var jsonString = JSON.stringify(imgData);
        fs.writeFile("./Projects/" +project_name + '/medias.json', jsonString);
    });

    socket.on('projectName',function(name){
        project_name = name;
    });
    // Quand le serveur reçoit un signal de type "message" du client
    // Start manage the projects
    socket.on('getAllProjects', function () {
        var answer = remote_server.getAllProjectsName();
        socket.emit('returnGetAll', answer);
    })
    socket.on('createProject', function (name, projectJson,  projectDirectories) {
        console.log(projectJson);
        console.log(projectDirectories);
        var json = String(projectJson);
        var isCreated = remote_server.createProject(name, projectJson, projectDirectories);
        socket.emit('returnCreated', isCreated);
    })

    socket.on('getProjectJson', function(project){
        var projectJson = remote_server.getProjectJson(project);
        console.log(projectJson);
        socket.emit('returnProjectJson', projectJson, project);
    })
    socket.on('getViewProjectJson', function(project){
        var projectJson = remote_server.getProjectJson(project);
        console.log(projectJson);
        socket.emit('returnViewProjectJson', projectJson, project);
    })
});


// manage the event on the namespace 'RemoteControl'
var remote_control_nsp = io.of('/RemoteControl');
remote_control_nsp.on('connection', function (socket) {
    console.log("un client connecté sur le RemoteControl");

    // Quand le serveur reçoit un signal de type "message" du client
    // Start manage the projects
    socket.on('getAllProjects', function () {
        var answer = remote_server.getAllProjectsName();
        socket.emit('returnGetAll', answer);
    });
    socket.on('createProject', function (name) {
        var isCreated = remote_server.createProject(name);
        socket.emit('returnCreated', isCreated);
    });
    // End manage the projects

    // Start listen filter
    socket.on('getProjectTag', function(name){
        var answer = remote_server.getAllTagFromProject(name);
        socket.emit('projectTag', answer);
    });
    socket.on('applyFilter', function (name, extensions) {
        var answer = remote_server.filterProjectFiles(name, extensions);
        socket.emit('filterResult', answer);
    });
    // End listen filter

    socket.on('showFullScreen', function (image) {
        console.log("the display will show : " + image);
        board_nsp.emit('showFullScreen', image);
    });

    socket.on('closeFullScreen', function () {
        console.log("close the full screen mode");
        board_nsp.emit('closeFullScreen');
    });

    socket.on('tag', function (message) {
        var tab = remote_server.getTabFromTag(message);
        board_nsp.emit('tag', tab);
    });

    // Start remote control
    socket.on('goRight', function () {
        console.log('go right');
        board_nsp.emit('goRight');
    });
    socket.on('goLeft', function () {
        console.log('go left');
        board_nsp.emit('goLeft');
    });
});

// manage the event on the namespace 'BoardService'
var board_nsp = io.of('/BoardService');
board_nsp.on('connection', function (socket) {
    console.log("un client connecté sur le BoardService");
});