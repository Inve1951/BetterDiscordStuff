###*
# @name Highlight Self
# @description Highlights your own username in message headers.
# @version 1.2.2
# @author square
# @authorLink https://betterdiscord.app/developer/square
# @website https://betterdiscord.app/plugin/Highlight%20Self
# @source https://github.com/Inve1951/BetterDiscordStuff/blob/master/coffee/HighlightSelf.plugin.coffee
# @updateUrl https://raw.githubusercontent.com/Inve1951/BetterDiscordStuff/master/plugins/HighlightSelf.plugin.js
# @exports 42
###

module.exports = class HighlightSelf
  YouTellMe = UserStore = cancel = patchRender = null

  load: ->
    window.SuperSecretSquareStuff ?= new Promise (c, r) ->
      require("request").get "https://raw.githubusercontent.com/Inve1951/BetterDiscordStuff/master/plugins/0circle.plugin.js", (err, res, body) ->
        return r err ? res if err or 200 isnt res?.statusCode
        Object.defineProperties window.SuperSecretSquareStuff, {libLoaded: value: c; code: value: body}
        `(0,eval)(body)`

  start: ->
    { patchRender } = await SuperSecretSquareStuff
    @onSwitch = install unless install()
    BdApi.injectCSS "css_highlightSelf", css

  stop: ->
    delete @onSwitch
    if cancel
      cancel()
      cancel = null
    BdApi.clearCSS "css_highlightSelf"

  install = ->
    YouTellMe or= BdApi.findModule (m) -> "function" is typeof m?.default and m.default.toString().includes "getGuildMemberAvatarURLSimple"
    UserStore or= BdApi.findModuleByProps "getCurrentUser"

    return no unless YouTellMe and UserStore
    delete @onSwitch unless this is window

    cancel = patchRender YouTellMe,
      filter: (node, { message: { author } }) -> UserStore.getCurrentUser() is author and node.props.children?.some? (child) -> child?.type is "h2"
      touch: (node) ->
        node = node.props.children.find (child) -> child?.type is "h2"
        if not node.props?.className?.includes "highlight-self"
          node.props.className = if node.props.className then node.props.className + " highlight-self" else "highlight-self"
          return
        return

    yes

  css = """
    .highlight-self {
      text-decoration: underline;
    }
  """
