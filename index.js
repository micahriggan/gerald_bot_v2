'use strict';

/**
 * LCTV Bot :)
 */
const Bot = require('./utils/Bot');
const LegacyAdapter = require('./utils/LegacyAdapter');
const credentials = require('./setup/custom/credentials');
const Brain = require('./utils/Brain');
const ChatBot = require('./utils/ChatBot');
const Client = require('./utils/Client');
let api = require('./plugins/interface/index').appAPI;

// Build the initial runtime object
let runtime = require('./utils/Runtime');
runtime.debug = process.argv[2] === 'debug' || false;
runtime.coreCommands = null;
runtime.pluginCommands = null;
runtime.websocketCommands = null;
runtime.startUpTime = new Date().getTime();
runtime.credentials = credentials;
runtime.brain = new Brain(api);


// Verify credentials exist
if (!runtime.credentials.username || !runtime.credentials.room || !runtime.credentials.password || !runtime.credentials.jid || !runtime.credentials.roomJid) {
  console.error('ERROR: Credentials file is missing required attributes. Please check your credentials.js');
  console.log('[bot] Quitting startup process.');
  return;
}


runtime.brain.start(__dirname + "/brain");
let chat = new Client(runtime.credentials);
let micahBot = new Bot(runtime.brain);

micahBot.use((bot, message) => {
  // simple example of middleware
  if (message.type === "message")
    console.log(message)
});

micahBot.use((bot, message) => {
	message.test = 123;
  //Example of rate limiting middleware
  let messages = bot.brain.get('userMessages') || {};
  let userMessageLog = messages[message.user];

  // Don't rate limit the bot
  if (message.user !== credentials.username && userMessageLog) {
    let lastCommandTimeExists = userMessageLog.lastCommandTime > 0;
    if (lastCommandTimeExists && now - userMessageLog.lastCommandTime < 3000) { // 3 seconds
      message.rateLimited = true;
    }
  }
});

//example of legacy adapter
const PointPlugin = require('./plugins/points');
micahBot.use(LegacyAdapter(PointPlugin));

micahBot.listen(chat);
