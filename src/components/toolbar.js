import { TreeBase } from "./treebase";
import { Stack } from "./stack";
import { PatternGroup } from "components/access/pattern";
import { Page } from "components/page";
import { Layout } from "components/layout";

import "css/toolbar.css";
import db from "app/db";
import { html, render } from "uhtml";
import Globals from "app/globals";
import { Menu, MenuItem } from "./menu";
import { callAfterRender } from "app/render";
import { fileOpen } from "browser-fs-access";
import pleaseWait from "components/wait";
import { DB, unPackDesign } from "app/db";
import { Designer } from "./designer";
import { readSheetFromBlob, saveContent } from "app/spreadsheet";
import { SaveLog, ClearLog } from "./logger";
import { friendlyName, wikiName } from "./names";
import { claimTab, showInTab, openTab } from "app/openTab";

import { workerUpdateButton } from "components/serviceWorker";
import { monkey } from "components/monkeyTest";
import { ShareDialog } from "./shareDialog";

/** Return a list of available Menu items on this component
 *
 * @param {TreeBase} component
 * @param {"add" | "delete" | "move" | "all"} which - which actions to return
 * @param {function} wrapper
 * @returns {MenuItem[]}
 */
export function getComponentMenuItems(component, which = "all", wrapper) {
  /** @type {MenuItem[]} */
  const result = [];

  // add actions
  if (which == "add" || which == "all") {
    for (const className of component.allowedChildren.sort()) {
      result.push(
        new MenuItem({
          label: `${friendlyName(className)}`,
          callback: wrapper(() => {
            const result = TreeBase.create(className, component);
            result.init();
            return result.id;
          }),
        }),
      );
    }
  }
  // delete
  if (which == "delete" || which == "all") {
    result.push(
      new MenuItem({
        label: `Delete`,
        title: `Delete ${friendlyName(component.className)}`,
        callback: wrapper(() => {
          // remove returns the id of the nearest neighbor or the parent
          const nextId = component.remove();
          return nextId;
        }),
        disable: !component.allowDelete,
      }),
    );
  }

  // move
  if (which == "move" || which == "all") {
    const parent = component.parent;
    if (parent) {
      const index = component.index;

      if (index > 0) {
        // moveup
        result.push(
          new MenuItem({
            label: `Move up`,
            title: `Move up ${friendlyName(component.className)}`,
            callback: wrapper(() => {
              component.moveUpDown(true);
              return component.id;
            }),
            disable: !component.allowDelete,
          }),
        );
      }
      if (index < parent.children.length - 1) {
        // movedown
        result.push(
          new MenuItem({
            label: `Move down`,
            title: `Move down ${friendlyName(component.className)}`,
            callback: wrapper(() => {
              component.moveUpDown(false);
              return component.id;
            }),
            disable: !component.allowDelete,
          }),
        );
      }
    }
  }
  return result;
}

/**
 * Determines valid menu items given a menu type.
 * @param {"add" | "delete" | "move" | "all"} type
 * @return {{ child: MenuItem[], parent: MenuItem[]}}
 * */
export function getPanelMenuItems(type) {
  // Figure out which tab is active
  const { designer } = Globals;
  const panel = designer.currentPanel;

  // Ask that tab which component is focused
  if (!panel) {
    console.log("no panel");
    return { child: [], parent: [] };
  }
  const component =
    TreeBase.componentFromId(panel.lastFocused) || panel.children[0] || panel;
  if (!component) {
    console.log("no component");
    return { child: [], parent: [] };
  }
  if (component === panel) type = "add";

  /** @param {function():string} arg */
  function itemCallback(arg) {
    return () => {
      let nextId = arg();
      if (!panel) return;
      // we're looking for the settings view but we may have the id of the user view
      if (panel.lastFocused.startsWith(nextId)) {
        nextId = panel.lastFocused;
      }
      if (nextId.match(/^TreeBase-\d+$/)) {
        nextId = nextId + "-settings";
      }
      panel.lastFocused = nextId;
      callAfterRender(() => panel.parent?.restoreFocus());
      panel.update();
    };
  }

  // Ask that component for its menu actions
  let menuItems = getComponentMenuItems(component, type, itemCallback);

  // Add the parent's actions in some cases
  let parent = component.parent;

  let parentItems = new Map();
  for (let i = 0; i < 3; i++) {
    if (
      type !== "add" ||
      !parent ||
      parent instanceof Designer ||
      parent instanceof Layout ||
      (component instanceof Stack && parent instanceof Stack) ||
      (component instanceof PatternGroup && parent instanceof PatternGroup)
    ) {
      break;
    }

    for (const item of getComponentMenuItems(parent, type, itemCallback)) {
      if (!parentItems.has(item.label)) {
        parentItems.set(item.label, item);
      }
    }
    if (parentItems.size > 10) break;
    parent = parent.parent;
    // if (menuItems.length && parentItems.length) {
    //   parentItems[0].divider = "Parent";
    // }
    // menuItems = menuItems.concat(parentItems);
  }

  return { child: menuItems, parent: [...parentItems.values()] };
}

