var mongoose   = require("mongoose"),
    Dogpark    = require("./models/dogpark"),
    Comment    = require("./models/comment");
    
var data = [
        {
            name:        "Sunset Dog Park", 
            address:     "E Warm Springs Rd, Las Vegas, NV 89120, USA",
            image:       "https://s3-media2.fl.yelpcdn.com/bphoto/YPIfB49kJ-8XQEe1JAk4FQ/o.jpg",
            description: "woof"
        },
        {
            name:        "Bark Park At Heritage Park", 
            address:     "350 S Racetrack Rd, Henderson, NV 89015, USA",
            image:       "https://s3-media3.fl.yelpcdn.com/bphoto/V77TKGlFpxbzEJ65pFfGvQ/348s.jpg",
            description: "arf"
        },
        {
            name:        "Barx Parx", 
            address:     "350 S Racetrack Rd, Henderson, NV 89015, USA",
            image:       "https://scontent-cdg2-1.cdninstagram.com/vp/42474e9da853ce89420c94717e0a0c10/5D9547BF/t51.2885-15/e35/51300831_700285830368588_2788755755714318291_n.jpg?_nc_ht=scontent-cdg2-1.cdninstagram.com&se=7&ig_cache_key=MTk4MzgwNDk2ODgxOTA2MjI5Nw%3D%3D.2",
            description: "yip"
        }
    ];
    
function seedDB(){
    Dogpark.remove({}, function(err){
        if(err){
            console.log(err);
        } else{
            console.log("removed dogparks!");
            data.forEach(function(seed){
                Dogpark.create(seed, function(err, dogpark){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a dogpark");
                        Comment.create({
                            text: "ARF!!!",
                            author: "A. Dogg"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else{
                                dogpark.comments.push(comment);
                                dogpark.save();
                                console.log("created a new comment");
                            }
                        });
                    }
                });
            });
        };
    });
    
    //add a few comments
}

module.exports = seedDB;