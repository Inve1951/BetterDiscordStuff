//META { "name": "botInfo" } *//
var botInfo,
    boundMethodCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

botInfo = function () {
  var BotInfoComponent, DMChannelHandler, Parser, React, UserPopoutComponent, UserStore, cancels, css, defineBotInfoComponent, infoCache, log, request;

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
      return "1.0.0";
    }

    load() {}

    async start() {
      var DI, Filters, ReactComponents, Renderer, WebpackModules, minDI;
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
      ({ Filters, ReactComponents, Renderer, React, WebpackModules } = DI);
      if (BotInfoComponent == null) {
        defineBotInfoComponent();
      }
      if (UserPopoutComponent == null) {
        UserPopoutComponent = await ReactComponents.setName("UserPopout", Filters.byCode(/\.default\.userPopout/, function (c) {
          var ref;
          return (ref = c.prototype) != null ? ref.render : void 0;
        }));
      }
      //UserModalHandler = WebpackModules.findByUniqueProperties ["open", "close", "fetchMutualFriends"]
      if (Parser == null) {
        Parser = WebpackModules.findByUniqueProperties(["createRules", "parserFor"]);
      }
      if (UserStore == null) {
        UserStore = WebpackModules.findByUniqueProperties(["getUser", "getCurrentUser"]);
      }
      if (DMChannelHandler == null) {
        DMChannelHandler = WebpackModules.findByUniqueProperties(["openPrivateChannel", "ensurePrivateChannel"]);
      }
      cancels.push(Renderer.patchRender(UserPopoutComponent, [{
        selector: {
          className: "body-3rkFrF"
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

  UserPopoutComponent = Parser = UserStore = DMChannelHandler = cancels = BotInfoComponent = React = null;

  infoCache = {};

  request = require("request");

  log = function (msg) {
    console.log(msg);
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
          // await get botinfo
          info = await new Promise(function (c, r) {
            return request(`https://discordbots.org/api/bots/${id}`, function (e, { statusCode }, msg) {
              if (e) {
                return c({
                  error: e
                });
              }
              return c(function () {
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
              { className: "botInfo-inner bodyTitle-yehI7c marginBottom8-1mABJ4 size12-1IGJl9 weightBold-2qbcng" },
              "Bot Info"
            ),
            React.createElement(
              "div",
              { className: "botInfo-inner endBodySection-1WYzxu marginBottom20-2Ifj-2" },
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
              ), info.invite && React.createElement(
                "a",
                Object.assign({ className: "invite", key: "invite", href: info.invite }, defaultLinkProps),
                "Invite"
              ), info.github && React.createElement(
                "a",
                Object.assign({ className: "github", key: "github", href: info.gitub }, defaultLinkProps),
                "Github"
              ), info.website && React.createElement(
                "a",
                Object.assign({ className: "website", key: "website", href: info.website }, defaultLinkProps),
                "Website"
              ), ((ref = info.owners) != null ? ref.length : void 0) && React.createElement(
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
                  { type: "button", className: "member-role member-role-add", onClick: this.retry },
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
              username = await new Promise((c, r) => {
                return request(`https://discordbots.org/api/users/${this.props.userId}`, (e, { statusCode }, msg) => {
                  if (statusCode === 200) {
                    try {
                      return c(JSON.parse(msg).username);
                    } catch (error) {}
                  }
                  return c(`<@!${this.props.userId}>`);
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
          //UserModalHandler.open id
          ownId = UserStore.getCurrentUser().id;
          try {
            // await DMChannelHandler.ensurePrivateChannel ownId, id
            await DMChannelHandler.openPrivateChannel(ownId, id);
          } catch (error) {}
        };

        return FakeMentionComponent;
      }();

      return BotInfoComponent;
    }();
  };

  css = ".botInfo {\n  color: #99aab5;\n  font-size: 13px;\n}\n.theme-dark .botInfo {\n  color: #b9bbbe;\n}\n.botInfo .desc {\n  cursor: pointer;\n}\n.botInfo .more {\n  margin-left: 4px;\n  opacity: 0.5;\n}\n.botInfo a {\n  color: #00b0f4;\n  margin-right: 4px;\n}\n.theme-dark .botInfo a {\n  color: #0096cf;\n}\n.botInfo button {\n  background-color: #f3f3f3;\n  border: 1px solid #dbdde1;\n  border-radius: 3px;\n  color: #737f8d;\n  font-size: 12px;\n}\n.theme-dark .botInfo button {\n  background-color: #2f3136;\n  border-color: #72767d;\n  color: #b9bbbe;\n}";

  return botInfo;
}();