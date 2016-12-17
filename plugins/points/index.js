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
const pluginSettings = require('./settings.json');

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

		// Update User storage in brain

		let pointData = runtime.brain.get('points') || null; // initialize the points storage
		let userData = runtime.brain.get('users') || null; // initialize the points storage

		if(pointData != undefined && pointData != null)
		{
			let activeUserList = Object.keys(userData);

			for(var i = 0; i < activeUserList.length; i++)
			{
				let tmpUser = activeUserList[i];
				if (tmpUser in pointData)
				{
					let tmpPoints = pointData[tmpUser];
					pointData[tmpUser] = tmpPoints + 1;
				}
				else
				{
					pointData[tmpUser] = 1;
				}
			}

			runtime.brain.set('points', pointData);
		}
		else
		{
			runtime.brain.set('points', {}); // create points storage if none
			console.log("-- Created empty point storage --");
		}

	}
}, {
	types: ['startup'],
	action: function(chat, stanza) {

		let pointData = runtime.brain.get('points') || null; // initialize the points storage

		if(pointData != undefined && pointData != null)
		{
			let userList = Object.keys(pointData);
			var purgeList = [];

			for(var i = 0; i < userList.length; i++)
			{
				let tmpUser = userList[i];
				let tmpPoints = pointData[tmpUser];

				if(tmpPoints <= pluginSettings.minPointPurge)
				{
					purgeList.push(tmpUser);
					delete pointData[tmpUser];
				}
			}

			if(purgeList.length > 0)
			{
				console.log("Purged the following users that had less then ["+pluginSettings.minPointPurge+"] points: " + purgeList);
				runtime.brain.set('points', pointData);
			}
		}
		else
		{
			runtime.brain.set('points', {}); // create points storage if none
			console.log("-- Created empty point storage --");
		}
	}
}];
