//META { "name": "charCounter" } *//

var charCounter = (function (){
  var injectCss, inject;

  class charCounter {
    getName() { return "Character Counter"; }

    getDescription() { return "Adds a character counter to channel textarea."; }

    getAuthor() { return "Jiiks, square"; };

    getVersion() { return "1.0.0"; }

    load(){}

    start() {
      injectCss();
      inject();
    }

    stop() {
      $(".content textarea").off("keyup.charcounter");
      BdApi.clearCSS("charCounter");
    }

    onSwitch() {
      inject();
    }
  }

  injectCss = function() {
    BdApi.clearCSS("charCounter");
    BdApi.injectCSS("charCounter",
      `#charcounter {
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

  return charCounter;
})();
