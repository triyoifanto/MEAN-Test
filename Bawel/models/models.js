var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	text: String,
	created_by: String,//{type: mongoose.Schema.ObjectId, ref: 'User'},
	created_at: {type: Date, default: Date.now}
});

var userSchema = new mongoose.Schema({
	username: String,
	password: String, //hash created from password
	created_at: {type: Date, default: Date.now}
});

//declare a model colled Post which have schema postSchema
mongoose.model("Post", postSchema);
//declare a model colled User which have schema userSchema
mongoose.model("User", userSchema);


//utility functions
var User = mongoose.model('User');
exports.findByUsername = function(userName, callback){

	User.findOne({ user_name: userName}, function(err, user){

		if(err){
			return callback(err);
		}

		//success
		return callback(null, user);
	});

}

exports.findById = function(id, callback){

	User.findById(id, function(err, user){

		if(err){
			return callback(err);
		}

		return callback(null, user);
	});
}