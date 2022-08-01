/**
 * @name discordExperiments
 * @website https://betterdiscord.app
 * @description Enables the experiments tab in discord's settings.
 * @author square
 * @version 1.3.0
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
