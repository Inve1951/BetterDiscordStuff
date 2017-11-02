//META { "name": "charCounter" } *//

var charCounter = (function (){
  var injectCss, inject, initObserver, switchObserver, some;

  some = Array.prototype.some;

  class charCounter {
    getName() { return "Character Counter"; }

    getDescription() { return "Adds a character counter to channel textarea."; }

    getAuthor() { return "Jiiks, square"; };

    getVersion() { return "1.0.2"; }

    load(){}

    start() {
      injectCss();
      inject();
      initObserver();
    }

    stop() {
      $(".content textarea").off("keyup.charcounter");
      BdApi.clearCSS("charCounter");
      switchObserver.disconnect();
    }

    onSwitch() {
      inject();
    }
  }

  injectCss = function() {
    BdApi.clearCSS("charCounter");
    BdApi.injectCSS("charCounter",
      `.chat form > :first-child {
        z-index: 1;
      }
      #charcounter {
        display: block;
        position: absolute;
        right: 0; bottom: -1.1em;
        opacity: .5;
      }`);
  };

  inject = function() {
    var ta = $(".content textarea").parent();
    if( !ta.length || $("#charcounter").length ) return;
    ta.append( $("<span/>", { 'id': 'charcounter', 'text': `${$(".content textarea").val().length}/2000` }));
    $(".content textarea").off("keyup.charcounter").on("keyup.charCounter", e =>
      $("#charcounter").text(`${e.target.value.length}/2000`)
    );
  };

  initObserver = function() {
    var target;
    switchObserver = new MutationObserver(function(mutations) {
      if(some.call(mutations, function({addedNodes}) {
        return some.call(addedNodes, function(node) {
          return node.classList != null && (node.classList.contains("chat") || node.classList.contains("messages-wrapper"));
        });
      })) inject();
    });
    if((target = document.querySelector("#friends, .chat, .activityFeed-HeiGwL")) != null)
      switchObserver.observe(target.parentNode, {childList: true, subtree: true});
  }

  return charCounter;
})();
