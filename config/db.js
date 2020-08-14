const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/YouShare', {
			useNewUrlParser    : true,
			useUnifiedTopology : true,
			useFindAndModify   : false
		});
		console.log('MongoDB is connected!!!');
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
