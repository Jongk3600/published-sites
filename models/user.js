var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose"),
	bcrypt 				  = require("bcrypt-nodejs");

var UserSchema = new mongoose.Schema({
	name: String,
	username: String,
	email: {type: String, unique: true, required: true},
	password: String,
	role: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);