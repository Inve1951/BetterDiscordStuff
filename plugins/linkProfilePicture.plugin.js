//META{"name":"linkProfilePicture","source":"https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/linkProfilePicture.plugin.js","website":"https://Inve1951.github.io/BetterDiscordStuff"}*//

class linkProfilePicture {
	getName(){return "Link-Profile-Picture"}
	getDescription(){return "Lets you click users' avatars on their profile page to view a bigger version in your browser."}
	getVersion(){return "1.0.4"}
	getAuthor(){return "square"}

	start(){}
	stop(){}

	observer({addedNodes: [modal]}){
    var wrapper, img, a;
		if(
      modal && Node.ELEMENT_NODE === modal.nodeType && modal.classList.contains("modal-3c3bKg") &&
      (wrapper = modal.querySelector(".avatar-3EQepX")) &&
      (img = wrapper.querySelector(".avatar-VxgULZ"))
    ){
			a = document.createElement("a");
      a.id = "LinkProfilePicture"
			a.href = img.src.replace(/(?:\?size=\d{3,4})?$/, "?size=4096"); // returns biggest version (can be smaller than 4096); if the pic is blurry it's due to the original or what discord did to it
			a.target = "_blank";
			a.rel = "noreferrer";
      wrapper.insertBefore(a, wrapper.firstChild);
			a.appendChild(a.nextSibling);
		}
	}
}
