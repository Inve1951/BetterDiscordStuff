
`//META{"name":"moreObviousDMs"}*//`

class moreObviousDMs
  getName: -> "More obvious DMs"
  getDescription: -> "Flashes the discord taskbar icon and window upon receiving a DM until discord receives mouse or window focus. This makes it easier to spot DMs after leaving a fullscreen application."
  getAuthor: -> "square"
  getVersion: -> "1.0.1"

  load: ->

  start: ->
    observer.observe (document.querySelector ".dms-rcsEnV"), childList: true, subtree: false
    do insertStyle
    return

  stop: ->
    observer.disconnect()
    document.head.querySelector("#moreObviousDMs-style").remove()
    return


  bw = require("electron").remote.BrowserWindow.getAllWindows()[0]
  flashing = false

  observer = new MutationObserver ([{addedNodes}]) ->
    flash true if addedNodes.length
    return

  _flash  = 0
  flash = (b) ->
    return if b and flashing
    if b
      flashing = true
      _flash = setInterval (->
        bw.flashFrame true
        return
        ), 5000
      do insertOverlay
    else
      flashing = false
      clearInterval _flash
      setTimeout (->
        bw.flashFrame false if !flashing
        return
        ), 3000
    return


  insertStyle = ->
    style = document.createElement "style"
    style.id = "moreObviousDMs-style"
    style.innerHTML = """
      #moreObviousDMs-overlay {
        width: 100vw;
        height: 100vh;
        background: yellow;
        animation: DMflashOverlay 5s infinite;
      }
      @keyframes DMflashOverlay {
        0%, 20%, 40%, 60% { opacity: 0; }
        19.999%, 39.999%, 59.999%, 80%, 100% {
          opacity: 0.1;
        }
      }
    """
    document.head.appendChild style
    return

  insertOverlay = ->
    overlay = document.createElement "div"
    overlay.id = "moreObviousDMs-overlay"
    l = ->
      overlay.remove()
      window.removeEventListener "mousemove", l, true
      flash false
      bw.removeListener "focus", l
      return
    window.addEventListener "mousemove", l, true
    if !bw.isFocused()
      bw.on "focus", l
      document.body.appendChild overlay
    return
