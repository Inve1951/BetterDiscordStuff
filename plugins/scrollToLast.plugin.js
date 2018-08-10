//META { "name": "scrollToLast" } *//

var scrollToLast = function() {

  var Keybinds, Handlers, onSwitch;

  onSwitch = ev => {
    if(("CHANNEL_SELECT" === ev.type || "GUILD_SELECT" === ev.type) && /^\/channels\/(?:@me|\d+)\/\d+$/.test(window.location.pathname))
      process.nextTick(Keybinds.MARK_CHANNEL_READ.action);
  }

  return {
    getName: () => "Scroll-To-Last",
    getDescription: () => "When entering any text channel, scrolls to the bottom and marks it as read.",
    getAuthor: () => "square",
    getVersion: () => "1.0.0",

    load: () => {
      Keybinds = BDV2.WebpackModules.findByUniqueProperties(["MARK_CHANNEL_READ", "CALL_START"]);
      Handlers = [
        BDV2.WebpackModules.find(m => m._actionHandlers && m._actionHandlers.CHANNEL_SELECT),
        BDV2.WebpackModules.find(m => m._actionHandlers && m._actionHandlers.GUILD_SELECT)
      ];
    },

    start: () => {
      Handlers.forEach(h=>h.subscribeToDispatch(onSwitch));
    },

    stop: () => {
      Handlers.forEach(h=>h.unsubscribeToDispatch(onSwitch));
    }
  }
}
