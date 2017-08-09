//META{"name":"toggleYourStuff"}*//;
var toggleYourStuff;

toggleYourStuff = (function() {
  var getSettings, listener, settings;

  class toggleYourStuff {
    getName() {
      return "Toggle-Your-Stuff";
    }

    getDescription() {
      return "Toggle your plugins and themes using hotkeys.";
    }

    getVersion() {
      return "1.1.0";
    }

    getAuthor() {
      return "square";
    }

    start() {
      getSettings();
      return document.body.addEventListener("keydown", listener, true);
    }

    stop() {
      return document.body.removeEventListener("keydown", listener, true);
    }

    load() {}

    getSettingsPanel() {
      var alt, ctrl, headerstyle, hotkey, keycode, plugin, ref, ref1, settingsPanel, shift, theme, x;
      getSettings();
      headerstyle = "text-transform:" + ((function() {
        switch (0 | 4 * Math.random()) {
          case 0:
            return "none";
          case 1:
            return "capitalize";
          case 2:
            return "uppercase";
          case 3:
            return "lowercase";
        }
      })()) + ";filter:drop-shadow(0 0 30px rgb(" + ((function() {
        var j, results;
        results = [];
        for (x = j = 0; j < 3; x = ++j) {
          results.push(0 | 256 * Math.random());
        }
        return results;
      })()).join(",") + "));";
      settingsPanel = "<div id=\"tys_settings\">\n  <style>\n  #tys_settings :not(input):not(button) {\n    color: #b0b6b9;\n  }\n  #tys_settings div {\n    margin-top: 10px !important;\n  }\n  #tys_settings span:first-of-type {\n    font-size: 2em;\n    text-decoration: none;\n    margin-top: -30px;\n  }\n  #tys_settings span {\n    display: block;\n    width: 90%;\n    margin: 0 auto;\n    text-align: center;\n    text-decoration: underline;\n    line-height: 5em;\n  }\n  #tys_settings h2 {\n    font-size: 1.1em;\n    font-weight: bold;\n    text-decoration: underline;\n  }\n  #tys_settings [id] > :-webkit-any(input, label) {\n    margin-top: 3px;\n  }\n  #tys_settings input:not([value=\"\"]) {\n    background: rgb(32,196,64);\n  }\n  #tys_settings > div {\n    margin-bottom: 20px;\n  }\n  </style>";
      settingsPanel += `<span style=\"${headerstyle}\">tOgGLe-yOuR-sTufF</span>`;
      settingsPanel += `<label><input name=\"cancelDefault\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings()\"${(settings.cancelDefault ? " checked" : "")}>Cancel default. Prevents any actions which use the same hotkey. (don't kill your ctrl+comma)</label><br><br>`;
      settingsPanel += `<label><input name=\"dontSave\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings()\"${(settings.dontSave ? " checked" : "")}>Don't have BD save enabled-state after toggling. This is wonky.</label><br><br>`;
      settingsPanel += "<span>Numpad doesn't work with Shift key.</span>" + "<div id=\"tys-plugin-hotkeys\"><h2>Plugins:</h2>";
      for (plugin in bdplugins) {
        ({hotkey, ctrl, shift, alt, keycode} = (ref = settings.plugins[plugin]) != null ? ref : {
          hotkey: "",
          ctrl: false,
          shift: false,
          alt: false,
          keycode: ""
        });
        settingsPanel += `<div id=\"tys-${plugin}\">${plugin}<br>\n  <input name=\"hotkey\" type=\"text\" placeholder=\"Hotkey\" onkeydown=\"if('Shift'!==event.key && 'Control'!==event.key && 'Alt'!==event.key){this.value = event.code; this.parentNode.children[5].value = event.keyCode; toggleYourStuff.updateSettings();} event.preventDefault(); event.stopImmediatePropagation(); return false;\" value=\"${hotkey}\"></input>\n  <label><input name=\"ctrl\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings()\"${(ctrl ? " checked" : "")}>Ctrl</label>\n  <label><input name=\"shift\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings()\"${(shift ? " checked" : "")}>Shift</label>\n  <label><input name=\"alt\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings()\"${(alt ? " checked" : "")}>Alt</label>\n  <input name=\"keycode\" type=\"hidden\" value=\"${keycode}\">\n  <button type=\"button\" onclick=\"this.parentNode.children[1].value = ''; toggleYourStuff.updateSettings()\">Clear</button>\n</div>`;
      }
      settingsPanel += "</div>" + "<div id=\"tys-theme-hotkeys\"><h2>Themes:</h2>";
      for (theme in bdthemes) {
        ({hotkey, ctrl, shift, alt, keycode} = (ref1 = settings.themes[theme]) != null ? ref1 : {
          hotkey: "",
          ctrl: false,
          shift: false,
          alt: false,
          keycode: ""
        });
        settingsPanel += `<div id=\"tys-${theme}\">${theme}<br>\n  <input name=\"hotkey\" type=\"text\" placeholder=\"Hotkey\" onkeydown=\"if('Shift'!==event.key && 'Control'!==event.key && 'Alt'!==event.key){this.value = event.code; this.parentNode.children[5].value = event.keyCode; toggleYourStuff.updateSettings();} event.preventDefault(); event.stopImmediatePropagation(); return false;\" value=\"${hotkey}\"></input>\n  <label><input name=\"ctrl\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings()\"${(ctrl ? " checked" : "")}>Ctrl</label>\n  <label><input name=\"shift\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings()\"${(shift ? " checked" : "")}>Shift</label>\n  <label><input name=\"alt\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings()\"${(alt ? " checked" : "")}>Alt</label>\n  <input name=\"keycode\" type=\"hidden\" value=\"${keycode}\">\n  <button type=\"button\" onclick=\"this.parentNode.children[1].value = ''; toggleYourStuff.updateSettings()\">Clear</button>\n</div>`;
      }
      return settingsPanel += "</div>" + "</div>";
    }

    static updateSettings() {
      var alt, ctrl, hotkey, html, i, id, j, keycode, l, len, len1, plugin, ref, ref1, shift, theme;
      html = document.getElementById("tys_settings");
      settings = {
        plugins: {},
        themes: {}
      };
      ref = html.querySelector("#tys-plugin-hotkeys").children;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        plugin = ref[i];
        if (!(i)) {
          continue;
        }
        id = plugin.id.slice(4);
        hotkey = plugin.querySelector("input[name=\"hotkey\"]").value;
        if ("" === hotkey) {
          delete settings.plugins[id];
          continue;
        }
        ctrl = plugin.querySelector("input[name=\"ctrl\"]").checked;
        shift = plugin.querySelector("input[name=\"shift\"]").checked;
        alt = plugin.querySelector("input[name=\"alt\"]").checked;
        keycode = 0 | plugin.querySelector("input[name=\"keycode\"]").value;
        settings.plugins[id] = {hotkey, ctrl, shift, alt, keycode};
      }
      ref1 = html.querySelector("#tys-theme-hotkeys").children;
      for (i = l = 0, len1 = ref1.length; l < len1; i = ++l) {
        theme = ref1[i];
        if (!(i)) {
          continue;
        }
        id = theme.id.slice(4);
        hotkey = theme.querySelector("input[name=\"hotkey\"]").value;
        if ("" === hotkey) {
          delete settings.plugins[id];
          continue;
        }
        ctrl = theme.querySelector("input[name=\"ctrl\"]").checked;
        shift = theme.querySelector("input[name=\"shift\"]").checked;
        alt = theme.querySelector("input[name=\"alt\"]").checked;
        keycode = 0 | theme.querySelector("input[name=\"keycode\"]").value;
        settings.themes[id] = {hotkey, ctrl, shift, alt, keycode};
      }
      settings.cancelDefault = html.querySelector("input[name=\"cancelDefault\"]").checked;
      settings.dontSave = html.querySelector("input[name=\"dontSave\"]").checked;
      settings._note = "The plugin uses the keycodes for detecting a match. The hotkeys are for display in settings only.";
      return bdPluginStorage.set("toggleYourStuff", "settings", settings);
    }

  };

  listener = function(ev) {
    var alt, css, ctrl, enabled, evalt, evctrl, evkeycode, evshift, handledP, handledT, k, keycode, n, name, plugin, ref, ref1, ref2, shift;
    evkeycode = ev.keyCode;
    evctrl = ev.ctrlKey;
    evshift = ev.shiftKey;
    evalt = ev.altKey;
    handledP = handledT = false;
    ref = settings.plugins;
    for (k in ref) {
      ({keycode, ctrl, shift, alt} = ref[k]);
      if (!((bdplugins[k] != null) && keycode === evkeycode && ctrl === evctrl && shift === evshift && evalt === alt)) {
        continue;
      }
      ({plugin} = bdplugins[k]);
      if (enabled = pluginCookie[k]) {
        try {
          plugin.stop();
        } catch (error) {}
      } else {
        try {
          plugin.start();
        } catch (error) {}
      }
      pluginCookie[k] = !enabled;
      handledP = true;
    }
    ref1 = settings.themes;
    for (k in ref1) {
      ({keycode, ctrl, shift, alt} = ref1[k]);
      if (!((bdthemes[k] != null) && keycode === evkeycode && ctrl === evctrl && shift === evshift && evalt === alt)) {
        continue;
      }
      ({name, css} = bdthemes[k]);
      if (enabled = themeCookie[k]) {
        if ((ref2 = document.getElementById(`${k}`)) != null) {
          ref2.remove();
        }
      } else {
        n = document.createElement("style");
        n.id = name;
        n.innerHTML = unescape(css);
        document.head.appendChild(n);
      }
      themeCookie[k] = !enabled;
      handledT = true;
    }
    if (!settings.dontSave) {
      if (handledP) {
        pluginModule.savePluginData();
      }
      if (handledT) {
        themeModule.saveThemeData();
      }
    }
    if ((handledP || handledT) && settings.cancelDefault) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      return false;
    }
  };

  settings = {};

  getSettings = function() {
    var k, ref, v;
    settings = bdPluginStorage.get("toggleYourStuff", "settings");
    ref = {
      cancelDefault: false,
      dontSave: false,
      plugins: {},
      themes: {}
    };
    for (k in ref) {
      v = ref[k];
      if (settings[k] == null) {
        settings[k] = v;
      }
    }
  };

  return toggleYourStuff;

})();

window.toggleYourStuff = toggleYourStuff;
