/**
 * @name Link-Profile-Picture
 * @description Lets you click users' avatars on their profile page to view a bigger version in your browser.
 * @version 1.2.4
 * @author square
 * @authorLink https://betterdiscord.app/developer/square
 * @website https://betterdiscord.app/plugin/Link-Profile-Picture
 * @source https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/linkProfilePicture.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Inve1951/BetterDiscordStuff/master/plugins/linkProfilePicture.plugin.js
 */

module.exports = (_ => {
	const config = {
		"info": {
			"name": "Link-Profile-Picture",
			"author": "square",
			"version": "1.2.4",
			"description": "Lets you click users' avatars on their profile page to view a bigger version in your browser."
		}
	};
  return class linkProfilePicture {
    load() {
      document.addEventListener("click", LinkProfilePicture, true);
      this.stop = document.removeEventListener.bind(document, "click", LinkProfilePicture, true);
      function LinkProfilePicture({ target }) {
        if (target.classList.contains("avatar-3QF_VA") && target.parentElement?.parentElement?.classList.contains("header-S26rhB")) {
          window.open(target.querySelector("img").src.replace(/(?:\?size=\d{3,4})?$/, "?size=4096"), "_blank");
        }
      }
    }
    start () {this.load();}
    stop () {}
  };
})();
