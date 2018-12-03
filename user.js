const fs = require('fs');

function login(username, callback) {
	var readUser = fs.readFileSync('users.json');
	var usersList = JSON.parse(readUser);
	for (var i = 0; i < usersList.length; i++) {
		if (username == usersList[i].username) {
			callback(usersList[i]);
		} else if (i == usersList.length - 1) {
			callback('failed');
		}
	}
	// systemObject.tickets.push(ticket);
	// var resultingString = JSON.stringify(systemObject);
	// fs.writeFileSync('a2.json', resultingString);
	// console.log("ticket added!")
}

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