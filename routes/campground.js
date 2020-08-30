var express = require("express");
var router = express.Router({mergeParams:true});
var users = require("../models/users");
var ng = require("../models/campground");
var comment = require("../models/comments");
var auth = require("../routes/Auth");
var middleware = require("../middleware/middleware");
console.log(middleware);

router.get("/campgrounds",function(req,res){
    ng.find({},function(err,ncg){
        if(err){
            console.log(err);
        }
        else{
            res.render("home",{campgrounds:ncg});
        }
    });
    
});
router.get("/campgrounds/new",isloggedin,function(req,res){
    res.render("newcamp");
});
router.post("/campgrounds",isloggedin,function(req,res){
    var camp = req.body.camp;
    ng.create(camp,function(err,ret){
        if(err){
            console.log(err);
        }
        else{
            console.log(ret);
        }
    });
    res.redirect("/campgrounds");
});
router.get("/campgrounds/:id",function(req,res){
    ng.findById(req.params.id).populate("comment").exec(function(err,cg){
        if(err){
            console.log(err);
        }
        else{
            res.render("description",{campground : cg});
        }
    });
});

module.exports = router;
