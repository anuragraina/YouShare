const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs')

const foods = [
    {name:'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    {name:'Burger', image:'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'},
    {name:'Sandwich', image:'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'}
];

//-------------------------------------
//        INITIAL ROUTES
//-------------------------------------
app.get('/',(req,res)=>res.render('landing'));

app.get('/foods',(req,res)=>res.render('foods',{foods:foods}));

app.post('/foods',(req,res)=>{
    const name = req.body.name;
    const image = req.body.image;
    const newFood = {name:name, image:image};
    foods.push(newFood);

    res.redirect('/foods');
})

app.get('/foods/new',(req,res)=>res.render('new'));

app.listen(3000,()=>console.log('App running on port '+port+'...'))