const express = require('express'),
      app = express(),
      port = 3000,
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      Food = require("./models/foods"),
      Comment = require("./models/comments"),
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
            res.render('foods/foods',{foods:allFoods})
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
    res.redirect('foods/foods');
});

app.get('/foods/new',(req,res)=>res.render("foods/new"));

app.get("/foods/:id",(req,res)=>{

    Food.findById(req.params.id).populate("comments").exec((err,foundFood)=>{
        if(err){
            console.log("Food item not found!!!");
            res.redirect("foods/foods");
        }
        else{
            res.render('foods/show',{food:foundFood});
        }
    })
});

app.get("/foods/:id/comments/new",(req,res)=>{

    Food.findById(req.params.id,(err,foundFood)=>{
        if(err)
        console.log(err);

        else{
            res.render("comments/new",{food:foundFood});
        }
    })
})

app.post("/foods/:id/comments",(req,res)=>{
    
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
})


app.listen(port,()=>console.log('YouShare server running on port '+port+'...'));