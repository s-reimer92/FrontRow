const request = require('request');

//Gets the songkick id of the location
const getLocation = (city, callback) => {
	request({
		url: "https://api.songkick.com/api/3.0/search/locations.json?query=" + encodeURIComponent(city) + "&apikey=7XGKU5ekAA1FiTOX",
		json: true,
	}, (error, response, body) => {
		callback(body.resultsPage.results.location[0].metroArea.id)
		
	});
};

//Gets the number of concerts in the metro area
const getNumPages = (cityID, callback) => {
	request({
		url: "https://api.songkick.com/api/3.0/metro_areas/" + encodeURIComponent(cityID) + "/calendar.json?apikey=7XGKU5ekAA1FiTOX",
		json: true,
	}, (error, response, body) => {
		numPages=body.resultsPage.totalEntries/50	
		callback(Math.ceil(numPages))
	});
};




//Parses over each concert in the page 
var parsePage = (cityID, pageNum, favList, resultsList) => {
	return new Promise(resolve => {
			request({
				url: "https://api.songkick.com/api/3.0/metro_areas/" + encodeURIComponent(cityID) + "/calendar.json?apikey=7XGKU5ekAA1FiTOX&page=" + encodeURIComponent(pageNum),
				json: true
			}, (error, response, body) => {
				//parse over each concert
				for (i=0;i<body.resultsPage.results.event.length; i++) {
					//parse over each band
					for (j=0; j<body.resultsPage.results.event[i].performance.length; j++) {
						//adds band to list if in favourites
						console.log(body.resultsPage.results.event[i].performance[j].displayName);
						if (favList.includes(body.resultsPage.results.event[i].performance[j].displayName)) {
							resultsList.push(body.resultsPage.results.event[i].performance)
						}
					}
				}
				
			})
		
	})
}

var parseResults = async (cityID, numPages, favList, resultsList) => {
	for (i=0; i<numPages; i++) {
		await parsePage(cityID, i+1, favList, resultsList)
	}
	return resultsList
}

var favouriteList = ["Jann Arden", "Metallica", "Ella Mai", "Musica Intima"]
var list = []

parseResults(27398, 10, favouriteList, list).then((results) => {
	console.log(list);
}).catch((e) => {
	console.log(e);
})