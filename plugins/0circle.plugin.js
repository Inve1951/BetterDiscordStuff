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
  var AsyncKeystate, React, ReactDOM, _crypto, _fs, _keystates, _path, createElement, createReadOnlyObject, dirname, env, err, filename, findDescendant, fs, generateMd5, getOwnerInstance, patchRender, promise, promisify;

  _path = require("path");
  _fs = require("fs");
  _crypto = require("crypto");
  filename = typeof __filename !== "undefined" && __filename !== null ? __filename : "";
  dirname = typeof __dirname !== "undefined" && __dirname !== null ? __dirname : "";

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

    ({
      stateNodeIsMandatory = true,
      ignoreHtml = true,
      ignoreSymbols = true,
      returnStateNode = true
    } = options);

    while (elem) {
      if (elem instanceof Node) {
        elem = ReactDOM._internal.ReactDOMComponentTree.getClosestInstanceFromNode(elem);
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
    if (!ev.repeat) {
      return _keystates.push(ev);
    }
  }, true);
  document.addEventListener("keyup", function ({
    code
  }) {
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

  findDescendant = function (node, options = {}, filter = function () {
    return true;
  }, parent) {
    var child, children, i, ignoreHtml, ignoreSymbols, j, len, len1, returnStateNode, stateNodeIsMandatory;

    if ("function" === typeof options) {
      filter = options;
      options = {};
    }

    ({
      stateNodeIsMandatory = true,
      ignoreHtml = true,
      ignoreSymbols = true,
      returnStateNode = true
    } = options);

    if (node instanceof Element) {
      // TODO: implement (virtual) DOM version
      return null;
    }

    if (node instanceof Array) {
      for (i = 0, len = node.length; i < len; i++) {
        child = node[i];

        if (child && (child = findDescendant(child, options, filter, node))) {
          return child;
        }
      }
    }

    if (!React.isValidElement(node)) {
      return null;
    }

    ({
      props: {
        children
      }
    } = node);

    if (!children) {
      return null;
    }

    if (!(children instanceof Array)) {
      children = [children];
    }

    for (j = 0, len1 = children.length; j < len1; j++) {
      child = children[j];

      if (!child) {
        continue;
      }

      if (!(null === child.type || stateNodeIsMandatory && !child.stateNode || ignoreHtml && child.stateNode instanceof Node || ignoreSymbols && "symbol" === typeof child.type) && filter(child)) {
        if (returnStateNode) {
          return child.stateNode;
        } else {
          return [child, node];
        }
      }

      if (child = findDescendant(child, options, filter, node)) {
        return child;
      }
    }

    return null;
  };

  patchRender = function (component, ...patches) {
    var componentBase, originalRender, renderKey;

    if ("string" === typeof patches[0]) {
      renderKey = patches.shift();
    }

    if (component.prototype instanceof React.Component) {
      componentBase = component.prototype;
      renderKey || (renderKey = "render");
    } else {
      componentBase = component;
      renderKey || (renderKey = "default");
    }

    if ("function" !== typeof componentBase[renderKey]) {
      throw new Error("Unsupported component model");
    }

    originalRender = componentBase[renderKey];

    componentBase[renderKey] = function () {
      var _filter, children, content, err, filter, i, len, mode, node, parent, props, render, res, state, target, touch;

      res = Reflect.apply(originalRender, this, arguments);
      [props, state] = arguments;

      if (this.props) {
        ({
          props
        } = this);
      }

      if (this.state) {
        ({
          state
        } = this);
      }

      for (i = 0, len = patches.length; i < len; i++) {
        ({
          filter = function () {
            return true;
          },
          mode,
          render,
          touch
        } = patches[i]);

        _filter = function (node) {
          return node && filter(node, props, state);
        };

        try {
          if (!(target = mode !== "before" && mode !== "after" && _filter(res) ? [res] : findDescendant(res, {
            returnStateNode: false,
            ignoreHtml: false,
            stateNodeIsMandatory: false
          }, _filter))) {
            continue;
          }

          [node, parent] = target;
          content = "function" === typeof render ? Reflect.apply(render, this, arguments) : render;

          if (mode === "append" || mode === "prepend") {
            target = node;
            mode = "append" === mode ? "after" : "before";
          } else if (mode === "before" || mode === "after") {
            target = parent;
          } else if (render) {
            mode = "replace";
          }

          if ("function" === typeof touch) {
            Reflect.apply(touch, this, [node, props, state]);
          }

          if ("replace" === mode) {
            if (!parent) {
              return content;
            }

            if (parent instanceof Array) {
              parent[parent.indexOf(node)] = content;
            } else {
              ({
                children
              } = parent.props);

              if (children instanceof Array) {
                children[children.indexOf(node)] = content;
              } else {
                parent.props.children = content;
              }
            }
          } else if (mode) {
            if (!(target instanceof Array)) {
              ({
                children
              } = target.props);

              if (children instanceof Array) {
                target = children;
              } else {
                ({
                  props: {
                    children: target
                  }
                } = target.props.children = React.createElement(React.Fragment, null, React.Children.toArray(children)));
              }
            }

            target["before" === mode ? "unshift" : "push"](content);
          }
        } catch (error) {
          err = error;
          console.error(err);
        }
      }

      return res;
    };

    return function () {
      // TODO: forceUpdate()
      return componentBase[renderKey] = originalRender;
    };
  };

  try {
    ({
      React,
      ReactDOM
    } = BdApi);
    ReactDOM = createReadOnlyObject({ ...ReactDOM,
      _internal: function () {
        var Events, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;

        ({
          Events
        } = ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
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
        alert(`SquareLib is not supposed to be installed locally.
Plugins which use it will load it in remotely.
Having an outdated version of this lib installed tends to cause plugin issues and breakage.
Feel free to keep it anyway and enjoy this popup as a reminder.`);
      }
    } catch (error) {}

    if ("0circle.plugin.js" !== _path.basename(filename)) {
      return await fs.rename(filename, _path.join(dirname, "0circle.plugin.js"));
    }
  }

  if (promise && !(promise instanceof Promise && "function" === typeof promise.libLoaded && "string" === typeof promise.code)) {
    return alert(`Couldn't load SquareLib.
If you are a plugin author, you likely messed up.
If you are not, and just installed or updated a plugin, it's author likely messed up.`);
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
      ReactDOM,
      findDescendant,
      patchRender
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