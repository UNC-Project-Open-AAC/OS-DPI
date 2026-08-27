/* Thinking about better properties */

import { html } from "uhtml";
import "css/props.css";
import { compileExpression } from "app/eval";
import Globals from "app/globals";
import { TreeBaseSwitchable } from "./treebase";
import { getColor, isValidColor, styleString } from "./style";

/**
 * @typedef {Object} PropOptions
 * @property {boolean} [hiddenLabel]
 * @property {string} [placeholder]
 * @property {string} [title]
 * @property {string} [label]
 * @property {string} [defaultValue]
 * @property {string} [group]
 * @property {string} [language]
 * @property {any} [valueWhenEmpty]
 * @property {string} [pattern]
 * @property {function(string):string} [validate]
 * @property {string} [inputmode]
 * @property {string} [datalist]
 * @property {number} [min]
 * @property {number} [max]
 * @property {boolean} [notRequired]
 * @property {string[]} [addedFields]
 */

/**
 * @template {number|boolean|string} T
 */
export class Prop {
  label = "";
  /** @type {T} */
  _value;

  /** true if this is a formula without leading = */
  isFormulaByDefault = false;

  /** If the entered value starts with = treat it as an expression and store it here */
  formula = "";

  /** @type {((context?:EvalContext)=>any) | undefined} compiled expression if any */
  compiled = undefined;

  // Each prop gets a unique id based on the id of its container
  id = "";

  /** @type {TreeBase} */
  container;

