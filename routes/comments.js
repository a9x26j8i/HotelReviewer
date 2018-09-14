var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

/******************NEW comments*******************/
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               res.redirect("/campgrounds")
           } else {
            //   //add username and id to comment
            //   comment.author.id = req.user._id;
            //   comment.author.username = req.user.username;
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
               //save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success", "Comment added")
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

/****************EDIT comments****************/
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit.ejs", {campground_id:req.params.id, comment:comment});
        }
    })
})
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, comment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment modified")
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
/******DESTROY comment******/
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted")
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

module.exports = router;

// /****************************UTILITY FUNCTION******************************/
// /********login check*****/
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }





// /**********ownership check***********/
// function checkCommentOwnership(req, res, next){
//     //is logged in?if not redirect
//      if(req.isAuthenticated()){
//          Comment.findById(req.params.comment_id, function(err, foundComment){
//              if(err){
//                  res.redirect("back");
//              }else{
//                  //does user own the campground? if not redirect
//                  if(foundComment.author.id.equals(req.user._id)){
//                      next()
//                  }else{
//                      res.redirect("back")
//                  }
                 
//              }
//          })
//      }else{
//          res.redirect("back")
//      }
     
// }