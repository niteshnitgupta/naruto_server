var datetime = require('node-datetime');
var log4js = require('log4js');
var log = log4js.getLogger();

exports.getVillageID = function (village_name, db, callback) {
	var village = {village_name: {$in: [village_name]}};
	var collection = db.collection('village');
	collection.find(village, {fields: {'_id':1}}).toArray(function (err, result) {
		if (err) {
			log.fatal('Unable to read village');
		} else if (result.length) {
			callback(result);
		} else {
			callback("");
		}
	});
}

exports.addVillage = function (village_name, description, db) {
	var village_details = {village_name: village_name, description: description};	
	var collection = db.collection('village');
	collection.insert([village_details], function (err, result) {
		if (err) {
			log.fatal('Unable to insert village');
		} else {
			log.info('village added successfully');
		}
	});
}

exports.getVillageDetails = function(village_name, db, callback) {
	var village = {village_name: village_name};
	var collection = db.collection('village');
	collection.find(village).toArray(function (err, result) {
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