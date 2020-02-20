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
//  Register- Admin View
//=========================

//shows registration form
router.get("/register", middleWare.isAdmin, function(req, res) {
	res.render("user_profiles/register_admin");
});

//handles user registration
router.post("/register", middleWare.isAdmin, function(req, res) {
	var newUser = new User({name: req.body.name ,username: req.body.username,email: req.body.email, role: req.body.role});
	User.register(newUser, req.body.password, function(error, user) {
		if(error) {
			return console.log(error);
		}
		else {
			middleWare.sendConfirmationEmail(req.body.email, req.body.username, req.body.role);
			res.redirect("/campgrounds")
		}
	})
});

//=========================
//  User Role Update
//=========================

//shows form to update user role
router.get("/users/:id/edit", middleWare.isAdmin, function(req, res) {
	User.findById(req.params.id, function(error, foundUser) {
		if(error) {
			res.redirect("/admin");
		}
		else {
			res.render("user_profiles/update_user_role", {user: foundUser});
		}
	});
});

router.post("/users/:userID", middleWare.isAdmin, function(req, res) {
	console.log(req.body.user);
	User.findByIdAndUpdate(req.params.userID, req.body.user , function(error, updatedUser) {
		if(error) {
			res.redirect("/admin/users/" + req.params.userID + "/update");
			req.flash("error", "User Role Did Not Update")
		}
		else {
			req.flash("success", "User Role Updated!");
			res.redirect("/admin/users")
		}
	});
});

//admin profile
router.get("/", middleWare.isLoggedIn, function(req, res) {
	res.render("user_profiles/admin")
});

router.get("/users", middleWare.isAdmin, function(req, res) {
	User.find({}, function(error, allUsers) {
		if(error) {
			console.log(error);
		}
		else {
			res.render("user_list", {users: allUsers});
		}
	});
});

router.delete("/users/:userID/delete", middleWare.isAdmin, function(req, res) {
	User.findByIdAndDelete(req.params.userID, function(error) {
		if(error) {
			res.redirect("/admin/users");
			req.flash("error", "Could Not Delete User!");
		}
		else {
			req.flash("success", "User Deleted!");
			res.redirect("/admin/users");
		}
	})
});

module.exports = router;