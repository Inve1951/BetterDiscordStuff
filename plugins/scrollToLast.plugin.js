//META { "name": "scrollToLast" } *//

var scrollToLast = function() {

  var Keybinds, onSwitch, cancels = [];

  Keybinds = BdApi.findModuleByProps("MARK_CHANNEL_READ");

  onSwitch = ({methodArguments: [ev]}) => {
    if(("CHANNEL_SELECT" === ev.type || "GUILD_SELECT" === ev.type) && /^\/channels\/(?:@me|\d+)\/\d+$/.test(window.location.pathname))
      process.nextTick(Keybinds.MARK_CHANNEL_READ.action);
  };

  return {
    getName: () => "Scroll-To-Last",
    getDescription: () => "When entering any text channel, scrolls to the bottom and marks it as read.",
    getAuthor: () => "square",
    getVersion: () => "1.0.1",

    start: () => {
      cancels.push(BdApi.monkeyPatch(
        BdApi.findModule(m => m._actionHandlers && m._actionHandlers.CHANNEL_SELECT)._actionHandlers,
        "CHANNEL_SELECT", {before: onSwitch}
      ));
      cancels.push(BdApi.monkeyPatch(
        BdApi.findModule(m => m._actionHandlers && m._actionHandlers.GUILD_SELECT)._actionHandlers,
        "GUILD_SELECT", {before: onSwitch}
      ));
    },

    stop: () => {
      cancels.forEach(c => c());
      cancels = [];
    }
  };
};
