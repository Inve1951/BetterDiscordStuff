//META{"name":"charCounter"}*//

var charCounter = function () {};

charCounter.prototype.start = function () {
    this.injectCss();
    this.inject();
};

charCounter.prototype.injectCss = function () {
    BdApi.clearCSS("charCounter");
    BdApi.injectCSS("charCounter", `
    #charcounter {
        display: block;
        position: absolute;
        right: 0; bottom: -1.1em;
        opacity: .5;
    }`);
};

charCounter.prototype.inject = function() {
    let ta = $(".content textarea").parent();
    if(!ta.length) return;
    if($("#charcounter").length) return;
    ta.append($("<span/>", { 'id': 'charcounter', 'text': `${$(".content textarea").val().length}/2000` }));
    $(".content textarea").off("keyup.charcounter").on("keyup.charCounter", e => {
        $("#charcounter").text(`${e.target.value.length}/2000`);
    });
};

charCounter.prototype.load = function () {};

charCounter.prototype.unload = function () {};

charCounter.prototype.stop = function () {
    BdApi.clearCSS("charCounter");
    $(".content textarea").off("keyup.charcounter");
};

charCounter.prototype.onMessage = function () {};

charCounter.prototype.onSwitch = function () {
    this.inject();
};

charCounter.prototype.observer = function (e) {};

charCounter.prototype.getSettingsPanel = function () { return ""; };

charCounter.prototype.getName = function () {
    return "Character Counter";
};

charCounter.prototype.getDescription = function () {
    return "Adds a character counter to channel textarea. Fixed by square Jul '17";
};

charCounter.prototype.getVersion = function () {
    return "0.1.1";
};

charCounter.prototype.getAuthor = function () {
    return "Jiiks";
};