import { html, render } from "uhtml";
import "css/gallery.css";
import "css/share.css";
import { fileOpen } from "browser-fs-access";
import db, { DB } from "app/db";
import pleaseWait from "components/wait";
import { galleryIndexURL, loadURL, GALLERY } from "app/galleryConfig";
import { claimTab, showInTab, openTab } from "app/openTab";

// Example gallery landing view. Lists boards from the manifest and loads one
// via the existing `?fetch=` path. Rendered directly with uhtml.

const CONTRIBUTE_DOCS_URL = `https://github.com/${GALLERY.owner}/${GALLERY.repo}/tree/${GALLERY.branch}/${GALLERY.repoDir}`;

let mount = null;
let allItems = [];
let activeTab = "official";
let activeTag = null;

function designURL(name) {
  return `${import.meta.env.BASE_URL}#${name}`;
}

function openDesign(name) {
  openTab(designURL(name));
}

// Start a fresh design in a new tab, like File > New.
async function newDesign(event) {
  event.preventDefault();
  // Claim the tab on the click, before awaiting the name.
  const tab = claimTab();
  try {
    showInTab(tab, designURL(await db.uniqueName("new")));
  } catch (e) {
    if (tab && !tab.closed) tab.close();
    throw e;
  }
}

// Load a design from a file on disk, like File > Import File.
async function importDesign(event) {
  event.preventDefault();
  const local = new DB();
  try {
    const file = await fileOpen({
      mimeTypes: ["application/octet-stream"],
      extensions: [".osdpi", ".zip"],
      description: "OS-DPI designs",
      id: "os-dpi",
    });
    await pleaseWait(local.readDesignFromFile(file));
    openDesign(local.designName);
  } catch (e) {
    // The picker throws on cancel.
    console.log(e);
  }
}

async function fetchIndex() {
  try {
    const res = await fetch(galleryIndexURL(), { cache: "no-cache" });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.examples || [];
    return list.filter((it) => it && it.slug);
  } catch (e) {
    console.error("gallery: failed to load index", e);
    return null;
  }
}

// A clickable #hashtag that toggles the tag filter.
function tagChip(t) {
  const active = t === activeTag;
  return html`<button
    class=${"gallery-tag" + (active ? " gallery-tag--active" : "")}
    @click=${() => {
      activeTag = active ? null : t;
      rerender();
    }}
  >
    #${t}
  </button>`;
}

function card(item) {
  return html`<article class="gallery-card">
    <h2 class="gallery-card-title">${item.title}</h2>
    ${
      item.description
        ? html`<p class="gallery-card-desc">${item.description}</p>`
        : null
    }
    ${
      item.tags && item.tags.length
        ? html`<div class="gallery-tags">${item.tags.map(tagChip)}</div>`
        : null
    }
    ${
      item.author
        ? html`<p class="gallery-card-author">by ${item.author}</p>`
        : null
    }
    <div class="gallery-card-actions">
      <a
        class="gallery-btn gallery-btn--primary"
        href=${loadURL(item, false)}
        target="_blank"
        rel="noopener"
      >
        Try it
      </a>
      <a
        class="gallery-btn gallery-btn--ghost"
        href=${loadURL(item, true)}
        target="_blank"
        rel="noopener"
        title="Open in the editor"
      >
        Open in editor
      </a>
    </div>
  </article>`;
}

function contributeCard() {
  return html`<article class="gallery-card gallery-card--cta">
    <span class="gallery-cta-title">Sharing is optional</span>
    <span class="gallery-cta-sub">
      If you build a simulation you think others would find useful, File &rarr;
      Share to Gallery will offer it here. Nothing you make is shared unless you
      choose to.
    </span>
    <button class="gallery-link" @click=${openHowSharingWorks}>
      How sharing works
    </button>
  </article>`;
}

const HOW_DIALOG_ID = "GalleryHowDialog";

