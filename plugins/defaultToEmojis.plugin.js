//META{"name":"defaultToEmojis"}*//

var defaultToEmojis = (function(){
  var n, i;
  class defaultToEmojis {
    getName(){return "Default To Emojis"}
    getDescription(){return "Selects the emoji tab first time you open the picker."}
    getVersion(){return "0.0.1"}
    getAuthor(){return "square"}

    start(){}
    stop(){}
    load(){}

    observer({addedNodes}){
      for(i = 0; n = addedNodes[i]; i++) if(n.classList && n.classList.contains("popout") && (n = document.getElementById("bda-qem-emojis"))) {
        n.click();
        delete this.observer;
        return;
      }
    }
  }
  return defaultToEmojis;
})()
