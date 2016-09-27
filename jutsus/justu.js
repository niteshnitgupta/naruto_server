var datetime = require('node-datetime');
var log4js = require('log4js');
var log = log4js.getLogger();

function GetJutsusNearMe() {

}

function JutsuVisible() {

}

function JutsuInVisible() {

}

function GetJutsuDetails() {

}

exports.addJutsu = function (jutsu_name, description, db) {
	var jutsu = {jutsu_name: jutsu_name, description: description};	
	var collection = db.collection('jutsu_list');
	collection.insert([jutsu], function (err, result) {
		if (err) {
			log.fatal('Unable to insert Jutsu');
		} else {
			jutsu_id = result.ops[0]._id;
			addJutsuLog(jutsu_id, jutsu_name, "New Jutsu Added", db)
			log.info('Jutsu added successfully');
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
		db.close();
	});
}