function openHowSharingWorks() {
  const dialog = /** @type {HTMLDialogElement} */ (
    document.getElementById(HOW_DIALOG_ID)
  );
  if (!dialog) return;
  render(
    dialog,
    html`<div class="share-form share-instructions">
      <h1>How sharing works</h1>
      <p class="share-hint">
        The gallery is a folder in the project's GitHub repository, so adding a
        simulation means proposing a change to it. There is no server behind
        this, and nothing is uploaded in the background.
      </p>
      <ol>
        <li>
          <strong>You choose to share.</strong> In a simulation, use File &rarr;
          Share to Gallery and describe it. Your work stays in your browser
          until you do this.
        </li>
        <li>
          <strong>Two files are prepared.</strong> Your simulation as
          <code>board.osdpi</code>, and a <code>meta.json</code> holding the
          title, description, tags, and your name. Both are needed, and both
          keep those names.
        </li>
        <li>
          <strong>GitHub opens.</strong> Drop the two files in and propose the
          change. This creates a pull request, which is a request to add your
          folder, not a change to the site yet. A free GitHub account is
          required.
        </li>
        <li>
          <strong>Someone reviews it.</strong> A maintainer looks at the
          simulation and merges it. Your entry then appears under Community,
          with your name, the next time the site is built.
        </li>
      </ol>
      <div class="share-actions">
        <a
          class="share-btn"
          href=${CONTRIBUTE_DOCS_URL}
          target="_blank"
          rel="noopener"
        >
          Browse the gallery folder
        </a>
        <button
          type="button"
          class="share-btn share-btn--primary"
          @click=${() => dialog.close()}
        >
          Close
        </button>
      </div>
    </div>`,
  );
  dialog.showModal();
}

function header() {
  return html`<header class="gallery-header">
    <div class="gallery-header-bar"></div>
    <div class="gallery-header-text">
      <h1 class="gallery-title">Example gallery</h1>
      <p class="gallery-subtitle">
        Browse AAC simulations and open one in OS-DPI with a click.
      </p>
    </div>
  </header>`;
}

// Kept out of the tabs, which only choose whose examples you are browsing.
function ownWork() {
  return html`<div class="gallery-own">
    <button class="gallery-btn gallery-btn--primary" @click=${newDesign}>
      New simulation
    </button>
    <button class="gallery-btn" @click=${importDesign}>Import a file</button>
  </div>`;
}

function tab(id, label, count) {
  const active = activeTab === id;
  return html`<button
    role="tab"
    aria-selected=${active}
    class=${"gallery-tab" + (active ? " gallery-tab--active" : "")}
    @click=${() => {
      activeTab = id;
      activeTag = null;
      rerender();
    }}
  >
    ${label} <span class="gallery-tab-count">${count}</span>
  </button>`;
}

// Row of every #tag in the current tab, plus an "All" reset.
function tagBar(items) {
  const tags = [...new Set(items.flatMap((it) => it.tags || []))].sort();
  if (!tags.length) return null;
  return html`<div class="gallery-tagbar">
    <button
      class=${"gallery-tag" + (activeTag === null ? " gallery-tag--active" : "")}
      @click=${() => {
        activeTag = null;
        rerender();
      }}
    >
      All
    </button>
    ${tags.map(tagChip)}
  </div>`;
}

function view() {
  const official = allItems.filter((it) => it.official);
  const community = allItems.filter((it) => !it.official);
  const isCommunity = activeTab === "community";
  const tabItems = isCommunity ? community : official;
  const list = activeTag
    ? tabItems.filter((it) => (it.tags || []).includes(activeTag))
    : tabItems;
  return html`<div class="gallery">
    ${header()} ${ownWork()}
    <div class="gallery-tabbar">
      <div class="gallery-tabs" role="tablist">
        ${tab("official", "OS-DPI", official.length)}
        ${tab("community", "Community", community.length)}
      </div>
    </div>
    ${tagBar(tabItems)}
    ${
      isCommunity && !community.length
        ? html`<p class="gallery-note">
            Nothing shared here yet, so this tab is empty for now.
          </p>`
        : null
    }
    <div class="gallery-grid">
      ${list.map(card)} ${isCommunity ? contributeCard() : null}
    </div>
    <dialog id=${HOW_DIALOG_ID} class="share-dialog"></dialog>
  </div>`;
}

function errorView() {
  return html`<div class="gallery">
    ${header()}
    <div class="gallery-empty">
      <p>Could not load the gallery.</p>
      <button
        class="gallery-btn gallery-btn--primary"
        @click=${() => showGallery()}
      >
        Retry
      </button>
    </div>
  </div>`;
}

function rerender() {
  if (mount) render(mount, view());
}

// Render the gallery into #gallery and switch the page into gallery mode.
export async function showGallery(id = "gallery") {
  mount = document.getElementById(id);
  if (!mount) return;
  document.body.classList.add("gallery-mode");
  const items = await fetchIndex();
  if (items === null) {
    render(mount, errorView());
    return;
  }
  allItems = items;
  activeTab = items.some((it) => it.official) ? "official" : "community";
  rerender();
}
