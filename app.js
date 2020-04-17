var express 	   = require("express"),
	bodyParser     = require("body-parser"),
	mongoose 	   = require("mongoose"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local"),
	methodOverride = require("method-override"),
	flash		   = require("connect-flash"),
	Campground     = require("./models/campground"),
	Comment        = require("./models/comment"),
	User           = require("./models/user"),
	seedDB         = require("./seeds"),
	app 		   = express();


var port = process.env.PORT || 3000;

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
// add moment
app.locals.moment = require('moment');


// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb+srv://qycl:yanglu1225@cluster0-a8tfr.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR:", err.message);
});
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// passport configuration
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// 给所有页面，用于上面的导航栏，添加一个本地变量
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/" ,indexRoutes);
app.use("/campgrounds" ,campgroundRoutes);
app.use("/campgrounds/:id/comments" ,commentRoutes);




app.listen(port, process.env.IP, ()=>{
	console.log("YelpCamp Start working!!!");
});