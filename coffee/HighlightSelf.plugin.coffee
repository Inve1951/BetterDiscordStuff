#META { "name": "HighlightSelf", "website": "https://inve1951.github.io/BetterDiscordStuff/" } *//

class HighlightSelf
  getName: -> "Highlight Self"
  getDescription: -> "Highlights your own username in message headers."
  getAuthor: -> "square"
  getVersion: -> "1.1.0"

  MessageComponents = UserStore = cancel = getOwnerInstance = null

  load: ->
    window.SuperSecretSquareStuff ?= new Promise (c, r) ->
      require("request").get "https://raw.githubusercontent.com/Inve1951/BetterDiscordStuff/master/plugins/0circle.plugin.js", (err, res, body) ->
        return r err ? res if err or 200 isnt res?.statusCode
        Object.defineProperties window.SuperSecretSquareStuff, {libLoaded: value: c; code: value: body}
        `(0,eval)(body)`

  start: ->
    {getOwnerInstance} = await SuperSecretSquareStuff
    @onSwitch = install unless install()
    BdApi.injectCSS "css_highlightSelf", css

  stop: ->
    if cancel
      cancel()
      cancel = null
    BdApi.clearCSS "css_highlightSelf"

  install = ->
    MessageComponents or= BDV2.WebpackModules.find (m) -> m.MessageUsername
    UserStore or= BDV2.WebpackModules.findByUniqueProperties ["getCurrentUser"]

    return no unless MessageComponents and UserStore
    delete @onSwitch

    cancel = Utils.monkeyPatch MessageComponents.MessageUsername.prototype, "render", after: ({returnValue, thisObject}) ->
      {props} = returnValue.props.children
      if UserStore.getCurrentUser() is thisObject.props.message.author and not props.className?.endsWith " highlight-self"
        props.className = if props.className then props.className + " highlight-self" else "highlight-self"

    try for n in document.querySelectorAll ".message-1PNnaP h2 > span"
      getOwnerInstance(n).forceUpdate()

    yes

  css = """
    .highlight-self .username-_4ZSMR {
      text-decoration: underline;
    }"""
