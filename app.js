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

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// Holds value for search bar
var currentSearch 

var userLogin = false

// creates a session
app.use(session({
    cookieName: 'session',
    secret: 'secret',
    duration: 1 * 60 * 60 * 1000,
    activeDuration: 1 * 30 * 60 * 1000
}));

// Homepage - sent to login page if not login
app.get('/', (request, response) => {
    if (userLogin == false) {
        response.render('login.hbs', {
            title: 'FrontRow - Log In',
            login: userLogin
        });
    } else {
        response.render('home.hbs', {
            title: 'FrontRow',
            login: userLogin
        });
    }
})

// Login page
app.get('/login', (request, response) => {
	response.render('login.hbs', {
		title: 'FrontRow - Log In',
        login: userLogin
	})
})


// Login method
app.post('/login', (req, res) => {
    user.login(req.body.username, (user) => {
    	if (user === 'failed') {
    		res.render('login.hbs', {
    			error: 'Invalid username'
    		});
    	} else if (user.password === req.body.password) {
    		req.session.user = user
            userLogin = true
    		res.redirect('/');
    	} else {
    		res.render('login.hbs', {
    			error: 'Wrong password'
    		});
    	}
    });
});

// Sign up page
app.get('/signup', (request, response) => {
	response.render('signup.hbs', {
		title: 'FrontRow - Sign Up',
        login: userLogin
	})
})

//Sign up method
app.post('/signup', (req, res) => {
    user.signup(req.body.username, req.body.password, req.body.comPassword, req.body.location, (user) => {
        if (user === 'failed username') {
            res.render('signup.hbs', {
                title: 'FrontRow - Sign Up',
                error: 'User already exist'
            });
        } else if (user === 'failed password') {
            res.render('signup.hbs', {
                title: 'FrontRow - Sign Up',
                error: "Passwords don't match"
            });
        } else if (user === 'empty') {
            res.render('signup.hbs', {
                title: 'FrontRow - Sign Up',
                error: "All fields cannot be empty"
            });
        } else {
            res.redirect('/');
        }
    })
});


app.get('/favourites', (request, response) => {
	response.render('favourites.hbs', {
		title: 'FrontRow - Favourite Artists',
		artists: favouriteList,
        login: userLogin
	})
})

app.post('/searchResults', (request, response) => {
	lastfm.getArtists(request.body.artist, (result) => {
		response.render('searchResults.hbs', {
			title: "FrontRow - Search Results",
			artist: request.body.artist,
			artistResults: result,
            login: userLogin
		});
	})
})

app.get('/upcoming', (request, response) => {
	songkick.returnConcerts(favouriteList, location, (concerts) => {
		response.render('upcoming.hbs', {
			title: "FrontRow - Upcoming",
			concertResults: concerts,
            login: userLogin
		})
	})
})

app.get('/logout', (req, res) => {
    req.session.reset();
    userLogin = false;
    res.redirect('/');
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`Server is up on the port ${8080}`);
});

