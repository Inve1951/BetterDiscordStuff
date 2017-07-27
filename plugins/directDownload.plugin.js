//META{"name":"directDownload"}*//;
var directDownload;

directDownload = (function() {
  var download, fs, getSettings, https, installListener, installObserver, obs, path, settings;

  class directDownload {
    getName() {
      return "Direct-Download";
    }

    getDescription() {
      return "Download attached files directly within discord.";
    }

    getAuthor() {
      return "square";
    }

    getVersion() {
      return "0.0.1-alpha";
    }

    start() {
      getSettings();
      installObserver();
    }

    onSwitch() {
      installObserver();
    }

    stop() {
      var i, len, ref, x;
      if (typeof obs !== "undefined" && obs !== null) {
        obs.disconnect();
      }
      ref = document.querySelectorAll(".messages .attachment > .icon-file");
      for (i = 0, len = ref.length; i < len; i++) {
        x = ref[i];
        (x = x.parentNode).removeEventListener("click", x.dl);
      }
    }

    load() {}

    getSettingsPanel() {
      getSettings();
      return `<div id=\"settings_directDownload\" style=\"color:#87909C\">\n  <span style=\"display:block;-webkit-user-select:text;height:1.2em\">Last selected: ${settings.dldir}</span>\n  <input name=\"dldir\" type=\"file\" style=\"width:100%\" webkitdirectory onchange=\"directDownload.updateSettings()\"></input>\n</div>`;
    }

    static updateSettings() {
      var i, input, len, name, ref, ref1, type, value;
      ref = document.querySelectorAll("#settings_directDownload input");
      for (i = 0, len = ref.length; i < len; i++) {
        input = ref[i];
        ({name, type, value} = input);
        if (type === "file") {
          value = (ref1 = input.files[0]) != null ? ref1.path : void 0;
        }
        if (value && (function() {
          switch (name) {
            case "dldir":
              return (path.isAbsolute(value)) && fs.existsSync(value);
          }
        })()) {
          settings[name] = value;
          input.style = "";
        } else {
          input.style = "background: rgba(200,0,0,.5);";
        }
      }
      bdPluginStorage.set("directDownload", "settings", settings);
    }

  };

  fs = require("fs");

  https = require("https");

  path = require("path");

  settings = {};

  obs = null;

  installListener = function(elem) {
    var elems, i, len, x;
    elems = elem != null ? [elem] : (function() {
      var i, len, ref, results;
      ref = document.querySelectorAll(".messages .attachment > .icon-file");
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        x = ref[i];
        results.push(x.parentNode);
      }
      return results;
    })();
    for (i = 0, len = elems.length; i < len; i++) {
      elem = elems[i];
      if (elem.dl == null) {
        elem.addEventListener("click", download(elem));
      }
    }
  };

  installObserver = function() {
    var chat, chatWrapper;
    if (obs != null) {
      obs.disconnect();
    }
    chatWrapper = document.querySelector(".chat > .content > div:not(.channel-members-wrap)");
    chat = chatWrapper != null ? chatWrapper.querySelector(".messages-wrapper > .scroller-wrap > .messages") : void 0;
    if (chat != null) {
      (obs = function(mutations) {
        var addedNodes, i, icon, j, l, len, len1, len2, node, ref;
        for (i = 0, len = mutations.length; i < len; i++) {
          ({addedNodes} = mutations[i]);
          if (addedNodes.length == null) {
            addedNodes = [addedNodes];
          }
          for (j = 0, len1 = addedNodes.length; j < len1; j++) {
            node = addedNodes[j];
            ref = node.querySelectorAll(".attachment > .icon-file");
            for (l = 0, len2 = ref.length; l < len2; l++) {
              icon = ref[l];
              installListener(icon.parentNode);
            }
          }
        }
      })([
        {
          addedNodes: chat
        }
      ]);
      obs = new MutationObserver(obs);
      obs.observe(chat, {
        childList: true
      });
    }
  };

  download = function(elem) {
    return elem.dl = function(event) {
      var a, buffer, bufpos, filename, filepath, filesize, req, url;
      url = (a = elem.querySelector("a")).href;
      filename = a.innerHTML;
      filepath = path.join(settings.dldir, filename);
      filesize = bufpos = 0;
      req = buffer = a = null;
      req = https.get(url, function(res) {
        filesize = 0 | res.headers["content-length"];
        buffer = Buffer.alloc(filesize);
        res.on("data", function(chunk) {
          chunk.copy(buffer, bufpos);
          bufpos += Buffer.byteLength(chunk);
        });
        return res.on("end", function() {
          if (filesize !== bufpos) {
            console.log(`Download failed for ${filename}: ${filesize}bytes announced, ${bufpos}bytes received!`);
            return;
          }
          fs.writeFile(filepath, buffer, function(error) {
            if (error) {
              console.log(error);
              return;
            }
            return console.log(`File saved to ${filepath}.`);
          });
        });
      });
      req.on("error", function(error) {
        console.log(error);
      });
      req.end();
      event.preventDefault();
      return false;
    };
  };

  getSettings = function() {
    var k, ref, ref1, v;
    settings = (ref = bdPluginStorage.get("directDownload", "settings")) != null ? ref : {};
    ref1 = {
      dldir: path.join(process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"], "downloads")
    };
    for (k in ref1) {
      v = ref1[k];
      if (settings[k] == null) {
        settings[k] = v;
      }
    }
  };

  return directDownload;

})();

window.directDownload = directDownload;
