//META{"name":"toggleYourStuff"}*//;
var toggleYourStuff;

toggleYourStuff = (function() {
  var getSettings, listener;

  class toggleYourStuff {
    getName() {
      return "Toggle-Your-Stuff";
    }

    getDescription() {
      return "Toggle your plugins and themes using hotkeys.";
    }

    getVersion() {
      return "0.0.1";
    }

    getAuthor() {
      return "square";
    }

    start() {
      return document.addEventListener("keydown", listener);
    }

    stop() {
      return document.removeEventListener("keydown", listener);
    }

    load() {}

    getSettingsPanel() {
      var ctrl, hotkey, plugin, ref, ref1, settings, settingsPanel, shift, theme;
      settings = getSettings();
      settingsPanel = "";
      settingsPanel += "<label><input name=\"cancelDefault\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\">cancelDefault</label>";
      settingsPanel += "<div id=\"tys-plugin-hotkeys\">Plugins:";
      for (plugin in bdplugins) {
        ({hotkey, ctrl, shift} = (ref = settings.plugins[plugin]) != null ? ref : {
          hotkey: "",
          ctrl: false,
          shift: false
        });
        settingsPanel += `<div id=\"tys-${plugin}\">${plugin}<br>\n  <input name=\"hotkey\" type=\"text\" placeholder=\"Hotkey\" onkeydown=\"this.value = event.key; toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0]); event.preventDefault(); return false;\" value=\"${hotkey}\"></input>\n  <label><input name=\"ctrl\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\"${(ctrl ? " checked" : void 0)}>Ctrl</label>\n  <label><input name=\"shift\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\"${(shift ? " checked" : void 0)}>Shift</label>\n  <button type=\"button\" onclick=\"this.parentNode.children[1].value = ''; toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\">Clear</button>\n</div>`;
      }
      settingsPanel += "</div>";
      settingsPanel += "<div id=\"tys-theme-hotkeys\">Themes:";
      for (theme in bdthemes) {
        ({hotkey, ctrl, shift} = (ref1 = settings.themes[theme]) != null ? ref1 : {
          hotkey: "",
          ctrl: false,
          shift: false
        });
        settingsPanel += `<div id=\"tys-${theme}\">${theme}<br>\n  <input name=\"hotkey\" type=\"text\" placeholder=\"Hotkey\" onkeydown=\"this.value = event.key; toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0]); event.preventDefault(); return false;\" value=\"${hotkey}\"></input>\n  <label><input name=\"ctrl\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\"${(ctrl ? " checked" : void 0)}>Ctrl</label>\n  <label><input name=\"shift\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\"${(shift ? " checked" : void 0)}>Shift</label>\n  <button type=\"button\" onclick=\"this.parentNode.children[1].value = ''; toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\">Clear</button>\n</div>`;
      }
      return settingsPanel += "</div>";
    }

    static updateSettings(html) {
      var ctrl, hotkey, i, id, j, len, len1, plugin, ref, ref1, settings, shift, theme;
      settings = getSettings();
      ref = html.querySelector("#tys-plugin-hotkeys").children;
      for (i = 0, len = ref.length; i < len; i++) {
        plugin = ref[i];
        id = plugin.id.slice(4);
        hotkey = plugin.querySelector("input[name=\"hotkey\"]").value;
        if ("" === hotkey) {
          delete settings.plugins[id];
          continue;
        }
        ctrl = plugin.querySelector("input[name=\"ctrl\"]").checked;
        shift = plugin.querySelector("input[name=\"shift\"]").checked;
        settings.plugins[id] = {hotkey, ctrl, shift};
      }
      ref1 = html.querySelector("#tys-theme-hotkeys").children;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        theme = ref1[j];
        id = theme.id.slice(4);
        hotkey = theme.querySelector("input[name=\"hotkey\"]").value;
        if ("" === hotkey) {
          delete settings.plugins[id];
          continue;
        }
        ctrl = theme.querySelector("input[name=\"ctrl\"]").checked;
        shift = theme.querySelector("input[name=\"shift\"]").checked;
        settings.themes[id] = {hotkey, ctrl, shift};
      }
      settings.cancelDefault = html.querySelector("input[name=\"cancelDefault\"]").checked;
      return bdPluginStorage.set("toggleYourStuff", "settings", settings);
    }

  };

  listener = function(ev) {
    var css, ctrl, enabled, evctrl, evkey, evshift, hotkey, k, n, name, plugin, ref, ref1, settings, shift;
    evkey = ev.key;
    evctrl = ev.ctrlKey;
    evshift = ev.shiftKey;
    settings = getSettings();
    ref = settings.plugins;
    for (k in ref) {
      ({hotkey, ctrl, shift} = ref[k]);
      if (!((bdplugins[k] != null) && hotkey === evkey && ctrl === evctrl && shift === evshift)) {
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
    }
    ref1 = settings.themes;
    for (k in ref1) {
      ({hotkey, ctrl, shift} = ref1[k]);
      if (!((bdthemes[k] != null) && hotkey === evkey && ctrl === evctrl && shift === evshift)) {
        continue;
      }
      ({name, css} = bdthemes[k]);
      if (enabled = themeCookie[k]) {
        $(`#${k}`).remove();
      } else {
        n = document.createElement("style");
        n.id = name;
        n.innerHTML = unescape(css);
        document.head.appendChild(n);
      }
      themeCookie[k] = !enabled;
    }
    if (settings.cancelDefault) {
      ev.preventDefault();
      return false;
    }
  };

  getSettings = function() {
    var settings;
    settings = bdPluginStorage.get("toggleYourStuff", "settings");
    if (settings == null) {
      settings = {
        cancelDefault: false,
        plugins: {},
        themes: {}
      };
    }
    return settings;
  };

  return toggleYourStuff;

})();

(typeof window !== "undefined" && window !== null ? window : global).toggleYourStuff = toggleYourStuff;
