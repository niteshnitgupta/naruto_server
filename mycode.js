var express = require('express');
var http = require('http').Server(app);
var mongodb = require('mongodb');
var datetime = require('node-datetime');
var log4js = require('log4js');
var user = require('./model/user');
var clan = require('./model/clan');
var village = require('./model/village');
var team = require('./model/team');

var log = log4js.getLogger();

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://127.0.0.1:27017/naruto';

var app = express();
app.use(express.static(__dirname));

app.get('/getJutsu', function (req, res) {
});

app.get('/', function (req, res) {
	res.send("Completed");
});

app.listen(3000, function(){
	console.log('listening on *:3000');
});

app.get('/setUserVisible', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal('Unable to connect to database');
		} else {
			user.setUserVisible("shikhar", 12.9592, 77.6974, "testStarttime", "testEndtime", db);
		}
	});
	res.send();
});

app.get('/getUserDetails', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal('Unable to connect to database');
			res.send('fatal error');
		} else {
			user.getUserDetails("shikhar", db, function(userdetails) {
				res.send(userdetails);
			});
		}
	});
});

app.get('/saveUser', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal(err);
		} else {
			user.addUser("shikhar", "just add", db);
		}
	});
	res.send();
});

app.get('/saveVillage', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal(err);
			//log.fatal('Unable to connect to database');
		} else {
			village.addVillage("V100", "my village", db);
		}
	});
	res.send();
});

app.get('/saveTeam', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal(err);
			//log.fatal('Unable to connect to database');
		} else {
			team.addTeam("T100", "team alpha", db);
		}
	});
	res.send();
});

app.get('/saveClan', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal(err);
			//log.fatal('Unable to connect to database');
		} else {
			clan.addClan("C100", "morin", db);
		}
	});
	res.send();
});

app.get('/getTeamDetails', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal('Unable to connect to database');
			res.send('fatal error');
		} else {
			team.getTeamDetails("T100", db, function(teamdetails) {
				res.send(teamdetails);
			});
		}
	});

});

app.get('/getClanDetails', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal('Unable to connect to database');
			res.send('fatal error');
		} else {
			clan.getClanDetails("C100", db, function(clandetails) {
				res.send(clandetails);
			});
		}
	});
});

app.get('/getVillageDetails', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal('Unable to connect to database');
			res.send('fatal error');
		} else {
			village.getVillageDetails("V100", db, function(villagedetails) {
				res.send(villagedetails);
			});
		}
	});

});

app.get('/saveUserDetails', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal(err);
			//log.fatal('Unable to connect to database');
		} else {
			user.addUserDetails("shikhar", "1","V100","C100","T100","20","20", db);
		}
	});
	res.send();
});

app.get('/saveUserJutsu', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
			log.fatal(err);
			//log.fatal('Unable to connect to database');
		} else {
			user.addUserJutsu("shikhar", "J100","5","80","90", db);
		}
	});
	res.send();
});
