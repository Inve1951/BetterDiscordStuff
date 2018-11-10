#META { "name": "QuickDeleteMessages", "website": "https://inve1951.github.io/BetterDiscordStuff/" } *//

class global.QuickDeleteMessages
  getName: -> "Quick Delete Messages"
  getDescription: -> "Hold Delete and click a Message to delete it."
  getAuthor: -> "square"
  getVersion: -> "1.3.0"

  settings = Object.create null
  MessageDeleteItem = null
  AsyncKeystate = getOwnerInstance = null

  load: ->
    window.SuperSecretSquareStuff ?= new Promise (c, r) ->
      require("request").get "https://raw.githubusercontent.com/Inve1951/BetterDiscordStuff/master/plugins/0circle.plugin.js", (err, res, body) ->
        return r err ? res if err or 200 isnt res?.statusCode
        Object.defineProperties window.SuperSecretSquareStuff, {libLoaded: value: c; code: value: body}
        `(0,eval)(body)`

  start: ->
    {AsyncKeystate, getOwnerInstance} = await SuperSecretSquareStuff

    settings.confirm = bdPluginStorage.get("QuickDeleteMessages", "confirm") ? no
    MessageDeleteItem = BDV2.WebpackModules.find (m) -> m::?.handleDeleteMessage

    document.addEventListener "click", onClick, yes

  stop: ->
    document.removeEventListener "click", onClick, yes

  getSettingsPanel: ->
    """<label style="color: #87909C"><input type="checkbox" name="confirm" onChange="QuickDeleteMessages.updateSettings(this)"
    #{settings.confirm and "checked" or ""} />confirm delete?</label>"""

  @updateSettings: ({name, checked}) ->
    settings[name] = checked
    bdPluginStorage.set "QuickDeleteMessages", name, checked
    return

  qualifies = ".content-3dzVd8"

  onClick = (event) ->
    return unless AsyncKeystate.key("Delete") or
      "darwin" is process.platform and AsyncKeystate.key "Backspace"

    {path: [element]} = event

    if element.matches(qualifies) or element = element.closest qualifies
      element = element.closest ".message-1PNnaP"
    else return

    try
      handler = new MessageDeleteItem getOwnerInstance(element).props
      return unless handler.render()
    catch then return

    handler.handleDeleteMessage shiftKey: not settings.confirm or event.shiftKey

    event.preventDefault()
    event.stopImmediatePropagation()
    return
