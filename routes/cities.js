var express = require("express");
var router = express.Router();
var City = require("../models/city");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//INDEX - show all cities or other type of locations
router.get("/", function(req, res){
    City.find({}, function(err, allCities){
       if(err){
           console.log(err);
       } else {
          res.render("cities/index",{cities: allCities, page: 'cities'});
       }
    });
});

//CREATE - add new city or other type of location to DB
router.post("/", middleware.isLoggedIn,  function(req, res){
   var name = req.body.name;
   var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCity = {name: name, price:price, image: image, description: desc, author: author};
   City.create(newCity, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
             res.redirect("/cities");
       }
    });
});

// NEW - show form to create new city or other type of location
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("cities/new");
});


//SHOW - show more information about city or other type of location
router.get("/:id", function (req, res){
    City.findById(req.params.id).populate("comments").exec(function(err, foundCity){
        if(err || !foundCity){
            req.flash("error", "Post not found");
            res.redirect("back");
        } else {
           res.render("cities/show", {city: foundCity}); 
        }
    });
    
});

// EDIT city or other type of location
router.get("/:id/edit", middleware.checkCityOwnership, function(req, res){
   City.findById(req.params.id, function(err, foundCity){
    res.render("cities/edit", {city: foundCity});
   });
});


// UPDATE city or other type of location
router.put("/:id", middleware.checkCityOwnership, function(req, res){
    City.findByIdAndUpdate(req.params.id, req.body.city, function(err, updatedCity){
        if(err){
            res.redirect("cities");
        } else {
            res.redirect("/cities/" + req.params.id);
        }
    });
});

// DESTROY city or other type of location
// DESTROY also the comments associated with it
router.delete("/:id", middleware.checkCityOwnership, function(req, res, next){
    City.findById(req.params.id, function(err, city){
        if(err){
            console.log(err);
        } else {
        Comment.remove({
            "_id": {
            $in: city.comments
            }
        }, function(err) {
            if(err) return next(err);
            city.remove();
            req.flash("success", "Post deleted");
            res.redirect("/cities");
        });
    }});
});



module.exports = router;

