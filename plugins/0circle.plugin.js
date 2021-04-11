//META { "name": "SquareLib", "website": "https://inve1951.github.io/BetterDiscordStuff/" } *//
var SquareLib,
    hasProp = {}.hasOwnProperty;

SquareLib = function () {
  return {
    start: function () {},
    stop: function () {},
    getName: function () {
      return "SquareLib / Definitely Not A Virus";
    },
    getDescription: function () {
      return "A set of utilities used by my plugins.";
    },
    getAuthor: function () {
      return "square";
    },
    getVersion: function () {
      return "0.0.0";
    }
  };
};

(async function () {
  var AsyncKeystate, React, ReactDom, _crypto, _fs, _keystates, _path, createElement, createReadOnlyObject, env, err, fs, generateMd5, getOwnerInstance, promise, promisify, filename, dirname;
  _path = require("path");
  _fs = require("fs");
  _crypto = require("crypto");
  filename = typeof __filename !== "undefined" && __filename || "";
  dirname = typeof __dirname !== "undefined" && __dirname || "";
  createReadOnlyObject = function (obj) {
    var k, v;
    for (k in obj) {
      if (!hasProp.call(obj, k)) continue;
      v = obj[k];
      obj[k] = {
        enumerable: true,
        value: v
      };
    }
    return Object.defineProperties(Object.create(null), obj);
  };
  env = createReadOnlyObject({
    INSTALLED: filename.endsWith(".plugin.js")
  });
  promisify = function (f, _this = null) {
    return function (...args) {
      return new Promise(function (c, r) {
        return Reflect.apply(f, _this, args.concat(function (err, res) {
          if (err) {
            return r(err);
          }
          return c(res);
        }));
      });
    };
  };
  fs = createReadOnlyObject(function () {
    var i, k, len, o, ref;
    o = {};
    ref = ["rename"];
    for (i = 0, len = ref.length; i < len; i++) {
      k = ref[i];
      o[k] = promisify(_fs[k], _fs);
    }
    return o;
  }());
  generateMd5 = function (str) {
    return _crypto.createHash("md5").update(str).digest("hex");
  };
  getOwnerInstance = function (elem, options = {}, filter = function () {
    return true;
  }) {
    var ignoreHtml, ignoreSymbols, returnStateNode, stateNodeIsMandatory;
    if ("function" === typeof options) {
      filter = options;
      options = {};
    }
    ({ stateNodeIsMandatory = true, ignoreHtml = true, ignoreSymbols = true, returnStateNode = true } = options);
    while (elem) {
      if (elem instanceof Node) {
        elem = ReactDom._internal.ReactDOMComponentTree.getClosestInstanceFromNode(elem);
      }
      if (!(elem = elem.return)) {
        break;
      }
      if (null === elem.type || stateNodeIsMandatory && !elem.stateNode || ignoreHtml && elem.stateNode instanceof Node || ignoreSymbols && "symbol" === typeof elem.type) {
        continue;
      }
      if (filter(elem)) {
        if (returnStateNode) {
          return elem.stateNode;
        } else {
          return elem;
        }
      }
    }
    return null;
  };
  _keystates = [];
  AsyncKeystate = new Proxy(Object.freeze(Object.create(null)), {
    get: function (_, type) {
      return function (value) {
        return _keystates.some(function (ev) {
          return value === ev[type];
        });
      };
    }
  });
  document.addEventListener("keydown", function (ev) {
    return _keystates.push(ev);
  }, true);
  document.addEventListener("keyup", function ({ code }) {
    return _keystates = _keystates.filter(function (ev) {
      return ev.code !== code;
    });
  }, true);
  window.addEventListener("blur", function () {
    return _keystates = [];
  }, false);
  createElement = function (tag, props = {}, ...children) {
    var c, elem, i, k, len, v;
    elem = document.createElement(tag);
    if (props) {
      for (k in props) {
        if (!hasProp.call(props, k)) continue;
        v = props[k];
        elem[k] = v;
      }
    }
    for (i = 0, len = children.length; i < len; i++) {
      c = children[i];
      elem.appendChild(c);
    }
    return elem;
  };
  try {
    ({ React, ReactDom } = BdApi);
    ReactDom = Object.assign({}, ReactDom, {
      _internal: function () {
        var Events, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
        ({ Events } = ReactDom.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
        [_0, _1, _2, _3, _4, _5, _6, _7, _8, _9] = Events;
        return createReadOnlyObject({
          Events,
          ReactDOMComponentTree: createReadOnlyObject({
            getInstanceFromNode: _0,
            getClosestInstanceFromNode: function (node) {
              var instance;
              while (!(instance || !node)) {
                instance = _0(node);
                node = node.parentNode;
              }
              return instance;
            },
            getNodeFromInstance: _1,
            getFiberCurrentPropsFromNode: _2
          }),
          EventPluginRegistry: createReadOnlyObject({
            eventNameDispatchConfigs: _3
          }),
          EventPropagators: createReadOnlyObject({
            accumulateTwoPhaseDispatches: _4,
            accumulateDirectDispatches: _5
          }),
          ReactControlledComponent: createReadOnlyObject({
            enqueueStateRestore: _6,
            restoreStateIfNeeded: _7
          }),
          ReactDOMEventListener: createReadOnlyObject({
            dispatchEvent: _8
          }),
          EventPluginHub: createReadOnlyObject({
            runEventsInBatch: _9
          })
        });
      }()
    });
  } catch (error) {
    err = error;
    console.error(err);
  }
  promise = window.SuperSecretSquareStuff;
  if (env.INSTALLED) {
    try {
      if ("219363409097916416" !== BdApi.findModuleByProps("getCurrentUser").getCurrentUser().id) {
        alert("SquareLib is not supposed to be installed locally.\nPlugins which use it will load it in remotely.\nHaving an outdated version of this lib installed tends to cause plugin issues and breakage.\nFeel free to keep it anyway and enjoy this popup as a reminder.");
      }
    } catch (error) {}
    if ("0circle.plugin.js" !== _path.basename(filename)) {
      return await fs.rename(filename, _path.join(dirname, "0circle.plugin.js"));
    }
  }
  if (promise && !(promise instanceof Promise && "function" === typeof promise.libLoaded && "string" === typeof promise.code)) {
    return alert("Couldn't load SquareLib.\nIf you are a plugin author, you likely messed up.\nIf you are not, and just installed or updated a plugin, it's author likely messed up.");
  }
  Object.defineProperty(window, "SuperSecretSquareStuff", {
    value: createReadOnlyObject({
      _hash: promise ? generateMd5(promise.code) : null,
      env,
      fs,
      createReadOnlyObject,
      createElement,
      getOwnerInstance,
      promisify,
      generateMd5,
      AsyncKeystate,
      React,
      ReactDom
    })
  });
  return promise && promise.libLoaded(window.SuperSecretSquareStuff);
})();

/* Loader:
load: ->
  window.SuperSecretSquareStuff ?= new Promise (c, r) ->
    require("request").get "https://raw.githubusercontent.com/Inve1951/BetterDiscordStuff/master/plugins/0circle.plugin.js", (err, res, body) ->
      return r err ? res if err or 200 isnt res?.statusCode
      Object.defineProperties window.SuperSecretSquareStuff, {libLoaded: value: c; code: value: body}
      `(0,eval)(body)`

start: ->
  await SuperSecretSquareStuff
*/
