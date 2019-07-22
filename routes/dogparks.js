var express    = require("express"),
    router     = express.Router(),
    Dogpark    = require("../models/dogpark");


router.get("/", function(req, res){
    Dogpark.find({}, function(err, dogparks){
        if(err){
            console.log(err);
        } else{
            res.render("dogparks/dogparks", {dogparks: dogparks});
        }
    });
});

router.get("/new", isLoggedIn, function(req, res) {
    res.render("dogparks/new");
});

router.get("/:id", function(req, res){
    Dogpark.findById(req.params.id).populate("comments").exec(function(err, foundDogpark){
        if(err){
            console.log(err);
        } else {
            res.render("dogparks/show", {dogpark: foundDogpark});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
    var name          = req.body.name,
        address       = req.body.address,
        image         = req.body.image,
        description   = req.body.description,
        author        = {
                                id: req.user._id,
                                username: req.user.username
                        },
        newDogpark    = {name: name, address: address, image: image, description: description, author: author};
                            
    
   
    Dogpark.create(newDogpark, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
           res.redirect("/dogparks");
       }
   });
   
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;