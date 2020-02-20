var middleWare = require("../middleware/index.js"),
	Campground = require("../models/campground"),
	express    = require("express"),
	Comment    = require("../models/comment"),
	router     = express.Router({mergeParams: true});

router.get("/new", middleWare.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(error, campground) {
		if(error) {
			console.log(error)
		}
		else {
			res.render("comments/new", {campground: campground});
		}
	});
});

router.post("/", middleWare.isLoggedIn , function(req, res) {
	Campground.findById(req.params.id, function(error, campground) {
		if(error) {
			console.log(error);
			res.redirect("/campgrounds");
		}
		else {
			Comment.create(req.body.comment, function(error, comment) {
				if(error) {
					console.log(error)
				}
				else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment)
					campground.save();
					res.redirect("/campgrounds/" + req.params.id);
				}
			})
		}
	});
});

router.get("/:commentID/edit", middleWare.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.commentID, function(error, foundComment) {
		if(error) {
			res.redirect("/campgrounds/" + req.params);
			req.flash("error", "Could not Locate Comment!");
		}
		else {
			res.render("comments/edit", {campgroundID: req.params.id, comment: foundComment});
		}
	});
});

router.put("/:commentID", middleWare.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.commentID, req.body.comment, function(error, updatedComment) {
		if(error) {
			res.redirect("/campgrounds/" + req.params.id + "/comments/" + req.params.commentID + "/edit");
			req.flash("error, Cannot Update Comment!");
		}
		else {
			req.flash("success", "Comment Updated Successfully!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

router.delete("/:commentID", middleWare.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndDelete(req.params.commentID, function(error) {
		if(error) {
			res.redirect("/campgrounds/" + req.params.id);
			req.flash("error", "Could Not Delete Comment!");
		}
		else {
			req.flash("success", "Comment Deleted!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

module.exports = router