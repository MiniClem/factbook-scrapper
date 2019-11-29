var cheerio = require("cheerio");
const rp = require("request-promise");

function getExpectancy(nation) {
	console.log(`https://www.cia.gov/library/publications/resources/the-world-factbook/geos/${nation}.html`);

	var options = {
		uri: `https://www.cia.gov/library/publications/resources/the-world-factbook/geos/${nation}.html`,
		transform: function (body) {
			return cheerio.load(body);
		}
	};

	return new Promise((resolve, reject) => {
		rp(options)
			.then(($) => {
				let json = {
					life_expectancy: []
				};

				$('#field-life-expectancy-at-birth').find('.subfield').each(function (i, elem) {
					json.life_expectancy.push({
						"genre": $(this).children('.subfield-name').text().replace(':', ''),
						"age": $(this).children('.subfield-number').text().replace(' years', ''),
					})
				});

				resolve(json);
			})
			.catch((err) => {
				console.error(err);
				reject(err);
			});
	});
}

module.exports.getExpectancy = getExpectancy;