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

router.get('/:comment_id/edit', isOwner, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) =>
		res.render('comments/edit', { food_id: req.params.id, comment: foundComment })
	);
});

router.put('/:comment_id', isOwner, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
			res.redirect('/foods/' + req.params.id);
		}
	});
});

router.delete('/:comment_id', isOwner, (req, res) => {
	Comment.findByIdAndDelete(req.params.comment_id, (err) => {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else res.redirect('/foods/' + req.params.id);
	});
});

//middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) next();
	else res.redirect('/login');
}

function isOwner(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				console.log(err);
				res.redirect('back');
			} else {
				if (foundComment.author.id.equals(req.user._id)) next();
				else res.redirect('back');
			}
		});
	} else res.redirect('back');
}

module.exports = router;
