const mongoose = require("mongoose"),
      Food = require("./models/foods"),
      Comment = require("./models/comments")

const data = [
    {
        name:'Pizza', 
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: "Consequat minim enim ex ad in eiusmod reprehenderit ullamco. Quis non ea cillum non consectetur labore irure. Veniam veniam do reprehenderit amet sunt enim voluptate veniam dolore. Ea culpa laborum aliqua sint sit qui. Adipisicing tempor mollit laboris mollit nulla. Amet anim in aute nulla."
     },
    {
        name:'Burger', 
        image:'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: "Reprehenderit et ea cupidatat culpa veniam. Nostrud ea velit ut exercitation quis enim. Consequat laboris elit eu non tempor sunt adipisicing pariatur tempor culpa aliqua. Veniam exercitation fugiat in mollit aliquip in elit in tempor minim voluptate Lorem. Nostrud velit occaecat aute fugiat amet proident ex aute exercitation in et. Eiusmod labore sint Lorem excepteur culpa dolor aute proident Lorem quis laborum ullamco ea. Pariatur deserunt qui anim eiusmod."
    },
    {
        name:'Sandwich',
        image:'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: "Sunt mollit est mollit tempor est elit reprehenderit ad commodo. In exercitation dolor excepteur deserunt Lorem duis pariatur. Nisi consectetur amet Lorem adipisicing eu ea aliquip labore amet pariatur ad labore. Lorem ut tempor laborum magna mollit sunt elit proident laboris reprehenderit tempor nostrud."
    }
]; 

function seedDb(){

    Food.deleteMany({},err=>{
        if(err)
        console.log(err);

        else
        console.log("Removed from database!!!");

        data.forEach(food=>{
            Food.create(food,(err,item)=>{
                if(err){
                    console.log(err);
                }              

                else{
                    console.log('Added new food...');
                    
                    Comment.create(
                        {
                            text : "Eiusmod cillum ut ad voluptate aute in adipisicing amet non in nisi aliqua pariatur. Ut sit mollit irure dolore anim et sint. Adipisicing laborum ut ut mollit dolore proident. Officia incididunt veniam do nostrud irure non. Ex enim ad ea laborum. Labore tempor laboris laboris anim.",
                            author : "Anurag Raina"
                        },(err,comment)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                item.comments.push(comment);
                                item.save();
                                console.log("Created new Comment...");
                            }
                        }
                    )
                }
            })
        })
    
    })

}

module.exports = seedDb;