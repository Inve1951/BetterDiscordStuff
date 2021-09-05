# [BetterDiscordStuff](https://Inve1951.github.io/BetterDiscordStuff)

Made a simple site displaying my stuff in a better way than this readme ever could:<br/>
[Inve1951.github.io/BetterDiscordStuff](https://Inve1951.github.io/BetterDiscordStuff) - deprecated, see the [official BD homepage](https://betterdiscord.app) for current information

~~Want to buy me a coffee? Find my PayPal link on above site.~~  
**Safe your money.** PayPal randomly locked my account. They refuse to tell me why and refuse to restore my access to it.

------------------------

I mostly write my plugins in [coffeescript](http://coffeescript.org/).  
I will release the source of fully featured (finished) code in [coffee/](coffee/).

Available source files:
* [Avatar Hover](coffee/AvatarHover.plugin.coffee)
* now dead: [Bot Info](coffee/botInfo.plugin.coffee)
* [Local File Server](coffee/localFileServer.plugin.coffee)
* [Toggle Your Stuff](coffee/toggleYourStuff.plugin.coffee)
* [Quick Delete Messages](coffee/QuickDeleteMessages.plugin.coffee)
* [More Obvious DMs](coffee/moreObviousDMs.plugin.coffee)
* [Highlight Self](coffee/HighlightSelf.plugin.coffee)
* [Direct-Download](coffee/directDownload.plugin.coffee)

------------------------

## Plugins:

**[Restart No More](plugins/restartNoMore.plugin.js)** _obsolete_  
  ~~Live-updates your themes and plugins. Especially useful during development.~~  
  RNM functionality is now built into BetterDiscord.

**[Direct-Download](plugins/directDownload.plugin.js)**  
  Download attached files directly within discord.
  Optionally installs themes and plugins from `betterdiscord.net` links.

**[Force-Close](plugins/forceClose.plugin.js)** _obsolete_  
  ~~Actually closes discord when clicking the close button.~~  
  Discord got this built-in since 2017-12-12. See window settings in the client.

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

**[Enable React-Devtools](plugins/enableReactDevtools.plugin.js)**  
  Automatically loads the React Devtools for you.
  Requires [React-Devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) being installed in your chrome browser.

**[Scroll-To-Last](plugins/scrollToLast.plugin.js)**  
  Always scroll to last message when entering a channel.

**[Bot Info](plugins/botInfo.plugin.js)** _dead_  
  ~~Shows bots' infos from `discordbots.org` in user popouts.
  Depends on samogot's [Discord Internals Library](https://github.com/samogot/betterdiscord-plugins/blob/master/v1/1lib_discord_internals.plugin.js), so install that too.~~  
  Dead as of December 2018. discordbots.org's API changes disallow for continuation.

**[Local File Server](plugins/localFileServer.plugin.js)**  
  Hosts a selected folder so you can use local files in your theme.

**[Channel History](plugins/channelHistory.plugin.js)**  
  Allows you to switch channels using mouse 4 & 5 or the added GUI buttons.

**[Quick Delete Messages](plugins/QuickDeleteMessages.plugin.js)**  
  Hold Delete and click a Message to delete it.

**[Multi Instance](plugins/MultiInstance.plugin.js)**  
  Have several discord windows open same time. Ctrl+F12. (Cmd+F12 on osx)

**[Avatar Hover](plugins/AvatarHover.plugin.js)**  
  Shows large profile pictures in a popout/tooltip.

**[Character Counter](plugins/CharacterCounter.plugin.js)**  
  Adds a character counter to chat inputs.

**[Highlight Self](plugins/HighlightSelf.plugin.js)**  
  Highlights your own username in message headers.
  Especially awesome when using compact chat UI.

------------------------

## Themes:

**[Drag-Fix](themes/dragfix.theme.css)** _mini-theme, obsolete_  
  ~~Makes it way easier to move the window.~~  
  Obsolete since discord's titlebar update.

**[Show-URLs](/themes/showURLs.theme.css)** _mini-theme_  
  Shows links' URLs in bottom left corner much like a browser does.

**[Compact-User-List](/themes/compactUserList.theme.css)** _mini-theme_  
  Makes the user list look much like the server list.
  Works great with [RadialStatus](https://github.com/rauenzi/BetterDiscordAddons/tree/master/Themes/RadialStatus).

**[Horizontal Serverlist](/themes/horizontalServerlist.theme.css)** _mini-theme_, _obsolete_  
  ~~Server Grid support can be enabled in the file.~~  
  Discontinued in favor of [Gibbu's version](https://github.com/Gibbu/BetterDiscord-Themes/blob/master/HorizontalServerlist/zHorizontalServerlist.theme.css).

**[Ez Light](/themes/EzLight.theme.css)**  
  Easy light theme. Should also work in combination with most dark themes. Relies on discord's dark mode.
