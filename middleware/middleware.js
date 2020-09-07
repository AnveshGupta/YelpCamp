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
// middleware.Check_comment_Owner = function(req,res,next){
//     if(!req.isAuthenticated()){
//         res.redirect("/login");
//     }
//     else{
//         if()
//     }
// }

module.exports = middleware;