var express = require('express');
var mongodb = require('mongodb');
var datetime = require('node-datetime');
var log4js = require('log4js');
var jutsu = require('./jutsus/jutsu');

var log = log4js.getLogger();

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/naruto';

var app = express();


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

app.get('/', function (req, res) {
	res.send('Hello World');
});

var server = app.listen(8080, function () {
	var host = server.address().address
	var port = server.address().port
})
