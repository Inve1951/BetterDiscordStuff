//META{"name":"forceClose"}*//

var forceClose = (function(){
  var listener, _remote;
  return class forceClose {
    getName(){ return "Force-Close" }
    getDescription(){ return "Actually closes discord when clicking the close button." }
    getVersion(){ return "1.1.0" }
    getAuthor(){ return "square" }

    start(){
      listener =_=> _remote.app.quit()
      _remote = require("electron").remote;
      try { document.querySelector("svg[name=TitleBarClose]").parentElement.addEventListener("click", listener); }
      catch(e){ _remote.getCurrentWindow().on("hide", listener); }
    }

    stop(){
      try { document.querySelector("svg[name=TitleBarClose]").parentElement.removeEventListener("click", listener); }
      catch(e){ _remote.getCurrentWindow().removeListener(listener); }
    }

    load(){};
  }
})();
