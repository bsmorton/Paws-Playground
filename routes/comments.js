var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Dogpark    = require("../models/dogpark"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");
    

router.get("/new", middleware.isLoggedIn, function(req, res){
    Dogpark.findById(req.params.id, function(err, dogpark){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {dogpark: dogpark});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
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

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
             res.render("comments/edit", {dogpark_id: req.params.id, comment: foundComment});
        }
    });
});


router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/dogparks/" + req.params.id);
        }
    });
});


router.delete("/:comment_id", function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("/back");
        } else {
            res.redirect("/dogparks/" + req.params.id);
        }
    });
});


module.exports = router;