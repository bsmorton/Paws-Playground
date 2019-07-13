var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
    

mongoose.connect("mongodb://localhost:27017/paws_playground",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var dogparkSchema = new mongoose.Schema({
   name:        String,
   address:     String,
   image:       String,
   description: String
});

var Dogpark       = mongoose.model("Dogpark", dogparkSchema);

Dogpark.create(
    {
        name:        "Sunset Dog Park",
        address:     "E Warm Springs Rd, Las Vegas, NV 89120, USA",
        image:       "https://s3-media2.fl.yelpcdn.com/bphoto/YPIfB49kJ-8XQEe1JAk4FQ/o.jpg",
        description: ""
    },  function(err, dogpark){
            if(err){
                 console.log(err);
             } else{
                 console.log("NEWLY CREATED DOGPARK: ");
                 console.log(dogpark);
             }
        });

// var dogparks   = [
//                      {name: "Sunset Dog Park",            address: "E Warm Springs Rd, Las Vegas, NV 89120, USA",  image: "https://s3-media2.fl.yelpcdn.com/bphoto/YPIfB49kJ-8XQEe1JAk4FQ/o.jpg"},
//                      {name: "Bark Park At Heritage Park", address: "350 S Racetrack Rd, Henderson, NV 89015, USA", image: "https://s3-media3.fl.yelpcdn.com/bphoto/V77TKGlFpxbzEJ65pFfGvQ/348s.jpg"},
//                      {name: "Barx Parx",                  address: "350 S Racetrack Rd, Henderson, NV 89015, USA", image: "https://scontent-cdg2-1.cdninstagram.com/vp/42474e9da853ce89420c94717e0a0c10/5D9547BF/t51.2885-15/e35/51300831_700285830368588_2788755755714318291_n.jpg?_nc_ht=scontent-cdg2-1.cdninstagram.com&se=7&ig_cache_key=MTk4MzgwNDk2ODgxOTA2MjI5Nw%3D%3D.2"}
//                  ];


app.get("/", function(req, res){
    res.render("home");
});

app.get("/dogparks", function(req, res){
    Dogpark.find({}, function(err, dogparks){
        if(err){
            console.log(err);
        } else{
            res.render("dogparks", {dogparks: dogparks});
        }
    });
});

app.get("/dogparks/new", function(req, res) {
    res.render("new");
});

app.get("/dogparks/:id", function(req, res){
    Dogpark.findById(req.params.id, function(err, foundDogpark){
        if(err){
            console.log(err);
        } else {
            res.render("show", {dogpark: foundDogpark});
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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The PawsPlayground Server Has Started");
});