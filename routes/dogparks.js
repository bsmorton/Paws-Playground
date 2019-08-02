var express    = require("express"),
    router     = express.Router(),
    Dogpark    = require("../models/dogpark"),
    middleware = require("../middleware");


router.get("/", function(req, res){
    Dogpark.find({}, function(err, dogparks){
        if(err){
            console.log(err);
        } else{
            res.render("dogparks/dogparks", {dogparks: dogparks});
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
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

router.get("/:id/edit", middleware.checkDogparkOwnership, function(req, res) {
    Dogpark.findById(req.params.id, function(err, foundDogpark){
        res.render("dogparks/edit", {dogpark: foundDogpark});   
    });
});

router.put("/:id", middleware.checkDogparkOwnership, function(req, res){
    Dogpark.findByIdAndUpdate(req.params.id, req.body.dogpark, function(err, updatedDogpark){
        if(err){
            res.redirect("/dogparks");
        } else {
            res.redirect("/dogparks/" + req.params.id);
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
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

router.delete("/:id", middleware.checkDogparkOwnership, function(req, res){
    Dogpark.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/dogparks");
        } else {
            res.redirect("/dogparks");
        }
    });
});



module.exports = router;