  /** attach the prop to its containing TreeBase component
   * @param {string} name
   * @param {any} value
   * @param {TreeBase} container
   * */
  initialize(name, value, container) {
    // create id from the container id
    this.id = `${container.id}-${name}`;
    // link to the container
    this.container = container;
    // set the value if provided
    if (value != undefined) {
      this.set(value);
    }
    // create a label if it has none
    this.label =
      this.label ||
      name // convert from camelCase to Camel Case
        .replace(/(?!^)([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase());
  }

  /** @type {PropOptions} */
  options = {};

  /**
   * @param {T} value
   * @param {PropOptions} options */
  constructor(value, options = {}) {
    this._value = value;
    this.options = options;
    if (options.label) {
      this.label = options.label;
    }
  }
  validate = debounce(
    (/** @type {string} */ value, /** @type {HTMLInputElement} */ input) => {
      input.setCustomValidity("");
      if (this.isFormulaByDefault || value.startsWith("=")) {
        const [compiled, error] = compileExpression(value);
        if (error) {
          let message = error.message.replace(/^\[.*?\]/, "");
          message = message.split("\n")[0];
          input.setCustomValidity(message);
        } else if (compiled && this.options.validate)
          input.setCustomValidity(this.options.validate("" + compiled({})));
      } else if (this.options.validate) {
        input.setCustomValidity(this.options.validate(value));
      }
      input.reportValidity();
    },
    100,
  );

  input() {
    const text = this.text;
    return this.labeled(
      html`<input
          type="text"
          inputmode=${this.options.inputmode}
          .value=${text}
          id=${this.id}
          style=${`width: min(${text.length + 3}ch, 100%)`}
          list=${this.options.datalist}
          title=${this.options.title}
          placeholder=${this.options.placeholder}
          @keydown=${this.onkeydown}
          @input=${this.oninput}
          @change=${this.onchange}
        />${this.showValue()}`,
    );
  }
  onkeydown = (/** @type {KeyboardEvent} */ event) => {
    // restore the input on Escape
    const { key, target } = event;
    if (key == "Escape" && target instanceof HTMLInputElement) {
      const text = this.text;
      this.validate(text, target);
      event.preventDefault();
      target.value = text;
    }
  };
  oninput = (/** @type {InputEvent} */ event) => {
    // validate on each character
    if (event.target instanceof HTMLInputElement) {
      this.validate(event.target.value, event.target);
      event.target.style.width = `${event.target.value.length + 1}ch`;
    }
  };
  onchange = (/** @type {InputEvent} */ event) => {
    if (
      event.target instanceof HTMLInputElement &&
      event.target.checkValidity()
    ) {
      this.set(event.target.value);
      this.update();
    }
  };
  onfocus = (/** @type {FocusEvent}*/ event) => {
    if (this.formula && event.target instanceof HTMLInputElement) {
      const span = event.target.nextElementSibling;
      if (span instanceof HTMLSpanElement) {
        const value = this.value;
        const type = typeof value;
        let text = "";
        if (type === "string" || type === "number" || type === "boolean") {
          text = "" + value;
        }
        span.innerText = text;
      }
    }
  };

  showValue() {
    return this.formula ? [html`<span class="propValue"></span>`] : [];
  }

  /** @param {Hole} body */
  labeled(body) {
    return html`
      <label class="labeledInput" ?hiddenLabel=${!!this.options.hiddenLabel}
        ><span class="labelText">${this.label}</span> ${body}</label
      >
    `;
  }

  /** @param {HTMLInputElement} inputElement */
  setValidity(inputElement) {
    if (inputElement instanceof HTMLInputElement) {
      if (this.error) {
        console.log("scv", this.error.message);
        inputElement.setCustomValidity(this.error.message);
        inputElement.reportValidity();
      } else {
        console.log("csv");
        inputElement.setCustomValidity("");
        inputElement.reportValidity();
      }
    } else {
      console.log("not found", inputElement);
    }
  }

  /** @param {any} value
   * @returns {T}
   * */
  cast(value) {
    if (typeof value == "string") {
      value = value.normalize("NFC");
    }
    return value;
  }

  /**
   * @param {any} value
   */
  set(value) {
    this.compiled = undefined;
    this.formula = "";
    if (
      typeof value == "string" &&
      (this.isFormulaByDefault || value.startsWith("="))
    ) {
      // compile it here
      value = value.normalize("NFC");
      let error;
      [this.compiled, error] = compileExpression(value);
      if (error) {
        console.error("set error", this.label, value, error.message);
      } else {
        this.formula = value;
      }
    } else {
      this._value = this.cast(value);
    }
  }

  /**
   * extract the value to save
   * returns {string}
   */
  get text() {
    if (this.formula || this.isFormulaByDefault) return this.formula;
    return "" + this._value;
  }

  /** @returns {T} */
  get value() {
    if (this.compiled) {
      if (!this.formula) {
        this._value = this.options.valueWhenEmpty ?? "";
      } else {
        const v = this.compiled();
        this._value = this.cast(v);
      }
    }
    return this._value;
  }

  /** @param {EvalContext} context - The context
   * @returns {T} */
  valueInContext(context = {}) {
    if (this.compiled) {
      if (!this.formula) {
        this._value = this.options.valueWhenEmpty ?? "";
      } else {
        const v = this.compiled(context);
        this._value = this.cast(v);
      }
    } else if (this.isFormulaByDefault) {
      this._value = this.options.valueWhenEmpty ?? "";
    }
    return this._value;
  }

  update() {
    this.container.update();
  }

  /** @param {Error} [error] */
  setError(error = undefined) {
    this.error = error;
  }
}

/** @param {string[] | Map<string,string> | function():Map<string,string>} arrayOrMap
 * @returns Map<string, string>
 */
export function toMap(arrayOrMap) {
  if (arrayOrMap instanceof Function) {
    return arrayOrMap();
  }
  if (Array.isArray(arrayOrMap)) {
    return new Map(arrayOrMap.map((item) => [item, item]));
  }
  return arrayOrMap;
}

/** @extends {Prop<string>} */
export class Select extends Prop {
  /**
   * @param {string[] | Map<string, string> | function():Map<string,string>} choices
   * @param {PropOptions} options
   */
  constructor(choices = [], options = {}) {
    super("", options);
    this.choices = choices;
    this._value = options.defaultValue || "";
  }

  /** @param {Map<string,string> | null} choices */
  input(choices = null) {
    if (!choices) {
      choices = toMap(this.choices);
    }
    this._value = this._value || this.options.defaultValue || "";
    return this.labeled(
      html`<select
        id=${this.id}
        ?required=${!this.options.notRequired}
        title=${this.options.title}
        @change=${({ target }) => {
          this._value = this.cast(target.value);
          this.update();
        }}
      >
        <option value="" ?selected=${!choices.has(this._value)}>
          ${this.options.placeholder || "Choose one..."}
        </option>
        ${[...choices.entries()].map(
          ([key, value]) =>
            html`<option value=${key} ?selected=${this._value == key}>
              ${value}
            </option>`,
        )}
      </select>`,
    );
  }

  /** @param {any} value */
  set(value) {
    this._value = this.cast(value);
  }
}

export class Field extends Select {
  /**
   * @param {PropOptions} options
   */
  constructor(options = {}) {
    const addedFields = options.addedFields || [];
    super(
      () =>
        toMap(
          [...Globals.data.allFields, "#ComponentName", ...addedFields].sort(),
        ),
      options,
    );
  }
}

export class Cue extends Select {
  /**
   * @param {PropOptions} options
   */
  constructor(options = {}) {
    super(() => Globals.cues.cueMap, options);
  }
}

export class Pattern extends Select {
  /**
   * @param {PropOptions} options
   */
  constructor(options = {}) {
    super(() => Globals.patterns.patternMap, options);
  }
}

export class TypeSelect extends Select {
  update() {
    /* Magic happens here! The replace method on a TreeBaseSwitchable replaces the
     * node with a new one to allow type switching in place
     * */
    if (this.container instanceof TreeBaseSwitchable && this._value) {
      this.container.replace(this._value);
    }
  }
}

/** @extends {Prop<string>} */
export class String extends Prop {}

/* Allow entering a key name by first pressing Enter than pressing a single key
 */
/** @extends {Prop<string>} */
export class KeyName extends Prop {
  /**
   * @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "", options = {}) {
    super(value, options);
  }

  input() {
    /** @param {string} key */
    function mapKey(key) {
      if (key == " ") return "Space";
      return key;
    }
    return this.labeled(
      html`<input
        type="text"
        .value=${mapKey(this._value)}
        id=${this.id}
        readonly
        @keydown=${(/** @type {KeyboardEvent} */ event) => {
          const target = event.target;
          if (!(target instanceof HTMLInputElement)) return;
          if (target.hasAttribute("readonly") && event.key == "Enter") {
            target.removeAttribute("readonly");
            target.select();
          } else if (!target.hasAttribute("readonly")) {
            event.stopPropagation();
            event.preventDefault();
            this._value = this.cast(event.key);
            target.value = mapKey(event.key);
            target.setAttribute("readonly", "");
          }
        }}
        title="Press Enter to change then press a single key to set"
        placeholder=${this.options.placeholder}
      />`,
    );
  }
}

/** @extends {Prop<string>} */
export class TextArea extends Prop {
  /**
   * @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "", options = {}) {
    super(value, options);
    this.validate = this.options.validate || ((_) => "");
  }

  input() {
    return this.labeled(
      html`<textarea
        .value=${this._value}
        id=${this.id}
        ?invalid=${!!this.validate(this._value)}
        @input=${({ target }) => {
          const errorMsg = this.validate(target.value);
          target.setCustomValidity(errorMsg);
        }}
        @change=${({ target }) => {
          if (target.checkValidity()) {
            this._value = this.cast(target.value);
            this.update();
          }
        }}
        title=${this.options.title}
        placeholder=${this.options.placeholder}
      />`,
    );
  }
}

/** @extends {Prop<number>} */
export class Integer extends Prop {
  /** @param {number} value
   * @param {PropOptions} options
   */
  constructor(value = 0, options = {}) {
    /** @param {string} value
     * @returns {string}
     */
    function validate(value) {
      if (!/^[0-9]+$/.test(value)) return "Please enter a whole number";
      if (typeof options.min === "number" && parseInt(value) < options.min) {
        return `Please enter a whole number at least ${options.min}`;
      }
      if (typeof options.max === "number" && parseInt(value) > options.max) {
        return `Please enter a whole number at most ${options.max}`;
      }
      return "";
    }
    options = {
      validate,
      inputmode: "numeric",
      ...options,
    };
    super(value, options);
  }

