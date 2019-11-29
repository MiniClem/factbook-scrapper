const mongoose = require('mongoose');

const Scrap_dateSchema = new mongoose.Schema({
	schema_name: String,
	date: Date
});

module.exports.from = function (database) {
	return database.model('Scrap_date', Scrap_dateSchema);
} 