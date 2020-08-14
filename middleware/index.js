const Food = require('../models/foods'),
	Comment = require('../models/comments');

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	else {
		req.flash('error', 'You need to be logged in to continue!!!');
		res.redirect('/login');
	}
};

middlewareObj.isCommentOwner = (req, res, next) => {
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
};

middlewareObj.isFoodOwner = (req, res, next) => {
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
};

module.exports = middlewareObj;
