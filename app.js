const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const lastfm = require('./lastfm.js')
const bodyParser = require('body-parser')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

//Holds value for search bar
var currentSearch 


app.get('/', (request, response) => {	
	response.render('home.hbs', {
		title: 'FrontRow'
	})
})

app.get('/login', (request, response) => {
	response.render('login.hbs', {
		title: 'FrontRow - Log In',
	})
})

app.get('/signup', (request, response) => {
	response.render('signup.hbs', {
		title: 'FrontRow - Sign Up',
	})
})

app.post('/searchResults', (request, response) => {
	lastfm.getArtists(request.body.artist, (result) => {
		response.render('searchResults.hbs', {
			artist: request.body.artist,
			artistResults: result
		});
	})
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`Server is up on the port ${8080}`);
});