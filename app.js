const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const lastfm = require('./lastfm.js');
const session = require('client-sessions');
const bodyParser = require('body-parser');
const setlist = require('./setlist.js');
const songkick = require('./songkick.js');

var user = require('./user.js');
// var connect = require('./connect.js');

var app = express();

//User Info
var location = '';
var favouriteList = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// creates a session
app.use(session({
    cookieName: 'session',
    secret: 'secret',
    duration: 1 * 60 * 60 * 1000,
    activeDuration: 1 * 30 * 60 * 1000
}));

// Homepage
app.get('/', (request, response) => {	
	response.render('home.hbs', {
		title: 'FrontRow',
		login: false
	})
})

app.get('/login', (request, response) => {
	response.render('login.hbs', {
		title: 'FrontRow - Log In',
	})
})

app.post('/login', function(req, res) {
    user.login(req.body.username, (user) => {
    	if (user === 'failed') {
    		res.render('login.hbs', {
    			error: 'Invalid username'
    		});
    	} else if (user.password === req.body.password) {
    		req.session.user = user
    		location = user.location;
    		favouriteList = user.artists
    		res.render('home.hbs', {
    			title: `FrontRow - ${user.username}`,
				login: true
    		});
    	} else {
    		res.render('login.hbs', {
    			error: 'Wrong password'
    		});
    	}
    });
});

app.get('/signup', (request, response) => {
	response.render('signup.hbs', {
		title: 'FrontRow - Sign Up',
	})
})

app.get('/favourites', (request, response) => {
	response.render('favourites.hbs', {
		title: 'FrontRow - Favourite Artists',
		artists: favouriteList
	})
})

app.post('/searchResults', (request, response) => {
	lastfm.getArtists(request.body.artist, (result) => {
		response.render('searchResults.hbs', {
			title: "FrontRow - Search Results",
			artist: request.body.artist,
			artistResults: result
		});
	})
})

app.get('/upcoming', (request, response) => {
	songkick.returnConcerts(favouriteList, location, (concerts) => {
		response.render('upcoming.hbs', {
			title: "FrontRow - Upcoming",
			concertResults: concerts
		})
	})
})

app.get('/logout', (req, res) => {
    req.session.reset();
    res.render('home.hbs', {
    	title: "FrontRow",
    	login: false
    });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`Server is up on the port ${8080}`);
});

