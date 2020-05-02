const express = require('express'),
	router = express.Router(),
	Food = require('../models/foods');

//Display Food list
router.get('/', (req, res) => {
	Food.find({}, (err, allFoods) => {
		if (err) {
			console.log('Error finding food!!!');
		} else {
			res.render('foods/foods', { foods: allFoods });
		}
	});
});

//Create food
router.post('/', isLoggedIn, (req, res) => {
	const newFood = {
		name        : req.body.food.name,
		image       : req.body.food.image,
		description : req.body.food.description,
		author      : {
			id       : req.user._id,
			username : req.user.username
		}
	};

	Food.create(newFood, (err, addedFood) => {
		if (err) {
			console.log('Error adding food!!!');
		} else {
			console.log('Added food successfully...');
		}
	});
	res.redirect('/foods');
});

//Food new
router.get('/new', isLoggedIn, (req, res) => res.render('foods/new'));

//Dispay Food details
router.get('/:id', (req, res) => {
	Food.findById(req.params.id).populate('comments').exec((err, foundFood) => {
		if (err) {
			console.log(err);
			res.redirect('/foods');
		} else {
			res.render('foods/show', { food: foundFood });
		}
	});
});

router.get('/:id/edit', isOwner, (req, res) => {
	Food.findById(req.params.id, (err, foundFood) => res.render('foods/edit', { food: foundFood }));
});

router.put('/:id', isOwner, (req, res) => {
	Food.findByIdAndUpdate(req.params.id, req.body.food, (err, updatedFood) => res.redirect('/foods/' + req.params.id));
});

router.delete('/:id', isOwner, (req, res) => {
	Food.findByIdAndDelete(req.params.id, () => res.redirect('/foods'));
});

//middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	else res.redirect('/login');
}

function isOwner(req, res, next) {
	if (req.isAuthenticated()) {
		Food.findById(req.params.id, (err, foundFood) => {
			if (err) {
				console.log(err);
				res.redirect('back');
			} else {
				if (foundFood.author.id.equals(req.user._id)) return next();
				else res.send('You are not authorised!!!');
			}
		});
	} else res.redirect('back');
}

module.exports = router;
