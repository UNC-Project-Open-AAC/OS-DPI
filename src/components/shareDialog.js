import { html, render } from "uhtml";
import "css/share.css";
import db from "app/db";
import { slugify, uploadURL, GALLERY } from "app/galleryConfig";

// Share to Gallery: export the current board and meta.json, then open GitHub's
// upload page for a new folder so the user can open a pull request. No backend.

const DIALOG_ID = "ShareDialog";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

class ShareDialog {
  template() {
    return html`<dialog id=${DIALOG_ID} class="share-dialog"></dialog>`;
  }

  /** @returns {HTMLDialogElement} */
  get dialog() {
    return /** @type {HTMLDialogElement} */ (
      document.getElementById(DIALOG_ID)
    );
  }

  open() {
    this.renderForm();
    this.dialog.showModal();
  }

  renderForm() {
    const dialog = this.dialog;
    render(
      dialog,
      html`<form class="share-form" @submit=${(e) => this.onSubmit(e)}>
        <h1>Share to gallery</h1>
        <p class="share-hint">
          Contribute this board to the example gallery as a GitHub pull request.
        </p>
        <label
          >Title
          <input name="title" type="text" required .value=${db.designName} />
        </label>
        <label
          >Description
          <textarea
            name="description"
            rows="2"
            placeholder="What is this board for?"
          ></textarea>
        </label>
        <label
          >Tags (comma separated)
          <input name="tags" type="text" placeholder="grid, beginner" />
        </label>
        <label
          >Your name
          <input name="author" type="text" placeholder="Optional" />
        </label>
        <div class="share-actions">
          <button type="submit" class="share-btn share-btn--primary">
            Prepare files &amp; open GitHub
          </button>
          <button
            type="button"
            class="share-btn"
            @click=${() => dialog.close()}
          >
            Cancel
          </button>
        </div>
      </form>`,
    );
  }

  /** @param {SubmitEvent} event */
  async onSubmit(event) {
    event.preventDefault();
    const data = new FormData(/** @type {HTMLFormElement} */ (event.target));
    const title = String(data.get("title") || "").trim();
    if (!title) return;
    const slug = slugify(title) || slugify(db.designName) || "my-board";

    const meta = {
      title,
      description: String(data.get("description") || "").trim(),
      tags: String(data.get("tags") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      author: String(data.get("author") || "").trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const board = await db.convertDesignToBlob();
    const metaBlob = new Blob([JSON.stringify(meta, null, 2) + "\n"], {
      type: "application/json",
    });
    downloadBlob(board, "board.osdpi");
    setTimeout(() => downloadBlob(metaBlob, "meta.json"), 400);
    window.open(uploadURL(slug), "_blank", "noopener=true");

    this.renderInstructions(slug, meta);
  }

  renderInstructions(slug, meta) {
    const dialog = this.dialog;
    const metaText = JSON.stringify(meta, null, 2);
    const folder = `${GALLERY.repoDir}/${slug}`;
    render(
      dialog,
      html`<div class="share-form share-instructions">
        <h1>Almost there</h1>
        <p class="share-hint">
          Two files were downloaded and a GitHub page opened for a new folder
          <code>${folder}</code>.
        </p>
        <ol>
          <li>
            On the GitHub page, drag in <strong>both</strong> downloaded files,
            keeping their names: <code>board.osdpi</code> and
            <code>meta.json</code>. An entry without both is skipped.
          </li>
          <li>
            If GitHub offers a choice, pick
            <strong
              >Create a new branch for this commit and start a pull
              request</strong
            >. It only offers this if you can write to the repo, and the other
            option commits straight to <code>${GALLERY.branch}</code>.
          </li>
          <li>
            Click <strong>Propose changes</strong>, then confirm to open your
            pull request.
          </li>
        </ol>
        <p class="share-hint">
          If a download was blocked, copy <code>meta.json</code>:
        </p>
        <textarea class="share-meta" readonly rows="7">${metaText}</textarea>
        <div class="share-actions">
          <button
            type="button"
            class="share-btn"
            @click=${() => navigator.clipboard.writeText(metaText)}
          >
            Copy meta.json
          </button>
          <button
            type="button"
            class="share-btn"
            @click=${() => window.open(uploadURL(slug), "_blank", "noopener=true")}
          >
            Reopen GitHub page
          </button>
          <button
            type="button"
            class="share-btn share-btn--primary"
            @click=${() => dialog.close()}
          >
            Done
          </button>
        </div>
      </div>`,
    );
  }
}

export { ShareDialog };
