var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");




router.get("/", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log("SOME THING GOES WRONG!");
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});	
		}
	})
	
});


// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new")
});

// SHOW show more info about one campground
router.get("/:id", function(req, res){
	//find the campground with the provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show template with that campground
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});		
		}
	});
	
});


// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	console.log(req.body);
	var newcampground = {
		"name": req.body.name,
		"image": req.body.image,
		"price": req.body.price,
		"description": req.body.description,
		"author": {
			id: req.user._id,
			username: req.user.username
		}
	}
// Create a new campground and save to DB
	Campground.create(newcampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			console.log(newcampground);
			res.redirect("/campgrounds");
		}
	});
});

// Edit CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	// if user logged in?
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
	// if not, redirect

	
	
});

// handle post
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
});



module.exports = router;