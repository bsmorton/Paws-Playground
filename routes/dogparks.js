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
            req.flash("error", "Dogpark not found");
            console.log(err);
        } else {
            res.render("dogparks/show", {dogpark: foundDogpark});
        }
    });
});

router.get("/:id/edit", middleware.checkDogparkOwnership, function(req, res) {
    Dogpark.findById(req.params.id, function(err, foundDogpark){
        req.flash("error", "Dogpark not found");
        res.render("dogparks/edit", {dogpark: foundDogpark});   
    });
});

router.put("/:id", middleware.checkDogparkOwnership, function(req, res){
    Dogpark.findByIdAndUpdate(req.params.id, req.body.dogpark, function(err, updatedDogpark){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/dogparks");
        } else {
            req.flash("success", "Dogpark updated");
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
           req.flash("error", "Something went wrong");
           console.log(err);
       } else{
           req.flash("success", "Successfully added Dogpark");
           res.redirect("/dogparks");
       }
   });
   
});

router.delete("/:id", middleware.checkDogparkOwnership, function(req, res){
    Dogpark.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/dogparks");
        } else {
            req.flash("success", "Dogpark deleted");
            res.redirect("/dogparks");
        }
    });
});



module.exports = router;