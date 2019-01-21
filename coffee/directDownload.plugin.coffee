#META{"name":"directDownload", "website": "https://inve1951.github.io/BetterDiscordStuff/"}*//

class global.directDownload
  getName: ->         "Direct-Download"
  getDescription: ->  "
    Download attached files directly within discord.
    Usage note: Left click a tab to open the file, right click it to show in file manager."
  getAuthor: ->       "square"
  getVersion: ->      "0.4.2"

  start: ->
    getSettings()
    installCss()
    installDownloadBar()
    document.addEventListener "click", listener, true
    document.addEventListener "dblclick", listener, true if settings.doubleClick
    return

  downloadbar = null
  stop: ->
    downloadbar.remove()
    document.getElementById("css_directDownload").remove()
    document.removeEventListener "click", listener, true
    document.removeEventListener "dblclick", listener, true
    return

  classNames =
    activity: "activityFeed-28jde9"
    attachment: "attachment-33OFj0"
    accessory: "containerCozy-B4noqO"
    iconFile: "icon-1kp3fr"
    imageWrapper: "imageWrapper-2p5ogY"
    lfg: "lfg-3xoFkI"
    metadataDownload: "metadataDownload-1fk90V"
    embed: "embed-IeVjo6"
    embedVideo: "embedVideo-3nf0O9"
    videoControls: "controls-N9e_UM"
    webmControls: "videoControls-2kcYic"
    chat: "chat-3bRxxu"
    content: "content-yTz4x3"

  installCss = ->
    style = document.createElement "style"
    style.id = "css_directDownload"
    style.innerHTML = Download.css
    document.head.appendChild style
    return

  installDownloadBar = ->
    unless downloadbar
      downloadbar = document.createElement "div"
      downloadbar.id = "files_directDownload"
      downloadbar.style = "--numFiles:0;"
    unless document.getElementById "files_directDownload"
      container = document.querySelector ".#{classNames.chat} .#{classNames.content} > :first-child, #friends, .#{classNames.activity}, .#{classNames.lfg}"
      try container.appendChild downloadbar
      catch e then console.error e
    return

  onSwitch: installDownloadBar

  fs = require "fs"
  path = require "path"
  {clipboard, nativeImage, remote} = require "electron"
  {shell, dialog} = remote
  bw = remote.BrowserWindow.getAllWindows()[0]

  settings = {}

  pPlugins = switch process.platform
    when "win32" then path.resolve process.env.appdata, "BetterDiscord/plugins/"
    when "darwin" then path.resolve process.env.HOME, "Library/Preferences/", "BetterDiscord/plugins/"
    else path.resolve process.env.HOME, ".config/", "BetterDiscord/plugins/"
  pThemes = switch process.platform
    when "win32" then path.resolve process.env.appdata, "BetterDiscord/themes/"
    when "darwin" then path.resolve process.env.HOME, "Library/Preferences/", "BetterDiscord/themes/"
    else path.resolve process.env.HOME, ".config/", "BetterDiscord/themes/"

  lastClicked = [null, null]
  listener = (ev) ->
    ok = false
    if ev.target.nodeName is "A" and ev.target.href.startsWith "https://betterdiscord.net/ghdl?"
      ok = true
      elem = ev.target
    else for elem in ev.path when elem.classList
      break if elem.nodeName is "svg" and "Play" is elem.getAttribute("name") or elem.classList.contains(classNames.videoControls) or elem.classList.contains classNames.webmControls
      if settings.imagemodals and elem.classList.contains(classNames.imageWrapper) and not elem.parentNode.matches(".#{classNames.accessory}, .#{classNames.embed}, .image-details-wrapper")
        if settings.doubleClick
          if "click" is ev.type
            lastClicked.shift()
            lastClicked.push elem
          else
            [elem] = lastClicked
            ok = true
        else
          ok = true
        break
      if elem.classList.contains(classNames.attachment) and elem.querySelector(".#{classNames.iconFile}")? \
          or elem.classList.contains classNames.metadataDownload
        ok = true
        break
    return unless ok
    elem.parentNode.classList.contains(classNames.embedVideo) and elem = elem.querySelector "video"
    new Download elem
    ev.preventDefault()
    ev.stopImmediatePropagation()
    return false

  lastButOneIndexOf = (h, n) ->
    h[...h.lastIndexOf n].lastIndexOf n

  getSettings = ->
    settings = bdPluginStorage.get("directDownload", "settings") ? doubleClick: true
    settings[k] ?= v for k, v of {
      dldir: path.join process.env[if process.platform is "win32" then "USERPROFILE" else "HOME"], "downloads"
      autoopen: false
      showinstead: false
      overwrite: true
      prompt: false
      imagemodals: true
      doubleClick: false
      copyimages: false
      itp: true
    }
    return

  getSettingsPanel: ->
    getSettings()
    """
    <div id="settings_directDownload">
      <style>
        #settings_directDownload {
          color: #87909C;
        }
        #settings_directDownload button {
          background: rgba(128,128,128,0.4);
          width: calc(100% - 20px);
          padding: 5px 10px;
          box-sizing: content-box;
          height: 1em;
          font-size: 1em;
          line-height: 0.1em;
        }
        #settings_directDownload button.invalid {
          background: rgba(200,0,0,.5);
          font-weight: 500;
        }
        #settings_directDownload label {
          display: inline-block;
        }
        #settings_directDownload :-webkit-any(label, input) {
          cursor: pointer;
        }
        #settings_directDownload br + br {
          content: "";
          display: block;
          margin-top: 5px;
        }
      </style>
      <button name="dldir" type="button" onclick="directDownload.chooseDirectory()">#{settings.dldir}</button>
      <br><br>
      <label><input name="autoopen" type="checkbox" #{if settings.autoopen then "checked" else ""} onchange="directDownload.updateSettings()"/>Open files after download.</label>
      <label><input name="showinstead" type="checkbox" #{if settings.showinstead then "checked" else ""} #{if settings.autoopen then "" else "disabled"} onchange="directDownload.updateSettings()"/>Show in folder instead.</label>
      <br><br>
      <label><input name="overwrite" type="checkbox" #{if !settings.overwrite then "checked" else ""} onchange="directDownload.updateSettings()"/>Ask for path if file exists.</label>
      <label><input name="prompt" type="checkbox" #{if settings.prompt then "checked" else ""} #{if settings.overwrite then "disabled" else ""} onchange="directDownload.updateSettings()"/>Always ask.</label>
      <br><br>
      <label><input name="imagemodals" type="checkbox" #{if settings.imagemodals then "checked" else ""} onchange="directDownload.updateSettings()"/>Allow direct download for image modals.</label>
      <label><input name="copyimages" type="checkbox" #{if settings.copyimages then "checked" else ""} #{if settings.imagemodals then "" else "disabled"} onchange="directDownload.updateSettings()"/>Copy the image to clipboard when download is done.</label>
      <label><input name="doubleClick" type="checkbox" #{if settings.doubleClick then "checked" else ""} #{if settings.imagemodals then "" else "disabled"} onchange="directDownload.updateSettings()"/>Require a double click as opposed to a single one.</label>
      <br><br>
      <label><input name="itp" type="checkbox" #{if settings.itp then "checked" else ""} onchange="directDownload.updateSettings()"/>Install themes and plugins downloaded from betterdiscord.net (will always overwrite).</label>
    </div>
    """

  _dialogOpen = no
  @chooseDirectory: (cb) ->
    throw new Error "Dialog already open" if _dialogOpen
    _dialogOpen = yes
    dialog.showOpenDialog defaultPath: settings.dldir, properties: \
        ["openDirectory", "showHiddenFiles", "createDirectory", "noResolveAliases", "treatPackageAsDirectory"], \
        (selection) =>
      _dialogOpen = no
      dir = selection?[0]
      if cb
        cb dir
      else
        (document.querySelector "#settings_directDownload button").textContent = dir ? ""
        @updateSettings()
      return
    return

  @chooseFile: (defaultPath, cb) ->
    throw new Error "Dialog already open" if _dialogOpen
    _dialogOpen = yes
    unless cb
      cb = defaultPath
      defaultPath = ""
    ext = path.extname(defaultPath)[1...].toLowerCase()
    filters = if ext
      extensions = if ext in ["jpg", "jpeg"] then ["jpg", "jpeg"] else [ext]
      [{name: ext.toUpperCase(), extensions}, {name: "All Files", extensions: ["*"]}]
    else []
    dialog.showSaveDialog {defaultPath, filters}, (selection) ->
      _dialogOpen = no
      cb? selection
      return
    return


  @updateSettings: ->
    for input in document.querySelectorAll "#settings_directDownload :-webkit-any(input, button)"
      {name, type, value} = input
      if type is "button"
        value = input.innerHTML
      else if type is "checkbox"
        value = input.checked
      if (switch name
        when "dldir"
          value and (path.isAbsolute value) and fs.existsSync value
        when "showinstead"
          input.disabled = !settings.autoopen
          true
        when "copyimages", "doubleClick"
          input.disabled = !settings.imagemodals
          true
        when "overwrite"
          value = !value
          true
        when "prompt"
          input.disabled = settings.overwrite
          true
        else true
      )
        settings[name] = value
        input.className = ""
      else
        input.className = "invalid"
        input.innerHTML = "invalid path" if name is "dldir"
    document.removeEventListener "dblclick", listener, true
    document.addEventListener "dblclick", listener, true if settings.doubleClick
    bdPluginStorage.set "directDownload", "settings", settings
    return

  # for Zerebos
  @toClipboard: (url, cb) ->
    cache.get url, (dl) ->
      if !dl? or !dl.isImage
        cb false
        return
      if dl.finished
        clipboard.write image: nativeImage.createFromBuffer dl.buffer
        delete dl.buffer if !dl.elem?.inDOM
      else
        dl.copyWhenFinished = true
      cb true
      return
    return

  class Download
    constructor: (args...) ->
      @filename = @filepath = @url = ""
      @filesize = @bufpos = 0
      @buffer = @elem = @pb = @att = @buffers = null
      @started = @finished = @failed = false
      @openWhenFinished = settings.autoopen
      @showinstead = @openWhenFinished and settings.showinstead
      @overwrite = settings.overwrite
      @prompt = !@overwrite and settings.prompt

      @copyWhenFinished = @isImage = @install = @stream = false

      if args.length > 1
        @buffer = args[0]
        @filesize = @bufpos = Buffer.byteLength @buffer
        @started = @finished = true
        @filepath = args[1].path
        @url = args[1].url
        @filename = path.basename @filepath
        @isImage = path.extname(@filename) in [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".ico"]  # copying to clipboard will silently fail for _unsupported_ formats
        @copyWhenFinished = @isImage and settings.copyimages
        return

      [@att] = args

      if settings.imagemodals and @att.classList.contains classNames.imageWrapper
        @copyWhenFinished = settings.copyimages
        @isImage = true
        if att = @att.querySelector "video"
          @att = att
          @url = @att.src
        else
          @att = @att.parentNode.querySelector "a"
          @url = @att.href
        @filename = path.basename @url.split("/").pop()
      else if "VIDEO" is @att.nodeName
        @url = @att.querySelector("source").src
        @filename = path.basename @url.split("/").pop()
      else
        return unless (a = if @att.nodeName is "A" then @att else @att.querySelector "a")
        @install = a is @att and settings.itp
        @url = a.href
        @filename = path.basename a.title or a.innerHTML

      throw new Error "DirectDownload: couldn't get url." unless @url

      cache.get @url, (dl) =>
        if dl?
          cache.verify dl.url, (valid) =>
            if valid # then restore tab
              dl.openWhenFinished = settings.autoopen
              dl.showinstead = settings.showinstead
              dl.copyWhenFinished = dl.isImage and settings.copyimages
              if !dl.elem?.inDOM
                dl.start false
              dl.finish false
              return
            @c2()
            return
          return
        @c2()
        return

    c2: ->
      @filepath = path.join settings.dldir, @filename if !@prompt

      @filesize = @bufpos = 0
      req = @buffer = null

      @start()

      req = (if @url.startsWith "https" then https else http).get @url, (res) =>
        @buffers = []
        if 200 isnt res.statusCode
          res.destroy()
          console.error "Download failed for #{@filename} with code #{res.statusCode}:\n#{res.statusMessage}"
          @fail()
          return

        if !path.extname @filename
          @filename = if res.headers["content-disposition"] then \
            path.basename res.headers["content-disposition"].split("filename=")[1] \
            else "to.do"  #TODO
          @filepath = path.join settings.dldir, @filename if !@prompt
          (@elem.querySelector "span").textContent = @filename

        @filesize = 0| res.headers["content-length"]

        @progress()

        res.on "data", (chunk) =>
          @buffers.push chunk
          @bufpos += Buffer.byteLength chunk
          @progress()
          return

        res.on "end", =>
          if @filesize and @filesize isnt @bufpos
            console.error "Download failed for #{@filename}: #{@filesize}bytes announced, #{@bufpos}bytes received!"
            @fail()
            return
          @buffer = Buffer.concat @buffers, @bufpos
          @filesize = @bufpos
          delete @buffers
          @finish()
          return

      req.on "error", (error) =>
        console.error error
        @fail()
        return

      req.end()
      return
    # cunstructor

    start: (write = true) ->
      @started = true

      cache.set @url, this if write

      @elem = document.createElement "div"
      @elem.className = "file"
      @elem.innerHTML =
        """<span></span>
        <svg viewBox="0 0 26 26">
            <path d="M20 7.41L18.59 6 13 11.59 7.41 6 6 7.41 11.59 13 6 18.59 7.41 20 13 14.41 18.59 20 20 18.59 14.41 13 20 7.41z"/>
        </svg>
        """
      @pb = document.createElement "div"
      @pb.className = "progress-bar"
      @elem.appendChild @pb
      span = @elem.querySelector "span"
      span.textContent = @filename
      svg = @elem.querySelector "svg"
      span.onclick = (event) =>
        if @finished
          @open()
        else
          @elem.classList.add "will-open"
          @openWhenFinished = true
          @showinstead = false
        event.preventDefault()
        false
      span.oncontextmenu = (event) =>
        if @finished
          @show()
        else
          @elem.classList.add "will-open"
          @openWhenFinished = @showinstead = true
        event.preventDefault()
        false
      svg.onclick = (event) =>
        @elem.remove()
        @elem.inDOM = false
        delete @buffer if @finished
        Download.updateFileWidth()
        event.preventDefault()
        false

      downloadbar.appendChild @elem
      @elem.inDOM = true
      Download.updateFileWidth()
      return
    # start

    progress: ->
      @pb.style = "width: calc((100% + 2px) * #{@bufpos / @filesize});"
      return

    finish: (write = true) ->
      if @copyWhenFinished
        clipboard.write image: nativeImage.createFromBuffer @buffer
      if write
        if @install
          @filepath = switch @filename[(lastButOneIndexOf @filename, ".")...]
            when ".plugin.js" then path.join pPlugins, @filename
            when ".theme.css" then path.join pThemes, @filename
            else
              @install = false
              @filepath
        if (1 isnt write) and not @install and ((@prompt and not @filepath) or (not @overwrite and fs.existsSync @filepath))
          directDownload.chooseFile (@filepath or path.join settings.dldir, @filename), (file) =>
            unless file
              @fail()
              return
            @filepath = file
            @filename = path.basename file
            (@elem.querySelector "span").textContent = @filename
            @finish 1
            return
          return
        fs.writeFile @filepath, @buffer, (error) =>
          if error
            console.error error
            @fail()
            return
          @elem.classList.remove "will-open"
          @elem.classList.add "done"
          @finished = true
          delete @buffer if !@elem.inDOM
          console.log "File saved to #{@filepath}."
          if @install
            cache.clear @url    # so you can update with the same url
          else
            cache.set @url, this
          if @openWhenFinished
            if @showinstead
              @show()
            else
              @open()
          return
        return
      @elem.classList.remove "will-open"
      @elem.classList.add "done"
      delete @buffer unless @elem.inDOM
      if @openWhenFinished
        if @showinstead
          @show()
        else
          @open()
      return

    fail: ->
      cache.clear @url
      @failed = true
      @elem.classList.add "failed"
      return

    open: ->
      shell.openItem @filepath
      return

    show: ->
      shell.showItemInFolder @filepath
      return

    @updateFileWidth = ->
      numFiles = downloadbar.querySelectorAll(".file").length
      downloadbar.style.setProperty "--numFiles", numFiles
      return

    @css = """
      #files_directDownload {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 25px;
        overflow: hidden;
        font-size: 0;
      }
      #files_directDownload:empty {
        display: none;
      }
      #files_directDownload .file {
        height: 100%;
        width: 200px;
        min-width: 50px;
        max-width: calc((100% + 2px) / var(--numFiles) - 2px);
        background: rgba(128,128,128,0.2);
        display: inline-block;
        margin-left: 2px;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.3);
        border: 1px solid rgba(128,128,128,0.2);
        border-bottom: none;
        box-sizing: border-box;
        position: relative;
        cursor: pointer;
      }
      #files_directDownload .file:first-of-type {
        border-top-left-radius: 4px;
        margin: 0;
      }
      #files_directDownload .file:last-of-type {
        border-top-right-radius: 4px;
      }
      #files_directDownload .file.will-open {
        background: rgba(128,128,128,0.4);
      }
      #files_directDownload span {
        width: calc(100% + 2px);
        overflow: hidden;
        text-overflow: ellipsis;
        color: #87909C;
        /*display: inline-block;*/
        position: absolute;
        left: -1px;
        top: -1px;
        font-size: 14px;
        line-height: 23px;
        padding: 0 18px 0 4px;
        box-sizing: border-box;
      }
      #files_directDownload .file .progress-bar {
        position:absolute;
        height: 2px;
        bottom: 0;
        left: -1px;
        background: rgb(32,196,64);
      }
      #files_directDownload .file.failed .progress-bar {
        background: rgb(196,64,32);
        min-width: calc(100% + 2px);
      }
      #files_directDownload .file.done .progress-bar {
        min-width: calc(100% + 2px);
      }
      #files_directDownload .file svg {
        fill: rgba(0,0,0,0.5);
        position: absolute;
        top: -1px;
        right: -1px;
        height: 23px;
        width: 23px;
      }

      #friends {
        position: relative;
      }

      .#{classNames.attachment} {
        cursor: pointer;
      }"""
  # Download

  cache = new class
    constructor: ->
      # clean cache on startup
      count = 0
      needsUpdate = false
      for url of _cache
        count++
        @verify url, (valid) ->
          needsUpdate or= !valid
          updateLs() if 0 is --count and needsUpdate
          return

    get: (url, cb) ->
      unless (f = _cache[url])?
        cb()
        return
      if f.dl?.buffer?
        cb f.dl
        return
      @verify url, (valid) ->
        unless valid
          cb()
          return
        fs.readFile f.path, (err, data) ->
          if err
            cb()
            return
          f.dl = new Download data, f
          cb f.dl
          return
        return
      return

    set: (url, dl) ->
      _cache[url] = new CacheEntry url, dl
      return

    clear: (url) ->
      delete _cache[url]
      updateLs()
      return

    verify: (url, cb) ->
      unless (f = _cache[url])?
        cb false
        return
      fs.lstat f.path, (err, stats) ->
        if err or f.timestamp isnt stats.mtime.getTime()
          delete _cache[url]
          cb false
          return
        cb true
        return
      return


    # _cacheLs = localStorage.directDownloadCache or {}
    cachepath = switch process.platform
      when "win32" then path.join process.env.temp, "/BDdirectDownloadCache.json"
      when "darwin" then path.join process.env.TMPDIR, "/BDdirectDownloadCache.json"
      else "/tmp/BDdirectDownloadCache.json"
    try _cacheLs = JSON.parse fs.readFileSync cachepath, "utf8"
    catch e then _cacheLs = {}

    _cache = _cacheLs
    _cache[url].url = url for url of _cache

    updateLs = ->
      _cacheLs = {}
      for url, f of _cache
        fLs = {}
        for k of f when k not in ["dl", "url"]
          fLs[k] = f[k]
        continue if fLs.tbd
        _cacheLs[url] = fLs
      # localStorage.directDownloadCache = _cacheLs
      fs.writeFileSync cachepath, JSON.stringify _cacheLs
      return

    CacheEntry = (@url, @dl) ->
      @path = @dl.filepath
      @tbd = true
      return unless @dl.finished
      fs.lstat @path, (err, stats) =>
        delete @tbd
        if err
          delete _cache[@url]
          return
        @timestamp = stats.mtime.getTime()
        updateLs()
        return
      return this
  # cache

  _fr = exports: {}
  {http, https} = _fr = ```(function(exports, module){
    /* https://github.com/olalonde/follow-redirects */
    'use strict';
    var url = require('url');
    var assert = require('assert');
    var http = require('http');
    var https = require('https');
    var Writable = require('stream').Writable;
    /*var debug = require('debug')('follow-redirects');*/

    var nativeProtocols = {'http:': http, 'https:': https};
    var schemes = {};
    var exports = module.exports = {
    	maxRedirects: 21
    };
    var safeMethods = {GET: true, HEAD: true, OPTIONS: true, TRACE: true};
    var eventHandlers = Object.create(null);
    ['abort', 'aborted', 'error', 'socket'].forEach(function (event) {
    	eventHandlers[event] = function (arg) {
    		this._redirectable.emit(event, arg);
    	};
    });
    function RedirectableRequest(options, responseCallback) {
    	Writable.call(this);
    	this._options = options;
    	this._redirectCount = 0;
    	this._bufferedWrites = [];
    	if (responseCallback) {
    		this.on('response', responseCallback);
    	}
    	var self = this;
    	this._onNativeResponse = function (response) {
    		self._processResponse(response);
    	};
    	if (!options.pathname && options.path) {
    		var searchPos = options.path.indexOf('?');
    		if (searchPos < 0) {
    			options.pathname = options.path;
    		} else {
    			options.pathname = options.path.substring(0, searchPos);
    			options.search = options.path.substring(searchPos);
    		}
    	}
    	this._performRequest();
    }
    RedirectableRequest.prototype = Object.create(Writable.prototype);
    RedirectableRequest.prototype._performRequest = function () {
    	var protocol = this._options.protocol;
    	if (this._options.agents) {
    		this._options.agent = this._options.agents[schemes[protocol]];
    	}
    	var nativeProtocol = nativeProtocols[protocol];
    	var request = this._currentRequest =
    				nativeProtocol.request(this._options, this._onNativeResponse);
    	this._currentUrl = url.format(this._options);
    	request._redirectable = this;
    	for (var event in eventHandlers) {
    		if (event) {
    			request.on(event, eventHandlers[event]);
    		}
    	}
    	if (this._isRedirect) {
    		var bufferedWrites = this._bufferedWrites;
    		if (bufferedWrites.length === 0) {
    			request.end();
    		} else {
    			var i = 0;
    			(function writeNext() {
    				if (i < bufferedWrites.length) {
    					var bufferedWrite = bufferedWrites[i++];
    					request.write(bufferedWrite.data, bufferedWrite.encoding, writeNext);
    				} else {
    					request.end();
    				}
    			})();
    		}
    	}
    };
    RedirectableRequest.prototype._processResponse = function (response) {
    	var location = response.headers.location;
    	if (location && this._options.followRedirects !== false &&
    			response.statusCode >= 300 && response.statusCode < 400) {
    		if (++this._redirectCount > this._options.maxRedirects) {
    			return this.emit('error', new Error('Max redirects exceeded.'));
    		}
    		var header;
    		var headers = this._options.headers;
    		if (response.statusCode !== 307 && !(this._options.method in safeMethods)) {
    			this._options.method = 'GET';
    			this._bufferedWrites = [];
    			for (header in headers) {
    				if (/^content-/i.test(header)) {
    					delete headers[header];
    				}
    			}
    		}
    		if (!this._isRedirect) {
    			for (header in headers) {
    				if (/^host$/i.test(header)) {
    					delete headers[header];
    				}
    			}
    		}
    		var redirectUrl = url.resolve(this._currentUrl, location);
    		/*debug('redirecting to', redirectUrl);*/
    		Object.assign(this._options, url.parse(redirectUrl));
    		this._isRedirect = true;
    		this._performRequest();
    	} else {
    		response.responseUrl = this._currentUrl;
    		this.emit('response', response);
    		delete this._options;
    		delete this._bufferedWrites;
    	}
    };
    RedirectableRequest.prototype.abort = function () {
    	this._currentRequest.abort();
    };
    RedirectableRequest.prototype.flushHeaders = function () {
    	this._currentRequest.flushHeaders();
    };
    RedirectableRequest.prototype.setNoDelay = function (noDelay) {
    	this._currentRequest.setNoDelay(noDelay);
    };
    RedirectableRequest.prototype.setSocketKeepAlive = function (enable, initialDelay) {
    	this._currentRequest.setSocketKeepAlive(enable, initialDelay);
    };
    RedirectableRequest.prototype.setTimeout = function (timeout, callback) {
    	this._currentRequest.setTimeout(timeout, callback);
    };
    RedirectableRequest.prototype.write = function (data, encoding, callback) {
    	this._currentRequest.write(data, encoding, callback);
    	this._bufferedWrites.push({data: data, encoding: encoding});
    };
    RedirectableRequest.prototype.end = function (data, encoding, callback) {
    	this._currentRequest.end(data, encoding, callback);
    	if (data) {
    		this._bufferedWrites.push({data: data, encoding: encoding});
    	}
    };
    Object.keys(nativeProtocols).forEach(function (protocol) {
    	var scheme = schemes[protocol] = protocol.substr(0, protocol.length - 1);
    	var nativeProtocol = nativeProtocols[protocol];
    	var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);
    	wrappedProtocol.request = function (options, callback) {
    		if (typeof options === 'string') {
    			options = url.parse(options);
    			options.maxRedirects = exports.maxRedirects;
    		} else {
    			options = Object.assign({
    				maxRedirects: exports.maxRedirects,
    				protocol: protocol
    			}, options);
    		}
    		assert.equal(options.protocol, protocol, 'protocol mismatch');
    		/*debug('options', options);*/

    		return new RedirectableRequest(options, callback);
    	};
    	wrappedProtocol.get = function (options, callback) {
    		var request = wrappedProtocol.request(options, callback);
    		request.end();
    		return request;
    	};
    });
  return module.exports})(_fr.exports, _fr)```
