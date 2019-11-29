const mongoose = require("mongoose");
const routers = require('./routers');

// Connect database 
mongoose.connect('mongodb://localhost/factbook-srapping',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
// Test connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	// we're connected!
	console.log('Connection succeed');

	// Connect routers
	routers.connectRouters(db);
});