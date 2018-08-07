//META { "name": "CharCounter" } *//

var CharCounter = (function (){
  var CharacterCounter, TextArea, cancel, install, css, React, getInternalInstance;

  class CharCounter {
    getName() { return "Character Counter"; }

    getDescription() { return "Adds a character counter to chat inputs."; }

    getAuthor() { return "square"; };

    getVersion() { return "2.0.0"; }

    load(){}

    start() {
      if(!install()) this.onSwitch = install;
      BdApi.injectCSS("css_charCounter", css);
    }

    stop() {
      BdApi.clearCSS("css_charCounter");
      cancel && cancel();
      cancel = null;
    }
  }

  install = function() {
    var ta;

    if(!React) React = BDV2.react;
    if(!TextArea) TextArea = BDV2.WebpackModules.find(m=>m.prototype&&["calculateNodeStyling"].every(p=>null!=m.prototype[p]));

    if(!TextArea || !React) return false;

    delete this.onSwitch;

    cancel = Utils.monkeyPatch(TextArea.prototype, "render", {after: function(data) {
      data.returnValue = React.createElement(
        React.Fragment, null, data.returnValue, React.createElement(CharacterCounter, {value: data.thisObject.props.value})
      );
    }});

    if(ta = document.querySelector("form textarea")) try {
      getInternalInstance(ta).forceUpdate();
    } catch (e) {}

    return true;
  };

  CharacterCounter = function({value}) {
    if(null == value) return null;
    var {length} = value.trim();
    return React.createElement(
      "span", {id: "charcounter", className: 2000 < length && "over2k"}, `${length}/2000`
    );
  };

  getInternalInstance = function(node) {
    return BDV2.reactDom.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactDOMComponentTree.getInstanceFromNode(node).return.stateNode;
  };

  css = `
    #charcounter {
      color: rgba(255, 255, 255, .5);
      user-select: none;
      pointer-events: none;
      display: block;
      position: absolute;
      right: 5px; bottom: -1.1em;
      z-index: 1;
    }
    .message-1PNnaP #charcounter {
      right: unset;
      left: 5px;
    }
    #charcounter.over2k {
      color: rgba(240,71,71,.8);
    }
    .uploadModal-2ifh8j #charcounter.over2k {
      color: rgba(172,10,10,.8);
    }`;

  return CharCounter;
})();
