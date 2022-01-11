/**
 * @name Link-Profile-Picture
 * @description Lets you click users' avatars on their profile page to view a bigger version in your browser.
 * @version 1.3.2
 * @author square
 * @authorLink https://betterdiscord.app/developer/square
 * @website https://betterdiscord.app/plugin/Link-Profile-Picture
 * @source https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/linkProfilePicture.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Inve1951/BetterDiscordStuff/master/plugins/linkProfilePicture.plugin.js
 */

module.exports = class linkProfilePicture {
  LinkProfilePicture({ target }) {
    if (target.className.startsWith("avatar") && target.parentElement.className.startsWith("header")) {
      window.open(target.querySelector("img").src.replace(/(?:\?size=\d{3,4})?$/, "?size=4096"), "_blank");
    }
  }

  start() {
    document.addEventListener("click", this.LinkProfilePicture);
    BdApi.injectCSS('linkProfilePicture', `
      [class^=header] > [class^=avatar] {
        cursor: pointer;
      }
      [class^=header] > [class^=avatar] svg > foreignObject > div::after {
        position: absolute;
        content: 'view in browser';
        box-sizing: border-box;
        font-size: 10px;
        line-height: 12px;
        font-weight: 700;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-transform: uppercase;
        text-shadow: 2px 2px 20px #000000, 2px 2px 20px #000000;
        color: #fff;
        top: 0;
        left: 0;
        transition: opacity .1s ease;
        opacity: 0;
        pointer-events: none;
      }
      [class^=header] > [class^=avatar]:hover svg > foreignObject > div::after {
        opacity: 1;
      }
    `);
  }

  stop() {
    document.removeEventListener("click", this.LinkProfilePicture);
    BdApi.clearCSS('linkProfilePicture');
  }
};
