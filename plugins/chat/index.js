'use strict';

// Escapes Regular Expression String
RegExp.escape = function(s) {
   return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Escapes Regular Expression String
String.prototype.escapeNonCharacters = function() {
   return this.replace(/\?/g, ' $&');
};

String.prototype.indexOfRegex = function(regex){
  var match = this.match(regex);
  return match ? this.indexOf(match[0]) : -1;
}

const Say = require('../../utils/Say');
const runtime = require('../../utils/Runtime');
const Client = require('../../utils/Client');
const pluginSettings = require('./settings.json');

const TagDB = require('./database/tags.json');
const PatternDB = require('./database/patterns.json');
//const pluginSettings = require('./settings.json');

const geraldChatReplace = "@" + runtime.credentials.username + ": ";

let BOTMOOD = "normal";

module.exports = [{
	name: 'Chat',
	help: 'Captures messages to gerald and chats with user.',
  types: ['message'],
  regex: new RegExp(RegExp.escape(geraldChatReplace) + "|" + RegExp.escape(pluginSettings.bot_name)),
  action: function( chat, stanza ) {
		let user = stanza.user.username;
		let userMessage = stanza.message.replace(geraldChatReplace, '');

    let tags = GetTags(userMessage);
		chat.sendMessage("Tags: [" + tags.toString() + "]");
    let tagPattern = GetPattern(tags);
    chat.sendMessage("Best Pattern: [" + tagPattern.pattern.toString() + "]");
    //chat.sendMessage("Response: [" + tagPattern.responses[BOTMOOD].toString() + "]");
    let response = GetResponse(stanza, tagPattern.responses[BOTMOOD]);
    chat.sendMessage("Response Final: " + response.toString());

    Say.say(response.toString(), "Zira");
  }
}];

function GetTags(chat) {

  chat = " " + chat.toLowerCase() + " ";
  chat = chat.escapeNonCharacters();

  let tagArray = [];

  let tags = Object.keys(TagDB);

  for(let i = 0; i < tags.length; i++)
  {
    for(let j = 0; j < TagDB[tags[i]].length; j++)
    {
      let regexStr = "[" + RegExp.escape(". ,") + "]" + RegExp.escape(TagDB[tags[i]][j].toLowerCase()) + "[" + RegExp.escape(".?! ,") + "]";
      let regex = new RegExp(regexStr);
      if(chat.match(regex) != null)
      {
        let tag = {
          location: chat.indexOfRegex(regex),
          tag: tags[i]
        };
        tagArray.push(tag);
      }
    }
  }

  console.log(tagArray);

  tagArray.sort(function(a, b) {
      return a.location - b.location;
  })

  let tagArrayToReturn = [];

  for(let i = 0; i < tagArray.length; i++)
  {
    tagArrayToReturn.push(tagArray[i].tag);
  }

  console.log(tagArrayToReturn);

  return tagArrayToReturn;
}

function GetPattern(pattern) {

  let currentPattern = {
    pattern: [],
    numOfMatchesTotal: -1,
    numOfMatchesInOrder: -1,
    responses : {}
  };

  let bestPattern = {
    pattern: [],
    numOfMatchesTotal: -1,
    numOfMatchesInOrder: -1,
    responses : {}
  };

  for(let j = 0; j < PatternDB.length; j++)
  {
    let currentPatternArray = PatternDB[j].pattern;
    let currentPatternArray2 = PatternDB[j].pattern;
    currentPattern.pattern = currentPatternArray;
    currentPattern.responses = PatternDB[j].responses;
    currentPattern.numOfMatchesTotal = 0;
    currentPattern.numOfMatchesInOrder = 0;

    let currentMatch = 0;

    for(let i = 0; i < pattern.length; i++)
    {
      if(currentPatternArray[currentMatch] == pattern[i])
      {
        currentMatch++;
        currentPattern.numOfMatchesInOrder++;
      }

      if(currentPatternArray2.indexOf(pattern[i]) != -1)
      {
        currentPattern.numOfMatchesTotal++;
        //delete currentPatternArray2.indexOf(pattern[i]);
      }
    }

    console.log(bestPattern.numOfMatchesTotal + "<" + currentPattern.numOfMatchesTotal);
    console.log(bestPattern.numOfMatchesInOrder + "<=" + currentPattern.numOfMatchesInOrder);

    if(bestPattern.numOfMatchesTotal <= currentPattern.numOfMatchesTotal)
    {
      if(bestPattern.numOfMatchesInOrder <= currentPattern.numOfMatchesInOrder)
      {
          bestPattern = {
            pattern: currentPattern.pattern,
            numOfMatchesTotal: currentPattern.numOfMatchesTotal,
            numOfMatchesInOrder: currentPattern.numOfMatchesInOrder,
            responses: currentPattern.responses
          }
      }
    }

    console.log("\n\n");
  }

  return bestPattern;
}

function GetResponse(stanza, response) {

  let pointData = runtime.brain.get('points') || {};
  let user = stanza.user.username;
  let userPoints = pointData[user];
  response = response.replace("{{points}}", userPoints);
  response = response.replace("{{user}}", user);

  let date = new Date();
  let current_hour = date.getHours();
  let current_minutes = date.getMinutes();
  response = response.replace("{{time}}", current_hour + ":" + current_minutes);

  return response;
}
