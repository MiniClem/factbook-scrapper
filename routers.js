const express = require("express");
const NationModel = require("./nation");
const nations = require("./scrap/nations");
const ScrapDateModel = require("./scrap_date");
const LifeExpectancyModel = require("./life_expectancy");
const lifeExpectancy = require("./scrap/expectancy");
// const getPopulation = require("./scrap/population");

// Connect routers
const app = express();

function connectRouters(database) {
	app.get('/', function (req, res) {
		res.send("Hello World!");
	});

	app.get('/nations', function (req, res) {
		NationModel.from(database)
			.find(function (err, listNations) {
				if (err) {
					console.error(err);
					res.send("Error");
				}

				if (listNations) {
					// values from database
					res.send(listNations);
					console.log("Nations : Response values from database");
					// Ajouter méthode de maj des données si trop anciennes
				} else {
					// Scrap then send data
					nations.getNations()
						.then(function (values) {
							res.send(values);
							console.log("Nations : Response values from scrap");

							// upsert update time
							ScrapDateModel.from(database)
								.updateOne(
									{
										schema_name: 'Nation'
									},
									{
										date: new Date()
									}
									,
									{
										upsert: 'true',
									},
									function (err, scrapDate) {
										if (err)
											return console.error(err);
									}
								)

							// Loop all nations to put in db
							for (let i = 0; i < values.countries.length; i++) {
								const jsonCountry = values.countries[i];

								let nation = new NationModel.from(database)({
									country: jsonCountry['name'],
									code: jsonCountry['code']
								})

								// Save in DB for later usage
								nation.save(function (err, nation) {
									if (err) console.error(err);
									else console.log(`${nation} saved successfully !`);
								})
							}
						})
						.catch(function (err) {
							console.log(err);
						});
				}
			}).select('-_id -__v'); // Remove id and versionKey from query
	})

	app.get('/:nation/life-expectancy', function (req, res) {
		LifeExpectancyModel.from(database)
			.find({ nation_code: req.params.nation }, function (err, result) {
				if (err) {
					console.error(err);
					res.send("Error");
				}

				if (result && result.length != 0) {
					res.send(result);
					console.log("Life expectencies : Response values from database");
				} else {
					lifeExpectancy.getExpectancy(req.params.nation)
						.then(function (json) {
							res.send(json);
							console.log("Life expectencies : Response values from scrap");

							for (let i = 0; i < json.length; i++) {
								const element = json[i];

								let le = new LifeExpectancyModel.from(database)({
									nation_code: element['nation_code'],
									genre: element['genre'],
									age: element['age']
								});

								le.save(function (err, resultValue) {
									if (err) console.error(err);
									else console.log(`${resultValue} saved successfully !`);
								});
							}
						}).catch(function (err) {
							console.error(err);
							// res.send("Error");
						});
				}
			}).select('-_id -__v'); // Remove id and versionKey from query
	})

	// app.get('/:nation/population', function (req, res) {
	// 	getPopulation(req.params.nation);
	// 	res.send("finished");
	// });

	app.listen(3000, function () {
		console.log("Example app listening on port 3000");
	});
}

module.exports.connectRouters = connectRouters;