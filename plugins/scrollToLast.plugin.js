//META { "name": "scrollToLast" } *//

var scrollToLast = (function(){
  class scrollToLast {
    getName() { return "Scroll-To-Last" }
    getDescription() { return "Always scroll to last message." }
    getAuthor() { return "square" }
    getVersion() { return "0.0.1" }

    start(){}
    stop(){}
    load(){}

    onSwitch() {
      var ref;
      if((ref = document.querySelectorAll(".message-group")) != null)
        ref[ref.length-1].scrollIntoView();
    }
  }
  return scrollToLast;
})()
