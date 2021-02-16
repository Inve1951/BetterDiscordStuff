#META{ "name": "toggleYourStuff", "website": "https://inve1951.github.io/BetterDiscordStuff/" }*//

class global.toggleYourStuff
  getName: ->         "Toggle-Your-Stuff"
  getDescription: ->  "Toggle your plugins and themes using hotkeys."
  getVersion: ->      "1.2.1"
  getAuthor: ->       "square"

  Plugins = Themes = null
  start: ->
    { Plugins, Themes } = BdApi
    readSettings()
    document.body.addEventListener "keydown", listener, yes

  stop: ->
    document.body.removeEventListener "keydown", listener, yes

  getSettingsPanel: ->
    readSettings()
    settingsPanel = """
      <div id="tys_settings">
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
        </style>
      """
    settingsPanel += """<span style="text-transform:#{"none capitalize uppercase lowercase".split(" ")[0 | 4 * Math.random()]};filter:drop-shadow(0 0 30px rgb(#{(0|256*Math.random() for x in [0...3]).join(",")}));">tOgGLe-yOuR-sTufF</span>"""
    settingsPanel += """<label><input name="cancelDefault" type="checkbox" onchange="toggleYourStuff.updateSettings()"#{if settings.cancelDefault then " checked" else ""}>Cancel default. Prevents any actions which use the same hotkey. (don't kill your ctrl+comma)</label><br><br>"""
    settingsPanel += """<span>Numpad doesn't work with Shift key.</span>""" +
    """<div id="tys-plugin-hotkeys"><h2>Plugins:</h2>"""
    for plugin in Plugins.getAll() when plugin = plugin.getName?() ? plugin.name
      { hotkey, ctrl, shift, alt, keycode } = settings.plugins[plugin] ? hotkey: "", ctrl: no, shift: no, alt: no, keycode: ""
      settingsPanel += """
        <div id="tys-#{plugin}">#{plugin}<br>
          <input name="hotkey" type="text" placeholder="Hotkey" onkeydown="if('Shift'!==event.key && 'Control'!==event.key && 'Alt'!==event.key){this.value = event.code; this.parentNode.children[5].value = event.keyCode; toggleYourStuff.updateSettings();} event.preventDefault(); event.stopImmediatePropagation(); return false;" value="#{hotkey}"></input>
          <label><input name="ctrl" type="checkbox" onchange="toggleYourStuff.updateSettings()"#{if ctrl then " checked" else ""}>Ctrl</label>
          <label><input name="shift" type="checkbox" onchange="toggleYourStuff.updateSettings()"#{if shift then " checked" else ""}>Shift</label>
          <label><input name="alt" type="checkbox" onchange="toggleYourStuff.updateSettings()"#{if alt then " checked" else ""}>Alt</label>
          <input name="keycode" type="hidden" value="#{keycode}">
          <button type="button" onclick="this.parentNode.children[1].value = ''; toggleYourStuff.updateSettings()">Clear</button>
        </div>
      """
    settingsPanel += """</div>""" +
    """<div id="tys-theme-hotkeys"><h2>Themes:</h2>"""
    for theme in Themes.getAll() when theme = theme.name
      { hotkey, ctrl, shift, alt, keycode } = settings.themes[theme] ? hotkey: "", ctrl: no, shift: no, alt: no, keycode: ""
      settingsPanel += """
        <div id="tys-#{theme}">#{theme}<br>
          <input name="hotkey" type="text" placeholder="Hotkey" onkeydown="if('Shift'!==event.key && 'Control'!==event.key && 'Alt'!==event.key){this.value = event.code; this.parentNode.children[5].value = event.keyCode; toggleYourStuff.updateSettings();} event.preventDefault(); event.stopImmediatePropagation(); return false;" value="#{hotkey}"></input>
          <label><input name="ctrl" type="checkbox" onchange="toggleYourStuff.updateSettings()"#{if ctrl then " checked" else ""}>Ctrl</label>
          <label><input name="shift" type="checkbox" onchange="toggleYourStuff.updateSettings()"#{if shift then " checked" else ""}>Shift</label>
          <label><input name="alt" type="checkbox" onchange="toggleYourStuff.updateSettings()"#{if alt then " checked" else ""}>Alt</label>
          <input name="keycode" type="hidden" value="#{keycode}">
          <button type="button" onclick="this.parentNode.children[1].value = ''; toggleYourStuff.updateSettings()">Clear</button>
        </div>
      """
    settingsPanel += """</div>""" +
    "</div>"

  listener = (ev) ->
    modifiers = [ev.keyCode, ev.ctrlKey, ev.shiftKey, ev.altKey]
    handled = no

    for plugin, {keycode, ctrl, shift, alt} of settings.plugins when Plugins.get(plugin)? and [keycode, ctrl, shift, alt].every (x, i) -> x is modifiers[i]
      Plugins.toggle plugin
      handled = yes

    for theme, {keycode, ctrl, shift, alt} of settings.themes when Themes.get(theme)? and [keycode, ctrl, shift, alt].every (x, i) -> x is modifiers[i]
      Themes.toggle theme
      handled = yes

    if handled and settings.cancelDefault
      ev.preventDefault()
      ev.stopImmediatePropagation()
      no

  settings = null

  readSettings = ->
    settings = (BdApi.getData "toggleYourStuff", "settings") ? {}
    settings[k] ?= v for k, v of {
      cancelDefault: no
      plugins: {}
      themes: {}
    }
    return

  @updateSettings: ->
    html = document.getElementById "tys_settings"
    settings = plugins: {}, themes: {}
    for plugin, i in html.querySelector("#tys-plugin-hotkeys").children when i
      id = plugin.id[4...]
      hotkey = plugin.querySelector("""input[name="hotkey"]""").value
      if "" is hotkey
        delete settings.plugins[id]
        continue
      ctrl = plugin.querySelector("""input[name="ctrl"]""").checked
      shift = plugin.querySelector("""input[name="shift"]""").checked
      alt = plugin.querySelector("""input[name="alt"]""").checked
      keycode = 0| plugin.querySelector("""input[name="keycode"]""").value

      settings.plugins[id] = {hotkey, ctrl, shift, alt, keycode}

    for theme, i in html.querySelector("#tys-theme-hotkeys").children when i
      id = theme.id[4...]
      hotkey = theme.querySelector("""input[name="hotkey"]""").value
      if "" is hotkey
        delete settings.plugins[id]
        continue
      ctrl = theme.querySelector("""input[name="ctrl"]""").checked
      shift = theme.querySelector("""input[name="shift"]""").checked
      alt = theme.querySelector("""input[name="alt"]""").checked
      keycode = 0| theme.querySelector("""input[name="keycode"]""").value

      settings.themes[id] = {hotkey, ctrl, shift, alt, keycode}

    settings.cancelDefault = html.querySelector("""input[name="cancelDefault"]""").checked

    settings._note = "The plugin uses the keycodes for detecting a match. The hotkeys are for display in settings only."
    BdApi.setData "toggleYourStuff", "settings", settings
