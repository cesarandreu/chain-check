
var gaze = require('gaze');
var request = require('superagent');
var fs = require('fs');
var path = require('path');

function uploadFile(filepath) {
	// var formData = {
	// 	file: fs.createReadStream(filepath),
	// 	timestamp: Date.now()
	// };
	// request.post({url:'http://166574fa.ngrok.com/api/devices/foo', formData: formData}, function callbackMaybe(err, httpResponse, body) {
	// 	if (err) {
	// 		return console.error('upload failed:', err);
	// 	}
	// 	console.log('Upload successful!  Server responded with:', body);
	// 	console.log(filepath + ' pushed to server, deleting...');
	// 	fs.unlink(filepath);
	// });

	request.post('http://166574fa.ngrok.com/api/devices/foo3')
		.attach('file', filepath)
		.field('timestamp', Date.now())
		.end(function(err, resp) {
			if (err) {
				return console.error('upload failed:', err);
			}
		console.log('Upload successful!  Server responded with:', resp);
		console.log(filepath + ' pushed to server, deleting...');
		fs.unlink(filepath);
	});
}

fs.openSync(__dirname + '/tmp.wav', 'w');

gaze('**/*.wav', function(err, watcher) {
	this.watched(function(err, watched) {
		console.log(watched);
	});
	this.on('added', function(filepath) {
		console.log(filepath + ' was added, pushing to server...');
		uploadFile(filepath)
	});
});

