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
				let jsonArray = [];

				$('#field-life-expectancy-at-birth').find('.subfield').each(function (i, elem) {
					let json = {};
					json['nation_code'] = nation;
					json['genre'] = $(this).children('.subfield-name').text().replace(':', '');
					json['age'] = $(this).children('.subfield-number').text().replace(' years', '');
					jsonArray.push(json);
				});

				console.log(jsonArray);

				resolve(jsonArray);
			})
			.catch((err) => {
				console.error(err);
				reject(err);
			});
	});
}

module.exports.getExpectancy = getExpectancy