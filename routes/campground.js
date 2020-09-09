var express = require("express");
var router = express.Router({mergeParams:true});
var users = require("../models/users");
var ng = require("../models/campground");
var comment = require("../models/comments");
var auth = require("../routes/Auth");
var middleware = require("../middleware/middleware");

router.get("/",function(req,res){
    ng.find({},function(err,ncg){
        if(err){
            console.log(err);
        }
        else{
            res.render("home",{campgrounds:ncg});
        }
    });
    
});
router.get("/new",isloggedin,function(req,res){
    res.render("newcamp");
});
router.post("/",isloggedin,function(req,res){
    var camp = req.body.camp;
    camp.userid = req.user._id;
    console.log(camp);
    ng.create(camp,function(err,ret){
        if(err){
            req.flash("error","Campground cannot be added");
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","Campground added successfully");
            res.redirect("/campgrounds");
        }
    });
});
router.get("/:id",function(req,res){
    ng.findById(req.params.id).populate("comment").exec(function(err,cg){
        if(err){
            console.log(err);
        }
        else{
            res.render("description",{campground : cg});
        }
    });
});

router.get("/:id/update",middleware.check_Campground_Owner,function(req,res){
    ng.findById(req.params.id, function(err,camp){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.render("updatecamp",{camp:camp});
        }
    });
});
router.put("/:id",middleware.check_Campground_Owner,function(req,res){
    console.log(req.body.camp);
    var campupdate = req.body.camp;
    ng.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedBlog){
        if(err){
            res.redirect("/campgrounds");
        }  else {
            res.redirect("/campgrounds/" + req.params.id);
        }
     });
});
router.delete("/:id",middleware.check_Campground_Owner,function(req,res){
    ng.findByIdAndDelete(req.params.id,function(err,cg){
        if(err){
            req.flash("error","Cannot Delete campground");
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","Campground deleted successfully");
            res.redirect("/campgrounds");
        }
    });
});
module.exports = router;
