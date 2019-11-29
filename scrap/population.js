const cheerio = require("cheerio");
const rp = require("request-promise");

function getPopulation(nation) {
	console.log(`https://www.cia.gov/library/publications/the-world-factbook/geos/${nation}.html`);
	rp(`https://www.cia.gov/library/publications/the-world-factbook/geos/${nation}.html`)
		.then(function (html) {
			let $ = cheerio.load(html);

			const population = $("#field-population").html();
			$ = cheerio.load(population);
			let val = $('span[class=subfield-number]').text().replace(/,/g, "");

			console.log(val);
		}).catch(function (err) {
			console.error("Erreur");
		});
}

// xray('http://reddit.com', '.content')(fn)

module.exports.getPopulation = getPopulation;