/** @param {ToolBar} bar */
function getFileMenuItems(bar) {
  return [
    new MenuItem({
      label: "Import File",
      callback: async () => {
        const local_db = new DB();
        fileOpen({
          mimeTypes: ["application/octet-stream"],
          extensions: [".osdpi", ".zip"],
          description: "OS-DPI designs",
          id: "os-dpi",
        })
          .then((file) => pleaseWait(local_db.readDesignFromFile(file)))
          .then(() => {
            openTab(`#${local_db.designName}`);
          })
          .catch((e) => console.log(e));
      },
    }),
    new MenuItem({
      label: "Import URL",
      callback: () => bar.importURLDialog.open(),
    }),
    new MenuItem({
      label: "Export",
      callback: () => {
        db.saveDesign();
      },
    }),
    new MenuItem({
      label: "Share to Gallery",
      title: "Contribute this board to the example gallery",
      callback: () => bar.shareDialog.open(),
    }),
    new MenuItem({
      label: "New",
      callback: async () => {
        // Claim the tab on the click, before awaiting the name.
        const tab = claimTab();
        showInTab(tab, `#${await db.uniqueName("new")}`);
      },
    }),
    new MenuItem({
      label: "Open",
      callback: () => {
        bar.designListDialog.open();
      },
    }),
    new MenuItem({
      label: "Gallery",
      title: "Browse the example gallery",
      callback: () => {
        openTab("#gallery");
      },
    }),
    new MenuItem({
      label: "Unload",
      callback: async () => {
        const saved = await db.saved();
        if (saved.indexOf(db.designName) < 0) {
          try {
            await db.saveDesign();
          } catch (e) {
            if (e instanceof DOMException) {
              console.log("canceled save");
            } else {
              throw e;
            }
          }
        }
        await db.unload(db.designName);
        window.close();
      },
    }),
    new MenuItem({
      label: "Unload...",
      callback: () => {
        bar.designListDialog.unload();
      },
    }),
    new MenuItem({
      label: "Refetch design",
      callback: async () => {
        await db.reloadDesignFromOriginalURL();
        console.log("refetched");
      },
    }),
    new MenuItem({
      label: "Load Plugin",
      callback: async () => {
        const file = await fileOpen({
          mimeTypes: ["application/octet-stream"],
          extensions: [".osdpi", ".zip"],
          description: "OS-DPI designs",
          id: "os-dpi",
        });
        const design = await pleaseWait(unPackDesign(file));
        await Globals.designer.merge(design);
      },
    }),
    new MenuItem({
      label: "Load Sheet",
      title: "Load a spreadsheet of content",
      divider: "Content",
      callback: async () => {
        try {
          const blob = await fileOpen({
            extensions: [".csv", ".tsv", ".ods", ".xls", ".xlsx"],
            description: "Spreadsheets",
            id: "os-dpi",
          });
          if (blob) {
            sheet.handle = blob.handle;
            const result = await pleaseWait(readSheetFromBlob(blob));
            await db.write("content", result);
            Globals.data.setContent(result);
            Globals.state.update();
          }
        } catch (e) {
          sheet.handle = undefined;
        }
      },
    }),
    new MenuItem({
      label: "Reload sheet",
      title: "Reload a spreadsheet of content",
      callback:
        sheet.handle && // only offer reload if we have the handle
        (async () => {
          if (!sheet.handle) return;
          let blob;
          blob = await sheet.handle.getFile();
          if (blob) {
            const result = await pleaseWait(readSheetFromBlob(blob));
            await db.write("content", result);
            Globals.data.setContent(result);
            Globals.state.update();
          } else {
            console.log("no file to reload");
          }
        }),
    }),
    new MenuItem({
      label: "Save sheet",
      title: "Save the content as a spreadsheet",
      callback: () => {
        pleaseWait(
          saveContent(db.designName, Globals.data.contentRows, "xlsx"),
        );
      },
    }),
    new MenuItem({
      label: "Load media",
      title: "Load audio or images into the design",
      callback: async () => {
        try {
          const files = await fileOpen({
            description: "Media files",
            mimeTypes: ["image/*", "audio/*", "video/mp4", "video/webm"],
            multiple: true,
          });
          for (const file of files) {
            await db.addMedia(file, file.name);
            if (file.type.startsWith("image/")) {
              for (const img of document.querySelectorAll(
                `img[dbsrc="${file.name}"]`,
              )) {
                /** @type {ImgDb} */ (img).refresh();
              }
            }
            if (file.type.startsWith("video/")) {
              for (const img of document.querySelectorAll(
                `video[dbsrc="${file.name}"]`,
              )) {
                /** @type {ImgDb} */ (img).refresh();
              }
            }
          }
        } catch {
          // ignore the error
        }
        Globals.state.update();
      },
    }),
    new MenuItem({
      label: "Save logs",
      title: "Save any logs as spreadsheets",
      divider: "Logs",
      callback: async () => {
        SaveLog();
      },
    }),
    new MenuItem({
      label: "Clear logs",
      title: "Clear any stored logs",
      callback: async () => {
        ClearLog();
      },
    }),
    new MenuItem({
      label: "Close editor",
      title: "Return to User mode",
      divider: "Editor",
      callback: () => {
        Globals.state.update({ editing: false });
      },
    }),
  ];
}

