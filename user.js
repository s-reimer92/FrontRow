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

function signup(username, password, callback) {

}

module.exports = {
	login
}