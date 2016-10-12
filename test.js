var express = require('express');
var http = require('http').Server(app);
var mongodb = require('mongodb');
var datetime = require('node-datetime');
var log4js = require('log4js');
var jutsu = require('./model/jutsu');
var user = require('./model/user');

var log = log4js.getLogger();

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://127.0.0.1:27017/naruto';

var io = require('socket.io')(http);


var app = express();
app.use(express.static(__dirname));

io.set('origins', '*:*');

app.get('/', function(req, res){
	res.sendfile('test.html');
});

var nsp = io.of('/myLocation');
nsp.on('connection', function(socket){


	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal('Unable to connect to database');
			res.send('fatal error');
		} else {
			var username = socket.request._query["username"];
			var lat = parseFloat(socket.request._query["lat"]);
			var lon = parseFloat(socket.request._query["lon"]);
			user.getUserIDs(username, db, function(user_ids) {
				user_id = user_ids[0]._id;
				socket.join(user_id);
				user.setUserVisible(user_id, lat, lon, db, function() {
					user.getNearbyUser(lat, lon, db, function(nearby_user_ids) {
						nearby_user_ids.forEach(function(nearby_user_id){
							socket.broadcast.to(nearby_user_id).emit('nearby_user', "{'user_type': 'student', 'lat': " + lat + ", 'lon': " + lon + "}");
						});
						jutsu.getNearbyJutsu(lat, lon, db, function(nearby_jutsus) {
							socket.emit('nearbyuser',nearby_user_ids);
							socket.emit('nearbyjutsu',nearby_jutsus);
						});
					});
				});
			});
		}
	});



	socket.on('getJutsuDetails', function(data, callback){
		MongoClient.connect(url, function (err, db) {
			if (err) {
				log.fatal('Unable to connect to database');
				res.send('fatal error');
			} else {
				//var temp_jutsu_id= socket.request._query["jutsu_id"];

				var jutsu_id = new mongodb.ObjectID(data.jutsu_id);
				//console.log(data);
				jutsu.getJutsuDetailsByID(jutsu_id,db, function(jutsuDetails){
					callback(jutsuDetails);
					//user.addUserJutsuLearn(data.user_id, jutsu_id, jutsuDetails.jutsu_level, jutsuDetails.attack, jutsuDetails.time_to_learn, db, function(){

					//});
				});
			}
		});
	});




	socket.on('learnNewJutsu', function(data){
		console.log("step2");
		MongoClient.connect(url, function (err, db) {
			if (err) {
				log.fatal('Unable to connect to database');
				res.send('fatal error');
			} else {
				var jutsu_id = new mongodb.ObjectID(data.jutsu_id);
				jutsu.getJutsuDetailsByID(jutsu_id,db, function(jutsuDetails){
					console.log(data.jutsu_id);
					user.getUserIDs(data.username,db,function(user_id){
						console.log("step3");
						user.addUserJutsuLearn(user_id,jutsu_id, jutsuDetails.jutsu_level, jutsuDetails.attack_power, jutsuDetails.time_to_learn, db, function(){
							//socket.emit('newJutsuLearning', jutsuDetails);
	                       console.log("jutsu_added to user");
						});
					})	
				});
			}
		});
	});

	socket.on('disconnect', function () {
		console.log('A user disconnected');
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
