var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Dogpark       = require("./models/dogpark"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");
    

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


app.get("/", function(req, res){
    res.render("home");
});

// ===================
// DOGPARK ROUTES
// ===================

app.get("/dogparks", function(req, res){
    Dogpark.find({}, function(err, dogparks){
        if(err){
            console.log(err);
        } else{
            res.render("dogparks/dogparks", {dogparks: dogparks});
        }
    });
});

app.get("/dogparks/new", isLoggedIn, function(req, res) {
    res.render("dogparks/new");
});

app.get("/dogparks/:id", function(req, res){
    Dogpark.findById(req.params.id).populate("comments").exec(function(err, foundDogpark){
        if(err){
            console.log(err);
        } else {
            res.render("dogparks/show", {dogpark: foundDogpark});
        }
    });
});

app.post("/dogparks", isLoggedIn, function(req, res){
    var name          = req.body.name,
        address       = req.body.address,
        image         = req.body.image,
        description   = req.body.description,
        newDogpark    = {name: name, address: address, image: image, description: description};
   
    Dogpark.create(newDogpark, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
           res.redirect("/dogparks");
       }
   });
   
});


// ===================
// COMMENTS ROUTES
// ===================

app.get("/dogparks/:id/comment/new", isLoggedIn, function(req, res){
    Dogpark.findById(req.params.id, function(err, dogpark){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {dogpark: dogpark});
        }
    });
});

app.post("/dogparks/:id/comment", isLoggedIn, function(req, res){
    Dogpark.findById(req.params.id, function(err, dogpark){
        if(err){
            console.log(err);
            res.redirect("/dogpark");
        } else {
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   dogpark.comments.push(comment);
                   dogpark.save();
                   res.redirect("/dogparks/"+dogpark._id);
               }
            });
        }
    });
});


// ===================
// AUTH ROUTES
// ===================

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/dogparks");
        })
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});


app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/dogparks",
        failureRedirect: "/login"
    
    }), function(req, res) {});
    
    
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/dogparks");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The PawsPlayground Server Has Started");
});