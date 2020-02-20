var nodemailer = require("nodemailer");
var middlewareObjects = {};

//checks to see if a user is logged in
middlewareObjects.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("success", "Please Log in!");
	res.redirect("/login");
}

//checks if user is an admin
middlewareObjects.isAdmin = function(req, res, next) {
	if(req.user) {
		if(req.user.role == "Admin") {
			return next();
		}
		else if(req.user.role == "User") {
			return res.render("requireAdmin");
		}
	}
	res.redirect("/login")
}

//determines which profile to go to
middlewareObjects.checkRole = function(req, res, next) {
	if(req.user) {
		if(req.user.role == "Admin") {
			return res.redirect("/admin");
		}
		else if(req.user.role == "User") {
			return next();
		}
	}
	res.redirect("/login")
}

//sends user account creation confirmation
middlewareObjects.sendConfirmationEmail = function(email, username, role) {
	var transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "jkaufmandeveloper@gmail.com",
			pass: "Bamboo3600!"
  	}
	});	
	var mailOptions = {
	  from: "jkaufmandeveloper@gmail.com",
	  to: email,
	  subject: "Account Confirmation",
	  text: "Welcome to Yelp Camp! Thank you for registering. Your account information is below \n \nUsername: " + username +"\nRole: " + role + " \n \nFrom,\nThe Yelp Camp Team  "
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
		console.log(error);
	  } else {
		console.log('Email sent: ' + info.response);
	  }
	});
}

middlewareObjects.sendRequestEmail = function(email, username, name, location) {
	var transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "jkaufmandeveloper@gmail.com",
			pass: "Bamboo3600!"
  	}
	});	
	var mailOptions = {
	  from: "Yelp Camp <jkaufmandeveloper@gmail.com>",
	  to: "jkaufman3600@gmail.com",
	  subject: "New Campsite Request",
	  text: "A new campground request has been submitted by " + username + ". Please review the request and notify the user whether the request has been approved or denied at the following email address: " + email + ". Below are the request details.\n\nCampsite Name: " + name + "\nCampsite Location: " + location
	};
	
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
		console.log(error);
	  } else {
		  req.flash("success", "Campground Request Sent!");
		  console.log('Email sent: ' + info.response);
	  }
	});
};
	
middlewareObjects.sendRequestConfirmationEmail = function(email, username, name, location) {
	var transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "jkaufmandeveloper@gmail.com",
			pass: "Bamboo3600!"
  	}
	});	
	var mailOptions = {
	  from: "Yelp Camp <jkaufmandeveloper@gmail.com>",
	  to: "jkaufman3600@gmail.com",
	  subject: "New Campsite Request",
	  text: "Thank you for submitting a new campsite request. We have recieved your request and will get back to you once we have reviewed your request. Below are the request details.\n\nCampsite Name: " + name + "\nCampsite Location: " + location + "\n\n From,\nYelp Camp Team"
	};
	
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
		console.log(error);
	  } else {
		console.log('Email sent: ' + info.response);
	  }
	});
};

middlewareObjects.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.commentID, function(error, foundComment) {
			if(error) {
				res.redirect("back");
			}
			else {
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				}
				else if(req.user.role == "Admin") {
					next();
				}
				else {
					req.flash("error", "You are not the author of this comment!");
					res.redirect("back");
				}
			}
		});
	}
	else {
		res.redirect("back");
		req.flash("error", "Please Sign In!");
	}
}

module.exports = middlewareObjects;