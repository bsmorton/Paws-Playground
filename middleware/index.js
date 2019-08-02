var Dogpark    = require("../models/dogpark");
var Comment    = require("../models/comment");

var middlewareObj = {
    checkDogparkOwnership : function(req, res, next){
                                    if(req.isAuthenticated()){
                                        Dogpark.findById(req.params.id, function(err, foundDogpark){
                                            if(err){
                                                res.redirect("back");
                                            } else {
                                                if(foundDogpark.author.id.equals(req.user._id)){
                                                    next();   
                                                } else {
                                                    res.redirect("back");
                                                }
                                            }
                                        });
                                    } else {
                                        res.redirect("back");
                                    }
                                },
    checkCommentOwnership    : function(req, res, next){
                                    if(req.isAuthenticated()){
                                        Comment.findById(req.params.comment_id, function(err, foundComment){
                                            if(err){
                                                res.redirect("back");
                                            } else {
                                                if(foundComment.author.id.equals(req.user._id)){
                                                    next();   
                                                } else {
                                                    res.redirect("back");
                                                }
                                            }
                                        });
                                    } else {
                                        res.redirect("back");
                                    }
                                },
    isLoggedIn               : function(req, res, next){
                                    if(req.isAuthenticated()){
                                        return next();
                                    }
                                    res.redirect("/login");
                                }
}



module.exports = middlewareObj;