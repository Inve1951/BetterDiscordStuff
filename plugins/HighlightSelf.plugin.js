//META { "name": "HighlightSelf" } *//
var HighlightSelf;

HighlightSelf = function () {
  var MessageComponents, UserStore, cancel, css, install;

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
      return "1.0.1";
    }

    load() {}

    start() {
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

  MessageComponents = UserStore = cancel = null;

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
        var props;
        ({ props } = returnValue.props.children);
        if (UserStore.getCurrentUser() === thisObject.props.message.author && !props.className.endsWith(" highlight-self")) {
          return props.className += " highlight-self";
        }
      }
    });
    try {
      ref = document.querySelectorAll("usernameWrapper-1S-G5O");
      for (i = 0, len = ref.length; i < len; i++) {
        n = ref[i];
        BDV2.reactDom.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactDOMComponentTree.getInstanceFromNode(n).return.stateNode.forceUpdate();
      }
    } catch (error) {}
    return true;
  };

  css = ".highlight-self .username-_4ZSMR {\n  text-decoration: underline;\n}";

  return HighlightSelf;
}.call(this);