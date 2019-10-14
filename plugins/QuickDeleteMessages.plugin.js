//META { "name": "QuickDeleteMessages", "website": "https://inve1951.github.io/BetterDiscordStuff/" } *//
global.QuickDeleteMessages = function () {
  var AsyncKeystate, EndpointMessages, MessagePrompts, Permissions, UserStore, _qualifies, getOwnerInstance, gotDeletePermission, onClick, settings;

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
      return "1.4.1";
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
      if (UserStore == null) {
        UserStore = BdApi.findModuleByProps("getCurrentUser");
      }
      if (Permissions == null) {
        Permissions = BdApi.findModuleByProps("computePermissions");
      }
      if (EndpointMessages == null) {
        EndpointMessages = BdApi.findModuleByProps("deleteMessage");
      }
      if (MessagePrompts == null) {
        MessagePrompts = BdApi.findModuleByProps("confirmDelete");
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
      BdApi.saveData("QuickDeleteMessages", name, checked);
    }

  };

  settings = Object.create(null);

  Permissions = UserStore = EndpointMessages = MessagePrompts = null;

  AsyncKeystate = getOwnerInstance = null;

  _qualifies = ".contentCozy-3XX413, .messageCompact-kQa7ES";

  onClick = function (event) {
    var channel, element, message, shiftKey;
    if (!(AsyncKeystate.key("Delete") || "darwin" === process.platform && AsyncKeystate.key("Backspace"))) {
      return;
    }
    ({
      path: [element],
      shiftKey
    } = event);
    if (!(element.matches(_qualifies) || (element = element.closest(_qualifies)))) {
      return;
    }
    ({
      props: { channel, message }
    } = getOwnerInstance(element));
    if (!gotDeletePermission(channel, message)) {
      return;
    }
    if (settings.confirm && !shiftKey) {
      MessagePrompts.confirmDelete(channel, message, false);
    } else {
      EndpointMessages.deleteMessage(channel.id, message.id, false);
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  gotDeletePermission = function (channel, message) {
    var self;
    self = UserStore.getCurrentUser();
    return self === message.author || 0x2000 & Permissions.computePermissions(self, channel);
  };

  return QuickDeleteMessages;
}.call(this);