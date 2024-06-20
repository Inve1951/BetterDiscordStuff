/**
 * @name Link-Profile-Picture
 * @description Lets you click users' avatars on their profile page to view a bigger version in your browser.
 * @version 1.3.3
 * @author square
 * @authorLink https://betterdiscord.app/developer/square
 * @website https://betterdiscord.app/plugin/Link-Profile-Picture
 * @source https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/linkProfilePicture.plugin.js
 * @updateUrl https://betterdiscord.app/gh-redirect/?id=287
 */

module.exports = class linkProfilePicture {
  stop(){}
  start() {
    document.addEventListener("click", LinkProfilePicture, true);
    this.stop = document.removeEventListener.bind(document, "click", LinkProfilePicture, true);
    function LinkProfilePicture({ target }) {
      if (target.classList.contains("avatar_e1126d") && target.parentElement?.parentElement?.classList.contains("inner_e1126d")) {
        window.open(target.querySelector("img").src.replace(/\?.*$/, "?quality=lossless&size=4096"), "_blank");
      }
    }
  }
};
