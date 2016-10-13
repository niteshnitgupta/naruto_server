// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1861989877370748', // your App ID
		'clientSecret' 	: '91ab901c0b03454498392dbc70eeedb4', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	}

};