  /**
   * Convert the input into an integer
   * @param {any} value
   * @returns {number}
   */
  cast(value) {
    return Math.trunc(+value);
  }
}

/** @extends {Prop<number>} */
export class Float extends Prop {
  /** @param {number} value
   * @param {PropOptions} options
   */
  constructor(value = 0, options = {}) {
    /** @param {string} value
     * @returns {string}
     */
    const validate = (value) => {
      if (!/^[0-9]*([,.][0-9]*)?$/.test(value)) return "Please enter a number";
      if (typeof options.min === "number" && parseFloat(value) < options.min) {
        return `Please enter a number at least ${options.min}`;
      }
      if (typeof options.max === "number" && parseFloat(value) > options.max) {
        return `Please enter a number at most ${this.options.max}`;
      }
      return "";
    };
    options = {
      validate,
      inputmode: "decimal",
      ...options,
    };
    super(value, options);
  }

  /** @param {any} value */
  cast(value) {
    return +value;
  }
}

/** @extends {Prop<boolean>} */
export class Boolean extends Prop {
  /** @param {boolean} value
   * @param {PropOptions} options
   */
  constructor(value = false, options = {}) {
    super(value, options);
  }

  /**
   * @param {PropOptions} options
   */
  input(options = {}) {
    options = { ...this.options, ...options };
    return this.labeled(
      html`<input
        type="checkbox"
        ?checked=${this._value}
        id=${this.id}
        @change=${({ target }) => {
          this._value = target.checked;
          this.update();
        }}
        title=${options.title}
      />`,
    );
  }

