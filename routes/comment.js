var express = require("express");
var router = express.Router({mergeParams:true});
var users = require("../models/users");
var ng = require("../models/campground");
var comment = require("../models/comments");
var auth = require("../routes/Auth");
var middleware = require("../middleware/middleware");

isloggedin = middleware.isloggedin;
console.log(isloggedin);

router.get("/campgrounds/:id/comment",isloggedin,function(req,res){
    ng.findById(req.params.id,function(err,camp){
        if(err){
            console.log(err);
        }
        else{
        res.render("comments",{campground:camp});
        }
    });
});
router.post("/campgrounds/:id",isloggedin,function(req,res){
    ng.findById(req.params.id,function(err,camp){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{  
                name = req.user.username;
                name = name[0].toUpperCase() + name.slice(1);
                newcomment = {
                    author: name,
                    text: req.body.text
                }
                comment.create(newcomment,function(err,com){
                    if(err){
                        console.log(err);
                        return;
                    }
                camp.comment.push(com);
                camp.save();
                res.redirect("/campgrounds/"+req.params.id);
        });
    }
    });
});

module.exports = router;