import expressions from "angular-expressions";
import Globals from "./globals";
import db from "./db";

/** @param {function(string, string): string} f */
export function updateString(f) {
  /** @param {string} value */
  return function (value) {
    /** @param {string | undefined} old */
    return function (old) {
      return f(old || "", value || "");
    };
  };
}
/** @param {function(number, number): number} f */
function updateNumber(f) {
  /** @param {number} value */
  return function (value) {
    /** @param {number | undefined} old */
    return function (old) {
      return f(old || 0, value || 0);
    };
  };
}
export const Functions = {
  increment: updateNumber((old, value) => old + value),
  add_word: updateString((old, value) => old + value + " "),
  add_letter: updateString((old, value) => old + value),
  complete: updateString((old, value) => {
    if (old.length == 0 || old.endsWith(" ")) {
      return old + value;
    } else {
      return old.replace(/\S+$/, value);
    }
  }),
  replace_last: updateString((old, value) => old.replace(/\S*\s*$/, value)),
  replace_last_letter: updateString((old, value) => old.slice(0, -1) + value),
  random: (/** @type {string} */ arg) => {
    let args = arg.split(",");
    return args[Math.floor(Math.random() * args.length)];
  },
  max: Math.max,
  min: Math.min,
  if: (/** @type {boolean} */ c, /** @type {any} */ t, /** @type {any} */ f) =>
    c ? t : f,
  abs: (/** @type {number} */ v) => Math.abs(v),
  load_design: (url = "") => {
    if (!url) db.reloadDesignFromOriginalURL();
    else db.readDesignFromURL(url);
    return "loaded";
  },
  open_editor: () => {
    Globals.state.update({ editing: !Globals.state.get("editing") });
  },
};

/**
 * Translate an expression from Excel-like to Javascript
 *
 * @param {string} expression
 * @returns {string}
 */
function translate(expression) {
  /* translate the expression from the excel like form to javascript */
  // remove any initial = sign
  let exp = expression.replace(/^=/, "");
  // translate single = to ==
  // lookbehind would be clearer but it needs Safari 16.4
  exp = exp.replaceAll(/=/g, (_match, offset, str) =>
    offset > 0 && "=<>!".includes(str[offset - 1]) ? "=" : "==",
  );
  // translate words
  exp = exp.replaceAll(/#(\w+)/g, (match, word, offset, str) =>
    offset > 0 && (str[offset - 1] === "'" || str[offset - 1] === '"')
      ? match
      : "_" + word,
  );
  return exp;
}

/**
 * Validate an expression string
 *
 * @param {string} expression
 * @returns {boolean}
 */
export function validateExpression(expression) {
  try {
    const exp = translate(expression);
    expressions.compile(exp);
  } catch (error) {
    console.error("validate", error);
    return false;
  }
  return true;
}

/**
 * Cleanup access to state and data
 *
 * @param {State} state
 * @param {Row} data
 * @returns {function(string): any}
 */
export function access(state, data) {
  return function (name) {
    if (!name) return "";
    if (state && name.startsWith("$")) {
      return state.get(name);
    }
    if (data && name.startsWith("#")) {
      const r = data[name.slice(1)];
      if (r == null) return "";
      return r;
    }
    return "";
  };
}

/** Track access to states and fields, true if the value was undefined
 * @type {Map<string, boolean>}
 */
export const accessed = new Map();

/* intercept access to variables so I can track access to undefined state and field values
 * and map them to empty strings.
 */
const variableHandler = {
  /** @param {Object} target
   * @param {string} prop
   */
  get(target, prop) {
    let result = undefined;
    if (prop.startsWith("$")) {
      result = target.states[prop];
      accessed.set(prop, prop in target.states);
    } else if (prop.startsWith("_")) {
      let ps = prop.slice(1);
      result = target.data[ps];
      accessed.set(prop, Globals.data.allFields.has("#" + ps));
    } else if (prop in Functions) {
      result = Functions[prop];
    } else {
      console.error("undefined", prop);
    }
    if (result === undefined || result === null) {
      result = "";
    }
    return result;
  },

  /** The expressions library is testing for own properties for safety.
   * I need to defeat that for the renaming I want to do.
   * @param {Object} target;
   * @param {string} prop;
   */
  getOwnPropertyDescriptor(target, prop) {
    if (prop.startsWith("$")) {
      return Object.getOwnPropertyDescriptor(target.states, prop);
    } else if (prop.startsWith("_")) {
      return { configurable: true, enumerable: true };
    } else {
      return Object.getOwnPropertyDescriptor(Functions, prop);
    }
  },
};

/**
 * Compile an expression returning the function or an error
 * @param {string} expression
 * @returns {[ ((context?:Object)=>any ) | undefined, Error | undefined ]}
 *
 * */
export function compileExpression(expression) {
  const te = translate(expression);
  try {
    const exp = expressions.compile(te);
    /** @param {EvalContext} context */
    return [
      (context = {}) => {
        let states =
          "states" in context
            ? { ...Globals.state.values, ...context.states }
            : Globals.state.values;
        let data = context.data ?? {};
        const r = exp(
          new Proxy(
            {
              Functions,
              states,
              data,
            },
            variableHandler,
          ),
        );
        return r;
      },
      undefined,
    ];
  } catch (e) {
    return [undefined, e];
  }
}
