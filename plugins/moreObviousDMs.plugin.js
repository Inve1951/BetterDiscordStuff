//META{"name":"moreObviousDMs"}*//;
var moreObviousDMs;

moreObviousDMs = function () {
  var _flash, bw, flash, flashing, insertOverlay, insertStyle, observer;

  class moreObviousDMs {
    getName() {
      return "More obvious DMs";
    }

    getDescription() {
      return "Flashes the discord taskbar icon and window upon receiving a DM until discord receives mouse or window focus. This makes it easier to spot DMs after leaving a fullscreen application.";
    }

    getAuthor() {
      return "square";
    }

    getVersion() {
      return "1.0.1";
    }

    load() {}

    start() {
      observer.observe(document.querySelector(".dms-rcsEnV"), {
        childList: true,
        subtree: false
      });
      insertStyle();
    }

    stop() {
      observer.disconnect();
      document.head.querySelector("#moreObviousDMs-style").remove();
    }

  };

  bw = require("electron").remote.BrowserWindow.getAllWindows()[0];

  flashing = false;

  observer = new MutationObserver(function ([{ addedNodes }]) {
    if (addedNodes.length) {
      flash(true);
    }
  });

  _flash = 0;

  flash = function (b) {
    if (b && flashing) {
      return;
    }
    if (b) {
      flashing = true;
      _flash = setInterval(function () {
        bw.flashFrame(true);
      }, 5000);
      insertOverlay();
    } else {
      flashing = false;
      clearInterval(_flash);
      setTimeout(function () {
        if (!flashing) {
          bw.flashFrame(false);
        }
      }, 3000);
    }
  };

  insertStyle = function () {
    var style;
    style = document.createElement("style");
    style.id = "moreObviousDMs-style";
    style.innerHTML = "#moreObviousDMs-overlay {\n  width: 100vw;\n  height: 100vh;\n  background: yellow;\n  animation: DMflashOverlay 5s infinite;\n}\n@keyframes DMflashOverlay {\n  0%, 20%, 40%, 60% { opacity: 0; }\n  19.999%, 39.999%, 59.999%, 80%, 100% {\n    opacity: 0.1;\n  }\n}";
    document.head.appendChild(style);
  };

  insertOverlay = function () {
    var l, overlay;
    overlay = document.createElement("div");
    overlay.id = "moreObviousDMs-overlay";
    l = function () {
      overlay.remove();
      window.removeEventListener("mousemove", l, true);
      flash(false);
      bw.removeListener("focus", l);
    };
    window.addEventListener("mousemove", l, true);
    if (!bw.isFocused()) {
      bw.on("focus", l);
      document.body.appendChild(overlay);
    }
  };

  return moreObviousDMs;
}.call(this);