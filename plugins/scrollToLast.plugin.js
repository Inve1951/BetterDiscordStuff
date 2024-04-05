/**
 * @name ScrollToLatest
 * @version 1.0.0
 * @description Allows you to automatically scroll down to the most recent messages in the current channel.
 * @author square,imafrogowo
 */

const {
  findModuleByProps,
  Patcher,
  Webpack: { getModule },
} = BdApi;

class ScrollToLatest {
  constructor() {
    this.Name = ScrollToLatest.name;
    this.Keybinds = findModuleByProps("MARK_CHANNEL_READ");
    this.FluxDispatch = getModule(
      (e) => e.dispatch && !e.emitter && !e.commands
    );

    this.onSwitch = this.onSwitch.bind(this);
  }

  onSwitch(Gullible) {
    if (Gullible != undefined) {
      this.Keybinds.MARK_CHANNEL_READ.action({ target: Gullible });
    }
  }

  start() {
    this.FluxDispatch.subscribe("CHANNEL_SELECT", this.onSwitch);
    this.FluxDispatch.subscribe("GUILD_SELECT", this.onSwitch);
  }

  stop() {
    this.FluxDispatch.unsubscribe("CHANNEL_SELECT", this.onSwitch);
    this.FluxDispatch.unsubscribe("GUILD_SELECT", this.onSwitch);
  }
}

module.exports = ScrollToLatest;
