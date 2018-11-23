const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const lastfm = require('./lastfm.js')

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

//Holds value for search bar
var currentSearch


app.get('/', (request, response) => {	
	response.render('home.hbs', {
		title: 'Front Row'
	})
})

app.get('/login', (request, response) => {
	response.render('login.hbs', {
		title: 'Log In',
	})
})

app.get('/signup', (request, response) => {
	response.render('signup.hbs', {
		title: 'Sign Up',
	})
})

const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`Server is up on the port ${8080}`);
});