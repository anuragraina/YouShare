const express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/users');

router.get('/', (req, res) => res.render('landing'));

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
	const newUser = new User({ username: req.body.username });

	User.register(newUser, req.body.password, (err, addedUser) => {
		if (err) {
			console.log(err);
			res.redirect('/register');
		} else {
			passport.authenticate('local')(req, res, () => res.redirect('/foods'));
		}
	});
});

router.get('/login', (req, res) => res.render('login'));

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect : '/foods',
		failureRedirect : '/login'
	}),
	(req, res) => {}
);

router.get('/logout', (req, res) => {
	req.logOut();
	res.redirect('/foods');
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	else res.redirect('/login');
}

module.exports = router;