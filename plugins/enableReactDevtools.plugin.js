//META { "name": "enableReactDevtools" } *//

var enableReactDevtools = (function(){
  var listener, bw;

  class enableReactDevtools {
    getName() { return "Enable React-Devtools" }
    getDescription() { return "Automatically loads the React Devtools for you." }
    getAuthor() { return "square" }
    getVersion() { return "0.0.1" }

    start(){
      bw = require("electron").remote.BrowserWindow.getAllWindows()[0];
      bw.webContents.on("devtools-opened", listener);
    }

    stop(){
      bw.webContents.removeListener("devtools-opened", listener);
    }

    load(){}
  }

  listener = function(){
    require("electron").remote.BrowserWindow.removeDevToolsExtension("React Developer Tools");
    require("electron").webFrame.registerURLSchemeAsSecure("chrome-extension");
    var success = require("electron").remote.BrowserWindow.addDevToolsExtension(
      process.env.localappdata +
      "\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\2.5.0_0"
    );
    if(success != null)
      console.log("Successfully installed react devtools.");
    else
      console.error("Couldn't find react devtools in chrome extensions!");
  }

  return enableReactDevtools;
})()
