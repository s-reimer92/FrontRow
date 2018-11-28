const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const lastfm = require('./lastfm.js');
const session = require('client-sessions');
const bodyParser = require('body-parser');

var user = require('./user.js');
// var connect = require('./connect.js');

var app = express();

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

//Holds value for search bar
var currentSearch 

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

app.post('/searchResults', (request, response) => {
	lastfm.getArtists(request.body.artist, (result) => {
		response.render('searchResults.hbs', {
			artist: request.body.artist,
			artistResults: result
		});
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