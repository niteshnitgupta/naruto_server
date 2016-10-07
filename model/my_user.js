
var datetime = require('node-datetime');
var log4js = require('log4js');
var log = log4js.getLogger();



function getUsersNearMe() {

}


///////////////////////////////////////////////////////////getting id////////////////////////////////////

//function to get user 
function getUserID(user_name, db, callback) {
	var user = {user_name: {$in: [user_name]}};
	var collection = db.collection('user');
	collection.find(user, {fields: {'_id':1}}).toArray(function (err, result) {
		if (err) {
			log.fatal('Unable to read user');
		} else if (result.length) {
			callback(result);
		} else {
			callback("");
		}
	});
}



//to get jutsu id for User-Jutsu function
function getJutsuID(jutsu_name, db, callback) {
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






//function to get user  village id
function getVillageID(village_name, db, callback) {
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






//function to get user  clan id
function getClanID(clan_name, db, callback) {
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






//function to get user  team id
function getTeamID(team_name, db, callback) {
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







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



exports.addUser=function( user_name, description, db, callback) {
	var user = {user_name: user_name, description: description};	
	var collection = db.collection('user');
	collection.insert([user], function (err, result) {
		if (err) {
			log.fatal('Unable to insert User');
		} else {
			user_id = result.ops[0]._id;
			addUserLog(user_id, user_name, "New User Added", db, function(){
				log.info('User added successfully');	
			});
		}
	});
}





exports.getUserDetails = function(user_name, db, callback) {
	var user = {user_name: user_name};
	var collection = db.collection('user');
	collection.find(user).toArray(function (err, result) {
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






function updateUserDetails(user_id, level, village_id, clan_id, team_id, health, chakra) {

}



function addUserActivityLog(user_id, user_name, logs, db, callback) {
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
















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





//mycode start here
//for user visibility


exports.setUserVisible = function (user_name, lat, lon, start, end, db) {
	getUserID(user_name, db, function(user_id){
		var user = {user_id: user_id[0]._id, loc:{lon: lon, lat:lat}, start:start, end:end};
		var collection = db.collection('user_location');
		collection.insert([user], function (err, result) {
			if (err) {
				log.fatal('Unable to insert user');
			} else {
				user_visible_id = result.ops[0]._id;
				addUserLog(user_id, user_name, "Jutsu Visible ID: " + user_visible_id, db);
				log.info('user visible successfully');
			}
		});
	});
}




//add user log
var addUserLog = function (user_id, user_name, logs, db) {
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


//add village
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


//get village details
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







//add clan
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


//get clan details
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


//add team
exports.addTeam = function (team_name, description, db) {
	var team_details = {team_name: team_name, description: description};	
	var collection = db.collection('team');
	collection.insert([team_details], function (err, result) {
		if (err) {
			log.fatal('Unable to insert team');
		} else {
			user_id = result.ops[0]._id;
			addUserLog(user_id, team_name, "New team Added", db, function(){
				log.info('team added successfully');	
			});
		}
	});
}

//get team details
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















//add user_details
exports.addUserDetails = function(user_name, level, village_name, clan_name, team_name, health, chakra,db,callback) {

var user_id = getUserID(user_name, db, function(user_id){});
var village_id = getVillageID(village_name, db, function(village_id){});
var clan_id = getClanID(clan_name, db, function(clan_id){});
var team_id = getTeamID(team_name, db, function(team_id){});

var userDetails= {user_id:user_id,level:level,village_id:village_id,clan_id:clan_id,team_id:team_id,health:health,chakra:chakra};
	var collection = db.collection('user_details');
	collection.insert([userDetails], function (err, result) {
		if (err) {
			log.fatal('Unable to insert User Details');
		} else {
			//user_id = result.ops[0]._id;
			addUserLog(user_id, user_name, "New Activity added", db, function(){
				log.info('User Details added successfully');	
			});
		}
	});
}





//add User-jutsu
exports.addUserJutsu = function(user_name,Jutsu_name,Jutsu_level,attack,defense, db, callback) {
	var user_id = getUserID(user_name, db, function(user_id){});
	var jutsu_id = getJutsuID(Jutsu_name, db, function(jutsu_id){});

	var user_jutsu = {user_id: user_id,jutsu_id: jutsu_id, Jutsu_level:Jutsu_level,attack:attack,defense:defense};	
	var collection = db.collection('user_jutsu');
	collection.insert([user_jutsu], function (err, result) {
		if (err) {
			log.fatal('Unable to insert User Jutsu');
		} else {
			//user_id = result.ops[0]._id;
			addUserLog(user_id, user_name, "New User Jutsu Added", db, function(){
				log.info('User Jutsu added successfully');	
			});
		}
	});
}



// //get User-jutsu details
// exports.getUser_jutsuDetails = function(team_name, db, callback) {
// 	var team = {team_name: team_name};
// 	var collection = db.collection('team');
// 	collection.find(team).toArray(function (err, result) {
// 		if (err) {
// 			log.fatal('Unable to read Jutsu');
// 			callback("*");
// 		} else if (result.length) {
// 			callback(result);
// 		} else {
// 			callback("");
// 		}
// 	});
// }


