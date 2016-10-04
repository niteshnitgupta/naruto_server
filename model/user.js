var datetime = require('node-datetime');
var log4js = require('log4js');
var log = log4js.getLogger();

function getUsersNearMe() {

}

function addUser(username, auth, db, callback) {
	var user = {user_name: user_name, description: description};	
	var collection = db.collection('user_list');
	collection.insert([user], function (err, result) {
		if (err) {
			log.fatal('Unable to insert User');
		} else {
			user_id = result.ops[0]._id;
			addUserLog(user_id, user_name, "New User Added", db);
			log.info('User added successfully');
		}
	});
}

function addUserDetails(user_id, level, village_id, clan_id, team_id, health, chakra) {

}

function updateUserDetails(user_id, level, village_id, clan_id, team_id, health, chakra) {

}



function updateUserActivityLog(user_id, user_name, logs, db, callback) {
	var currentTimeStamp = datetime.create().format('d/m/Y H:M:S');
	var userLog = {user_id:user_id, user_name: user_name, timestamp: currentTimeStamp, log: logs};	
	var collection = db.collection('user_activity_logs');
	collection.insert([userLog], function (err, result) {
		if (err) {
			log.error(err);
		} else {
			log.info('User log added successfully');
		}
	});
}