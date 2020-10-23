/**
 * @name discordExperiments
 * @website https://inve1951.github.io/BetterDiscordStuff/
 */

var discordExperiments = (t => class {
	getName(){ return "Discord Experiments" }
	getDescription(){ return "Enables the experiments tab in discord's settings." }
	getAuthor(){ return "square" }
	getVersion(){ return "1.2.3" }

	load(){}

	start(){
		t = BdApi.findModuleByProps(["isDeveloper"]);
		Object.defineProperty(t,"isDeveloper",{get:_=>1,set:_=>_,configurable:true});
	}

	stop(){
		t && Object.defineProperty(t,"isDeveloper",{
			get:_=>0,
			set:_=>{
				throw new Error("Username is not in the sudoers file. This incident will be reported");
			},
			configurable: true
		});
	}
})();
