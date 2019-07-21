var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Dogpark     = require("./models/dogpark"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");
    

mongoose.connect("mongodb://localhost:27017/paws_playground",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDB();

app.get("/", function(req, res){
    res.render("home");
});

// ===================
// DOGPARK ROUTES
// ===================

app.get("/dogparks", function(req, res){
    Dogpark.find({}, function(err, dogparks){
        if(err){
            console.log(err);
        } else{
            res.render("dogparks/dogparks", {dogparks: dogparks});
        }
    });
});

app.get("/dogparks/new", function(req, res) {
    res.render("dogparks/new");
});

app.get("/dogparks/:id", function(req, res){
    Dogpark.findById(req.params.id).populate("comments").exec(function(err, foundDogpark){
        if(err){
            console.log(err);
        } else {
            res.render("dogparks/show", {dogpark: foundDogpark});
        }
    });
});

app.post("/dogparks", function(req, res){
    var name          = req.body.name,
        address       = req.body.address,
        image         = req.body.image,
        description   = req.body.description,
        newDogpark    = {name: name, address: address, image: image, description: description};
   
    Dogpark.create(newDogpark, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
           res.redirect("/dogparks");
       }
   });
   
});


// ===================
// COMMENTS ROUTES
// ===================

app.get("/dogparks/:id/comment/new", function(req, res){
    Dogpark.findById(req.params.id, function(err, dogpark){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {dogpark: dogpark});
        }
    });
});

app.post("/dogparks/:id/comment", function(req, res){
    Dogpark.findById(req.params.id, function(err, dogpark){
        if(err){
            console.log(err);
            res.redirect("/dogpark");
        } else {
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   dogpark.comments.push(comment);
                   dogpark.save();
                   res.redirect("/dogparks/"+dogpark._id);
               }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The PawsPlayground Server Has Started");
});