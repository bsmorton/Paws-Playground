var mongoose = require("mongoose");

var dogparkSchema = new mongoose.Schema({
   name:        String,
   address:     String,
   image:       String,
   description: String,
   author: {
     id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
     },
     username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Dogpark", dogparkSchema)