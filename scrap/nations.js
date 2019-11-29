const cheerio = require("cheerio");
const xRay = require("x-ray");
const x = xRay();
const rp = require("request-promise");

function getNations() {
	return new Promise(function (resolve, reject) {
		rp("https://www.cia.gov/library/publications/resources/the-world-factbook/")
			.then(function (htmlString) {
				let $ = cheerio.load(htmlString);
				const html = $('select[class=place_selector]').html();


				// Cherche le tag option
				x(html, ['option'])(function (err, countries) {
					if (err)
						console.error(err);

					x(html, ['option@data-place-code'])(function (err, code) {
						if (err)
							console.error(err);

						// Retravaille les données
						code.splice(0, 2);

						countries.splice(0, 2);
						countries = countries.map(function (s) {
							s = s.replace(/\n/g, '');
							return s.trim();
						});

						// Mapping JSON code + value
						let result = {
							countries: []
						};

						for (let i = 0; i < countries.length; i++) {
							result.countries.push({
								"name": countries[i],
								"code": code[i]
							})
						}

						// Utiliser values
						resolve(result);
					})
				});
			})
			.catch(function (err) {
				console.error("Erreur");
				reject(err);
			});
	});
}

module.exports.getNations = getNations;