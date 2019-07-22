var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Dogpark       = require("./models/dogpark"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds"),
    commentRoutes = require("./routes/comments"),
    dogparkRoutes = require("./routes/dogparks"),
    authRoutes    = require("./routes/auth");  

mongoose.connect("mongodb://localhost:27017/paws_playground",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDB();


// Passport Configuration
app.use(require("express-session")({
    secret:            "Krang Rocks",
    resave:            false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


app.use("/dogparks", dogparkRoutes);
app.use("/dogparks/:id/comment", commentRoutes);
app.use("/", authRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The PawsPlayground Server Has Started");
});