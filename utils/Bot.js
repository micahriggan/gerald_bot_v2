class Bot {
  constructor(Brain) {
    this.brain = Brain;
    this.startCommands = [];
    this.tickCommands = [];
    this.middleware = [];
    this.client = null;
  }
  listen(client) {
    this.client = client;
    this.client.onMessage((message) => {
      this.middleware.forEach((handler) => {
        handler(this, message);
      });
    });
  }
  say(message) {
    client.sendMessage(message);
  }
  start() {
    run(this.startCommands);
    let commandCycle = Settings.getSetting('coreApp', 'app_cycle');
    setTimeout(this.tick, commandCycle * 1000);
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
  }
}
use(command) {
  this.middleware.push(command);
}
run(commands = []) {
  commands.forEach((command) => {
    command(this);
  });
}
}
