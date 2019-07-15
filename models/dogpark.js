var mongoose = require("mongoose");

var dogparkSchema = new mongoose.Schema({
   name:        String,
   address:     String,
   image:       String,
   description: String,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Dogpark", dogparkSchema)