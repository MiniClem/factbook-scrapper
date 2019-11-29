const mongoose = require('mongoose');

const PopulationSchema = new mongoose.Schema({
  country: String,
  value: String
});

module.exports = function (database) {
  return mongoose.model('Population', PopulationSchema);
} 