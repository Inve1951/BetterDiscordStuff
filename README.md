# BetterDiscordStuff
my BD plugins & themes, focused on enhancing user experience

------------------------

I mostly write my plugins in [coffeescript](http://coffeescript.org/).<br/>
I will release the source of fully featured (finished) code in [coffee/](coffee/).

available source files:
* [Bot Info](coffee/botInfo.plugin.coffee)
* [Local File Server](coffee/localFileServer.plugin.coffee)
* [Toggle-Your-Stuff](coffee/toggleYourStuff.plugin.coffee)

------------------------

## plugins:

  **[Restart No More](plugins/restartNoMore.plugin.js)** _alpha version_
  
    Live-updates your themes and plugins. Especially useful during development.

  **[Direct-Download](plugins/directDownload.plugin.js)** _alpha version_
  
    Download attached files directly within discord.
    New: download and install themes and plugins from `betterdiscord.net` links.

  **[Force-Close](plugins/forceClose.plugin.js)**
  
    Actually closes discord when clicking the close button.
    Obsolete as of 12.12.17. Discord got this built-in now. See window settings in client.

  **[Clear-Input-on-Escape](plugins/clearInputOnEsc.plugin.js)**
  
    Clears the chat input when you hit escape inside it.

  **[Link-Profile-Picture](plugins/linkProfilePicture.plugin.js)**
  
    Lets you click users' avatars on their profile page to view a bigger version in your browser.

  **[Toggle-Your-Stuff](plugins/toggleYourStuff.plugin.js)**
  
    Toggle your plugins and themes using hotkeys.

  **[Minimize-Shortcut](plugins/minimizeShortcut.plugin.js)**
  
    Provides you with a shortcut to show/hide/minimize discord.

  **[Autocomplete-Hover-Fix](plugins/autocompleteHoverFix.plugin.js)**
  
    If the autocompletion menu selects entries without your doing then this is for you.

  **[More obvious DMs](plugins/moreObviousDMs.plugin.js)**
  
    Flashes the discord taskbar icon and window upon receiving a DM until discord receives mouse or window focus.
    This makes it easier to spot DMs after leaving a fullscreen application.

  **[Status Css](plugins/statusCss.plugin.js)** _css helper_
  
    Adds your status to <body> class list so you can style with it.
    `.own-status-online`, `.own-status-dnd`, etc.

  **[Discord Experiments](plugins/discordexperiments.plugin.js)**
  
    Enables the experiments tab in discord's settings.
    Depends on samogot's Discord Internals Library, so install that too. (https://github.com/samogot/betterdiscord-plugins/blob/master/v1/1lib_discord_internals.plugin.js)

  **[Enable React-Devtools](plugins/enableReactDevtools.plugin.js)**
  
    Automatically loads the React Devtools for you.
    Requires React-Devtools being installed in your chrome browser (https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

  **[Scroll-To-Last](plugins/scrollToLast.plugin.js)**
  
    Always scroll to last message when entering a channel.

  **[Bot Info](plugins/botInfo.plugin.js)**
  
    Shows bots' infos from `discordbots.org`.
    Depends on samogot's Discord Internals Library, so install that too. (https://github.com/samogot/betterdiscord-plugins/blob/master/v1/1lib_discord_internals.plugin.js)

  **[Local File Server](plugins/localFileServer.plugin.js)**
  
    Hosts a selected folder so you can use local files in your theme.

  **[Channel History](plugins/channelHistory.plugin.js)**
  
    Allows you to switch channels using mouse 4 & 5 buttons.

------------------------

## themes:

  **[Drag-Fix](themes/dragfix.theme.css)** _mini-theme_
  
    Makes it way easier to move the window.
    Obsolete since the titlebar update but still useful together with the old-titlebar plugin (https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/OldTitleBar)

  **[Show-URLs](/themes/showURLs.theme.css)** _mini-theme_
  
    Shows a link's URL in bottom left corner much like a browser does.

  **[Compact-User-List](/themes/compactUserList.theme.css)** _mini-theme_
  
    Makes the user list look much like the server list.
    Works great with RadialStatus. (https://github.com/rauenzi/BetterDiscordAddons/tree/master/Themes/RadialStatus)

  **[Horizontal Serverlist](/themes/horizontalServerlist.theme.css)** _mini-theme_
  
    I've always wanted this :3
    Server Grid support can be enabled in the file.




