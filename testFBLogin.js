var express = require('express');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var express  = require('express');
var app      = express();

passport.use(new FacebookStrategy({
    'clientID' 		: '1861989877370748', // your App ID
	'clientSecret' 	: '91ab901c0b03454498392dbc70eeedb4', // your App Secret
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields   : ['id', 'emails', 'name']
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
});

app.listen(port);