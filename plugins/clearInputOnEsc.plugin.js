//META{"name":"clearInputOnEsc"}*//

class clearInputOnEsc {
	getName(){return "Clear-Input-on-Escape"}
	getDescription(){return "Clears the chat input when you hit escape inside it."}
	getVersion(){return "1.1.0"}
	getAuthor(){return "square"}
	
	load(){}
	unload(){}
	
	start(){
		document.addEventListener("keydown", this.listener = function(e){
			if("Escape" === e.key && document.activeElement === document.querySelector(".content textarea"))
				document.activeElement.value = "";
				document.activeElement.dispatchEvent(new Event("input", { bubbles: true }));
		})
	}
	
	stop(){
		document.removeEventListener("keydown", this.listener);
	}
}
