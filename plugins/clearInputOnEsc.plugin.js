//META{"name":"clearInputOnEsc"}*//

var clearInputOnEsc = (function(){
  var getInternalInstance, getOwnerInstance, listener;

  class clearInputOnEsc {
    getName(){return "Clear-Input-on-Escape"}
    getDescription(){return "Clears the chat input when you hit escape inside it."}
    getVersion(){return "1.2.0"}
    getAuthor(){return "square"}

    load(){}

    start(){
      document.addEventListener("keydown", listener, true)
    }

    stop(){
      document.removeEventListener("keydown", listener, true);
    }

    onSwitch() {
      document.activeElement.blur();
    }
  }

  listener = function(ev){
    if("Escape" !== ev.key || document.activeElement !== document.querySelector(".content-yTz4x3 textarea")) return;
    if(document.activeElement.value){
      ev.stopImmediatePropagation();
      ev.preventDefault();
    }
    try {
      getOwnerInstance(document.activeElement, {include: "ChannelTextAreaForm"}).setState({textValue:""});
    } catch(err){console.error(err)}
  };

  ({getInternalInstance, getOwnerInstance} = (function(){
    // code in this closure by noodlebox & samogot
    // https://github.com/samogot/betterdiscord-plugins/blob/master/v1/1lib_discord_internals.plugin.js
    const getInternalInstance = e => e[Object.keys(e).find(k => k.startsWith("__reactInternalInstance"))];
    function getOwnerInstance(e, {include, exclude = ["Popout", "Tooltip", "Scroller", "BackgroundFlash"]} = {}) {
      if (e === undefined) {return undefined;}
      const excluding = include === undefined;
      const filter = excluding ? exclude : include;
      function getDisplayName(owner) {
        const type = owner.type;
        const constructor = owner.stateNode && owner.stateNode.constructor;
        return type && type.displayName || constructor && constructor.displayName || null;}
      function classFilter(owner) {
        const name = getDisplayName(owner);
        return (name !== null && !!(filter.includes(name) ^ excluding));}
      let curr = getInternalInstance(e);
      while (curr) {
        if (classFilter(curr)) {return curr.stateNode;}
        curr = curr.return;}
      return null;}
    getOwnerInstance.displayName = "getOwnerInstance";
    return {getInternalInstance, getOwnerInstance};})());

  return clearInputOnEsc;
})();
