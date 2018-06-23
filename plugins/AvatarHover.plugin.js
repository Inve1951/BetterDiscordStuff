//META { "name": "AvatarHover" } *//
global.AvatarHover = function () {
  var css, defaultSettings, getSettings, handleFocusLoss, handleKeyUpDown, handleMouseOverOut, hoverCard, initContainer, lastTarget, makeInput, pressed, qualifier, settings, updateHoverCard, updateQualifier;

  class AvatarHover {
    getName() {
      return "Avatar Hover";
    }

    getDescription() {
      return "When hovering, resize the avatar. Use Ctrl / Ctrl+Shift.";
    }

    getAuthor() {
      return "noVaLue, square";
    }

    getVersion() {
      return "0.4.0";
    }

    load() {}

    start() {
      getSettings();
      updateQualifier();
      BdApi.injectCSS("css-AvatarHover", css);
      initContainer();
      document.addEventListener("keydown", handleKeyUpDown, true);
      document.addEventListener("keyup", handleKeyUpDown, true);
      document.addEventListener("mouseover", handleMouseOverOut, true);
      document.addEventListener("mouseout", handleMouseOverOut, true);
      return document.addEventListener("blur", handleFocusLoss, true);
    }

    stop() {
      document.removeEventListener("keydown", handleKeyUpDown, true);
      document.removeEventListener("keyup", handleKeyUpDown, true);
      document.removeEventListener("mouseover", handleMouseOverOut, true);
      document.removeEventListener("mouseout", handleMouseOverOut, true);
      document.removeEventListener("blur", handleFocusLoss, true);
      hoverCard.remove();
      return BdApi.clearCSS("css-AvatarHover");
    }

    static updateSettings() {
      var checked, i, len, name, ref, type, value;
      ref = document.querySelectorAll("#settings_AvatarHover input");
      for (i = 0, len = ref.length; i < len; i++) {
        ({ name, type, value, checked } = ref[i]);
        settings[name] = "checkbox" === type ? checked : value || defaultSettings[name];
      }
      bdPluginStorage.set("AvatarHover", "settings", settings);
      return updateQualifier();
    }

    getSettingsPanel() {
      var k, v;
      getSettings();
      return `<div id="settings_AvatarHover">${function () {
        var ref, results;
        ref = {
          avatarBackgroundColor: "Background color",
          avatarBorderRadius: "Border radius",
          avatarBorderSize: "Border size",
          avatarBorderColor: "Border color",
          spacer: null,
          isShown: "Force-show avatar",
          isLarge: "Force large avatar",
          isHoverGuilds: "Guilds",
          isHoverChannels: "Channels / DM users",
          isHoverFriends: "Friends list",
          isHoverChatMessages: "Chat messages",
          isHoverChatUsers: "Chat users"
        };
        results = [];
        for (k in ref) {
          v = ref[k];
          results.push(makeInput(k, v));
        }
        return results;
      }().join("")}</div>`;
    }

  };

  hoverCard = null;

  initContainer = function () {
    hoverCard = document.createElement("div");
    return hoverCard.id = "AvatarHover";
  };

  qualifier = null;

  updateQualifier = function () {
    return qualifier = [settings.isHoverGuilds ? ".icon-3o6xvg" : void 0, settings.isHoverChannels ? ".avatarDefault-35WC3R, .avatarSpeaking-1wJCNq, .channel .avatar-small" : void 0, settings.isHoverFriends ? "#friends .avatar-small, .activityFeed-28jde9 .image-33JSyf" : void 0, settings.isHoverChatMessages ? ".message-group .avatar-large, .embedAuthorIcon--1zR3L" : void 0, settings.isHoverChatUsers ? ".membersWrap-2h-GB4 .image-33JSyf" : void 0].filter(function (s) {
      return s != null;
    }).join(", ");
  };

  pressed = [false, false];

  handleKeyUpDown = function ({ type, key }) {
    var ctrlShift;
    if (-1 === (ctrlShift = ["Control", "Shift"].indexOf(key))) {
      return;
    }
    if (pressed[ctrlShift] === (pressed[ctrlShift] = "keydown" === type)) {
      return;
    }
    return updateHoverCard();
  };

  handleFocusLoss = function () {
    pressed = [false, false];
    return updateHoverCard();
  };

  handleMouseOverOut = function ({ type, target }) {
    if (!target.matches(qualifier)) {
      return;
    }
    return updateHoverCard("mouseover" === type && target);
  };

  lastTarget = null;

  updateHoverCard = function (target = lastTarget) {
    var boundsTarget, boundsWindow, isLarge, isShown, k, left, ref, size, top, v;
    lastTarget = target;
    [isShown, isLarge] = pressed;
    isShown || (isShown = settings.isShown);
    isLarge || (isLarge = settings.isLarge);
    if (!(isShown && target)) {
      return hoverCard.remove();
    }
    size = isLarge && 256 || 128;
    boundsTarget = target.getBoundingClientRect();
    boundsWindow = {
      width: innerWidth,
      height: innerHeight
    };
    left = Math.max(0, boundsTarget.left + (boundsTarget.width - size) / 2);
    if (left + boundsTarget.width > boundsWindow.width) {
      left = boundsWindow.width - boundsTarget.width;
    }
    top = boundsWindow.height - boundsTarget.height < boundsTarget.top ? boundsTarget.top - size : boundsTarget.bottom;
    ref = {
      backgroundColor: settings.avatarBackgroundColor,
      backgroundImage: getComputedStyle(target).backgroundImage.replace(/\?size=\d{3,4}/, `?size=${size}`),
      borderColor: settings.avatarBorderColor,
      borderRadius: settings.avatarBorderRadius,
      borderWidth: settings.avatarBorderSize,
      width: `${size}px`,
      height: `${size}px`,
      top: `${top}px`,
      left: `${left}px`
    };
    for (k in ref) {
      v = ref[k];
      hoverCard.style[k] = v;
    }
    if ("none" === hoverCard.style.backgroundImage) {
      return hoverCard.remove();
    }
    return document.body.appendChild(hoverCard);
  };

  defaultSettings = {
    avatarBackgroundColor: "#303336",
    avatarBorderRadius: "4px",
    avatarBorderSize: "1px",
    avatarBorderColor: "black",
    isShown: false,
    isLarge: false,
    isHoverGuilds: false,
    isHoverChannels: true,
    isHoverFriends: true,
    isHoverChatMessages: true,
    isHoverChatUsers: true
  };

  settings = null;

  getSettings = function () {
    var k, ref, results, v;
    if (settings != null) {
      return;
    }
    settings = (ref = bdPluginStorage.get("AvatarHover", "settings")) != null ? ref : {};
    results = [];
    for (k in defaultSettings) {
      v = defaultSettings[k];
      results.push(settings[k] != null ? settings[k] : settings[k] = v);
    }
    return results;
  };

  makeInput = function (name, label) {
    var _default, isCheckbox, type;
    if (label == null) {
      return "<br/>";
    }
    type = Boolean === defaultSettings[name].constructor && (isCheckbox = true) && "checkbox" || "text";
    _default = isCheckbox ? settings[name] ? "checked" : "" : `placeholder="${defaultSettings[name]}" value="${settings[name]}"`;
    return `<label><input type="${type}" name="${name}" ${_default} onChange="AvatarHover.updateSettings()"/> ${label}</label><br/>`;
  };

  css = "#AvatarHover {\n  background-size: cover;\n  border-style: solid;\n  display: block;\n  pointer-events: none;\n  position: fixed;\n  z-index: 99999;\n}\n#settings_AvatarHover {\n  color: #87909C;\n}";

  return AvatarHover;
}.call(this);