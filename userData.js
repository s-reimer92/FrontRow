const fs = require('fs');

var getFavouriteArtists = (user) => {
	var file = fs.readFileSync('users.json');

	var favouriteArtists = JSON.parse(file);

	for (i=0; i < favouriteArtists.length; i++) {
		if (favouriteArtists[i].username == user) {
			console.log(favouriteArtists[i].artists)
		}
	}

	// console.log(favouriteArtists[1])
}

var addFavouriteArtists = (artistName, user) => {
	var artist = artistName

	var file = fs.readFileSync('users.json');
	var favouriteArtists = JSON.parse(file);

	for (i=0; i < favouriteArtists.length; i++) {
		if (favouriteArtists[i].username == user) {
			favouriteArtists[i].artists.push(artist)
		}
	}

	var favouriteArtistsString = JSON.stringify(favouriteArtists);
	fs.writeFileSync('users.json', favouriteArtistsString);
};

var parseArtistName = (artistString) => {
	var artistName = artistString
	for (var i = 4; i < artistString.length+3; i++) {
        if(artistName[i] == ' ' && artistName[i+1] == 't' && artistName[i+2] == "o" && artistName[i+3] == " "){
            artistName = artistName.slice(4,i);
        }
    }
    return artistName;
}

module.exports= {
	getFavouriteArtists,
	addFavouriteArtists,
	parseArtistName
}