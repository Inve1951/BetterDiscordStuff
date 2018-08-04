//META { "name": "scrollToLast" } *//

var scrollToLast = function() {
  return {
    getName: () => "Scroll-To-Last",
    getDescription: () => "Always scroll to last message when entering a channel.",
    getAuthor: () => "square",
    getVersion: () => "0.0.4",

    start: ()=>{},
    stop: ()=>{},
    load: ()=>{},

    onSwitch: ev=> {
      console.log("switch")
      ev = new KeyboardEvent("keydown", {bubbles:true});
      Object.defineProperty(ev, "which", {get:_=>27});
      document.dispatchEvent(ev);
    }
  }
}
