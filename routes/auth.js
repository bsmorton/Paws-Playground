var express    = require("express"),
    router     = express.Router(),
    passport   = require("passport"),
    User       = require("../models/user");

router.get("/", function(req, res){
    res.render("home");
});

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Paw's Playground " + user.username);
            res.redirect("/dogparks");
        })
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});


router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/dogparks",
        successFlash:    "Welcome back",
        failureRedirect: "/login",
        failureFlash:    "Invalid username or password"
    
    }), function(req, res) {});
    
    
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/dogparks");
});



module.exports = router;
