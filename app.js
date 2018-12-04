// All required node modules
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const session = require('client-sessions');
const bodyParser = require('body-parser');

// Functions created by ourselves
const setlist = require('./setlist.js');
const songkick = require('./songkick.js');
const userData = require('./userData.js')
const lastfm = require('./lastfm.js');
const user = require('./user.js');

// Set up an Express app
var app = express();

// Set up the bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Set up hbs directory
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// Keep track of user login status
var userLogin = false;

// Creates a session for user
app.use(session({
    cookieName: 'session',
    secret: 'secret',
    duration: 1 * 60 * 60 * 1000,
    activeDuration: 1 * 30 * 60 * 1000
}));

// Homepage, redirect to login page if not login
app.get('/', (request, response) => {
    if (userLogin == false) {
        response.render('login.hbs', {
            title: 'FrontRow - Log In',
            login: userLogin
        });
    } else {
        response.render('home.hbs', {
            title: 'FrontRow',
            username: request.session.user.username,
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


// POST method for login
app.post('/login', (request, response) => {
    user.login(request.body.username, request.body.password, (user) => {
    	if (user === 'failed username') {
    		response.render('login.hbs', {
    			error: 'Invalid username'
    		});
    	} else if (user === "failed password") {
    		response.render('login.hbs', {
                error: 'Wrong password'
            });
    	} else {
            request.session.user = user;
            userLogin = true;
            response.redirect('/');
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

// POST method for signup
app.post('/signup', (request, response) => {
    user.signup(request.body.username, request.body.password, request.body.comPassword, request.body.location, (user) => {
        if (user === 'failed username') {
            response.render('signup.hbs', {
                title: 'FrontRow - Sign Up',
                error: 'User already exist'
            });
        } else if (user === 'failed password') {
            response.render('signup.hbs', {
                title: 'FrontRow - Sign Up',
                error: "Passwords don't match"
            });
        } else if (user === 'empty') {
            response.render('signup.hbs', {
                title: 'FrontRow - Sign Up',
                error: "All fields cannot be empty"
            });
        } else {
            response.redirect('/');
        }
    })
});

// Favourites page, redirect to login page if not login
app.get('/favourites', (request, response) => {
    if (userLogin == false) {
        response.redirect('/')
    } else {
            response.render('favourites.hbs', {
            title: 'FrontRow - Favourite Artists',
            artists: request.session.user.artists,
            login: userLogin
        })
    }
})

app.post('/addToFavourites', (request, response) => {
    var artistName = userData.parseArtistName(request.body.favourite);
    userData.addFavouriteArtists(artistName, request.session.user.username, (user) => {
        request.session.user = user;
        response.redirect('/');
    });

})

// POST method for searching artists
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

// upcoming show page, redirect to login page if not login
app.get('/upcoming', (request, response) => {
    if (userLogin == false) {
        response.redirect('/')
    } else {
    	songkick.returnConcerts(request.session.user.artists, request.session.user.location, (concerts) => {
    		response.render('upcoming.hbs', {
    			title: "FrontRow - Upcoming",
    			concertResults: concerts,
                login: userLogin
    		})
    	})
    }
})

app.post('/upcoming', (request, response) => {

})

// GET method for log out, end current session and redirect to homepage
app.get('/logout', (request, response) => {
    request.session.reset();
    userLogin = false;
    response.redirect('/');
});


const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`Server is up on the port ${8080}`);
});

