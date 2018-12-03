const request = require('request');

//Takes an artist as a parameter and returns the unique ID of the most relevent match
var getArtistID = (artist, callback) => {
	request({
		url: "https://api.setlist.fm/rest/1.0/search/artists?artistName=" + encodeURIComponent(artist) + "&p=1&sort=relevance",
		json: true,
		headers: { "x-api-key": "5bd75213-9c63-4629-bcd0-5750e7558af5"}
	}, (error, response, body) => {	
		if (body == undefined) {
			callback("Artist is not featured in setlist.fm")
		} else {
		callback(body.artist[0].mbid)
		}
	});	
}

//Takes an artists ID and returns a list of their 20 most recent setlists
var getSetlist = (artistID, callback) => {
	request({
		url: "https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=" + encodeURIComponent(artistID) + "&p=1",
		json: true,
		headers: { "x-api-key": "5bd75213-9c63-4629-bcd0-5750e7558af5"}
	}, (error, response, body) => {
		if (body.setlist == undefined) {
			callback("No setlists have been recorded")
		} else {
		callback(body.setlist)
		}
	})
}
//Takes a setlist as a parameter and adds all songs into an array
var parseSetlist = (setlist) => {
	//Parses through each performance, as setlist.fm stores encores and multiple set performances seperately
	for (var i=0; i<setlist.length; i++) {
		//Parses through each song in the performance and adds to an array
		for (var j=0; j<setlist[i].song.length; j++){
			songArray.push(setlist[i].song[j].name)
		}
	}	
}		
//Takes an array of songs and returns the 10 most played
var analyzeSetlist = () => {
	//Counts is a dictionary object that contains each song and the number of times it occurs in songArray
	var counts = {};
	songArray.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

	//topSongs sorts the dictionary pairs by number and then slices to the top 10 entries
	var topSongs = Object.keys(counts).map(function(key) {
 		return [key, counts[key]];
	});
	topSongs.sort(function(first, second) {
  		return second[1] - first[1];
	});
	return topSongs.slice(0, 10);

	//To find percentage of the time that the band plays the song (Just in case a band has less than 10 entries)

	
}

var returnSetlist = (artist) => {
	songArray = []
	getArtistID(artist, (artistID) => {
		getSetlist(artistID, (output) => {
			for (var i=0; i<output.length; i++) {
				parseSetlist(output[i].sets.set)
			}
			var finalResults = analyzeSetlist();
			return finalResults;	
		})
	})
}

module.exports = {
	returnSetlist

}




