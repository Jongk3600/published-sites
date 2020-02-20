var MongoClient = require('mongodb').MongoClient,
	middleWare = require("../middleware/index.js"),
	nodemailer  = require("nodemailer"),
	Campground  = require("../models/campground"),
	passport    = require("passport"),
	express     = require("express"),
	crypto 	    = require("crypto"),
	router      = express.Router(),
	User        = require("../models/user"),
	async 		= require("async");

//=========================
//        Routes
//=========================

router.get("/about", function(req, res) {
	res.render("about");
});

//shows form to update profile
router.get("/update", middleWare.isLoggedIn, function(req,res) {
	res.render("user_profiles/update", {name: req.user.name})
});

//updates user profile in database
router.post("/update", middleWare.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.newusername;
	var url = "mongodb://localhost:27017/yelp_camp_v12";
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
	  	var myquery = {username: username };
	  	db.collection('users').update ({username: username}, {$set: {
			name: name,
			username: username,
			email: email
		 }
		 }, function (err, result) {
			  if (err) {
			  console.log(err);
			} else {
			 rew.flash("success", "Profile Updated!");
			 res.redirect("/profile");
		 }
		});
	});
});

//=========================
//  User Profiles
//=========================

//user profile
router.get("/profile", middleWare.checkRole, function(req, res) {
	res.render("user_profiles/profile");
});

module.exports = router