  /** @param {any} value */
  set(value) {
    if (typeof value === "boolean") {
      this._value = value;
    } else if (typeof value === "string") {
      this._value = value === "true";
    }
  }
}

/** @extends {Prop<boolean>} */
export class OneOfGroup extends Prop {
  /** @param {boolean} value
   * @param {PropOptions} options
   */
  constructor(value = false, options = {}) {
    options = { group: "AGroup", ...options };
    super(value, options);
  }

  /**
   * @param {PropOptions} options
   */
  input(options = {}) {
    options = { ...this.options, ...options };
    return this.labeled(
      html`<input
        type="checkbox"
        .checked=${!!this._value}
        id=${this.id}
        name=${options.group}
        @click=${() => {
          this._value = true;
          this.clearPeers();
          this.update();
        }}
        title=${this.options.title}
      />`,
    );
  }

  /** @param {any} value */
  set(value) {
    if (typeof value === "boolean") {
      this._value = value;
    } else if (typeof value === "string") {
      this._value = value === "true";
    }
    if (this._value) {
      this.clearPeers();
    }
  }

  /**
   * Clear the value of peer radio buttons with the same name
   */
  clearPeers() {
    const name = this.options.group;
    const peers = this.container?.parent?.children || [];
    for (const peer of peers) {
      const props = peer.props;
      for (const propName in props) {
        const prop = props[propName];
        if (
          prop instanceof OneOfGroup &&
          prop.options.group == name &&
          prop != this
        ) {
          prop.set(false);
        }
      }
    }
  }
}

/** @extends {Prop<string>} */
export class UID extends Prop {
  constructor() {
    super("", {});
    this._value =
      "id" + Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
}

/** @extends {Prop<string|number|boolean>} */
export class Expression extends Prop {
  isFormulaByDefault = true;

  /** @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "", options = {}) {
    super(value, options);
    this.formula = value;
  }
}

/** @extends {Prop<boolean>} */
export class Conditional extends Prop {
  isFormulaByDefault = true;

  /** @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "", options = {}) {
    super(false, options);
    this.formula = value;
  }

  get value() {
    return !!super.value;
  }

  valueInContext(context = {}) {
    return !!super.valueInContext(context);
  }
}

/* Scratch sheet for validating CSS rules. Safari has no CSSStyleSheet
 * constructor before 16.4, so borrow one from a style element that can never
 * match. Reused across calls and emptied before each rule. */
let scratchSheet = null;
function validationSheet() {
  if (!scratchSheet) {
    const style = document.createElement("style");
    style.media = "not all";
    document.head.appendChild(style);
    scratchSheet = style.sheet;
  }
  while (scratchSheet.cssRules.length) scratchSheet.deleteRule(0);
  return scratchSheet;
}

/** @extends {Prop<string>} */
export class Code extends Prop {
  editedValue = "";

  /** @type {string[]} */
  errors = [];

  /** @type {number[]} */
  lineOffsets = [];

  /** @param {PropOptions} options */
  constructor(value = "", options = {}) {
    options = {
      language: "css",
      ...options,
    };
    super(value, options);
  }

  /** @param {HTMLTextAreaElement} target */
  addLineNumbers = (target) => {
    const numberOfLines = target.value.split("\n").length;
    const lineNumbers = /** @type {HTMLTextAreaElement} */ (
      target.previousElementSibling
    );
    const numbers = [];
    for (let ln = 1; ln <= numberOfLines; ln++) {
      numbers.push(ln);
    }
    lineNumbers.value = numbers.join("\n");
    const rows = Math.max(4, Math.min(10, numberOfLines));
    target.rows = rows;
    lineNumbers.rows = rows;
    lineNumbers.scrollTop = target.scrollTop;
  };

  /** @param {number} offset - where the error happened
   * @param {string} message - the error message
   */
  addError(offset, message) {
    const line = this._value.slice(0, offset).match(/$/gm)?.length || "??";
    this.errors.push(`${line}: ${message}`);
  }

