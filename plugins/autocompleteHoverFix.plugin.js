//META{"name":"autocompleteHoverFix"}*//;
var autocompleteHoverFix;

autocompleteHoverFix = class autocompleteHoverFix {
  getName() {
    return "Autocomplete-Hover-Fix";
  }

  getDescription() {
    return "If the autocompletion menu selects entries without your doing then this is for you.";
  }

  getAuthor() {
    return "square";
  }

  getVersion() {
    return "1.0.2";
  }

  start() {}

  stop() {}

  load() {}

  observer(m) {
    var e, node, ref;
    try {
      ({
        addedNodes: [node]
      } = m);
    } catch (error) {
      e = error;
      return;
    }
    if ("function" === typeof (node != null ? (ref = node.className) != null ? ref.indexOf : void 0 : void 0) && ((-1 !== node.className.indexOf("autocomplete-")) || -1 !== node.className.indexOf("popout-"))) {
      e = document.createElement("div");
      e.style = "position: absolute;\nwidth: 100%;\nheight: 100%;\ntop: 0; left: 0;";
      e.onmousemove = function({clientX, clientY}) {
        if ((this.x != null) && (this.y != null) && (this.x !== clientX || this.y !== clientY)) {
          this.remove();
          e = document.elementFromPoint(clientX, clientY);
          while (true) {
            if (e === document.body) {
              return;
            }
            if (-1 !== e.className.indexOf("selectable-")) {
              e = e.parentNode;
              break;
            } else if (-1 !== e.className.indexOf("search-option")) {
              break;
            }
            e = e.parentNode;
          }
          e.dispatchEvent(new MouseEvent("mouseover", {
            clientX,
            clientY,
            bubbles: true
          }));
          return;
        }
        this.x = clientX;
        this.y = clientY;
      };
      node.appendChild(e);
    }
  }

};
