var methodOverride = require("method-override"),
	LocalStrategy  = require("passport-local"),
	cookieParser   = require("cookie-parser"),
	Campground     = require("./models/campground"),
	cookieParser   = require("cookie-parser"),
	bodyParser     = require("body-parser"),
	Comment		   = require("./models/comment"),
	passport 	   = require("passport"),
	mongoose       = require("mongoose"),
	session 	   = require("express-session"),
	express        = require("express"),
	seedDB		   = require("./seeds"),
	flash 		   = require("connect-flash"),
	User		   = require("./models/user"),
	app            = express()

var authenticationRoutes = require("./routes/authentication"),
	campgroundRoutes 	 = require("./routes/campgrounds"),
	registerRoutes	 	 = require("./routes/register"),
	commentRoutes    	 = require("./routes/comments"),
	indexRoutes      	 = require("./routes/index"),
	adminRoutes			 = require("./routes/admin");

app.locals.moment = require("moment");

//seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", {useUnifiedTopology: true, useNewUrlParser: true});


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(cookieParser('secret'));

app.set("view engine", "ejs");
mongoose.set('useCreateIndex', true);

//=========================
//  PASSPORT CONFIG
//=========================

var sessionStore = new session.MemoryStore;

app.use(session({
	cookie: { maxAge: 60000 },
	store: sessionStore,
	secret: "This is for Yelp Camp",
	resave: false,
	saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

//=========================
// Use Route Files
//=========================

app.get("/", function(req, res) {
	res.render("landing.ejs")
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/register", registerRoutes);
app.use("/admin", adminRoutes);
app.use(authenticationRoutes);
app.use(indexRoutes);


app.listen(3000, function() {
	console.log("The Yelp Camp Server has Started!")
})