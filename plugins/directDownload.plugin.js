//META{"name":"directDownload"}*//;
var directDownload;

directDownload = (function() {
  var Download, bw, clipboard, dialog, fs, getSettings, https, installCss, installDownloadBar, listener, nativeImage, path, remote, settings, shell;

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
      return "0.0.5-alpha";
    }

    start() {
      getSettings();
      installCss();
      installDownloadBar();
      document.addEventListener("click", listener, true);
    }

    stop() {
      document.getElementById("files_directDownload").remove();
      document.getElementById("css_directDownload").remove();
      document.removeEventListener("click", listener, true);
    }

    load() {}

    getSettingsPanel() {
      getSettings();
      return `<div id=\"settings_directDownload\">\n  <style>\n    #settings_directDownload {\n      color: #87909C;\n    }\n    #settings_directDownload button {\n      background: rgba(128,128,128,0.4);\n      width: calc(100% - 20px);\n      padding: 5px 10px;\n      box-sizing: content-box;\n      height: 1em;\n      font-size: 1em;\n      line-height: 0.1em;\n    }\n    #settings_directDownload button.invalid {\n      background: rgba(200,0,0,.5);\n      font-weight: 500;\n    }\n    #settings_directDownload label {\n      display: inline-block;\n    }\n    #settings_directDownload :-webkit-any(label, input) {\n      cursor: pointer;\n    }\n    #settings_directDownload br + br {\n      content: \"\";\n      display: block;\n      margin-top: 5px;\n    }\n  </style>\n  <button name=\"dldir\" type=\"button\" onclick=\"directDownload.chooseDirectory()\">${settings.dldir}</button>\n  <br><br>\n  <label><input name=\"autoopen\" type=\"checkbox\" ${(settings.autoopen ? "checked" : "")} onchange=\"directDownload.updateSettings()\"/>Open files after download.</label>\n  <label><input name=\"showinstead\" type=\"checkbox\" ${(settings.showinstead ? "checked" : "")} ${(settings.autoopen ? "" : "disabled")} onchange=\"directDownload.updateSettings()\"/>Show in folder instead.</label>\n  <br><br>\n  <label><input name=\"prompt\" type=\"checkbox\" ${(settings.prompt ? "checked" : "")} onchange=\"directDownload.updateSettings()\"/>Always ask where to save.</label>\n  <br><br>\n  <label><input name=\"imagemodals\" type=\"checkbox\" ${(settings.imagemodals ? "checked" : "")} onchange=\"directDownload.updateSettings()\"/>Allow direct download for image modals.</label>\n  <label><input name=\"copyimages\" type=\"checkbox\" ${(settings.copyimages ? "checked" : "")} ${(settings.imagemodals ? "" : "disabled")} onchange=\"directDownload.updateSettings()\"/>Copy the image to clipboard when download is done.</label>\n</div>`;
    }

    static chooseDirectory(cb) {
      return dialog.showOpenDialog(bw, {
        defaulPath: settings.dldir,
        buttonLabel: "Choose",
        properties: ["openDirectory", "showHiddenFiles", "createDirectory", "promptToCreate", "noResolveAliases", "treatPackageAsDirectory"]
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

  };

  installCss = function() {
    var style;
    style = document.createElement("style");
    style.id = "css_directDownload";
    style.innerHTML = Download.css;
    document.head.appendChild(style);
  };

  installDownloadBar = function() {
    var div, style;
    div = document.createElement("div");
    div.id = "files_directDownload";
    style = document.createElement("style");
    div.appendChild(style);
    (document.querySelector(".app .layers .layer section")).appendChild(div);
  };

  fs = require("fs");

  https = require("https");

  path = require("path");

  ({clipboard, nativeImage, remote} = require("electron"));

  ({shell, dialog} = remote);

  bw = remote.BrowserWindow.getAllWindows()[0];

  settings = {};

  listener = function(ev) {
    var base, elem, i, j, len, ref;
    if (settings.imagemodals && ev.target === document.querySelector(".callout-backdrop + div .modal-image img")) {
      if ((base = ev.target).inProcess == null) {
        base.inProcess = new Download(ev.target);
      }
      event.preventDefault();
      return false;
    }
    ref = ev.path;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      elem = ref[i];
      if (i < 3 && elem.className === "attachment" && ((elem.querySelector(".icon-file")) != null)) {
        if (elem.inProcess == null) {
          elem.inProcess = new Download(elem);
        }
        event.preventDefault();
        return false;
      }
      if (i === 2) {
        return;
      }
    }
  };

  getSettings = function() {
    var k, ref, ref1, v;
    settings = (ref = bdPluginStorage.get("directDownload", "settings")) != null ? ref : {};
    ref1 = {
      dldir: path.join(process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"], "downloads"),
      autoopen: false,
      showinstead: false,
      prompt: false,
      imagemodals: true
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
      constructor(att) {
        var a, buffer, bufpos, req, url;
        this.att = att;
        this.filename = this.filepath = "";
        this.filesize = bufpos = 0;
        buffer = this.elem = this.pb = null;
        this.started = this.finished = this.failed = false;
        this.openWhenFinished = settings.autoopen;
        this.showinstead = settings.showinstead;
        this.prompt = settings.prompt;
        this.copyWhenFinished = this.isImage = false;
        if (settings.imagemodals && this.att.nodeName === "IMG") {
          this.copyWhenFinished = settings.copyimages;
          this.isImage = true;
          url = (this.att.parentNode.querySelector("a")).href;
          this.filename = (url.split("/")).pop();
        } else {
          url = (a = this.att.querySelector("a")).href;
          this.filename = a.innerHTML;
        }
        if (!this.prompt) {
          this.filepath = path.join(settings.dldir, this.filename);
        }
        this.filesize = this.bufpos = 0;
        req = this.buffer = a = null;
        this.start();
        req = https.get(url, (res) => {
          if (200 !== res.statusCode) {
            this.fail();
            console.error(`Download failed for ${this.filename} with code ${res.statusCode}:\n${res.statusMessage}`);
            return;
          }
          this.filesize = 0 | res.headers["content-length"];
          this.buffer = Buffer.alloc(this.filesize);
          this.progress();
          res.on("data", (chunk) => {
            chunk.copy(this.buffer, this.bufpos);
            this.bufpos += Buffer.byteLength(chunk);
            this.progress();
          });
          return res.on("end", () => {
            if (this.filesize !== this.bufpos) {
              console.error(`Download failed for ${this.filename}: ${this.filesize}bytes announced, ${this.bufpos}bytes received!`);
              this.fail();
              return;
            }
            this.finish();
          });
        });
        req.on("error", (error) => {
          this.fail();
          console.error(error);
        });
        req.end();
      }

      start() {
        var span, svg;
        this.started = true;
        this.elem = document.createElement("div");
        this.elem.className = "file";
        this.elem.innerHTML = `<span>${this.filename}</span>\n<svg viewBox=\"0 0 26 26\">\n    <path d=\"M20 7.41L18.59 6 13 11.59 7.41 6 6 7.41 11.59 13 6 18.59 7.41 20 13 14.41 18.59 20 20 18.59 14.41 13 20 7.41z\"/>\n</svg>`;
        this.pb = document.createElement("div");
        this.pb.className = "progress-bar";
        this.elem.appendChild(this.pb);
        span = this.elem.querySelector("span");
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
          Download.updateFileWidth();
          event.preventDefault();
          return false;
        };
        (document.getElementById("files_directDownload")).appendChild(this.elem);
        Download.updateFileWidth();
      }

      progress() {
        this.pb.style = `width: calc((100% + 2px) * ${this.bufpos / this.filesize});`;
      }

      finish() {

        /* support for Zerebos' image to clipboard plugin */
        if (this.isImage) {
          this.att.dldone = this;
        }
        if (this.copyWhenFinished || this.zerebos) {
          clipboard.write({
            image: nativeImage.createFromBuffer(this.buffer)
          });
        }
        if (this.prompt && !this.filepath) {
          directDownload.chooseDirectory((dir) => {
            if (!dir) {
              this.fail();
              return;
            }
            this.filepath = path.join(dir, this.filename);
            this.finish();
          });
          return;
        }
        fs.writeFile(this.filepath, this.buffer, (error) => {
          delete this.att.inProcess;
          if (error) {
            this.fail();
            console.error(error);
            return;
          }
          this.elem.classList.remove("will-open");
          this.elem.classList.add("done");
          this.finished = true;
          console.log(`File saved to ${this.filepath}.`);
          if (this.openWhenFinished) {
            if (!this.showinstead) {
              this.open();
            } else {
              this.show();
            }
          }
        });
      }

      fail() {
        delete this.att.inProcess;
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
        numFiles = (document.querySelectorAll("#files_directDownload .file")).length;
        (document.querySelector("#files_directDownload style")).innerHTML = `#files_directDownload .file{max-width: calc((100% + 2px) / ${numFiles} - 2px);}`;
      }

    };

    Download.css = "#files_directDownload {\n  position: fixed;\n  bottom: 0;\n  left: 310px;\n  width: calc(100% - 310px - 240px);\n  height: 25px;\n  overflow: hidden;\n  font-size: 0;\n}\n.bd-minimal #files_directDownload {\n  left: 275px;\n  width: calc(100% - 275px - 185px);\n}\n#files_directDownload .file {\n  height: 100%;\n  width: 200px;\n  min-width: 50px;\n  background: rgba(128,128,128,0.2);\n  display: inline-block;\n  margin-left: 2px;\n  box-shadow: inset 0 0 10px rgba(0,0,0,0.3);\n  border: 1px solid rgba(128,128,128,0.2);\n  border-bottom: none;\n  box-sizing: border-box;\n  position: relative;\n  cursor: pointer;\n}\n#files_directDownload .file:first-of-type {\n  border-top-left-radius: 4px;\n  margin: 0;\n}\n#files_directDownload .file:last-of-type {\n  border-top-right-radius: 4px;\n}\n#files_directDownload .file.done {\n  box-shadow: none;\n}\n#files_directDownload .file.will-open {\n  background: rgba(128,128,128,0.4);\n}\n#files_directDownload span {\n  width: calc(100% + 2px);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: #87909C;\n  /*display: inline-block;*/\n  position: absolute;\n  left: -1px;\n  top: -1px;\n  font-size: 14px;\n  line-height: 23px;\n  padding: 0 18px 0 4px;\n  box-sizing: border-box;\n}\n#files_directDownload .file .progress-bar {\n  position:absolute;\n  height: 2px;\n  bottom: 0;\n  left: -1px;\n  background: rgb(32,196,64);\n}\n#files_directDownload .file.failed .progress-bar {\n  background: rgb(196,64,32);\n  min-width: calc(100% + 2px);\n}\n#files_directDownload .file svg {\n  fill: rgba(0,0,0,0.5);\n  position: absolute;\n  top: -1px;\n  right: -1px;\n  height: 23px;\n  width: 23px;\n}\n\n.attachment {\n  cursor: pointer;\n}";

    return Download;

  })();

  return directDownload;

})();

window.directDownload = directDownload;
