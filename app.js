const express = require('express'),
      app = express(),
      port = 3000,
      bodyParser = require("body-parser"),
      mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/YouShare', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs')

//-------------------------------------
//           SCHEMA
//-------------------------------------

const foodSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String
})

const Food = mongoose.model("Food",foodSchema);

// Food.create(
//     {
//         name:'Burger', 
//         image:'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
//         description:"fewfvwhjwhbfwbuhvurvhuhvurh98yg8gheuhverhubehuehbuheubhurhburehbuehubhuihbuihbuiehibhrihbihri"
//     },
//     (err,food)=>{
//         if(err){
//             console.log("Error adding food!!!");
//         }
//         else{
//             console.log("Successfully added food")
//             console.log(food);
//         }
//     }
// )

// const foods = [
//     {name:'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
//     {name:'Burger', image:'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'},
//     {name:'Sandwich', image:'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'}
// ];

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
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const newFood = {name:name, image:image, description:desc};
    
    Food.create(newFood,(err,food)=>{
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
    Food.findById(req.params.id,(err,foundFood)=>{
        if(err){
            console.log("Food item not found!!!");
        }
        else{
            res.render('show',{food:foundFood});
        }
    })
});

app.listen(2000,()=>console.log('YouShare server running on port '+port+'...'))