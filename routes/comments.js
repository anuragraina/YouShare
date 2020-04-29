const express = require('express'),
	router = express.Router({ mergeParams: true }),
	Food = require('../models/foods'),
	Comment = require('../models/comments');

//Comments new
router.get('/new', isLoggedIn, (req, res) => {
	Food.findById(req.params.id, (err, foundFood) => {
		if (err) console.log(err);
		else {
			res.render('comments/new', { food: foundFood });
		}
	});
});

//Comments create
router.post('/', isLoggedIn, (req, res) => {
	Food.findById(req.params.id, (err, foundFood) => {
		if (err) console.log(err);
		else {
			Comment.create(req.body.comment, (err, addedComment) => {
				if (err) console.log(err);
				else {
					addedComment.author.id = req.user._id;
					addedComment.author.username = req.user.username;
					addedComment.save();

					foundFood.comments.push(addedComment);
					foundFood.save();

					res.redirect('/foods/' + foundFood._id);
				}
			});
		}
	});
});

//middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	else res.redirect('/login');
}

module.exports = router;
