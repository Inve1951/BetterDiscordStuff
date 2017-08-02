//META{"name":"autocompleteHoverFix"}*//;
var autocompleteHoverFix;

autocompleteHoverFix = class autocompleteHoverFix {
  getName() {
    return "Autocomplete-Hover-Fix";
  }

  getDescription() {
    return "gg discord";
  }

  getAuthor() {
    return "square";
  }

  getVersion() {
    return "1.0.0";
  }

  start() {}

  stop() {}

  load() {}

  observer(m) {
    var e, node;
    try {
      ({
        addedNodes: [node]
      } = m);
    } catch (error) {
      e = error;
      return;
    }
    if (((node != null ? node.className : void 0) != null) && ((-1 !== node.className.indexOf("autocomplete-")) || -1 !== node.className.indexOf("popout-"))) {
      e = document.createElement("div");
      e.style = "position: absolute;\nwidth: 100%;\nheight: 100%;\ntop: 0; left: 0;";
      e.onmousemove = function({clientX, clientY}) {
        if ((this.x != null) && (this.y != null) && this.x !== clientX && this.y !== clientY) {
          e.remove();
        }
        this.x = clientX;
        this.y = clientY;
      };
      node.appendChild(e);
    }
  }

};
