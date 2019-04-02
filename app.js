//campgrounds = cities
// allCampgrounds db ref = cities

var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    City           = require("./models/city"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds")
    
    
// Require routes
var commentRoutes   = require("./routes/comments"),
    cityRoutes      = require("./routes/cities"),
    indexRoutes     = require("./routes/index")


mongoose.connect("mongodb://localhost/rf_travel", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
// Seed the database
// seedDB();



// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "This thing is really interesting to me and good for learning too",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/", indexRoutes);
app.use("/cities", cityRoutes);
app.use("/cities/:id/comments", commentRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("rfTravel server has started!")
});
