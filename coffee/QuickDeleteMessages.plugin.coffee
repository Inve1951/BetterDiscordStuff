#META{"name":"QuickDeleteMessages"}*//

class QuickDeleteMessages
  getName: -> "Quick Delete Messages"
  getDescription: -> "Hold Delete and click a Message to delete it."
  getAuthor: -> "square"
  getVersion: -> "1.1.0"

  settings = Object.create null
  MessageDeleteItem = getInternalInstance = null

  start: ->
    getInternalInstance = BDV2.reactDom.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactDOMComponentTree.getInstanceFromNode

    settings.confirm = bdPluginStorage.get("QuickDeleteMessages", "confirm") ? false

    document.addEventListener "click", onClick, true
    document.addEventListener "keydown", onKeyDown
    document.addEventListener "keyup", onKeyUp

    MessageDeleteItem = BDV2.WebpackModules.find (m) -> m::?.handleDeleteMessage

  stop: ->
    document.removeEventListener "click", onClick, true
    document.removeEventListener "keydown", onKeyDown
    document.removeEventListener "keyup", onKeyUp

  load: ->

  getSettingsPanel: ->
    """<label style="color: #87909C"><input type="checkbox" name="confirm" onChange="QuickDeleteMessages.updateSettings(this)"
    #{settings.confirm and "checked" or ""} />confirm delete?</label>"""

  @updateSettings: ({name, checked}) ->
    settings[name] = checked
    bdPluginStorage.set "QuickDeleteMessages", name, checked
    return


  deletePressed = false

  onKeyDown = ({code}) ->
    deletePressed = true if code is "Delete"
    return

  onKeyUp = ({code}) ->
    deletePressed = false if code is "Delete"
    return


  qualifies = ".content-3dzVd8"

  onClick = (event) ->
    return unless deletePressed

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


  getOwnerInstance = (node) ->
    internalInstance = getInternalInstance(node) ? node._reactInternalFiber
    internalInstance.return.stateNode
