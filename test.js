var express = require('express');
var app = express();
var http = require('http').Server(app);
var mongodb = require('mongodb');
var datetime = require('node-datetime');
var log4js = require('log4js');
var passport = require('passport');
var session = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;
var jwt = require('jwt-simple');
var moment = require('moment');

var jutsu = require('./model/jutsu');
var user = require('./model/user');
var clan = require('./model/clan');
var team = require('./model/team');
var village = require('./model/village');

var log = log4js.getLogger();

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://127.0.0.1:27017/naruto';

var io = require('socket.io')(http);
passport.serializeUser(function (user, done) {
	done(null, user);
});
passport.deserializeUser(function (obj, done) {
	done(null, obj);
});
passport.use(new FacebookStrategy({
	clientID: '1861989877370748',
	clientSecret: '91ab901c0b03454498392dbc70eeedb4',
	callbackURL: 'http://localhost:8080/auth/facebook/callback',
	profileFields: ['id', 'emails', 'name', 'displayName', 'gender']
},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			return done(null, profile);
		});
	}
));


app.use(express.static(__dirname));
app.use(session({secret: 'my_precious', saveUninitialized: true, resave: true }));
app.set('jwtTokenSecret', 'YOUR_SECRET_STRING');
app.use(passport.initialize());
app.use(passport.session());

io.set('origins', '*:*');

app.get('/auth/facebook', passport.authenticate('facebook'), function (req, res) {
	console.log(req); 

});

app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/' }), function (req, res) {
	MongoClient.connect(url, function (err, db) {
		user.getUserID_InsertIfNotExists(req.user.id, req.user.displayName, "ssf", req.user.gender, db, function(result){
			db.close();
			var expires = moment().add('days', 365).valueOf();
			var token = jwt.encode({
				iss: result,
				exp: expires
			}, app.get('jwtTokenSecret'));
			res.send("<script type=\"text/javascript\">opener.postMessage(\"" + token + "\",'*'); window.close();</script>");			
		});
	});
});

app.get('/auth', function(req, res) {
	var userid = new mongodb.ObjectID(jwt.decode(req.query.token, app.get('jwtTokenSecret')).iss);
	console.log(userid);
	MongoClient.connect(url, function (err, db) {
		user.getUserName(userid, db, function(user){
			console.log(user);
			if (user.length) {
				res.send("authorized");
			} else {
				res.send("unauthorized");
			}
		});
	});
});

app.get('/', function(req, res){
	MongoClient.connect(url, function (err, db) {
		user.getUserID_InsertIfNotExists("userid", "username", "emailid", "gender", db, function(result){
			console.log(result);
		});
		res.send();
	});
});

var nsp = io.of('/myLocation');
nsp.on('connection', function(socket){


	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log(err);
			log.fatal('Unable to connect to database');
		} else {
			var username = socket.request._query["username"];
			var lat = parseFloat(socket.request._query["lat"]);
			var lon = parseFloat(socket.request._query["lon"]);
			user.getUserIDs(username, db, function(user_ids) {
				user_id = user_ids[0]._id;
				socket.join(user_id);
				user.setUserVisible(user_id, lat, lon, db, function() {
					user.getNearbyUser(lat, lon, db, function(nearby_user_ids) {
						/* We may need to delete this */
						nearby_user_ids.forEach(function(nearby_user_id){
							socket.broadcast.to(nearby_user_id).emit('nearby_user', "{'user_type': 'student', 'lat': " + lat + ", 'lon': " + lon + "}");
						});
						/******************************/

						jutsu.getNearbyJutsu(lat, lon, db, function(nearby_jutsus) {
							socket.emit('nearbyuser',nearby_user_ids);
							socket.emit('nearbyjutsu',nearby_jutsus);
							db.close();
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
				var jutsu_id = new mongodb.ObjectID(data.jutsu_id);
				jutsu.getJutsuDetailsByID(jutsu_id,db, function(jutsuDetails){
					db.close();
					callback(jutsuDetails);
					//user.addUserJutsuLearn(data.user_id, jutsu_id, jutsuDetails.jutsu_level, jutsuDetails.attack, jutsuDetails.time_to_learn, db, function(){
					//});
			});
			}
		});
	});




	socket.on('learnNewJutsu', function(data){
		MongoClient.connect(url, function (err, db) {
			if (err) {
				log.fatal('Unable to connect to database');
				res.send('fatal error');
			} else {
				var jutsu_id = new mongodb.ObjectID(data.jutsu_id);
				jutsu.getJutsuDetailsByID(jutsu_id,db, function(jutsuDetails){
					user.getUserIDs(data.username,db,function(user_id){
						user.addUserJutsuLearn(user_id,jutsu_id, jutsuDetails.jutsu_level, jutsuDetails.attack_power, jutsuDetails.time_to_learn, db, function(){
							db.close();
							console.log("jutsu_added to user");
						});
					})	
				});
			}
		});
	});



	socket.on('adduserDetails', function(data){
		MongoClient.connect(url, function (err, db) {
			if (err) {
				log.fatal('Unable to connect to database');
				res.send('fatal error');
			} else {
				user.getUserIDs(data.username,db,function(user_id){
					user.addUserDetails(data.username,data.level, data.village_name, data.clan_name, data.team_name, data.health, data.chakra, db, function(){
						db.close();
						console.log("jutsu_added to user");
					});
				});	
			}
		});
	});





	socket.on('GetuserDetails', function(data,callback){
		MongoClient.connect(url, function (err, db) {
			if (err) {
				log.fatal('Unable to connect to database');
				res.send('fatal error');
			} else {
				user.getUserIDs(data.username,db,function(user_id){
					user.getUserDetails(user_id, db, function(data_user){
						clan.getClanDetails(data_user.clan_id,db,function(data_clan){
							team.getTeamDetails(data_user.team_id,db,function(data_team){
								village.getVillageDetails(data_user.village_id,db,function(data_village){
                                    var all_data={level:data_user.level,village_name:data_village.village_name,clan_name:data_clan.clan_name,team_name:data_team.team_name,health:data_user.health,chakra:data_user.chakra};
                                    db.close();
									callback(all_data);
                                });
							});
						});
						console.log("data send");
					});
				});	
			}
		});
	});



	socket.on('MyJutsuDetails', function(data){
		MongoClient.connect(url, function (err, db) {
			if (err) {
				log.fatal('Unable to connect to database');
				res.send('fatal error');
			} else {
				user.getUserIDs(data.username,db,function(user_id){
					user.loadJutsuDetails(user_id, db, function(){
						db.close();
						console.log("jutsu_details loaded");
					});
				});	
			}
		});
	});

	socket.on('disconnect', function () {
		console.log('A user disconnected');
	});
});

http.listen(8080, function(){
	console.log('listening on *:3000');
});
//app.listen(8080);