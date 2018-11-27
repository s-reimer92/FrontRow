const request = require('request');


//Takes a search term as a parameter and returns a list of 10 results
var getArtists = (artist, callback) => {
	request({
		url: "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + encodeURIComponent(artist) + "&api_key=e006c67d7936e45b2cfa8fed71da22a6&format=json",
		json: true,
	}, (error, response, body) => {
		var searchresults = []
		for (var i=0; i<10; i++){
			searchresults.push(JSON.stringify(body.results.artistmatches.artist[i].name, undefined, 2))				}
		callback(searchresults)
		
	});
};


module.exports = {
	getArtists
}

// TEST FUNCTION
getArtists('black', (results) => {
	console.log(results);
});

