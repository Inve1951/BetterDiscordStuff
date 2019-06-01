//META { "name": "scrollToLast" } *//

var scrollToLast = function() {

  var Keybinds, onSwitch, cancels = [];

  Keybinds = BdApi.findModuleByProps("MARK_CHANNEL_READ");

  onSwitch = (ev) => {
    if(("CHANNEL_SELECT" === ev.type || "GUILD_SELECT" === ev.type) && /^\/channels\/(?:@me|\d+)\/\d+$/.test(window.location.pathname))
      Keybinds.MARK_CHANNEL_READ.action();
  };

  return {
    getName: () => "Scroll-To-Last",
    getDescription: () => "When entering any text channel, scrolls to the bottom and marks it as read.",
    getAuthor: () => "square",
    getVersion: () => "1.0.2",

    start: () => {
      var _ = BdApi.findModuleByProps("_orderedActionHandlers");
      _.subscribe("CHANNEL_SELECT", onSwitch); cancels.push(_.unsubscribe.bind(_, "CHANNEL_SELECT", onSwitch));
      _.subscribe("GUILD_SELECT", onSwitch); cancels.push(_.unsubscribe.bind(_, "GUILD_SELECT", onSwitch));
    },

    stop: () => {
      cancels.forEach(c => c());
      cancels = [];
    }
  };
};
