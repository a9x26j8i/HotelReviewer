/**********************REQUIRES**********************/
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash       = require("connect-flash"), 
    
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    
    seedDB      = require("./seeds")
/***REQUIRE-routes***/
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")


/*********************CONTENT**********************************/
//get from mLab
var url = process.env.DATABASEURL || "mongod://localhost/yelp_camp";
mongoose.connect(url,{useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(methodOverride("_method"));//use variable"_method" to override method
//seedDB();

/***CONTENT-passport***/
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/***CONTENT-sendbackuser***/
app.use(function(req, res, next){//sendback user into res
    //res.locals has the same function of [,locals] in res.render(view[,locals][,callback])
    //automate the variable assignment   
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success")
   next();
});
/***CONTENT-routing***/
app.use("/", indexRoutes); //app.use() will execute the function
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});




