// We need to use the express framework: have a real web servler that knows how to send mime types etc.
var express = require('express');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

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
    form.imgUploadDir = path.join(__dirname, '/Projects/' + project_name);

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

// route for the "RemoteControl/Manager" namespace
app.get('/RemoteControl/Manager', function (req, res) {
    res.sendFile(__dirname + '/client/remote_control_project.html');
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

    socket.on("getProjectList", function () {
        var projectList = surface_server.getAllProjectsName();
        socket.emit("returnProjectList", projectList);
    });

    socket.on("getImagesFromProject", function (projectname) {
        var images = surface_server.getAllImages(projectname);
        socket.emit("returnAllImages", images);
    });

    socket.on("getAllTags", function (projectname) {
        var tags = surface_server.getAllTagFromProject(projectname);
        socket.emit("returnAllTags", tags);
    })


});

// manage the event on the namespace 'DeviceService'
var device_nsp = io.of('/DeviceService');
device_nsp.on('connection', function (socket) {
    console.log("un client connecté sur le DeviceService");
    var device_server = require('./server/device_server');

    socket.on('addToJson', function (message, project) {
        var imgData = require('./Projects/' + project + '/medias.json');
        imgData['medias'].push(JSON.parse(message));
        var jsonString = JSON.stringify(imgData);
        project_name = project;
        fs.writeFile("./Projects/" + project + '/medias.json', jsonString);
    });

    socket.on('projectName', function (projectName) {
        project_name = projectName;
    });

    // Quand le serveur reçoit un signal de type "message" du client
    // Start manage the projects
    socket.on('getAllProjects', function () {
        var names = device_server.getAllProjectsName();
        var jsonList = device_server.getAllProjectsJson();
        socket.emit('returnGetAll', names, jsonList);
    })
    socket.on('createProject', function (name, projectJson) {
        var json = String(projectJson);
        var isCreated = device_server.createProject(name, projectJson);
        socket.emit('returnCreated', isCreated);
    })

    socket.on('getProjectJson', function (project) {
        var projectJson = device_server.getProjectJson(project);
        socket.emit('returnProjectJson', projectJson, project);
    })
    socket.on('getViewProjectJson', function (project) {
        var projectJson = device_server.getProjectJson(project);
        socket.emit('returnViewProjectJson', projectJson, project);
    })
});


// manage the event on the namespace 'RemoteControl'
var remote_control_nsp = io.of('/RemoteControl');
remote_control_nsp.on('connection', function (socket) {
    console.log("un client connecté sur le RemoteControl");
    var remote_server = require('./server/remote_server');

    // Start manage the projects
    socket.on('getAllProjects', function () {
        var answer = remote_server.getAllProjectsName();
        socket.emit('returnGetAll', answer);
    });
    socket.on('selectedProject', function (name) {
        remote_server.setProjectName(name);
    });
    // End manage the projects
});

// manage the event on the namespace 'RemoteControl/Manager'
var remote_control_mng_nsp = io.of('/RemoteControl/Manager');
remote_control_mng_nsp.on('connection', function (socket) {
    console.log("un client connecté sur le RemoteControl/Manager");
    var remote_server = require('./server/remote_server');

    socket.on('getProjectName', function () {
        var answer = remote_server.getProjectName();
        socket.emit('selectedProject', answer);
    });

    // Start listen filter
    socket.on('getProjectTag', function () {
        var answer = remote_server.getAllTagFromProject();
        socket.emit('projectTag', answer);
    });
    socket.on('filterMedias', function (extension, tags) {
        var answer = remote_server.filterProjectMedias(extension, tags);
        socket.emit("resultMedias", answer);
        board_nsp.emit('tag', remote_server.getFilterProjectMediasWithoutAudio(answer));

    });
    // End listen filter

    // manage click image
    socket.on('showFullScreen', function (image) {
        console.log("the display will show : " + image);
        board_nsp.emit('showFullScreen', image, 'image');
    });
    socket.on('closeFullScreen', function () {
        console.log("close the full screen mode");
        board_nsp.emit('closeFullScreen');
    });

    // manage click music
    socket.on('playAudio', function (src) {
        board_nsp.emit('audio', src);
    });

    // manage click video
    socket.on('playVideo', function (video) {
        board_nsp.emit('showFullScreen', video, 'video');
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