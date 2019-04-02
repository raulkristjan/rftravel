var express = require("express");
var router = express.Router({mergeParams: true});
var City = require("../models/city");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//Comments new
router.get("/new",middleware.isLoggedIn, function(req, res){
    City.findById(req.params.id, function(err, city){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {city: city});
        }
    })
    
});


//Comments create
router.post("/",middleware.isLoggedIn, function(req, res){
   City.findById(req.params.id, function(err, city){
     if(err){
         console.log(err);
         res.redirect("/cities");
     }else{
         Comment.create(req.body.comment, function(err, comment){
             if(err){
                 req.flash("error", "Something went wrong");
                 console.log(err);
             } else {
                 // Add username and id to comment
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 // Save comment
                 comment.save();
                 city.comments.push(comment);
                 city.save();
                 req.flash("success", "Successfully added comment");
                 res.redirect('/cities/' + city._id);
             }
         });
     }
    
   }); 
});

// EDIT comments 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    City.findById(req.params.id, function(err, foundCity){
        if(err || !foundCity){
            req.flash("error", "Post not found");
            return res.redirect("back");
        }
           Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
           res.render("comments/edit", {city_id: req.params.id, comment: foundComment});
       }
        });
    });
});


//UPDATE comments
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back")
        } else {
            res.redirect("/cities/" + req.params.id);
        }
    });
});


//DELETE comments
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/cities/" + req.params.id);
        }
    })
})






module.exports = router;