let Ware = require('ware');
class Bot {
  constructor(Brain) {
    this.brain = Brain;
    this.startCommands = [];
    this.tickCommands = [];
    this.middleware = Ware();
    this.client = null;


		this.listen = this.listen.bind(this);
		this.say = this.say.bind(this);
		this.start = this.start.bind(this);
		this.onStart = this.onStart.bind(this);
		this.onTick = this.onTick.bind(this);
		this.tick = this.tick.bind(this);
		this.use = this.use.bind(this);
		this.run = this.run.bind(this);
  }
  listen(client, triggerName) {
    this.client = client;
    this.client[triggerName]((message) => {
      this.middleware.run(this, message);
    });
  }
  say(message) {
    this.client.sendMessage(message);
  }
  start() {
    this.run(this.startCommands);
    this.tick();
  }
  onStart(command) {
    this.startCommands.push(command);
  }
  onTick(command) {
    this.tickCommands.push(command);
  }
  tick() {
    console.log("-- Update Tick --");
    this.run(this.tickCommands);
    setTimeout(this.tick, 1000);
  }
  //tail recursively handle lists of functions
  use(commands) {
    if (typeof (commands) === "array" || typeof (commands) === "function")
      this.middleware.use(commands);
  }
  run(commands = []) {
    commands.forEach((command) => {
      command(this);
    });
  }
}
module.exports = Bot;
