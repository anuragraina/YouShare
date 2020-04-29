const express = require('express'),
	app = express(),
	port = 3000,
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	Food = require('./models/foods'),
	Comment = require('./models/comments'),
	User = require('./models/users'),
	seedDb = require('./seeds');

//Requiring routes
const commentRoutes = require('./routes/comments'),
	foodRoutes = require('./routes/foods'),
	indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/YouShare', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//seedDb();   //seed database

//-------------------------------------
//        PASSPORT SETUP
//-------------------------------------
app.use(
	require('express-session')({
		secret            : 'Crack the password please...',
		resave            : false,
		saveUninitialized : false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.use('/', indexRoutes);
app.use('/foods', foodRoutes);
app.use('/foods/:id/comments', commentRoutes);

app.listen(port, () => console.log('YouShare server running on port ' + port + '...'));
