//META{"name":"restartNoMore"}*//;
var restartNoMore;

restartNoMore = (function() {
  var EOL, _onstart, bw, cacheFile, crypto, end, execJs, fixLineEndings, fs, getDisplayName, getHeader, getMd5, getSettings, load, log, onstart, patchAllSettingsPanels, patchSettingsPanel, path, start, unload, util, wasStarted;

  class restartNoMore {
    getName() {
      return "Restart-No-More";
    }

    getDescription() {
      return "Abandons the need for restarting/reloading discord to get your new plugins and themes. Especially useful for development.";
    }

    getVersion() {
      return "0.0.6-alpha";
    }

    getAuthor() {
      return "square";
    }

    constructor() {
      this.pPlugins = (function() {
        switch (process.platform) {
          case "win32":
            return path.resolve(process.env.appdata, "BetterDiscord/plugins/");
          case "darwin":
            return path.resolve(process.env.HOME, "Library/Preferences/", "BetterDiscord/plugins/");
          default:
            return path.resolve(process.env.HOME, ".config/", "BetterDiscord/plugins/");
        }
      })();
      this.pThemes = (function() {
        switch (process.platform) {
          case "win32":
            return path.resolve(process.env.appdata, "BetterDiscord/themes/");
          case "darwin":
            return path.resolve(process.env.HOME, "Library/Preferences/", "BetterDiscord/themes/");
          default:
            return path.resolve(process.env.HOME, ".config/", "BetterDiscord/themes/");
        }
      })();
      this._inProcess = {};
      this._nameCache = {};
      this._md5Cache = {};
      cacheFile = cacheFile.bind(this);
      unload = unload.bind(this);
      load = load.bind(this);
      start = start.bind(this);
      end = end.bind(this);
      log = log.bind(this);
      fs.readdir(this.pPlugins, (e, files) => {
        var f, j, len, results;
        if (e) {
          log(e);
        }
        if (files) {
          results = [];
          for (j = 0, len = files.length; j < len; j++) {
            f = files[j];
            results.push(cacheFile(true, path.resolve(this.pPlugins, f)));
          }
          return results;
        }
      });
      fs.readdir(this.pThemes, (e, files) => {
        var f, j, len, results;
        if (e) {
          log(e);
        }
        if (files) {
          results = [];
          for (j = 0, len = files.length; j < len; j++) {
            f = files[j];
            results.push(cacheFile(true, path.resolve(this.pThemes, f)));
          }
          return results;
        }
      });
    }

    load() {}

    start() {
      wasStarted = true;
      this.wPlugins = fs.watch(this.pPlugins, {
        persistent: false
      }, (type, filename) => {
        if (filename != null) {
          return cacheFile(path.resolve(this.pPlugins, filename));
        }
      });
      this.wThemes = fs.watch(this.pThemes, {
        persistent: false
      }, (type, filename) => {
        if (filename != null) {
          return cacheFile(path.resolve(this.pThemes, filename));
        }
      });
      if (this.wPlugins == null) {
        log("Couldn't initialize plugins watcher");
      }
      if (this.wThemes == null) {
        log("Couldn't initialize themes watcher");
      }
      bw = (require("electron")).remote.require("electron").BrowserWindow.getAllWindows()[0];
      onstart();
      if (getSettings().patchSettings) {
        return patchAllSettingsPanels();
      }
    }

    stop() {
      wasStarted = false;
      this.wPlugins.close();
      this.wThemes.close();
      if (getSettings().patchSettings) {
        return patchAllSettingsPanels(true);
      }
    }

    getSettingsPanel() {
      return `<input type=\"checkbox\" onchange=\"restartNoMore.updateSettings(this.parentNode)\" value=\"patchSettings\"${(getSettings().patchSettings ? " checked" : void 0)}> patch all plugin settings with a reload button.<br>\n<input type=\"checkbox\" onchange=\"restartNoMore.updateSettings(this.parentNode)\" value=\"fixLineEndings\"${(getSettings().fixLineEndings ? " checked" : void 0)}> Fixes your themes' line endings to ensure they work.<br>\n<button type=\"button\" onclick=\"restartNoMore.reloadAll()\">Reload all Plugins and Themes.</button>`;
    }

    static reloadAll() {
      var _nameCache, k, r, v;
      ({_nameCache} = bdplugins[restartNoMore.prototype.getName()].plugin);
      for (k in _nameCache) {
        v = _nameCache[k];
        if (v.name === "restartNoMore") {
          unload((r = k), v.pname != null);
        }
      }
      for (k in _nameCache) {
        v = _nameCache[k];
        unload(k, v.pname != null);
        cacheFile(k);
      }
      return cacheFile(r);
    }

    static reload(name) {
      var _nameCache, k, v;
      ({_nameCache} = bdplugins[restartNoMore.prototype.getName()].plugin);
      for (k in _nameCache) {
        v = _nameCache[k];
        if (!(v.name === name)) {
          continue;
        }
        unload(k, v.pname != null);
        cacheFile(k);
        return;
      }
      log(`Couldn't determine filename for requested reload: ${name}.`);
    }

    static updateSettings(container) {
      var j, len, oldSettings, ref, settings, x;
      oldSettings = getSettings();
      settings = {};
      ref = container.querySelectorAll("*");
      for (j = 0, len = ref.length; j < len; j++) {
        x = ref[j];
        if (x.type === "checkbox") {
          settings[x.value] = x.checked;
        }
      }
      bdPluginStorage.set("restartNoMore", "settings", settings);
      if (oldSettings.patchSettings !== settings.patchSettings) {
        return patchAllSettingsPanels(!settings.patchSettings);
      }
    }

  };

  path = require("path");

  fs = require("fs");

  crypto = require("crypto");

  util = require("util");

  EOL = (require("os")).EOL;

  bw = null;

  wasStarted = false;

  cacheFile = unload = load = start = end = log = null;

  cacheFile = function(init, filename) {
    var isPlugin;
    if (filename == null) {
      filename = init;
      init = false;
    }
    if (!((isPlugin = /\.plugin\.js$/.test(filename)) || /\.theme\.css$/.test(filename))) {
      return;
    }
    if (!start(filename)) {
      return;
    }
    return fs.lstat(filename, (e, stat) => {
      if ("ENOENT" === (e != null ? e.code : void 0)) {
        return end(filename, unload(filename, isPlugin));
      }
      if (e) {
        return end(filename, e);
      }
      if (!stat.isFile()) {
        return end(filename);
      }
      return setImmediate(() => {
        return fs.readFile(filename, "utf8", (e, data) => {
          var fnOld, header, k, md5, name, ref, ref1, v;
          if (e) {
            return end(filename, e);
          }
          if (!(header = getHeader(filename, data, isPlugin))) {
            return;
          }
          if (isPlugin) {
            if (header.pname == null) {
              header.pname = getDisplayName(header.name, data);
            }
            if (header.pname == null) {
              return end(filename, `couldn't gather plugin name from ${filename}`);
            }
          }
          if (init) {
            this._nameCache[filename] = header;
            this._md5Cache[header.name] = getMd5(data);
            if (!isPlugin) {
              onstart(start, filename);
              onstart(fixLineEndings, filename, data, (newData) => {
                if (data !== newData) {
                  this._md5Cache[header.name] = getMd5(newData);
                  unload(filename, isPlugin);
                  load(filename, newData, isPlugin);
                  return end(filename);
                } else {
                  return end(filename);
                }
              });
            }
            return end(filename, isPlugin);
          }
          md5 = getMd5(data);
          if ((this._nameCache[filename] == null) && (this._md5Cache[header.name] != null)) {
            ref = this._nameCache;
            for (k in ref) {
              v = ref[k];
              if (v.name === header.name) {
                fnOld = k;
                break;
              }
            }
            if (fnOld != null) {
              fs.lstat(fnOld, function(e) {
                if ("ENOENT" !== e.code) {
                  return end(filename, `Skipped loading ${filename} because ${fnOld} already registered ${header.name}.`);
                }
                log("# can this even be reached?");
                if (false === unload(fnOld, isPlugin)) {
                  return;
                }
                return end(filename, load(filename, data, isPlugin));
              });
            } else {
              return log("# shouldn't be reached.");
            }
          } else if (((name = (ref1 = this._nameCache[filename]) != null ? ref1.name : void 0) != null) && this._md5Cache[name] === md5) {
            return end(filename, `Skipped reloading ${filename} because it's unchanged.`);
          } else if (this._nameCache[filename] != null) {
            if (false === unload(filename, isPlugin)) {
              return;
            }
          }
          this._nameCache[filename] = header;
          this._md5Cache[header.name] = md5;
          return end(filename, load(filename, data, isPlugin));
        });
      });
    });
  };

  getSettings = function() {
    var defaultSettings, k, needsRewrite, settings, v;
    settings = bdPluginStorage.get("restartNoMore", "settings");
    if (settings == null) {
      settings = {};
    }
    needsRewrite = false;
    defaultSettings = {
      patchSettings: false,
      fixLineEndings: true
    };
    for (k in defaultSettings) {
      v = defaultSettings[k];
      if (!(settings[k] == null)) {
        continue;
      }
      settings[k] = v;
      needsRewrite = true;
    }
    if (needsRewrite) {
      bdPluginStorage.set("restartNoMore", "settings", settings);
    }
    return settings;
  };

  getHeader = function(filename, data, isPlugin) {
    var e, header;
    try {
      header = data.slice(0, data.indexOf(EOL));
      header = header.slice(6 + header.lastIndexOf("/\/ME" + "TA"), header.lastIndexOf("*/\/"));
      header = JSON.parse(header);
    } catch (error) {
      e = error;
      end(filename, e);
      return false;
    }
    if ((header.name == null) && (isPlugin || !((header.author != null) && (header.description != null) && (header.version != null)))) {
      end(filename, "Invalid META header in " + filename);
      return false;
    }
    return header;
  };

  getMd5 = function(data) {
    var md5;
    md5 = crypto.createHash("md5");
    md5.update(data);
    return md5.digest("hex");
  };

  getDisplayName = function(name, data) {
    var m, pp;
    pp = "[\\s\\S]";
    if ((m = data.match(RegExp(`^${pp}*?(?:\\r?\\n)${pp}*?${name}${pp}*?getName${pp}+?('|\")((?:\\\\\\1|[^\\1])*?)\\1`))) != null) {
      return m[2].split("\\" + m[1]).join(m[1]);
    }
  };

  unload = function(filename, isPlugin) {
    var header, p, ref, t;
    if (isPlugin !== !!isPlugin) {
      return log(new Error("Usage Error: isPlugin not provided."));
    }
    header = this._nameCache[filename];
    if (isPlugin) {
      p = (ref = bdplugins[header.pname]) != null ? ref.plugin : void 0;
      if (p == null) {
        end(filename, `Please patch the META header to include \`\"pname\":\"Plugin Name As Shown In BD Plugin Settings\"\` in ${filename}`);
        return false;
      }
      if (pluginCookie[header.pname]) {
        p.stop();
      }
      try {
        if (typeof p.unload === "function") {
          p.unload();
        }
      } catch (error) {}
      delete (typeof window !== "undefined" && window !== null ? window : global)[header.name];
      delete bdplugins[header.pname];
    } else {
      t = bdthemes[header.name];
      if (themeCookie[header.name]) {
        $(`#${header.name}`).remove();
      }
      delete bdthemes[header.name];
    }
    delete this._md5Cache[header.name];
    delete this._nameCache[filename];
    return log(`Unloaded ${filename}`);
  };

  load = function(filename, data, isPlugin) {
    var header;
    header = this._nameCache[filename];
    if (isPlugin) {
      return execJs("(function(){try{" + data + "\r\nreturn(" + (function(__name, __pname, __filename) {
        var e, plugin, pname;
        try {
          plugin = new __name;
          pname = plugin.getName();
          if (pname !== __pname) {
            console.log(`restartNoMore: Please patch the META header to include \`\"pname\":\"Plugin Name As Shown In BD Plugin Settings\"\` in ${__filename}`);
          }
          bdplugins[pname] = {
            plugin: plugin,
            enabled: false
          };
          return pname;
        } catch (error) {
          e = error;
          return e;
        }
      }).toString() + `)(${header.name}, '${header.pname}', '${filename.replace(/\\/g, '\\\\')}')}catch(e){return e}})()`, (pname) => {
        var plugin;
        if ((pname instanceof Error) || "string" !== typeof pname) {
          delete this._nameCache[filename];
          delete this._md5Cache[header.name];
          if (!(pname instanceof Error)) {
            return log(`Error initializing plugin ${header.name}, ${filename}`, new Error("Sorry, got no better error message at this time."));
          }
          return log(`Error initializing plugin ${header.name}, ${filename}`);
        }
        plugin = bdplugins[pname].plugin;
        if (pname in pluginCookie && pluginCookie[pname]) {
          plugin.start();
        } else {
          pluginCookie[pname] = false;
          pluginModule.savePluginData();
        }
        if (getSettings().patchSettings) {
          patchSettingsPanel(plugin);
        }
        return log(`Loaded ${filename}`);
      });
    } else {
      fixLineEndings(filename, data, function(data) {
        var n;
        data = data.split(EOL);
        data.shift();
        data = data.join("");
        bdthemes[header.name] = {
          name: header.name,
          description: header.description,
          author: header.author,
          version: header.version,
          css: escape(data),
          enabled: false
        };
        if (header.name in themeCookie && themeCookie[header.name]) {
          n = document.createElement("style");
          n.id = header.name;
          n.innerHTML = data;
          document.head.appendChild(n);
        } else {
          themeCookie[header.name] = false;
          themeModule.saveThemeData();
        }
        return end(filename, `Loaded ${filename}`);
      });
      return false;
    }
  };

  _onstart = [];

  onstart = function(_function, ...args) {
    var j, len;
    if (arguments.length) {
      _onstart.push([_function, args]);
      if (!wasStarted) {
        return;
      }
    }
    for (j = 0, len = _onstart.length; j < len; j++) {
      [_function, args] = _onstart[j];
      _function(...args);
    }
    return _onstart = [];
  };

  fixLineEndings = function(filename, data, cb) {
    var newData;
    if (!getSettings().fixLineEndings) {
      return cb(data);
    }
    newData = data.replace(/\r?\n|\r/g, "\r\n");
    if (data !== newData) {
      return fs.writeFile(filename, newData, function(e) {
        return setImmediate(function() {
          if (e) {
            log(`Couldn't write file with fixed line endings ${filename}`, e);
          } else {
            log(`Fixed line endings for ${filename}`);
          }
          return cb(newData);
        });
      });
    } else {
      return cb(data);
    }
  };

  execJs = function(js, cb) {

    /* dirty workaround for lack of proper error handling on electron's `executeJavaScript` */
    var _cb;
    _cb = function(e) {
      window.removeEventListener("error", _cb);
      if (e instanceof ErrorEvent) {
        return cb(new Error(`${e.type}: ${e.message}`));
      }
      return cb(...arguments);
    };
    window.addEventListener("error", _cb);
    return bw.webContents.executeJavaScript(js, false, _cb);
  };

  patchAllSettingsPanels = function(remove = false) {
    var k, plugin, results;
    results = [];
    for (k in bdplugins) {
      ({plugin} = bdplugins[k]);
      results.push(patchSettingsPanel(plugin, remove));
    }
    return results;
  };

  patchSettingsPanel = function(plugin, remove = false) {
    var base, e, name, o;
    try {
      switch (typeof (typeof (base = (o = plugin.getSettingsPanel)) === "function" ? base(remove) : void 0)) {
        case "undefined":
        case "string":
          return plugin.getSettingsPanel = function(remove) {
            if (!!remove === remove) {
              if (remove) {
                plugin.getSettingsPanel = o;
              }
              return 42;
            }
            return ((o != null ? o.apply : void 0) ? (o.apply(plugin, arguments)) + "<br>" : "") + `<button type=\"button\" onclick=\"restartNoMore.reload('${plugin.constructor.name}')\">Reload with Restart-No-More</button>`;
          };
      }
    } catch (error) {
      e = error;
      try {
        name = plugin.getName();
      } catch (error) {}
      try {
        if (name == null) {
          name = plugin.constructor.name;
        }
      } catch (error) {}
      return log(`Couldn't patch settings for ${name != null ? name : filename}.`, e);
    }
  };

  start = function(filename) {
    var color, i, j, l, n, ref, text;
    if (typeof yoyorainbow !== "undefined" && yoyorainbow !== null) {
      text = "yo";
      color = "";
      n = 10 * Math.random() + 3;
      for (i = j = 0, ref = n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        if (n < 5) {
          text = "yo" + text.slice(0, 0 | text.length / 2) + text;
        } else {
          text = "Yo" + text;
        }
      }
      for (i = l = 0; l < 6; i = ++l) {
        n = 0 | Math.random() * 16;
        if (9 < n) {
          n = String.fromCharCode(n + 87);
        }
        color += n;
      }
      console.log(`%c${text}`, `color:#${color}`);
    }
    if (this._inProcess[filename]) {
      return false;
    }
    return this._inProcess[filename] = true;
  };

  end = function(filename, e) {
    if (!e && e === !!e) {
      return;
    }
    delete this._inProcess[filename];
    if ((e instanceof Error) || "string" === typeof e) {
      return log(e);
    }
  };

  log = function(...text) {
    var i, j, len, msg, results;
    results = [];
    for (i = j = 0, len = text.length; j < len; i = ++j) {
      msg = text[i];
      if (msg instanceof Error) {
        if (0 === i) {
          log("Error:");
        }
        try {
          throw msg;
        } catch (error) {}
        results.push(console.error(msg));
      } else {
        results.push(console.log(`%c${this.getName()}: %c${msg}`, "color:#7e0e46;font-size:1.3em;font-weight:bold", "color:#005900;font-size:1.3em", "\t" + (new Date).toLocaleTimeString()));
      }
    }
    return results;
  };

  return restartNoMore;

})();

(typeof window !== "undefined" && window !== null ? window : global).restartNoMore = restartNoMore;
