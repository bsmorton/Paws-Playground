var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Dogpark    = require("../models/dogpark"),
    Comment    = require("../models/comment");
    

router.get("/new", isLoggedIn, function(req, res){
    Dogpark.findById(req.params.id, function(err, dogpark){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {dogpark: dogpark});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
    Dogpark.findById(req.params.id, function(err, dogpark){
        if(err){
            console.log(err);
            res.redirect("/dogparks");
        } else {
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   dogpark.comments.push(comment);
                   dogpark.save();
                   console.log(comment);
                   res.redirect("/dogparks/"+dogpark._id);
               }
            });
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