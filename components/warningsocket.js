
var app = require('http').createServer(handler),
io = require('socket.io').listen(app, { log: false }),
fs = require('fs');
app.listen(8001);

function handler(req, res) {
	console.log("here in handler");
	fs.readFile(__dirname + '/client1.html', function(err, data) {
		if (err) {
			console.log(err);
			res.writeHead(500);
			return res.end('Error loading client1.html');
		}
		res.writeHead(200);
		console.log("OK");
		res.end(data);
	});
}

function blink_light() {
	var spawn = require('child_process').spawn,
	// Turn on and off pin <p> for <n> cycles.
	blink = spawn('/home/root/components/blink/blink', ['-p', '8', '-n', '5']);
	
	blink.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});

	blink.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

	blink.on('close', function (code) {
		console.log('child process exited with code ' + code);
	});
}

io.sockets.on('connection', function (socket) {
	console.log("connected to client!");
	socket.emit("serverMessage","server says hi");
	socket.on('clientMessage', function (d) {
		console.log("client says: " + d);
  		// Check if client message received is our own ID, if yes, then perform action...
  		blink_light();
  	});
});