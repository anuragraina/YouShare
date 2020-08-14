const express = require('express'),
	app = express(),
	PORT = process.env.PORT || 8080,
	bodyParser = require('body-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	flash = require('connect-flash'),
	Food = require('./models/foods'),
	Comment = require('./models/comments'),
	User = require('./models/users'),
	connectDB = require('./config/db'),
	seedDb = require('./seeds');

//Requiring routes
const commentRoutes = require('./routes/comments'),
	foodRoutes = require('./routes/foods'),
	indexRoutes = require('./routes/index');

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(flash());

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
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(methodOverride('_method'));

app.use('/', indexRoutes);
app.use('/foods', foodRoutes);
app.use('/foods/:id/comments', commentRoutes);

app.listen(PORT, () => console.log(`YouShare server running on port ${PORT}`));
