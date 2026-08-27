/** Floating button: tap for full screen, hold 3s (or press Esc) to return to
 * the editor. The hold stops a stray tap from dropping a communicator out of
 * their board. Lives on <body>, clear of the uhtml render that rewrites #UI. */
import "css/fullscreenExit.css";
import Globals from "./globals";

const HOLD_MS = 3000;
const SVG_NS = "http://www.w3.org/2000/svg";

const RING = `<svg xmlns="${SVG_NS}" class="fsx-ring" viewBox="0 0 48 48" aria-hidden="true">
  <circle class="fsx-ring-track" cx="24" cy="24" r="21" pathLength="100" />
  <circle class="fsx-ring-progress" cx="24" cy="24" r="21" pathLength="100" />
</svg>`;
const EXPAND_ICON = `<svg xmlns="${SVG_NS}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" />
  <path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
</svg>`;
const COMPRESS_ICON = `<svg xmlns="${SVG_NS}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" />
  <path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" />
</svg>`;

// Parse a trusted static SVG string into a node (keeps us off innerHTML).
function svgFrom(markup) {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  return document.importNode(doc.documentElement, true);
}

// iPadOS/iOS Safari now supports the Fullscreen API, but entering it hands the
// page to the OS full-screen chrome (the "swipe down to exit" banner and native
// buttons). That chrome sits over our button near the safe-area inset so the
// hold can't fire, and its one-tap exit defeats the whole point of the hold:
// stopping a stray tap from dropping a communicator out of their board. So on
// iOS we don't use the native API at all; hiding the editor IS the full-screen
// view, and the button keeps working. (An earlier comment assumed iOS would
// reject the request, but modern iPadOS does not.)
const isIOS =
  typeof navigator !== "undefined" &&
  (/iP(ad|hone|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

const inFullscreen = () => !!document.fullscreenElement;
const inEditor = () => !!(Globals.state && Globals.state.get("editing"));

async function requestFullscreen() {
  if (isIOS) return; // hidden-editor view is the full-screen experience here
  try {
    await document.documentElement.requestFullscreen?.();
  } catch {
    /* ignore */
  }
}

async function dropFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
  } catch {
    /* ignore */
  }
}

/** @param {boolean} on */
function setEditing(on) {
  if (Globals.state) Globals.state.update({ editing: on });
}

// Tap: enter full screen. In full screen a tap does nothing; leaving is the
// hold or Esc, so a stray tap can't exit and there's no windowed in-between.
function tap() {
  if (inFullscreen()) return;
  setEditing(false);
  requestFullscreen();
}

// Hold complete: leave full screen first (awaited, so the editor paints into
// the windowed layout without flashing), then open the editor.
async function hold() {
  await dropFullscreen();
  setEditing(true);
}

export function installFullscreenExit() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "fsx-btn";
  btn.setAttribute("aria-label", "Full screen. Hold to return to the editor.");
  btn.title = "Tap for full screen • hold to edit";

  const expand = document.createElement("span");
  expand.className = "fsx-icon fsx-icon-expand";
  expand.appendChild(svgFrom(EXPAND_ICON));
  const compress = document.createElement("span");
  compress.className = "fsx-icon fsx-icon-compress";
  compress.appendChild(svgFrom(COMPRESS_ICON));
  btn.append(svgFrom(RING), expand, compress);

  /** @type {ReturnType<typeof setTimeout> | null} */
  let timer = null;
  let fired = false; // hold fired, so the matching pointerup shouldn't tap

  function stopHold() {
    if (timer != null) clearTimeout(timer);
    timer = null;
    btn.classList.remove("fsx-holding");
  }

  btn.addEventListener("pointerdown", (event) => {
    if (event.button > 0) return;
    fired = false;
    if (inEditor()) return; // editor: plain tap to full screen, no hold/ring
    btn.classList.add("fsx-holding");
    try {
      btn.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    timer = setTimeout(() => {
      fired = true;
      stopHold();
      hold();
    }, HOLD_MS);
  });

  btn.addEventListener("pointerup", () => {
    const wasHold = fired;
    stopHold();
    if (!wasHold) tap();
  });

  btn.addEventListener("pointercancel", stopHold);

  btn.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      tap();
    }
  });

  // Any full-screen exit (Esc, the OS, the completed hold) opens the editor.
  // On iOS there's no real full screen, so the icon tracks the editor state via
  // CSS (body.fsx-ios:not(.designing)) instead of the fullscreenchange event.
  btn.classList.toggle("fsx-active", inFullscreen());
  if (isIOS) document.body.classList.add("fsx-ios");
  document.addEventListener("fullscreenchange", () => {
    btn.classList.toggle("fsx-active", inFullscreen());
    if (!inFullscreen()) setEditing(true);
  });

  document.body.appendChild(btn);
}
