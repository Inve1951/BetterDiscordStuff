  //META{"name":"directDownload"}*//
var directDownload,
  indexOf = [].indexOf;

directDownload = (function() {
  var Download, _fr, activityClassName, bw, cache, clipboard, dialog, downloadbar, fs, getSettings, http, https, initSwitchFix, installCss, installDownloadBar, lastButOneIndexOf, listener, nativeImage, pPlugins, pThemes, path, remote, settings, shell;

  class directDownload {
    getName() {
      return "Direct-Download";
    }

    getDescription() {
      return "Download attached files directly within discord. Usage note: Left click a tab to open the file, right click it to show in file manager.";
    }

    getAuthor() {
      return "square";
    }

    getVersion() {
      return "0.3.3-alpha";
    }

    start() {
      getSettings();
      installCss();
      installDownloadBar();
      initSwitchFix.call(this);
      document.addEventListener("click", listener, true);
    }

    stop() {
      downloadbar.remove();
      document.getElementById("css_directDownload").remove();
      document.removeEventListener("click", listener, true);
      this.switchFix.disconnect();
    }

    load() {}

    getSettingsPanel() {
      getSettings();
      return `<div id="settings_directDownload">\n  <style>\n    #settings_directDownload {\n      color: #87909C;\n    }\n    #settings_directDownload button {\n      background: rgba(128,128,128,0.4);\n      width: calc(100% - 20px);\n      padding: 5px 10px;\n      box-sizing: content-box;\n      height: 1em;\n      font-size: 1em;\n      line-height: 0.1em;\n    }\n    #settings_directDownload button.invalid {\n      background: rgba(200,0,0,.5);\n      font-weight: 500;\n    }\n    #settings_directDownload label {\n      display: inline-block;\n    }\n    #settings_directDownload :-webkit-any(label, input) {\n      cursor: pointer;\n    }\n    #settings_directDownload br + br {\n      content: "";\n      display: block;\n      margin-top: 5px;\n    }\n  </style>\n  <button name="dldir" type="button" onclick="directDownload.chooseDirectory()">${settings.dldir}</button>\n  <br><br>\n  <label><input name="autoopen" type="checkbox" ${(settings.autoopen ? "checked" : "")} onchange="directDownload.updateSettings()"/>Open files after download.</label>\n  <label><input name="showinstead" type="checkbox" ${(settings.showinstead ? "checked" : "")} ${(settings.autoopen ? "" : "disabled")} onchange="directDownload.updateSettings()"/>Show in folder instead.</label>\n  <br><br>\n  <label><input name="overwrite" type="checkbox" ${(!settings.overwrite ? "checked" : "")} onchange="directDownload.updateSettings()"/>Ask for path if file exists.</label>\n  <label><input name="prompt" type="checkbox" ${(settings.prompt ? "checked" : "")} ${(settings.overwrite ? "disabled" : "")} onchange="directDownload.updateSettings()"/>Always ask.</label>\n  <br><br>\n  <label><input name="imagemodals" type="checkbox" ${(settings.imagemodals ? "checked" : "")} onchange="directDownload.updateSettings()"/>Allow direct download for image modals.</label>\n  <label><input name="copyimages" type="checkbox" ${(settings.copyimages ? "checked" : "")} ${(settings.imagemodals ? "" : "disabled")} onchange="directDownload.updateSettings()"/>Copy the image to clipboard when download is done.</label>\n  <br><br>\n  <label><input name="itp" type="checkbox" ${(settings.itp ? "checked" : "")} onchange="directDownload.updateSettings()"/>Install themes and plugins downloaded from betterdiscord.net (will always overwrite).</label>\n</div>`;
    }

    static chooseDirectory(cb) {
      dialog.showOpenDialog(bw, {
        defaultPath: settings.dldir,
        buttonLabel: "Choose",
        properties: [
          "openDirectory",
          "showHiddenFiles",
          "createDirectory",
          "noResolveAliases",
          "treatPackageAsDirectory" // "promptToCreate",
        ]
      }, (selection) => {
        var dir;
        dir = selection != null ? selection[0] : void 0;
        if (cb == null) {
          (document.querySelector("#settings_directDownload button")).innerHTML = dir != null ? dir : "";
          this.updateSettings();
        } else {
          cb(dir);
        }
      });
    }

    static chooseFile(defaultPath, cb) {
      var ext, filters;
      if (cb == null) {
        cb = defaultPath;
        defaultPath = "";
      }
      ext = (path.extname(defaultPath)).slice(1);
      filters = ext ? [
        {
          name: ext.toUpperCase(),
          extensions: [ext]
        },
        {
          name: "All Files",
          extensions: ["*"]
        }
      ] : [];
      dialog.showSaveDialog(bw, {defaultPath, filters}, function(selection) {
        cb(selection);
      });
    }

    static updateSettings() {
      var input, j, len, name, ref, type, value;
      ref = document.querySelectorAll("#settings_directDownload :-webkit-any(input, button)");
      for (j = 0, len = ref.length; j < len; j++) {
        input = ref[j];
        ({name, type, value} = input);
        if (type === "button") {
          value = input.innerHTML;
        } else if (type = "checkbox") {
          value = input.checked;
        }
        if (((function() {
          switch (name) {
            case "dldir":
              return value && (path.isAbsolute(value)) && fs.existsSync(value);
            case "showinstead":
              input.disabled = !settings.autoopen;
              return true;
            case "copyimages":
              input.disabled = !settings.imagemodals;
              return true;
            case "overwrite":
              value = !value;
              return true;
            case "prompt":
              input.disabled = settings.overwrite;
              return true;
            default:
              return true;
          }
        })())) {
          settings[name] = value;
          input.className = "";
        } else {
          input.className = "invalid";
          if (name === "dldir") {
            input.innerHTML = "invalid path";
          }
        }
      }
      bdPluginStorage.set("directDownload", "settings", settings);
    }

    /* for Zerebos */
    static toClipboard(url, cb) {
      cache.get(url, function(dl) {
        var ref;
        if ((dl == null) || !dl.isImage) {
          cb(false);
          return;
        }
        if (dl.finished) {
          clipboard.write({
            image: nativeImage.createFromBuffer(dl.buffer)
          });
          if (!((ref = dl.elem) != null ? ref.inDOM : void 0)) {
            delete dl.buffer;
          }
        } else {
          dl.copyWhenFinished = true;
        }
        cb(true);
      });
    }

  };

  downloadbar = null;

  activityClassName = "activityFeed-HeiGwL";

  installCss = function() {
    var style;
    style = document.createElement("style");
    style.id = "css_directDownload";
    style.innerHTML = Download.css;
    document.head.appendChild(style);
  };

  installDownloadBar = function() {
    var container, e, style;
    if (downloadbar == null) {
      downloadbar = document.createElement("div");
      downloadbar.id = "files_directDownload";
      style = document.createElement("style");
      downloadbar.appendChild(style);
      downloadbar.classList.add("empty");
    }
    if ((document.getElementById("files_directDownload")) == null) {
      container = document.querySelector(`.chat .content > :first-child, #friends, .${activityClassName}`);
      try {
        container.appendChild(downloadbar);
      } catch (error1) {
        e = error1;
        console.error(e);
      }
    }
  };

  directDownload.prototype.onSwitch = installDownloadBar;

  initSwitchFix = function() {
    var e;
    this.switchFix = new MutationObserver((mutations) => {
      var addedNodes, className, id, j, l, len, len1, ref, removedNodes;
      for (j = 0, len = mutations.length; j < len; j++) {
        ({addedNodes, removedNodes} = mutations[j]);
        ref = [...addedNodes, ...removedNodes];
        for (l = 0, len1 = ref.length; l < len1; l++) {
          ({id, className} = ref[l]);
          if (id === "friends" || -1 !== className.indexOf(activityClassName)) {
            return this.onSwitch();
          }
        }
      }
    });
    try {
      this.switchFix.observe((document.querySelector(`.guilds-wrapper + div :-webkit-any(.chat, #friends, .${activityClassName})`)).parentNode, {
        childList: true
      });
    } catch (error1) {
      e = error1;
      console.error(e);
    }
  };

  fs = require("fs");

  path = require("path");

  ({clipboard, nativeImage, remote} = require("electron"));

  ({shell, dialog} = remote);

  bw = remote.BrowserWindow.getAllWindows()[0];

  settings = {};

  pPlugins = (function() {
    switch (process.platform) {
      case "win32":
        return path.resolve(process.env.appdata, "BetterDiscord/plugins/");
      case "darwin":
        return path.resolve(process.env.HOME, "Library/Preferences/", "BetterDiscord/plugins/");
      default:
        return path.resolve(process.env.HOME, ".config/", "BetterDiscord/plugins/");
    }
  })();

  pThemes = (function() {
    switch (process.platform) {
      case "win32":
        return path.resolve(process.env.appdata, "BetterDiscord/themes/");
      case "darwin":
        return path.resolve(process.env.HOME, "Library/Preferences/", "BetterDiscord/themes/");
      default:
        return path.resolve(process.env.HOME, ".config/", "BetterDiscord/themes/");
    }
  })();

  listener = function(ev) {
    var elem, i, j, len, ref, ref1, ref2, ref3;
    if (settings.imagemodals && (ref = ev.target, indexOf.call((ref1 = (ref2 = document.querySelector("div.modal-image")) != null ? ref2.querySelectorAll(":-webkit-any(img,span)") : void 0) != null ? ref1 : [], ref) >= 0) || ev.target.nodeName === "A" && ev.target.href.startsWith("https://betterdiscord.net/ghdl?")) {
      new Download(ev.target);
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
    ref3 = ev.path;
    for (i = j = 0, len = ref3.length; j < len; i = ++j) {
      elem = ref3[i];
      if ((elem.classList.contains("attachment")) && ((elem.querySelector(".icon-file")) != null)) {
        new Download(elem);
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }
      if (i === 2) {
        return;
      }
    }
  };

  lastButOneIndexOf = function(h, n) {
    return h.slice(0, h.lastIndexOf(n)).lastIndexOf(n);
  };

  getSettings = function() {
    var k, ref, ref1, v;
    settings = (ref = bdPluginStorage.get("directDownload", "settings")) != null ? ref : {};
    ref1 = {
      dldir: path.join(process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"], "downloads"),
      autoopen: false,
      showinstead: false,
      overwrite: true,
      prompt: false,
      imagemodals: true,
      copyimages: false,
      itp: true
    };
    for (k in ref1) {
      v = ref1[k];
      if (settings[k] == null) {
        settings[k] = v;
      }
    }
  };

  Download = (function() {
    class Download {
      constructor(...args) {
        var a;
        this.filename = this.filepath = this.url = "";
        this.filesize = this.bufpos = 0;
        this.buffer = this.elem = this.pb = this.att = this.buffers = null;
        this.started = this.finished = this.failed = false;
        this.openWhenFinished = settings.autoopen;
        this.showinstead = this.openWhenFinished && settings.showinstead;
        this.overwrite = settings.overwrite;
        this.prompt = !this.overwrite && settings.prompt;
        this.copyWhenFinished = this.isImage = this.install = this.stream = false;
        if (args.length > 1) {
          this.buffer = args[0];
          this.filesize = this.bufpos = Buffer.byteLength(this.buffer);
          this.started = this.finished = true;
          this.filepath = args[1].path;
          this.url = args[1].url;
          this.filename = path.basename(this.filepath);
          this.isImage = (function() {
            switch (path.extname(this.filename)) {
              case ".jpg":
              case ".jpeg":
              case ".png":
              case ".webp":
              case ".gif":
              case ".bmp":
              case ".ico":
                return true; // copying to clipboard will silently fail for _unsupported_ formats
              default:
                return false;
            }
          }).call(this);
          this.copyWhenFinished = this.isImage && settings.copyimages;
          return;
        }
        this.att = args[0];
        if (settings.imagemodals && (this.att.nodeName === "IMG" || this.att.nodeName === "SPAN")) {
          this.copyWhenFinished = settings.copyimages;
          this.isImage = true;
          if (this.att.parentNode.nodeName === "SPAN") {
            this.att = this.att.parentNode;
          }
          this.url = (this.att.parentNode.querySelector("a")).href;
          this.filename = path.basename((this.url.split("/")).pop());
        } else {
          a = this.att.nodeName === "A" ? this.att : this.att.querySelector("a");
          this.install = a === this.att && settings.itp;
          this.url = a.href;
          this.filename = path.basename(a.title || a.innerHTML);
        }
        cache.get(this.url, (dl) => {
          if (dl != null) {
            cache.verify(dl.url, (valid) => {
              var ref;
              if (valid) { // then restore tab
                dl.openWhenFinished = settings.autoopen;
                dl.showinstead = settings.showinstead;
                dl.copyWhenFinished = dl.isImage && settings.copyimages;
                if (!((ref = dl.elem) != null ? ref.inDOM : void 0)) {
                  dl.start(false);
                }
                dl.finish(false);
                return;
              }
              this.c2();
            });
            return;
          }
          this.c2();
        });
      }

      c2() {
        var req;
        if (!this.prompt) {
          this.filepath = path.join(settings.dldir, this.filename);
        }
        this.filesize = this.bufpos = 0;
        req = this.buffer = null;
        this.start();
        req = (this.url.startsWith("https") ? https : http).get(this.url, (res) => {
          this.buffers = [];
          if (200 !== res.statusCode) {
            res.destroy();
            console.error(`Download failed for ${this.filename} with code ${res.statusCode}:\n${res.statusMessage}`);
            this.fail();
            return;
          }
          if (!path.extname(this.filename)) {
            this.filename = path.basename(res.headers["content-disposition"].split("filename=")[1]);
            if (!this.prompt) {
              this.filepath = path.join(settings.dldir, this.filename);
            }
            (this.elem.querySelector("span")).textContent = this.filename;
          }
          this.filesize = 0 | res.headers["content-length"];
          this.progress();
          res.on("data", (chunk) => {
            this.buffers.push(chunk);
            this.bufpos += Buffer.byteLength(chunk);
            this.progress();
          });
          return res.on("end", () => {
            if (this.filesize && this.filesize !== this.bufpos) {
              console.error(`Download failed for ${this.filename}: ${this.filesize}bytes announced, ${this.bufpos}bytes received!`);
              this.fail();
              return;
            }
            this.buffer = Buffer.concat(this.buffers, this.bufpos);
            this.filesize = this.bufpos;
            delete this.buffers;
            this.finish();
          });
        });
        req.on("error", (error) => {
          console.error(error);
          this.fail();
        });
        req.end();
      }

      // cunstructor
      start(write = true) {
        var span, svg;
        this.started = true;
        if (write) {
          cache.set(this.url, this);
        }
        this.elem = document.createElement("div");
        this.elem.className = "file";
        this.elem.innerHTML = "<span></span>\n<svg viewBox=\"0 0 26 26\">\n    <path d=\"M20 7.41L18.59 6 13 11.59 7.41 6 6 7.41 11.59 13 6 18.59 7.41 20 13 14.41 18.59 20 20 18.59 14.41 13 20 7.41z\"/>\n</svg>";
        this.pb = document.createElement("div");
        this.pb.className = "progress-bar";
        this.elem.appendChild(this.pb);
        span = this.elem.querySelector("span");
        span.textContent = this.filename;
        svg = this.elem.querySelector("svg");
        span.onclick = (event) => {
          if (this.finished) {
            this.open();
          } else {
            this.elem.classList.add("will-open");
            this.openWhenFinished = true;
            this.showinstead = false;
          }
          event.preventDefault();
          return false;
        };
        span.oncontextmenu = (event) => {
          if (this.finished) {
            this.show();
          } else {
            this.elem.classList.add("will-open");
            this.openWhenFinished = this.showinstead = true;
          }
          event.preventDefault();
          return false;
        };
        svg.onclick = (event) => {
          this.elem.remove();
          this.elem.inDOM = false;
          if (this.finished) {
            delete this.buffer;
          }
          Download.updateFileWidth();
          event.preventDefault();
          return false;
        };
        downloadbar.appendChild(this.elem);
        this.elem.inDOM = true;
        Download.updateFileWidth();
      }

      // start
      progress() {
        this.pb.style = `width: calc((100% + 2px) * ${this.bufpos / this.filesize});`;
      }

      finish(write = true) {
        if (this.copyWhenFinished) {
          clipboard.write({
            image: nativeImage.createFromBuffer(this.buffer)
          });
        }
        if (write) {
          if (this.install) {
            this.filepath = (function() {
              switch (this.filename.slice(lastButOneIndexOf(this.filename, "."))) {
                case ".plugin.js":
                  return path.join(pPlugins, this.filename);
                case ".theme.css":
                  return path.join(pThemes, this.filename);
                default:
                  this.install = false;
                  return this.filepath;
              }
            }).call(this);
          }
          if ((1 !== write) && !this.install && ((this.prompt && !this.filepath) || (!this.overwrite && fs.existsSync(this.filepath)))) {
            directDownload.chooseFile(this.filepath || path.join(settings.dldir, this.filename), (file) => {
              if (!file) {
                this.fail();
                return;
              }
              this.filepath = file;
              this.filename = path.basename(file);
              (this.elem.querySelector("span")).textContent = this.filename;
              this.finish(1);
            });
            return;
          }
          fs.writeFile(this.filepath, this.buffer, (error) => {
            if (error) {
              console.error(error);
              this.fail();
              return;
            }
            this.elem.classList.remove("will-open");
            this.elem.classList.add("done");
            this.finished = true;
            if (!this.elem.inDOM) {
              delete this.buffer;
            }
            console.log(`File saved to ${this.filepath}.`);
            if (this.install) {
              cache.clear(this.url); // so you can update with the same url
            } else {
              cache.set(this.url, this);
            }
            if (this.openWhenFinished) {
              if (!this.showinstead) {
                this.open();
              } else {
                this.show();
              }
            }
          });
          return;
        }
        this.elem.classList.remove("will-open");
        this.elem.classList.add("done");
        if (!this.elem.inDOM) {
          delete this.buffer;
        }
        if (this.openWhenFinished) {
          if (!this.showinstead) {
            this.open();
          } else {
            this.show();
          }
        }
      }

      fail() {
        cache.clear(this.url);
        this.failed = true;
        this.elem.classList.add("failed");
      }

      open() {
        shell.openItem(this.filepath);
      }

      show() {
        shell.showItemInFolder(this.filepath);
      }

      static updateFileWidth() {
        var numFiles;
        numFiles = (downloadbar.querySelectorAll(".file")).length;
        (downloadbar.querySelector("style")).innerHTML = `#files_directDownload .file{max-width: calc((100% + 2px) / ${numFiles} - 2px);}`;
        downloadbar.classList.toggle("empty", !numFiles);
      }

    };

    Download.css = "#files_directDownload {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  height: 25px;\n  overflow: hidden;\n  font-size: 0;\n}\n#files_directDownload.empty {\n  display: none;\n}\n#files_directDownload .file {\n  height: 100%;\n  width: 200px;\n  min-width: 50px;\n  background: rgba(128,128,128,0.2);\n  display: inline-block;\n  margin-left: 2px;\n  box-shadow: inset 0 0 10px rgba(0,0,0,0.3);\n  border: 1px solid rgba(128,128,128,0.2);\n  border-bottom: none;\n  box-sizing: border-box;\n  position: relative;\n  cursor: pointer;\n}\n#files_directDownload .file:first-of-type {\n  border-top-left-radius: 4px;\n  margin: 0;\n}\n#files_directDownload .file:last-of-type {\n  border-top-right-radius: 4px;\n}\n#files_directDownload .file.will-open {\n  background: rgba(128,128,128,0.4);\n}\n#files_directDownload span {\n  width: calc(100% + 2px);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: #87909C;\n  /*display: inline-block;*/\n  position: absolute;\n  left: -1px;\n  top: -1px;\n  font-size: 14px;\n  line-height: 23px;\n  padding: 0 18px 0 4px;\n  box-sizing: border-box;\n}\n#files_directDownload .file .progress-bar {\n  position:absolute;\n  height: 2px;\n  bottom: 0;\n  left: -1px;\n  background: rgb(32,196,64);\n}\n#files_directDownload .file.failed .progress-bar {\n  background: rgb(196,64,32);\n  min-width: calc(100% + 2px);\n}\n#files_directDownload .file.done .progress-bar {\n  min-width: calc(100% + 2px);\n}\n#files_directDownload .file svg {\n  fill: rgba(0,0,0,0.5);\n  position: absolute;\n  top: -1px;\n  right: -1px;\n  height: 23px;\n  width: 23px;\n}\n\n#friends {\n  position: relative;\n}\n\n.attachment, .callout-backdrop + div .modal-image :-webkit-any(img,span) {\n  cursor: pointer;\n}";

    return Download;

  })();

  // Download
  cache = new ((function() {
    var CacheEntry, _Class, _cache, _cacheLs, cachepath, e, updateLs, url;

    _Class = class {
      constructor() {
        var count, needsUpdate, url;
        // clean cache on startup
        count = 0;
        needsUpdate = false;
        for (url in _cache) {
          count++;
          this.verify(url, function(valid) {
            needsUpdate || (needsUpdate = !valid);
            if (0 === --count && needsUpdate) {
              updateLs();
            }
          });
        }
      }

      get(url, cb) {
        var f, ref;
        if ((f = _cache[url]) == null) {
          cb();
          return;
        }
        if (((ref = f.dl) != null ? ref.buffer : void 0) != null) {
          cb(f.dl);
          return;
        }
        this.verify(url, function(valid) {
          if (!valid) {
            cb();
            return;
          }
          fs.readFile(f.path, function(err, data) {
            if (err) {
              cb();
              return;
            }
            f.dl = new Download(data, f);
            cb(f.dl);
          });
        });
      }

      set(url, dl) {
        _cache[url] = new CacheEntry(url, dl);
      }

      clear(url) {
        delete _cache[url];
        updateLs();
      }

      verify(url, cb) {
        var f;
        if ((f = _cache[url]) == null) {
          cb(false);
          return;
        }
        fs.lstat(f.path, function(err, stats) {
          if (err || f.timestamp !== stats.mtime.getTime()) {
            delete _cache[url];
            cb(false);
            return;
          }
          cb(true);
        });
      }

    };

    // _cacheLs = localStorage.directDownloadCache or {}
    cachepath = (function() {
      switch (process.platform) {
        case "win32":
          return path.join(process.env.temp, "/BDdirectDownloadCache.json");
        case "darwin":
          return path.join(process.env.TMPDIR, "/BDdirectDownloadCache.json");
        default:
          return "/tmp/BDdirectDownloadCache.json";
      }
    })();

    try {
      _cacheLs = JSON.parse(fs.readFileSync(cachepath, "utf8"));
    } catch (error1) {
      e = error1;
      _cacheLs = {};
    }

    _cache = _cacheLs;

    for (url in _cache) {
      _cache[url].url = url;
    }

    updateLs = function() {
      var f, fLs, k;
      _cacheLs = {};
      for (url in _cache) {
        f = _cache[url];
        fLs = {};
        for (k in f) {
          if (k !== "dl" && k !== "url") {
            fLs[k] = f[k];
          }
        }
        if (fLs.tbd) {
          continue;
        }
        _cacheLs[url] = fLs;
      }
      // localStorage.directDownloadCache = _cacheLs
      fs.writeFileSync(cachepath, JSON.stringify(_cacheLs));
    };

    CacheEntry = function(url1, dl1) {
      this.url = url1;
      this.dl = dl1;
      this.path = this.dl.filepath;
      this.tbd = true;
      if (!this.dl.finished) {
        return;
      }
      fs.lstat(this.path, (err, stats) => {
        delete this.tbd;
        if (err) {
          delete _cache[this.url];
          return;
        }
        this.timestamp = stats.mtime.getTime();
        updateLs();
      });
      return this;
    };

    return _Class;

  })());

  // cache
  _fr = {
    exports: {}
  };

  /* https://github.com/olalonde/follow-redirects */
  ({http, https} = _fr = (function(exports, module){
    'use strict';
    var url = require('url');
    var assert = require('assert');
    var http = require('http');
    var https = require('https');
    var Writable = require('stream').Writable;
    /*var debug = require('debug')('follow-redirects');*/

    var nativeProtocols = {'http:': http, 'https:': https};
    var schemes = {};
    var exports = module.exports = {
    	maxRedirects: 21
    };
    var safeMethods = {GET: true, HEAD: true, OPTIONS: true, TRACE: true};
    var eventHandlers = Object.create(null);
    ['abort', 'aborted', 'error', 'socket'].forEach(function (event) {
    	eventHandlers[event] = function (arg) {
    		this._redirectable.emit(event, arg);
    	};
    });
    function RedirectableRequest(options, responseCallback) {
    	Writable.call(this);
    	this._options = options;
    	this._redirectCount = 0;
    	this._bufferedWrites = [];
    	if (responseCallback) {
    		this.on('response', responseCallback);
    	}
    	var self = this;
    	this._onNativeResponse = function (response) {
    		self._processResponse(response);
    	};
    	if (!options.pathname && options.path) {
    		var searchPos = options.path.indexOf('?');
    		if (searchPos < 0) {
    			options.pathname = options.path;
    		} else {
    			options.pathname = options.path.substring(0, searchPos);
    			options.search = options.path.substring(searchPos);
    		}
    	}
    	this._performRequest();
    }
    RedirectableRequest.prototype = Object.create(Writable.prototype);
    RedirectableRequest.prototype._performRequest = function () {
    	var protocol = this._options.protocol;
    	if (this._options.agents) {
    		this._options.agent = this._options.agents[schemes[protocol]];
    	}
    	var nativeProtocol = nativeProtocols[protocol];
    	var request = this._currentRequest =
    				nativeProtocol.request(this._options, this._onNativeResponse);
    	this._currentUrl = url.format(this._options);
    	request._redirectable = this;
    	for (var event in eventHandlers) {
    		if (event) {
    			request.on(event, eventHandlers[event]);
    		}
    	}
    	if (this._isRedirect) {
    		var bufferedWrites = this._bufferedWrites;
    		if (bufferedWrites.length === 0) {
    			request.end();
    		} else {
    			var i = 0;
    			(function writeNext() {
    				if (i < bufferedWrites.length) {
    					var bufferedWrite = bufferedWrites[i++];
    					request.write(bufferedWrite.data, bufferedWrite.encoding, writeNext);
    				} else {
    					request.end();
    				}
    			})();
    		}
    	}
    };
    RedirectableRequest.prototype._processResponse = function (response) {
    	var location = response.headers.location;
    	if (location && this._options.followRedirects !== false &&
    			response.statusCode >= 300 && response.statusCode < 400) {
    		if (++this._redirectCount > this._options.maxRedirects) {
    			return this.emit('error', new Error('Max redirects exceeded.'));
    		}
    		var header;
    		var headers = this._options.headers;
    		if (response.statusCode !== 307 && !(this._options.method in safeMethods)) {
    			this._options.method = 'GET';
    			this._bufferedWrites = [];
    			for (header in headers) {
    				if (/^content-/i.test(header)) {
    					delete headers[header];
    				}
    			}
    		}
    		if (!this._isRedirect) {
    			for (header in headers) {
    				if (/^host$/i.test(header)) {
    					delete headers[header];
    				}
    			}
    		}
    		var redirectUrl = url.resolve(this._currentUrl, location);
    		/*debug('redirecting to', redirectUrl);*/
    		Object.assign(this._options, url.parse(redirectUrl));
    		this._isRedirect = true;
    		this._performRequest();
    	} else {
    		response.responseUrl = this._currentUrl;
    		this.emit('response', response);
    		delete this._options;
    		delete this._bufferedWrites;
    	}
    };
    RedirectableRequest.prototype.abort = function () {
    	this._currentRequest.abort();
    };
    RedirectableRequest.prototype.flushHeaders = function () {
    	this._currentRequest.flushHeaders();
    };
    RedirectableRequest.prototype.setNoDelay = function (noDelay) {
    	this._currentRequest.setNoDelay(noDelay);
    };
    RedirectableRequest.prototype.setSocketKeepAlive = function (enable, initialDelay) {
    	this._currentRequest.setSocketKeepAlive(enable, initialDelay);
    };
    RedirectableRequest.prototype.setTimeout = function (timeout, callback) {
    	this._currentRequest.setTimeout(timeout, callback);
    };
    RedirectableRequest.prototype.write = function (data, encoding, callback) {
    	this._currentRequest.write(data, encoding, callback);
    	this._bufferedWrites.push({data: data, encoding: encoding});
    };
    RedirectableRequest.prototype.end = function (data, encoding, callback) {
    	this._currentRequest.end(data, encoding, callback);
    	if (data) {
    		this._bufferedWrites.push({data: data, encoding: encoding});
    	}
    };
    Object.keys(nativeProtocols).forEach(function (protocol) {
    	var scheme = schemes[protocol] = protocol.substr(0, protocol.length - 1);
    	var nativeProtocol = nativeProtocols[protocol];
    	var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);
    	wrappedProtocol.request = function (options, callback) {
    		if (typeof options === 'string') {
    			options = url.parse(options);
    			options.maxRedirects = exports.maxRedirects;
    		} else {
    			options = Object.assign({
    				maxRedirects: exports.maxRedirects,
    				protocol: protocol
    			}, options);
    		}
    		assert.equal(options.protocol, protocol, 'protocol mismatch');
    		/*debug('options', options);*/

    		return new RedirectableRequest(options, callback);
    	};
    	wrappedProtocol.get = function (options, callback) {
    		var request = wrappedProtocol.request(options, callback);
    		request.end();
    		return request;
    	};
    });
  return module.exports})(_fr.exports, _fr));

  return directDownload;

})();

window.directDownload = directDownload;
