//META{"name":"forceClose"}*//
function forceClose() {};

forceClose.prototype.getName = function(){ return "Force-Close" };
forceClose.prototype.getDescription = function(){ return "Actually closes discord when clicking the close button." };
forceClose.prototype.getVersion = function(){ return "1.0.0" };
forceClose.prototype.getAuthor = function(){ return "square" };

forceClose.prototype.start = function(){
	document.querySelector('[class*="winButtonClose"]').onclick = function(){
		require("electron").remote.require("electron").app.quit();
	};
};

forceClose.prototype.stop = function(){
	document.querySelector('[class*="winButtonClose"]').onclick = void 0;
};

forceClose.prototype.load =
forceClose.prototype.unload =
forceClose.prototype.onSwitch =
forceClose.prototype.observer = function(){};
