//META { "name": "scrollToLast" } *//

var scrollToLast = (function(some, initObserver, switchObserver, onSwitch, ev){

  some = Array.prototype.some;

  class scrollToLast {
    getName() { return "Scroll-To-Last" }
    getDescription() { return "Always scroll to last message when entering a channel." }
    getAuthor() { return "square" }
    getVersion() { return "0.0.3" }

    start(){
      initObserver();
    }
    stop(){
      switchObserver.disconnect();
    }
    load(){}
  }

  onSwitch = function() {
    ev = new KeyboardEvent("keydown", {bubbles:true});
    Object.defineProperty(ev, "which", {get:_=>27});
    document.dispatchEvent(ev);
  }

  initObserver = function(target) {
    switchObserver = new MutationObserver(function(mutations) {
      if(some.call(mutations, function({addedNodes}) {
        return some.call(addedNodes, function(node) {
          return node.classList != null && (node.classList.contains("chat") || node.classList.contains("messages-wrapper"));
        });
      })) onSwitch();
    });
    if((target = document.querySelector("#friends, .chat, .activityFeed-HeiGwL")) != null)
      switchObserver.observe(target.parentNode, {childList: true, subtree: true});
  }

  return scrollToLast;
})()
