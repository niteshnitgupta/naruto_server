var express = require('express');
var mongodb = require('mongodb');
var datetime = require('node-datetime');
var log4js = require('log4js');
var jutsu = require('./model/jutsu');
var user = require('./model/user');


var log = log4js.getLogger();

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://127.0.0.1:27017/naruto';

MongoClient.connect(url, function (err, db) {
	if (err) {
		log.fatal('Unable to connect to database');
		res.send('fatal error');
	} else {

		var user_names = ["U001", "U002", "U003"];
		var lats = [1,2,3];
		var lons = [9,8,7];
		for (var i=0; i<3; i++) {
			var user_name = user_names[i];
			user.addUser(user_name, "Auth", db, function(){
			});
		}

		var userids = [];
		setTimeout(function () {
			for (var i=0; i<3; i++) {
				var user_name = user_names[i];
				user.getUserIDs(user_name, db, function(user_ids){
					userids.push(user_ids[0]._id);
				});
			}
			setTimeout(function(){
				for (var i=0; i<3; i++) {
					var userid = userids[i];
					var lat = lats[i];
					var lon = lons[i];
					user.setUserVisible(userid, lat, lon, db, function(){
						console.log("User Added");
					});
				}
			},5000);
		}, 1000);







		var jutsu_names = ["J001", "J002", "J003"];
		var descriptions = ["D001", "D002", "D003"];
		var attack_powers = [12,43,56];
		var time_to_learns = [4,8,9];
		var lats = [1,2,3];
		var lons = [9,8,7];

		for (var i=0; i<3; i++) {
			var jutsu_name = jutsu_names[i];
			var description = descriptions[i];
			var attack_power = attack_powers[i];
			var time_to_learn = time_to_learns[i];
			jutsu.addJutsu(jutsu_name, description, description, attack_power, time_to_learn, db);
		}

		var jutsuids = [];
		setTimeout(function () {
			for (var i=0; i<3; i++) {
				var jutsu_name = jutsu_names[i];
				jutsu.getJutsuID(jutsu_name, db, function(jutsuid){
					jutsuids.push(jutsuid[0]._id);
				});
			}
			setTimeout(function(){
				for (var i=0; i<3; i++) {
					var jutsuid = jutsuids[i];
					var lat = lats[i];
					var lon = lons[i];
					jutsu.setJutsuVisible(jutsuid, lat, lon, 12, 32, db, function(){
						console.log("Jutsu Added");
					});
				}
			},5000);
		}, 1000);
	}
});

/*
var app = express();

app.use(express.static(__dirname));

app.get('/', function (req, res) {
	res.send("Completed");
});

app.listen(3000, function(){
  console.log('listening on *:3000');
});
*/
