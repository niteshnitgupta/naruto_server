var datetime = require('node-datetime');
var log4js = require('log4js');
var log = log4js.getLogger();

exports.getTeamID = function(team_name, db, callback) {
	var team = {team_name: {$in: [team_name]}};
	var collection = db.collection('team');
	collection.find(team, {fields: {'_id':1}}).toArray(function (err, result) {
		if (err) {
			log.fatal('Unable to read team');
		} else if (result.length) {
			callback(result);
		} else {
			callback("");
		}
	});
}

exports.addTeam = function(team_name, description, db) {
	var team_details = {team_name: team_name, description: description};	
	var collection = db.collection('team');
	collection.insert([team_details], function (err, result) {
		if (err) {
			log.fatal('Unable to insert team');
		} else {
			log.info('team added successfully');
		}
	});
}

exports.getTeamDetails = function(team_name, db, callback) {
	var team = {team_name: team_name};
	var collection = db.collection('team');
	collection.find(team).toArray(function (err, result) {
		if (err) {
			log.fatal('Unable to read Jutsu');
			callback("*");
		} else if (result.length) {
			callback(result);
		} else {
			callback("");
		}
	});
}