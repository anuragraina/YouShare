const express = require('express'),
      app = express(),
      port = 3000,
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      Food = require("./models/foods"),
      seedDb = require("./seeds");


mongoose.connect('mongodb://localhost:27017/YouShare', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs')

seedDb();

//-------------------------------------
//        INITIAL ROUTES
//-------------------------------------
app.get('/',(req,res)=>res.render('landing'));

app.get('/foods',(req,res)=>{
    Food.find({},(err,allFoods)=>{
        if(err){
            console.log("Error finding food!!!");
        }
        else{
            res.render('foods',{foods:allFoods})
        }
    })
});

app.post('/foods',(req,res)=>{
    
    Food.create(req.body.food,(err,food)=>{
        if(err){
            console.log("Error adding food!!!");
        }
        else{
            console.log("Added food successfully...")
        }
    })
    res.redirect('/foods');
});

app.get('/foods/new',(req,res)=>res.render("new"));

app.get("/foods/:id",(req,res)=>{

    Food.findById(req.params.id).populate("comments").exec((err,foundFood)=>{
        if(err){
            console.log("Food item not found!!!");
            res.redirect("/foods");
        }
        else{
            res.render('show',{food:foundFood});
        }
    })
});

app.listen(port,()=>console.log('YouShare server running on port '+port+'...'))