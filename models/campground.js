var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   price: String,
   description: String,
   location:String,
   lat: Number,
   lng: Number,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   author:{
      username:String,
      //id is an object
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
   }
});

module.exports = mongoose.model("Campground", campgroundSchema);