/*var express = require('express');
var http = require('http').Server(app);
var mongodb = require('mongodb');
var datetime = require('node-datetime');
var log4js = require('log4js');
var jutsu = require('./jutsus/jutsu');


var log = log4js.getLogger();

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/naruto';

var app = express();

app.use(express.static(__dirname));


app.get('/getJutsuDetails', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal('Unable to connect to database');
			res.send('fatal error');
		} else {
			jutsu.getJutsuDetails("J100", db, function(jutsudetails) {
				res.send(jutsudetails);
			});
		}
	});

});

app.get('/saveJutsu', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal('Unable to connect to database');
		} else {
			jutsu.addJutsu("J100", "Jutsu Sharingan", db);
		}
	});
	res.send();
});

app.get('/getJutsu', function (req, res) {

});

app.get('/testSocket', function (req, res) {
	res.sendfile('test.html');
});*/


var express = require('express');
var datetime = require('node-datetime');
var app = express();
app.use(express.static(__dirname));

var http = require('http').Server(app);
var io = require('socket.io')(http);
io.set('origins', '*:*');



app.get('/', function(req, res){
	res.sendfile('test.html');
});



var nsp = io.of('/myLocation');
var i = 0;
nsp.on('connection', function(socket){
	i++;
	var currentTimeStamp = datetime.create().format('d/m/Y H:M:S');
	if (i % 2 == 0) {
		console.log('Room1');
		socket.join('Room1');
		socket.broadcast.to('Room2').emit('msg', "Joined Room 1 : " + currentTimeStamp);
	} else {
		console.log('Room2');
		socket.join('Room2');
		socket.broadcast.to('Room1').emit('msg', "Joined Room 2 : " + currentTimeStamp);
	}

	socket.on('disconnect', function () {
		console.log('A user disconnected');
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});