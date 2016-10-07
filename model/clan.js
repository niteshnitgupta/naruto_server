var datetime = require('node-datetime');
var log4js = require('log4js');
var log = log4js.getLogger();

exports.getClanID = function(clan_name, db, callback) {
	var clan = {clan_name: {$in: [clan_name]}};
	var collection = db.collection('clan');
	collection.find(clan, {fields: {'_id':1}}).toArray(function (err, result) {
		if (err) {
			log.fatal('Unable to read clan');
		} else if (result.length) {
			callback(result);
		} else {
			callback("");
		}
	});
}

exports.addClan = function (clan_name, description, db) {
	var clan_details = {clan_name: clan_name, description: description};	
	var collection = db.collection('clan');
	collection.insert([clan_details], function (err, result) {
		if (err) {
			log.fatal('Unable to insert clan');
		} else {
			log.info('clan added successfully');
		}
	});
}

exports.getClanDetails = function(clan_name, db, callback) {
	var clan = {clan_name:clan_name};
	var collection = db.collection('clan');
	collection.find(clan).toArray(function (err, result) {
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