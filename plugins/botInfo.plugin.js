//META { "name": "botInfo" } *//
var botInfo,
    boundMethodCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

botInfo = function () {
  var BotInfoComponent, DI, ExternalLinkComponent, PrivateChannelActions, React, UserPopoutComponent, UserStore, cancels, css, defineBotInfoComponent, getUserPopoutComponent, infoCache, log, request;

  class botInfo {
    getName() {
      return "Bot Info";
    }

    getDescription() {
      return "Shows bots' infos from `discordbots.org`. Depends on samogot's Discord Internals Library: https://git.io/v7Sfp";
    }

    getAuthor() {
      return "square";
    }

    getVersion() {
      return "1.0.3";
    }

    load() {}

    async start() {
      var Filters, Renderer, WebpackModules, minDI;
      cancels = [];
      DI = window.DiscordInternals;
      minDI = "1.6";
      if (!(0 <= (DI != null ? DI.versionCompare(DI.version, minDI) : void 0))) {
        alert(`DiscordInternals ${minDI} or higher not found. Please update or install it. (https://git.io/v7Sfp)`);
        return;
      }
      minDI = "1.8";
      if (!(0 <= (DI != null ? DI.versionCompare(DI.version, minDI) : void 0))) {
        log(`DiscordInternals ${minDI} or higher not found. Update recommended! (https://git.io/v7Sfp)`);
      }
      BdApi.injectCSS("bot-info", css);
      ({ Filters, Renderer, React, WebpackModules } = DI);
      if (BotInfoComponent == null) {
        defineBotInfoComponent();
      }
      if (UserPopoutComponent == null) {
        UserPopoutComponent = await getUserPopoutComponent();
      }
      if (UserStore == null) {
        UserStore = WebpackModules.findByUniqueProperties(["getUser", "getCurrentUser"]);
      }
      if (PrivateChannelActions == null) {
        PrivateChannelActions = WebpackModules.findByUniqueProperties(["openPrivateChannel", "ensurePrivateChannel"]);
      }
      if (ExternalLinkComponent == null) {
        ExternalLinkComponent = WebpackModules.find(Filters.byCode(/\.trusted\b/));
      }
      cancels.push(Renderer.patchRender(UserPopoutComponent, [{
        selector: {
          className: "body-3iLsc4"
        },
        method: "prepend",
        content: function (_this) {
          return React.createElement(BotInfoComponent, { user: _this.props.user });
        }
      }]));
    }

    stop() {
      var c, j, len;
      BdApi.clearCSS("bot-info");
      for (j = 0, len = cancels.length; j < len; j++) {
        c = cancels[j];
        c();
      }
    }

  };

  UserPopoutComponent = UserStore = PrivateChannelActions = cancels = BotInfoComponent = ExternalLinkComponent = React = DI = null;

  infoCache = {};

  request = require("request");

  log = function (msg) {
    console.log(msg);
  };

  getUserPopoutComponent = function () {
    return new Promise(function (resolve) {
      var observer;
      observer = new MutationObserver(function ([{ addedNodes }]) {
        var component, firstChild, j, len, ref, userPopout;
        for (j = 0, len = addedNodes.length; j < len; j++) {
          ({ firstChild } = addedNodes[j]);
          if (!(firstChild != null ? (ref = firstChild.classList) != null ? ref.contains("userPopout-3XzG_A") : void 0 : void 0)) {
            continue;
          }
          userPopout = firstChild;
          break;
        }
        if (userPopout != null) {
          observer.disconnect();
          component = DI.getInternalInstance(userPopout).return.stateNode.constructor;
          if (component.displayName == null) {
            component.displayName = "UserPopout";
          }
          resolve(component);
        }
      });
      observer.observe(document.querySelector("#app-mount > .popouts-3dRSmE"), {
        childList: true
      });
    });
  };

  defineBotInfoComponent = function () {
    BotInfoComponent = function () {
      var FakeMentionComponent, defaultLinkProps, usernames;

      class BotInfoComponent extends React.Component {
        handleOnClick() {
          boundMethodCheck(this, BotInfoComponent);
          return this.setState(function ({ collapsed }) {
            return {
              collapsed: !collapsed
            };
          });
        }

        retry(e) {
          boundMethodCheck(this, BotInfoComponent);
          e.stopPropagation();
          delete infoCache[this.props.user.id];
          this.setState({
            loading: true
          });
          this.componentWillMount();
        }

        constructor(props) {
          super(props);
          this.handleOnClick = this.handleOnClick.bind(this);
          this.retry = this.retry.bind(this);
          this.state = {
            loading: infoCache[props.user.id] == null,
            collapsed: true
          };
        }

        async componentWillMount() {
          var bot, id, info;
          ({ bot, id } = this.props.user);
          if (!bot || infoCache[id] != null) {
            return;
          }
          info = await new Promise(function (resolve) {
            return request(`https://discordbots.org/api/bots/${id}`, function (e, { statusCode }, msg) {
              if (e) {
                return resolve({
                  error: e
                });
              }
              return resolve(function () {
                try {
                  return JSON.parse(statusCode === 200 || statusCode === 404 ? msg : void 0);
                } catch (error) {
                  e = error;
                  return {
                    error: e
                  };
                }
              }());
            });
          });
          infoCache[id] = info;
          this.setState({
            loading: false
          });
        }

        render() {
          var collapsed, info, loading, ref, ref1, user;
          user = this.props.user;
          if (!user.bot) {
            return null;
          }
          info = infoCache[user.id];
          ({ loading, collapsed } = this.state);
          return React.createElement(
            "div",
            { className: "botInfo" },
            React.createElement(
              "div",
              { className: "botInfo-inner bodyTitle-Y0qMQz marginBottom8-AtZOdT size12-3R0845 weightBold-2yjlgw" },
              "Bot Info"
            ),
            React.createElement(
              "div",
              { className: "botInfo-inner endBodySection-Rf4s-7 marginBottom20-32qID7" },
              loading ? React.createElement(
                "span",
                { className: "loading" },
                "loading..."
              ) : info != null && info.error == null ? collapsed ? React.createElement(
                "div",
                { className: "desc shortdesc", onClick: this.handleOnClick },
                info.shortdesc,
                React.createElement(
                  "span",
                  { className: "more" },
                  "more..."
                )
              ) : [React.createElement(
                "div",
                { className: "desc", onClick: this.handleOnClick },
                info.longdesc
              ), info.invite && React.createElement(ExternalLinkComponent, { className: "invite", key: "invite", href: info.invite, title: "Invite" }), info.github && React.createElement(ExternalLinkComponent, { className: "github", key: "github", href: info.github, title: "Github" }), info.website && React.createElement(ExternalLinkComponent, { className: "website", key: "website", href: info.website, title: "Website" }), ((ref = info.owners) != null ? ref.length : void 0) && React.createElement(
                "div",
                { className: "owners" },
                `Owner${info.owners.length > 1 ? "s" : ""}: `,
                info.owners.map(function (owner, i) {
                  return [React.createElement(FakeMentionComponent, { key: owner, userId: owner }), i + 1 < info.owners.length && ", "];
                })
              )] : React.createElement(
                "div",
                { className: "error" },
                `Error: ${(ref1 = info != null ? info.error : void 0) != null ? ref1 : "unknown"} `,
                React.createElement(
                  "button",
                  { type: "button", className: "addButton-pcyyf6 weightMedium-2iZe9B", onClick: this.retry },
                  "Retry"
                )
              )
            )
          );
        }

      };

      BotInfoComponent.displayName = "BotInfo";

      defaultLinkProps = {
        rel: "norefferer",
        target: "_blank"
      };

      usernames = {};

      FakeMentionComponent = function () {
        var handleOnClick;

        class FakeMentionComponent extends React.Component {
          constructor(props) {
            var ref, ref1;
            super(props);
            this.state = {
              username: (ref = (ref1 = UserStore.getUser(props.userId)) != null ? ref1.username : void 0) != null ? ref : usernames[props.userId]
            };
          }

          async componentWillMount() {
            var username;
            if (this.state.username == null) {
              username = await new Promise(resolve => {
                return request(`https://discordbots.org/api/users/${this.props.userId}`, (e, { statusCode }, msg) => {
                  if (statusCode === 200) {
                    try {
                      return resolve(JSON.parse(msg).username);
                    } catch (error) {}
                  }
                  return resolve(`<@!${this.props.userId}>`);
                });
              });
              this.setState({ username });
              usernames[this.props.userId] = username;
            }
          }

          render() {
            var ref;
            return React.createElement(
              "span",
              { className: "mention", onClick: handleOnClick.bind(null, this.props.userId) },
              (ref = this.state.username) != null ? ref : `<@!${this.props.userId}>`
            );
          }

        };

        FakeMentionComponent.displayName = "FakeMention";

        handleOnClick = async function (id, e) {
          var ownId;
          e.stopPropagation();
          ownId = UserStore.getCurrentUser().id;
          try {
            await PrivateChannelActions.openPrivateChannel(ownId, id);
          } catch (error) {}
        };

        return FakeMentionComponent;
      }.call(this);

      return BotInfoComponent;
    }.call(this);
  };

  css = ".botInfo {\n  color: #99aab5;\n  font-size: 13px;\n}\n.theme-dark .botInfo {\n  color: #b9bbbe;\n}\n.botInfo .desc {\n  cursor: pointer;\n}\n.botInfo .more {\n  margin-left: 4px;\n  opacity: 0.5;\n}\n.botInfo a {\n  color: #00b0f4;\n  margin-right: 4px;\n}\n.theme-dark .botInfo a {\n  color: #0096cf;\n}\n.botInfo button {\n  background-color: transparent;\n  border: 1px solid #dbdde1;\n  border-radius: 3px;\n  color: #737f8d;\n  font-size: 12px;\n  line-height: 12px;\n}\n.theme-dark .botInfo button {\n  border-color: #72767d;\n  color: #b9bbbe;\n}";

  return botInfo;
}.call(this);