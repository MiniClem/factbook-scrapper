const mongoose = require('mongoose');

const LifeExpectancySchema = new mongoose.Schema({
	nation_code: String,
	genre: String,
	age: Number
});

module.exports.from = function (database) {
	return database.model('Life_Expectancy', LifeExpectancySchema);
} 