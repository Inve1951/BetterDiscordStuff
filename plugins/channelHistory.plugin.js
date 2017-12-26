//META{"name":"channelHistory"}*//

var channelHistory = (function(listener, bw, wc, buttons, buttonsClone, buttonsForward, buttonsBackward, attach, attachClone, css){
  class channelHistory {
    getName(){ return "Channel History" }
    getDescription(){ return "Allows you to switch channels using mouse 4 & 5 or the added GUI buttons." }
    getVersion(){ return "1.1.0" }
    getAuthor(){ return "square" }

    start(){
      bw = require("electron").remote.getCurrentWindow();
      bw.on("app-command", listener);
      BdApi.injectCSS("css-channelHistory", css);
      attach();
      attachClone();
    }

    stop(){
      bw.removeListener("app-command", listener);
      buttons.remove();
      buttonsClone.remove();
      BdApi.clearCSS("css-channelHistory");
    }

    load(){}

    onSwitch(){
      attachClone();
    }
  }

  listener = (ev, cmd, can) => {
    wc = bw.webContents;
    if (cmd === 'browser-backward' && wc.canGoBack()) {
      wc.goBack();
      can = wc.canGoBack();
      buttonsBackward.forEach(button => button.classList.toggle("cant", !can));
      buttonsForward.forEach(button => button.classList.remove("cant"));
    } else if (cmd === 'browser-forward' && wc.canGoForward()) {
      wc.goForward();
      can = wc.canGoForward();
      buttonsForward.forEach(button => button.classList.toggle("cant", !can));
      buttonsBackward.forEach(button => button.classList.remove("cant"));
    }
  };

  buttons = document.createElement("div");
  buttons.className = "channelHistoryButtons";
  buttons.innerHTML = `<div class="btn back">&lt;</div><div class="btn forward">&gt;</div>`;

  buttonsClone = buttons.cloneNode(true);
  buttonsClone.classList.add("clone");

  buttonsBackward = [buttons.firstChild, buttonsClone.firstChild]
  buttonsForward = [buttons.lastChild, buttonsClone.lastChild]

  buttonsBackward.forEach(button => button.onclick = () => listener(null, "browser-backward"));
  buttonsForward.forEach(button => button.onclick = () => listener(null, "browser-forward"));

  attach = (branding) => {
    try {
      branding = document.querySelector(".wordmark-2L03Wr");
      branding.parentElement.insertBefore(buttons, branding.nextElementSibling);
    } catch (err) { console.warn(err); }
  }

  attachClone = (channelName, after) => {
    try {
      channelName = document.querySelector(".channelName-1G03vu") || (after = document.querySelector(".search-bar .search-bar-inner"));
      channelName.parentElement.insertBefore(buttonsClone, after ? null : channelName);
    } catch (err) { console.warn(err); }
  }

  css = `
    .channelHistoryButtons {
      color: #999;
      font-weight: bold;
      position: absolute;
      left: 71px;
    }
    .channelHistoryButtons.clone {
      display: none;
      flex: 0 0 28px;
      position: relative;
      left: unset;
      order: 0;
    }
    #app-mount > .hidden:first-child + * .channelHistoryButtons.clone {
      display: static;
    }
    .channelHistoryButtons .btn {
      display: inline-block;
      pointer-events: all;
      -webkit-app-region: no-drag;
      cursor: pointer;
      padding: 0 2px;
    }
    .channelHistoryButtons .cant {
      opacity: 0.5;
    }
  `;

  return channelHistory;
})()
