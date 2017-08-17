//META{"name":"discordExperiments"}*//

var discordExperiments = (function(){
	var t, o = Object, k = "isDeveloper";
	return class _ {
		getName(){ return "Discord Experiments" }
		getDescription(){ return "Enables the experiments tab in discord's settings. Depends on samogot's Discord Internals Library: https://git.io/v7Sfp." }
		getAuthor(){ return "square" }
		getVersion(){ return "1.2.1" }

		load(){}

		start(){
			if( "undefined" !== typeof DiscordInternals ) {
				t = DiscordInternals.WebpackModules.findByUniqueProperties([k]);
				o.defineProperty(t,k,{get:_=>1,set:_=>_,configurable:true});
			} else {
				alert("Look who can't read.\nInstall the Discord Internals Library Plugin or this won't work!\nhttps://git.io/v7Sfp")
				console.error("Install Discord Internals Library!: https://github.com/samogot/betterdiscord-plugins/blob/master/v1/1lib_discord_internals.plugin.js");
			}
		}

		stop(){
			if(t){
				o.defineProperty(t,k,{get:_=>0,set:_=>{throw new Error("Username is not in the sudoers file. This incident will be reported");},configurable:true});
			}
		}
	};
})();
