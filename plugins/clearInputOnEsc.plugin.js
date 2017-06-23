//META{"name":"clearInputOnEsc"}*//

class clearInputOnEsc {
	getName(){return "Clear-Input-on-Escape"}
	getDescription(){return "Clears the chat input when you hit escape inside it."}
	getVersion(){return "1.0.1"}
	getAuthor(){return "square"}
	
	load(){}
	unload(){}
	
	start(){
		document.addEventListener("keydown", this.listener = function(e){
			if("Escape" === e.key && document.activeElement === document.querySelector(".channel-textarea textarea"))
				document.activeElement.value = ""
		})
	}
	
	stop(){
		document.removeEventListener("keydown", this.listener)
	}
}
