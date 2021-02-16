//META{ "name": "toggleYourStuff", "website": "https://inve1951.github.io/BetterDiscordStuff/" }*//
global.toggleYourStuff = function () {
  var Plugins, Themes, listener, readSettings, settings;

  class toggleYourStuff {
    getName() {
      return "Toggle-Your-Stuff";
    }

    getDescription() {
      return "Toggle your plugins and themes using hotkeys.";
    }

    getVersion() {
      return "1.2.1";
    }

    getAuthor() {
      return "square";
    }

    start() {
      ({
        Plugins,
        Themes
      } = BdApi);
      readSettings();
      return document.body.addEventListener("keydown", listener, true);
    }

    stop() {
      return document.body.removeEventListener("keydown", listener, true);
    }

    getSettingsPanel() {
      var alt, ctrl, hotkey, j, keycode, l, len, len1, plugin, ref, ref1, ref2, ref3, ref4, settingsPanel, shift, theme, x;
      readSettings();
      settingsPanel = `<div id="tys_settings">
  <style>
  #tys_settings :not(input):not(button) {
    color: #b0b6b9;
  }
  #tys_settings div {
    margin-top: 10px !important;
  }
  #tys_settings span:first-of-type {
    font-size: 2em;
    text-decoration: none;
    margin-top: -30px;
  }
  #tys_settings span {
    display: block;
    width: 90%;
    margin: 0 auto;
    text-align: center;
    text-decoration: underline;
    line-height: 5em;
  }
  #tys_settings h2 {
    font-size: 1.1em;
    font-weight: bold;
    text-decoration: underline;
  }
  #tys_settings [id] > :-webkit-any(input, label) {
    margin-top: 3px;
  }
  #tys_settings input:not([value=""]) {
    background: rgb(32,196,64);
  }
  #tys_settings > div {
    margin-bottom: 20px;
  }
  </style>`;
      settingsPanel += `<span style="text-transform:${"none capitalize uppercase lowercase".split(" ")[0 | 4 * Math.random()]};filter:drop-shadow(0 0 30px rgb(${function () {
        var j, results;
        results = [];

        for (x = j = 0; j < 3; x = ++j) {
          results.push(0 | 256 * Math.random());
        }

        return results;
      }().join(",")}));">tOgGLe-yOuR-sTufF</span>`;
      settingsPanel += `<label><input name="cancelDefault" type="checkbox" onchange="toggleYourStuff.updateSettings()"${settings.cancelDefault ? " checked" : ""}>Cancel default. Prevents any actions which use the same hotkey. (don't kill your ctrl+comma)</label><br><br>`;
      settingsPanel += `<span>Numpad doesn't work with Shift key.</span>` + `<div id="tys-plugin-hotkeys"><h2>Plugins:</h2>`;
      ref = Plugins.getAll();

      for (j = 0, len = ref.length; j < len; j++) {
        plugin = ref[j];

        if (!(plugin = (ref1 = typeof plugin.getName === "function" ? plugin.getName() : void 0) != null ? ref1 : plugin.name)) {
          continue;
        }

        ({
          hotkey,
          ctrl,
          shift,
          alt,
          keycode
        } = (ref2 = settings.plugins[plugin]) != null ? ref2 : {
          hotkey: "",
          ctrl: false,
          shift: false,
          alt: false,
          keycode: ""
        });
        settingsPanel += `<div id="tys-${plugin}">${plugin}<br>
  <input name="hotkey" type="text" placeholder="Hotkey" onkeydown="if('Shift'!==event.key && 'Control'!==event.key && 'Alt'!==event.key){this.value = event.code; this.parentNode.children[5].value = event.keyCode; toggleYourStuff.updateSettings();} event.preventDefault(); event.stopImmediatePropagation(); return false;" value="${hotkey}"></input>
  <label><input name="ctrl" type="checkbox" onchange="toggleYourStuff.updateSettings()"${ctrl ? " checked" : ""}>Ctrl</label>
  <label><input name="shift" type="checkbox" onchange="toggleYourStuff.updateSettings()"${shift ? " checked" : ""}>Shift</label>
  <label><input name="alt" type="checkbox" onchange="toggleYourStuff.updateSettings()"${alt ? " checked" : ""}>Alt</label>
  <input name="keycode" type="hidden" value="${keycode}">
  <button type="button" onclick="this.parentNode.children[1].value = ''; toggleYourStuff.updateSettings()">Clear</button>
</div>`;
      }

      settingsPanel += `</div>` + `<div id="tys-theme-hotkeys"><h2>Themes:</h2>`;
      ref3 = Themes.getAll();

      for (l = 0, len1 = ref3.length; l < len1; l++) {
        theme = ref3[l];

        if (!(theme = theme.name)) {
          continue;
        }

        ({
          hotkey,
          ctrl,
          shift,
          alt,
          keycode
        } = (ref4 = settings.themes[theme]) != null ? ref4 : {
          hotkey: "",
          ctrl: false,
          shift: false,
          alt: false,
          keycode: ""
        });
        settingsPanel += `<div id="tys-${theme}">${theme}<br>
  <input name="hotkey" type="text" placeholder="Hotkey" onkeydown="if('Shift'!==event.key && 'Control'!==event.key && 'Alt'!==event.key){this.value = event.code; this.parentNode.children[5].value = event.keyCode; toggleYourStuff.updateSettings();} event.preventDefault(); event.stopImmediatePropagation(); return false;" value="${hotkey}"></input>
  <label><input name="ctrl" type="checkbox" onchange="toggleYourStuff.updateSettings()"${ctrl ? " checked" : ""}>Ctrl</label>
  <label><input name="shift" type="checkbox" onchange="toggleYourStuff.updateSettings()"${shift ? " checked" : ""}>Shift</label>
  <label><input name="alt" type="checkbox" onchange="toggleYourStuff.updateSettings()"${alt ? " checked" : ""}>Alt</label>
  <input name="keycode" type="hidden" value="${keycode}">
  <button type="button" onclick="this.parentNode.children[1].value = ''; toggleYourStuff.updateSettings()">Clear</button>
</div>`;
      }

      return settingsPanel += `</div>` + "</div>";
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

        if (!i) {
          continue;
        }

        id = plugin.id.slice(4);
        hotkey = plugin.querySelector(`input[name="hotkey"]`).value;

        if ("" === hotkey) {
          delete settings.plugins[id];
          continue;
        }

        ctrl = plugin.querySelector(`input[name="ctrl"]`).checked;
        shift = plugin.querySelector(`input[name="shift"]`).checked;
        alt = plugin.querySelector(`input[name="alt"]`).checked;
        keycode = 0 | plugin.querySelector(`input[name="keycode"]`).value;
        settings.plugins[id] = {
          hotkey,
          ctrl,
          shift,
          alt,
          keycode
        };
      }

      ref1 = html.querySelector("#tys-theme-hotkeys").children;

      for (i = l = 0, len1 = ref1.length; l < len1; i = ++l) {
        theme = ref1[i];

        if (!i) {
          continue;
        }

        id = theme.id.slice(4);
        hotkey = theme.querySelector(`input[name="hotkey"]`).value;

        if ("" === hotkey) {
          delete settings.plugins[id];
          continue;
        }

        ctrl = theme.querySelector(`input[name="ctrl"]`).checked;
        shift = theme.querySelector(`input[name="shift"]`).checked;
        alt = theme.querySelector(`input[name="alt"]`).checked;
        keycode = 0 | theme.querySelector(`input[name="keycode"]`).value;
        settings.themes[id] = {
          hotkey,
          ctrl,
          shift,
          alt,
          keycode
        };
      }

      settings.cancelDefault = html.querySelector(`input[name="cancelDefault"]`).checked;
      settings._note = "The plugin uses the keycodes for detecting a match. The hotkeys are for display in settings only.";
      return BdApi.setData("toggleYourStuff", "settings", settings);
    }

  }

  ;
  Plugins = Themes = null;

  listener = function (ev) {
    var alt, ctrl, handled, keycode, modifiers, plugin, ref, ref1, shift, theme;
    modifiers = [ev.keyCode, ev.ctrlKey, ev.shiftKey, ev.altKey];
    handled = false;
    ref = settings.plugins;

    for (plugin in ref) {
      ({
        keycode,
        ctrl,
        shift,
        alt
      } = ref[plugin]);

      if (!(Plugins.get(plugin) != null && [keycode, ctrl, shift, alt].every(function (x, i) {
        return x === modifiers[i];
      }))) {
        continue;
      }

      Plugins.toggle(plugin);
      handled = true;
    }

    ref1 = settings.themes;

    for (theme in ref1) {
      ({
        keycode,
        ctrl,
        shift,
        alt
      } = ref1[theme]);

      if (!(Themes.get(theme) != null && [keycode, ctrl, shift, alt].every(function (x, i) {
        return x === modifiers[i];
      }))) {
        continue;
      }

      Themes.toggle(theme);
      handled = true;
    }

    if (handled && settings.cancelDefault) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      return false;
    }
  };

  settings = null;

  readSettings = function () {
    var k, ref, ref1, v;
    settings = (ref = BdApi.getData("toggleYourStuff", "settings")) != null ? ref : {};
    ref1 = {
      cancelDefault: false,
      plugins: {},
      themes: {}
    };

    for (k in ref1) {
      v = ref1[k];

      if (settings[k] == null) {
        settings[k] = v;
      }
    }
  };

  return toggleYourStuff;
}.call(this);
