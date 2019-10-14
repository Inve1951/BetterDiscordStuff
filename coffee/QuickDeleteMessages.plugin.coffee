#META { "name": "QuickDeleteMessages", "website": "https://inve1951.github.io/BetterDiscordStuff/" } *//

class global.QuickDeleteMessages
  getName: -> "Quick Delete Messages"
  getDescription: -> "Hold Delete and click a Message to delete it."
  getAuthor: -> "square"
  getVersion: -> "1.4.1"

  settings = Object.create null
  Permissions = UserStore = EndpointMessages = MessagePrompts = null
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

    UserStore ?= BdApi.findModuleByProps "getCurrentUser"
    Permissions ?= BdApi.findModuleByProps "computePermissions"
    EndpointMessages ?= BdApi.findModuleByProps "deleteMessage"
    MessagePrompts ?= BdApi.findModuleByProps "confirmDelete"

    document.addEventListener "click", onClick, yes

  stop: ->
    document.removeEventListener "click", onClick, yes

  getSettingsPanel: ->
    """<label style="color: #87909C"><input type="checkbox" name="confirm" onChange="QuickDeleteMessages.updateSettings(this)"
    #{settings.confirm and "checked" or ""} />confirm delete?</label>"""

  @updateSettings: ({name, checked}) ->
    settings[name] = checked
    BdApi.saveData "QuickDeleteMessages", name, checked
    return

  _qualifies = ".contentCozy-3XX413, .messageCompact-kQa7ES"

  onClick = (event) ->
    return unless AsyncKeystate.key("Delete") or
      "darwin" is process.platform and AsyncKeystate.key "Backspace"

    {path: [element], shiftKey} = event

    return unless element.matches(_qualifies) or element = element.closest _qualifies

    {props: {channel, message}} = getOwnerInstance element
    return unless gotDeletePermission channel, message

    if settings.confirm and not shiftKey
      MessagePrompts.confirmDelete channel, message, no
    else
      EndpointMessages.deleteMessage channel.id, message.id, no

    event.preventDefault()
    event.stopImmediatePropagation()
    return

  gotDeletePermission = (channel, message) ->
    self = UserStore.getCurrentUser()
    self is message.author or
    0x2000 & Permissions.computePermissions self, channel
