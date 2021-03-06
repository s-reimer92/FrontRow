const fs = require('fs');

var getFavouriteArtists = (user) => {
	// takes in a user and console logs the user's favourite artists
	// Tests if users.json can be interacted with
	var file = fs.readFileSync('users.json');

	var favouriteArtists = JSON.parse(file);

	for (i=0; i < favouriteArtists.length; i++) {
		if (favouriteArtists[i].username == user) {
			console.log(favouriteArtists[i].artists)
		}
	}

}

var addFavouriteArtists = (artistName, user, callback) => {
	// adds an artist to a specific user's favourite artists in users.json
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

	var file = fs.readFileSync('users.json');
	var usersList = JSON.parse(file);

	for (i=0; i < usersList.length; i++) {
		if (usersList[i].username == user) {
			callback(usersList[i])
		}
	}
};

var parseArtistName = (artistString) => {
	// iterates through the value of the submit button and returns the artist name
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