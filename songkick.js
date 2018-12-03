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

//Parses through results to find any bands we like
var parseResults = (cityID, numPages, favList, callback) => {
	//currentRequests tracks the number of async requests currently being processed
	var currentRequests = numPages;
	var resultsList = []
	//Iterates over every page of results from API
	for (let i=1; i<numPages+1; i++) {
		request({
			url: "https://api.songkick.com/api/3.0/metro_areas/" + encodeURIComponent(cityID) + "/calendar.json?apikey=7XGKU5ekAA1FiTOX&page=" + encodeURIComponent(i),
			json: true
		}, (error, response, body) => {

			//Iterates over each show on page
			for (let j=0;j<body.resultsPage.results.event.length; j++) {

				//Iterates over each band in show
				for (let k=0; k<body.resultsPage.results.event[j].performance.length; k++) {

					//checks if band is favourited
					if (favList.includes(body.resultsPage.results.event[j].performance[k].displayName)) {
						resultsList.push(body.resultsPage.results.event[j])
					}
				}
			}
			currentRequests--

			//Finishes after all async requests are completed
			if (currentRequests == 0) {
				//Sorts by date
				resultsList.sort(function(a,b) {
					if(a.start.date == b.start.date) {
        				return 0;
					} if(a.start.date < b.start.date) {
						return -1;
					} if(a.start.date > b.start.date) {
						return 1;
					}
        
				})

				callback(resultsList)

			}
		})	

	}
}

var returnConcerts = (favList, location) => {
	getLocation(location, (locationID) => {
		getNumPages(locationID, (numPages) => {
			parseResults(locationID, numPages, favList, (results) => {
				console.log(results);
			})
		})
	})
}

module.exports = {
	returnConcerts
}
// Test Function 
/*
var favouriteList = ["JMSN", "Metallica", "Ella Mai", "Musica Intima"]
returnConcerts(favouriteList, 'Burnaby')
*/
