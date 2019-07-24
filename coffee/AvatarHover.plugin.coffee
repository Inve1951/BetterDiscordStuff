#META { "name": "AvatarHover", "source":"https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/AvatarHover.plugin.js","website":"https://github.com/Inve1951" } *//

class global.AvatarHover
  getName: -> "Avatar Hover"
  getDescription: -> "When hovering, resize the avatar. Use Ctrl / Ctrl+Shift."
  getAuthor: -> "noVaLue, square"
  getVersion: -> "0.6.1"

  hoverCard = AsyncKeystate = null

  load: ->
    window.SuperSecretSquareStuff ?= new Promise (c, r) ->
      require("request").get "https://raw.githubusercontent.com/Inve1951/BetterDiscordStuff/master/plugins/0circle.plugin.js", (err, res, body) ->
        return r err ? res if err or 200 isnt res?.statusCode
        Object.defineProperties window.SuperSecretSquareStuff, {libLoaded: value: c; code: value: body}
        `(0,eval)(body)`

  start: ->
    {AsyncKeystate, createElement} = await SuperSecretSquareStuff
    getSettings()
    updateQualifier()
    BdApi.injectCSS "css-AvatarHover", css
    hoverCard = createElement "div", id: "AvatarHover"
    document.addEventListener "keydown", handleKeyUpDown, yes
    document.addEventListener "keyup", handleKeyUpDown, yes
    document.addEventListener "mouseover", handleMouseOverOut, yes
    document.addEventListener "mouseout", handleMouseOverOut, yes
    window.addEventListener "blur", handleFocusLoss, yes

  stop: ->
    document.removeEventListener "keydown", handleKeyUpDown, yes
    document.removeEventListener "keyup", handleKeyUpDown, yes
    document.removeEventListener "mouseover", handleMouseOverOut, yes
    document.removeEventListener "mouseout", handleMouseOverOut, yes
    window.removeEventListener "blur", handleFocusLoss, yes
    hoverCard.remove()
    BdApi.clearCSS "css-AvatarHover"

  qualifier = null
  updateQualifier = ->
    qualifier = [
      ".wrapper-1BJsBx:not(.button-OhfaWu)" if settings.isHoverGuilds
      ".avatarDefault-35WC3R, .avatarSpeaking-3MqCHL,
       .modeConnected-2IEL4z .avatarSmall-2CW6I1, .avatarContainer-2inGBK,
	   .privateChannels-1nO12o .avatar-28BJzY" if settings.isHoverChannels
      ".friendsTable-133bsv .avatarSmall--gkJKA,
        .activityFeed-28jde9 .image-33JSyf,
		.friendsTable-133bsv .icon-3o6xvg" if settings.isHoverFriends
      ".message-1PNnaP .wrapper-3t9DeA,
	    .message-1PNnaP .embedAuthorIcon--1zR3L" if settings.isHoverChatMessages
      ".membersWrap-2h-GB4 .avatarWrapper-3B0ndJ" if settings.isHoverChatUsers
    ].filter((s) -> s?).join ", "

  handleKeyUpDown = ({key}) ->
    return unless key in ["Control", "Shift"]
    updateHoverCard()

  handleFocusLoss = ->
    updateHoverCard()

  handleMouseOverOut = ({type, target}) ->
    return unless target.matches qualifier
    updateHoverCard "mouseover" is type and target

  lastTarget = null
  updateHoverCard = (target = lastTarget) ->
    lastTarget = target
    isShown = settings.isShown or AsyncKeystate.key "Control"
    isLarge = settings.isLarge or AsyncKeystate.key "Shift"
    return hoverCard.remove() unless isShown and target
    size = isLarge and 256 or 128

    selectors = ["avatar-VxgULZ", "icon-27yU2q", "avatarDefault-35WC3R", "avatarSpeaking-3MqCHL", "avatarSmall-2CW6I1", "image-33JSyf", "embedAuthorIcon--1zR3L"]
    for selector in selectors
      child = target.getElementsByClassName selector
      target = child[0] if child[0]
    
    boundsTarget = target.getBoundingClientRect()
    boundsWindow =
      width: window.innerWidth
      height: window.innerHeight

    left = Math.max 0, boundsTarget.left + (boundsTarget.width - size) / 2
    left = boundsWindow.width - size if left + size > boundsWindow.width

    top =
      if size > boundsWindow.height
        (boundsWindow.height - size) / 2
      else if boundsTarget.bottom + size > boundsWindow.height
        boundsTarget.top - size
      else boundsTarget.bottom


    hoverCard.style[k] = v for k, v of {
      backgroundColor: settings.avatarBackgroundColor
      backgroundImage: ("IMG" is target.tagName and "url(#{target.src.replace /\?size=\d{3,4}/, "?size=#{size}"})" or target.style.backgroundImage).replace /\?size=\d{3,4}/, "?size=#{size}"
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
    settings = BdApi.loadData("AvatarHover", "settings") ? {}
    settings[k] ?= v for k, v of defaultSettings

  @updateSettings: ->
    for {name, type, value, checked} in document.querySelectorAll "#settings_AvatarHover input"
      settings[name] = if "checkbox" is type then checked else value or defaultSettings[name]
    BdApi.saveData "AvatarHover", "settings", settings
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