  /** Edit and validate the value
   * */
  editCSS(props = {}, editSelector = (selector = "") => selector) {
    // replaces props in the full text
    let value = this._value;
    for (const prop in props) {
      value = value.replaceAll("$" + prop, props[prop]);
    }
    // clear the errors
    this.errors = [];
    // build the new rules here
    const editedRules = [];
    // match a single rule
    const ruleRE = /([\s\S]*?)({\s*[\s\S]*?}\s*)/dg;
    for (const ruleMatch of value.matchAll(ruleRE)) {
      let selector = ruleMatch[1];
      const indices = ruleMatch.indices;
      if (!indices) continue;
      const selectorOffset = indices[1][0];
      const body = ruleMatch[2];
      const bodyOffset = indices[2][0];
      // replace field names in the selector
      selector = selector.replace(
        /#(\w+)/g,
        /** @param {string} _
         * @param {string} name */
        (_, name) =>
          `data-${name.replace(
            /[A-Z]/g,
            (/** @type {string} */ m) => `-${m.toLowerCase()}`,
          )}`,
      );
      // prefix the selector so it only applies to the UI
      selector = `#UI ${editSelector(selector)}`;
      // reconstruct the rule
      const rule = selector + body;
      // add it to the result
      editedRules.push(rule);
      // validate the rule
      const styleSheet = validationSheet();
      try {
        // add the rule to the sheet. If the selector is bad we'll get an
        // exception. If any properties are bad they will omitted in the
        // result. I'm adding a bogus ;gap:0; property to the end of the body
        // because we get an exception if there is only one invalid property.
        let irule = (Globals.state && Globals.state.interpolate(rule)) || rule;
        const index = styleSheet.insertRule(irule.replace("}", ";gap:0;}"));
        // retrieve the rule
        const newRule = styleSheet.cssRules[index].cssText;
        // extract the body
        const ruleRE = /([\s\S]*?)({\s*[\s\S]*?}\s*)/dg;
        const match = ruleRE.exec(newRule);
        if (match) {
          const newBody = match[2];
          const propRE = /[-\w]+:/g;
          const newProperties = newBody.match(propRE);
          for (const propMatch of body.matchAll(propRE)) {
            if (!newProperties || newProperties.indexOf(propMatch[0]) < 0) {
              // the property was invalid
              this.addError(
                bodyOffset + (propMatch.index || 0),
                `property ${propMatch[0]} is invalid`,
              );
            }
          }
        } else {
          this.addError(selectorOffset, "Rule is invalid");
        }
      } catch (e) {
        this.addError(selectorOffset, "Rule is invalid");
      }
    }
    this.editedValue = editedRules.join("");
  }

  input() {
    return this.labeled(
      html`<div class="Code">
        <div class="numbered-textarea">
          <textarea class="line-numbers" readonly name="numbers"></textarea>
          <textarea
            class="text"
            .value=${this._value}
            id=${this.id}
            @change=${({ target }) => {
              this._value = this.cast(target.value);
              this.editCSS();
              this.update();
            }}
            @keyup=${(
              /** @type {{ target: HTMLTextAreaElement; }} */ event,
            ) => {
              this.addLineNumbers(event.target);
            }}
            @scroll=${({ target }) => {
              target.previousElementSibling.scrollTop = target.scrollTop;
            }}
            ref=${this.addLineNumbers}
            title=${this.options.title}
            placeholder=${this.options.placeholder}
          ></textarea>
        </div>
        <div class="errors">${this.errors.join("\n")}</div>
      </div>`,
    );
  }

  /** @param {string} value */
  set(value) {
    this._value = value;
    this.editCSS();
  }
}

/** @extends {Prop<string>} */
export class Color extends Prop {
  /**
   * @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "white", options = {}) {
    options = {
      /** @param {string} value */
      validate: (value) => {
        if (isValidColor(value)) {
          const swatch = document.querySelector(`#${this.id}~div`);
          if (swatch instanceof HTMLDivElement) {
            swatch.style.backgroundColor = getColor(value);
          }
          return "";
        }
        return "invalid color";
      },
      datalist: "ColorNames",
      ...options,
    };
    super(value, options);
  }

  showValue() {
    return [
      html`<div
        class="swatch"
        style=${styleString({ backgroundColor: getColor(this.value) })}
      ></div>`,
    ];
  }
}

/** @extends {Prop<string>} */
export class Voice extends Prop {
  /** @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "", options = {}) {
    super(value, options);
  }

  input() {
    return this.labeled(
      html`<select
        is="select-voice"
        .value=${this._value}
        id=${this.id}
        @change=${(/** @type {InputEventWithTarget} */ event) => {
          this._value = event.target.value;
          this.update();
        }}
      >
        <option value="">Default</option>
      </select>`,
    );
  }
}
/** @extends {Prop<string>} */
export class ADate extends Prop {
  /** @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "", options = {}) {
    super(value, options);
  }

  input() {
    return this.labeled(
      html`<input
        type="date"
        .value=${this._value}
        id=${this.id}
        @change=${(/** @type {InputEventWithTarget} */ event) => {
          this._value = event.target.value;
          this.update();
        }}
      />`,
    );
  }
}

/**
 * @template {unknown[]} T
 * @param {(...args: T)=>void} callback
 * @param {number} wait
 * @returns {(...args: T)=>void}
 * */
const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};
