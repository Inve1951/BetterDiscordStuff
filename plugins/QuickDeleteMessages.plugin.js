//META{"name":"QuickDeleteMessages"}*//
var QuickDeleteMessages;

QuickDeleteMessages = function () {
  var ConfirmActions, MessageActions, deletePressed, getInternalInstance, getOwnerInstance, onClick, onKeyDown, onKeyUp, qualifies, settings;

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
      return "1.0.2";
    }

    start() {
      var ref;
      getInternalInstance = BDV2.reactDom.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactDOMComponentTree.getInstanceFromNode;
      settings.confirm = (ref = bdPluginStorage.get("QuickDeleteMessages", "confirm")) != null ? ref : false;
      document.addEventListener("click", onClick, true);
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
      MessageActions = BDV2.WebpackModules.findByUniqueProperties(["deleteMessage"]);
      return ConfirmActions = BDV2.WebpackModules.findByUniqueProperties(["confirmDelete"]);
    }

    stop() {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKeyDown);
      return document.removeEventListener("keyup", onKeyUp);
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

  MessageActions = ConfirmActions = getInternalInstance = null;

  deletePressed = false;

  onKeyDown = function ({ code }) {
    if (code === "Delete") {
      deletePressed = true;
    }
  };

  onKeyUp = function ({ code }) {
    if (code === "Delete") {
      deletePressed = false;
    }
  };

  qualifies = ".markup, .accessory";

  onClick = function (event) {
    var canDelete, channel, element, message;
    if (!deletePressed) {
      return;
    }
    ({
      path: [element]
    } = event);
    if (element.matches(qualifies) || (element = element.closest(qualifies))) {
      element = element.closest(".message");
    } else {
      return;
    }
    ({
      props: { canDelete, channel, message }
    } = getOwnerInstance(getOwnerInstance(element)));
    if (!canDelete) {
      return;
    }
    if (settings.confirm) {
      ConfirmActions.confirmDelete(channel, message);
    } else {
      MessageActions.deleteMessage(channel.id, message.id);
    }
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