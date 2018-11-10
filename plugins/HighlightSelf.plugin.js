//META { "name": "HighlightSelf", "website": "https://inve1951.github.io/BetterDiscordStuff/" } *//
var HighlightSelf;

HighlightSelf = function () {
  var MessageComponents, UserStore, cancel, css, getOwnerInstance, install;

  class HighlightSelf {
    getName() {
      return "Highlight Self";
    }

    getDescription() {
      return "Highlights your own username in message headers.";
    }

    getAuthor() {
      return "square";
    }

    getVersion() {
      return "1.1.0";
    }

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
      ({ getOwnerInstance } = await SuperSecretSquareStuff);
      if (!install()) {
        this.onSwitch = install;
      }
      return BdApi.injectCSS("css_highlightSelf", css);
    }

    stop() {
      if (cancel) {
        cancel();
        cancel = null;
      }
      return BdApi.clearCSS("css_highlightSelf");
    }

  };

  MessageComponents = UserStore = cancel = getOwnerInstance = null;

  install = function () {
    var i, len, n, ref;
    MessageComponents || (MessageComponents = BDV2.WebpackModules.find(function (m) {
      return m.MessageUsername;
    }));
    UserStore || (UserStore = BDV2.WebpackModules.findByUniqueProperties(["getCurrentUser"]));
    if (!(MessageComponents && UserStore)) {
      return false;
    }
    delete this.onSwitch;
    cancel = Utils.monkeyPatch(MessageComponents.MessageUsername.prototype, "render", {
      after: function ({ returnValue, thisObject }) {
        var props, ref;
        ({ props } = returnValue.props.children);
        if (UserStore.getCurrentUser() === thisObject.props.message.author && !((ref = props.className) != null ? ref.endsWith(" highlight-self") : void 0)) {
          return props.className = props.className ? props.className + " highlight-self" : "highlight-self";
        }
      }
    });
    try {
      ref = document.querySelectorAll(".message-1PNnaP h2 > span");
      for (i = 0, len = ref.length; i < len; i++) {
        n = ref[i];
        getOwnerInstance(n).forceUpdate();
      }
    } catch (error) {}
    return true;
  };

  css = ".highlight-self .username-_4ZSMR {\n  text-decoration: underline;\n}";

  return HighlightSelf;
}.call(this);