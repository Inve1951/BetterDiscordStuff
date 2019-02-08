//META { "name": "QuickDeleteMessages", "website": "https://inve1951.github.io/BetterDiscordStuff/" } *//
global.QuickDeleteMessages = function () {
  var AsyncKeystate, MessageDeleteItem, getOwnerInstance, onClick, qualifies, settings;

  class QuickDeleteMessages {
    getName() {
      return "Quick Delete Messages";
    }

    getDescription() {
      return "Hold Delete and click a Message to delete it.";
    }

    getAuthor() {
      return "square";
    }

    getVersion() {
      return "1.3.1";
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
      var ref;
      ({ AsyncKeystate, getOwnerInstance } = await SuperSecretSquareStuff);
      settings.confirm = (ref = bdPluginStorage.get("QuickDeleteMessages", "confirm")) != null ? ref : false;
      try {
        MessageDeleteItem = function () {
          var C;
          C = BdApi.findModule(function (m) {
            return (/MessageDeleteItem/.test(m.displayName)
            );
          });
          if (C.displayName.includes("(MessageDeleteItem)")) {
            return new C({
              channel: {},
              message: {}
            }).render().type;
          } else {
            return C;
          }
        }();
      } catch (error) {}
      if ("function" !== typeof MessageDeleteItem) {
        return console.error("[QuickDeleteMessages]: fix me!");
      }
      return document.addEventListener("click", onClick, true);
    }

    stop() {
      return document.removeEventListener("click", onClick, true);
    }

    getSettingsPanel() {
      return `<label style="color: #87909C"><input type="checkbox" name="confirm" onChange="QuickDeleteMessages.updateSettings(this)"\n${settings.confirm && "checked" || ""} />confirm delete?</label>`;
    }

    static updateSettings({ name, checked }) {
      settings[name] = checked;
      bdPluginStorage.set("QuickDeleteMessages", name, checked);
    }

  };

  settings = Object.create(null);

  MessageDeleteItem = null;

  AsyncKeystate = getOwnerInstance = null;

  qualifies = ".content-3dzVd8";

  onClick = function (event) {
    var element, handler;
    if (!(AsyncKeystate.key("Delete") || "darwin" === process.platform && AsyncKeystate.key("Backspace"))) {
      return;
    }
    ({
      path: [element]
    } = event);
    if (element.matches(qualifies) || (element = element.closest(qualifies))) {
      element = element.closest(".message-1PNnaP");
    } else {
      return;
    }
    try {
      handler = new MessageDeleteItem(getOwnerInstance(element).props);
      if (!handler.render()) {
        return;
      }
    } catch (error) {
      return;
    }
    handler.handleDeleteMessage({
      shiftKey: !settings.confirm || event.shiftKey
    });
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  return QuickDeleteMessages;
}.call(this);