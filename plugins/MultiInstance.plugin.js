//META { "name": "MultiInstance" } *//

var MultiInstance = function()  {
  if(MultiInstance !== new.target) throw "You are dumb";

  let public = {
    getName:_=> "Multi Instance",
    getDescription:_=> `Have several discord windows open same time. ${process.platform !== "darwin" ? "Ctrl" : "Cmd"}+F12.`,
    getAuthor:_=> "square",
    getVersion:_=> "1.0.0",
    load:_=>_,

    start:_=> document.addEventListener("keydown", listener),
    stop:_=> document.removeEventListener("keydown", listener)
  },
    listener = ({code, ctrlKey, metaKey}) => code === "F12" && (process.platform !== "darwin" ? ctrlKey : metaKey) && require("child_process").
      exec(`"${process.argv0}" --multi-instance`);

  for(name in public) this[name] = public[name];
};
