//META { "name": "MultiInstance" } *//

var MultiInstance = function()  {
  let osx = "darwin" === process.platform,
    listener = ({code, ctrlKey, metaKey}) => code === "F12" && (osx ? metaKey : ctrlKey) && require("child_process").exec(osx
      ? `open -n -a "${process.argv0.split(".app")[0]}.app" --args --multi-instance`
      : `"${process.execPath}" --multi-instance`
    );

  return {
    getName:_=> "Multi Instance",
    getDescription:_=> `Have several discord windows open same time. ${osx ? "Cmd" : "Ctrl"}+F12.`,
    getAuthor:_=> "square",
    getVersion:_=> "1.0.2",
    load:_=>_,

    start:_=> document.addEventListener("keydown", listener),
    stop:_=> document.removeEventListener("keydown", listener)
  };
};
