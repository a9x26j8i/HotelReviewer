var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
         Campground.findById(req.params.id, function(err, foundCampground){
             if(err){
                 req.flash("error", "Item Not Found")
                 res.redirect("/campgrounds")
             }else{
                 //does user own the blog? if not redirect
                 if(foundCampground.author.id.equals(req.user._id)){
                     next()
                 }else{
                     req.flash("error", "Permission denied")
                     res.redirect("back")
                 }
                 
             }
         })
     }else{
         req.flash("error", "Please login first");
         res.redirect("back")
     }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
        //is logged in?if not redirect
     if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, foundComment){
             if(err){
                 req.flash("error", "Item Not Found")
                 res.redirect("back");
             }else{
                 //does user own the campground? if not redirect
                 if(foundComment.author.id.equals(req.user._id)){
                     next()
                 }else{
                     req.flash("error", "Permission denied")
                     res.redirect("back")
                 }
                 
             }
         })
     }else{
         req.flash("error", "Please login first");
         res.redirect("back")
     }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Sorry, You must login first");
    res.redirect("/login");
}

module.exports = middlewareObj;