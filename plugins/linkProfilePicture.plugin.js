//META{"name":"linkProfilePicture","source":"https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/linkProfilePicture.plugin.js","website":"https://github.com/Inve1951"}*//

class linkProfilePicture {
	getName(){return "Link-Profile-Picture"}
	getDescription(){return "Lets you click users' avatars on their profile page to view a bigger version in your browser."}
	getVersion(){return "1.0.4"}
	getAuthor(){return "square"}

	load(){}
	start(){}
	stop(){}

	observer({addedNodes}){
		if(addedNodes[0]&&addedNodes[0].hasClass&&addedNodes[0].hasClass('modal-3c3bKg')&&addedNodes[0].getElementsByClassName('avatar-VxgULZ')[0]){
			var a,parent=addedNodes[0].getElementsByClassName('avatar-3EQepX')[0],child=parent.getElementsByTagName('svg')[0],img=child.getElementsByClassName('avatar-VxgULZ')[0];
			if(parent&&child){
				a=this.parseHTML(`<a class="linkProfilePicture" target="_blank" rel="noreferrer" href="${img.src.match(/https.+(?:webp|png|gif)/)[0]}?size=2048">
					${child.outerHTML}
				</a>`)[0];
				parent.replaceChild(a,child);
			}
		}
	}

	parseHTML(html=[]){
		if(html.constructor===String&&/(<[^<>]+>)/g.test(html)){
			var template=document.createElement('template');
			template.innerHTML=html.trim();
			return template.content.childNodes;
		}
		return null;
	}
}
