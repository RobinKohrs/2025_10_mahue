import { e as escape_html } from "../../chunks/escaping.js";
import "clsx";
function html(value) {
  var html2 = String(value);
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
function createViewport(name = `viewport-${Date.now()}`) {
  const viewport = {
    state: {
      id: name,
      connected: false,
      debug: false,
      lastPayload: {
        height: 0
      },
      width: null,
      height: null,
      scrollPosition: null,
      visible: true
    },
    debugLog(message, e = null) {
      if (this.state.debug && e !== null)
        console.log(this.state.id, message, e);
      else if (this.state.debug) console.log(this.state.id, message);
    },
    debugMode() {
      console.log("VIEWPORT running in debug mode");
      this.state.debug = true;
    },
    handler(e) {
      if (e.data.eventName !== "dst.dom.updateParentParams" && e.data.eventName !== "dst.dom.parentScroll")
        return;
      this.debugLog("VIEWPORT handler triggered with:", e);
      this.updateState(e);
      if (e.data.eventName === "dst.dom.updateParentParams") this.resize();
    },
    initialize(mode = "silent") {
      if (mode === "debug") this.debugMode();
      this.debugLog(this);
      window.parent.postMessage(
        {
          eventName: "dst.dom.iframeReady",
          payload: {
            viewportId: this.state.id
          }
        },
        "*"
      );
      window.addEventListener("message", (e) => {
        this.handler(e);
      });
      window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden")
          this.setVisible(false);
        else this.setVisible(true);
      });
      return this;
    },
    resizeInternal() {
      if (document.body.offsetHeight === this.state.lastPayload.height) {
        this.debugLog("VIEWPORT resize triggered: no height change");
        return;
      }
      this.debugLog(
        "VIEWPORT resize triggered: new height (" + document.body.offsetHeight + "px)"
      );
      this.state.lastPayload.height = document.body.offsetHeight;
      window.parent.postMessage(
        {
          eventName: "dst.dom.resizeIframe",
          payload: {
            viewportId: this.state.id,
            contentHeight: document.body.offsetHeight
          }
        },
        "*"
      );
    },
    setVisible(bool) {
      this.debugLog("VIEWPORT visible changed to", bool);
      this.state.visible = bool;
    },
    updateState(e) {
      this.state.connected = true;
      if (e.data) {
        this.state.width = e.data.payload.windowWidth;
        this.state.height = e.data.payload.windowHeight;
        this.state.scrollPosition = e.data.payload.scrollPosition;
      }
    }
  };
  viewport.resize = debounce(viewport.resizeInternal.bind(viewport), 50);
  return viewport;
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let yesterdayCount = "...";
    let todayCount = "...";
    let tomorrowCount = "...";
    let todayDate = "";
    let yesterdayPerson = "";
    let todayPerson = "";
    let tomorrowPerson = "";
    createViewport("birthdays-embed");
    $$renderer2.push(`<div class="dj-container svelte-1uha8ag"><h1 class="dj-title svelte-1uha8ag"></h1> <div class="dj-day-section svelte-1uha8ag"><p class="svelte-1uha8ag"><span>${escape_html(yesterdayCount)}</span> Menschen hätten <strong class="dj-day-highlight svelte-1uha8ag">gestern im Gazastreifen</strong> Geburtstag gehabt.</p> <div class="dj-person-info svelte-1uha8ag">${html(yesterdayPerson)}</div></div> <div class="dj-day-section svelte-1uha8ag"><p class="svelte-1uha8ag"><span>${escape_html(todayCount)}</span> Menschen hätten <strong class="dj-day-highlight svelte-1uha8ag">heute ${escape_html(todayDate)} im Gazastreifen</strong> Geburtstag gehabt.</p> <div class="dj-person-info svelte-1uha8ag">${html(todayPerson)}</div></div> <div class="dj-day-section svelte-1uha8ag"><p class="svelte-1uha8ag"><span>${escape_html(tomorrowCount)}</span> Menschen hätten <strong class="dj-day-highlight svelte-1uha8ag">morgen im Gazastreifen</strong> Geburtstag
			gehabt.</p> <div class="dj-person-info svelte-1uha8ag">${html(tomorrowPerson)}</div></div> <button class="dj-button svelte-1uha8ag">Zufällige Personen anzeigen</button> <p class="dj-source svelte-1uha8ag">Quellen: Gaza Health Ministry, Gaza Media Office (via <a href="https://data.techforpalestine.org/docs/killed-in-gaza/" target="_blank" rel="noopener noreferrer" class="svelte-1uha8ag">Tech For Palestine</a>).</p></div>`);
  });
}
export {
  _page as default
};
