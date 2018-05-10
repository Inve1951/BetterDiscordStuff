//META { "name": "localFileServer" } *//
var localFileServer;

localFileServer = function () {
  var app, assertMainProcJsPatch, bw, dialog, favicon, findPatchRelaunch, fs, fs2, func, getSettings, https, i, isImage, len, onRequest, path, pfx, ref, remote, server, settings, shell, startServer, stopServer, url;

  class localFileServer {
    getName() {
      return "Local File Server";
    }

    getDescription() {
      return "Hosts a selected folder so you can use local files in your theme. Has to restart discord first time enabling.";
    }

    getAuthor() {
      return "square";
    }

    getVersion() {
      return "1.1.1";
    }

    load() {}

    start() {
      assertMainProcJsPatch();
      getSettings();
      startServer();
    }

    stop() {
      stopServer();
    }

    getSettingsPanel() {
      getSettings();
      return `<div id="settings_localFileServer">\n  <style>\n  #settings_localFileServer {\n    color: #87909C;\n  }\n  #settings_localFileServer button {\n    background: rgba(128,128,128,0.4);\n    width: calc(100% - 20px);\n    padding: 5px 10px;\n    box-sizing: content-box;\n    height: 1em;\n    font-size: 1em;\n    line-height: 0.1em;\n  }\n  #settings_localFileServer input {\n    text-align: center;\n    width: 63px;\n    border-width: 0;\n    outline-width: 0;\n  }\n  #settings_localFileServer .invalid {\n    background: rgba(255,0,0,.5);\n    font-weight: 500;\n  }\n  #settings_localFileServer * {\n    margin-bottom: 2px;\n  }\n  </style>\n  <button name="folder" ${fs.existsSync(settings.folder) ? "" : "class=\"invalid\" "}type="button" onclick="localFileServer.chooseDirectory()">${settings.folder}</button>\n  <button type="button" onclick="localFileServer.openInBrowser()">Open in browser.</button>\n  Port: <input name="port" type="number" value="${settings.port}" placeholder="...port..." oninput="localFileServer.updateSettings()" autocomplete="off" />\n  only accepts 443 and [10001-65535]\n</div>`;
    }

    static openInBrowser() {
      shell.openExternal(`https://localhost:${settings.port}/`);
    }

    static chooseDirectory() {
      dialog.showOpenDialog(bw, {
        defaultPath: settings.folder,
        buttonLabel: "Choose",
        properties: ["openDirectory", "showHiddenFiles", "createDirectory", "noResolveAliases", "treatPackageAsDirectory"]
      }, selection => {
        var ref;
        document.querySelector("#settings_localFileServer button").innerHTML = (ref = selection != null ? selection[0] : void 0) != null ? ref : "";
        return this.updateSettings();
      });
    }

    static updateSettings() {
      var i, input, len, name, oldPort, ref, type, value;
      oldPort = settings.port;
      ref = document.querySelectorAll("#settings_localFileServer :-webkit-any(input, button, checkbox)");
      for (i = 0, len = ref.length; i < len; i++) {
        input = ref[i];
        ({ name, type, value } = input);
        if (!name) {
          continue;
        }
        if (type === "button") {
          value = input.innerHTML;
        } else if (type === "checkbox") {
          value = input.checked;
        }
        if (function () {
          var ref1;
          switch (name) {
            case "folder":
              return value && path.isAbsolute(value) && fs.existsSync(value = path.normalize(value));
            case "port":
              return (/^[0-9]+$/.test(value) && (1e4 < (ref1 = value = 0 | value) && ref1 <= 0xFFFF || 443 === value)
              );
            default:
              return true;
          }
        }()) {
          settings[name] = value;
          input.className = "";
        } else {
          input.className = "invalid";
          if (name === "folder") {
            input.innerHTML = "invalid path";
          }
        }
      }
      bdPluginStorage.set("localFileServer", "settings", settings);
      if (oldPort !== settings.port) {
        stopServer();
        startServer();
      }
    }

  };

  fs = require("fs");

  path = require("path");

  https = require("https");

  url = require("url");

  ({ remote, shell } = require("electron"));

  ({ dialog, app } = remote);

  bw = remote.getCurrentWindow();

  settings = server = null;

  getSettings = function () {
    var k, ref, ref1, v;
    settings = (ref = bdPluginStorage.get("localFileServer", "settings")) != null ? ref : {};
    ref1 = {
      folder: path.join(process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"], "pictures"),
      port: 35724
    };
    for (k in ref1) {
      v = ref1[k];
      if (settings[k] == null) {
        settings[k] = v;
      }
    }
  };

  startServer = function () {
    var ref;
    if ((ref = remote.getGlobal("localFileServerMainProcObj")) != null) {
      ref.port = 443 === settings.port ? "" : `:${settings.port}`;
    }
    server = https.createServer({ pfx }, onRequest);
    server.on("error", function (e) {
      console.error(e);
    });
    server.timeout = 10e3;
    server.keepAliveTimeout = 0;
    server.listen(settings.port, "127.0.0.1");
  };

  stopServer = function () {
    var ref;
    if ((ref = remote.getGlobal("localFileServerMainProcObj")) != null) {
      ref.port = null;
    }
    server.close();
  };

  onRequest = function (req, res) {
    var _path;
    if (req.url.endsWith("/favicon.ico")) {
      res.writeHead(200);
      res.end(favicon);
      return;
    }
    _path = path.normalize(path.join(settings.folder, decodeURIComponent(url.parse(req.url).path)));
    if (_path[_path.length - 1] === path.sep) {
      _path = _path.slice(0, -1);
    }
    fs.lstat(_path, function (e, stats) {
      if (e != null) {
        res.writeHead(500, e.message);
        res.end();
        return console.error(e);
      }
      if (!stats.isDirectory()) {
        fs.readFile(_path, function (e, buffer) {
          if (e != null) {
            res.writeHead(500, e.message);
            res.end();
            return console.error(e);
          }
          res.writeHead(200);
          res.end(buffer);
        });
      } else {
        fs.readdir(_path, function (e, files) {
          var encoded, file, i, image, images, j, len, len1;
          if (e != null) {
            res.writeHead(500, e.message);
            res.end();
            return console.error(e);
          }
          res.writeHead(200, {
            "Content-Type": "text/html"
          });
          res.write(`<html><head><title>Local File Server</title><base href="${req.url[req.url.length - 1] === "/" ? req.url : req.url + "/"}" /><style>\n  a { float: left; margin: 5px; display: inline-block; }\n  br { clear: left; }\n  .image { width: 100%; max-width: 300px; height: 200px; background: #20242a 50%/contain no-repeat; border: solid 1px black; }\n</style></head><body>`);
          if (_path !== settings.folder) {
            files.unshift("..");
          }
          images = [];
          for (i = 0, len = files.length; i < len; i++) {
            file = files[i];
            if (isImage(file)) {
              images.push(file);
              continue;
            }
            res.write(`<a href="${encodeURIComponent(file)}">${file}</a>`);
          }
          res.write("<br/>");
          for (j = 0, len1 = images.length; j < len1; j++) {
            image = images[j];
            res.write(`<a href="${encoded = encodeURIComponent(image)}" class="image" style="background-image: url('${encoded}');" />`);
          }
          res.end("</body></html>");
        });
      }
    });
  };

  assertMainProcJsPatch = async function () {
    var _path, e, mainjs, split;
    try {
      split = "_electron = require('electron');";
      mainjs = "\r\n\r\n// localFileServer plugin start     #ref1#\nglobal.localFileServerMainProcObj={port:null};\n_electron.app.commandLine.appendSwitch(\"allow-insecure-localhost\");\n_electron.app.on(\"certificate-error\",(ev,x,url,y,z,cb)=>(new RegExp(`https://(localhost|127\\\\.0\\\\.0\\\\.1)${localFileServerMainProcObj.port}/`)).test(url)?(ev.preventDefault(),cb(!0)):cb(!1));\n// localFileServer plugin end\r\n";
      _path = path.join(remote.require(path.join(app.getAppPath(), "common/paths.js")).getUserDataVersioned(), "modules/discord_desktop_core/core/app/mainscreen.js");
      return await findPatchRelaunch(_path, split, mainjs);
    } catch (error) {
      e = error;
      console.error(e);
    }
    // 0.0.300 changes didn't make it to osx at time of writing
    split = "app.setVersion(discordVersion);";
    _path = path.join(app.getAppPath(), "index.js");
    mainjs = mainjs.split("_electron.").join("");
    try {
      await findPatchRelaunch(_path, split, mainjs);
    } catch (error) {
      e = error;
      console.error(e);
    }
  };

  findPatchRelaunch = async function (_path, split, mainjs) {
    var data, newData;
    data = await fs2.readFile(_path, "utf8");
    if (-1 !== data.indexOf(mainjs)) {
      return;
    }
    newData = data.split(split).join(`${split}${mainjs}`);
    if (data.length + mainjs.length !== newData.length) {
      throw "localFileServer needs fixing!";
    }
    await fs2.writeFile(_path, newData);
    app.relaunch();
    app.quit();
  };

  fs2 = {};

  ref = ["readFile", "writeFile"];
  for (i = 0, len = ref.length; i < len; i++) {
    func = ref[i];
    (function (func) {
      return fs2[func] = function (...args) {
        return new Promise(function (c, r) {
          return fs[func](...args, function (e, res) {
            if (e != null) {
              return r(e);
            } else {
              return c(res);
            }
          });
        });
      };
    })(func);
  }

  isImage = function (filename) {
    var ref1;
    return (ref1 = filename.slice(filename.lastIndexOf(".")).toLowerCase()) === ".png" || ref1 === ".jpeg" || ref1 === ".jpg" || ref1 === ".bmp" || ref1 === ".gif" || ref1 === ".webp" || ref1 === ".svg" || ref1 === ".tiff" || ref1 === ".apng";
  };

  favicon = Buffer.from("AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAMMOAADDDgAAEAAAABAAAAAAAAAAL2sUAEyxIgAXNgoA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASIiIiIiEAACEDIAIwEgAAIDIxEyMCAAAjIAAAAjIAACIQEREBIgAAIDAQAQMCAAAgMBABAwIAACIQEREBIgAAIyAAAAIyAAAgMjETIwIAACEDIAIwEgAAEiIiIiIhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "base64");

  pfx = Buffer.from("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", "base64");

  return localFileServer;
}.call(this);

global.localFileServer = localFileServer;