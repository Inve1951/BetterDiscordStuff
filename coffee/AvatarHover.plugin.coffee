#META { "name": "AvatarHover" } *//

class global.AvatarHover
  getName: -> "Avatar Hover"
  getDescription: -> "When hovering, resize the avatar. Use Ctrl / Ctrl+Shift."
  getAuthor: -> "noVaLue, square"
  getVersion: -> "0.4.0"

  load: ->

  start: ->
    getSettings()
    updateQualifier()
    BdApi.injectCSS "css-AvatarHover", css
    initContainer()
    document.addEventListener "keydown", handleKeyUpDown, true
    document.addEventListener "keyup", handleKeyUpDown, true
    document.addEventListener "mouseover", handleMouseOverOut, true
    document.addEventListener "mouseout", handleMouseOverOut, true
    document.addEventListener "blur", handleFocusLoss, true

  stop: ->
    document.removeEventListener "keydown", handleKeyUpDown, true
    document.removeEventListener "keyup", handleKeyUpDown, true
    document.removeEventListener "mouseover", handleMouseOverOut, true
    document.removeEventListener "mouseout", handleMouseOverOut, true
    document.removeEventListener "blur", handleFocusLoss, true
    hoverCard.remove()
    BdApi.clearCSS "css-AvatarHover"

  hoverCard = null
  initContainer = ->
    hoverCard = document.createElement "div"
    hoverCard.id = "AvatarHover"

  qualifier = null
  updateQualifier = ->
    qualifier = [
      ".icon-3o6xvg" if settings.isHoverGuilds
      ".avatarDefault-35WC3R, .avatarSpeaking-1wJCNq,
        .channel .avatar-small" if settings.isHoverChannels
      "#friends .avatar-small,
        .activityFeed-28jde9 .image-33JSyf" if settings.isHoverFriends
      ".message-group .avatar-large, .embedAuthorIcon--1zR3L" if settings.isHoverChatMessages
      ".membersWrap-2h-GB4 .image-33JSyf" if settings.isHoverChatUsers
    ].filter((s) -> s?).join ", "

  pressed = [false, false]
  handleKeyUpDown = ({type, key}) ->
    return unless -1 isnt ctrlShift = ["Control", "Shift"].indexOf key
    return if pressed[ctrlShift] is pressed[ctrlShift] = "keydown" is type
    updateHoverCard()

  handleFocusLoss = ->
    pressed = [false, false]
    updateHoverCard()

  handleMouseOverOut = ({type, target}) ->
    return unless target.matches qualifier
    updateHoverCard "mouseover" is type and target

  lastTarget = null
  updateHoverCard = (target = lastTarget) ->
    lastTarget = target
    [isShown, isLarge] = pressed
    isShown or= settings.isShown
    isLarge or= settings.isLarge
    return hoverCard.remove() unless isShown and target
    size = isLarge and 256 or 128
    boundsTarget = target.getBoundingClientRect()
    boundsWindow =
      width: innerWidth
      height: innerHeight

    left = Math.max 0, boundsTarget.left + (boundsTarget.width - size) / 2
    left = boundsWindow.width - boundsTarget.width if left + boundsTarget.width > boundsWindow.width

    top = if boundsWindow.height - boundsTarget.height < boundsTarget.top
        boundsTarget.top - size
      else boundsTarget.bottom

    hoverCard.style[k] = v for k, v of {
      backgroundColor: settings.avatarBackgroundColor
      backgroundImage: getComputedStyle(target).backgroundImage.replace /\?size=\d{3,4}/, "?size=#{size}"
      borderColor: settings.avatarBorderColor
      borderRadius: settings.avatarBorderRadius
      borderWidth: settings.avatarBorderSize
      width: "#{size}px"
      height: "#{size}px"
      top: "#{top}px"
      left: "#{left}px"
    }
    return hoverCard.remove() if "none" is hoverCard.style.backgroundImage
    document.body.appendChild hoverCard

  defaultSettings =
    avatarBackgroundColor: "#303336"
    avatarBorderRadius: "4px"
    avatarBorderSize: "1px"
    avatarBorderColor: "black"
    isShown: no
    isLarge: no
    isHoverGuilds: no
    isHoverChannels: yes
    isHoverFriends: yes
    isHoverChatMessages: yes
    isHoverChatUsers: yes

  settings = null
  getSettings = ->
    return if settings?
    settings = bdPluginStorage.get("AvatarHover", "settings") ? {}
    settings[k] ?= v for k, v of defaultSettings

  @updateSettings: ->
    for {name, type, value, checked} in document.querySelectorAll "#settings_AvatarHover input"
      settings[name] = if "checkbox" is type then checked else value or defaultSettings[name]
    bdPluginStorage.set "AvatarHover", "settings", settings
    updateQualifier()

  getSettingsPanel: ->
    getSettings()
    """<div id="settings_AvatarHover">#{
      (makeInput k, v for k, v of {
        avatarBackgroundColor: "Background color"
        avatarBorderRadius: "Border radius"
        avatarBorderSize: "Border size"
        avatarBorderColor: "Border color"
        spacer: null
        isShown: "Force-show avatar"
        isLarge: "Force large avatar"
        isHoverGuilds: "Guilds"
        isHoverChannels: "Channels / DM users"
        isHoverFriends: "Friends list"
        isHoverChatMessages: "Chat messages"
        isHoverChatUsers: "Chat users"
      }).join ""
    }</div>"""

  makeInput = (name, label) ->
    return "<br/>" unless label?
    type = Boolean is defaultSettings[name].constructor and (isCheckbox = true) and "checkbox" or "text"
    _default = if isCheckbox
        if settings[name] then "checked" else ""
      else """placeholder="#{defaultSettings[name]}" value="#{settings[name]}\""""
    """<label><input type="#{type}" name="#{name}" #{_default} onChange="AvatarHover.updateSettings()"/> #{label}</label><br/>"""

  css = """
    #AvatarHover {
      background-size: cover;
      border-style: solid;
      display: block;
      pointer-events: none;
      position: fixed;
      z-index: 99999;
    }
    #settings_AvatarHover {
      color: #87909C;
    }
  """
