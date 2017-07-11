//////////META { "name": "minimizeShortcut" } *//////////

var minimizeShortcut = (function(){
  var win, globalShortcut, shortcut, minimizeToTray, listener;
  
// CONFIG
  shortcut = "CommandOrControl+D";            // have a look at this if your shortcut doesn't work: https://electron.atom.io/docs/api/accelerator/
  minimizeToTray = false;                     // true or false
// CONFIG
  
  class minimizeShortcut {
    getName(){return "Minimize-Shortcut"}
    getDescription(){return "Provides you with a shortcut to show/hide/minimize discord. Edit the file to configure the plugin."}
    getVersion(){return "1.0.0"}
    getAuthor(){return "square"}

    load(){}

    start(){
      win = require("electron").remote.require("electron").BrowserWindow.getAllWindows()[0];
      globalShortcut = require("electron").remote.require("electron").globalShortcut;
      globalShortcut.register(shortcut, listener);
    }

    stop(){
      globalShortcut.unregister(shortcut);
    }
  }
  
  listener = function() {
    if( win.isVisible() && !win.isMinimized() )
      minimizeToTray ? win.hide() : win.minimize();
    else if( win.isVisible() )
      win.restore();
    else
      win.show() || win.focus();
  }
  
  return minimizeShortcut;
})()