const mongoose = require('mongoose');

const NationSchema = new mongoose.Schema({
	country: String,
	code: String
});

module.exports.from = function (database) {
	return database.model('Nation', NationSchema);
} 