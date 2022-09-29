/**
 * @name discordExperiments
 * @description Enables the experiments tab in discord's settings.
 * @author square
 * @version 1.3.1
 * @website https://betterdiscord.app/plugin/Discord%20Experiments
 * @source https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/discordexperiments.plugin.js
 * @updateUrl https://betterdiscord.app/gh-redirect?id=206
 */

const settingsStore = BdApi.findModule(m => typeof m?.isDeveloper !== "undefined");
const userStore = BdApi.findModule(m => m?.getUsers && m?._version == undefined);

module.exports = class {
	getName(){ return "Discord Experiments"; }

	start() {
		const nodes = Object.values(settingsStore._dispatcher._actionHandlers._dependencyGraph.nodes);
		try {
			nodes.find(x => x.name == "ExperimentStore").actionHandler["OVERLAY_INITIALIZE"]({user: {flags: 1}, type: "CONNECTION_OPEN"})
		} catch (e) {} // this will always intentionally throw
		const oldGetUser = userStore.__proto__.getCurrentUser;
		userStore.__proto__.getCurrentUser = () => ({hasFlag: () => true})
		nodes.find(x => x.name == "DeveloperExperimentStore").actionHandler["OVERLAY_INITIALIZE"]()
		userStore.__proto__.getCurrentUser = oldGetUser
	}

	stop(){
		try {
		    Object.values(settingsStore._dispatcher._actionHandlers._dependencyGraph.nodes).find(x => x.name == "ExperimentStore").actionHandler["OVERLAY_INITIALIZE"]({user: {flags: 0}, type: "CONNECTION_OPEN"})
		} catch (e) {
			if (e.message != "Cannot read property 'hasLoadedExperiments' of undefined") {
				throw e;
			}
		}
	}
};
