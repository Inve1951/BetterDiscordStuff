//META{"name":"channelHistory"}*//

var channelHistory = (function(listener, bw){
  class channelHistory {
    getName(){return "Channel History"}
    getDescription(){return "Allows you to switch channels using mouse 4 & 5 buttons."}
    getVersion(){return "1.0.0"}
    getAuthor(){return "square"}

    start(){
      bw = require("electron").remote.getCurrentWindow();
      bw.on("app-command", listener);
    }

    stop(){ bw.removeListener("app-command", listener); }

    load(){}
  }

  listener = (e, cmd) => {
    if (cmd === 'browser-backward' && bw.webContents.canGoBack())
      bw.webContents.goBack();
    else if (cmd === 'browser-forward' && bw.webContents.canGoForward())
      bw.webContents.goForward();
  };

  return channelHistory;
})()
