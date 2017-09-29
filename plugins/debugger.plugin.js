//META{"name":"dddddebug"}*//


var dddddebug = (function(listener){

  var key = "F8"; // default: "F8"

	class dddddebug {
    getName(){return "Debugger (F8 Fix)"}
		getDescription(){return "Just runs `debugger`. Change hotkey in the file"}
		getVersion(){return "0.0.1"}
		getAuthor(){return "square"}

		start(){
      document.addEventListener("keydown", (listener = function(e){
        if(e.key !== key) return;
        debugger;
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }), true);
    }

		stop(){
      document.removeEventListener("keydown", listener, true);
    }

		load(){}
	}
	return dddddebug;
})()