/** Copy (or cut) a component to the clipboard
 * @param {boolean} cut - true to cut
 */
async function copyComponent(cut = false) {
  const component = Globals.designer.selectedComponent;
  if (component) {
    const parent = component.parent;
    if (!(component instanceof Page) && !(parent instanceof Designer)) {
      const json = JSON.stringify(
        // don't include UID or OneOfGroup props in the copy
        component.toObject({ omittedProps: ["UID", "OneOfGroup"] }),
      );
      await navigator.clipboard.writeText(json);
      if (cut) {
        component.remove();
        Globals.designer.currentPanel?.onUpdate();
      }
    }
  }
}

export function getEditMenuItems() {
  // Figure out which tab is active
  const { designer } = Globals;
  const panel = designer.currentPanel;
  const component = Globals.designer.selectedComponent;

  const canEdit = component && component.allowDelete;

  let items = [
    new MenuItem({
      label: "Undo",
      callback: panel?.changeStack.canUndo ? () => panel?.undo() : undefined,
      disable: !panel?.changeStack.canUndo,
    }),
    new MenuItem({
      label: "Redo",
      callback: panel?.changeStack.canRedo ? () => panel?.redo() : undefined,
      disable: !panel?.changeStack.canRedo,
    }),
    new MenuItem({
      label: "Copy",
      callback: copyComponent,
      disable: !canEdit,
    }),
    new MenuItem({
      label: "Cut",
      callback: async () => {
        copyComponent(true);
      },
      disable: !canEdit,
    }),
    new MenuItem({
      label: "Paste",
      callback: async () => {
        const json = await navigator.clipboard.readText();
        // we can't trust this input from the clipboard, catch and report errors

        try {
          var obj = JSON.parse(json);
        } catch (e) {
          Globals.error.report("Invalid input to Paste");
          Globals.error.report(json);
          Globals.state.update();
          return;
        }
        const className = obj.className;
        if (!className) return;
        // find a place that can accept it
        const designer = Globals.designer;
        const panel = designer.currentPanel;
        if (!panel) return;
        const anchor = designer.selectedComponent;
        if (!anchor) return;
        /** @type {TreeBase | undefined } */
        let current = anchor;
        while (current) {
          if (current.allowedChildren.indexOf(className) >= 0) {
            const result = TreeBase.fromObject(obj, current);
            if (
              anchor.parent === result.parent &&
              result.index != anchor.index + 1
            ) {
              result.moveTo(anchor.index + 1);
            }
            callAfterRender(() => designer.focusOn(result.id));
            panel.onUpdate();
            return;
          }
          current = current.parent;
        }
      },
      disable: !canEdit,
    }),
    new MenuItem({
      label: "Paste Into",
      callback: async () => {
        const json = await navigator.clipboard.readText();
        try {
          var obj = JSON.parse(json);
        } catch (e) {
          Globals.error.report("Invalid input to Paste Into");
          Globals.error.report(json);
          Globals.state.update();
          return;
        }
        const className = obj.className;
        if (!className) return;
        // find a place that can accept it
        const current = Globals.designer.selectedComponent;
        if (current && current.allowedChildren.indexOf(className) >= 0) {
          TreeBase.fromObject(obj, current);
          Globals.designer.currentPanel?.onUpdate();
        }
      },
      disable: !canEdit,
    }),
  ];
  const deleteItems = getPanelMenuItems("delete");
  const moveItems = getPanelMenuItems("move");
  items = items.concat(moveItems.child, deleteItems.child);
  const parentItems = moveItems.parent.concat(deleteItems.parent);
  if (parentItems.length > 0) {
    parentItems[0].divider = "Parents";
    items = items.concat(parentItems);
  }
  return items;
}

