var middleWare = require("../middleware/index.js"),
	passport = require("passport"),
	express  = require("express"),
	router   = express.Router(),
	User     = require("../models/user"),
	nodemailer = require("nodemailer"),
	MongoClient = require('mongodb').MongoClient,
	crypto = require("crypto"),
	async = require("async");

//=========================
//  Registration Routes
//=========================
	
//shows register form

router.get("/", function(req, res) {
	res.render("user_profiles/register");
});

//Registers user

router.post("/", function(req, res) {
	var newUser = new User({name: req.body.name ,username: req.body.username,email: req.body.email, role: "User"});
	User.register(newUser, req.body.password, function(error, user) {
		if(error) {
			console.log(error);
			return res.render("register")
		}
		passport.authenticate("local")(req, res, function() {
			middleWare.sendConfirmationEmail(req.body.email, req.body.username, "User");
			req.flash("success", "Registration Successful! Check e-mail for confirmation!")
			res.redirect("/campgrounds");
		});
	});
});

module.exports = router;
