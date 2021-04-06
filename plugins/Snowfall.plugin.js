//META { "name": "Snowfall" } *//

var Snowfall = (function(CopleSnow, snow, blur, focus){

  class Snowfall {
    getName(){return "Snowfall"}
    getDescription(){return "Let It Snow... Original code by Cople [https://cople.github.io/Snowfall.js]."}
    getAuthor(){return "square"}
    getVersion(){return "1.1.0"}

    load(){}
    start(){
      BdApi.injectCSS("snowfall", CopleSnow.css);
      snow = new CopleSnow({autoplay: false});
      if(document.hasFocus()) snow.play();
      window.addEventListener("blur", blur =_=> snow.stop());
      window.addEventListener("focus", focus =_=> snow.play());
    }
    stop(){
      snow.stop();
      BdApi.clearCSS("snowfall");
      document.getElementById("snowfield").remove();
      window.removeEventListener("blur", blur);
      window.removeEventListener("focus", focus);
    }
  }

  CopleSnow = (function(window, document, undefined) {
    "use strict";
    // Snowfall.js v1.1 (http://cople.github.io/Snowfall.js/)

    var winWidth = window.innerWidth,
      winHeight = window.innerHeight,
      defaultOptions = {
        minSize: 10,
        maxSize: 30,
        type: "text",
        content: "&#10052",
        fadeOut: true,
        autoplay: true,
        interval: 200
      };

    function cssPrefix(propertyName) {
      var capitalizePropertyName = propertyName.charAt(0).toUpperCase() + propertyName.slice(1),
        tempDiv = document.createElement("div"),
        style = tempDiv.style,
        vendorPrefixes = ["Webkit", "Moz", "ms", "O"];

      if (propertyName in style) return propertyName;

      for (var i = 0, l = vendorPrefixes.length; i < l; i++) {
        var name = vendorPrefixes[i] + capitalizePropertyName;
        if (name in style) return name;
      };

      return null;
    };

    var cssPrefixedNames = {
        "transform": cssPrefix("transform"),
        "transition": cssPrefix("transition")
      },
      transitionendEventName = {
        "WebkitTransition": "webkitTransitionEnd",
        "OTransition": "oTransitionEnd",
        "Moztransition": "transitionend",
        "transition": "transitionend"
      }[cssPrefixedNames.transition];

    function random(min, max, deviation) {
      if (deviation) {
        deviation *= max;
        max = max + deviation;
        min = max - deviation;
      } else {
        min = min || 0;
      };
      return parseInt(Math.random() * (max - min + 1) + min);
    };

    function extend(target, source) {
      for (var prop in source) {
        target[prop] = source[prop];
      };
      return target;
    };

    function setStyle(element, rules) {
      for (var name in rules) {
        element.style[cssPrefixedNames[name] || name] = rules[name];
      };
    };

    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
      hidden = "mozHidden";
      visibilityChange = "mozvisibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    };

    window.addEventListener("resize", function() {
      winHeight = window.innerHeight;
      winWidth = window.innerWidth;
    }, false);

    function Snowfall(newOptions) {

      var _ = this,
        queue = [],
        options = defaultOptions,
        $snowfield = document.createElement("div"),
        isImage, cntLength, $snowflake, timer;

      _.config = function(newOptions) {
        extend(options, newOptions);

        isImage = options.type == "image";
        cntLength = options.content.length;

        $snowflake = isImage ? new Image() : document.createElement("div");
        $snowflake.className = "snowflake snowflake-" + options.type;
        $snowflake.dataset.type = options.type;
      };

      _.config(newOptions);

      function Snowflake() {
        var _$snowflake = $snowflake.cloneNode();
        if (options.type != "solid") {
          _$snowflake[isImage ? "src" : "innerHTML"] = typeof options.content == "string" ? options.content : options.content[cntLength == 0 ? 0 : Math.floor(Math.random() * cntLength)];
        };

        return _$snowflake;
      };

      function snowAnimate() {
        var size = random(options.minSize, options.maxSize),
          top = -2 * size,
          left = random(0, winWidth - size),
          opacity = random(5, 10) / 10,
          angle = random(null, winHeight * 0.8, 1),
          translateX = random(-100, 100),
          translateY = winHeight + size * 2,
          duration = random(null, winHeight * 20, 0.2),
          _$snowflake;

        if (queue.length) {
          _$snowflake = queue.shift();
          if (_$snowflake.dataset.type != options.type) _$snowflake = new Snowflake();
        } else {
          _$snowflake = new Snowflake();
        };

        var styleRules = {
          "top": top + "px",
          "left": left + "px",
          "opacity": opacity,
          "transform": "none",
          "transition": duration + "ms linear"
        };

        switch (options.type) {
          case "solid":
            styleRules.width = styleRules.height = size + "px";
            break;
          case "text":
            styleRules["font-size"] = size + "px";
            break;
          case "image":
            styleRules.width = size + "px";
            break;
        };

        setStyle(_$snowflake, styleRules);

        $snowfield.appendChild(_$snowflake);

        setTimeout(function() {
          setStyle(_$snowflake, {
            "transform": "translate(" + translateX + "px," + translateY + "px) rotate(" + angle + "deg)",
            "opacity": options.fadeOut ? 0 : opacity
          });
        }, 100);
      };

      _.playing = 0;

      _.play = function() {
        if (_.playing) return;
        timer = setInterval(snowAnimate, options.interval);
        _.playing = 1;
      };

      _.stop = function() {
        if (!_.playing) return;
        clearInterval(timer);
        timer = null;
        _.playing = 0;
      };

      document.addEventListener(visibilityChange, function() {
        document[hidden] ? _.stop() : _.play();
      }, false);

      $snowfield.addEventListener(transitionendEventName, function(e) {
        var snowflake = e.target || e.srcElement;
        $snowfield.removeChild(snowflake);
        queue.push(snowflake);
      }, false);

      // $snowfield.className = "snowfield";
      $snowfield.id = "snowfield";
      document.body.appendChild($snowfield);

      options.autoplay && _.play();

      return _;
    };

    // window.Snowfall = Snowfall;
    return Snowfall;

  })(window, document);
  CopleSnow.css = `
  #snowfield {
    pointer-events: none;
    user-select: none;
    z-index: 100000;
    position: fixed;
  }
  .snowflake {
    position: absolute;
    color: #fff;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
  }

  .snowflake-solid {
  	border-radius: 50%;
  	background: #fff;
  }`;

  return Snowfall;
})();
