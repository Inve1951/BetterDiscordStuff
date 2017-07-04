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
      return "0.0.3";
    }

    getAuthor() {
      return "square";
    }

    start() {
      return document.body.addEventListener("keydown", listener);
    }

    stop() {
      return document.body.removeEventListener("keydown", listener);
    }

    load() {}

    getSettingsPanel() {
      var alt, ctrl, hotkey, keycode, plugin, ref, ref1, settings, settingsPanel, shift, theme;
      settings = getSettings();
      settingsPanel = "";
      settingsPanel += `<label><input name=\"cancelDefault\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\"${(settings.cancelDefault ? " checked" : void 0)}>cancelDefault (not working atm)</label><br>Numpad doesn't work with Shift key.`;
      settingsPanel += "<div id=\"tys-plugin-hotkeys\">Plugins:";
      for (plugin in bdplugins) {
        ({hotkey, ctrl, shift, alt, keycode} = (ref = settings.plugins[plugin]) != null ? ref : {
          hotkey: "",
          ctrl: false,
          shift: false,
          alt: false,
          keycode: ""
        });
        settingsPanel += `<div id=\"tys-${plugin}\">${plugin}<br>\n  <input name=\"hotkey\" type=\"text\" placeholder=\"Hotkey\" onkeydown=\"if('Shift'!==event.key && 'Control'!==event.key && 'Alt'!==event.key){this.value = event.code; this.parentNode.children[5].value = event.keyCode; toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0]);} event.preventDefault(); return false;\" value=\"${hotkey}\"></input>\n  <label><input name=\"ctrl\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\"${(ctrl ? " checked" : void 0)}>Ctrl</label>\n  <label><input name=\"shift\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\"${(shift ? " checked" : void 0)}>Shift</label>\n  <label><input name=\"alt\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\"${(alt ? " checked" : void 0)}>Alt</label>\n  <input name=\"keycode\" type=\"hidden\" value=\"${keycode}\">\n  <button type=\"button\" onclick=\"this.parentNode.children[1].value = ''; toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\">Clear</button>\n</div>`;
      }
      settingsPanel += "</div>";
      settingsPanel += "<div id=\"tys-theme-hotkeys\">Themes:";
      for (theme in bdthemes) {
        ({hotkey, ctrl, shift, alt, keycode} = (ref1 = settings.themes[theme]) != null ? ref1 : {
          hotkey: "",
          ctrl: false,
          shift: false,
          alt: false,
          keycode: ""
        });
        settingsPanel += `<div id=\"tys-${theme}\">${theme}<br>\n  <input name=\"hotkey\" type=\"text\" placeholder=\"Hotkey\" onkeydown=\"if('Shift'!==event.key && 'Control'!==event.key && 'Alt'!==event.key){this.value = event.code; this.parentNode.children[5].value = event.keyCode; toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0]);} event.preventDefault(); return false;\" value=\"${hotkey}\"></input>\n  <label><input name=\"ctrl\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\"${(ctrl ? " checked" : void 0)}>Ctrl</label>\n  <label><input name=\"shift\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\"${(shift ? " checked" : void 0)}>Shift</label>\n  <label><input name=\"alt\" type=\"checkbox\" onchange=\"toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\"${(alt ? " checked" : void 0)}>Alt</label>\n  <input name=\"keycode\" type=\"hidden\" value=\"${keycode}\">\n  <button type=\"button\" onclick=\"this.parentNode.children[1].value = ''; toggleYourStuff.updateSettings($(this).closest('div[data-reactid]')[0])\">Clear</button>\n</div>`;
      }
      return settingsPanel += "</div>";
    }

    static updateSettings(html) {
      var alt, ctrl, hotkey, i, id, j, keycode, len, len1, plugin, ref, ref1, settings, shift, theme;
      settings = {
        plugins: {},
        themes: {}
      };
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
        alt = plugin.querySelector("input[name=\"alt\"]").checked;
        keycode = 0 | plugin.querySelector("input[name=\"keycode\"]").value;
        settings.plugins[id] = {hotkey, ctrl, shift, alt, keycode};
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
        alt = theme.querySelector("input[name=\"alt\"]").checked;
        keycode = 0 | theme.querySelector("input[name=\"keycode\"]").value;
        settings.themes[id] = {hotkey, ctrl, shift, alt, keycode};
      }
      settings.cancelDefault = html.querySelector("input[name=\"cancelDefault\"]").checked;
      return bdPluginStorage.set("toggleYourStuff", "settings", settings);
    }

  };

  listener = function(ev) {
    var alt, css, ctrl, enabled, evalt, evctrl, evkeycode, evshift, handled, k, keycode, n, name, plugin, ref, ref1, settings, shift;
    evkeycode = ev.keyCode;
    evctrl = ev.ctrlKey;
    evshift = ev.shiftKey;
    evalt = ev.altKey;
    handled = false;
    settings = getSettings();
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
      handled = true;
    }
    ref1 = settings.themes;
    for (k in ref1) {
      ({keycode, ctrl, shift, alt} = ref1[k]);
      if (!((bdthemes[k] != null) && keycode === evkeycode && ctrl === evctrl && shift === evshift && evalt === alt)) {
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
      handled = true;
    }
    if (handled && settings.cancelDefault) {
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
