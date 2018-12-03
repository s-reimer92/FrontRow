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

getFavouriteArtists('shaun')