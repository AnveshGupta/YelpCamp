var express = require("express");
var comments = require("../models/comments");
var campground = require("../models/campground");
var user = require("../models/users");
var passport = require("passport");

middleware = {};

middleware.isloggedin = function(req,res,next){
    if(!req.isAuthenticated()){
        res.redirect("/login");
    }
    else{
        next();
    }
};

module.exports = middleware;