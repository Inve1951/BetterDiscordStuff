/**
 * @name Link-Profile-Picture
 * @description Lets you click users' avatars on their profile page to view a bigger version in your browser.
 * @version 1.4.0
 * @author square
 * @authorLink https://betterdiscord.app/developer/square
 * @website https://betterdiscord.app/plugin/Link-Profile-Picture
 * @source https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/linkProfilePicture.plugin.js
 * @updateUrl https://betterdiscord.app/gh-redirect/?id=287
 */

module.exports = class linkProfilePicture {
  stop() {}
  start() {
    document.addEventListener("click", this.handleProfilePictureClick, true);
    this.stop = () => {
      document.removeEventListener("click", this.handleProfilePictureClick, true);
    };
  }

  handleProfilePictureClick({ target }) {
    const parent = target.parentElement;
    const grandParent = parent.parentElement;

    // Check if the immediate parent contains a class that starts with 'avatar_' and its parent contains a class that starts with 'headerInner_'
    if (!parent || ![...parent.classList].some(cls => cls.startsWith("avatar_"))) return;
    if (!grandParent || ![...grandParent.classList].some(cls => cls.startsWith("headerInner_"))) return;

    // Open the image with modified URL
    const imageUrl = target.querySelector("img").src.replace(/\?.*$/, "?quality=lossless&size=4096");
    window.open(imageUrl, "_blank");
  }
};
