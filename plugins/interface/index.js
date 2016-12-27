'use strict';

/**
 * Test plugin example
 *
 * There must be an 'index.js' file for each plugin!
 * Plugins can then require additional files, if needed.
 *
 * Command 1:
 *
 * The first command will respond to any message with
 * with the contents 'test'. The bot will reply with
 * a string: 'I heard test!'.
 *
 * Command 2:
 *
 * The second command is a startup command. It will be called
 * during start up, after connecting to the server.
 * It logs out the string, "Starting the test plugin".
 * You can use startup commands to initialize storage mechanisms,
 * or to connect to APIs, etc, etc.
 */

const runtime = require('../../utils/Runtime');
const Client = require('../../utils/Client');
var express = require('express');
var path = require('path');
var app = express();
var router = express.Router();
var exphbs = require('express-handlebars');

module.exports = [{
	types: ['message'],
	regex: /^test$/,
	action: function(chat, stanza) {
		console.log("STANZA: \n");
		console.log(stanza);

		console.log("CHAT: \n");
		console.log(chat);

		chat.sendMessage('I heard test!');
	}
},
{
	types: ['reoccuring'],
	regex: /^test$/,
	action: function(chat, stanza) {

	}
}, {
	types: ['startup'],
	action: function(chat, stanza) {

		let baseURL = __dirname + "\\public";

		app.set('port', process.env.PORT || 3000);
		var options = {
			dotfiles: 'ignore',
			etag: false
		};

		app.use(express.static(baseURL, options));
		app.set('views', baseURL + '/views');
		app.set('view options', { layout: false });

		app.engine('handlebars', exphbs({
			defaultLayout: 'main',
			layoutsDir: baseURL + '/views/layouts',
      partialsDir: baseURL + '/views/partials'
		}));
		app.set('view engine', 'handlebars');

		app.get('/script/:file', function(req, res)
		{
			res.sendFile(baseURL + '/scripts/' + req.params.file);
		});

		app.get('/style/:file', function(req, res)
		{
			res.sendFile(baseURL + '/styles/' + req.params.file);
		});

		app.get('/', function(req, res)
		{
			res.render('home');
		});

		app.get('/users', function(req, res)
		{
			var userData = runtime.brain.get('users') || {};
			var activeUserList = Object.keys(userData);

			var usersToReturn = [];

			for(var i = 0; i < activeUserList.length; i++)
			{
				var tmpUser = activeUserList[i];
				var tmpUserObj = {
					"username": tmpUser,
					"role": userData[tmpUser].role,
					"status": userData[tmpUser].status,
					"last_visit": userData[tmpUser].lastVisitTime
				};
				if(userData[tmpUser].watching)
					usersToReturn.push(tmpUserObj);
			}

			res.send(usersToReturn);
		});

		app.listen(app.get('port'),  function () {
			console.log('Hello express started on http://localhost:' +
			app.get('port') + '; press Ctrl-C to terminate.' );
		});
  }
}];
