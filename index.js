var express = require('express');
var http = require('http').Server(app);
var mongodb = require('mongodb');
var datetime = require('node-datetime');
var log4js = require('log4js');
var jutsu = require('./model/jutsu');


var log = log4js.getLogger();

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://127.0.0.1:27017/naruto';

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
                        // Console.log(err);
			log.fatal(err);
		} else {
			jutsu.addJutsu("J105", "Jutsu king", db);
		}
	});
	res.send();
});

app.get('/setJutsuVisible', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal('Unable to connect to database');
		} else {
			jutsu.setJutsuVisible("J101",  76.810272,29.906924, "testStarttime", "testEndtime", db);
		}
	});
	res.send();
});

app.get('/getJutsu', function (req, res) {

});

app.get('/', function (req, res) {
	res.send("Completed");
});

app.listen(3000, function(){
  console.log('listening on *:3000');
});