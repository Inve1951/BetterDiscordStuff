#META { "name": "AvatarHover", "website": "https://inve1951.github.io/BetterDiscordStuff/" } *//

class global.AvatarHover
  getName: -> "Avatar Hover"
  getDescription: -> "When hovering, resize the avatar. Use Ctrl / Ctrl+Shift."
  getAuthor: -> "square, noVaLue, MurmursOnSARS, Green"
  getVersion: -> "0.7.2"

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
      # guilds
      ".wrapper-25eVIn" if settings.isHoverGuilds
      # voip, DM channels
      ".avatarContainer-2inGBK,
        .channel-2QD9_O .avatar-3uk_u9" if settings.isHoverChannels
      # friends list
      ".userInfo-2zN2z8 .avatar-3W3CeO" if settings.isHoverFriends
      # messages, embeds
      ".contents-2mQqc9 .avatar-1BDn8e, .embedAuthorIcon--1zR3L" if settings.isHoverChatMessages
      # channel users
      ".member-3-YXUe .avatar-3uk_u9" if settings.isHoverChatUsers
      # DM call
      ".callAvatarWrapper-3Ax_xH" if settings.isHoverCall
      # modals, userpopout
      ".header-QKLPzZ .avatar-3EQepX, .avatarWrapper-3H_478" if settings.isHoverProfile
    ].filter((s) -> s?).join ", "

  handleKeyUpDown = ({key}) ->
    return unless key in ["Control", "Shift"]
    updateHoverCard()

  handleFocusLoss = ->
    updateHoverCard()

  handleMouseOverOut = ({type, target}) ->
    return unless target.matches(qualifier) or target = target.closest qualifier
    updateHoverCard "mouseover" is type and target

  lastTarget = null
  updateHoverCard = (target = lastTarget) ->
    lastTarget = target
    isShown = settings.isShown or AsyncKeystate.key "Control"
    isLarge = settings.isLarge or AsyncKeystate.key "Shift"
    return hoverCard.remove() unless isShown and target
    size = isLarge and 256 or 128
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

    return hoverCard.remove() if "none" is imageUrl = (
        target.querySelector("img")?.src or
        target.src or
        getComputedStyle(target).backgroundImage.match(/^url\((["']?)(.+)\1\)$/)[2]
      ).replace /\?size=\d{2,4}\)?$/, "?size=#{size}"

    Object.assign hoverCard.style,
      backgroundColor: settings.avatarBackgroundColor
      backgroundImage: "url(#{imageUrl})"
      borderColor: settings.avatarBorderColor
      borderRadius: settings.avatarBorderRadius
      borderWidth: settings.avatarBorderSize
      width: "#{size}px"
      height: "#{size}px"
      top: "#{top}px"
      left: "#{left}px"

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
    isHoverCall: yes
    isHoverProfile: yes

  settings = null
  getSettings = ->
    return if settings?
    settings = BdApi.getData("AvatarHover", "settings") ? {}
    settings[k] ?= v for k, v of defaultSettings

  @updateSettings: ->
    for {name, type, value, checked} in document.querySelectorAll "#settings_AvatarHover input"
      settings[name] = if "checkbox" is type then checked else value or defaultSettings[name]
    BdApi.setData "AvatarHover", "settings", settings
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
        isHoverCall: "Voice call users"
        isHoverProfile: "Profiles and modals"
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
