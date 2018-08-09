#META { "name": "HighlightSelf" } *//

class HighlightSelf
  getName: -> "Highlight Self"
  getDescription: -> "Highlights your own username in message headers."
  getAuthor: -> "square"
  getVersion: -> "1.0.0"

  MessageComponents = UserStore = cancel = null

  load: ->

  start: ->
    @onSwitch = install unless install()
    BdApi.injectCSS "css_highlightSelf", css

  stop: ->
    cancel() if cancel()
    cancel = null
    BdApi.clearCSS "css_highlightSelf"

  install = ->
    MessageComponents or= BDV2.WebpackModules.find (m) -> m.MessageUsername
    UserStore or= BDV2.WebpackModules.findByUniqueProperties ["getCurrentUser"]

    return false unless MessageComponents and UserStore
    delete @onSwitch

    cancel = Utils.monkeyPatch MessageComponents.MessageUsername.prototype, "render", after: ({returnValue, thisObject}) ->
      {props} = returnValue.props.children
      if UserStore.getCurrentUser() is thisObject.props.message.author and not props.className.endsWith " highlight-self"
        props.className += " highlight-self"

    try for n in document.querySelectorAll "usernameWrapper-1S-G5O"
      BDV2.reactDom.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactDOMComponentTree
      .getInstanceFromNode(n).return.stateNode.forceUpdate()

    true

  css = """
    .highlight-self .username-_4ZSMR {
      text-decoration: underline;
    }"""
