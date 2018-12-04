// Required fs module
const fs = require('fs');

// Login function that passes User object or error message to callback
function login(username, password, callback) {
	var readUser = fs.readFileSync('users.json');
	var usersList = JSON.parse(readUser);
	for (var i = 0; i < usersList.length; i++) {
		if (username == usersList[i].username) {
			if (password == usersList[i].password){
				callback(usersList[i]);
			} else {
				callback('failed password')
			}
			
		} else if (i == usersList.length - 1) {
			callback('failed username');
		}
	}
}

// Signup function that verifies signup information and write it to JSON file
function signup(username, password, comPassword, location, callback) {
	if (password != comPassword) {
		callback('failed password');
	} else if (username == "" || password == "" || location == "") {
		callback('empty')
	} else {
		var readUser = fs.readFileSync('users.json');
		var usersList = JSON.parse(readUser);
		for (var i = 0; i < usersList.length; i++) {
			if (username == usersList[i].username) {
				callback('failed username');
			} else if (i == usersList.length - 1) {
				newUser = {
					username: username,
					password: password,
					location: location,
					artists: []
				};

				usersList.push(newUser);
				var resultingString = JSON.stringify(usersList);
				fs.writeFileSync('users.json', resultingString);
				callback(newUser);
			}
		}
	}

}


module.exports = {
	login,
	signup
}