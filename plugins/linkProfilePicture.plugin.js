//META{"name":"linkProfilePicture","source":"https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/linkProfilePicture.plugin.js","website":"https://Inve1951.github.io/BetterDiscordStuff"}*//

class linkProfilePicture {
  constructor() {
    Object.assign(this, ...Object.entries({
      getName: "Link-Profile-Picture",
      getDescription: "Lets you click users' avatars on their profile page to view a bigger version in your browser.",
      getVersion: "1.1.0",
      getAuthor: "square"
    }).map(([field, value]) => ({ [field]: _ => value })));
  }

  start() {
    const { React } = BdApi;
    const memoed = BdApi.findModuleByProps("AnimatedAvatar").AnimatedAvatar;
    const AnimatedAvatar = memoed.type;
    memoed.type = function LinkProfilePicture(props) {
      try {
        const vnode = AnimatedAvatar(props).type(props);
        vnode.props.onClick = ev => ev.target.parentElement.classList.contains("header-QKLPzZ") &&
          window.open(props.src.replace(/(?:\?size=\d{3,4})?$/, "?size=4096"), "_blank");
        return vnode;
      } catch {}
      return React.createElement(AnimatedAvatar, props);
    };
    this.cancel = _ => memoed.type = AnimatedAvatar;
  }

  stop() {
    this.cancel && this.cancel();
  }
}
