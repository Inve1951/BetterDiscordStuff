//META{"name":"QuickDeleteMessages"}*//
var QuickDeleteMessages;

QuickDeleteMessages = function () {
  var MessageDeleteItem, deletePressed, getInternalInstance, getOwnerInstance, handleKeyUpDown, onClick, qualifies, settings;

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
      return "1.2.0";
    }

    start() {
      var ref;
      getInternalInstance = BDV2.reactDom.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactDOMComponentTree.getInstanceFromNode;
      settings.confirm = (ref = bdPluginStorage.get("QuickDeleteMessages", "confirm")) != null ? ref : false;
      document.addEventListener("click", onClick, true);
      document.addEventListener("keydown", handleKeyUpDown);
      document.addEventListener("keyup", handleKeyUpDown);
      return MessageDeleteItem = BDV2.WebpackModules.find(function (m) {
        var ref1;
        return (ref1 = m.prototype) != null ? ref1.handleDeleteMessage : void 0;
      });
    }

    stop() {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", handleKeyUpDown);
      return document.removeEventListener("keyup", handleKeyUpDown);
    }

    load() {}

    getSettingsPanel() {
      return `<label style="color: #87909C"><input type="checkbox" name="confirm" onChange="QuickDeleteMessages.updateSettings(this)"\n${settings.confirm && "checked" || ""} />confirm delete?</label>`;
    }

    static updateSettings({ name, checked }) {
      settings[name] = checked;
      bdPluginStorage.set("QuickDeleteMessages", name, checked);
    }

  };

  settings = Object.create(null);

  MessageDeleteItem = getInternalInstance = null;

  deletePressed = false;

  handleKeyUpDown = function ({ code, type }) {
    if (code === "Delete" || "darwin" === process.platform && "Backspace" === code) {
      deletePressed = "keydown" === type;
    }
  };

  qualifies = ".content-3dzVd8";

  onClick = function (event) {
    var element, handler;
    if (!deletePressed) {
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

  getOwnerInstance = function (node) {
    var internalInstance, ref;
    internalInstance = (ref = getInternalInstance(node)) != null ? ref : node._reactInternalFiber;
    return internalInstance.return.stateNode;
  };

  return QuickDeleteMessages;
}.call(this);
