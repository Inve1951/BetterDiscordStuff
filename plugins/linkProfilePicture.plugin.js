//META{"name":"linkProfilePicture"}*//

class linkProfilePicture {
	getName(){return "Link-Profile-Picture"}
	getDescription(){return "Lets you click users' avatars on their profile page to view a bigger version in your browser."}
	getVersion(){return "1.0.0"}
	getAuthor(){return "square"}
	
	load(){}
	unload(){}
	
	start(){}
	stop(){}
	
	observer(mutation){
		var x, i = 0,
			ref = mutation.addedNodes,
			wrapper, a, pic, url;
		while(x = ref[i++]) if("DIV" === x.nodeName && 0 === x.className.indexOf("modal-") && (x = x.querySelector("#user-profile-modal"))) {
			if((wrapper = x.querySelector(".avatar-wrapper")) && (pic = wrapper.querySelector(".avatar-profile")) && (url = pic.style.backgroundImage.match(/https.+(?:webp|gif)/))){
				a = document.createElement("a");
				a.href = url[0] + "?size=2048";				// returns biggest version (can be smaller than 2048); if the pic is blurry it's due to the original or what discord did to it
				a.target = "_blank"; a.rel = "noreferrer";
				pic.remove();
				a.appendChild(pic);
				wrapper.appendChild(a);
			}
			break;
		}
	}
}
