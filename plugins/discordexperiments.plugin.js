/**
 * @name discordExperiments
 * @description Enables the experiments tab in discord's settings.
 * @author square
 * @version 1.3.1
 * @website https://betterdiscord.app/plugin/Discord%20Experiments
 * @source https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/discordexperiments.plugin.js
 * @updateUrl https://betterdiscord.app/gh-redirect?id=206
 */

const settingsExports = BdApi.findModule(m => m?.default?.toString().includes("Developer Options"));
const original = settingsExports.default;

module.exports = class {
	getName(){ return "Discord Experiments"; }

	start() {
		settingsExports.default = (...args) => {
			let ret = original(...args)
			ret.forEach(e => e.predicate?.toString()?.includes("isDeveloper") && delete e.predicate)
			return ret;
		}
	}

	stop(){
		settingsExports.default = original;
	}
};
