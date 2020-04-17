var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next) {
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", err.message);
				res.redirect("back");
			} else {
				// fix a bug submitted by someone in udemy
				if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
				// does user own the campground?
				// console.log(foundCampground.author.id);
				// console.log(req.user._id);
				if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
					next();		
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
				req.flash("error", err.message);
			} else {
				// same, to fix a bug
				if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }

				// does user own the comment?
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();		
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First!");
	res.redirect("/login");
}


module.exports = middlewareObj;