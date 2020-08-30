var exp = require("express");
    app = exp(),
    db = require("mongoose"),
    bp = require("body-parser");
    passport = require("passport");
    localstrategy = require("passport-local");
    passportlocalmongoose = require("passport-local-mongoose");

    comment = require("./models/comments");
    ng = require("./models/campground");  
    users = require("./models/users");  
    

db.set('useUnifiedTopology',true);
db.connect("mongodb://localhost:27017/campground_auth",{useNewUrlParser: true});

// seeddb =  require("./seed");
// seeddb();

app.use(require("express-session")({
    secret: "this is a secret which c@nn0t be cr@cked e@&1ly",
    resave: false,
    saveUninitialized: false
}));

passport.use(new localstrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

app.use(bp.urlencoded({extended:true}));
app.set("view engine","ejs");

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.currentuser = req.user;
    next();
});

function isloggedin(req,res,next){
    if(!req.isAuthenticated()){
        res.redirect("/login");
    }
    else{
        next();
    }
}

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
    ng.find({},function(err,ncg){
        if(err){
            console.log(err);
        }
        else{
            res.render("home",{campgrounds:ncg});
        }
    });
    
});
app.get("/campgrounds/new",isloggedin,function(req,res){
    res.render("newcamp");
});
app.post("/campgrounds",isloggedin,function(req,res){
    var camp = req.body.camp
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
app.get("/campgrounds/:id",function(req,res){
    ng.findById(req.params.id).populate("comment").exec(function(err,cg){
        if(err){
            console.log(err);
        }
        else{
            res.render("description",{campground : cg});
        }
    });
});

app.get("/campgrounds/:id/comment",isloggedin,function(req,res){
        ng.findById(req.params.id,function(err,camp){
            if(err){
                console.log(err);
            }
            else{
            res.render("comments",{campground:camp});
            }
        });
});
app.post("/campgrounds/:id",isloggedin,function(req,res){
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
        })
    }
    });
});
app.get("/login/",function(req,res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/signup",function(req,res){
    res.render("signup");
});
app.post("/signup",function(req,res){
    users.register(new users({username: req.body.username}),req.body.password,function(err, user){
        if(err){
            console.log(err);
            return res.redirect('/signup');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds");
        });
    });
});
app.get("/signout",function(req,res){
    req.logout();
    res.redirect("/login");
});
app.listen(3000,function(req,res){
    console.log("server started");
})
