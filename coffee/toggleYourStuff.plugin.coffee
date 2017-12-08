
`//META{"name":"toggleYourStuff"}*//`


class toggleYourStuff
  getName: ->         "Toggle-Your-Stuff"
  getDescription: ->  "Toggle your plugins and themes using hotkeys."
  getVersion: ->      "1.1.1"
  getAuthor: ->       "square"

  start: ->
    do getSettings
    document.body.addEventListener "keydown", listener, true

  stop: ->
    document.body.removeEventListener "keydown", listener, true

  load: ->

  getSettingsPanel: ->
    do getSettings
    headerstyle = "text-transform:" + (switch 0 | 4 * Math.random()
      when 0 then "none"
      when 1 then "capitalize"
      when 2 then "uppercase"
      when 3 then "lowercase") + ";filter:drop-shadow(0 0 30px rgb(" + (0|256*Math.random() for x in [0...3]).join(",") + "));"
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
    settingsPanel += """<span style="#{headerstyle}">tOgGLe-yOuR-sTufF</span>"""
    settingsPanel += """<label><input name="cancelDefault" type="checkbox" onchange="toggleYourStuff.updateSettings()"#{if settings.cancelDefault then " checked" else ""}>Cancel default. Prevents any actions which use the same hotkey. (don't kill your ctrl+comma)</label><br><br>"""
    settingsPanel += """<label><input name="dontSave" type="checkbox" onchange="toggleYourStuff.updateSettings()"#{if settings.dontSave then " checked" else ""}>Don't have BD save enabled-state after toggling. This is wonky.</label><br><br>"""
    settingsPanel += """<span>Numpad doesn't work with Shift key.</span>""" +
    """<div id="tys-plugin-hotkeys"><h2>Plugins:</h2>"""
    for plugin of bdplugins
      {hotkey, ctrl, shift, alt, keycode} = (settings.plugins[plugin] ? hotkey: "", ctrl: false, shift: false, alt: false, keycode: "")
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
    for theme of bdthemes
      {hotkey, ctrl, shift, alt, keycode} = (settings.themes[theme] ? hotkey: "", ctrl: false, shift: false, alt: false, keycode: "")
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
    evkeycode = ev.keyCode
    evctrl = ev.ctrlKey
    evshift = ev.shiftKey
    evalt = ev.altKey
    handledP = handledT = false

    for k, {keycode, ctrl, shift, alt} of settings.plugins when bdplugins[k]? and keycode is evkeycode and ctrl is evctrl and shift is evshift and evalt is alt
      {plugin} = bdplugins[k]
      if enabled = pluginCookie[k]
        try plugin.stop()
      else
        try plugin.start()
      pluginCookie[k] = !enabled
      handledP = true

    for k, {keycode, ctrl, shift, alt} of settings.themes when bdthemes[k]? and keycode is evkeycode and ctrl is evctrl and shift is evshift and evalt is alt
      {name, css} = bdthemes[k]
      if enabled = themeCookie[k]
        document.getElementById("#{k}")?.remove()
      else
        n = document.createElement "style"
        n.id = name
        n.innerHTML = unescape css
        document.head.appendChild n
      themeCookie[k] = !enabled
      handledT = true

    if !settings.dontSave
      do pluginModule.savePluginData if handledP
      do themeModule.saveThemeData if handledT

    if (handledP or handledT) and settings.cancelDefault
      ev.preventDefault()
      ev.stopImmediatePropagation()
      return false
    return

  settings = {}

  getSettings = ->
    settings = (bdPluginStorage.get "toggleYourStuff", "settings") ? {}
    settings[k] ?= v for k, v of {
      cancelDefault: false
      dontSave: false
      plugins: {}
      themes: {}
    }
    return

  @updateSettings: () ->
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
    settings.dontSave = html.querySelector("""input[name="dontSave"]""").checked

    settings._note = "The plugin uses the keycodes for detecting a match. The hotkeys are for display in settings only."
    bdPluginStorage.set "toggleYourStuff", "settings", settings


window.toggleYourStuff = toggleYourStuff