/** Open Wiki documentation in another tab
 * @param {string} name
 */
function openHelpURL(name) {
  const wiki = "https://github.com/unc-project-open-aac/os-dpi/wiki";

  const url = `${wiki}/${name}`;

  window.open(url, "help");
}

function getHelpMenuItems() {
  /** @type {MenuItem[]} */
  const items = [];
  const names = new Set();
  let component =
    Globals.designer.selectedComponent || Globals.designer.currentPanel;
  while (component && component.parent) {
    const className = component.className;
    const menuName = friendlyName(className);
    if (!names.has(menuName)) {
      items.push(
        new MenuItem({
          label: menuName,
          callback: openHelpURL,
          args: [wikiName(className)],
        }),
      );
      names.add(menuName);
    }
    component = component.parent;
  }
  items.push(
    new MenuItem({
      label: "About OS-DPI",
      callback: openHelpURL,
      args: ["About-Project-Open"],
    }),
  );

  if (location.host.match(/^localhost.*$|^bs-local.*$/)) {
    items.push(
      new MenuItem({
        label: "Test",
        callback: monkey,
      }),
    );
  }
  return items;
}

/**
 * @param {Hole} thing
 * @param {string} hint
 */
function hinted(thing, hint) {
  return html`<div hint=${hint}>${thing}</div>`;
}

const sheet = {
  /** @type {FileSystemFileHandle | undefined } */
  handle: undefined,
};

/**
 * Display a list of designs in the db so they can be reopened or unloaded
 */
