var datetime = require('node-datetime');
var log4js = require('log4js');
var log = log4js.getLogger();
var jutsu = require('./jutsu');
var village = require('./village');
var clan = require('./clan');
var team = require('./team');

var getUserID_InsertIfNotExists = exports.getUserID_InsertIfNotExists = function(fbid, display_name, email, gender, db, callback) {
	var user = {user_name: fbid};
 	var collection = db.collection('user');
 	collection.findOne(user, function (err, result) {
 		if (err) {
 			log.fatal('Unable to read user');
 		} else if(result != null) {
 			callback(result._id);
 		} else {
			 addUser(fbid, display_name, email, gender, db, function (userid) {
				 addUserDetails(userid, 1, "V100", "C100", "T100", 100, 100, db, function(user_id) {
					 callback(user_id);
				 });
			 });
		}
 	});
}

var getUserName = exports.getUserName = function(user_id, db, callback) {
 	var user = {_id: user_id};
 	var collection = db.collection('user');
 	collection.find(user, {fields: {'_id':1}}).toArray(function (err, result) {
 		if (err) {
 			log.fatal('Unable to read user');
 		} else if (result.length) {
 			callback(result);
 		} else {
			var arr = new Array();
 			callback(arr);
 		}
 	});
 }

/**
 * This function is used to get userids
 * @param {string} user_name - Comma separated UserNames
 * @param {dbconnection} db
 * @param {callback} callback
 */
 var getUserIDs = exports.getUserIDs = function(user_name, db, callback) {
 	var user = {user_name: {$in: [user_name]}};
 	var collection = db.collection('user');
 	collection.find(user, {fields: {'_id':1}}).toArray(function (err, result) {
 		if (err) {
 			log.fatal('Unable to read user');
 		} else if (result.length) {
 			callback(result);
 		} else {
			var arr = new Array();
 			callback(arr);
 		}
 	});
 }

 var addUser = exports.addUser = function(fbid, display_name, email, gender, db, callback) {
 	var user = {user_name: fbid, email_id: email, display_name: display_name, gender: gender};
 	var collection = db.collection('user');
 	collection.insert([user], function (err, result) {
 		if (err) {
 			log.fatal('Unable to insert User');
 		} else {
 			user_id = result.ops[0]._id;
 			addUserLog(user_id, fbid, "New User Added", db, function(){
 				log.info('User added successfully');
				callback(user_id);
 			});
 		}
 	});
 }

 var addUserDetails = exports.addUserDetails = function(user_id, level, village_name, clan_name, team_name, health, chakra, db, callback) {
 		village.getVillageID(village_name, db, function(village_id) {
 			clan.getClanID(clan_name, db, function(clan_id) {
 				team.getTeamID(team_name, db, function(team_id) {
 					var userDetails= {user_id:user_id,level:level,village_id:village_id,clan_id:clan_id,team_id:team_id,health:health,chakra:chakra};
 					var collection = db.collection('user_details');
 					collection.insert([userDetails], function (err, result) {
 						if (err) {
 							log.fatal('Unable to insert User Details');
 						} else {
 							addUserLog(user_id, user_id, "New Activity added", db, function(){
 								log.info('User Details added successfully');
 							});
 						}
						callback(user_id);
 					});
 				});
 			});
 	});
 }

 exports.addUserJutsu = function(user_id,Jutsu_name,Jutsu_level,attack,defense, db, callback) {
 		var jutsu_id = jutsu.getJutsuID(Jutsu_name, db, function(jutsu_id){
 			var user_jutsu = {user_id: user_id,jutsu_id: jutsu_id, Jutsu_level:Jutsu_level,attack:attack,defense:defense};
 			var collection = db.collection('user_jutsu');
 			collection.insert([user_jutsu], function (err, result) {
 				if (err) {
 					log.fatal('Unable to insert User Jutsu');
 				} else {
 					addUserLog(user_id, user_name, "New User Jutsu Added", db, function(){
 						log.info('User Jutsu added successfully');
 					});
 				}
 			});
 	});
 }

 exports.addUserJutsuLearn = function(user_id, jutsu_id, jutsu_level, attack, time_to_learn, db, callback) {

 			var user_jutsu_learn = {user_id: user_id,jutsu_id: jutsu_id, Jutsu_level:jutsu_level,attack:attack,time_to_learn:time_to_learn};
 			var collection = db.collection('user_jutsu_learn');
 			collection.insert([user_jutsu_learn], function (err, result) {
 				if (err) {
 					log.fatal('Unable to insert User Jutsu Learn');
 				} else {
 					addUserLog(user_id, user_id, "New User Jutsu Added For Learning", db, function(){
 						log.info('User Jutsu Learn added successfully');
 					});
 				}
        callback();
 			});
 }

 exports.setUserVisible = function (user_id, lat, lon, db, callback) {
 		var user = {"user_id": user_id, "location":{"type":"Point", "coordinates":[lon, lat]}};
 		var collection = db.collection('user_location');
 		collection.update({"user_id": user_id}, {$set:user}, {upsert:true}, function (err, result) {
 			if (err) {
 				log.fatal('Unable to insert user');
 			} else {
        addUserLog(user_id, user_id, "User Visible ID", db);
 				log.info('user visible successfully');
        callback();
 			}
 		});
 }

 exports.getNearbyUser = function(lat, lon, db, callback) {
   var user = {location:{$near:{$geometry:{type:"Point", coordinates:[lon,lat]}, $maxDistance:10000}}};
  	var collection = db.collection('user_location');

  	collection.find(user).toArray(function (err, result) {
  		if (err) {
  			log.fatal('Unable to read user location');
  		} else if (result.length) {
  			callback(result);
  		} else {
  			callback("");
  		}
  	});
 }




 exports.loadJutsuDetails = function(user_id, db, callback) {
  var user = {user_id: user_id};
  var collection = db.collection('user_details');
  collection.find(user).toArray(function (err, result) {
    if (err) {
      log.fatal('Unable to read Data');
      callback("*");
    } else if (result.length) {
      callback(result);
    } else {
      callback("");
    }
  });
 }




 exports.getUserDetails = function(user_id, db, callback) {
  var user = {user_id:user_id};
  var collection = db.collection('user_details');
  collection.findOne(user, function (err, result) {
    if (err) {
      log.fatal('Unable to read Data');
      callback("*");
    } else if (result) {
			callback(result);
    } else {
      callback("");
    }
  });
}




 function addUserLog(user_id, user_name, logs, db, callback) {
 	var currentTimeStamp = datetime.create().format('d/m/Y H:M:S');
 	var userLog = {user_id:user_id, user_name: user_name, timestamp: currentTimeStamp, log: logs};
 	var collection = db.collection('user_activity_logs');
 	collection.insert([userLog], function (err, result) {
 		if (err) {
 			log.error(err);
 		} else {
 			log.info('User log added successfully');
			 if (callback !== undefined) {
				 callback();
			 }
 		}
 	});
 }
