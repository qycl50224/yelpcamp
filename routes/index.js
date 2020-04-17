var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//INDEX - the landing page
router.get("/", function(req, res){
	res.render("landing");
});
// ===========
// AUTH ROUTES
// ===========

// show register form
router.get("/register", function(req, res){
	res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	if(req.body.adminCode === "code007"){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.render("register");
		} else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to YelpCamp " + user.username);
				res.redirect("/campgrounds");
			});	
		} 
		
	});
});

// show login form
router.get("/login", function(req, res){
	// the below row is incorrect, we should put it in middleware
	// req.flash("error", "Please login first!");
	res.render("login");
});

// handling login logic
// router.post("/login", middleare, callback)
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds" ,
		failureRedirect: "/login"
	}), function(req, res){
});

// logic route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
})


module.exports = router;