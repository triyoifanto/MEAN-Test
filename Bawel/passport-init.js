//model from db
var User = require('./models/models');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');//bcrypt-nodejs

module.exports = function(passport){
	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function (user, done) {
		// tell passport which id to use for user
		 console.log('serialize user:', user.username);
		 done(null, user._id);
	});

	//Desieralize user will call with the unique id provided by serializeuser
	passport.deserializeUser(function (id, done) {
		User.findById(id, function(err, user) {
			console.log('deserializing user:',user.username);
			// return user object back
			done(err, user);
		});
	});

	passport.use('login', new LocalStrategy({
		passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function (req, username, password, done) {
			User.findOne({'username': username}, 
				function (err, user) {
					// In case of any error, return using the done method
					if(err){
						return done(err);
					}
					// Username does not exist, log the error and redirect back
					if(!user){
						console.log('User not found with username ' + username);
						return done(null, false);
					}
					// User exists but wrong password, log the error 
			        if (!isValidPassword(user, password)){
			            console.log('Invalid Password');
			            return done(null, false); // redirect back to login page
			        }

			        // User and password both match, return user from done method
			        // which will be treated like success
			        return done(null, user);
				}
			);
		}
	));

	passport.use('signup', new LocalStrategy({
		passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		// callback function
		function (req, username, password, done) {
			User.findOne({username: username}, 
				function (err, user) {
					if(err){
						return done(err, false);
					} 

					if(user){
						//user name already taken
						return done('username already exsists', false);
					}

					var newUser = new User();
					newUser.username = username;
					newUser.password = createHash(password);

					newUser.save(function (err, user) {
						if(err){
							return done(err, false);
						}

						console.log('sucessfull signed up user ' + username);

						return done(null, user);
					});
				}
			);
		}
	));

	// utility functions for checking passwords
	var isValidPassword = function (user, password) {
		 return bCrypt.compareSync(password, user.password);		 
	};

	// utility functions for hashing
	var createHash = function (password) {
		 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};
};