#META { "name": "botInfo" } *//

class botInfo
  getName: -> "Bot Info"
  getDescription: -> "Shows bots' infos from `discordbots.org`. Depends on samogot's Discord Internals Library: https://git.io/v7Sfp"
  getAuthor: -> "square"
  getVersion: -> "1.0.3"

  load: ->

  UserPopoutComponent = UserStore = PrivateChannelActions = cancels = BotInfoComponent = ExternalLinkComponent = React = DI = null

  infoCache = {}

  request = require "request"

  start: ->
    cancels = []
    DI = window.DiscordInternals

    minDI = "1.6"
    if not (0 <= DI?.versionCompare DI.version, minDI)
      alert "DiscordInternals #{minDI} or higher not found. Please update or install it. (https://git.io/v7Sfp)"
      return

    minDI = "1.8"
    if not (0 <= DI?.versionCompare DI.version, minDI)
      log "DiscordInternals #{minDI} or higher not found. Update recommended! (https://git.io/v7Sfp)"

    BdApi.injectCSS "bot-info", css

    {Filters, Renderer, React, WebpackModules} = DI
    defineBotInfoComponent() if not BotInfoComponent?

    UserPopoutComponent ?= await getUserPopoutComponent()

    UserStore ?= WebpackModules.findByUniqueProperties ["getUser", "getCurrentUser"]
    PrivateChannelActions ?= WebpackModules.findByUniqueProperties ["openPrivateChannel", "ensurePrivateChannel"]
    ExternalLinkComponent ?= WebpackModules.find Filters.byCode /\.trusted\b/

    cancels.push Renderer.patchRender UserPopoutComponent, [
      selector: className: "body-3iLsc4"
      method: "prepend"
      content: (_this) -> <BotInfoComponent user={_this.props.user} />
    ]

    return

  stop: ->
    BdApi.clearCSS "bot-info"
    c() for c in cancels
    return

  log = (msg) ->
    console.log msg
    return

  getUserPopoutComponent = -> new Promise (resolve) ->
    observer = new MutationObserver ([{addedNodes}]) ->
      for {firstChild} in addedNodes when firstChild?.classList?.contains "userPopout-3XzG_A"
        userPopout = firstChild
        break
      if userPopout?
        observer.disconnect()
        component = DI.getInternalInstance(userPopout).return.stateNode.constructor
        component.displayName ?= "UserPopout"
        resolve component
      return
    observer.observe document.querySelector("#app-mount > .popouts-3dRSmE"), childList: true
    return

  defineBotInfoComponent = ->
    class BotInfoComponent extends React.Component
      @displayName: "BotInfo"

      handleOnClick: =>
        @setState ({collapsed}) -> collapsed: !collapsed

      retry: (e) =>
        e.stopPropagation()
        delete infoCache[@props.user.id]
        @setState loading: true
        @componentWillMount()
        return

      defaultLinkProps =
        rel: "norefferer"
        target: "_blank"

      constructor: (props) ->
        super props
        @state =
          loading: !infoCache[props.user.id]?
          collapsed: true

      componentWillMount: ->
        {bot, id} = @props.user
        return if not bot or infoCache[id]?
        info = await new Promise (resolve) -> request "https://discordbots.org/api/bots/#{id}", (e, {statusCode}, msg) ->
          return resolve error: e if e
          return resolve try JSON.parse (msg if statusCode is 200 or statusCode is 404) \
            catch e then error: e
        infoCache[id] = info
        @setState loading: false
        return

      render: ->
        user = @props.user
        return null if not user.bot

        info = infoCache[user.id]
        {loading, collapsed} = @state

        (<div className="botInfo">
          <div className="botInfo-inner bodyTitle-Y0qMQz marginBottom8-AtZOdT size12-3R0845 weightBold-2yjlgw">Bot Info</div>
          <div className="botInfo-inner endBodySection-Rf4s-7 marginBottom20-32qID7">
            {if loading
              <span className="loading">loading...</span>
            else if info? and not info.error?
              if collapsed
                <div className="desc shortdesc" onClick={@handleOnClick}>
                  {info.shortdesc}
                  <span className="more">more...</span>
                </div>
              else [
                <div className="desc" onClick={@handleOnClick}>{info.longdesc}</div>

                info.invite and <ExternalLinkComponent className="invite" key="invite" href={info.invite} title="Invite"/>

                info.github and <ExternalLinkComponent className="github" key="github" href={info.github} title="Github"/>

                info.website and <ExternalLinkComponent className="website" key="website" href={info.website} title="Website"/>

                info.owners?.length and <div className="owners">
                  {"Owner#{if info.owners.length > 1 then "s" else ""}: "}
                  {info.owners.map (owner, i) -> [
                    <FakeMentionComponent key={owner} userId={owner} />
                    i + 1 < info.owners.length and ", "
                  ]}
                </div>
              ]
            else
              <div className="error">
                {"Error: #{info?.error ? "unknown"} "}
                <button type="button" className="addButton-pcyyf6 weightMedium-2iZe9B" onClick={@retry}>Retry</button>
              </div>
            }
          </div>
        </div>)

      usernames = {}

      class FakeMentionComponent extends React.Component
        @displayName: "FakeMention"

        constructor: (props) ->
          super props
          @state = username: UserStore.getUser(props.userId)?.username ? usernames[props.userId]

        handleOnClick = (id, e) ->
          e.stopPropagation()
          ownId = UserStore.getCurrentUser().id
          try await PrivateChannelActions.openPrivateChannel ownId, id
          return

        componentWillMount: ->
          if !@state.username?
            username = await new Promise (resolve) => request "https://discordbots.org/api/users/#{@props.userId}", (e, {statusCode}, msg) =>
              if statusCode is 200
                try return resolve JSON.parse(msg).username
              return resolve "<@!#{@props.userId}>"
            @setState {username}
            usernames[@props.userId] = username
          return

        render: ->
          <span className="mention" onClick={handleOnClick.bind null, @props.userId}>
            {@state.username ? "<@!#{@props.userId}>"}
          </span>

    return

  css =
    """
    .botInfo {
      color: #99aab5;
      font-size: 13px;
    }
    .theme-dark .botInfo {
      color: #b9bbbe;
    }
    .botInfo .desc {
      cursor: pointer;
    }
    .botInfo .more {
      margin-left: 4px;
      opacity: 0.5;
    }
    .botInfo a {
      color: #00b0f4;
      margin-right: 4px;
    }
    .theme-dark .botInfo a {
      color: #0096cf;
    }
    .botInfo button {
      background-color: transparent;
      border: 1px solid #dbdde1;
      border-radius: 3px;
      color: #737f8d;
      font-size: 12px;
      line-height: 12px;
    }
    .theme-dark .botInfo button {
      border-color: #72767d;
      color: #b9bbbe;
    }
    """
