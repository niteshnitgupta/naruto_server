var datetime = require('node-datetime');
var log4js = require('log4js');
var log = log4js.getLogger();

function JutsuInVisible() {

}

/*
* This function is used to get the list of ids for jutsu's
* It accepts
*/
var getJutsuID = exports.getJutsuID = function(jutsu_name, db, callback) {
	var jutsu = {jutsu_name: {$in: [jutsu_name]}};
	var collection = db.collection('jutsu_list');
	collection.find(jutsu, {fields: {'_id':1}}).toArray(function (err, result) {
		if (err) {
			log.fatal('Unable to read Jutsu');
		} else if (result.length) {
			callback(result);
		} else {
			callback("");
		}
	});
}

exports.getJutsuDetailsByName = function(jutsu_name, db, callback) {
	var jutsu = {jutsu_name: jutsu_name};
	var collection = db.collection('jutsu_list');
	collection.find(jutsu).toArray(function (err, result) {
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

exports.getJutsuDetailsByID = function(jutsu_id, db, callback) {
	var jutsu = {'_id': jutsu_id};
	var collection = db.collection('jutsu_list');
	collection.find(jutsu).toArray(function (err, result) {
		if (err) {
			log.fatal('Unable to read Jutsu');
			callback("*");
		} else if (result.length) {
			//console.log("1");
			callback(result[0]);
		} else {
			//console.log("2");
			callback({});
		}
	});
}

exports.addJutsu = function (jutsu_name, description, jutsu_level, attack_power, time_to_learn, db) {
	var jutsu = {jutsu_name: jutsu_name, description: description, jutsu_level: jutsu_level, attack_power: attack_power, time_to_learn: time_to_learn};
	var collection = db.collection('jutsu_list');
	collection.insert([jutsu], function (err, result) {
		if (err) {
			log.fatal('Unable to insert Jutsu');
		} else {
			jutsu_id = result.ops[0]._id;
			addJutsuLog(jutsu_id, jutsu_name, "New Jutsu Added", db);
			log.info('Jutsu added successfully');
		}
	});
}

exports.setJutsuVisible = function (jutsu_id, lat, lon, start, end, db, callback) {
	var jutsu = {jutsu_id: jutsu_id, "location":{"type":"Point", "coordinates":[lon, lat]}, start:start, end:end};
	var collection = db.collection('jutsu_location');
	collection.insert([jutsu], function (err, result) {
		if (err) {
			log.fatal('Unable to insert Jutsu');
		} else {
			jutsu_visible_id = result.ops[0]._id;
			addJutsuLog(jutsu_id, jutsu_id, "Jutsu Visible ID: " + jutsu_visible_id, db);
			log.info('Jutsu visible successfully');
		}
		callback();
	});
}

exports.getNearbyJutsu = function(lat, lon, db, callback) {
	var user = {location:{$near:{$geometry:{type:"Point", coordinates:[lon,lat]}, $maxDistance:100000}}};
	 var collection = db.collection('jutsu_location');

	 collection.find(user).toArray(function (err, result) {
		 if (err) {
			 log.fatal('Unable to read user location');
		 } else if (result.length) {
			 callback(result);
		 } else {
			 callback({});
		 }
	 });
}


var addJutsuLog = function (jutsu_id, jutsu_name, logs, db) {
	var currentTimeStamp = datetime.create().format('d/m/Y H:M:S');
	var jutsuLog = {jutsu_id:jutsu_id, jutsu_name: jutsu_name, timestamp: currentTimeStamp, log: logs};
	var collection = db.collection('jutsu_activity_logs');
	collection.insert([jutsuLog], function (err, result) {
		if (err) {
			log.error(err);
		} else {
			log.info('Jutsu log added successfully');
		}
	});
}
