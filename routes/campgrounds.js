var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");   //automatically require the content of index.js 
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


/*****************index all*******************/
router.get("/", function(req, res){
   res.send("yes");
    // // Get all campgrounds from DB
    // Campground.find({}, function(err, allCampgrounds){
    //   if(err){
    //       console.log(err);
    //   } else {
    //       res.render("campgrounds/index",{campgrounds:allCampgrounds, page:"campgrounds"});
    //   }
    // });
});

/**********************create new*************************/
//NEW - show form to create new campground
router.get("/new", middleware. isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});
router.post("/", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author={
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {price:price, name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});


/*************************show more info*************************/
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


/*********EDIT campgrounds**********/
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("./campgrounds/edit", {campground:foundCampground})
    })
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampgorund){
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        }else{
            req.flash("success","Successfully Updated")
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
  });
})
/********DELETE campground**************/
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Item not found")
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds")
        }
    });
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
// function checkCampgroundOwnership(req, res, next){
//     //is logged in?if not redirect
//      if(req.isAuthenticated()){
//          Campground.findById(req.params.id, function(err, foundCampground){
//              if(err){
//                  res.redirect("/campgrounds")
//              }else{
//                  //does user own the campground? if not redirect
//                  if(foundCampground.author.id.equals(req.user._id)){
//                      next()
//                  }else{
//                      res.redirect("back")
//                  }
                 
//              }
//          })
//      }else{
//          console.log("You need to be logged in")
//          res.redirect("back")
//      }
     
// }