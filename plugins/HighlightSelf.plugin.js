/**
 * @name Highlight Self
 * @description Highlights your own username in message headers.
 * @version 1.2.2
 * @author square
 * @authorLink https://betterdiscord.app/developer/square
 * @website https://betterdiscord.app/plugin/Highlight%20Self
 * @source https://github.com/Inve1951/BetterDiscordStuff/blob/master/coffee/HighlightSelf.plugin.coffee
 * @updateUrl https://raw.githubusercontent.com/Inve1951/BetterDiscordStuff/master/plugins/HighlightSelf.plugin.js
 * @exports 42
 */
var HighlightSelf;

module.exports = HighlightSelf = function () {
  var UserStore, YouTellMe, cancel, css, install, patchRender;

  class HighlightSelf {
    load() {
      return window.SuperSecretSquareStuff != null ? window.SuperSecretSquareStuff : window.SuperSecretSquareStuff = new Promise(function (c, r) {
        return require("request").get("https://raw.githubusercontent.com/Inve1951/BetterDiscordStuff/master/plugins/0circle.plugin.js", function (err, res, body) {
          if (err || 200 !== (res != null ? res.statusCode : void 0)) {
            return r(err != null ? err : res);
          }

          Object.defineProperties(window.SuperSecretSquareStuff, {
            libLoaded: {
              value: c
            },
            code: {
              value: body
            }
          });
          return (0, eval)(body);
        });
      });
    }

    async start() {
      ({
        patchRender
      } = await SuperSecretSquareStuff);

      if (!install()) {
        this.onSwitch = install;
      }

      return BdApi.injectCSS("css_highlightSelf", css);
    }

    stop() {
      delete this.onSwitch;

      if (cancel) {
        cancel();
        cancel = null;
      }

      return BdApi.clearCSS("css_highlightSelf");
    }

  }

  ;
  YouTellMe = UserStore = cancel = patchRender = null;

  install = function () {
    YouTellMe || (YouTellMe = BdApi.findModule(function (m) {
      return "function" === typeof (m != null ? m.default : void 0) && m.default.toString().includes("getGuildMemberAvatarURLSimple");
    }));
    UserStore || (UserStore = BdApi.findModuleByProps("getCurrentUser"));

    if (!(YouTellMe && UserStore)) {
      return false;
    }

    if (this !== window) {
      delete this.onSwitch;
    }

    cancel = patchRender(YouTellMe, {
      filter: function (node, {
        message: {
          author
        }
      }) {
        var ref;
        return UserStore.getCurrentUser() === author && ((ref = node.props.children) != null ? typeof ref.some === "function" ? ref.some(function (child) {
          return (child != null ? child.type : void 0) === "h2";
        }) : void 0 : void 0);
      },
      touch: function (node) {
        var ref, ref1;
        node = node.props.children.find(function (child) {
          return (child != null ? child.type : void 0) === "h2";
        });

        if (!((ref = node.props) != null ? (ref1 = ref.className) != null ? ref1.includes("highlight-self") : void 0 : void 0)) {
          node.props.className = node.props.className ? node.props.className + " highlight-self" : "highlight-self";
          return;
        }
      }
    });
    return true;
  };

  css = `.highlight-self {
  text-decoration: underline;
}`;
  return HighlightSelf;
}.call(this);