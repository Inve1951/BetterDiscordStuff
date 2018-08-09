//META{"name":"clearInputOnEsc"}*//

var clearInputOnEsc = (function(){
  var TextArea, cancel, install;

  class clearInputOnEsc {
    getName(){ return "Clear-Input-on-Escape" }
    getDescription(){ return "Clears chat inputs when hitting escape inside it." }
    getVersion(){ return "1.3.0" }
    getAuthor(){ return "square" }

    load(){}

    start(){
      if(!install()) this.onSwitch = install;
    }

    stop(){
      cancel && cancel();
      cancel = this.onSwitch = void 0;
    }
  }

  install = function() {
    var ta;

    if(!TextArea) TextArea = BDV2.WebpackModules.find(m=>m.prototype&&["calculateNodeStyling"].every(p=>null!=m.prototype[p]));
    if(!TextArea) return false;

    delete this.onSwitch;

    cancel = Utils.monkeyPatch(TextArea.prototype, "render", {after: function({thisObject, returnValue: ta}) {
      if("textarea" !== ta.type) ({props: {children: [ta]}} = ta);  // CharacterCounter support
      if(!ta || "textarea" !== ta.type || null == ta.props.value) return;

      Utils.monkeyPatch(ta.props, "onKeyDown", {silent: true, instead: function({methodArguments: [ev], callOriginalMethod}) {
        if("Escape" !== ev.key || !thisObject.props.value) return callOriginalMethod();
        ev.type = "change";
        ev.value = thisObject._textArea.value = "";
        ev.preventDefault();
        ev.stopPropagation();
        thisObject.handleChange(ev);
      }});
    }});

    if(ta = document.querySelector("form textarea")) try {
      getInternalInstance(ta).forceUpdate();
    } catch (e) {}

    return true;
  };

  return clearInputOnEsc;
})();
