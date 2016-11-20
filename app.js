var express = require('express');
var app = express();
var server 	= require('http').Server(app);
var io = require('socket.io').listen(server);
var Bleacon = require('bleacon');
var _ = require('underscore');
var knownBeacons = require('./beacons.json');

// CONFIGURE WEB SERVER
app.use(express.static('public'));
server.listen(80, function () {
	console.log('Webserver running');
});

// CONFIGURE SOCKET
var activeSocket = false;
io.on('connection', function(socket){
	console.log('SOCKET: Connection');
	activeSocket = socket;
});

// CONFIGURE BLUETOOTH
Bleacon.startScanning(
	// '96111882686d4ae8877756625c10fe0a'
);

Bleacon.on('discover', function(peripheral){
	console.log(peripheral);
	
	var foundBeacon = _.find(knownBeacons, function(knownBeacon){
		return peripheral.minor == knownBeacon.minor;
	});

	if(foundBeacon){
		if(activeSocket){
			activeSocket.emit('beacon', foundBeacon);
		}
	}
});


