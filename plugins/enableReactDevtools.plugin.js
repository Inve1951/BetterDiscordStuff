//META { "name": "enableReactDevtools" } *//

var enableReactDevtools = (function(){
  var listener, bw, versions, path;

  class enableReactDevtools {
    getName() { return "Enable React-Devtools" }
    getDescription() { return "Automatically loads the React Devtools for you. Big thanks to Natsulus who helped figgure this out!" }
    getAuthor() { return "square" }
    getVersion() { return "0.0.2" }

    start(){
      bw = require("electron").remote.BrowserWindow.getAllWindows()[0];
      bw.webContents.on("devtools-opened", listener);
    }

    stop(){
      bw.webContents.removeListener("devtools-opened", listener);
    }

    load(){}
  }

  try {
    path = require("path").resolve(
      process.env.LOCALAPPDATA, "Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/"
    )
    versions = require("fs").readdirSync( path );
    path = require("path").resolve( path, versions[versions.length - 1] )
  } catch (e) {
    path = null
    if (e !== "ENOENT")
      throw e;
    console.error("Couldn't find react devtools in chrome extensions!");
  }

  listener = function(){
    require("electron").remote.BrowserWindow.removeDevToolsExtension("React Developer Tools");
    require("electron").webFrame.registerURLSchemeAsSecure("chrome-extension");
    if( path != null && null != require("electron").remote.BrowserWindow.addDevToolsExtension( path ) )
      console.log("Successfully installed react devtools.");
    else
      console.error("Couldn't find react devtools in chrome extensions!");
  }

  return enableReactDevtools;
})()
