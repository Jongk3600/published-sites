var middleWare = require("../middleware/index.js"),
	Campground = require("../models/campground"),
	nodemailer = require("nodemailer"),
	express = require("express"),
	router  = express.Router();

router.get("/", function(req, res) {
	Campground.find({}, function(error,allcampgrounds) {
		if(error){
			console.log(error);
		}
		else {
			res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user});
		}
	});
});

router.get("/request", middleWare.isLoggedIn, function(req, res) {
	res.render("campgrounds/request");
});

router.post("/request", middleWare.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var location = req.body.location;
	var username = req.user.name;
	var email = req.user.email;
	
	middleWare.sendRequestEmail(email, username, name, location);
	middleWare.sendRequestConfirmationEmail(email, username, name, location);
	res.redirect("/campgrounds");
	req.flash("success", "Request Submitted!");
});

router.get("/:id/edit", middleWare.isAdmin, function(req, res) {
	Campground.findById(req.params.id, function(error, foundCampground) {
		if(error) {
			res.redirect("/campgrounds");
		}
		else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

router.put("/:id", middleWare.isAdmin, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground) {
		if(error) {
			res.redirect("/campgrounds/" + req.params._id + "/edit");
			req.flash("error", "Campground Did Not Update")
		}
		else {
			req.flash("success", "Campground Updated!");
			res.redirect("/campgrounds/" + req.params.id)
		}
	});
});

router.delete("/:id", middleWare.isAdmin, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(error) {
		if(error) {
			res.redirect("/campgrounds/" + req.params.id);
			req.flash("error", "Could not Delete Post!");
		}
		else {
			req.flash("success", "Campground Deleted!");
			res.redirect("/campgrounds");
		}
	})
})


router.get("/new", middleWare.isAdmin, function(req, res) {
	res.render("campgrounds/new");
});

router.post("/", middleWare.isAdmin, function(req, res) {
	var name = req.body.name;
	var location = req.body.location;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var wifi = req.body.wifi;
	var tent = req.body.tent;
	var power = req.body.power;
	var rv = req.body.rv;
	var handicap = req.body.handicap;
	var pets = req.body.pets;
	var boatramp = req.body.boatramp;
	var author = {
		id: req.user._id,
		username: req.user.name
	};
	var newCampground = {name: name, location: location, image: image, price: price, description: description, wifi: wifi, tent: tent, power: power, rv: rv, handicap: handicap, pets: pets, boatramp: boatramp, author: author};
	Campground.create(newCampground, function(error, newlyCreated){
		if(error){
			console.log(error);
		}
		else {
			req.flash("success", "Campground Created!");
			res.redirect("/campgrounds");
		}
	})
});

router.get("/:id", function(req, res) {	Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground) {
		if(error) {
			console.log(error);
		}
		else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

module.exports = router;
