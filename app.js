const express = require('express'),
      app = express(),
      port = 3000,
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      Food = require("./models/foods"),
      Comment = require("./models/comments"),
      User = require("./models/users"),
      seedDb = require("./seeds");


mongoose.connect('mongodb://localhost:27017/YouShare', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));

seedDb();

//-------------------------------------
//        PASSPORT SETUP
//-------------------------------------
app.use(require("express-session")({
    secret: "Crack the password please...",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
})

//-------------------------------------
//              ROUTES
//-------------------------------------
app.get('/',(req,res)=>res.render('landing'));

app.get('/foods',(req,res)=>{

    console.log(req.user);
    Food.find({},(err,allFoods)=>{
        if(err){
            console.log("Error finding food!!!");
        }
        else{
            res.render('foods/foods',{foods:allFoods});
        }
    })
});

app.post('/foods',(req,res)=>{
    
    Food.create(req.body.food,(err,food)=>{
        if(err){
            console.log("Error adding food!!!");
        }
        else{
            console.log("Added food successfully...");
        }
    })
    res.redirect('/foods');
});

app.get('/foods/new',(req,res)=>res.render("foods/new"));

app.get("/foods/:id",(req,res)=>{

    Food.findById(req.params.id).populate("comments").exec((err,foundFood)=>{
        if(err){
            console.log("Food item not found!!!");
            res.redirect("/foods");
        }
        else{
            res.render('foods/show',{food:foundFood});
        }
    })
});

app.get("/foods/:id/comments/new",isLoggedIn,(req,res)=>{

    Food.findById(req.params.id,(err,foundFood)=>{
        if(err)
        console.log(err);

        else{
            res.render("comments/new",{food:foundFood});
        }
    })
});

app.post("/foods/:id/comments",isLoggedIn,(req,res)=>{
    
    Food.findById(req.params.id,(err,foundFood)=>{
        if(err)
        console.log(err);

        else{
            Comment.create(req.body.comment,(err,addedComment)=>{
                foundFood.comments.push(addedComment);
                foundFood.save();

                res.redirect("/foods/"+foundFood._id);
            })
        }
    })
});

//-------------------------------------
//           AUTH ROUTES
//-------------------------------------
app.get("/register",(req,res)=>res.render("register"));

app.post("/register",(req,res)=>{
    const newUser= new User({username:req.body.username});
    
    User.register(newUser,req.body.password,(err,addedUser)=>{
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,()=>res.redirect("/foods"));
        }
    })
});

app.get("/login",(req,res)=>res.render("login"));

app.post("/login",passport.authenticate("local",
    {
        successRedirect:"/foods",
        failureRedirect:"/login"
    }),(req,res)=>{});

app.get("/logout",(req,res)=>{
    req.logOut();
    res.redirect("/foods");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();

    else
    res.redirect("/login");
}

app.listen(port,()=>console.log('YouShare server running on port '+port+'...'));