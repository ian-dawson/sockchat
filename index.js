var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [];

app.get('/', function(req, res) {
 	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
 	console.log('a user connected');
	socket.on('disconnect', function() {
		if (typeof socket.username != "undefined"){
			console.log(socket.username + ' left');
			users.splice(users.indexOf(socket.username), 1);
			io.emit('disconnect', socket.username);
		}
	});
	socket.on('chat message', function(msg) {
		var sender = socket.username;
		var message = msg;
		console.log('<' + sender + '> ' + message);
		io.emit('chat message', {name: sender, msg: message});
	});
	socket.on('new nick', function(name, callback) {
		if (name.length > 0) {
			if (users.indexOf(name) == -1) {
				socket.username = name;
				users.push(socket.username);
				console.log(socket.username);
				callback(true);
			} else {
				callback(false);
			}
		}
	});
	socket.on('join', function() {
		console.log(socket.username + ' joined');
		io.emit('join', socket.username);
	});
});



http.listen(6030, function() {
 	console.log('listening on *:6030');
});
