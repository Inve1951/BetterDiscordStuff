/**
 * @name discordExperiments
 * @description Enables the experiments tab in discord's settings.
 * @author square
 * @version 1.3.0
 * @website https://betterdiscord.app/plugin/Discord%20Experiments
 * @source https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/discordexperiments.plugin.js
 * @updateUrl https://betterdiscord.app/gh-redirect?id=206
 */

const storeExports = BdApi.findModule(m => Reflect.has(m?.default, "isDeveloper"));
const original = storeExports.default;

module.exports = class {
	getName(){ return "Discord Experiments"; }

	start() {
    storeExports.default = new Proxy(original, {
			get(_, key) {
				return key === "isDeveloper" ? true : original[key];
			}
		});
	}

	stop(){
		storeExports.default = original;
	}
};
