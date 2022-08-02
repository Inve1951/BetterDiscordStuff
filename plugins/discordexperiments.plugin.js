/**
 * @name discordExperiments
 * @description Enables the experiments tab in discord's settings.
 * @author square, AAGaming00
 * @version 1.3.1
 * @website https://betterdiscord.app/plugin/Discord%20Experiments
 * @source https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/discordexperiments.plugin.js
 * @updateUrl https://betterdiscord.app/gh-redirect?id=206
 */

const settingsStore = BdApi.findModule(m => typeof m?.default?.isDeveloper !== "undefined");
const userStore = BdApi.findModule(m => m?.exports?.default?.getUsers);

module.exports = class {
	getName(){ return "Discord Experiments"; }

	start() {
		const nodes = Object.values(settingsStore.default._dispatcher._dependencyGraph.nodes);
		try {
			nodes.find(x => x.name == "ExperimentStore").actionHandler["CONNECTION_OPEN"]({user: {flags: 1}, type: "CONNECTION_OPEN"})
		} catch (e) {} // this will always intentionally throw
		const oldGetUser = userStore.default.__proto__.getCurrentUser;
		userStore.default.__proto__.getCurrentUser = () => ({hasFlag: () => true})
		nodes.find(x => x.name == "DeveloperExperimentStore").actionHandler["CONNECTION_OPEN"]()
		userStore.default.__proto__.getCurrentUser = oldGetUser
	}

	stop(){
		Object.values(settingsStore.default._dispatcher._dependencyGraph.nodes).find(x => x.name == "ExperimentStore").actionHandler["CONNECTION_OPEN"]({user: {flags: 0}, type: "CONNECTION_OPEN"})
	}
};
