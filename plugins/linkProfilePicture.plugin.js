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
		//AddedNodes only ever returns one node or nothing no need to iterate over it. Check to see if the first index of the array has something, nodeType to make sure it is an element, make sure it is the correct modal by both it's classname and the avatar descendant.
		if(addedNodes[0]&&addedNodes[0].nodeType===Node.ELEMENT_NODE&&addedNodes[0].classList.contains('modal-3c3bKg')&&addedNodes[0].getElementsByClassName('avatar-VxgULZ')[0]){
			var a,parent=addedNodes[0].getElementsByClassName('avatar-3EQepX')[0],child=parent.getElementsByTagName('svg')[0],img=child.getElementsByClassName('avatar-VxgULZ')[0];
			if(!parent||!child||!img)return;//Check if something went wrong.
			a=this.parseHTML(`<a class="linkProfilePicture" target="_blank" rel="noreferrer" href="${img.src.match(/https.+(?:webp|png|gif)/)[0]}?size=2048"></a>`)[0];
			a.appendChild(child);//Move the element named "child" to be a child of our "a" element.
			parent.appendChild(a);//Append "a" to our parent.
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
