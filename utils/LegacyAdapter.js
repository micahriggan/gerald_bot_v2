function LegacyAdapter(plugins) {
  return plugins.map((plugin) => {
    return (bot, message) => {
      let params = [];
      let action = null;
      if (plugin.types.indexOf("interface") > -1) {
        params = [bot.brain.api];
        action = plugin.action;
				if(typeof(action === "array")){
					action = action[0];
				}
      }
      if (plugin.types.indexOf("message") > -1 || plugin.types.indexOf("presence") > -1) {
        params = [bot.client, message];
        action = ChatBot.runCommand;
      }
      action(plugin, ...params)
    };
  });
}
module.exports = LegacyAdapter;
