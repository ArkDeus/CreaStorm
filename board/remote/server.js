var express = require('express');
var path = require('path');
var app = express();

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// // h View Engines
// app.set('views', path.join(__dirname, 'app'));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

// app.use('/', express.static(path.join(__dirname + '/')));
app.use(express.static(__dirname + '/'));

// GET index.html route
app.get('/', function(req, res) {
  	// return res.render('index');
  	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	socket.emit('message', "hello");

	// Quand le serveur reçoit un signal de type "message" du client
    socket.on('displayImg', function (message) {
        // var result = ;
        // send the json to the client
        // hack : remove the 2 last characters to remove the last ",}" and replace by "}}"
        socket.emit('display', "../star_wars.jpg");
    });
});


// Start our server and start to listen
server.listen(process.env.PORT || 3000, function() {
  	console.log('listening at 3000');
  	console.log('Go to http://localhost:3000 to see the page.');
});

