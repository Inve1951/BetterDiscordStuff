#META{"name":"QuickDeleteMessages"}*//

class QuickDeleteMessages
  getName: -> "Quick Delete Messages"
  getDescription: -> "Hold Delete and click a Message to delete it."
  getAuthor: -> "square"
  getVersion: -> "1.0.1"

  settings = Object.create null
  MessageActions = ConfirmActions = getInternalInstance = null

  start: ->
    getInternalInstance = BDV2.reactDom.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactDOMComponentTree.getInstanceFromNode

    settings.confirm = bdPluginStorage.get("QuickDeleteMessages", "confirm") ? false

    document.addEventListener "click", onClick, true
    document.addEventListener "keydown", onKeyDown
    document.addEventListener "keyup", onKeyUp

    MessageActions = BDV2.WebpackModules.findByUniqueProperties ["deleteMessage"]
    ConfirmActions = BDV2.WebpackModules.findByUniqueProperties ["confirmDelete"]

  stop: ->
    document.removeEventListener "click", onClick, true
    document.removeEventListener "keydown", onKeyDown
    document.removeEventListener "keyup", onKeyUp

  load: ->

  getSettingsPanel: ->
    """<label><input type="checkbox" name="confirm" onChange="QuickDeleteMessages.updateSettings(this)"
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


  qualifies = ".markup, .accessory"

  onClick = (event) ->
    return unless deletePressed

    {path: [element]} = event

    if element.matches(qualifies) or element = element.closest qualifies
      element = element.closest ".message"
    else return

    {
      props: {canDelete, channel, message}
    } = getOwnerInstance element

    return unless canDelete

    if settings.confirm
      ConfirmActions.confirmDelete channel, message
    else
      MessageActions.deleteMessage channel.id, message.id

    event.preventDefault()
    event.stopImmediatePropagation()
    return


  getOwnerInstance = (node) ->
    internalInstance = getInternalInstance(node) ? node
    internalInstance.return.stateNode