class DesignListDialog {
  /** Show imported designs so they can be reopened */
  async open() {
    const names = await db.names();
    const dialog = /** @type {HTMLDialogElement} */ (
      document.getElementById("OpenDialog")
    );
    const list = html`<div @click=${() => dialog.close()}>
      <h1>Open one of your designs</h1>
      <ul>
        ${names.map(
          (name) =>
            html`<li>
              <a href=${"#" + name} target="_blank">${name}</a>
            </li>`,
        )}
      </ul>
      <button>Cancel</button>
    </div>`;
    if (dialog) {
      render(dialog, list);
    }
    dialog.showModal();
  }
  /** Show imported designs so they can be unloaded */
  async unload() {
    const names = await db.names();
    const saved = await db.saved();
    const dialog = /** @type {HTMLDialogElement} */ (
      document.getElementById("OpenDialog")
    );
    /** Unload the checked designs */
    async function unloadChecked() {
      const checkboxes = /** @type {HTMLInputElement[]} */ ([
        ...dialog.querySelectorAll('input[type="checkbox"]'),
      ]);
      for (const checkbox of checkboxes) {
        if (checkbox.checked) {
          await db.unload(checkbox.name);
        }
      }
      dialog.close();
    }
    const list = html`<div>
      <h1>Check the designs you want to unload</h1>
      <ul>
        ${names.map((name) => {
          let label;
          if (saved.includes(name)) {
            label = html`<span>${name}</span>`;
          } else {
            label = html`<b>${name}</b> <b class="warning">Not saved</b>`;
          }
          return html`<li>
            <label><input type="checkbox" name=${name} /> ${label}</label>
          </li>`;
        })}
      </ul>
      <button @click=${unloadChecked}>Unload</button>
      <button @click=${() => dialog.close()}>Cancel</button>
    </div>`;
    if (dialog) {
      render(dialog, list);
    }
    dialog.showModal();
  }
  template() {
    return html`<dialog id="OpenDialog"></dialog>`;
  }
}

class ImportURLDialog {
  /** @type { HTMLDialogElement} */
  current;

  template() {
    return html` <dialog id="ImportURL" ref=${this}>
      <h1>Import from a URL</h1>
      <input
        type="url"
        placeholder="Enter the URL to import"
        name="DesignURL"
      />
      <button
        @click=${() => {
          const input = this.current.querySelector("input");
          if (
            input instanceof HTMLInputElement &&
            !input.validationMessage &&
            input.value
          ) {
            const local_db = new DB();
            pleaseWait(local_db.readDesignFromURL(input.value)).then(
              () => {
                openTab(`#${local_db.designName}`);
              },
              () => console.log("rejected"),
            );
            this.current.close();
          }
        }}
      >
        Import
      </button>
      <button @click=${() => this.current.close()}>Cancel</button>
    </dialog>`;
  }

  async open() {
    const url = await db.getDesignURL();
    const input = this.current.querySelector("input");
    if (input instanceof HTMLInputElement) input.value = url;
    this.current.showModal();
  }
}

export class ToolBar extends TreeBase {
  constructor() {
    super();
    this.fileMenu = new Menu("File", getFileMenuItems, this);
    this.editMenu = new Menu("Edit", getEditMenuItems);
    this.addMenu = new Menu(
      "Add",
      () => {
        const { child, parent } = getPanelMenuItems("add");
        if (parent.length > 0) {
          parent[0].divider = "Parent" + (parent.length > 1 ? "s" : "");
        }
        return child.concat(parent);
      },
      "add",
    );
    this.helpMenu = new Menu("Help", getHelpMenuItems, this);
    this.designListDialog = new DesignListDialog();
    this.importURLDialog = new ImportURLDialog();
    this.shareDialog = new ShareDialog();
  }

  template() {
    return html`
      <div class="toolbar brand">
        <ul>
          <li>
            <label for="designName">Name: </label>
            ${hinted(
              html`<input
                id="designName"
                type="text"
                .value=${db.designName}
                .size=${Math.max(db.designName.length, 12)}
                @change=${(/** @type {InputEventWithTarget} */ event) =>
                  db
                    .renameDesign(event.target.value)
                    .then(() => (window.location.hash = db.designName))}
              />`,
              "N",
            )}
          </li>
          <li>
            ${
              // @ts-ignore
              hinted(this.fileMenu.render(), "F")
            }
          </li>
          <li>
            ${
              // @ts-ignore
              hinted(this.editMenu.render(), "E")
            }
          </li>
          <li>
            ${
              // @ts-ignore
              hinted(this.addMenu.render(), "A")
            }
          </li>
          <li>
            ${
              // @ts-ignore
              hinted(this.helpMenu.render(), "H")
            }
          </li>
          <li>${workerUpdateButton()}</li>
        </ul>
        ${this.designListDialog.template()} ${this.importURLDialog.template()}
        ${this.shareDialog.template()}
      </div>
    `;
  }
}
TreeBase.register(ToolBar, "ToolBar");
