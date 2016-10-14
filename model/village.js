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
			console.log(result[0]._id);
			callback(result[0]._id);
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

exports.getVillageDetails = function(village_id, db, callback) {
	var village = {_id: village_id};
	var collection = db.collection('village');
	collection.find(village).toArray(function (err, result) {
		if (err) {
			log.fatal('Unable to read data');
			callback("*");
		} else if (result.length) {
			console.log("village");
			console.log(result[0]);
			callback(result[0]);
		} else {
			callback("");
		}
	});
}