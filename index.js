true&&(function polyfill() {
    const relList = document.createElement('link').relList;
    if (relList && relList.supports && relList.supports('modulepreload')) {
        return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
    }
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'LINK' && node.rel === 'modulepreload')
                    processPreload(node);
            }
        }
    }).observe(document, { childList: true, subtree: true });
    function getFetchOpts(link) {
        const fetchOpts = {};
        if (link.integrity)
            fetchOpts.integrity = link.integrity;
        if (link.referrerPolicy)
            fetchOpts.referrerPolicy = link.referrerPolicy;
        if (link.crossOrigin === 'use-credentials')
            fetchOpts.credentials = 'include';
        else if (link.crossOrigin === 'anonymous')
            fetchOpts.credentials = 'omit';
        else
            fetchOpts.credentials = 'same-origin';
        return fetchOpts;
    }
    function processPreload(link) {
        if (link.ep)
            // ep marker = processed
            return;
        link.ep = true;
        // prepopulate the load record
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
    }
}());

const site = '';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var stacktrace = {exports: {}};

var errorStackParser = {exports: {}};

var stackframe = {exports: {}};

var hasRequiredStackframe;

function requireStackframe () {
	if (hasRequiredStackframe) return stackframe.exports;
	hasRequiredStackframe = 1;
	(function (module, exports) {
		(function(root, factory) {
		    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

		    /* istanbul ignore next */
		    {
		        module.exports = factory();
		    }
		}(commonjsGlobal, function() {
		    function _isNumber(n) {
		        return !isNaN(parseFloat(n)) && isFinite(n);
		    }

		    function _capitalize(str) {
		        return str.charAt(0).toUpperCase() + str.substring(1);
		    }

		    function _getter(p) {
		        return function() {
		            return this[p];
		        };
		    }

		    var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
		    var numericProps = ['columnNumber', 'lineNumber'];
		    var stringProps = ['fileName', 'functionName', 'source'];
		    var arrayProps = ['args'];
		    var objectProps = ['evalOrigin'];

		    var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);

		    function StackFrame(obj) {
		        if (!obj) return;
		        for (var i = 0; i < props.length; i++) {
		            if (obj[props[i]] !== undefined) {
		                this['set' + _capitalize(props[i])](obj[props[i]]);
		            }
		        }
		    }

		    StackFrame.prototype = {
		        getArgs: function() {
		            return this.args;
		        },
		        setArgs: function(v) {
		            if (Object.prototype.toString.call(v) !== '[object Array]') {
		                throw new TypeError('Args must be an Array');
		            }
		            this.args = v;
		        },

		        getEvalOrigin: function() {
		            return this.evalOrigin;
		        },
		        setEvalOrigin: function(v) {
		            if (v instanceof StackFrame) {
		                this.evalOrigin = v;
		            } else if (v instanceof Object) {
		                this.evalOrigin = new StackFrame(v);
		            } else {
		                throw new TypeError('Eval Origin must be an Object or StackFrame');
		            }
		        },

		        toString: function() {
		            var fileName = this.getFileName() || '';
		            var lineNumber = this.getLineNumber() || '';
		            var columnNumber = this.getColumnNumber() || '';
		            var functionName = this.getFunctionName() || '';
		            if (this.getIsEval()) {
		                if (fileName) {
		                    return '[eval] (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
		                }
		                return '[eval]:' + lineNumber + ':' + columnNumber;
		            }
		            if (functionName) {
		                return functionName + ' (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
		            }
		            return fileName + ':' + lineNumber + ':' + columnNumber;
		        }
		    };

		    StackFrame.fromString = function StackFrame$$fromString(str) {
		        var argsStartIndex = str.indexOf('(');
		        var argsEndIndex = str.lastIndexOf(')');

		        var functionName = str.substring(0, argsStartIndex);
		        var args = str.substring(argsStartIndex + 1, argsEndIndex).split(',');
		        var locationString = str.substring(argsEndIndex + 1);

		        if (locationString.indexOf('@') === 0) {
		            var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, '');
		            var fileName = parts[1];
		            var lineNumber = parts[2];
		            var columnNumber = parts[3];
		        }

		        return new StackFrame({
		            functionName: functionName,
		            args: args || undefined,
		            fileName: fileName,
		            lineNumber: lineNumber || undefined,
		            columnNumber: columnNumber || undefined
		        });
		    };

		    for (var i = 0; i < booleanProps.length; i++) {
		        StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
		        StackFrame.prototype['set' + _capitalize(booleanProps[i])] = (function(p) {
		            return function(v) {
		                this[p] = Boolean(v);
		            };
		        })(booleanProps[i]);
		    }

		    for (var j = 0; j < numericProps.length; j++) {
		        StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);
		        StackFrame.prototype['set' + _capitalize(numericProps[j])] = (function(p) {
		            return function(v) {
		                if (!_isNumber(v)) {
		                    throw new TypeError(p + ' must be a Number');
		                }
		                this[p] = Number(v);
		            };
		        })(numericProps[j]);
		    }

		    for (var k = 0; k < stringProps.length; k++) {
		        StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);
		        StackFrame.prototype['set' + _capitalize(stringProps[k])] = (function(p) {
		            return function(v) {
		                this[p] = String(v);
		            };
		        })(stringProps[k]);
		    }

		    return StackFrame;
		})); 
	} (stackframe));
	return stackframe.exports;
}

var hasRequiredErrorStackParser;

function requireErrorStackParser () {
	if (hasRequiredErrorStackParser) return errorStackParser.exports;
	hasRequiredErrorStackParser = 1;
	(function (module, exports) {
		(function(root, factory) {
		    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

		    /* istanbul ignore next */
		    {
		        module.exports = factory(requireStackframe());
		    }
		}(commonjsGlobal, function ErrorStackParser(StackFrame) {

		    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
		    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
		    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;

		    return {
		        /**
		         * Given an Error object, extract the most information from it.
		         *
		         * @param {Error} error object
		         * @return {Array} of StackFrames
		         */
		        parse: function ErrorStackParser$$parse(error) {
		            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
		                return this.parseOpera(error);
		            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
		                return this.parseV8OrIE(error);
		            } else if (error.stack) {
		                return this.parseFFOrSafari(error);
		            } else {
		                throw new Error('Cannot parse given Error object');
		            }
		        },

		        // Separate line and column numbers from a string of the form: (URI:Line:Column)
		        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
		            // Fail-fast but return locations like "(native)"
		            if (urlLike.indexOf(':') === -1) {
		                return [urlLike];
		            }

		            var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
		            var parts = regExp.exec(urlLike.replace(/[()]/g, ''));
		            return [parts[1], parts[2] || undefined, parts[3] || undefined];
		        },

		        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
		            var filtered = error.stack.split('\n').filter(function(line) {
		                return !!line.match(CHROME_IE_STACK_REGEXP);
		            }, this);

		            return filtered.map(function(line) {
		                if (line.indexOf('(eval ') > -1) {
		                    // Throw away eval information until we implement stacktrace.js/stackframe#8
		                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(,.*$)/g, '');
		                }
		                var sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').replace(/^.*?\s+/, '');

		                // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
		                // case it has spaces in it, as the string is split on \s+ later on
		                var location = sanitizedLine.match(/ (\(.+\)$)/);

		                // remove the parenthesized location from the line, if it was matched
		                sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine;

		                // if a location was matched, pass it to extractLocation() otherwise pass all sanitizedLine
		                // because this line doesn't have function name
		                var locationParts = this.extractLocation(location ? location[1] : sanitizedLine);
		                var functionName = location && sanitizedLine || undefined;
		                var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

		                return new StackFrame({
		                    functionName: functionName,
		                    fileName: fileName,
		                    lineNumber: locationParts[1],
		                    columnNumber: locationParts[2],
		                    source: line
		                });
		            }, this);
		        },

		        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
		            var filtered = error.stack.split('\n').filter(function(line) {
		                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
		            }, this);

		            return filtered.map(function(line) {
		                // Throw away eval information until we implement stacktrace.js/stackframe#8
		                if (line.indexOf(' > eval') > -1) {
		                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
		                }

		                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
		                    // Safari eval frames only have function names and nothing else
		                    return new StackFrame({
		                        functionName: line
		                    });
		                } else {
		                    var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
		                    var matches = line.match(functionNameRegex);
		                    var functionName = matches && matches[1] ? matches[1] : undefined;
		                    var locationParts = this.extractLocation(line.replace(functionNameRegex, ''));

		                    return new StackFrame({
		                        functionName: functionName,
		                        fileName: locationParts[0],
		                        lineNumber: locationParts[1],
		                        columnNumber: locationParts[2],
		                        source: line
		                    });
		                }
		            }, this);
		        },

		        parseOpera: function ErrorStackParser$$parseOpera(e) {
		            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
		                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
		                return this.parseOpera9(e);
		            } else if (!e.stack) {
		                return this.parseOpera10(e);
		            } else {
		                return this.parseOpera11(e);
		            }
		        },

		        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
		            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
		            var lines = e.message.split('\n');
		            var result = [];

		            for (var i = 2, len = lines.length; i < len; i += 2) {
		                var match = lineRE.exec(lines[i]);
		                if (match) {
		                    result.push(new StackFrame({
		                        fileName: match[2],
		                        lineNumber: match[1],
		                        source: lines[i]
		                    }));
		                }
		            }

		            return result;
		        },

		        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
		            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
		            var lines = e.stacktrace.split('\n');
		            var result = [];

		            for (var i = 0, len = lines.length; i < len; i += 2) {
		                var match = lineRE.exec(lines[i]);
		                if (match) {
		                    result.push(
		                        new StackFrame({
		                            functionName: match[3] || undefined,
		                            fileName: match[2],
		                            lineNumber: match[1],
		                            source: lines[i]
		                        })
		                    );
		                }
		            }

		            return result;
		        },

		        // Opera 10.65+ Error.stack very similar to FF/Safari
		        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
		            var filtered = error.stack.split('\n').filter(function(line) {
		                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
		            }, this);

		            return filtered.map(function(line) {
		                var tokens = line.split('@');
		                var locationParts = this.extractLocation(tokens.pop());
		                var functionCall = (tokens.shift() || '');
		                var functionName = functionCall
		                    .replace(/<anonymous function(: (\w+))?>/, '$2')
		                    .replace(/\([^)]*\)/g, '') || undefined;
		                var argsRaw;
		                if (functionCall.match(/\(([^)]*)\)/)) {
		                    argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1');
		                }
		                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
		                    undefined : argsRaw.split(',');

		                return new StackFrame({
		                    functionName: functionName,
		                    args: args,
		                    fileName: locationParts[0],
		                    lineNumber: locationParts[1],
		                    columnNumber: locationParts[2],
		                    source: line
		                });
		            }, this);
		        }
		    };
		})); 
	} (errorStackParser));
	return errorStackParser.exports;
}

var stackGenerator = {exports: {}};

var hasRequiredStackGenerator;

function requireStackGenerator () {
	if (hasRequiredStackGenerator) return stackGenerator.exports;
	hasRequiredStackGenerator = 1;
	(function (module, exports) {
		(function(root, factory) {
		    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

		    /* istanbul ignore next */
		    {
		        module.exports = factory(requireStackframe());
		    }
		}(commonjsGlobal, function(StackFrame) {
		    return {
		        backtrace: function StackGenerator$$backtrace(opts) {
		            var stack = [];
		            var maxStackSize = 10;

		            if (typeof opts === 'object' && typeof opts.maxStackSize === 'number') {
		                maxStackSize = opts.maxStackSize;
		            }

		            var curr = arguments.callee;
		            while (curr && stack.length < maxStackSize && curr['arguments']) {
		                // Allow V8 optimizations
		                var args = new Array(curr['arguments'].length);
		                for (var i = 0; i < args.length; ++i) {
		                    args[i] = curr['arguments'][i];
		                }
		                if (/function(?:\s+([\w$]+))+\s*\(/.test(curr.toString())) {
		                    stack.push(new StackFrame({functionName: RegExp.$1 || undefined, args: args}));
		                } else {
		                    stack.push(new StackFrame({args: args}));
		                }

		                try {
		                    curr = curr.caller;
		                } catch (e) {
		                    break;
		                }
		            }
		            return stack;
		        }
		    };
		})); 
	} (stackGenerator));
	return stackGenerator.exports;
}

var stacktraceGps = {exports: {}};

var sourceMapConsumer = {};

var util = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredUtil;

function requireUtil () {
	if (hasRequiredUtil) return util;
	hasRequiredUtil = 1;
	(function (exports) {
		/*
		 * Copyright 2011 Mozilla Foundation and contributors
		 * Licensed under the New BSD license. See LICENSE or:
		 * http://opensource.org/licenses/BSD-3-Clause
		 */

		/**
		 * This is a helper function for getting values from parameter/options
		 * objects.
		 *
		 * @param args The object we are extracting values from
		 * @param name The name of the property we are getting.
		 * @param defaultValue An optional value to return if the property is missing
		 * from the object. If this is not specified and the property is missing, an
		 * error will be thrown.
		 */
		function getArg(aArgs, aName, aDefaultValue) {
		  if (aName in aArgs) {
		    return aArgs[aName];
		  } else if (arguments.length === 3) {
		    return aDefaultValue;
		  } else {
		    throw new Error('"' + aName + '" is a required argument.');
		  }
		}
		exports.getArg = getArg;

		var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
		var dataUrlRegexp = /^data:.+\,.+$/;

		function urlParse(aUrl) {
		  var match = aUrl.match(urlRegexp);
		  if (!match) {
		    return null;
		  }
		  return {
		    scheme: match[1],
		    auth: match[2],
		    host: match[3],
		    port: match[4],
		    path: match[5]
		  };
		}
		exports.urlParse = urlParse;

		function urlGenerate(aParsedUrl) {
		  var url = '';
		  if (aParsedUrl.scheme) {
		    url += aParsedUrl.scheme + ':';
		  }
		  url += '//';
		  if (aParsedUrl.auth) {
		    url += aParsedUrl.auth + '@';
		  }
		  if (aParsedUrl.host) {
		    url += aParsedUrl.host;
		  }
		  if (aParsedUrl.port) {
		    url += ":" + aParsedUrl.port;
		  }
		  if (aParsedUrl.path) {
		    url += aParsedUrl.path;
		  }
		  return url;
		}
		exports.urlGenerate = urlGenerate;

		/**
		 * Normalizes a path, or the path portion of a URL:
		 *
		 * - Replaces consecutive slashes with one slash.
		 * - Removes unnecessary '.' parts.
		 * - Removes unnecessary '<dir>/..' parts.
		 *
		 * Based on code in the Node.js 'path' core module.
		 *
		 * @param aPath The path or url to normalize.
		 */
		function normalize(aPath) {
		  var path = aPath;
		  var url = urlParse(aPath);
		  if (url) {
		    if (!url.path) {
		      return aPath;
		    }
		    path = url.path;
		  }
		  var isAbsolute = exports.isAbsolute(path);

		  var parts = path.split(/\/+/);
		  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
		    part = parts[i];
		    if (part === '.') {
		      parts.splice(i, 1);
		    } else if (part === '..') {
		      up++;
		    } else if (up > 0) {
		      if (part === '') {
		        // The first part is blank if the path is absolute. Trying to go
		        // above the root is a no-op. Therefore we can remove all '..' parts
		        // directly after the root.
		        parts.splice(i + 1, up);
		        up = 0;
		      } else {
		        parts.splice(i, 2);
		        up--;
		      }
		    }
		  }
		  path = parts.join('/');

		  if (path === '') {
		    path = isAbsolute ? '/' : '.';
		  }

		  if (url) {
		    url.path = path;
		    return urlGenerate(url);
		  }
		  return path;
		}
		exports.normalize = normalize;

		/**
		 * Joins two paths/URLs.
		 *
		 * @param aRoot The root path or URL.
		 * @param aPath The path or URL to be joined with the root.
		 *
		 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
		 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
		 *   first.
		 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
		 *   is updated with the result and aRoot is returned. Otherwise the result
		 *   is returned.
		 *   - If aPath is absolute, the result is aPath.
		 *   - Otherwise the two paths are joined with a slash.
		 * - Joining for example 'http://' and 'www.example.com' is also supported.
		 */
		function join(aRoot, aPath) {
		  if (aRoot === "") {
		    aRoot = ".";
		  }
		  if (aPath === "") {
		    aPath = ".";
		  }
		  var aPathUrl = urlParse(aPath);
		  var aRootUrl = urlParse(aRoot);
		  if (aRootUrl) {
		    aRoot = aRootUrl.path || '/';
		  }

		  // `join(foo, '//www.example.org')`
		  if (aPathUrl && !aPathUrl.scheme) {
		    if (aRootUrl) {
		      aPathUrl.scheme = aRootUrl.scheme;
		    }
		    return urlGenerate(aPathUrl);
		  }

		  if (aPathUrl || aPath.match(dataUrlRegexp)) {
		    return aPath;
		  }

		  // `join('http://', 'www.example.com')`
		  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
		    aRootUrl.host = aPath;
		    return urlGenerate(aRootUrl);
		  }

		  var joined = aPath.charAt(0) === '/'
		    ? aPath
		    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

		  if (aRootUrl) {
		    aRootUrl.path = joined;
		    return urlGenerate(aRootUrl);
		  }
		  return joined;
		}
		exports.join = join;

		exports.isAbsolute = function (aPath) {
		  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
		};

		/**
		 * Make a path relative to a URL or another path.
		 *
		 * @param aRoot The root path or URL.
		 * @param aPath The path or URL to be made relative to aRoot.
		 */
		function relative(aRoot, aPath) {
		  if (aRoot === "") {
		    aRoot = ".";
		  }

		  aRoot = aRoot.replace(/\/$/, '');

		  // It is possible for the path to be above the root. In this case, simply
		  // checking whether the root is a prefix of the path won't work. Instead, we
		  // need to remove components from the root one by one, until either we find
		  // a prefix that fits, or we run out of components to remove.
		  var level = 0;
		  while (aPath.indexOf(aRoot + '/') !== 0) {
		    var index = aRoot.lastIndexOf("/");
		    if (index < 0) {
		      return aPath;
		    }

		    // If the only part of the root that is left is the scheme (i.e. http://,
		    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
		    // have exhausted all components, so the path is not relative to the root.
		    aRoot = aRoot.slice(0, index);
		    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
		      return aPath;
		    }

		    ++level;
		  }

		  // Make sure we add a "../" for each component we removed from the root.
		  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
		}
		exports.relative = relative;

		var supportsNullProto = (function () {
		  var obj = Object.create(null);
		  return !('__proto__' in obj);
		}());

		function identity (s) {
		  return s;
		}

		/**
		 * Because behavior goes wacky when you set `__proto__` on objects, we
		 * have to prefix all the strings in our set with an arbitrary character.
		 *
		 * See https://github.com/mozilla/source-map/pull/31 and
		 * https://github.com/mozilla/source-map/issues/30
		 *
		 * @param String aStr
		 */
		function toSetString(aStr) {
		  if (isProtoString(aStr)) {
		    return '$' + aStr;
		  }

		  return aStr;
		}
		exports.toSetString = supportsNullProto ? identity : toSetString;

		function fromSetString(aStr) {
		  if (isProtoString(aStr)) {
		    return aStr.slice(1);
		  }

		  return aStr;
		}
		exports.fromSetString = supportsNullProto ? identity : fromSetString;

		function isProtoString(s) {
		  if (!s) {
		    return false;
		  }

		  var length = s.length;

		  if (length < 9 /* "__proto__".length */) {
		    return false;
		  }

		  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
		      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
		      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
		      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
		      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
		      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
		      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
		      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
		      s.charCodeAt(length - 9) !== 95  /* '_' */) {
		    return false;
		  }

		  for (var i = length - 10; i >= 0; i--) {
		    if (s.charCodeAt(i) !== 36 /* '$' */) {
		      return false;
		    }
		  }

		  return true;
		}

		/**
		 * Comparator between two mappings where the original positions are compared.
		 *
		 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
		 * mappings with the same original source/line/column, but different generated
		 * line and column the same. Useful when searching for a mapping with a
		 * stubbed out mapping.
		 */
		function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
		  var cmp = mappingA.source - mappingB.source;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalLine - mappingB.originalLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalColumn - mappingB.originalColumn;
		  if (cmp !== 0 || onlyCompareOriginal) {
		    return cmp;
		  }

		  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.generatedLine - mappingB.generatedLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  return mappingA.name - mappingB.name;
		}
		exports.compareByOriginalPositions = compareByOriginalPositions;

		/**
		 * Comparator between two mappings with deflated source and name indices where
		 * the generated positions are compared.
		 *
		 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
		 * mappings with the same generated line and column, but different
		 * source/name/original line and column the same. Useful when searching for a
		 * mapping with a stubbed out mapping.
		 */
		function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
		  var cmp = mappingA.generatedLine - mappingB.generatedLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		  if (cmp !== 0 || onlyCompareGenerated) {
		    return cmp;
		  }

		  cmp = mappingA.source - mappingB.source;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalLine - mappingB.originalLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalColumn - mappingB.originalColumn;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  return mappingA.name - mappingB.name;
		}
		exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

		function strcmp(aStr1, aStr2) {
		  if (aStr1 === aStr2) {
		    return 0;
		  }

		  if (aStr1 > aStr2) {
		    return 1;
		  }

		  return -1;
		}

		/**
		 * Comparator between two mappings with inflated source and name strings where
		 * the generated positions are compared.
		 */
		function compareByGeneratedPositionsInflated(mappingA, mappingB) {
		  var cmp = mappingA.generatedLine - mappingB.generatedLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = strcmp(mappingA.source, mappingB.source);
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalLine - mappingB.originalLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalColumn - mappingB.originalColumn;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  return strcmp(mappingA.name, mappingB.name);
		}
		exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated; 
	} (util));
	return util;
}

var binarySearch = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredBinarySearch;

function requireBinarySearch () {
	if (hasRequiredBinarySearch) return binarySearch;
	hasRequiredBinarySearch = 1;
	(function (exports) {
		/*
		 * Copyright 2011 Mozilla Foundation and contributors
		 * Licensed under the New BSD license. See LICENSE or:
		 * http://opensource.org/licenses/BSD-3-Clause
		 */

		exports.GREATEST_LOWER_BOUND = 1;
		exports.LEAST_UPPER_BOUND = 2;

		/**
		 * Recursive implementation of binary search.
		 *
		 * @param aLow Indices here and lower do not contain the needle.
		 * @param aHigh Indices here and higher do not contain the needle.
		 * @param aNeedle The element being searched for.
		 * @param aHaystack The non-empty array being searched.
		 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
		 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
		 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
		 *     closest element that is smaller than or greater than the one we are
		 *     searching for, respectively, if the exact element cannot be found.
		 */
		function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
		  // This function terminates when one of the following is true:
		  //
		  //   1. We find the exact element we are looking for.
		  //
		  //   2. We did not find the exact element, but we can return the index of
		  //      the next-closest element.
		  //
		  //   3. We did not find the exact element, and there is no next-closest
		  //      element than the one we are searching for, so we return -1.
		  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
		  var cmp = aCompare(aNeedle, aHaystack[mid], true);
		  if (cmp === 0) {
		    // Found the element we are looking for.
		    return mid;
		  }
		  else if (cmp > 0) {
		    // Our needle is greater than aHaystack[mid].
		    if (aHigh - mid > 1) {
		      // The element is in the upper half.
		      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
		    }

		    // The exact needle element was not found in this haystack. Determine if
		    // we are in termination case (3) or (2) and return the appropriate thing.
		    if (aBias == exports.LEAST_UPPER_BOUND) {
		      return aHigh < aHaystack.length ? aHigh : -1;
		    } else {
		      return mid;
		    }
		  }
		  else {
		    // Our needle is less than aHaystack[mid].
		    if (mid - aLow > 1) {
		      // The element is in the lower half.
		      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
		    }

		    // we are in termination case (3) or (2) and return the appropriate thing.
		    if (aBias == exports.LEAST_UPPER_BOUND) {
		      return mid;
		    } else {
		      return aLow < 0 ? -1 : aLow;
		    }
		  }
		}

		/**
		 * This is an implementation of binary search which will always try and return
		 * the index of the closest element if there is no exact hit. This is because
		 * mappings between original and generated line/col pairs are single points,
		 * and there is an implicit region between each of them, so a miss just means
		 * that you aren't on the very start of a region.
		 *
		 * @param aNeedle The element you are looking for.
		 * @param aHaystack The array that is being searched.
		 * @param aCompare A function which takes the needle and an element in the
		 *     array and returns -1, 0, or 1 depending on whether the needle is less
		 *     than, equal to, or greater than the element, respectively.
		 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
		 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
		 *     closest element that is smaller than or greater than the one we are
		 *     searching for, respectively, if the exact element cannot be found.
		 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
		 */
		exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
		  if (aHaystack.length === 0) {
		    return -1;
		  }

		  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
		                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
		  if (index < 0) {
		    return -1;
		  }

		  // We have found either the exact element, or the next-closest element than
		  // the one we are searching for. However, there may be more than one such
		  // element. Make sure we always return the smallest of these.
		  while (index - 1 >= 0) {
		    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
		      break;
		    }
		    --index;
		  }

		  return index;
		}; 
	} (binarySearch));
	return binarySearch;
}

var arraySet = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredArraySet;

function requireArraySet () {
	if (hasRequiredArraySet) return arraySet;
	hasRequiredArraySet = 1;
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */

	var util = requireUtil();
	var has = Object.prototype.hasOwnProperty;

	/**
	 * A data structure which is a combination of an array and a set. Adding a new
	 * member is O(1), testing for membership is O(1), and finding the index of an
	 * element is O(1). Removing elements from the set is not supported. Only
	 * strings are supported for membership.
	 */
	function ArraySet() {
	  this._array = [];
	  this._set = Object.create(null);
	}

	/**
	 * Static method for creating ArraySet instances from an existing array.
	 */
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	  var set = new ArraySet();
	  for (var i = 0, len = aArray.length; i < len; i++) {
	    set.add(aArray[i], aAllowDuplicates);
	  }
	  return set;
	};

	/**
	 * Return how many unique items are in this ArraySet. If duplicates have been
	 * added, than those do not count towards the size.
	 *
	 * @returns Number
	 */
	ArraySet.prototype.size = function ArraySet_size() {
	  return Object.getOwnPropertyNames(this._set).length;
	};

	/**
	 * Add the given string to this set.
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	  var sStr = util.toSetString(aStr);
	  var isDuplicate = has.call(this._set, sStr);
	  var idx = this._array.length;
	  if (!isDuplicate || aAllowDuplicates) {
	    this._array.push(aStr);
	  }
	  if (!isDuplicate) {
	    this._set[sStr] = idx;
	  }
	};

	/**
	 * Is the given string a member of this set?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.has = function ArraySet_has(aStr) {
	  var sStr = util.toSetString(aStr);
	  return has.call(this._set, sStr);
	};

	/**
	 * What is the index of the given string in the array?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	  var sStr = util.toSetString(aStr);
	  if (has.call(this._set, sStr)) {
	    return this._set[sStr];
	  }
	  throw new Error('"' + aStr + '" is not in the set.');
	};

	/**
	 * What is the element at the given index?
	 *
	 * @param Number aIdx
	 */
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
	  if (aIdx >= 0 && aIdx < this._array.length) {
	    return this._array[aIdx];
	  }
	  throw new Error('No element indexed by ' + aIdx);
	};

	/**
	 * Returns the array representation of this set (which has the proper indices
	 * indicated by indexOf). Note that this is a copy of the internal array used
	 * for storing the members so that no one can mess with internal state.
	 */
	ArraySet.prototype.toArray = function ArraySet_toArray() {
	  return this._array.slice();
	};

	arraySet.ArraySet = ArraySet;
	return arraySet;
}

var base64Vlq = {};

var base64 = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredBase64;

function requireBase64 () {
	if (hasRequiredBase64) return base64;
	hasRequiredBase64 = 1;
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */

	var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

	/**
	 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
	 */
	base64.encode = function (number) {
	  if (0 <= number && number < intToCharMap.length) {
	    return intToCharMap[number];
	  }
	  throw new TypeError("Must be between 0 and 63: " + number);
	};

	/**
	 * Decode a single base 64 character code digit to an integer. Returns -1 on
	 * failure.
	 */
	base64.decode = function (charCode) {
	  var bigA = 65;     // 'A'
	  var bigZ = 90;     // 'Z'

	  var littleA = 97;  // 'a'
	  var littleZ = 122; // 'z'

	  var zero = 48;     // '0'
	  var nine = 57;     // '9'

	  var plus = 43;     // '+'
	  var slash = 47;    // '/'

	  var littleOffset = 26;
	  var numberOffset = 52;

	  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
	  if (bigA <= charCode && charCode <= bigZ) {
	    return (charCode - bigA);
	  }

	  // 26 - 51: abcdefghijklmnopqrstuvwxyz
	  if (littleA <= charCode && charCode <= littleZ) {
	    return (charCode - littleA + littleOffset);
	  }

	  // 52 - 61: 0123456789
	  if (zero <= charCode && charCode <= nine) {
	    return (charCode - zero + numberOffset);
	  }

	  // 62: +
	  if (charCode == plus) {
	    return 62;
	  }

	  // 63: /
	  if (charCode == slash) {
	    return 63;
	  }

	  // Invalid base64 digit.
	  return -1;
	};
	return base64;
}

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredBase64Vlq;

function requireBase64Vlq () {
	if (hasRequiredBase64Vlq) return base64Vlq;
	hasRequiredBase64Vlq = 1;
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 *
	 * Based on the Base 64 VLQ implementation in Closure Compiler:
	 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
	 *
	 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are
	 * met:
	 *
	 *  * Redistributions of source code must retain the above copyright
	 *    notice, this list of conditions and the following disclaimer.
	 *  * Redistributions in binary form must reproduce the above
	 *    copyright notice, this list of conditions and the following
	 *    disclaimer in the documentation and/or other materials provided
	 *    with the distribution.
	 *  * Neither the name of Google Inc. nor the names of its
	 *    contributors may be used to endorse or promote products derived
	 *    from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	var base64 = requireBase64();

	// A single base 64 digit can contain 6 bits of data. For the base 64 variable
	// length quantities we use in the source map spec, the first bit is the sign,
	// the next four bits are the actual value, and the 6th bit is the
	// continuation bit. The continuation bit tells us whether there are more
	// digits in this value following this digit.
	//
	//   Continuation
	//   |    Sign
	//   |    |
	//   V    V
	//   101011

	var VLQ_BASE_SHIFT = 5;

	// binary: 100000
	var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

	// binary: 011111
	var VLQ_BASE_MASK = VLQ_BASE - 1;

	// binary: 100000
	var VLQ_CONTINUATION_BIT = VLQ_BASE;

	/**
	 * Converts from a two-complement value to a value where the sign bit is
	 * placed in the least significant bit.  For example, as decimals:
	 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	 */
	function toVLQSigned(aValue) {
	  return aValue < 0
	    ? ((-aValue) << 1) + 1
	    : (aValue << 1) + 0;
	}

	/**
	 * Converts to a two-complement value from a value where the sign bit is
	 * placed in the least significant bit.  For example, as decimals:
	 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	 */
	function fromVLQSigned(aValue) {
	  var isNegative = (aValue & 1) === 1;
	  var shifted = aValue >> 1;
	  return isNegative
	    ? -shifted
	    : shifted;
	}

	/**
	 * Returns the base 64 VLQ encoded value.
	 */
	base64Vlq.encode = function base64VLQ_encode(aValue) {
	  var encoded = "";
	  var digit;

	  var vlq = toVLQSigned(aValue);

	  do {
	    digit = vlq & VLQ_BASE_MASK;
	    vlq >>>= VLQ_BASE_SHIFT;
	    if (vlq > 0) {
	      // There are still more digits in this value, so we must make sure the
	      // continuation bit is marked.
	      digit |= VLQ_CONTINUATION_BIT;
	    }
	    encoded += base64.encode(digit);
	  } while (vlq > 0);

	  return encoded;
	};

	/**
	 * Decodes the next base 64 VLQ value from the given string and returns the
	 * value and the rest of the string via the out parameter.
	 */
	base64Vlq.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
	  var strLen = aStr.length;
	  var result = 0;
	  var shift = 0;
	  var continuation, digit;

	  do {
	    if (aIndex >= strLen) {
	      throw new Error("Expected more digits in base 64 VLQ value.");
	    }

	    digit = base64.decode(aStr.charCodeAt(aIndex++));
	    if (digit === -1) {
	      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
	    }

	    continuation = !!(digit & VLQ_CONTINUATION_BIT);
	    digit &= VLQ_BASE_MASK;
	    result = result + (digit << shift);
	    shift += VLQ_BASE_SHIFT;
	  } while (continuation);

	  aOutParam.value = fromVLQSigned(result);
	  aOutParam.rest = aIndex;
	};
	return base64Vlq;
}

var quickSort = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredQuickSort;

function requireQuickSort () {
	if (hasRequiredQuickSort) return quickSort;
	hasRequiredQuickSort = 1;
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */

	// It turns out that some (most?) JavaScript engines don't self-host
	// `Array.prototype.sort`. This makes sense because C++ will likely remain
	// faster than JS when doing raw CPU-intensive sorting. However, when using a
	// custom comparator function, calling back and forth between the VM's C++ and
	// JIT'd JS is rather slow *and* loses JIT type information, resulting in
	// worse generated code for the comparator function than would be optimal. In
	// fact, when sorting with a comparator, these costs outweigh the benefits of
	// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
	// a ~3500ms mean speed-up in `bench/bench.html`.

	/**
	 * Swap the elements indexed by `x` and `y` in the array `ary`.
	 *
	 * @param {Array} ary
	 *        The array.
	 * @param {Number} x
	 *        The index of the first item.
	 * @param {Number} y
	 *        The index of the second item.
	 */
	function swap(ary, x, y) {
	  var temp = ary[x];
	  ary[x] = ary[y];
	  ary[y] = temp;
	}

	/**
	 * Returns a random integer within the range `low .. high` inclusive.
	 *
	 * @param {Number} low
	 *        The lower bound on the range.
	 * @param {Number} high
	 *        The upper bound on the range.
	 */
	function randomIntInRange(low, high) {
	  return Math.round(low + (Math.random() * (high - low)));
	}

	/**
	 * The Quick Sort algorithm.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 * @param {Number} p
	 *        Start index of the array
	 * @param {Number} r
	 *        End index of the array
	 */
	function doQuickSort(ary, comparator, p, r) {
	  // If our lower bound is less than our upper bound, we (1) partition the
	  // array into two pieces and (2) recurse on each half. If it is not, this is
	  // the empty array and our base case.

	  if (p < r) {
	    // (1) Partitioning.
	    //
	    // The partitioning chooses a pivot between `p` and `r` and moves all
	    // elements that are less than or equal to the pivot to the before it, and
	    // all the elements that are greater than it after it. The effect is that
	    // once partition is done, the pivot is in the exact place it will be when
	    // the array is put in sorted order, and it will not need to be moved
	    // again. This runs in O(n) time.

	    // Always choose a random pivot so that an input array which is reverse
	    // sorted does not cause O(n^2) running time.
	    var pivotIndex = randomIntInRange(p, r);
	    var i = p - 1;

	    swap(ary, pivotIndex, r);
	    var pivot = ary[r];

	    // Immediately after `j` is incremented in this loop, the following hold
	    // true:
	    //
	    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
	    //
	    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
	    for (var j = p; j < r; j++) {
	      if (comparator(ary[j], pivot) <= 0) {
	        i += 1;
	        swap(ary, i, j);
	      }
	    }

	    swap(ary, i + 1, j);
	    var q = i + 1;

	    // (2) Recurse on each half.

	    doQuickSort(ary, comparator, p, q - 1);
	    doQuickSort(ary, comparator, q + 1, r);
	  }
	}

	/**
	 * Sort the given array in-place with the given comparator function.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 */
	quickSort.quickSort = function (ary, comparator) {
	  doQuickSort(ary, comparator, 0, ary.length - 1);
	};
	return quickSort;
}

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredSourceMapConsumer;

function requireSourceMapConsumer () {
	if (hasRequiredSourceMapConsumer) return sourceMapConsumer;
	hasRequiredSourceMapConsumer = 1;
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */

	var util = requireUtil();
	var binarySearch = requireBinarySearch();
	var ArraySet = requireArraySet().ArraySet;
	var base64VLQ = requireBase64Vlq();
	var quickSort = requireQuickSort().quickSort;

	function SourceMapConsumer(aSourceMap) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	  }

	  return sourceMap.sections != null
	    ? new IndexedSourceMapConsumer(sourceMap)
	    : new BasicSourceMapConsumer(sourceMap);
	}

	SourceMapConsumer.fromSourceMap = function(aSourceMap) {
	  return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
	};

	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	SourceMapConsumer.prototype._version = 3;

	// `__generatedMappings` and `__originalMappings` are arrays that hold the
	// parsed mapping coordinates from the source map's "mappings" attribute. They
	// are lazily instantiated, accessed via the `_generatedMappings` and
	// `_originalMappings` getters respectively, and we only parse the mappings
	// and create these arrays once queried for a source location. We jump through
	// these hoops because there can be many thousands of mappings, and parsing
	// them is expensive, so we only want to do it if we must.
	//
	// Each object in the arrays is of the form:
	//
	//     {
	//       generatedLine: The line number in the generated code,
	//       generatedColumn: The column number in the generated code,
	//       source: The path to the original source file that generated this
	//               chunk of code,
	//       originalLine: The line number in the original source that
	//                     corresponds to this chunk of generated code,
	//       originalColumn: The column number in the original source that
	//                       corresponds to this chunk of generated code,
	//       name: The name of the original symbol which generated this chunk of
	//             code.
	//     }
	//
	// All properties except for `generatedLine` and `generatedColumn` can be
	// `null`.
	//
	// `_generatedMappings` is ordered by the generated positions.
	//
	// `_originalMappings` is ordered by the original positions.

	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	  get: function () {
	    if (!this.__generatedMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }

	    return this.__generatedMappings;
	  }
	});

	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	  get: function () {
	    if (!this.__originalMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }

	    return this.__originalMappings;
	  }
	});

	SourceMapConsumer.prototype._charIsMappingSeparator =
	  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
	    var c = aStr.charAt(index);
	    return c === ";" || c === ",";
	  };

	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	SourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    throw new Error("Subclasses must implement _parseMappings");
	  };

	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;

	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;

	/**
	 * Iterate over each mapping between an original source/line/column and a
	 * generated line/column in this source map.
	 *
	 * @param Function aCallback
	 *        The function that is called with each mapping.
	 * @param Object aContext
	 *        Optional. If specified, this object will be the value of `this` every
	 *        time that `aCallback` is called.
	 * @param aOrder
	 *        Either `SourceMapConsumer.GENERATED_ORDER` or
	 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	 *        iterate over the mappings sorted by the generated file's line/column
	 *        order or the original's source/line/column order, respectively. Defaults to
	 *        `SourceMapConsumer.GENERATED_ORDER`.
	 */
	SourceMapConsumer.prototype.eachMapping =
	  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	    var context = aContext || null;
	    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

	    var mappings;
	    switch (order) {
	    case SourceMapConsumer.GENERATED_ORDER:
	      mappings = this._generatedMappings;
	      break;
	    case SourceMapConsumer.ORIGINAL_ORDER:
	      mappings = this._originalMappings;
	      break;
	    default:
	      throw new Error("Unknown order of iteration.");
	    }

	    var sourceRoot = this.sourceRoot;
	    mappings.map(function (mapping) {
	      var source = mapping.source === null ? null : this._sources.at(mapping.source);
	      if (source != null && sourceRoot != null) {
	        source = util.join(sourceRoot, source);
	      }
	      return {
	        source: source,
	        generatedLine: mapping.generatedLine,
	        generatedColumn: mapping.generatedColumn,
	        originalLine: mapping.originalLine,
	        originalColumn: mapping.originalColumn,
	        name: mapping.name === null ? null : this._names.at(mapping.name)
	      };
	    }, this).forEach(aCallback, context);
	  };

	/**
	 * Returns all generated line and column information for the original source,
	 * line, and column provided. If no column is provided, returns all mappings
	 * corresponding to a either the line we are searching for or the next
	 * closest line that has any mappings. Otherwise, returns all mappings
	 * corresponding to the given line and either the column we are searching for
	 * or the next closest column that has any offsets.
	 *
	 * The only argument is an object with the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.
	 *   - column: Optional. the column number in the original source.
	 *
	 * and an array of objects is returned, each with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.
	 *   - column: The column number in the generated source, or null.
	 */
	SourceMapConsumer.prototype.allGeneratedPositionsFor =
	  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	    var line = util.getArg(aArgs, 'line');

	    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
	    // returns the index of the closest mapping less than the needle. By
	    // setting needle.originalColumn to 0, we thus find the last mapping for
	    // the given line, provided such a mapping exists.
	    var needle = {
	      source: util.getArg(aArgs, 'source'),
	      originalLine: line,
	      originalColumn: util.getArg(aArgs, 'column', 0)
	    };

	    if (this.sourceRoot != null) {
	      needle.source = util.relative(this.sourceRoot, needle.source);
	    }
	    if (!this._sources.has(needle.source)) {
	      return [];
	    }
	    needle.source = this._sources.indexOf(needle.source);

	    var mappings = [];

	    var index = this._findMapping(needle,
	                                  this._originalMappings,
	                                  "originalLine",
	                                  "originalColumn",
	                                  util.compareByOriginalPositions,
	                                  binarySearch.LEAST_UPPER_BOUND);
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];

	      if (aArgs.column === undefined) {
	        var originalLine = mapping.originalLine;

	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we found. Since
	        // mappings are sorted, this is guaranteed to find all mappings for
	        // the line we found.
	        while (mapping && mapping.originalLine === originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });

	          mapping = this._originalMappings[++index];
	        }
	      } else {
	        var originalColumn = mapping.originalColumn;

	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we were searching for.
	        // Since mappings are sorted, this is guaranteed to find all mappings for
	        // the line we are searching for.
	        while (mapping &&
	               mapping.originalLine === line &&
	               mapping.originalColumn == originalColumn) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });

	          mapping = this._originalMappings[++index];
	        }
	      }
	    }

	    return mappings;
	  };

	sourceMapConsumer.SourceMapConsumer = SourceMapConsumer;

	/**
	 * A BasicSourceMapConsumer instance represents a parsed source map which we can
	 * query for information about the original file positions by giving it a file
	 * position in the generated source.
	 *
	 * The only parameter is the raw source map (either as a JSON string, or
	 * already parsed to an object). According to the spec, source maps have the
	 * following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - sources: An array of URLs to the original source files.
	 *   - names: An array of identifiers which can be referrenced by individual mappings.
	 *   - sourceRoot: Optional. The URL root from which all sources are relative.
	 *   - sourcesContent: Optional. An array of contents of the original source files.
	 *   - mappings: A string of base64 VLQs which contain the actual mappings.
	 *   - file: Optional. The generated file this source map is associated with.
	 *
	 * Here is an example source map, taken from the source map spec[0]:
	 *
	 *     {
	 *       version : 3,
	 *       file: "out.js",
	 *       sourceRoot : "",
	 *       sources: ["foo.js", "bar.js"],
	 *       names: ["src", "maps", "are", "fun"],
	 *       mappings: "AA,AB;;ABCDE;"
	 *     }
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	 */
	function BasicSourceMapConsumer(aSourceMap) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	  }

	  var version = util.getArg(sourceMap, 'version');
	  var sources = util.getArg(sourceMap, 'sources');
	  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	  // requires the array) to play nice here.
	  var names = util.getArg(sourceMap, 'names', []);
	  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	  var mappings = util.getArg(sourceMap, 'mappings');
	  var file = util.getArg(sourceMap, 'file', null);

	  // Once again, Sass deviates from the spec and supplies the version as a
	  // string rather than a number, so we use loose equality checking here.
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }

	  sources = sources
	    .map(String)
	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    .map(util.normalize)
	    // Always ensure that absolute sources are internally stored relative to
	    // the source root, if the source root is absolute. Not doing this would
	    // be particularly problematic when the source root is a prefix of the
	    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
	    .map(function (source) {
	      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
	        ? util.relative(sourceRoot, source)
	        : source;
	    });

	  // Pass `true` below to allow duplicate names and sources. While source maps
	  // are intended to be compressed and deduplicated, the TypeScript compiler
	  // sometimes generates source maps with duplicates in them. See Github issue
	  // #72 and bugzil.la/889492.
	  this._names = ArraySet.fromArray(names.map(String), true);
	  this._sources = ArraySet.fromArray(sources, true);

	  this.sourceRoot = sourceRoot;
	  this.sourcesContent = sourcesContent;
	  this._mappings = mappings;
	  this.file = file;
	}

	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

	/**
	 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
	 *
	 * @param SourceMapGenerator aSourceMap
	 *        The source map that will be consumed.
	 * @returns BasicSourceMapConsumer
	 */
	BasicSourceMapConsumer.fromSourceMap =
	  function SourceMapConsumer_fromSourceMap(aSourceMap) {
	    var smc = Object.create(BasicSourceMapConsumer.prototype);

	    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	    smc.sourceRoot = aSourceMap._sourceRoot;
	    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                            smc.sourceRoot);
	    smc.file = aSourceMap._file;

	    // Because we are modifying the entries (by converting string sources and
	    // names to indices into the sources and names ArraySets), we have to make
	    // a copy of the entry or else bad things happen. Shared mutable state
	    // strikes again! See github issue #191.

	    var generatedMappings = aSourceMap._mappings.toArray().slice();
	    var destGeneratedMappings = smc.__generatedMappings = [];
	    var destOriginalMappings = smc.__originalMappings = [];

	    for (var i = 0, length = generatedMappings.length; i < length; i++) {
	      var srcMapping = generatedMappings[i];
	      var destMapping = new Mapping;
	      destMapping.generatedLine = srcMapping.generatedLine;
	      destMapping.generatedColumn = srcMapping.generatedColumn;

	      if (srcMapping.source) {
	        destMapping.source = sources.indexOf(srcMapping.source);
	        destMapping.originalLine = srcMapping.originalLine;
	        destMapping.originalColumn = srcMapping.originalColumn;

	        if (srcMapping.name) {
	          destMapping.name = names.indexOf(srcMapping.name);
	        }

	        destOriginalMappings.push(destMapping);
	      }

	      destGeneratedMappings.push(destMapping);
	    }

	    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

	    return smc;
	  };

	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	BasicSourceMapConsumer.prototype._version = 3;

	/**
	 * The list of original sources.
	 */
	Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    return this._sources.toArray().map(function (s) {
	      return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
	    }, this);
	  }
	});

	/**
	 * Provide the JIT with a nice shape / hidden class.
	 */
	function Mapping() {
	  this.generatedLine = 0;
	  this.generatedColumn = 0;
	  this.source = null;
	  this.originalLine = null;
	  this.originalColumn = null;
	  this.name = null;
	}

	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	BasicSourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    var generatedLine = 1;
	    var previousGeneratedColumn = 0;
	    var previousOriginalLine = 0;
	    var previousOriginalColumn = 0;
	    var previousSource = 0;
	    var previousName = 0;
	    var length = aStr.length;
	    var index = 0;
	    var cachedSegments = {};
	    var temp = {};
	    var originalMappings = [];
	    var generatedMappings = [];
	    var mapping, str, segment, end, value;

	    while (index < length) {
	      if (aStr.charAt(index) === ';') {
	        generatedLine++;
	        index++;
	        previousGeneratedColumn = 0;
	      }
	      else if (aStr.charAt(index) === ',') {
	        index++;
	      }
	      else {
	        mapping = new Mapping();
	        mapping.generatedLine = generatedLine;

	        // Because each offset is encoded relative to the previous one,
	        // many segments often have the same encoding. We can exploit this
	        // fact by caching the parsed variable length fields of each segment,
	        // allowing us to avoid a second parse if we encounter the same
	        // segment again.
	        for (end = index; end < length; end++) {
	          if (this._charIsMappingSeparator(aStr, end)) {
	            break;
	          }
	        }
	        str = aStr.slice(index, end);

	        segment = cachedSegments[str];
	        if (segment) {
	          index += str.length;
	        } else {
	          segment = [];
	          while (index < end) {
	            base64VLQ.decode(aStr, index, temp);
	            value = temp.value;
	            index = temp.rest;
	            segment.push(value);
	          }

	          if (segment.length === 2) {
	            throw new Error('Found a source, but no line and column');
	          }

	          if (segment.length === 3) {
	            throw new Error('Found a source and line, but no column');
	          }

	          cachedSegments[str] = segment;
	        }

	        // Generated column.
	        mapping.generatedColumn = previousGeneratedColumn + segment[0];
	        previousGeneratedColumn = mapping.generatedColumn;

	        if (segment.length > 1) {
	          // Original source.
	          mapping.source = previousSource + segment[1];
	          previousSource += segment[1];

	          // Original line.
	          mapping.originalLine = previousOriginalLine + segment[2];
	          previousOriginalLine = mapping.originalLine;
	          // Lines are stored 0-based
	          mapping.originalLine += 1;

	          // Original column.
	          mapping.originalColumn = previousOriginalColumn + segment[3];
	          previousOriginalColumn = mapping.originalColumn;

	          if (segment.length > 4) {
	            // Original name.
	            mapping.name = previousName + segment[4];
	            previousName += segment[4];
	          }
	        }

	        generatedMappings.push(mapping);
	        if (typeof mapping.originalLine === 'number') {
	          originalMappings.push(mapping);
	        }
	      }
	    }

	    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
	    this.__generatedMappings = generatedMappings;

	    quickSort(originalMappings, util.compareByOriginalPositions);
	    this.__originalMappings = originalMappings;
	  };

	/**
	 * Find the mapping that best matches the hypothetical "needle" mapping that
	 * we are searching for in the given "haystack" of mappings.
	 */
	BasicSourceMapConsumer.prototype._findMapping =
	  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                         aColumnName, aComparator, aBias) {
	    // To return the position we are searching for, we must first find the
	    // mapping for the given position and then return the opposite position it
	    // points to. Because the mappings are sorted, we can use binary search to
	    // find the best mapping.

	    if (aNeedle[aLineName] <= 0) {
	      throw new TypeError('Line must be greater than or equal to 1, got '
	                          + aNeedle[aLineName]);
	    }
	    if (aNeedle[aColumnName] < 0) {
	      throw new TypeError('Column must be greater than or equal to 0, got '
	                          + aNeedle[aColumnName]);
	    }

	    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	  };

	/**
	 * Compute the last column for each generated mapping. The last column is
	 * inclusive.
	 */
	BasicSourceMapConsumer.prototype.computeColumnSpans =
	  function SourceMapConsumer_computeColumnSpans() {
	    for (var index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];

	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];

	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }

	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };

	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.
	 *   - column: The column number in the generated source.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.
	 *   - column: The column number in the original source, or null.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };

	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );

	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];

	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          if (this.sourceRoot != null) {
	            source = util.join(this.sourceRoot, source);
	          }
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }

	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };

	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };

	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }

	    if (this.sourceRoot != null) {
	      aSource = util.relative(this.sourceRoot, aSource);
	    }

	    if (this._sources.has(aSource)) {
	      return this.sourcesContent[this._sources.indexOf(aSource)];
	    }

	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }

	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + aSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + aSource)];
	      }
	    }

	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };

	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.
	 *   - column: The column number in the original source.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.
	 *   - column: The column number in the generated source, or null.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    if (this.sourceRoot != null) {
	      source = util.relative(this.sourceRoot, source);
	    }
	    if (!this._sources.has(source)) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	    source = this._sources.indexOf(source);

	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };

	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );

	    if (index >= 0) {
	      var mapping = this._originalMappings[index];

	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }

	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };

	sourceMapConsumer.BasicSourceMapConsumer = BasicSourceMapConsumer;

	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The only parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	  }

	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');

	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }

	  this._sources = new ArraySet();
	  this._names = new ArraySet();

	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');

	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;

	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'))
	    }
	  });
	}

	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;

	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});

	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.
	 *   - column: The column number in the generated source.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.
	 *   - column: The column number in the original source, or null.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };

	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }

	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];

	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }

	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };

	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };

	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];

	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };

	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.
	 *   - column: The column number in the original source.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.
	 *   - column: The column number in the generated source, or null.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];

	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
	        continue;
	      }
	      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
	      if (generatedPosition) {
	        var ret = {
	          line: generatedPosition.line +
	            (section.generatedOffset.generatedLine - 1),
	          column: generatedPosition.column +
	            (section.generatedOffset.generatedLine === generatedPosition.line
	             ? section.generatedOffset.generatedColumn - 1
	             : 0)
	        };
	        return ret;
	      }
	    }

	    return {
	      line: null,
	      column: null
	    };
	  };

	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	IndexedSourceMapConsumer.prototype._parseMappings =
	  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    this.__generatedMappings = [];
	    this.__originalMappings = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	      var sectionMappings = section.consumer._generatedMappings;
	      for (var j = 0; j < sectionMappings.length; j++) {
	        var mapping = sectionMappings[j];

	        var source = section.consumer._sources.at(mapping.source);
	        if (section.consumer.sourceRoot !== null) {
	          source = util.join(section.consumer.sourceRoot, source);
	        }
	        this._sources.add(source);
	        source = this._sources.indexOf(source);

	        var name = section.consumer._names.at(mapping.name);
	        this._names.add(name);
	        name = this._names.indexOf(name);

	        // The mappings coming from the consumer for the section have
	        // generated positions relative to the start of the section, so we
	        // need to offset them to be relative to the start of the concatenated
	        // generated file.
	        var adjustedMapping = {
	          source: source,
	          generatedLine: mapping.generatedLine +
	            (section.generatedOffset.generatedLine - 1),
	          generatedColumn: mapping.generatedColumn +
	            (section.generatedOffset.generatedLine === mapping.generatedLine
	            ? section.generatedOffset.generatedColumn - 1
	            : 0),
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: name
	        };

	        this.__generatedMappings.push(adjustedMapping);
	        if (typeof adjustedMapping.originalLine === 'number') {
	          this.__originalMappings.push(adjustedMapping);
	        }
	      }
	    }

	    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
	    quickSort(this.__originalMappings, util.compareByOriginalPositions);
	  };

	sourceMapConsumer.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
	return sourceMapConsumer;
}

var hasRequiredStacktraceGps;

function requireStacktraceGps () {
	if (hasRequiredStacktraceGps) return stacktraceGps.exports;
	hasRequiredStacktraceGps = 1;
	(function (module, exports) {
		(function(root, factory) {
		    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

		    /* istanbul ignore next */
		    {
		        module.exports = factory(requireSourceMapConsumer(), requireStackframe());
		    }
		}(commonjsGlobal, function(SourceMap, StackFrame) {

		    /**
		     * Make a X-Domain request to url and callback.
		     *
		     * @param {String} url
		     * @returns {Promise} with response text if fulfilled
		     */
		    function _xdr(url) {
		        return new Promise(function(resolve, reject) {
		            var req = new XMLHttpRequest();
		            req.open('get', url);
		            req.onerror = reject;
		            req.onreadystatechange = function onreadystatechange() {
		                if (req.readyState === 4) {
		                    if ((req.status >= 200 && req.status < 300) ||
		                        (url.substr(0, 7) === 'file://' && req.responseText)) {
		                        resolve(req.responseText);
		                    } else {
		                        reject(new Error('HTTP status: ' + req.status + ' retrieving ' + url));
		                    }
		                }
		            };
		            req.send();
		        });

		    }

		    /**
		     * Convert a Base64-encoded string into its original representation.
		     * Used for inline sourcemaps.
		     *
		     * @param {String} b64str Base-64 encoded string
		     * @returns {String} original representation of the base64-encoded string.
		     */
		    function _atob(b64str) {
		        if (typeof window !== 'undefined' && window.atob) {
		            return window.atob(b64str);
		        } else {
		            throw new Error('You must supply a polyfill for window.atob in this environment');
		        }
		    }

		    function _parseJson(string) {
		        if (typeof JSON !== 'undefined' && JSON.parse) {
		            return JSON.parse(string);
		        } else {
		            throw new Error('You must supply a polyfill for JSON.parse in this environment');
		        }
		    }

		    function _findFunctionName(source, lineNumber/*, columnNumber*/) {
		        var syntaxes = [
		            // {name} = function ({args}) TODO args capture
		            /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/,
		            // function {name}({args}) m[1]=name m[2]=args
		            /function\s+([^('"`]*?)\s*\(([^)]*)\)/,
		            // {name} = eval()
		            /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/,
		            // fn_name() {
		            /\b(?!(?:if|for|switch|while|with|catch)\b)(?:(?:static)\s+)?(\S+)\s*\(.*?\)\s*\{/,
		            // {name} = () => {
		            /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*\(.*?\)\s*=>/
		        ];
		        var lines = source.split('\n');

		        // Walk backwards in the source lines until we find the line which matches one of the patterns above
		        var code = '';
		        var maxLines = Math.min(lineNumber, 20);
		        for (var i = 0; i < maxLines; ++i) {
		            // lineNo is 1-based, source[] is 0-based
		            var line = lines[lineNumber - i - 1];
		            var commentPos = line.indexOf('//');
		            if (commentPos >= 0) {
		                line = line.substr(0, commentPos);
		            }

		            if (line) {
		                code = line + code;
		                var len = syntaxes.length;
		                for (var index = 0; index < len; index++) {
		                    var m = syntaxes[index].exec(code);
		                    if (m && m[1]) {
		                        return m[1];
		                    }
		                }
		            }
		        }
		        return undefined;
		    }

		    function _ensureSupportedEnvironment() {
		        if (typeof Object.defineProperty !== 'function' || typeof Object.create !== 'function') {
		            throw new Error('Unable to consume source maps in older browsers');
		        }
		    }

		    function _ensureStackFrameIsLegit(stackframe) {
		        if (typeof stackframe !== 'object') {
		            throw new TypeError('Given StackFrame is not an object');
		        } else if (typeof stackframe.fileName !== 'string') {
		            throw new TypeError('Given file name is not a String');
		        } else if (typeof stackframe.lineNumber !== 'number' ||
		            stackframe.lineNumber % 1 !== 0 ||
		            stackframe.lineNumber < 1) {
		            throw new TypeError('Given line number must be a positive integer');
		        } else if (typeof stackframe.columnNumber !== 'number' ||
		            stackframe.columnNumber % 1 !== 0 ||
		            stackframe.columnNumber < 0) {
		            throw new TypeError('Given column number must be a non-negative integer');
		        }
		        return true;
		    }

		    function _findSourceMappingURL(source) {
		        var sourceMappingUrlRegExp = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/mg;
		        var lastSourceMappingUrl;
		        var matchSourceMappingUrl;
		        // eslint-disable-next-line no-cond-assign
		        while (matchSourceMappingUrl = sourceMappingUrlRegExp.exec(source)) {
		            lastSourceMappingUrl = matchSourceMappingUrl[1];
		        }
		        if (lastSourceMappingUrl) {
		            return lastSourceMappingUrl;
		        } else {
		            throw new Error('sourceMappingURL not found');
		        }
		    }

		    function _extractLocationInfoFromSourceMapSource(stackframe, sourceMapConsumer, sourceCache) {
		        return new Promise(function(resolve, reject) {
		            var loc = sourceMapConsumer.originalPositionFor({
		                line: stackframe.lineNumber,
		                column: stackframe.columnNumber
		            });

		            if (loc.source) {
		                // cache mapped sources
		                var mappedSource = sourceMapConsumer.sourceContentFor(loc.source);
		                if (mappedSource) {
		                    sourceCache[loc.source] = mappedSource;
		                }

		                resolve(
		                    // given stackframe and source location, update stackframe
		                    new StackFrame({
		                        functionName: loc.name || stackframe.functionName,
		                        args: stackframe.args,
		                        fileName: loc.source,
		                        lineNumber: loc.line,
		                        columnNumber: loc.column
		                    }));
		            } else {
		                reject(new Error('Could not get original source for given stackframe and source map'));
		            }
		        });
		    }

		    /**
		     * @constructor
		     * @param {Object} opts
		     *      opts.sourceCache = {url: "Source String"} => preload source cache
		     *      opts.sourceMapConsumerCache = {/path/file.js.map: SourceMapConsumer}
		     *      opts.offline = True to prevent network requests.
		     *              Best effort without sources or source maps.
		     *      opts.ajax = Promise returning function to make X-Domain requests
		     */
		    return function StackTraceGPS(opts) {
		        if (!(this instanceof StackTraceGPS)) {
		            return new StackTraceGPS(opts);
		        }
		        opts = opts || {};

		        this.sourceCache = opts.sourceCache || {};
		        this.sourceMapConsumerCache = opts.sourceMapConsumerCache || {};

		        this.ajax = opts.ajax || _xdr;

		        this._atob = opts.atob || _atob;

		        this._get = function _get(location) {
		            return new Promise(function(resolve, reject) {
		                var isDataUrl = location.substr(0, 5) === 'data:';
		                if (this.sourceCache[location]) {
		                    resolve(this.sourceCache[location]);
		                } else if (opts.offline && !isDataUrl) {
		                    reject(new Error('Cannot make network requests in offline mode'));
		                } else {
		                    if (isDataUrl) {
		                        // data URLs can have parameters.
		                        // see http://tools.ietf.org/html/rfc2397
		                        var supportedEncodingRegexp =
		                            /^data:application\/json;([\w=:"-]+;)*base64,/;
		                        var match = location.match(supportedEncodingRegexp);
		                        if (match) {
		                            var sourceMapStart = match[0].length;
		                            var encodedSource = location.substr(sourceMapStart);
		                            var source = this._atob(encodedSource);
		                            this.sourceCache[location] = source;
		                            resolve(source);
		                        } else {
		                            reject(new Error('The encoding of the inline sourcemap is not supported'));
		                        }
		                    } else {
		                        var xhrPromise = this.ajax(location, {method: 'get'});
		                        // Cache the Promise to prevent duplicate in-flight requests
		                        this.sourceCache[location] = xhrPromise;
		                        xhrPromise.then(resolve, reject);
		                    }
		                }
		            }.bind(this));
		        };

		        /**
		         * Creating SourceMapConsumers is expensive, so this wraps the creation of a
		         * SourceMapConsumer in a per-instance cache.
		         *
		         * @param {String} sourceMappingURL = URL to fetch source map from
		         * @param {String} defaultSourceRoot = Default source root for source map if undefined
		         * @returns {Promise} that resolves a SourceMapConsumer
		         */
		        this._getSourceMapConsumer = function _getSourceMapConsumer(sourceMappingURL, defaultSourceRoot) {
		            return new Promise(function(resolve) {
		                if (this.sourceMapConsumerCache[sourceMappingURL]) {
		                    resolve(this.sourceMapConsumerCache[sourceMappingURL]);
		                } else {
		                    var sourceMapConsumerPromise = new Promise(function(resolve, reject) {
		                        return this._get(sourceMappingURL).then(function(sourceMapSource) {
		                            if (typeof sourceMapSource === 'string') {
		                                sourceMapSource = _parseJson(sourceMapSource.replace(/^\)\]\}'/, ''));
		                            }
		                            if (typeof sourceMapSource.sourceRoot === 'undefined') {
		                                sourceMapSource.sourceRoot = defaultSourceRoot;
		                            }

		                            resolve(new SourceMap.SourceMapConsumer(sourceMapSource));
		                        }).catch(reject);
		                    }.bind(this));
		                    this.sourceMapConsumerCache[sourceMappingURL] = sourceMapConsumerPromise;
		                    resolve(sourceMapConsumerPromise);
		                }
		            }.bind(this));
		        };

		        /**
		         * Given a StackFrame, enhance function name and use source maps for a
		         * better StackFrame.
		         *
		         * @param {StackFrame} stackframe object
		         * @returns {Promise} that resolves with with source-mapped StackFrame
		         */
		        this.pinpoint = function StackTraceGPS$$pinpoint(stackframe) {
		            return new Promise(function(resolve, reject) {
		                this.getMappedLocation(stackframe).then(function(mappedStackFrame) {
		                    function resolveMappedStackFrame() {
		                        resolve(mappedStackFrame);
		                    }

		                    this.findFunctionName(mappedStackFrame)
		                        .then(resolve, resolveMappedStackFrame)
		                        // eslint-disable-next-line no-unexpected-multiline
		                        ['catch'](resolveMappedStackFrame);
		                }.bind(this), reject);
		            }.bind(this));
		        };

		        /**
		         * Given a StackFrame, guess function name from location information.
		         *
		         * @param {StackFrame} stackframe
		         * @returns {Promise} that resolves with enhanced StackFrame.
		         */
		        this.findFunctionName = function StackTraceGPS$$findFunctionName(stackframe) {
		            return new Promise(function(resolve, reject) {
		                _ensureStackFrameIsLegit(stackframe);
		                this._get(stackframe.fileName).then(function getSourceCallback(source) {
		                    var lineNumber = stackframe.lineNumber;
		                    var columnNumber = stackframe.columnNumber;
		                    var guessedFunctionName = _findFunctionName(source, lineNumber);
		                    // Only replace functionName if we found something
		                    if (guessedFunctionName) {
		                        resolve(new StackFrame({
		                            functionName: guessedFunctionName,
		                            args: stackframe.args,
		                            fileName: stackframe.fileName,
		                            lineNumber: lineNumber,
		                            columnNumber: columnNumber
		                        }));
		                    } else {
		                        resolve(stackframe);
		                    }
		                }, reject)['catch'](reject);
		            }.bind(this));
		        };

		        /**
		         * Given a StackFrame, seek source-mapped location and return new enhanced StackFrame.
		         *
		         * @param {StackFrame} stackframe
		         * @returns {Promise} that resolves with enhanced StackFrame.
		         */
		        this.getMappedLocation = function StackTraceGPS$$getMappedLocation(stackframe) {
		            return new Promise(function(resolve, reject) {
		                _ensureSupportedEnvironment();
		                _ensureStackFrameIsLegit(stackframe);

		                var sourceCache = this.sourceCache;
		                var fileName = stackframe.fileName;
		                this._get(fileName).then(function(source) {
		                    var sourceMappingURL = _findSourceMappingURL(source);
		                    var isDataUrl = sourceMappingURL.substr(0, 5) === 'data:';
		                    var defaultSourceRoot = fileName.substring(0, fileName.lastIndexOf('/') + 1);

		                    if (sourceMappingURL[0] !== '/' && !isDataUrl && !(/^https?:\/\/|^\/\//i).test(sourceMappingURL)) {
		                        sourceMappingURL = defaultSourceRoot + sourceMappingURL;
		                    }

		                    return this._getSourceMapConsumer(sourceMappingURL, defaultSourceRoot)
		                        .then(function(sourceMapConsumer) {
		                            return _extractLocationInfoFromSourceMapSource(stackframe, sourceMapConsumer, sourceCache)
		                                .then(resolve)['catch'](function() {
		                                    resolve(stackframe);
		                                });
		                        });
		                }.bind(this), reject)['catch'](reject);
		            }.bind(this));
		        };
		    };
		})); 
	} (stacktraceGps));
	return stacktraceGps.exports;
}

(function (module, exports) {
	(function(root, factory) {
	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

	    /* istanbul ignore next */
	    {
	        module.exports = factory(requireErrorStackParser(), requireStackGenerator(), requireStacktraceGps());
	    }
	}(commonjsGlobal, function StackTrace(ErrorStackParser, StackGenerator, StackTraceGPS) {
	    var _options = {
	        filter: function(stackframe) {
	            // Filter out stackframes for this library by default
	            return (stackframe.functionName || '').indexOf('StackTrace$$') === -1 &&
	                (stackframe.functionName || '').indexOf('ErrorStackParser$$') === -1 &&
	                (stackframe.functionName || '').indexOf('StackTraceGPS$$') === -1 &&
	                (stackframe.functionName || '').indexOf('StackGenerator$$') === -1;
	        },
	        sourceCache: {}
	    };

	    var _generateError = function StackTrace$$GenerateError() {
	        try {
	            // Error must be thrown to get stack in IE
	            throw new Error();
	        } catch (err) {
	            return err;
	        }
	    };

	    /**
	     * Merge 2 given Objects. If a conflict occurs the second object wins.
	     * Does not do deep merges.
	     *
	     * @param {Object} first base object
	     * @param {Object} second overrides
	     * @returns {Object} merged first and second
	     * @private
	     */
	    function _merge(first, second) {
	        var target = {};

	        [first, second].forEach(function(obj) {
	            for (var prop in obj) {
	                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
	                    target[prop] = obj[prop];
	                }
	            }
	            return target;
	        });

	        return target;
	    }

	    function _isShapedLikeParsableError(err) {
	        return err.stack || err['opera#sourceloc'];
	    }

	    function _filtered(stackframes, filter) {
	        if (typeof filter === 'function') {
	            return stackframes.filter(filter);
	        }
	        return stackframes;
	    }

	    return {
	        /**
	         * Get a backtrace from invocation point.
	         *
	         * @param {Object} opts
	         * @returns {Array} of StackFrame
	         */
	        get: function StackTrace$$get(opts) {
	            var err = _generateError();
	            return _isShapedLikeParsableError(err) ? this.fromError(err, opts) : this.generateArtificially(opts);
	        },

	        /**
	         * Get a backtrace from invocation point.
	         * IMPORTANT: Does not handle source maps or guess function names!
	         *
	         * @param {Object} opts
	         * @returns {Array} of StackFrame
	         */
	        getSync: function StackTrace$$getSync(opts) {
	            opts = _merge(_options, opts);
	            var err = _generateError();
	            var stack = _isShapedLikeParsableError(err) ? ErrorStackParser.parse(err) : StackGenerator.backtrace(opts);
	            return _filtered(stack, opts.filter);
	        },

	        /**
	         * Given an error object, parse it.
	         *
	         * @param {Error} error object
	         * @param {Object} opts
	         * @returns {Promise} for Array[StackFrame}
	         */
	        fromError: function StackTrace$$fromError(error, opts) {
	            opts = _merge(_options, opts);
	            var gps = new StackTraceGPS(opts);
	            return new Promise(function(resolve) {
	                var stackframes = _filtered(ErrorStackParser.parse(error), opts.filter);
	                resolve(Promise.all(stackframes.map(function(sf) {
	                    return new Promise(function(resolve) {
	                        function resolveOriginal() {
	                            resolve(sf);
	                        }

	                        gps.pinpoint(sf).then(resolve, resolveOriginal)['catch'](resolveOriginal);
	                    });
	                })));
	            }.bind(this));
	        },

	        /**
	         * Use StackGenerator to generate a backtrace.
	         *
	         * @param {Object} opts
	         * @returns {Promise} of Array[StackFrame]
	         */
	        generateArtificially: function StackTrace$$generateArtificially(opts) {
	            opts = _merge(_options, opts);
	            var stackFrames = StackGenerator.backtrace(opts);
	            if (typeof opts.filter === 'function') {
	                stackFrames = stackFrames.filter(opts.filter);
	            }
	            return Promise.resolve(stackFrames);
	        },

	        /**
	         * Given a function, wrap it such that invocations trigger a callback that
	         * is called with a stack trace.
	         *
	         * @param {Function} fn to be instrumented
	         * @param {Function} callback function to call with a stack trace on invocation
	         * @param {Function} errback optional function to call with error if unable to get stack trace.
	         * @param {Object} thisArg optional context object (e.g. window)
	         */
	        instrument: function StackTrace$$instrument(fn, callback, errback, thisArg) {
	            if (typeof fn !== 'function') {
	                throw new Error('Cannot instrument non-function object');
	            } else if (typeof fn.__stacktraceOriginalFn === 'function') {
	                // Already instrumented, return given Function
	                return fn;
	            }

	            var instrumented = function StackTrace$$instrumented() {
	                try {
	                    this.get().then(callback, errback)['catch'](errback);
	                    return fn.apply(thisArg || this, arguments);
	                } catch (e) {
	                    if (_isShapedLikeParsableError(e)) {
	                        this.fromError(e).then(callback, errback)['catch'](errback);
	                    }
	                    throw e;
	                }
	            }.bind(this);
	            instrumented.__stacktraceOriginalFn = fn;

	            return instrumented;
	        },

	        /**
	         * Given a function that has been instrumented,
	         * revert the function to it's original (non-instrumented) state.
	         *
	         * @param {Function} fn to de-instrument
	         */
	        deinstrument: function StackTrace$$deinstrument(fn) {
	            if (typeof fn !== 'function') {
	                throw new Error('Cannot de-instrument non-function object');
	            } else if (typeof fn.__stacktraceOriginalFn === 'function') {
	                return fn.__stacktraceOriginalFn;
	            } else {
	                // Function not instrumented, return original
	                return fn;
	            }
	        },

	        /**
	         * Given an error message and Array of StackFrames, serialize and POST to given URL.
	         *
	         * @param {Array} stackframes
	         * @param {String} url
	         * @param {String} errorMsg
	         * @param {Object} requestOptions
	         */
	        report: function StackTrace$$report(stackframes, url, errorMsg, requestOptions) {
	            return new Promise(function(resolve, reject) {
	                var req = new XMLHttpRequest();
	                req.onerror = reject;
	                req.onreadystatechange = function onreadystatechange() {
	                    if (req.readyState === 4) {
	                        if (req.status >= 200 && req.status < 400) {
	                            resolve(req.responseText);
	                        } else {
	                            reject(new Error('POST to ' + url + ' failed with status: ' + req.status));
	                        }
	                    }
	                };
	                req.open('post', url);

	                // Set request headers
	                req.setRequestHeader('Content-Type', 'application/json');
	                if (requestOptions && typeof requestOptions.headers === 'object') {
	                    var headers = requestOptions.headers;
	                    for (var header in headers) {
	                        if (Object.prototype.hasOwnProperty.call(headers, header)) {
	                            req.setRequestHeader(header, headers[header]);
	                        }
	                    }
	                }

	                var reportPayload = {stack: stackframes};
	                if (errorMsg !== undefined && errorMsg !== null) {
	                    reportPayload.message = errorMsg;
	                }

	                req.send(JSON.stringify(reportPayload));
	            });
	        }
	    };
	})); 
} (stacktrace));

var stacktraceExports = stacktrace.exports;

const { isArray: isArray$3 } = Array;
const { getPrototypeOf: getPrototypeOf$1, getOwnPropertyDescriptor } = Object;

const empty = [];

const newRange = () => document.createRange();

/**
 * Set the `key` `value` pair to the *Map* or *WeakMap* and returns the `value`
 * @template T
 * @param {Map | WeakMap} map
 * @param {any} key
 * @param {T} value
 * @returns {T}
 */
const set = (map, key, value) => {
  map.set(key, value);
  return value;
};

const gPD = (ref, prop) => {
  let desc;
  do { desc = getOwnPropertyDescriptor(ref, prop); }
  while(!desc && (ref = getPrototypeOf$1(ref)));
  return desc;
};

/** @typedef {import("domconstants/constants").ATTRIBUTE_NODE} ATTRIBUTE_NODE */
/** @typedef {import("domconstants/constants").TEXT_NODE} TEXT_NODE */
/** @typedef {import("domconstants/constants").COMMENT_NODE} COMMENT_NODE */
/** @typedef {ATTRIBUTE_NODE | TEXT_NODE | COMMENT_NODE} Type */

/** @typedef {import("./persistent-fragment.js").PersistentFragment} PersistentFragment */
/** @typedef {import("./rabbit.js").Hole} Hole */

/** @typedef {unknown} Value */
/** @typedef {Node | Element | PersistentFragment} Target */
/** @typedef {null | undefined | string | number | boolean | Node | Element | PersistentFragment} DOMValue */

/**
 * @typedef {Object} Entry
 * @property {Type} type
 * @property {number[]} path
 * @property {function} update
 * @property {string} name
 */

/**
 * @param {PersistentFragment} c content retrieved from the template
 * @param {Entry[]} e entries per each hole in the template
 * @param {number} l the length of content childNodes
 * @returns
 */
const cel = (c, e, l) => ({ c, e, l });

/**
 * @typedef {Object} HoleDetails
 * @property {null | Node | PersistentFragment} n the current live node, if any and not the `t` one
 */

/** @type {() => HoleDetails} */
const comment = () => ({ n: null });

/**
 * @typedef {Object} Detail
 * @property {any} v the current value of the interpolation / hole
 * @property {function} u the callback to update the value
 * @property {Node} t the target comment node or element
 * @property {string} n the name of the attribute, if any
 */

/**
 * @param {any} v the current value of the interpolation / hole
 * @param {function} u the callback to update the value
 * @param {Node} t the target comment node or element
 * @param {string} n the name of the attribute, if any
 * @returns {Detail}
 */
const detail = (v, u, t, n) => ({ v, u, t, n });

/**
 * @param {Type} t the operation type
 * @param {number[]} p the path to retrieve the node
 * @param {function} u the update function
 * @param {string} n the attribute name, if any
 * @returns {Entry}
 */
const entry = (t, p, u, n = '') => ({ t, p, u, n });

/**
 * @typedef {Object} Cache
 * @property {Cache[]} s the stack of caches per each interpolation / hole
 * @property {null | TemplateStringsArray} t the cached template
 * @property {null | Node | PersistentFragment} n the node returned when parsing the template
 * @property {Detail[]} d the list of updates to perform
 */

/**
 * @param {Cache[]} s the cache stack
 * @returns {Cache}
 */
const cache$1 = s => ({ s, t: null, n: null, d: empty});

/**
 * @typedef {Object} Parsed
 * @property {Node | PersistentFragment} n the returned node after parsing the template
 * @property {Detail[]} d the list of details to update the node
 */

/**
 * @param {Node | PersistentFragment} n the returned node after parsing the template
 * @param {Detail[]} d the list of details to update the node
 * @returns {Parsed}
 */
const parsed = (n, d) => ({ n, d });

const ATTRIBUTE_NODE = 2;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const DOCUMENT_FRAGMENT_NODE = 11;

/*! (c) Andrea Giammarchi - ISC */
const {setPrototypeOf} = Object;

/**
 * @param {Function} Class any base class to extend without passing through it via super() call.
 * @returns {Function} an extensible class for the passed one.
 * @example
 *  // creating this very same module utility
 *  import custom from 'custom-function/factory';
 *  const CustomFunction = custom(Function);
 *  class MyFunction extends CustomFunction {}
 *  const mf = new MyFunction(() => {});
 */
const custom = Class => {
  function Custom(target) {
    return setPrototypeOf(target, new.target.prototype);
  }
  Custom.prototype = Class.prototype;
  return Custom;
};

let range$1;
/**
 * @param {Node | Element} firstChild
 * @param {Node | Element} lastChild
 * @param {boolean} preserve
 * @returns
 */
const drop = (firstChild, lastChild, preserve) => {
  if (!range$1) range$1 = newRange();
  if (preserve)
    range$1.setStartAfter(firstChild);
  else
    range$1.setStartBefore(firstChild);
  range$1.setEndAfter(lastChild);
  range$1.deleteContents();
  return firstChild;
};

/**
 * @param {PersistentFragment} fragment
 * @returns {Node | Element}
 */
const remove = ({firstChild, lastChild}, preserve) => drop(firstChild, lastChild, preserve);

let checkType = false;

/**
 * @param {Node} node
 * @param {1 | 0 | -0 | -1} operation
 * @returns {Node}
 */
const diffFragment = (node, operation) => (
  checkType && node.nodeType === DOCUMENT_FRAGMENT_NODE ?
    ((1 / operation) < 0 ?
      (operation ? remove(node, true) : node.lastChild) :
      (operation ? node.valueOf() : node.firstChild)) :
    node
);

/** @extends {DocumentFragment} */
class PersistentFragment extends custom(DocumentFragment) {
  #nodes;
  #length;
  constructor(fragment) {
    const _nodes = [...fragment.childNodes];
    super(fragment);
    this.#nodes = _nodes;
    this.#length = _nodes.length;
    checkType = true;
  }
  get firstChild() { return this.#nodes[0]; }
  get lastChild() { return this.#nodes.at(-1); }
  get parentNode() { return this.#nodes[0].parentNode; }
  remove() {
    remove(this, false);
  }
  replaceWith(node) {
    remove(this, true).replaceWith(node);
  }
  valueOf() {
    if (this.childNodes.length !== this.#length)
      this.replaceChildren(...this.#nodes);
    return this;
  }
}

/**
 * @param {DocumentFragment} content
 * @param {number[]} path
 * @returns {Element}
 */
const find = (content, path) => path.reduceRight(childNodesIndex, content);
const childNodesIndex = (node, i) => node.childNodes[i];

/** @param {(template: TemplateStringsArray, values: any[]) => import("./parser.js").Resolved} parse */
const create = parse => (
  /** @param {(template: TemplateStringsArray, values: any[]) => import("./literals.js").Parsed} parse */
  (template, values) => {
    const { c: content, e: entries, l: length } = parse(template, values);
    const root = content.cloneNode(true);
    // reverse loop to avoid missing paths while populating
    // TODO: is it even worth to pre-populate nodes? see rabbit.js too
    let current, prev, i = entries.length, details = i ? entries.slice(0) : empty;
    while (i--) {
      const { t: type, p: path, u: update, n: name } = entries[i];
      const node = path === prev ? current : (current = find(root, (prev = path)));
      const callback = type === COMMENT_NODE ? update() : update;
      details[i] = detail(callback(node, values[i], name, empty), callback, node, name);
    }
    return parsed(
      length === 1 ? root.firstChild : new PersistentFragment(root),
      details
    );
  }
);

const TEXT_ELEMENTS = /^(?:plaintext|script|style|textarea|title|xmp)$/i;
const VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

/*! (c) Andrea Giammarchi - ISC */

const elements = /<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g;
const attributes = /([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g;
const holes = /[\x01\x02]/g;

// \x01 Node.ELEMENT_NODE
// \x02 Node.ATTRIBUTE_NODE

/**
 * Given a template, find holes as both nodes and attributes and
 * return a string with holes as either comment nodes or named attributes.
 * @param {string[]} template a template literal tag array
 * @param {string} prefix prefix to use per each comment/attribute
 * @param {boolean} xml enforces self-closing tags
 * @returns {string} X/HTML with prefixed comments or attributes
 */
const parser$1 = (template, prefix, xml) => {
  let i = 0;
  return template
    .join('\x01')
    .trim()
    .replace(
      elements,
      (_, name, attrs, selfClosing) => `<${
          name
        }${
          attrs.replace(attributes, '\x02=$2$1').trimEnd()
        }${
          selfClosing ? (
            (xml || VOID_ELEMENTS.test(name)) ? ' /' : `></${name}`
          ) : ''
        }>`
    )
    .replace(
      holes,
      hole => hole === '\x01' ? `<!--${prefix + i++}-->` : (prefix + i++)
    )
  ;
};

/**
 * ISC License
 *
 * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

/**
 * @param {Node} parentNode The container where children live
 * @param {Node[]} a The list of current/live children
 * @param {Node[]} b The list of future children
 * @param {(entry: Node, action: number) => Node} get
 * The callback invoked per each entry related DOM operation.
 * @param {Node} [before] The optional node used as anchor to insert before.
 * @returns {Node[]} The same list of future children.
 */
const udomdiff = (parentNode, a, b, get, before) => {
  const bLength = b.length;
  let aEnd = a.length;
  let bEnd = bLength;
  let aStart = 0;
  let bStart = 0;
  let map = null;
  while (aStart < aEnd || bStart < bEnd) {
    // append head, tail, or nodes in between: fast path
    if (aEnd === aStart) {
      // we could be in a situation where the rest of nodes that
      // need to be added are not at the end, and in such case
      // the node to `insertBefore`, if the index is more than 0
      // must be retrieved, otherwise it's gonna be the first item.
      const node = bEnd < bLength ?
        (bStart ?
          (get(b[bStart - 1], -0).nextSibling) :
          get(b[bEnd - bStart], 0)) :
        before;
      while (bStart < bEnd)
        parentNode.insertBefore(get(b[bStart++], 1), node);
    }
    // remove head or tail: fast path
    else if (bEnd === bStart) {
      while (aStart < aEnd) {
        // remove the node only if it's unknown or not live
        if (!map || !map.has(a[aStart]))
          parentNode.removeChild(get(a[aStart], -1));
        aStart++;
      }
    }
    // same node: fast path
    else if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
    }
    // same tail: fast path
    else if (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    // The once here single last swap "fast path" has been removed in v1.1.0
    // https://github.com/WebReflection/udomdiff/blob/single-final-swap/esm/index.js#L69-L85
    // reverse swap: also fast path
    else if (
      a[aStart] === b[bEnd - 1] &&
      b[bStart] === a[aEnd - 1]
    ) {
      // this is a "shrink" operation that could happen in these cases:
      // [1, 2, 3, 4, 5]
      // [1, 4, 3, 2, 5]
      // or asymmetric too
      // [1, 2, 3, 4, 5]
      // [1, 2, 3, 5, 6, 4]
      const node = get(a[--aEnd], -1).nextSibling;
      parentNode.insertBefore(
        get(b[bStart++], 1),
        get(a[aStart++], -1).nextSibling
      );
      parentNode.insertBefore(get(b[--bEnd], 1), node);
      // mark the future index as identical (yeah, it's dirty, but cheap 👍)
      // The main reason to do this, is that when a[aEnd] will be reached,
      // the loop will likely be on the fast path, as identical to b[bEnd].
      // In the best case scenario, the next loop will skip the tail,
      // but in the worst one, this node will be considered as already
      // processed, bailing out pretty quickly from the map index check
      a[aEnd] = b[bEnd];
    }
    // map based fallback, "slow" path
    else {
      // the map requires an O(bEnd - bStart) operation once
      // to store all future nodes indexes for later purposes.
      // In the worst case scenario, this is a full O(N) cost,
      // and such scenario happens at least when all nodes are different,
      // but also if both first and last items of the lists are different
      if (!map) {
        map = new Map;
        let i = bStart;
        while (i < bEnd)
          map.set(b[i], i++);
      }
      // if it's a future node, hence it needs some handling
      if (map.has(a[aStart])) {
        // grab the index of such node, 'cause it might have been processed
        const index = map.get(a[aStart]);
        // if it's not already processed, look on demand for the next LCS
        if (bStart < index && index < bEnd) {
          let i = aStart;
          // counts the amount of nodes that are the same in the future
          let sequence = 1;
          while (++i < aEnd && i < bEnd && map.get(a[i]) === (index + sequence))
            sequence++;
          // effort decision here: if the sequence is longer than replaces
          // needed to reach such sequence, which would brings again this loop
          // to the fast path, prepend the difference before a sequence,
          // and move only the future list index forward, so that aStart
          // and bStart will be aligned again, hence on the fast path.
          // An example considering aStart and bStart are both 0:
          // a: [1, 2, 3, 4]
          // b: [7, 1, 2, 3, 6]
          // this would place 7 before 1 and, from that time on, 1, 2, and 3
          // will be processed at zero cost
          if (sequence > (index - bStart)) {
            const node = get(a[aStart], 0);
            while (bStart < index)
              parentNode.insertBefore(get(b[bStart++], 1), node);
          }
          // if the effort wasn't good enough, fallback to a replace,
          // moving both source and target indexes forward, hoping that some
          // similar node will be found later on, to go back to the fast path
          else {
            parentNode.replaceChild(
              get(b[bStart++], 1),
              get(a[aStart++], -1)
            );
          }
        }
        // otherwise move the source forward, 'cause there's nothing to do
        else
          aStart++;
      }
      // this node has no meaning in the future list, so it's more than safe
      // to remove it, and check the next live node out instead, meaning
      // that only the live list index should be forwarded
      else
        parentNode.removeChild(get(a[aStart++], -1));
    }
  }
  return b;
};

const setAttribute = (element, name, value) =>
  element.setAttribute(name, value);

const removeAttribute = (element, name) =>
  element.removeAttribute(name);

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @returns {T}
 */
const aria = (element, value) => {
  for (const key in value) {
    const $ = value[key];
    const name = key === 'role' ? key : `aria-${key}`;
    if ($ == null) removeAttribute(element, name);
    else setAttribute(element, name, $);
  }
  return value;
};

const arrayComment = () => array;

let listeners;

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @param {string} name
 * @returns {T}
 */
const at = (element, value, name) => {
  name = name.slice(1);
  if (!listeners) listeners = new WeakMap;
  const known = listeners.get(element) || set(listeners, element, {});
  let current = known[name];
  if (current && current[0]) element.removeEventListener(name, ...current);
  current = isArray$3(value) ? value : [value, false];
  known[name] = current;
  if (current[0]) element.addEventListener(name, ...current);
  return value;
};

/**
 * @template T
 * @this {import("./literals.js").HoleDetails}
 * @param {Node} node
 * @param {T} value
 * @returns {T}
 */
function hole(node, value) {
  const n = this.n || (this.n = node);
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean': {
      if (n !== node) n.replaceWith((this.n = node));
      this.n.data = value;
      break;
    }
    case 'object':
    case 'undefined': {
      if (value == null) (this.n = node).data = '';
      else this.n = value.valueOf();
      n.replaceWith(this.n);
      break;
    }
  }
  return value;
}
const boundComment = () => hole.bind(comment());

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @returns {T}
 */
const className = (element, value) => maybeDirect(
  element, value, value == null ? 'class' : 'className'
);

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @returns {T}
 */
const data = (element, value) => {
  const { dataset } = element;
  for (const key in value) {
    if (value[key] == null) delete dataset[key];
    else dataset[key] = value[key];
  }
  return value;
};

/**
 * @template T
 * @param {Element | CSSStyleDeclaration} ref
 * @param {T} value
 * @param {string} name
 * @returns {T}
 */
const direct = (ref, value, name) => (ref[name] = value);

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @param {string} name
 * @returns {T}
 */
const dot = (element, value, name) => direct(element, value, name.slice(1));

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @param {string} name
 * @returns {T}
 */
const maybeDirect = (element, value, name) => (
  value == null ?
    (removeAttribute(element, name), value) :
    direct(element, value, name)
);

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @returns {T}
 */
const ref = (element, value) => (
  (typeof value === 'function' ?
    value(element) : (value.current = element)),
  value
);

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @param {string} name
 * @returns {T}
 */
const regular = (element, value, name) => (
  (value == null ?
    removeAttribute(element, name) :
    setAttribute(element, name, value)),
  value
);

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @returns {T}
 */
const style = (element, value) => (
  value == null ?
    maybeDirect(element, value, 'style') :
    direct(element.style, value, 'cssText')
);

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @param {string} name
 * @returns {T}
 */
const toggle = (element, value, name) => (
  element.toggleAttribute(name.slice(1), value),
  value
);

/**
 * @param {Node} node
 * @param {Node[]} value
 * @param {string} _
 * @param {Node[]} prev
 * @returns {Node[]}
 */
const array = (node, value, _, prev) => (
  value.length ?
    udomdiff(node.parentNode, prev, value, diffFragment, node) :
    (prev.length && drop(prev[0], prev.at(-1), false), empty)
);

const attr = new Map([
  ['aria', aria],
  ['class', className],
  ['data', data],
  ['ref', ref],
  ['style', style],
]);

/**
 * @param {HTMLElement | SVGElement} element
 * @param {string} name
 * @param {boolean} svg
 * @returns
 */
const attribute = (element, name, svg) => {
  switch (name[0]) {
    case '.': return dot;
    case '?': return toggle;
    case '@': return at;
    default: return (
      svg || ('ownerSVGElement' in element) ?
        (name === 'ref' ? ref : regular) :
        (attr.get(name) || (
          name in element ?
            (name.startsWith('on') ?
              direct :
              (gPD(element, name)?.set ? maybeDirect : regular)
            ) :
            regular
          )
        )
    );
  }
};

/**
 * @template T
 * @param {Element} element
 * @param {T} value
 * @returns {T}
 */
const text = (element, value) => (
  (element.textContent = value == null ? '' : value),
  value
);

let template = document.createElement('template'), svg, range;

/**
 * @param {string} text
 * @param {boolean} xml
 * @returns {DocumentFragment}
 */
const createContent = (text, xml) => {
  if (xml) {
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      range = newRange();
      range.selectNodeContents(svg);
    }
    return range.createContextualFragment(text);
  }
  template.innerHTML = text;
  const { content } = template;
  template = template.cloneNode(false);
  return content;
};

/** @typedef {import("./literals.js").Entry} Entry */

/**
 * @typedef {Object} Resolved
 * @property {DocumentFragment} content
 * @property {Entry[]} entries
 * @property {function[]} updates
 * @property {number} length
 */

/**
 * @param {Element} node
 * @returns {number[]}
 */
const createPath = node => {
  const path = [];
  let parentNode;
  while ((parentNode = node.parentNode)) {
    path.push(path.indexOf.call(parentNode.childNodes, node));
    node = parentNode;
  }
  return path;
};

/**
 * @param {TemplateStringsArray} template
 * @param {boolean} xml
 * @returns {Resolved}
 */
const resolve = (template, values, xml) => {
  const content = createContent(parser$1(template, prefix, xml), xml);
  const { length } = template;
  let asArray = false, entries = empty;
  if (length > 1) {
    const tw = document.createTreeWalker(content, 1 | 128);
    const replace = [];
    let i = 0, search = `${prefix}${i++}`;
    entries = [];
    while (i < length) {
      const node = tw.nextNode();
      if (node.nodeType === COMMENT_NODE) {
        if (node.data === search) {
          let update = isArray$3(values[i - 1]) ? arrayComment : boundComment;
          if (update === boundComment) replace.push(node);
          else asArray = true;
          entries.push(entry(COMMENT_NODE, createPath(node), update));
          search = `${prefix}${i++}`;
        }
      }
      else {
        let path;
        while (node.hasAttribute(search)) {
          if (!path) path = createPath(node);
          const name = node.getAttribute(search);
          entries.push(entry(ATTRIBUTE_NODE, path, attribute(node, name, xml), name));
          removeAttribute(node, search);
          search = `${prefix}${i++}`;
        }
        if (
          TEXT_ELEMENTS.test(node.localName) &&
          node.textContent.trim() === `<!--${search}-->`
        ) {
          entries.push(entry(TEXT_NODE, path || createPath(node), text));
          search = `${prefix}${i++}`;
        }
      }
    }
    for (i = 0; i < replace.length; i++)
      replace[i].replaceWith(document.createTextNode(''));
  }
  const l = content.childNodes.length;
  return set(cache, template, cel(content, entries, l === 1 && asArray ? 0 : l));
};

/** @type {WeakMap<TemplateStringsArray, Resolved>} */
const cache = new WeakMap;
const prefix = 'isµ';

/**
 * @param {boolean} xml
 * @returns {(template: TemplateStringsArray, values: any[]) => Resolved}
 */
const parser = xml => (template, values) => cache.get(template) || resolve(template, values, xml);

const parseHTML = create(parser(false));
const parseSVG = create(parser(true));

/**
 * @param {import("./literals.js").Cache} cache
 * @param {Hole} hole
 * @returns {Node}
 */
const unroll = (cache, { s: svg, t: template, v: values }) => {
  if (values.length && cache.s === empty) cache.s = [];
  const length = unrollValues(cache, values);
  if (cache.t !== template) {
    const { n: node, d: details } = (svg ? parseSVG : parseHTML)(template, values);
    cache.t = template;
    cache.n = node;
    cache.d = details;
  }
  else {
    const { d: details } = cache;
    for (let i = 0; i < length; i++) {
      const value = values[i];
      const detail = details[i];
      const { v: previous } = detail;
      if (value !== previous) {
        const { u: update, t: target, n: name } = detail;
        detail.v = update(target, value, name, previous);
      }
    }
  }
  return cache.n;
};

/**
 * @param {Cache} cache
 * @param {any[]} values
 * @returns {number}
 */
const unrollValues = ({ s: stack }, values) => {
  const { length } = values;
  for (let i = 0; i < length; i++) {
    const hole = values[i];
    if (hole instanceof Hole)
      values[i] = unroll(stack[i] || (stack[i] = cache$1(empty)), hole);
    else if (isArray$3(hole))
      unrollValues(stack[i] || (stack[i] = cache$1([])), hole);
    else
      stack[i] = null;
  }
  if (length < stack.length) stack.splice(length);
  return length;
};

/**
 * Holds all details needed to render the content on a render.
 * @constructor
 * @param {boolean} svg The content type.
 * @param {TemplateStringsArray} template The template literals used to the define the content.
 * @param {any[]} values Zero, one, or more interpolated values to render.
 */
class Hole {
  constructor(svg, template, values) {
    this.s = svg;
    this.t = template;
    this.v = values;
  }
}

/** @typedef {import("../rabbit.js").Hole} Hole */

/** @type {WeakMap<Element | DocumentFragment, import("../literals.js").Cache>} */
const known = new WeakMap;

/**
 * Render with smart updates within a generic container.
 * @template T
 * @param {T} where the DOM node where to render content
 * @param {(() => Hole) | Hole} what the hole to render
 * @returns
 */
const render = (where, what) => {
  const info = known.get(where) || set(known, where, cache$1(empty));
  if (info.n !== unroll(info, typeof what === 'function' ? what() : what))
    where.replaceChildren(info.n);
  return where;
};

/*! (c) Andrea Giammarchi - MIT */


/** @typedef {import("./literals.js").Value} Value */

const tag = svg => (template, ...values) => new Hole(svg, template, values);

/** @type {(template: TemplateStringsArray, ...values:Value[]) => Hole} A tag to render HTML content. */
const html = tag(false);

const errors = '';

const props = '';

var main = {};

var parse$1 = {};

/* remove eslint errors to see if there is something really wrong */

var window$1 = { document: {} };

var hasOwnProperty = Object.prototype.hasOwnProperty;

var lowercase = function (string) {
	return isString(string) ? string.toLowerCase() : string;
};

/**
 * @ngdoc function
 * @name angular.isArray
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is an `Array`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Array`.
 */
var isArray$2 = Array.isArray;

var manualLowercase = function (s) {
	/* eslint-disable no-bitwise */
	return isString(s)
		? s.replace(/[A-Z]/g, function (ch) {
				return String.fromCharCode(ch.charCodeAt(0) | 32);
		  })
		: s;
	/* eslint-enable */
};

// String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish
// locale, for this reason we need to detect this case and redefine lowercase/uppercase methods
// with correct but slower alternatives. See https://github.com/angular/angular.js/issues/11387
if ("i" !== "I".toLowerCase()) {
	lowercase = manualLowercase;
}

var jqLite, // delay binding since jQuery could be loaded after us.
	toString$1 = Object.prototype.toString,
	getPrototypeOf = Object.getPrototypeOf,
	ngMinErr = minErr("ng");
	/** @name angular */
	window$1.angular || (window$1.angular = {});

/**
 * documentMode is an IE-only property
 * http://msdn.microsoft.com/en-us/library/ie/cc196988(v=vs.85).aspx
 */
window$1.document.documentMode;

/**
 * @private
 * @param {*} obj
 * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,
 *                   String ...)
 */
function isArrayLike$1(obj) {
	// `null`, `undefined` and `window` are not array-like
	if (obj == null || isWindow(obj)) return false;

	// arrays, strings and jQuery/jqLite objects are array like
	// * jqLite is either the jQuery or jqLite constructor function
	// * we have to check the existence of jqLite first as this method is called
	//   via the forEach method when constructing the jqLite object in the first place
	if (isArray$2(obj) || isString(obj) || (jqLite ))
		return true;

	// Support: iOS 8.2 (not reproducible in simulator)
	// "length" in obj used to prevent JIT error (gh-11508)
	var length = "length" in Object(obj) && obj.length;

	// NodeList objects (with `item` method) and
	// other objects with suitable length characteristics are array-like
	return (
		isNumber(length) &&
		((length >= 0 && (length - 1 in obj || obj instanceof Array)) ||
			typeof obj.item === "function")
	);
}

/**
 * @ngdoc function
 * @name angular.forEach
 * @module ng
 * @kind function
 *
 * @description
 * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
 * object or an array. The `iterator` function is invoked with `iterator(value, key, obj)`, where `value`
 * is the value of an object property or an array element, `key` is the object property key or
 * array element index and obj is the `obj` itself. Specifying a `context` for the function is optional.
 *
 * It is worth noting that `.forEach` does not iterate over inherited properties because it filters
 * using the `hasOwnProperty` method.
 *
 * Unlike ES262's
 * [Array.prototype.forEach](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18),
 * providing 'undefined' or 'null' values for `obj` will not throw a TypeError, but rather just
 * return the value provided.
 *
   ```js
     var values = {name: 'misko', gender: 'male'};
     var log = [];
     angular.forEach(values, function(value, key) {
       this.push(key + ': ' + value);
     }, log);
     expect(log).toEqual(['name: misko', 'gender: male']);
   ```
 *
 * @param {Object|Array} obj Object to iterate over.
 * @param {Function} iterator Iterator function.
 * @param {Object=} context Object to become context (`this`) for the iterator function.
 * @returns {Object|Array} Reference to `obj`.
 */

function forEach(obj, iterator, context) {
	var key, length;
	if (obj) {
		if (isFunction$1(obj)) {
			for (key in obj) {
				if (
					key !== "prototype" &&
					key !== "length" &&
					key !== "name" &&
					obj.hasOwnProperty(key)
				) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		} else if (isArray$2(obj) || isArrayLike$1(obj)) {
			var isPrimitive = typeof obj !== "object";
			for (key = 0, length = obj.length; key < length; key++) {
				if (isPrimitive || key in obj) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		} else if (obj.forEach && obj.forEach !== forEach) {
			obj.forEach(iterator, context, obj);
		} else if (isBlankObject(obj)) {
			// createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
			// eslint-disable-next-line guard-for-in
			for (key in obj) {
				iterator.call(context, obj[key], key, obj);
			}
		} else if (typeof obj.hasOwnProperty === "function") {
			// Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		} else {
			// Slow path for objects which do not have a method `hasOwnProperty`
			for (key in obj) {
				if (hasOwnProperty.call(obj, key)) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		}
	}
	return obj;
}

/**
 * Set or clear the hashkey for an object.
 * @param obj object
 * @param h the hashkey (!truthy to delete the hashkey)
 */
function setHashKey(obj, h) {
	if (h) {
		obj.$$hashKey = h;
	} else {
		delete obj.$$hashKey;
	}
}

/**
 * @ngdoc function
 * @name angular.noop
 * @module ng
 * @kind function
 *
 * @description
 * A function that performs no operations. This function can be useful when writing code in the
 * functional style.
   ```js
     function foo(callback) {
       var result = calculateResult();
       (callback || angular.noop)(result);
     }
   ```
 */
function noop$2() {}
noop$2.$inject = [];

/**
 * @ngdoc function
 * @name angular.isUndefined
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is undefined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is undefined.
 */
function isUndefined(value) {
	return typeof value === "undefined";
}

/**
 * @ngdoc function
 * @name angular.isDefined
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is defined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is defined.
 */
function isDefined(value) {
	return typeof value !== "undefined";
}

/**
 * @ngdoc function
 * @name angular.isObject
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
 * considered to be objects. Note that JavaScript arrays are objects.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Object` but not `null`.
 */
function isObject(value) {
	// http://jsperf.com/isobject4
	return value !== null && typeof value === "object";
}

/**
 * Determine if a value is an object with a null prototype
 *
 * @returns {boolean} True if `value` is an `Object` with a null prototype
 */
function isBlankObject(value) {
	return value !== null && typeof value === "object" && !getPrototypeOf(value);
}

/**
 * @ngdoc function
 * @name angular.isString
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `String`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `String`.
 */
function isString(value) {
	return typeof value === "string";
}

/**
 * @ngdoc function
 * @name angular.isNumber
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `Number`.
 *
 * This includes the "special" numbers `NaN`, `+Infinity` and `-Infinity`.
 *
 * If you wish to exclude these then you can use the native
 * [`isFinite'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
 * method.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Number`.
 */
function isNumber(value) {
	return typeof value === "number";
}

/**
 * @ngdoc function
 * @name angular.isFunction
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `Function`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Function`.
 */
function isFunction$1(value) {
	return typeof value === "function";
}

/**
 * Checks if `obj` is a window object.
 *
 * @private
 * @param {*} obj Object to check
 * @returns {boolean} True if `obj` is a window obj.
 */
function isWindow(obj) {
	return obj && obj.window === obj;
}

function isScope(obj) {
	return obj && obj.$evalAsync && obj.$watch;
}

var TYPED_ARRAY_REGEXP =
	/^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/;
function isTypedArray(value) {
	return (
		value &&
		isNumber(value.length) &&
		TYPED_ARRAY_REGEXP.test(toString$1.call(value))
	);
}

function isArrayBuffer(obj) {
	return toString$1.call(obj) === "[object ArrayBuffer]";
}

/**
 * @ngdoc function
 * @name angular.copy
 * @module ng
 * @kind function
 *
 * @description
 * Creates a deep copy of `source`, which should be an object or an array.
 *
 * * If no destination is supplied, a copy of the object or array is created.
 * * If a destination is provided, all of its elements (for arrays) or properties (for objects)
 *   are deleted and then all elements/properties from the source are copied to it.
 * * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.
 * * If `source` is identical to `destination` an exception will be thrown.
 *
 * <br />
 * <div class="alert alert-warning">
 *   Only enumerable properties are taken into account. Non-enumerable properties (both on `source`
 *   and on `destination`) will be ignored.
 * </div>
 *
 * @param {*} source The source that will be used to make a copy.
 *                   Can be any type, including primitives, `null`, and `undefined`.
 * @param {(Object|Array)=} destination Destination into which the source is copied. If
 *     provided, must be of the same type as `source`.
 * @returns {*} The copy or updated `destination`, if `destination` was specified.
 *
 * @example
  <example module="copyExample" name="angular-copy">
    <file name="index.html">
      <div ng-controller="ExampleController">
        <form novalidate class="simple-form">
          <label>Name: <input type="text" ng-model="user.name" /></label><br />
          <label>Age:  <input type="number" ng-model="user.age" /></label><br />
          Gender: <label><input type="radio" ng-model="user.gender" value="male" />male</label>
                  <label><input type="radio" ng-model="user.gender" value="female" />female</label><br />
          <button ng-click="reset()">RESET</button>
          <button ng-click="update(user)">SAVE</button>
        </form>
        <pre>form = {{user | json}}</pre>
        <pre>master = {{master | json}}</pre>
      </div>
    </file>
    <file name="script.js">
      // Module: copyExample
      angular.
        module('copyExample', []).
        controller('ExampleController', ['$scope', function($scope) {
          $scope.master = {};

          $scope.reset = function() {
            // Example with 1 argument
            $scope.user = angular.copy($scope.master);
          };

          $scope.update = function(user) {
            // Example with 2 arguments
            angular.copy(user, $scope.master);
          };

          $scope.reset();
        }]);
    </file>
  </example>
 */
function copy(source, destination) {
	var stackSource = [];
	var stackDest = [];

	if (destination) {
		if (isTypedArray(destination) || isArrayBuffer(destination)) {
			throw ngMinErr(
				"cpta",
				"Can't copy! TypedArray destination cannot be mutated."
			);
		}
		if (source === destination) {
			throw ngMinErr(
				"cpi",
				"Can't copy! Source and destination are identical."
			);
		}

		// Empty the destination object
		if (isArray$2(destination)) {
			destination.length = 0;
		} else {
			forEach(destination, function (value, key) {
				if (key !== "$$hashKey") {
					delete destination[key];
				}
			});
		}

		stackSource.push(source);
		stackDest.push(destination);
		return copyRecurse(source, destination);
	}

	return copyElement(source);

	function copyRecurse(source, destination) {
		var h = destination.$$hashKey;
		var key;
		if (isArray$2(source)) {
			for (var i = 0, ii = source.length; i < ii; i++) {
				destination.push(copyElement(source[i]));
			}
		} else if (isBlankObject(source)) {
			// createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
			// eslint-disable-next-line guard-for-in
			for (key in source) {
				destination[key] = copyElement(source[key]);
			}
		} else if (source && typeof source.hasOwnProperty === "function") {
			// Slow path, which must rely on hasOwnProperty
			for (key in source) {
				if (source.hasOwnProperty(key)) {
					destination[key] = copyElement(source[key]);
				}
			}
		} else {
			// Slowest path --- hasOwnProperty can't be called as a method
			for (key in source) {
				if (hasOwnProperty.call(source, key)) {
					destination[key] = copyElement(source[key]);
				}
			}
		}
		setHashKey(destination, h);
		return destination;
	}

	function copyElement(source) {
		// Simple values
		if (!isObject(source)) {
			return source;
		}

		// Already copied values
		var index = stackSource.indexOf(source);
		if (index !== -1) {
			return stackDest[index];
		}

		if (isWindow(source) || isScope(source)) {
			throw ngMinErr(
				"cpws",
				"Can't copy! Making copies of Window or Scope instances is not supported."
			);
		}

		var needsRecurse = false;
		var destination = copyType(source);

		if (destination === undefined) {
			destination = isArray$2(source)
				? []
				: Object.create(getPrototypeOf(source));
			needsRecurse = true;
		}

		stackSource.push(source);
		stackDest.push(destination);

		return needsRecurse ? copyRecurse(source, destination) : destination;
	}

	function copyType(source) {
		switch (toString$1.call(source)) {
			case "[object Int8Array]":
			case "[object Int16Array]":
			case "[object Int32Array]":
			case "[object Float32Array]":
			case "[object Float64Array]":
			case "[object Uint8Array]":
			case "[object Uint8ClampedArray]":
			case "[object Uint16Array]":
			case "[object Uint32Array]":
				return new source.constructor(
					copyElement(source.buffer),
					source.byteOffset,
					source.length
				);

			case "[object ArrayBuffer]":
				// Support: IE10
				if (!source.slice) {
					// If we're in this case we know the environment supports ArrayBuffer
					/* eslint-disable no-undef */
					var copied = new ArrayBuffer(source.byteLength);
					new Uint8Array(copied).set(new Uint8Array(source));
					/* eslint-enable */
					return copied;
				}
				return source.slice(0);

			case "[object Boolean]":
			case "[object Number]":
			case "[object String]":
			case "[object Date]":
				return new source.constructor(source.valueOf());

			case "[object RegExp]":
				var re = new RegExp(
					source.source,
					source.toString().match(/[^\/]*$/)[0]
				);
				re.lastIndex = source.lastIndex;
				return re;

			case "[object Blob]":
				return new source.constructor([source], { type: source.type });
		}

		if (isFunction$1(source.cloneNode)) {
			return source.cloneNode(true);
		}
	}
}

function toJsonReplacer(key, value) {
	var val = value;

	if (
		typeof key === "string" &&
		key.charAt(0) === "$" &&
		key.charAt(1) === "$"
	) {
		val = undefined;
	} else if (isWindow(value)) {
		val = "$WINDOW";
	} else if (value && window$1.document === value) {
		val = "$DOCUMENT";
	} else if (isScope(value)) {
		val = "$SCOPE";
	}

	return val;
}

function allowAutoBootstrap(document) {
	if (!document.currentScript) {
		return true;
	}
	var src = document.currentScript.getAttribute("src");
	var link = document.createElement("a");
	link.href = src;
	var scriptProtocol = link.protocol;
	var docLoadProtocol = document.location.protocol;
	if (
		(scriptProtocol === "resource:" ||
			scriptProtocol === "chrome-extension:") &&
		docLoadProtocol !== scriptProtocol
	) {
		return false;
	}
	return true;
}

// Cached as it has to run during loading so that document.currentScript is available.
allowAutoBootstrap(window$1.document);

/**
 * Creates a new object without a prototype. This object is useful for lookup without having to
 * guard against prototypically inherited properties via hasOwnProperty.
 *
 * Related micro-benchmarks:
 * - http://jsperf.com/object-create2
 * - http://jsperf.com/proto-map-lookup/2
 * - http://jsperf.com/for-in-vs-object-keys2
 *
 * @returns {Object}
 */
function createMap() {
	return Object.create(null);
}

/* global toDebugString: true */

function serializeObject(obj) {
	var seen = [];

	return JSON.stringify(obj, function (key, val) {
		val = toJsonReplacer(key, val);
		if (isObject(val)) {
			if (seen.indexOf(val) >= 0) return "...";

			seen.push(val);
		}
		return val;
	});
}

function toDebugString(obj) {
	if (typeof obj === "function") {
		return obj.toString().replace(/ \{[\s\S]*$/, "");
	} else if (isUndefined(obj)) {
		return "undefined";
	} else if (typeof obj !== "string") {
		return serializeObject(obj);
	}
	return obj;
}

/**
 * @description
 *
 * This object provides a utility for producing rich Error messages within
 * Angular. It can be called as follows:
 *
 * var exampleMinErr = minErr('example');
 * throw exampleMinErr('one', 'This {0} is {1}', foo, bar);
 *
 * The above creates an instance of minErr in the example namespace. The
 * resulting error will have a namespaced error code of example.one.  The
 * resulting error will replace {0} with the value of foo, and {1} with the
 * value of bar. The object is not restricted in the number of arguments it can
 * take.
 *
 * If fewer arguments are specified than necessary for interpolation, the extra
 * interpolation markers will be preserved in the final string.
 *
 * Since data will be parsed statically during a build step, some restrictions
 * are applied with respect to how minErr instances are created and called.
 * Instances should have names of the form namespaceMinErr for a minErr created
 * using minErr('namespace') . Error codes, namespaces and template strings
 * should all be static strings, not variables or general expressions.
 *
 * @param {string} module The namespace to use for the new minErr instance.
 * @param {function} ErrorConstructor Custom error constructor to be instantiated when returning
 *   error from returned function, for cases when a particular type of error is useful.
 * @returns {function(code:string, template:string, ...templateArgs): Error} minErr instance
 */

function minErr(module, ErrorConstructor) {
	ErrorConstructor = ErrorConstructor || Error;
	return function () {
		var SKIP_INDEXES = 2;

		var templateArgs = arguments,
			code = templateArgs[0],
			message = "[" + (module ? module + ":" : "") + code + "] ",
			template = templateArgs[1],
			paramPrefix,
			i;

		message += template.replace(/\{\d+\}/g, function (match) {
			var index = +match.slice(1, -1),
				shiftedIndex = index + SKIP_INDEXES;

			if (shiftedIndex < templateArgs.length) {
				return toDebugString(templateArgs[shiftedIndex]);
			}

			return match;
		});

		message +=
			'\nhttp://errors.angularjs.org/"NG_VERSION_FULL"/' +
			(module ? module + "/" : "") +
			code;

		for (
			i = SKIP_INDEXES, paramPrefix = "?";
			i < templateArgs.length;
			i++, paramPrefix = "&"
		) {
			message +=
				paramPrefix +
				"p" +
				(i - SKIP_INDEXES) +
				"=" +
				encodeURIComponent(toDebugString(templateArgs[i]));
		}

		return new ErrorConstructor(message);
	};
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *     Any commits to this file should be reviewed with security in mind.  *
 *   Changes to this file can potentially create security vulnerabilities. *
 *          An approval from 2 Core members with history of modifying      *
 *                         this file is required.                          *
 *                                                                         *
 *  Does the change somehow allow for arbitrary javascript to be executed? *
 *    Or allows for someone to change the prototype of built-in objects?   *
 *     Or gives undesired access to variables likes document or window?    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var $parseMinErr = minErr("$parse");

({}).constructor.prototype.valueOf;

// Sandboxing Angular Expressions
// ------------------------------
// Angular expressions are no longer sandboxed. So it is now even easier to access arbitrary JS code by
// various means such as obtaining a reference to native JS functions like the Function constructor.
//
// As an example, consider the following Angular expression:
//
//   {}.toString.constructor('alert("evil JS code")')
//
// It is important to realize that if you create an expression from a string that contains user provided
// content then it is possible that your application contains a security vulnerability to an XSS style attack.
//
// See https://docs.angularjs.org/guide/security

function getStringValue(name) {
	// Property names must be strings. This means that non-string objects cannot be used
	// as keys in an object. Any non-string object, including a number, is typecasted
	// into a string via the toString method.
	// -- MDN, https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Property_accessors#Property_names
	//
	// So, to ensure that we are checking the same `name` that JavaScript would use, we cast it
	// to a string. It's not always possible. If `name` is an object and its `toString` method is
	// 'broken' (doesn't return a string, isn't a function, etc.), an error will be thrown:
	//
	// TypeError: Cannot convert object to primitive value
	//
	// For performance reasons, we don't catch this error here and allow it to propagate up the call
	// stack. Note that you'll get the same error in JavaScript if you try to access a property using
	// such a 'broken' object as a key.
	return name + "";
}

var OPERATORS = createMap();
forEach(
	"+ - * / % === !== == != < > <= >= && || ! = |".split(" "),
	function (operator) {
		OPERATORS[operator] = true;
	}
);
var ESCAPE = {
	n: "\n",
	f: "\f",
	r: "\r",
	t: "\t",
	v: "\v",
	"'": "'",
	'"': '"',
};

/////////////////////////////////////////

/**
 * @constructor
 */
var Lexer$1 = function Lexer(options) {
	this.options = options;
};

Lexer$1.prototype = {
	constructor: Lexer$1,

	lex: function (text) {
		this.text = text;
		this.index = 0;
		this.tokens = [];

		while (this.index < this.text.length) {
			var ch = this.text.charAt(this.index);
			if (ch === '"' || ch === "'") {
				this.readString(ch);
			} else if (
				this.isNumber(ch) ||
				(ch === "." && this.isNumber(this.peek()))
			) {
				this.readNumber();
			} else if (this.isIdentifierStart(this.peekMultichar())) {
				this.readIdent();
			} else if (this.is(ch, "(){}[].,;:?")) {
				this.tokens.push({ index: this.index, text: ch });
				this.index++;
			} else if (this.isWhitespace(ch)) {
				this.index++;
			} else {
				var ch2 = ch + this.peek();
				var ch3 = ch2 + this.peek(2);
				var op1 = OPERATORS[ch];
				var op2 = OPERATORS[ch2];
				var op3 = OPERATORS[ch3];
				if (op1 || op2 || op3) {
					var token = op3 ? ch3 : op2 ? ch2 : ch;
					this.tokens.push({ index: this.index, text: token, operator: true });
					this.index += token.length;
				} else {
					this.throwError(
						"Unexpected next character ",
						this.index,
						this.index + 1
					);
				}
			}
		}
		return this.tokens;
	},

	is: function (ch, chars) {
		return chars.indexOf(ch) !== -1;
	},

	peek: function (i) {
		var num = i || 1;
		return this.index + num < this.text.length
			? this.text.charAt(this.index + num)
			: false;
	},

	isNumber: function (ch) {
		return "0" <= ch && ch <= "9" && typeof ch === "string";
	},

	isWhitespace: function (ch) {
		// IE treats non-breaking space as \u00A0
		return (
			ch === " " ||
			ch === "\r" ||
			ch === "\t" ||
			ch === "\n" ||
			ch === "\v" ||
			ch === "\u00A0"
		);
	},

	isIdentifierStart: function (ch) {
		return this.options.isIdentifierStart
			? this.options.isIdentifierStart(ch, this.codePointAt(ch))
			: this.isValidIdentifierStart(ch);
	},

	isValidIdentifierStart: function (ch) {
		return (
			("a" <= ch && ch <= "z") ||
			("A" <= ch && ch <= "Z") ||
			"_" === ch ||
			ch === "$"
		);
	},

	isIdentifierContinue: function (ch) {
		return this.options.isIdentifierContinue
			? this.options.isIdentifierContinue(ch, this.codePointAt(ch))
			: this.isValidIdentifierContinue(ch);
	},

	isValidIdentifierContinue: function (ch, cp) {
		return this.isValidIdentifierStart(ch, cp) || this.isNumber(ch);
	},

	codePointAt: function (ch) {
		if (ch.length === 1) return ch.charCodeAt(0);
		// eslint-disable-next-line no-bitwise
		return (ch.charCodeAt(0) << 10) + ch.charCodeAt(1) - 0x35fdc00;
	},

	peekMultichar: function () {
		var ch = this.text.charAt(this.index);
		var peek = this.peek();
		if (!peek) {
			return ch;
		}
		var cp1 = ch.charCodeAt(0);
		var cp2 = peek.charCodeAt(0);
		if (cp1 >= 0xd800 && cp1 <= 0xdbff && cp2 >= 0xdc00 && cp2 <= 0xdfff) {
			return ch + peek;
		}
		return ch;
	},

	isExpOperator: function (ch) {
		return ch === "-" || ch === "+" || this.isNumber(ch);
	},

	throwError: function (error, start, end) {
		end = end || this.index;
		var colStr = isDefined(start)
			? "s " +
			  start +
			  "-" +
			  this.index +
			  " [" +
			  this.text.substring(start, end) +
			  "]"
			: " " + end;
		throw $parseMinErr(
			"lexerr",
			"Lexer Error: {0} at column{1} in expression [{2}].",
			error,
			colStr,
			this.text
		);
	},

	readNumber: function () {
		var number = "";
		var start = this.index;
		while (this.index < this.text.length) {
			var ch = lowercase(this.text.charAt(this.index));
			if (ch === "." || this.isNumber(ch)) {
				number += ch;
			} else {
				var peekCh = this.peek();
				if (ch === "e" && this.isExpOperator(peekCh)) {
					number += ch;
				} else if (
					this.isExpOperator(ch) &&
					peekCh &&
					this.isNumber(peekCh) &&
					number.charAt(number.length - 1) === "e"
				) {
					number += ch;
				} else if (
					this.isExpOperator(ch) &&
					(!peekCh || !this.isNumber(peekCh)) &&
					number.charAt(number.length - 1) === "e"
				) {
					this.throwError("Invalid exponent");
				} else {
					break;
				}
			}
			this.index++;
		}
		this.tokens.push({
			index: start,
			text: number,
			constant: true,
			value: Number(number),
		});
	},

	readIdent: function () {
		var start = this.index;
		this.index += this.peekMultichar().length;
		while (this.index < this.text.length) {
			var ch = this.peekMultichar();
			if (!this.isIdentifierContinue(ch)) {
				break;
			}
			this.index += ch.length;
		}
		this.tokens.push({
			index: start,
			text: this.text.slice(start, this.index),
			identifier: true,
		});
	},

	readString: function (quote) {
		var start = this.index;
		this.index++;
		var string = "";
		var rawString = quote;
		var escape = false;
		while (this.index < this.text.length) {
			var ch = this.text.charAt(this.index);
			rawString += ch;
			if (escape) {
				if (ch === "u") {
					var hex = this.text.substring(this.index + 1, this.index + 5);
					if (!hex.match(/[\da-f]{4}/i)) {
						this.throwError("Invalid unicode escape [\\u" + hex + "]");
					}
					this.index += 4;
					string += String.fromCharCode(parseInt(hex, 16));
				} else {
					var rep = ESCAPE[ch];
					string = string + (rep || ch);
				}
				escape = false;
			} else if (ch === "\\") {
				escape = true;
			} else if (ch === quote) {
				this.index++;
				this.tokens.push({
					index: start,
					text: rawString,
					constant: true,
					value: string,
				});
				return;
			} else {
				string += ch;
			}
			this.index++;
		}
		this.throwError("Unterminated quote", start);
	},
};

var AST = function AST(lexer, options) {
	this.lexer = lexer;
	this.options = options;
};

AST.Program = "Program";
AST.ExpressionStatement = "ExpressionStatement";
AST.AssignmentExpression = "AssignmentExpression";
AST.ConditionalExpression = "ConditionalExpression";
AST.LogicalExpression = "LogicalExpression";
AST.BinaryExpression = "BinaryExpression";
AST.UnaryExpression = "UnaryExpression";
AST.CallExpression = "CallExpression";
AST.MemberExpression = "MemberExpression";
AST.Identifier = "Identifier";
AST.Literal = "Literal";
AST.ArrayExpression = "ArrayExpression";
AST.Property = "Property";
AST.ObjectExpression = "ObjectExpression";
AST.ThisExpression = "ThisExpression";
AST.LocalsExpression = "LocalsExpression";

// Internal use only
AST.NGValueParameter = "NGValueParameter";

AST.prototype = {
	ast: function (text) {
		this.text = text;
		this.tokens = this.lexer.lex(text);

		var value = this.program();

		if (this.tokens.length !== 0) {
			this.throwError("is an unexpected token", this.tokens[0]);
		}

		return value;
	},

	program: function () {
		var body = [];
		while (true) {
			if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]"))
				body.push(this.expressionStatement());
			if (!this.expect(";")) {
				return { type: AST.Program, body: body };
			}
		}
	},

	expressionStatement: function () {
		return { type: AST.ExpressionStatement, expression: this.filterChain() };
	},

	filterChain: function () {
		var left = this.expression();
		while (this.expect("|")) {
			left = this.filter(left);
		}
		return left;
	},

	expression: function () {
		return this.assignment();
	},

	assignment: function () {
		var result = this.ternary();
		if (this.expect("=")) {
			if (!isAssignable(result)) {
				throw $parseMinErr("lval", "Trying to assign a value to a non l-value");
			}

			result = {
				type: AST.AssignmentExpression,
				left: result,
				right: this.assignment(),
				operator: "=",
			};
		}
		return result;
	},

	ternary: function () {
		var test = this.logicalOR();
		var alternate;
		var consequent;
		if (this.expect("?")) {
			alternate = this.expression();
			if (this.consume(":")) {
				consequent = this.expression();
				return {
					type: AST.ConditionalExpression,
					test: test,
					alternate: alternate,
					consequent: consequent,
				};
			}
		}
		return test;
	},

	logicalOR: function () {
		var left = this.logicalAND();
		while (this.expect("||")) {
			left = {
				type: AST.LogicalExpression,
				operator: "||",
				left: left,
				right: this.logicalAND(),
			};
		}
		return left;
	},

	logicalAND: function () {
		var left = this.equality();
		while (this.expect("&&")) {
			left = {
				type: AST.LogicalExpression,
				operator: "&&",
				left: left,
				right: this.equality(),
			};
		}
		return left;
	},

	equality: function () {
		var left = this.relational();
		var token;
		while ((token = this.expect("==", "!=", "===", "!=="))) {
			left = {
				type: AST.BinaryExpression,
				operator: token.text,
				left: left,
				right: this.relational(),
			};
		}
		return left;
	},

	relational: function () {
		var left = this.additive();
		var token;
		while ((token = this.expect("<", ">", "<=", ">="))) {
			left = {
				type: AST.BinaryExpression,
				operator: token.text,
				left: left,
				right: this.additive(),
			};
		}
		return left;
	},

	additive: function () {
		var left = this.multiplicative();
		var token;
		while ((token = this.expect("+", "-"))) {
			left = {
				type: AST.BinaryExpression,
				operator: token.text,
				left: left,
				right: this.multiplicative(),
			};
		}
		return left;
	},

	multiplicative: function () {
		var left = this.unary();
		var token;
		while ((token = this.expect("*", "/", "%"))) {
			left = {
				type: AST.BinaryExpression,
				operator: token.text,
				left: left,
				right: this.unary(),
			};
		}
		return left;
	},

	unary: function () {
		var token;
		if ((token = this.expect("+", "-", "!"))) {
			return {
				type: AST.UnaryExpression,
				operator: token.text,
				prefix: true,
				argument: this.unary(),
			};
		} else {
			return this.primary();
		}
	},

	primary: function () {
		var primary;
		if (this.expect("(")) {
			primary = this.filterChain();
			this.consume(")");
		} else if (this.expect("[")) {
			primary = this.arrayDeclaration();
		} else if (this.expect("{")) {
			primary = this.object();
		} else if (this.selfReferential.hasOwnProperty(this.peek().text)) {
			primary = copy(this.selfReferential[this.consume().text]);
		} else if (this.options.literals.hasOwnProperty(this.peek().text)) {
			primary = {
				type: AST.Literal,
				value: this.options.literals[this.consume().text],
			};
		} else if (this.peek().identifier) {
			primary = this.identifier();
		} else if (this.peek().constant) {
			primary = this.constant();
		} else {
			this.throwError("not a primary expression", this.peek());
		}

		var next;
		while ((next = this.expect("(", "[", "."))) {
			if (next.text === "(") {
				primary = {
					type: AST.CallExpression,
					callee: primary,
					arguments: this.parseArguments(),
				};
				this.consume(")");
			} else if (next.text === "[") {
				primary = {
					type: AST.MemberExpression,
					object: primary,
					property: this.expression(),
					computed: true,
				};
				this.consume("]");
			} else if (next.text === ".") {
				primary = {
					type: AST.MemberExpression,
					object: primary,
					property: this.identifier(),
					computed: false,
				};
			} else {
				this.throwError("IMPOSSIBLE");
			}
		}
		return primary;
	},

	filter: function (baseExpression) {
		var args = [baseExpression];
		var result = {
			type: AST.CallExpression,
			callee: this.identifier(),
			arguments: args,
			filter: true,
		};

		while (this.expect(":")) {
			args.push(this.expression());
		}

		return result;
	},

	parseArguments: function () {
		var args = [];
		if (this.peekToken().text !== ")") {
			do {
				args.push(this.filterChain());
			} while (this.expect(","));
		}
		return args;
	},

	identifier: function () {
		var token = this.consume();
		if (!token.identifier) {
			this.throwError("is not a valid identifier", token);
		}
		return { type: AST.Identifier, name: token.text };
	},

	constant: function () {
		// TODO check that it is a constant
		return { type: AST.Literal, value: this.consume().value };
	},

	arrayDeclaration: function () {
		var elements = [];
		if (this.peekToken().text !== "]") {
			do {
				if (this.peek("]")) {
					// Support trailing commas per ES5.1.
					break;
				}
				elements.push(this.expression());
			} while (this.expect(","));
		}
		this.consume("]");

		return { type: AST.ArrayExpression, elements: elements };
	},

	object: function () {
		var properties = [],
			property;
		if (this.peekToken().text !== "}") {
			do {
				if (this.peek("}")) {
					// Support trailing commas per ES5.1.
					break;
				}
				property = { type: AST.Property, kind: "init" };
				if (this.peek().constant) {
					property.key = this.constant();
					property.computed = false;
					this.consume(":");
					property.value = this.expression();
				} else if (this.peek().identifier) {
					property.key = this.identifier();
					property.computed = false;
					if (this.peek(":")) {
						this.consume(":");
						property.value = this.expression();
					} else {
						property.value = property.key;
					}
				} else if (this.peek("[")) {
					this.consume("[");
					property.key = this.expression();
					this.consume("]");
					property.computed = true;
					this.consume(":");
					property.value = this.expression();
				} else {
					this.throwError("invalid key", this.peek());
				}
				properties.push(property);
			} while (this.expect(","));
		}
		this.consume("}");

		return { type: AST.ObjectExpression, properties: properties };
	},

	throwError: function (msg, token) {
		throw $parseMinErr(
			"syntax",
			"Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].",
			token.text,
			msg,
			token.index + 1,
			this.text,
			this.text.substring(token.index)
		);
	},

	consume: function (e1) {
		if (this.tokens.length === 0) {
			throw $parseMinErr(
				"ueoe",
				"Unexpected end of expression: {0}",
				this.text
			);
		}

		var token = this.expect(e1);
		if (!token) {
			this.throwError("is unexpected, expecting [" + e1 + "]", this.peek());
		}
		return token;
	},

	peekToken: function () {
		if (this.tokens.length === 0) {
			throw $parseMinErr(
				"ueoe",
				"Unexpected end of expression: {0}",
				this.text
			);
		}
		return this.tokens[0];
	},

	peek: function (e1, e2, e3, e4) {
		return this.peekAhead(0, e1, e2, e3, e4);
	},

	peekAhead: function (i, e1, e2, e3, e4) {
		if (this.tokens.length > i) {
			var token = this.tokens[i];
			var t = token.text;
			if (
				t === e1 ||
				t === e2 ||
				t === e3 ||
				t === e4 ||
				(!e1 && !e2 && !e3 && !e4)
			) {
				return token;
			}
		}
		return false;
	},

	expect: function (e1, e2, e3, e4) {
		var token = this.peek(e1, e2, e3, e4);
		if (token) {
			this.tokens.shift();
			return token;
		}
		return false;
	},

	selfReferential: {
		this: { type: AST.ThisExpression },
		$locals: { type: AST.LocalsExpression },
	},
};

function ifDefined(v, d) {
	return typeof v !== "undefined" ? v : d;
}

function plusFn(l, r) {
	if (typeof l === "undefined") return r;
	if (typeof r === "undefined") return l;
	return l + r;
}

function isStateless($filter, filterName) {
	var fn = $filter(filterName);
	if (!fn) {
		throw new Error("Filter '" + filterName + "' is not defined");
	}
	return !fn.$stateful;
}

function findConstantAndWatchExpressions(ast, $filter) {
	var allConstants;
	var argsToWatch;
	var isStatelessFilter;
	switch (ast.type) {
		case AST.Program:
			allConstants = true;
			forEach(ast.body, function (expr) {
				findConstantAndWatchExpressions(expr.expression, $filter);
				allConstants = allConstants && expr.expression.constant;
			});
			ast.constant = allConstants;
			break;
		case AST.Literal:
			ast.constant = true;
			ast.toWatch = [];
			break;
		case AST.UnaryExpression:
			findConstantAndWatchExpressions(ast.argument, $filter);
			ast.constant = ast.argument.constant;
			ast.toWatch = ast.argument.toWatch;
			break;
		case AST.BinaryExpression:
			findConstantAndWatchExpressions(ast.left, $filter);
			findConstantAndWatchExpressions(ast.right, $filter);
			ast.constant = ast.left.constant && ast.right.constant;
			ast.toWatch = ast.left.toWatch.concat(ast.right.toWatch);
			break;
		case AST.LogicalExpression:
			findConstantAndWatchExpressions(ast.left, $filter);
			findConstantAndWatchExpressions(ast.right, $filter);
			ast.constant = ast.left.constant && ast.right.constant;
			ast.toWatch = ast.constant ? [] : [ast];
			break;
		case AST.ConditionalExpression:
			findConstantAndWatchExpressions(ast.test, $filter);
			findConstantAndWatchExpressions(ast.alternate, $filter);
			findConstantAndWatchExpressions(ast.consequent, $filter);
			ast.constant =
				ast.test.constant && ast.alternate.constant && ast.consequent.constant;
			ast.toWatch = ast.constant ? [] : [ast];
			break;
		case AST.Identifier:
			ast.constant = false;
			ast.toWatch = [ast];
			break;
		case AST.MemberExpression:
			findConstantAndWatchExpressions(ast.object, $filter);
			if (ast.computed) {
				findConstantAndWatchExpressions(ast.property, $filter);
			}
			ast.constant =
				ast.object.constant && (!ast.computed || ast.property.constant);
			ast.toWatch = [ast];
			break;
		case AST.CallExpression:
			isStatelessFilter = ast.filter
				? isStateless($filter, ast.callee.name)
				: false;
			allConstants = isStatelessFilter;
			argsToWatch = [];
			forEach(ast.arguments, function (expr) {
				findConstantAndWatchExpressions(expr, $filter);
				allConstants = allConstants && expr.constant;
				if (!expr.constant) {
					argsToWatch.push.apply(argsToWatch, expr.toWatch);
				}
			});
			ast.constant = allConstants;
			ast.toWatch = isStatelessFilter ? argsToWatch : [ast];
			break;
		case AST.AssignmentExpression:
			findConstantAndWatchExpressions(ast.left, $filter);
			findConstantAndWatchExpressions(ast.right, $filter);
			ast.constant = ast.left.constant && ast.right.constant;
			ast.toWatch = [ast];
			break;
		case AST.ArrayExpression:
			allConstants = true;
			argsToWatch = [];
			forEach(ast.elements, function (expr) {
				findConstantAndWatchExpressions(expr, $filter);
				allConstants = allConstants && expr.constant;
				if (!expr.constant) {
					argsToWatch.push.apply(argsToWatch, expr.toWatch);
				}
			});
			ast.constant = allConstants;
			ast.toWatch = argsToWatch;
			break;
		case AST.ObjectExpression:
			allConstants = true;
			argsToWatch = [];
			forEach(ast.properties, function (property) {
				findConstantAndWatchExpressions(property.value, $filter);
				allConstants =
					allConstants && property.value.constant && !property.computed;
				if (!property.value.constant) {
					argsToWatch.push.apply(argsToWatch, property.value.toWatch);
				}
			});
			ast.constant = allConstants;
			ast.toWatch = argsToWatch;
			break;
		case AST.ThisExpression:
			ast.constant = false;
			ast.toWatch = [];
			break;
		case AST.LocalsExpression:
			ast.constant = false;
			ast.toWatch = [];
			break;
	}
}

function getInputs(body) {
	if (body.length !== 1) return;
	var lastExpression = body[0].expression;
	var candidate = lastExpression.toWatch;
	if (candidate.length !== 1) return candidate;
	return candidate[0] !== lastExpression ? candidate : undefined;
}

function isAssignable(ast) {
	return ast.type === AST.Identifier || ast.type === AST.MemberExpression;
}

function assignableAST(ast) {
	if (ast.body.length === 1 && isAssignable(ast.body[0].expression)) {
		return {
			type: AST.AssignmentExpression,
			left: ast.body[0].expression,
			right: { type: AST.NGValueParameter },
			operator: "=",
		};
	}
}

function isLiteral(ast) {
	return (
		ast.body.length === 0 ||
		(ast.body.length === 1 &&
			(ast.body[0].expression.type === AST.Literal ||
				ast.body[0].expression.type === AST.ArrayExpression ||
				ast.body[0].expression.type === AST.ObjectExpression))
	);
}

function isConstant(ast) {
	return ast.constant;
}

function ASTCompiler(astBuilder, $filter) {
	this.astBuilder = astBuilder;
	this.$filter = $filter;
}

ASTCompiler.prototype = {
	compile: function (expression) {
		var self = this;
		var ast = this.astBuilder.ast(expression);
		this.state = {
			nextId: 0,
			filters: {},
			fn: { vars: [], body: [], own: {} },
			assign: { vars: [], body: [], own: {} },
			inputs: [],
		};
		findConstantAndWatchExpressions(ast, self.$filter);
		var extra = "";
		var assignable;
		this.stage = "assign";
		if ((assignable = assignableAST(ast))) {
			this.state.computing = "assign";
			var result = this.nextId();
			this.recurse(assignable, result);
			this.return_(result);
			extra = "fn.assign=" + this.generateFunction("assign", "s,v,l");
		}
		var toWatch = getInputs(ast.body);
		self.stage = "inputs";
		forEach(toWatch, function (watch, key) {
			var fnKey = "fn" + key;
			self.state[fnKey] = { vars: [], body: [], own: {} };
			self.state.computing = fnKey;
			var intoId = self.nextId();
			self.recurse(watch, intoId);
			self.return_(intoId);
			self.state.inputs.push(fnKey);
			watch.watchId = key;
		});
		this.state.computing = "fn";
		this.stage = "main";
		this.recurse(ast);
		var fnString =
			// The build and minification steps remove the string "use strict" from the code, but this is done using a regex.
			// This is a workaround for this until we do a better job at only removing the prefix only when we should.
			'"' +
			this.USE +
			" " +
			this.STRICT +
			'";\n' +
			this.filterPrefix() +
			"var fn=" +
			this.generateFunction("fn", "s,l,a,i") +
			extra +
			this.watchFns() +
			"return fn;";
		// eslint-disable-next-line no-new-func
		var fn = new Function(
			"$filter",
			"getStringValue",
			"ifDefined",
			"plus",
			fnString
		)(this.$filter, getStringValue, ifDefined, plusFn);

		this.state = this.stage = undefined;
		fn.ast = ast;
		fn.literal = isLiteral(ast);
		fn.constant = isConstant(ast);
		return fn;
	},

	USE: "use",

	STRICT: "strict",

	watchFns: function () {
		var result = [];
		var fns = this.state.inputs;
		var self = this;
		forEach(fns, function (name) {
			result.push("var " + name + "=" + self.generateFunction(name, "s"));
		});
		if (fns.length) {
			result.push("fn.inputs=[" + fns.join(",") + "];");
		}
		return result.join("");
	},

	generateFunction: function (name, params) {
		return (
			"function(" +
			params +
			"){" +
			this.varsPrefix(name) +
			this.body(name) +
			"};"
		);
	},

	filterPrefix: function () {
		var parts = [];
		var self = this;
		forEach(this.state.filters, function (id, filter) {
			parts.push(id + "=$filter(" + self.escape(filter) + ")");
		});
		if (parts.length) return "var " + parts.join(",") + ";";
		return "";
	},

	varsPrefix: function (section) {
		return this.state[section].vars.length
			? "var " + this.state[section].vars.join(",") + ";"
			: "";
	},

	body: function (section) {
		return this.state[section].body.join("");
	},

	recurse: function (
		ast,
		intoId,
		nameId,
		recursionFn,
		create,
		skipWatchIdCheck
	) {
		var left,
			right,
			self = this,
			args,
			expression,
			computed;
		recursionFn = recursionFn || noop$2;
		if (!skipWatchIdCheck && isDefined(ast.watchId)) {
			intoId = intoId || this.nextId();
			this.if_(
				"i",
				this.lazyAssign(intoId, this.unsafeComputedMember("i", ast.watchId)),
				this.lazyRecurse(ast, intoId, nameId, recursionFn, create, true)
			);
			return;
		}

		switch (ast.type) {
			case AST.Program:
				forEach(ast.body, function (expression, pos) {
					self.recurse(
						expression.expression,
						undefined,
						undefined,
						function (expr) {
							right = expr;
						}
					);
					if (pos !== ast.body.length - 1) {
						self.current().body.push(right, ";");
					} else {
						self.return_(right);
					}
				});
				break;
			case AST.Literal:
				expression = this.escape(ast.value);
				this.assign(intoId, expression);
				recursionFn(intoId || expression);
				break;
			case AST.UnaryExpression:
				this.recurse(ast.argument, undefined, undefined, function (expr) {
					right = expr;
				});
				expression = ast.operator + "(" + this.ifDefined(right, 0) + ")";
				this.assign(intoId, expression);
				recursionFn(expression);
				break;
			case AST.BinaryExpression:
				this.recurse(ast.left, undefined, undefined, function (expr) {
					left = expr;
				});
				this.recurse(ast.right, undefined, undefined, function (expr) {
					right = expr;
				});
				if (ast.operator === "+") {
					expression = this.plus(left, right);
				} else if (ast.operator === "-") {
					expression =
						this.ifDefined(left, 0) + ast.operator + this.ifDefined(right, 0);
				} else {
					expression = "(" + left + ")" + ast.operator + "(" + right + ")";
				}
				this.assign(intoId, expression);
				recursionFn(expression);
				break;
			case AST.LogicalExpression:
				intoId = intoId || this.nextId();
				self.recurse(ast.left, intoId);
				self.if_(
					ast.operator === "&&" ? intoId : self.not(intoId),
					self.lazyRecurse(ast.right, intoId)
				);
				recursionFn(intoId);
				break;
			case AST.ConditionalExpression:
				intoId = intoId || this.nextId();
				self.recurse(ast.test, intoId);
				self.if_(
					intoId,
					self.lazyRecurse(ast.alternate, intoId),
					self.lazyRecurse(ast.consequent, intoId)
				);
				recursionFn(intoId);
				break;
			case AST.Identifier:
				intoId = intoId || this.nextId();
				var inAssignment = self.current().inAssignment;
				if (nameId) {
					if (inAssignment) {
						nameId.context = this.assign(this.nextId(), "s");
					} else {
						nameId.context =
							self.stage === "inputs"
								? "s"
								: this.assign(
										this.nextId(),
										this.getHasOwnProperty("l", ast.name) + "?l:s"
								  );
					}
					nameId.computed = false;
					nameId.name = ast.name;
				}
				self.if_(
					self.stage === "inputs" ||
						self.not(self.getHasOwnProperty("l", ast.name)),
					function () {
						self.if_(
							self.stage === "inputs" ||
								self.and_(
									"s",
									self.or_(
										self.isNull(self.nonComputedMember("s", ast.name)),
										self.hasOwnProperty_("s", ast.name)
									)
								),
							function () {
								if (create && create !== 1) {
									self.if_(
										self.isNull(self.nonComputedMember("s", ast.name)),
										self.lazyAssign(self.nonComputedMember("s", ast.name), "{}")
									);
								}
								self.assign(intoId, self.nonComputedMember("s", ast.name));
							}
						);
					},
					intoId &&
						self.lazyAssign(intoId, self.nonComputedMember("l", ast.name))
				);
				recursionFn(intoId);
				break;
			case AST.MemberExpression:
				left = (nameId && (nameId.context = this.nextId())) || this.nextId();
				intoId = intoId || this.nextId();
				self.recurse(
					ast.object,
					left,
					undefined,
					function () {
						var member = null;
						var inAssignment = self.current().inAssignment;
						if (ast.computed) {
							right = self.nextId();
							if (inAssignment || self.state.computing === "assign") {
								member = self.unsafeComputedMember(left, right);
							} else {
								member = self.computedMember(left, right);
							}
						} else {
							if (inAssignment || self.state.computing === "assign") {
								member = self.unsafeNonComputedMember(left, ast.property.name);
							} else {
								member = self.nonComputedMember(left, ast.property.name);
							}
							right = ast.property.name;
						}

						if (ast.computed) {
							if (ast.property.type === AST.Literal) {
								self.recurse(ast.property, right);
							}
						}
						self.if_(
							self.and_(
								self.notNull(left),
								self.or_(
									self.isNull(member),
									self.hasOwnProperty_(left, right, ast.computed)
								)
							),
							function () {
								if (ast.computed) {
									if (ast.property.type !== AST.Literal) {
										self.recurse(ast.property, right);
									}
									if (create && create !== 1) {
										self.if_(self.not(member), self.lazyAssign(member, "{}"));
									}
									self.assign(intoId, member);
									if (nameId) {
										nameId.computed = true;
										nameId.name = right;
									}
								} else {
									if (create && create !== 1) {
										self.if_(
											self.isNull(member),
											self.lazyAssign(member, "{}")
										);
									}
									self.assign(intoId, member);
									if (nameId) {
										nameId.computed = false;
										nameId.name = ast.property.name;
									}
								}
							},
							function () {
								self.assign(intoId, "undefined");
							}
						);
						recursionFn(intoId);
					},
					!!create
				);
				break;
			case AST.CallExpression:
				intoId = intoId || this.nextId();
				if (ast.filter) {
					right = self.filter(ast.callee.name);
					args = [];
					forEach(ast.arguments, function (expr) {
						var argument = self.nextId();
						self.recurse(expr, argument);
						args.push(argument);
					});
					expression = right + ".call(" + right + "," + args.join(",") + ")";
					self.assign(intoId, expression);
					recursionFn(intoId);
				} else {
					right = self.nextId();
					left = {};
					args = [];
					self.recurse(ast.callee, right, left, function () {
						self.if_(
							self.notNull(right),
							function () {
								forEach(ast.arguments, function (expr) {
									self.recurse(
										expr,
										ast.constant ? undefined : self.nextId(),
										undefined,
										function (argument) {
											args.push(argument);
										}
									);
								});
								if (left.name) {
									var x = self.member(left.context, left.name, left.computed);
									expression =
										"(" +
										x +
										" === null ? null : " +
										self.unsafeMember(left.context, left.name, left.computed) +
										".call(" +
										[left.context].concat(args).join(",") +
										"))";
								} else {
									expression = right + "(" + args.join(",") + ")";
								}
								self.assign(intoId, expression);
							},
							function () {
								self.assign(intoId, "undefined");
							}
						);
						recursionFn(intoId);
					});
				}
				break;
			case AST.AssignmentExpression:
				right = this.nextId();
				left = {};
				self.current().inAssignment = true;
				this.recurse(
					ast.left,
					undefined,
					left,
					function () {
						self.if_(
							self.and_(
								self.notNull(left.context),
								self.or_(
									self.hasOwnProperty_(left.context, left.name),
									self.isNull(
										self.member(left.context, left.name, left.computed)
									)
								)
							),
							function () {
								self.recurse(ast.right, right);
								expression =
									self.member(left.context, left.name, left.computed) +
									ast.operator +
									right;
								self.assign(intoId, expression);
								recursionFn(intoId || expression);
							}
						);
						self.current().inAssignment = false;
						self.recurse(ast.right, right);
						self.current().inAssignment = true;
					},
					1
				);
				self.current().inAssignment = false;
				break;
			case AST.ArrayExpression:
				args = [];
				forEach(ast.elements, function (expr) {
					self.recurse(
						expr,
						ast.constant ? undefined : self.nextId(),
						undefined,
						function (argument) {
							args.push(argument);
						}
					);
				});
				expression = "[" + args.join(",") + "]";
				this.assign(intoId, expression);
				recursionFn(intoId || expression);
				break;
			case AST.ObjectExpression:
				args = [];
				computed = false;
				forEach(ast.properties, function (property) {
					if (property.computed) {
						computed = true;
					}
				});
				if (computed) {
					intoId = intoId || this.nextId();
					this.assign(intoId, "{}");
					forEach(ast.properties, function (property) {
						if (property.computed) {
							left = self.nextId();
							self.recurse(property.key, left);
						} else {
							left =
								property.key.type === AST.Identifier
									? property.key.name
									: "" + property.key.value;
						}
						right = self.nextId();
						self.recurse(property.value, right);
						self.assign(
							self.unsafeMember(intoId, left, property.computed),
							right
						);
					});
				} else {
					forEach(ast.properties, function (property) {
						self.recurse(
							property.value,
							ast.constant ? undefined : self.nextId(),
							undefined,
							function (expr) {
								args.push(
									self.escape(
										property.key.type === AST.Identifier
											? property.key.name
											: "" + property.key.value
									) +
										":" +
										expr
								);
							}
						);
					});
					expression = "{" + args.join(",") + "}";
					this.assign(intoId, expression);
				}
				recursionFn(intoId || expression);
				break;
			case AST.ThisExpression:
				this.assign(intoId, "s");
				recursionFn(intoId || "s");
				break;
			case AST.LocalsExpression:
				this.assign(intoId, "l");
				recursionFn(intoId || "l");
				break;
			case AST.NGValueParameter:
				this.assign(intoId, "v");
				recursionFn(intoId || "v");
				break;
		}
	},

	getHasOwnProperty: function (element, property) {
		var key = element + "." + property;
		var own = this.current().own;
		if (!own.hasOwnProperty(key)) {
			own[key] = this.nextId(
				false,
				element + "&&(" + this.escape(property) + " in " + element + ")"
			);
		}
		return own[key];
	},

	assign: function (id, value) {
		if (!id) return;
		this.current().body.push(id, "=", value, ";");
		return id;
	},

	filter: function (filterName) {
		if (!this.state.filters.hasOwnProperty(filterName)) {
			this.state.filters[filterName] = this.nextId(true);
		}
		return this.state.filters[filterName];
	},

	ifDefined: function (id, defaultValue) {
		return "ifDefined(" + id + "," + this.escape(defaultValue) + ")";
	},

	plus: function (left, right) {
		return "plus(" + left + "," + right + ")";
	},

	return_: function (id) {
		this.current().body.push("return ", id, ";");
	},

	if_: function (test, alternate, consequent) {
		if (test === true) {
			alternate();
		} else {
			var body = this.current().body;
			body.push("if(", test, "){");
			alternate();
			body.push("}");
			if (consequent) {
				body.push("else{");
				consequent();
				body.push("}");
			}
		}
	},
	or_: function (expr1, expr2) {
		return "(" + expr1 + ") || (" + expr2 + ")";
	},
	hasOwnProperty_: function (obj, prop, computed) {
		if (computed) {
			return "(Object.prototype.hasOwnProperty.call(" + obj + "," + prop + "))";
		} else {
			return (
				"(Object.prototype.hasOwnProperty.call(" + obj + ",'" + prop + "'))"
			);
		}
	},
	and_: function (expr1, expr2) {
		return "(" + expr1 + ") && (" + expr2 + ")";
	},
	not: function (expression) {
		return "!(" + expression + ")";
	},

	isNull: function (expression) {
		return expression + "==null";
	},

	notNull: function (expression) {
		return expression + "!=null";
	},

	nonComputedMember: function (left, right) {
		var SAFE_IDENTIFIER = /^[$_a-zA-Z][$_a-zA-Z0-9]*$/;
		var UNSAFE_CHARACTERS = /[^$_a-zA-Z0-9]/g;
		var expr = "";
		if (SAFE_IDENTIFIER.test(right)) {
			expr = left + "." + right;
		} else {
			right = right.replace(UNSAFE_CHARACTERS, this.stringEscapeFn);
			expr = left + '["' + right + '"]';
		}

		return expr;
	},

	unsafeComputedMember: function (left, right) {
		return left + "[" + right + "]";
	},
	unsafeNonComputedMember: function (left, right) {
		return this.nonComputedMember(left, right);
	},

	computedMember: function (left, right) {
		if (this.state.computing === "assign") {
			return this.unsafeComputedMember(left, right);
		}
		// return left + "[" + right + "]";
		return (
			"(" +
			left +
			".hasOwnProperty(" +
			right +
			") ? " +
			left +
			"[" +
			right +
			"] : null)"
		);
	},

	unsafeMember: function (left, right, computed) {
		if (computed) return this.unsafeComputedMember(left, right);
		return this.unsafeNonComputedMember(left, right);
	},

	member: function (left, right, computed) {
		if (computed) return this.computedMember(left, right);
		return this.nonComputedMember(left, right);
	},

	getStringValue: function (item) {
		this.assign(item, "getStringValue(" + item + ")");
	},

	lazyRecurse: function (
		ast,
		intoId,
		nameId,
		recursionFn,
		create,
		skipWatchIdCheck
	) {
		var self = this;
		return function () {
			self.recurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck);
		};
	},

	lazyAssign: function (id, value) {
		var self = this;
		return function () {
			self.assign(id, value);
		};
	},

	stringEscapeRegex: /[^ a-zA-Z0-9]/g,

	stringEscapeFn: function (c) {
		return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
	},

	escape: function (value) {
		if (isString(value))
			return (
				"'" + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'"
			);
		if (isNumber(value)) return value.toString();
		if (value === true) return "true";
		if (value === false) return "false";
		if (value === null) return "null";
		if (typeof value === "undefined") return "undefined";

		throw $parseMinErr("esc", "IMPOSSIBLE");
	},

	nextId: function (skip, init) {
		var id = "v" + this.state.nextId++;
		if (!skip) {
			this.current().vars.push(id + (init ? "=" + init : ""));
		}
		return id;
	},

	current: function () {
		return this.state[this.state.computing];
	},
};

function ASTInterpreter(astBuilder, $filter) {
	this.astBuilder = astBuilder;
	this.$filter = $filter;
}

ASTInterpreter.prototype = {
	compile: function (expression) {
		var self = this;
		var ast = this.astBuilder.ast(expression);
		findConstantAndWatchExpressions(ast, self.$filter);
		var assignable;
		var assign;
		if ((assignable = assignableAST(ast))) {
			assign = this.recurse(assignable);
		}
		var toWatch = getInputs(ast.body);
		var inputs;
		if (toWatch) {
			inputs = [];
			forEach(toWatch, function (watch, key) {
				var input = self.recurse(watch);
				watch.input = input;
				inputs.push(input);
				watch.watchId = key;
			});
		}
		var expressions = [];
		forEach(ast.body, function (expression) {
			expressions.push(self.recurse(expression.expression));
		});
		var fn =
			ast.body.length === 0
				? noop$2
				: ast.body.length === 1
				? expressions[0]
				: function (scope, locals) {
						var lastValue;
						forEach(expressions, function (exp) {
							lastValue = exp(scope, locals);
						});
						return lastValue;
				  };

		if (assign) {
			fn.assign = function (scope, value, locals) {
				return assign(scope, locals, value);
			};
		}
		if (inputs) {
			fn.inputs = inputs;
		}
		fn.ast = ast;
		fn.literal = isLiteral(ast);
		fn.constant = isConstant(ast);
		return fn;
	},

	recurse: function (ast, context, create) {
		var left,
			right,
			self = this,
			args;
		if (ast.input) {
			return this.inputs(ast.input, ast.watchId);
		}
		switch (ast.type) {
			case AST.Literal:
				return this.value(ast.value, context);
			case AST.UnaryExpression:
				right = this.recurse(ast.argument);
				return this["unary" + ast.operator](right, context);
			case AST.BinaryExpression:
				left = this.recurse(ast.left);
				right = this.recurse(ast.right);
				return this["binary" + ast.operator](left, right, context);
			case AST.LogicalExpression:
				left = this.recurse(ast.left);
				right = this.recurse(ast.right);
				return this["binary" + ast.operator](left, right, context);
			case AST.ConditionalExpression:
				return this["ternary?:"](
					this.recurse(ast.test),
					this.recurse(ast.alternate),
					this.recurse(ast.consequent),
					context
				);
			case AST.Identifier:
				return self.identifier(ast.name, context, create);
			case AST.MemberExpression:
				left = this.recurse(ast.object, false, !!create);
				if (!ast.computed) {
					right = ast.property.name;
				}
				if (ast.computed) right = this.recurse(ast.property);

				return ast.computed
					? this.computedMember(left, right, context, create)
					: this.nonComputedMember(left, right, context, create);
			case AST.CallExpression:
				args = [];
				forEach(ast.arguments, function (expr) {
					args.push(self.recurse(expr));
				});
				if (ast.filter) right = this.$filter(ast.callee.name);
				if (!ast.filter) right = this.recurse(ast.callee, true);
				return ast.filter
					? function (scope, locals, assign, inputs) {
							var values = [];
							for (var i = 0; i < args.length; ++i) {
								values.push(args[i](scope, locals, assign, inputs));
							}
							var value = right.apply(undefined, values, inputs);
							return context
								? { context: undefined, name: undefined, value: value }
								: value;
					  }
					: function (scope, locals, assign, inputs) {
							var rhs = right(scope, locals, assign, inputs);
							var value;
							if (rhs.value != null) {
								var values = [];
								for (var i = 0; i < args.length; ++i) {
									values.push(args[i](scope, locals, assign, inputs));
								}
								value = rhs.value.apply(rhs.context, values);
							}
							return context ? { value: value } : value;
					  };
			case AST.AssignmentExpression:
				left = this.recurse(ast.left, true, 1);
				right = this.recurse(ast.right);
				return function (scope, locals, assign, inputs) {
					var lhs = left(scope, false, assign, inputs);
					var rhs = right(scope, locals, assign, inputs);
					lhs.context[lhs.name] = rhs;
					return context ? { value: rhs } : rhs;
				};
			case AST.ArrayExpression:
				args = [];
				forEach(ast.elements, function (expr) {
					args.push(self.recurse(expr));
				});
				return function (scope, locals, assign, inputs) {
					var value = [];
					for (var i = 0; i < args.length; ++i) {
						value.push(args[i](scope, locals, assign, inputs));
					}
					return context ? { value: value } : value;
				};
			case AST.ObjectExpression:
				args = [];
				forEach(ast.properties, function (property) {
					if (property.computed) {
						args.push({
							key: self.recurse(property.key),
							computed: true,
							value: self.recurse(property.value),
						});
					} else {
						args.push({
							key:
								property.key.type === AST.Identifier
									? property.key.name
									: "" + property.key.value,
							computed: false,
							value: self.recurse(property.value),
						});
					}
				});
				return function (scope, locals, assign, inputs) {
					var value = {};
					for (var i = 0; i < args.length; ++i) {
						if (args[i].computed) {
							value[args[i].key(scope, locals, assign, inputs)] = args[i].value(
								scope,
								locals,
								assign,
								inputs
							);
						} else {
							value[args[i].key] = args[i].value(scope, locals, assign, inputs);
						}
					}
					return context ? { value: value } : value;
				};
			case AST.ThisExpression:
				return function (scope) {
					return context ? { value: scope } : scope;
				};
			case AST.LocalsExpression:
				return function (scope, locals) {
					return context ? { value: locals } : locals;
				};
			case AST.NGValueParameter:
				return function (scope, locals, assign) {
					return context ? { value: assign } : assign;
				};
		}
	},

	"unary+": function (argument, context) {
		return function (scope, locals, assign, inputs) {
			var arg = argument(scope, locals, assign, inputs);
			if (isDefined(arg)) {
				arg = +arg;
			} else {
				arg = 0;
			}
			return context ? { value: arg } : arg;
		};
	},
	"unary-": function (argument, context) {
		return function (scope, locals, assign, inputs) {
			var arg = argument(scope, locals, assign, inputs);
			if (isDefined(arg)) {
				arg = -arg;
			} else {
				arg = -0;
			}
			return context ? { value: arg } : arg;
		};
	},
	"unary!": function (argument, context) {
		return function (scope, locals, assign, inputs) {
			var arg = !argument(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary+": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			var lhs = left(scope, locals, assign, inputs);
			var rhs = right(scope, locals, assign, inputs);
			var arg = plusFn(lhs, rhs);
			return context ? { value: arg } : arg;
		};
	},
	"binary-": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			var lhs = left(scope, locals, assign, inputs);
			var rhs = right(scope, locals, assign, inputs);
			var arg = (isDefined(lhs) ? lhs : 0) - (isDefined(rhs) ? rhs : 0);
			return context ? { value: arg } : arg;
		};
	},
	"binary*": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) *
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary/": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) /
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary%": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) %
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary===": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) ===
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary!==": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) !==
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary==": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			// eslint-disable-next-line eqeqeq
			var arg =
				left(scope, locals, assign, inputs) ==
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary!=": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			// eslint-disable-next-line eqeqeq
			var arg =
				left(scope, locals, assign, inputs) !=
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary<": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) <
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary>": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) >
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary<=": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) <=
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary>=": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) >=
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary&&": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) &&
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"binary||": function (left, right, context) {
		return function (scope, locals, assign, inputs) {
			var arg =
				left(scope, locals, assign, inputs) ||
				right(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	"ternary?:": function (test, alternate, consequent, context) {
		return function (scope, locals, assign, inputs) {
			var arg = test(scope, locals, assign, inputs)
				? alternate(scope, locals, assign, inputs)
				: consequent(scope, locals, assign, inputs);
			return context ? { value: arg } : arg;
		};
	},
	value: function (value, context) {
		return function () {
			return context
				? { context: undefined, name: undefined, value: value }
				: value;
		};
	},
	identifier: function (name, context, create) {
		return function (scope, locals, assign, inputs) {
			var base = locals && name in locals ? locals : scope;
			if (create && create !== 1 && base && base[name] == null) {
				base[name] = {};
			}
			var value = base ? base[name] : undefined;
			if (context) {
				return { context: base, name: name, value: value };
			} else {
				return value;
			}
		};
	},
	computedMember: function (left, right, context, create) {
		return function (scope, locals, assign, inputs) {
			var lhs = left(scope, locals, assign, inputs);
			var rhs;
			var value;
			if (lhs != null) {
				rhs = right(scope, locals, assign, inputs);
				rhs = getStringValue(rhs);
				if (create && create !== 1) {
					if (lhs && !lhs[rhs]) {
						lhs[rhs] = {};
					}
				}
				if (Object.prototype.hasOwnProperty.call(lhs, rhs)) {
					value = lhs[rhs];
				}
			}
			if (context) {
				return { context: lhs, name: rhs, value: value };
			} else {
				return value;
			}
		};
	},
	nonComputedMember: function (left, right, context, create) {
		return function (scope, locals, assign, inputs) {
			var lhs = left(scope, locals, assign, inputs);
			if (create && create !== 1) {
				if (lhs && lhs[right] == null) {
					lhs[right] = {};
				}
			}
			var value = undefined;
			if (lhs != null && Object.prototype.hasOwnProperty.call(lhs, right)) {
				value = lhs[right];
			}

			if (context) {
				return { context: lhs, name: right, value: value };
			} else {
				return value;
			}
		};
	},
	inputs: function (input, watchId) {
		return function (scope, value, locals, inputs) {
			if (inputs) return inputs[watchId];
			return input(scope, value, locals);
		};
	},
};

/**
 * @constructor
 */
var Parser$1 = function Parser(lexer, $filter, options) {
	this.lexer = lexer;
	this.$filter = $filter;
	this.options = options;
	this.ast = new AST(lexer, options);
	this.astCompiler = options.csp
		? new ASTInterpreter(this.ast, $filter)
		: new ASTCompiler(this.ast, $filter);
};

Parser$1.prototype = {
	constructor: Parser$1,

	parse: function (text) {
		return this.astCompiler.compile(text);
	},
};

parse$1.Lexer = Lexer$1;
parse$1.Parser = Parser$1;

var parse = parse$1;

var filters = {};
var Lexer = parse.Lexer;
var Parser = parse.Parser;
/**
 * Compiles src and returns a function that executes src on a target object.
 * The compiled function is cached under compile.cache[src] to speed up further calls.
 *
 * @param {string} src
 * @returns {function}
 */
function compile(src, lexerOptions) {
	lexerOptions = lexerOptions || {};

	var cached;

	if (typeof src !== "string") {
		throw new TypeError(
			"src must be a string, instead saw '" + typeof src + "'"
		);
	}
	var parserOptions = {
		csp: false, // noUnsafeEval,
		literals: {
			// defined at: function $ParseProvider() {
			true: true,
			false: false,
			null: null,
			/*eslint no-undefined: 0*/
			undefined: undefined,
			/* eslint: no-undefined: 1  */
		},
	};

	var lexer = new Lexer(lexerOptions);
	var parser = new Parser(
		lexer,
		function getFilter(name) {
			return filters[name];
		},
		parserOptions
	);

	if (!compile.cache) {
		return parser.parse(src);
	}

	cached = compile.cache[src];
	if (!cached) {
		cached = compile.cache[src] = parser.parse(src);
	}

	return cached;
}

/**
 * A cache containing all compiled functions. The src is used as key.
 * Set this on false to disable the cache.
 *
 * @type {object}
 */
compile.cache = Object.create(null);

main.Lexer = Lexer;
main.Parser = Parser;
main.compile = compile;
main.filters = filters;

/**
 * Values I want to reference from anywhere
 * @typedef {Object} GlobalsObject
 * @property {State} state
 * @property {import("./data").Data} data
 * @property {import("./components/actions").Actions} actions
 * @property {TreeBase} tree
 * @property {import('./components/layout').Layout} layout
 * @property {import('./components/access/pattern').PatternList} patterns
 * @property {import('./components/access/cues').CueList} cues
 * @property {import('./components/access/method').MethodChooser} method
 * @property {import('./components/monitor').Monitor} monitor
 * @property {import('./components/toolbar').ToolBar} toolbar
 * @property {import('./components/designer').Designer} designer
 * @property {import('./components/errors').Messages} error
 * @property {function():Promise<void>} restart
 */

/** @type {GlobalsObject} */
// @ts-ignore Object missing properties
const Globals = {}; // values are supplied in start.js

/** @param {function(string, string): string} f */
function updateString(f) {
  /** @param {string} value */
  return function (value) {
    /** @param {string | undefined} old */
    return function (old) {
      return f(old || "", value);
    };
  };
}
/** @param {function(number, number): number} f */
function updateNumber(f) {
  /** @param {number} value */
  return function (value) {
    /** @param {number | undefined} old */
    return function (old) {
      return f(old || 0, value);
    };
  };
}
const Functions = {
  increment: updateNumber((old, value) => old + value),
  add_word: updateString((old, value) => old + value + " "),
  add_letter: updateString((old, value) => old + value),
  complete: updateString((old, value) => {
    if (old.length == 0 || old.endsWith(" ")) {
      return old + value;
    } else {
      return old.replace(/\w+$/, value);
    }
  }),
  replace_last: updateString((old, value) => old.replace(/\w*\s*$/, value)),
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
  exp = exp.replaceAll(/(?<![=<>!])=/g, "==");
  // translate words
  exp = exp.replaceAll(/(?<!['"])[#](\w+)/g, "_$1");
  return exp;
}

/**
 * Cleanup access to state and data
 *
 * @param {State} state
 * @param {Row} data
 * @returns {function(string): any}
 */
function access(state, data) {
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
const accessed = new Map();

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
      return Object.getOwnPropertyDescriptor(target.data, prop.slice(1));
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
function compileExpression(expression) {
  const te = translate(expression);
  try {
    const exp = main.compile(te);
    /** @param {EvalContext} context */
    return [
      (context = {}) => {
        let states =
          "states" in context
            ? { ...Globals.state.values, ...context.states }
            : Globals.state.values;
        let data = context.data ?? [];
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

/*
 * Bang color names from http://www.procato.com/rgb+index/?csv
 */
const ColorNames = {
  white: "#ffffff",
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
  yellow: "#ffff00",
  magenta: "#ff00ff",
  cyan: "#00ffff",
  black: "#000000",
  "pinkish white": "#fff6f6",
  "very pale pink": "#ffe2e2",
  "pale pink": "#ffc2c2",
  "light pink": "#ff9e9e",
  "light brilliant red": "#ff6565",
  "luminous vivid red": "#ff0000",
  "pinkish gray": "#e7dada",
  "pale grayish pink": "#e7b8b8",
  pink: "#e78b8b",
  "brilliant red": "#e75151",
  "vivid red": "#e70000",
  "reddish gray": "#a89c9c",
  "grayish red": "#a87d7d",
  "moderate red": "#a84a4a",
  "strong red": "#a80000",
  "reddish brownish gray": "#595353",
  "dark grayish reddish brown": "#594242",
  "reddish brown": "#592727",
  "deep reddish brown": "#590000",
  "reddish brownish black": "#1d1a1a",
  "very reddish brown": "#1d1111",
  "very deep reddish brown": "#1d0000",
  "pale scarlet": "#ffc9c2",
  "very light scarlet": "#ffaa9e",
  "light brilliant scarlet": "#ff7865",
  "luminous vivid scarlet": "#ff2000",
  "light scarlet": "#e7968b",
  "brilliant scarlet": "#e76451",
  "vivid scarlet": "#e71d00",
  "moderate scarlet": "#a8554a",
  "strong scarlet": "#a81500",
  "dark scarlet": "#592d27",
  "deep scarlet": "#590b00",
  "very pale vermilion": "#ffe9e2",
  "pale vermilion": "#ffd1c2",
  "very light vermilion": "#ffb69e",
  "light brilliant vermilion": "#ff8b65",
  "luminous vivid vermilion": "#ff4000",
  "pale, light grayish vermilion": "#e7c4b8",
  "light vermilion": "#e7a28b",
  "brilliant vermilion": "#e77751",
  "vivid vermilion": "#e73a00",
  "grayish vermilion": "#a8887d",
  "moderate vermilion": "#a8614a",
  "strong vermilion": "#a82a00",
  "dark grayish vermilion": "#594842",
  "dark vermilion": "#593427",
  "deep vermilion": "#591600",
  "pale tangelo": "#ffd9c2",
  "very light tangelo": "#ffc29e",
  "light brilliant tangelo": "#ff9f65",
  "luminous vivid tangelo": "#ff6000",
  "light tangelo": "#e7ae8b",
  "brilliant tangelo": "#e78951",
  "vivid tangelo": "#e75700",
  "moderate tangelo": "#a86d4a",
  "strong tangelo": "#a83f00",
  "dark tangelo": "#593a27",
  "deep tangelo": "#592100",
  "very pale orange": "#fff0e2",
  "pale orange": "#ffe0c2",
  "very light orange": "#ffcf9e",
  "light brilliant orange": "#ffb265",
  "luminous vivid orange": "#ff8000",
  "pale, light grayish brown": "#e7d0b8",
  "light orange": "#e7b98b",
  "brilliant orange": "#e79c51",
  "vivid orange": "#e77400",
  "grayish brown": "#a8937d",
  "moderate orange": "#a8794a",
  "strong orange": "#a85400",
  "dark grayish brown": "#594e42",
  brown: "#594027",
  "deep brown": "#592d00",
  "very brown": "#1d1711",
  "very deep brown": "#1d0e00",
  "pale gamboge": "#ffe8c2",
  "very light gamboge": "#ffdb9e",
  "light brilliant gamboge": "#ffc565",
  "luminous vivid gamboge": "#ff9f00",
  "light gamboge": "#e7c58b",
  "brilliant gamboge": "#e7af51",
  "vivid gamboge": "#e79100",
  "moderate gamboge": "#a8854a",
  "strong gamboge": "#a86900",
  "dark gamboge": "#594627",
  "deep gamboge": "#593800",
  "very pale amber": "#fff8e2",
  "pale amber": "#fff0c2",
  "very light amber": "#ffe79e",
  "light brilliant amber": "#ffd865",
  "luminous vivid amber": "#ffbf00",
  "pale, light grayish amber": "#e7dcb8",
  "light amber": "#e7d08b",
  "brilliant amber": "#e7c251",
  "vivid amber": "#e7ae00",
  "grayish amber": "#a89e7d",
  "moderate amber": "#a8914a",
  "strong amber": "#a87e00",
  "dark grayish amber": "#595442",
  "dark amber": "#594d27",
  "deep amber": "#594300",
  "pale gold": "#fff7c2",
  "very light gold": "#fff39e",
  "light brilliant gold": "#ffec65",
  "luminous vivid gold": "#ffdf00",
  "light gold": "#e7dc8b",
  "brilliant gold": "#e7d551",
  "vivid gold": "#e7ca00",
  "moderate gold": "#a89c4a",
  "strong gold": "#a89300",
  "dark gold": "#595327",
  "deep gold": "#594e00",
  "yellowish white": "#fffff6",
  "very pale yellow": "#ffffe2",
  "pale yellow": "#ffffc2",
  "very light yellow": "#ffff9e",
  "light brilliant yellow": "#ffff65",
  "luminous vivid yellow": "#ffff00",
  "light yellowish gray": "#e7e7da",
  "pale, light grayish olive": "#e7e7b8",
  "light yellow": "#e7e78b",
  "brilliant yellow": "#e7e751",
  "vivid yellow": "#e7e700",
  "yellowish gray": "#a8a89c",
  "grayish olive": "#a8a87d",
  "moderate olive": "#a8a84a",
  "strong olive": "#a8a800",
  "dark olivish gray": "#595953",
  "dark grayish olive": "#595942",
  "dark olive": "#595927",
  "deep olive": "#595900",
  "yellowish black": "#1d1d1a",
  "very dark olive": "#1d1d11",
  "very deep olive": "#1d1d00",
  "pale apple green": "#f7ffc2",
  "very light apple green": "#f3ff9e",
  "light brilliant apple green": "#ecff65",
  "luminous vivid apple green": "#dfff00",
  "light apple green": "#dce78b",
  "brilliant apple green": "#d5e751",
  "vivid apple green": "#cae700",
  "moderate apple green": "#9ca84a",
  "strong apple green": "#93a800",
  "dark apple green": "#535927",
  "deep apple green": "#4e5900",
  "very pale lime green": "#f8ffe2",
  "pale lime green": "#f0ffc2",
  "very light lime green": "#e7ff9e",
  "light brilliant lime green": "#d8ff65",
  "luminous vivid lime green": "#bfff00",
  "pale, light grayish lime green": "#dce7b8",
  "light lime green": "#d0e78b",
  "brilliant lime green": "#c2e751",
  "vivid lime green": "#aee700",
  "grayish lime green": "#9ea87d",
  "moderate lime green": "#91a84a",
  "strong lime green": "#7ea800",
  "dark grayish lime green": "#545942",
  "dark lime green": "#4d5927",
  "deep lime green": "#435900",
  "pale spring bud": "#e8ffc2",
  "very light spring bud": "#dbff9e",
  "light brilliant spring bud": "#c5ff65",
  "luminous vivid spring bud": "#9fff00",
  "light spring bud": "#c5e78b",
  "brilliant spring bud": "#afe751",
  "vivid spring bud": "#91e700",
  "moderate spring bud": "#85a84a",
  "strong spring bud": "#69a800",
  "dark spring bud": "#465927",
  "deep spring bud": "#385900",
  "very pale chartreuse green": "#f0ffe2",
  "pale chartreuse green": "#e0ffc2",
  "very light chartreuse green": "#cfff9e",
  "light brilliant chartreuse green": "#b2ff65",
  "luminous vivid chartreuse green": "#80ff00",
  "pale, light grayish chartreuse green": "#d0e7b8",
  "light chartreuse green": "#b9e78b",
  "brilliant chartreuse green": "#9ce751",
  "vivid chartreuse green": "#74e700",
  "grayish chartreuse green": "#93a87d",
  "moderate chartreuse green": "#79a84a",
  "strong chartreuse green": "#54a800",
  "dark grayish chartreuse green": "#4e5942",
  "dark chartreuse green": "#405927",
  "deep chartreuse green": "#2d5900",
  "very dark chartreuse green": "#171d11",
  "very deep chartreuse green": "#0e1d00",
  "pale pistachio": "#d9ffc2",
  "very light pistachio": "#c2ff9e",
  "light brilliant pistachio": "#9fff65",
  "luminous vivid pistachio": "#60ff00",
  "light pistachio": "#aee78b",
  "brilliant pistachio": "#89e751",
  "vivid pistachio": "#57e700",
  "moderate pistachio": "#6da84a",
  "strong pistachio": "#3fa800",
  "dark pistachio": "#3a5927",
  "deep pistachio": "#215900",
  "very pale harlequin": "#e9ffe2",
  "pale harlequin": "#d1ffc2",
  "very light harlequin": "#b6ff9e",
  "light brilliant harlequin": "#8bff65",
  "luminous vivid harlequin": "#40ff00",
  "pale, light grayish harlequin": "#c4e7b8",
  "light harlequin": "#a2e78b",
  "brilliant harlequin": "#77e751",
  "vivid harlequin": "#3ae700",
  "grayish harlequin": "#88a87d",
  "moderate harlequin": "#61a84a",
  "strong harlequin": "#2aa800",
  "dark grayish harlequin": "#485942",
  "dark harlequin": "#345927",
  "deep harlequin": "#165900",
  "pale sap green": "#c9ffc2",
  "very light sap green": "#aaff9e",
  "light brilliant sap green": "#78ff65",
  "luminous vivid sap green": "#20ff00",
  "light sap green": "#96e78b",
  "brilliant sap green": "#64e751",
  "vivid sap green": "#1de700",
  "moderate sap green": "#55a84a",
  "strong sap green": "#15a800",
  "dark sap green": "#2d5927",
  "deep sap green": "#0b5900",
  "greenish white": "#f6fff6",
  "very pale green": "#e2ffe2",
  "pale green": "#c2ffc2",
  "very light green": "#9eff9e",
  "light brilliant green": "#65ff65",
  "luminous vivid green": "#00ff00",
  "light greenish gray": "#dae7da",
  "pale, light grayish green": "#b8e7b8",
  "light green": "#8be78b",
  "brilliant green": "#51e751",
  "vivid green": "#00e700",
  "greenish gray": "#9ca89c",
  "grayish green": "#7da87d",
  "moderate green": "#4aa84a",
  "strong green": "#00a800",
  "dark greenish gray": "#535953",
  "dark grayish green": "#425942",
  "dark green": "#275927",
  "deep green": "#005900",
  "greenish black": "#1a1d1a",
  "very dark green": "#111d11",
  "very deep green": "#001d00",
  "pale emerald green": "#c2ffc9",
  "very light emerald green": "#9effaa",
  "light brilliant emerald green": "#65ff78",
  "luminous vivid emerald green": "#00ff20",
  "light emerald green": "#8be796",
  "brilliant emerald green": "#51e764",
  "vivid emerald green": "#00e71d",
  "moderate emerald green": "#4aa855",
  "strong emerald green": "#00a815",
  "dark emerald green": "#27592d",
  "deep emerald green": "#00590b",
  "very pale malachite green": "#e2ffe9",
  "pale malachite green": "#c2ffd1",
  "very light malachite green": "#9effb6",
  "light brilliant malachite green": "#65ff8b",
  "luminous vivid malachite green": "#00ff40",
  "pale, light grayish malachite green": "#b8e7c4",
  "light malachite green": "#8be7a2",
  "brilliant malachite green": "#51e777",
  "vivid malachite green": "#00e73a",
  "grayish malachite green": "#7da888",
  "moderate malachite green": "#4aa861",
  "strong malachite green": "#00a82a",
  "dark grayish malachite green": "#425948",
  "dark malachite green": "#275934",
  "deep malachite green": "#005916",
  "pale sea green": "#c2ffd9",
  "very light sea green": "#9effc2",
  "light brilliant sea green": "#65ff9f",
  "luminous vivid sea green": "#00ff60",
  "light sea green": "#8be7ae",
  "brilliant sea green": "#51e789",
  "vivid sea green": "#00e757",
  "moderate sea green": "#4aa86d",
  "strong sea green": "#00a83f",
  "dark sea green": "#27593a",
  "deep sea green": "#005921",
  "very pale spring green": "#e2fff0",
  "pale spring green": "#c2ffe0",
  "very light spring green": "#9effcf",
  "light brilliant spring green": "#65ffb2",
  "luminous vivid spring green": "#00ff80",
  "pale, light grayish spring green": "#b8e7d0",
  "light spring green": "#8be7b9",
  "brilliant spring green": "#51e79c",
  "vivid spring green": "#00e774",
  "grayish spring green": "#7da893",
  "moderate spring green": "#4aa879",
  "strong spring green": "#00a854",
  "dark grayish spring green": "#42594e",
  "dark spring green": "#275940",
  "deep spring green": "#00592d",
  "very dark spring green": "#111d17",
  "very deep spring green": "#001d0e",
  "pale aquamarine": "#c2ffe8",
  "very light aquamarine": "#9effdb",
  "light brilliant aquamarine": "#65ffc5",
  "luminous vivid aquamarine": "#00ff9f",
  "light aquamarine": "#8be7c5",
  "brilliant aquamarine": "#51e7af",
  "vivid aquamarine": "#00e791",
  "moderate aquamarine": "#4aa885",
  "strong aquamarine": "#00a869",
  "dark aquamarine": "#275946",
  "deep aquamarine": "#005938",
  "very pale turquoise": "#e2fff8",
  "pale turquoise": "#c2fff0",
  "very light turquoise": "#9effe7",
  "light brilliant turquoise": "#65ffd8",
  "luminous vivid turquoise": "#00ffbf",
  "pale, light grayish turquoise": "#b8e7dc",
  "light turquoise": "#8be7d0",
  "brilliant turquoise": "#51e7c2",
  "vivid turquoise": "#00e7ae",
  "grayish turquoise": "#7da89e",
  "moderate turquoise": "#4aa891",
  "strong turquoise": "#00a87e",
  "dark grayish turquoise": "#425954",
  "dark turquoise": "#27594d",
  "deep turquoise": "#005943",
  "pale opal": "#c2fff7",
  "very light opal": "#9efff3",
  "light brilliant opal": "#65ffec",
  "luminous vivid opal": "#00ffdf",
  "light opal": "#8be7dc",
  "brilliant opal": "#51e7d5",
  "vivid opal": "#00e7ca",
  "moderate opal": "#4aa89c",
  "strong opal": "#00a893",
  "dark opal": "#275953",
  "deep opal": "#00594e",
  "cyanish white": "#f6ffff",
  "very pale cyan": "#e2ffff",
  "pale cyan": "#c2ffff",
  "very light cyan": "#9effff",
  "light brilliant cyan": "#65ffff",
  "luminous vivid cyan": "#00ffff",
  "light cyanish gray": "#dae7e7",
  "pale, light grayish cyan": "#b8e7e7",
  "light cyan": "#8be7e7",
  "brilliant cyan": "#51e7e7",
  "vivid cyan": "#00e7e7",
  "cyanish gray": "#9ca8a8",
  "grayish cyan": "#7da8a8",
  "moderate cyan": "#4aa8a8",
  "strong cyan": "#00a8a8",
  "dark cyanish gray": "#535959",
  "dark grayish cyan": "#425959",
  "dark cyan": "#275959",
  "deep cyan": "#005959",
  "cyanish black": "#1a1d1d",
  "very dark cyan": "#111d1d",
  "very deep cyan": "#001d1d",
  "pale arctic blue": "#c2f7ff",
  "very light arctic blue": "#9ef3ff",
  "light brilliant arctic blue": "#65ecff",
  "luminous vivid arctic blue": "#00dfff",
  "light arctic blue": "#8bdce7",
  "brilliant arctic blue": "#51d5e7",
  "vivid arctic blue": "#00cae7",
  "moderate arctic blue": "#4a9ca8",
  "strong arctic blue": "#0093a8",
  "dark arctic blue": "#275359",
  "deep arctic blue": "#004e59",
  "very pale cerulean": "#e2f8ff",
  "pale cerulean": "#c2f0ff",
  "very light cerulean": "#9ee7ff",
  "light brilliant cerulean": "#65d8ff",
  "luminous vivid cerulean": "#00bfff",
  "pale, light grayish cerulean": "#b8dce7",
  "light cerulean": "#8bd0e7",
  "brilliant cerulean": "#51c2e7",
  "vivid cerulean": "#00aee7",
  "grayish cerulean": "#7d9ea8",
  "moderate cerulean": "#4a91a8",
  "strong cerulean": "#007ea8",
  "dark grayish cerulean": "#425459",
  "dark cerulean": "#274d59",
  "deep cerulean": "#004359",
  "pale cornflower blue": "#c2e8ff",
  "very light cornflower blue": "#9edbff",
  "light brilliant cornflower blue": "#65c5ff",
  "luminous vivid cornflower blue": "#009fff",
  "light cornflower blue": "#8bc5e7",
  "brilliant cornflower blue": "#51afe7",
  "vivid cornflower blue": "#0091e7",
  "moderate cornflower blue": "#4a85a8",
  "strong cornflower blue": "#0069a8",
  "dark cornflower blue": "#274659",
  "deep cornflower blue": "#003859",
  "very pale azure": "#e2f0ff",
  "pale azure": "#c2e0ff",
  "very light azure": "#9ecfff",
  "light brilliant azure": "#65b2ff",
  "luminous vivid azure": "#0080ff",
  "pale, light grayish azure": "#b8d0e7",
  "light azure": "#8bb9e7",
  "brilliant azure": "#519ce7",
  "vivid azure": "#0074e7",
  "grayish azure": "#7d93a8",
  "moderate azure": "#4a79a8",
  "strong azure": "#0054a8",
  "dark grayish azure": "#424e59",
  "dark azure": "#274059",
  "deep azure": "#002d59",
  "very dark azure": "#11171d",
  "very deep azure": "#000e1d",
  "pale cobalt blue": "#c2d9ff",
  "very light cobalt blue": "#9ec2ff",
  "light brilliant cobalt blue": "#659fff",
  "luminous vivid cobalt blue": "#0060ff",
  "light cobalt blue": "#8baee7",
  "brilliant cobalt blue": "#5189e7",
  "vivid cobalt blue": "#0057e7",
  "moderate cobalt blue": "#4a6da8",
  "strong cobalt blue": "#003fa8",
  "dark cobalt blue": "#273a59",
  "deep cobalt blue": "#002159",
  "very pale sapphire blue": "#e2e9ff",
  "pale sapphire blue": "#c2d1ff",
  "very light sapphire blue": "#9eb6ff",
  "light brilliant sapphire blue": "#658bff",
  "luminous vivid sapphire blue": "#0040ff",
  "pale, light grayish sapphire blue": "#b8c4e7",
  "light sapphire blue": "#8ba2e7",
  "brilliant sapphire blue": "#5177e7",
  "vivid sapphire blue": "#003ae7",
  "grayish sapphire blue": "#7d88a8",
  "moderate sapphire blue": "#4a61a8",
  "strong sapphire blue": "#002aa8",
  "dark grayish sapphire blue": "#424859",
  "dark sapphire blue": "#273459",
  "deep sapphire blue": "#001659",
  "pale phthalo blue": "#c2c9ff",
  "very light phthalo blue": "#9eaaff",
  "light brilliant phthalo blue": "#6578ff",
  "luminous vivid phthalo blue": "#0020ff",
  "light phthalo blue": "#8b96e7",
  "brilliant phthalo blue": "#5164e7",
  "vivid phthalo blue": "#001de7",
  "moderate phthalo blue": "#4a55a8",
  "strong phthalo blue": "#0015a8",
  "dark phthalo blue": "#272d59",
  "deep phthalo blue": "#000b59",
  "bluish white": "#f6f6ff",
  "very pale blue": "#e2e2ff",
  "pale blue": "#c2c2ff",
  "very light blue": "#9e9eff",
  "light brilliant blue": "#6565ff",
  "luminous vivid blue": "#0000ff",
  "light bluish gray": "#dadae7",
  "pale, light grayish blue": "#b8b8e7",
  "light blue": "#8b8be7",
  "brilliant blue": "#5151e7",
  "vivid blue": "#0000e7",
  "bluish gray": "#9c9ca8",
  "grayish blue": "#7d7da8",
  "moderate blue": "#4a4aa8",
  "strong blue": "#0000a8",
  "dark bluish gray": "#535359",
  "dark grayish blue": "#424259",
  "dark blue": "#272759",
  "deep blue": "#000059",
  "bluish black": "#1a1a1d",
  "very dark blue": "#11111d",
  "very deep blue": "#00001d",
  "pale persian blue": "#c9c2ff",
  "very light persian blue": "#aa9eff",
  "light brilliant persian blue": "#7865ff",
  "luminous vivid persian blue": "#2000ff",
  "light persian blue": "#968be7",
  "brilliant persian blue": "#6451e7",
  "vivid persian blue": "#1d00e7",
  "moderate persian blue": "#554aa8",
  "strong persian blue": "#1500a8",
  "dark persian blue": "#2d2759",
  "deep persian blue": "#0b0059",
  "very pale indigo": "#e9e2ff",
  "pale indigo": "#d1c2ff",
  "very light indigo": "#b69eff",
  "light brilliant indigo": "#8b65ff",
  "luminous vivid indigo": "#4000ff",
  "pale, light grayish indigo": "#c4b8e7",
  "light indigo": "#a28be7",
  "brilliant indigo": "#7751e7",
  "vivid indigo": "#3a00e7",
  "grayish indigo": "#887da8",
  "moderate indigo": "#614aa8",
  "strong indigo": "#2a00a8",
  "dark grayish indigo": "#484259",
  "dark indigo": "#342759",
  "deep indigo": "#160059",
  "pale blue violet": "#d9c2ff",
  "very light blue violet": "#c29eff",
  "light brilliant blue violet": "#9f65ff",
  "luminous vivid blue violet": "#6000ff",
  "light blue violet": "#ae8be7",
  "brilliant blue violet": "#8951e7",
  "vivid blue violet": "#5700e7",
  "moderate blue violet": "#6d4aa8",
  "strong blue violet": "#3f00a8",
  "dark blue violet": "#3a2759",
  "deep blue violet": "#210059",
  "very pale violet": "#f0e2ff",
  "pale violet": "#e0c2ff",
  "very light violet": "#cf9eff",
  "light brilliant violet": "#b265ff",
  "luminous vivid violet": "#8000ff",
  "pale, light grayish violet": "#d0b8e7",
  "light violet": "#b98be7",
  "brilliant violet": "#9c51e7",
  "vivid violet": "#7400e7",
  "grayish violet": "#937da8",
  "moderate violet": "#794aa8",
  "strong violet": "#5400a8",
  "dark grayish violet": "#4e4259",
  "dark violet": "#402759",
  "deep violet": "#2d0059",
  "very dark violet": "#17111d",
  "very deep violet": "#0e001d",
  "pale purple": "#e8c2ff",
  "very light purple": "#db9eff",
  "light brilliant purple": "#c565ff",
  "luminous vivid purple": "#9f00ff",
  "light purple": "#c58be7",
  "brilliant purple": "#af51e7",
  "vivid purple": "#9100e7",
  "moderate purple": "#854aa8",
  "strong purple": "#6900a8",
  "dark purple": "#462759",
  "deep purple": "#380059",
  "very pale mulberry": "#f8e2ff",
  "pale mulberry": "#f0c2ff",
  "very light mulberry": "#e79eff",
  "light brilliant mulberry": "#d865ff",
  "luminous vivid mulberry": "#bf00ff",
  "pale, light grayish mulberry": "#dcb8e7",
  "light mulberry": "#d08be7",
  "brilliant mulberry": "#c251e7",
  "vivid mulberry": "#ae00e7",
  "grayish mulberry": "#9e7da8",
  "moderate mulberry": "#914aa8",
  "strong mulberry": "#7e00a8",
  "dark grayish mulberry": "#544259",
  "dark mulberry": "#4d2759",
  "deep mulberry": "#430059",
  "pale heliotrope": "#f7c2ff",
  "very light heliotrope": "#f39eff",
  "light brilliant heliotrope": "#ec65ff",
  "luminous vivid heliotrope": "#df00ff",
  "light heliotrope": "#dc8be7",
  "brilliant heliotrope": "#d551e7",
  "vivid heliotrope": "#ca00e7",
  "moderate heliotrope": "#9c4aa8",
  "strong heliotrope": "#9300a8",
  "dark heliotrope": "#532759",
  "deep heliotrope": "#4e0059",
  "magentaish white": "#fff6ff",
  "very pale magenta": "#ffe2ff",
  "pale magenta": "#ffc2ff",
  "very light magenta": "#ff9eff",
  "light brilliant magenta": "#ff65ff",
  "luminous vivid magenta": "#ff00ff",
  "light magentaish gray": "#e7dae7",
  "pale, light grayish magenta": "#e7b8e7",
  "light magenta": "#e78be7",
  "brilliant magenta": "#e751e7",
  "vivid magenta": "#e700e7",
  "magentaish gray": "#a89ca8",
  "grayish magenta": "#a87da8",
  "moderate magenta": "#a84aa8",
  "strong magenta": "#a800a8",
  "dark magentaish gray": "#595359",
  "dark grayish magenta": "#594259",
  "dark magenta": "#592759",
  "deep magenta": "#590059",
  "magentaish black": "#1d1a1d",
  "very dark magenta": "#1d111d",
  "very deep magenta": "#1d001d",
  "pale orchid": "#ffc2f7",
  "very light orchid": "#ff9ef3",
  "light brilliant orchid": "#ff65ec",
  "luminous vivid orchid": "#ff00df",
  "light orchid": "#e78bdc",
  "brilliant orchid": "#e751d5",
  "vivid orchid": "#e700ca",
  "moderate orchid": "#a84a9c",
  "strong orchid": "#a80093",
  "dark orchid": "#592753",
  "deep orchid": "#59004e",
  "very pale fuchsia": "#ffe2f8",
  "pale fuchsia": "#ffc2f0",
  "very light fuchsia": "#ff9ee7",
  "light brilliant fuchsia": "#ff65d8",
  "luminous vivid fuchsia": "#ff00bf",
  "pale, light grayish fuchsia": "#e7b8dc",
  "light fuchsia": "#e78bd0",
  "brilliant fuchsia": "#e751c2",
  "vivid fuchsia": "#e700ae",
  "grayish fuchsia": "#a87d9e",
  "moderate fuchsia": "#a84a91",
  "strong fuchsia": "#a8007e",
  "dark grayish fuchsia": "#594254",
  "dark fuchsia": "#59274d",
  "deep fuchsia": "#590043",
  "pale cerise": "#ffc2e8",
  "very light cerise": "#ff9edb",
  "light brilliant cerise": "#ff65c5",
  "luminous vivid cerise": "#ff009f",
  "light cerise": "#e78bc5",
  "brilliant cerise": "#e751af",
  "vivid cerise": "#e70091",
  "moderate cerise": "#a84a85",
  "strong cerise": "#a80069",
  "dark cerise": "#592746",
  "deep cerise": "#590038",
  "very pale rose": "#ffe2f0",
  "pale rose": "#ffc2e0",
  "very light rose": "#ff9ecf",
  "light brilliant rose": "#ff65b2",
  "luminous vivid rose": "#ff0080",
  "pale, light grayish rose": "#e7b8d0",
  "light rose": "#e78bb9",
  "brilliant rose": "#e7519c",
  "vivid rose": "#e70074",
  "grayish rose": "#a87d93",
  "moderate rose": "#a84a79",
  "strong rose": "#a80054",
  "dark grayish rose": "#59424e",
  "dark rose": "#592740",
  "deep rose": "#59002d",
  "very dark rose": "#1d1117",
  "very deep rose": "#1d000e",
  "pale raspberry": "#ffc2d9",
  "very light raspberry": "#ff9ec2",
  "light brilliant raspberry": "#ff659f",
  "luminous vivid raspberry": "#ff0060",
  "light raspberry": "#e78bae",
  "brilliant raspberry": "#e75189",
  "vivid raspberry": "#e70057",
  "moderate raspberry": "#a84a6d",
  "strong raspberry": "#a8003f",
  "dark raspberry": "#59273a",
  "deep raspberry": "#590021",
  "very pale crimson": "#ffe2e9",
  "pale crimson": "#ffc2d1",
  "very light crimson": "#ff9eb6",
  "light brilliant crimson": "#ff658b",
  "luminous vivid crimson": "#ff0040",
  "pale, light grayish crimson": "#e7b8c4",
  "light crimson": "#e78ba2",
  "brilliant crimson": "#e75177",
  "vivid crimson": "#e7003a",
  "grayish crimson": "#a87d88",
  "moderate crimson": "#a84a61",
  "strong crimson": "#a8002a",
  "dark grayish crimson": "#594248",
  "dark crimson": "#592734",
  "deep crimson": "#590016",
  "pale amaranth": "#ffc2c9",
  "very light amaranth": "#ff9eaa",
  "light brilliant amaranth": "#ff6578",
  "luminous vivid amaranth": "#ff0020",
  "light amaranth": "#e78b96",
  "brilliant amaranth": "#e75164",
  "vivid amaranth": "#e7001d",
  "moderate amaranth": "#a84a55",
  "strong amaranth": "#a80015",
  "dark amaranth": "#59272d",
  "deep amaranth": "#59000b",
};

/** @param {string} strColor */
function isValidColor(strColor) {
  if (strColor.length == 0 || strColor in ColorNames) {
    return true;
  }
  var s = new Option().style;
  s.color = strColor;

  // return 'false' if color wasn't assigned
  return s.color !== "";
}

/** @param {string} name */
function getColor(name) {
  return ColorNames[name] || name;
}

/** @param {Partial<CSSStyleDeclaration>} style */
function normalizeStyle(style) {
  return Object.fromEntries(
    Object.entries(style)
      .filter(([_, value]) => value && value.toString().length)
      .map(([key, value]) =>
        key.toLowerCase().indexOf("color") >= 0
          ? [key, getColor(/** @type {string} */ (value))]
          : [key, value && value.toString()],
      ),
  );
}

/** @param {Partial<CSSStyleDeclaration>} styles */
function styleString(styles) {
  return Object.entries(normalizeStyle(styles)).reduce(
    (acc, [key, value]) =>
      acc +
      key
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase() +
      ":" +
      value +
      ";",
    "",
  );
}

function colorNamesDataList() {
  return html`<datalist id="ColorNames">
    ${Object.keys(ColorNames).map((name) => html`<option value="${name}" />`)}
  </datalist>`;
}

/* Thinking about better properties */


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
 */

/**
 * @template {number|boolean|string} T
 */
class Prop {
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
          @focus=${this.onfocus}
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
        console.log(this.options);
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
function toMap(arrayOrMap) {
  if (arrayOrMap instanceof Function) {
    return arrayOrMap();
  }
  if (Array.isArray(arrayOrMap)) {
    return new Map(arrayOrMap.map((item) => [item, item]));
  }
  return arrayOrMap;
}

/** @extends {Prop<string>} */
class Select extends Prop {
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
        required
        title=${this.options.title}
        @change=${({ target }) => {
          this._value = target.value;
          this.update();
        }}
      >
        <option value="" disabled ?selected=${!choices.has(this._value)}>
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
    this._value = value;
  }
}

class Field extends Select {
  /**
   * @param {PropOptions} options
   */
  constructor(options = {}) {
    super(
      () => toMap([...Globals.data.allFields, "#ComponentName"].sort()),
      options,
    );
  }
}

let Cue$1 = class Cue extends Select {
  /**
   * @param {PropOptions} options
   */
  constructor(options = {}) {
    super(() => Globals.cues.cueMap, options);
  }
};

class Pattern extends Select {
  /**
   * @param {PropOptions} options
   */
  constructor(options = {}) {
    super(() => Globals.patterns.patternMap, options);
  }
}

class TypeSelect extends Select {
  update() {
    /* Magic happens here! The replace method on a TreeBaseSwitchable replaces the
     * node with a new one to allow type switching in place
     * */
    if (this.container instanceof TreeBaseSwitchable)
      this.container.replace(this._value);
  }
}

/** @extends {Prop<string>} */
let String$1 = class String extends Prop {};

/* Allow entering a key name by first pressing Enter than pressing a single key
 */
/** @extends {Prop<string>} */
class KeyName extends Prop {
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
            this._value = event.key;
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
class TextArea extends Prop {
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
            this._value = target.value;
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
class Integer extends Prop {
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
        return `Please enter a whole number at least ${this.options.min}`;
      }
      if (typeof options.max === "number" && parseInt(value) > options.max) {
        return `Please enter a whole number at most ${this.options.max}`;
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
class Float extends Prop {
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
let Boolean$1 = class Boolean extends Prop {
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
};

/** @extends {Prop<boolean>} */
class OneOfGroup extends Prop {
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
class UID extends Prop {
  constructor() {
    super("", {});
    this._value =
      "id" + Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
}

/** @extends {Prop<string|number|boolean>} */
class Expression extends Prop {
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
class Conditional extends Prop {
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

/** @extends {Prop<string>} */
class Code extends Prop {
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
      const styleSheet = new CSSStyleSheet();
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
          <textarea class="line-numbers" readonly></textarea>
          <textarea
            class="text"
            .value=${this._value}
            id=${this.id}
            @change=${({ target }) => {
              this._value = target.value;
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
class Color extends Prop {
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
class Voice extends Prop {
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
class ADate extends Prop {
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

const treebase = '';

/*! (c) Andrea Giammarchi */

const {iterator: iterator$1} = Symbol;

const noop$1 = () => {};

/**
 * A Map extend that transparently uses WeakRef around its values,
 * providing a way to observe their collection at distance.
 * @extends {Map}
 */
class WeakValue extends Map {
  #delete = (key, ref) => {
    super.delete(key);
    this.#registry.unregister(ref);
  };

  #get = (key, [ref, onValueCollected]) => {
    const value = ref.deref();
    if (!value) {
      this.#delete(key, ref);
      onValueCollected(key, this);
    }
    return value;
  }

  #registry = new FinalizationRegistry(key => {
    const pair = super.get(key);
    if (pair) {
      super.delete(key);
      pair[1](key, this);
    }
  });

  constructor(iterable) {
    super();
    if (iterable)
      for (const [key, value] of iterable)
        this.set(key, value);
  }

  clear() {
    for (const [_, [ref]] of super[iterator$1]())
      this.#registry.unregister(ref);
    super.clear();
  }

  delete(key) {
    const pair = super.get(key);
    return !!pair && !this.#delete(key, pair[0]);
  }

  forEach(callback, context) {
    for (const [key, value] of this)
      callback.call(context, value, key, this);
  }

  get(key) {
    const pair = super.get(key);
    return pair && this.#get(key, pair);
  }

  has(key) {
    return !!this.get(key);
  }

  set(key, value, onValueCollected = noop$1) {
    super.delete(key);
    const ref = new WeakRef(value);
    this.#registry.register(value, key, ref);
    return super.set(key, [ref, onValueCollected]);
  }

  *[iterator$1]() {
    for (const [key, pair] of super[iterator$1]()) {
      const value = this.#get(key, pair);
      if (value)
        yield [key, value];
    }
  }

  *entries() {
    yield *this[iterator$1]();
  }

  *values() {
    for (const [_, value] of this[iterator$1]())
      yield value;
  }
}

/**
 * Create an object that is persisted to sessionStorage
 *
 * @template {Object} T
 * @param {string} key
 * @param {T} initial
 * @returns {T} - same type as the initial value
 */
function session(key, initial) {
  // import values from storage if present
  const json = window.sessionStorage.getItem(key);
  if (json) {
    const values = JSON.parse(json);
    if (!(values instanceof Object)) throw TypeError();
    // validate the value from storage
    if (sameObjectShape(initial, values)) initial = values;
  }
  if (!(initial instanceof Object)) throw TypeError();
  return new Proxy(initial, {
    set(obj, prop, value) {
      const r = Reflect.set(obj, prop, value);
      const json = JSON.stringify(obj);
      window.sessionStorage.setItem(key, json);
      return r;
    },
  });
}

/**
 * Compare objects to see if they have the same keys and types
 * @param {Object} a
 * @param {Object} b
 * @returns {boolean}
 */
function sameObjectShape(a, b) {
  for (const key of Object.keys(a)) {
    if (typeof a[key] !== typeof b[key]) return false;
  }
  return true;
}

/**
 * Provide user friendly names for the components
 */

/**
 * Map the classname into the Menu name and the Help Wiki page name
 */
const namesMap = {
  Action: ["Action", "Actions"],
  ActionCondition: ["Condition", "Actions#Condition"],
  Actions: ["Actions", "Actions"],
  ActionUpdate: ["Update", "Actions#Update"],
  Audio: ["Audio", "Audio"],
  Button: ["Button", "Button"],
  Content: ["Content", "Content"],
  CueCircle: ["Circle", "Cues"],
  CueCss: ["CSS", "Cues#CSS"],
  CueFill: ["Fill", "Cues#Fill"],
  CueList: ["Cues", "Cues"],
  CueOverlay: ["Overlay", "Cues#Overlay"],
  Customize: ["Customize", "Customize"],
  Designer: ["Designer", "Designer"],
  Display: ["Display", "Display"],
  Filter: ["Filter", "Patterns#Filter"],
  Gap: ["Gap", "Gap"],
  Grid: ["Grid", "Grid"],
  GridFilter: ["Filter", "Grid#Filter"],
  GroupBy: ["Group By", "Patterns#Group By"],
  HandlerCondition: ["Condition", "Methods#Condition"],
  HandlerKeyCondition: ["Key Condition", "Methods#Key Condition"],
  HandlerResponse: ["Response", "Methods#Response"],
  HeadMouse: ["Head Mouse", "Head Mouse"],
  KeyHandler: ["Key Handler", "Methods#Key Handler"],
  Layout: ["Layout", "Layout"],
  Logger: ["Logger", "Logger"],
  Method: ["Method", "Methods"],
  MethodChooser: ["Methods", "Methods"],
  ModalDialog: ["Modal Dialog", "Modal Dialog"],
  Option: ["Option", "Radio#Option"],
  OrderBy: ["Order By", "Patterns#Order By"],
  Page: ["Page", "Page"],
  PatternGroup: ["Group", "Patterns"],
  PatternList: ["Patterns", "Patterns"],
  PatternManager: ["Pattern", "Patterns"],
  PatternSelector: ["Selector", "Patterns"],
  PointerHandler: ["Pointer Handler", "Methods#Pointer Handler"],
  Radio: ["Radio", "Radio"],
  ResponderActivate: ["Activate", "Methods#Activate"],
  ResponderCue: ["Cue", "Methods#Cue"],
  ResponderClearCue: ["Clear Cue", "Methods#Clear Cue"],
  ResponderEmit: ["Emit", "Methods#Emit"],
  ResponderNext: ["Next", "Methods#Next"],
  ResponderStartTimer: ["Start Timer", "Methods"],
  SocketHandler: ["Socket Handler", "Methods#Socket Handler"],
  Speech: ["Speech", "Speech"],
  Stack: ["Stack", "Stack"],
  TabControl: ["Tab Control", "Tab Control"],
  TabPanel: ["Tab", "Tab"],
  Timer: ["Timer", "Methods#Timer"],
  TimerHandler: ["Timer Handler", "Methods#Timer Handler"],
  VSD: ["VSD", "VSD"],
};

/**
 * Get the name for a menu item from the class name
 * @param {string} className
 */
function friendlyName(className) {
  return className in namesMap ? namesMap[className][0] : className;
}

/**
 * Get the Wiki name from the class name
 * @param {string} className
 */
function wikiName(className) {
  return namesMap[className][1].replace(" ", "-");
}

class TreeBase {
  /** @type {TreeBase[]} */
  children = [];
  /** @type {TreeBase | null} */
  parent = null;
  /** @type {string[]} */
  allowedChildren = [];
  allowDelete = true;

  // every component has a unique id
  static treeBaseCounter = 0;
  id = `TreeBase-${TreeBase.treeBaseCounter++}`;

  // values here are stored in sessionStorage
  persisted = session(this.id, {
    settingsDetailsOpen: false,
  });

  // map from id to the component
  static idMap = new WeakValue();

  /** @param {string} id
   * @returns {TreeBase | null} */
  static componentFromId(id) {
    // strip off any added bits of the id
    const match = id.match(/TreeBase-\d+/);
    if (match) {
      return this.idMap.get(match[0]);
    }
    return null;
  }

  designer = {};

  /** A mapping from the external class name to the class */
  static nameToClass = new Map();
  /** A mapping from the class to the external class name */
  static classToName = new Map();

  /** @param {typeof TreeBase} cls
   * @param {string} externalName
   * */
  static register(cls, externalName) {
    this.nameToClass.set(externalName, cls);
    this.classToName.set(cls, externalName);
  }

  get className() {
    return TreeBase.classToName.get(this.constructor);
  }

  /**
   * Extract the class fields that are Props and return their values as an Object
   * @returns {Object<string, any>}
   */
  get propsAsObject() {
    return Object.fromEntries(
      Object.entries(this)
        .filter(([_, prop]) => prop instanceof Prop)
        .map(([name, prop]) => [name, prop.value]),
    );
  }

  /**
   * Extract the values of the fields that are Props
   * @returns {Object<string, Props.Prop>}
   */
  get props() {
    return Object.fromEntries(
      Object.entries(this).filter(([_, prop]) => prop instanceof Prop),
    );
  }

  /**
   * Prepare a TreeBase tree for external storage by converting to simple objects and arrays
   * @param {Object} [options]
   * @param {string[]} options.omittedProps - class names of props to omit
   * @returns {Object}
   * */
  toObject(options = { omittedProps: [] }) {
    const props = Object.fromEntries(
      Object.entries(this)
        .filter(
          ([_, prop]) =>
            prop instanceof Prop &&
            !options.omittedProps.includes(prop.constructor.name),
        )
        .map(([name, prop]) => [name, prop.text]),
    );
    const children = this.children.map((child) => child.toObject(options));
    const result = {
      className: this.className,
      props,
      children,
    };
    return result;
  }

  /**
   * An opportunity for the component to initialize itself. This is
   * called in fromObject after the children have been added. If you
   * call create directly you should call init afterward.
   */
  init() {
    /** Make sure OnOfGroup is enforced */
    for (const child of this.children) {
      const props = child.props;
      for (const instance of Object.values(props)) {
        if (instance instanceof OneOfGroup && instance._value) {
          instance.clearPeers();
          break;
        }
      }
    }
  }

  /**
   *   Create a TreeBase object
   *   @template {TreeBase} TB
   *   @param {string|(new()=>TB)} constructorOrName
   *   @param {TreeBase | null} parent
   *   @param {Object<string,string|number|boolean>} props
   *   @returns {TB}
   *   */
  static create(constructorOrName, parent = null, props = {}) {
    const constructor =
      typeof constructorOrName == "string"
        ? TreeBase.nameToClass.get(constructorOrName)
        : constructorOrName;
    /** @type {TB} */
    const result = new constructor();

    // initialize the props
    for (const [name, prop] of Object.entries(result.props)) {
      prop.initialize(name, props[name], result);
    }

    // link it to its parent
    if (parent) {
      result.parent = parent;
      parent.children.push(result);
    }

    // remember the relationship between id and component
    TreeBase.idMap.set(result.id, result);

    return result;
  }

  /**
   * Instantiate a TreeBase tree from its external representation
   * @param {Object} obj
   * @param {TreeBase | null} parent
   * @returns {TreeBase} - should be {this} but that isn't supported for some reason
   * */
  static fromObject(obj, parent = null) {
    // Get the constructor from the class map
    if (!obj) console.trace("fromObject", obj);
    const className = obj.className;
    const constructor = this.nameToClass.get(className);
    if (!constructor) {
      console.trace("className not found", className, obj);
      throw new Error("className not found");
    }

    // Create the object and link it to its parent
    const result = this.create(constructor, parent, obj.props);

    // Link in the children
    for (const childObj of obj.children) {
      if (childObj instanceof TreeBase) {
        childObj.parent = result;
        result.children.push(childObj);
      } else {
        TreeBase.fromObject(childObj, result);
      }
    }

    // allow the component to initialize itself
    result.init();

    // Validate the type is what was expected
    if (result instanceof this) return result;

    // Die if not
    console.error("expected", this);
    console.error("got", result);
    throw new Error(`fromObject failed`);
  }

  /**
   * Signal nodes above that something has been updated
   */
  update() {
    let start = this;
    /** @type {TreeBase | null} */
    let p = start;
    while (p) {
      p.onUpdate(start);
      p = p.parent;
    }
  }

  /**
   * Called when something below is updated
   * @param {TreeBase} _start
   */
  onUpdate(_start) {}

  /**
   * Render the designer interface and return the resulting Hole
   * @returns {Hole}
   */
  settings() {
    const detailsId = this.id + "-details";
    const settingsId = this.id + "-settings";
    return html`<div class="settings">
      <details
        class=${this.className}
        id=${detailsId}
        ?open=${this.persisted.settingsDetailsOpen}
        @toggle=${({ target }) =>
          (this.persisted.settingsDetailsOpen = target.open)}
      >
        <summary id=${settingsId}>${this.settingsSummary()}</summary>
        ${this.settingsDetails()}
      </details>
      ${this.settingsChildren()}
    </div>`;
  }

  /**
   * Render the summary of a components settings
   * @returns {Hole}
   */
  settingsSummary() {
    const name = Object.hasOwn(this, "name") ? this["name"].value : "";
    return html`<h3>${friendlyName(this.className)} ${name}</h3>`;
  }

  /**
   * Render the details of a components settings
   * @returns {Hole[]}
   */
  settingsDetails() {
    const props = this.props;
    const inputs = Object.values(props).map((prop) => prop.input());
    return inputs;
  }

  /**
   * @returns {Hole}
   */
  settingsChildren() {
    return this.orderedChildren();
  }

  /**
   * Render the user interface and return the resulting Hole
   * @returns {Hole}
   */
  template() {
    return html`<div />`;
  }

  /**
   * Render the user interface catching errors and return the resulting Hole
   * @returns {Hole}
   */
  safeTemplate() {
    try {
      return this.template();
    } catch (error) {
      errorHandler(error, ` safeTemplate ${this.className}`);
      let classes = [this.className.toLowerCase()];
      classes.push("error");
      return html`<div class=${classes.join(" ")} id=${this.id}>ERROR</div>`;
    }
  }

  /** @typedef {Object} ComponentAttrs
   * @property {string[]} [classes]
   * @property {Object} [style]
   */

  /**
   * Wrap the body of a component
   *
   * @param {ComponentAttrs} attrs
   * @param {Hole} body
   * @returns {Hole}
   */
  component(attrs, body) {
    attrs = { style: {}, ...attrs };
    let classes = [this.className.toLowerCase()];
    if ("classes" in attrs) {
      classes = classes.concat(attrs.classes);
    }
    return html`<div
      class=${classes.join(" ")}
      id=${this.id}
      style=${styleString(attrs.style)}
    >
      ${body}
    </div>`;
  }

  /**
   * Swap two of my children
   * @param {number} i
   * @param {number} j
   */
  swap(i, j) {
    const A = this.children;
    [A[i], A[j]] = [A[j], A[i]];
  }

  /**
   * Move me to given position in my parent
   * @param {number} i
   */
  moveTo(i) {
    const peers = this.parent?.children || [];
    peers.splice(this.index, 1);
    peers.splice(i, 0, this);
  }

  /**
   * Move me up or down by 1 position if possible
   * @param {boolean} up
   */
  moveUpDown(up) {
    const parent = this.parent;
    if (!parent) return;
    const peers = parent.children;
    if (peers.length > 1) {
      const index = this.index;
      const step = up ? -1 : 1;
      if ((up && index > 0) || (!up && index < peers.length - 1)) {
        parent.swap(index, index + step);
      }
    }
  }

  /**
   * Get the index of this component in its parent
   * @returns {number}
   */
  get index() {
    return (this.parent && this.parent.children.indexOf(this)) || 0;
  }

  /**
   *  * Remove this child from their parent and return the id of the child to receive focus
   *  @returns {string}
   *  */
  remove() {
    if (!this.parent) return "";
    const peers = this.parent.children;
    const index = peers.indexOf(this);
    const parent = this.parent;
    this.parent = null;
    peers.splice(index, 1);
    if (peers.length > index) {
      return peers[index].id;
    } else if (peers.length > 0) {
      return peers[peers.length - 1].id;
    } else {
      return parent.id;
    }
  }

  /**
   * Create HTML LI nodes from the children
   */
  listChildren(children = this.children) {
    return children.map((child) => html`<li>${child.settings()}</li>`);
  }

  /**
   * Create an HTML ordered list from the children
   */
  orderedChildren(children = this.children) {
    return html`<ol>
      ${this.listChildren(children)}
    </ol>`;
  }

  /**
   * Create an HTML unordered list from the children
   * */
  unorderedChildren(children = this.children) {
    return html`<ul>
      ${this.listChildren(children)}
    </ul>`;
  }

  /**
   * Return the nearest parent of the given type
   * @template T
   * @param {new() => T} type
   * @returns {T}
   * */
  nearestParent(type) {
    let p = this.parent;
    while (p) {
      if (p instanceof type) {
        return p;
      }
      p = p.parent;
    }
    throw new Error("No such parent");
  }

  /**
   * Filter children by their type
   * @template T
   * @param {new() => T} type
   * @returns {T[]}
   */
  filterChildren(type) {
    /** @type {T[]} */
    const result = [];
    for (const child of this.children) {
      if (child instanceof type) {
        result.push(child);
      }
    }
    return result;
  }

  /** @param {string[]} classes
   * @returns {string}
   */
  CSSClasses(...classes) {
    return classes.join(" ");
  }
}

/**
 * A variant of TreeBase that allows replacing a node with one of a similar type
 */
class TreeBaseSwitchable extends TreeBase {
  init() {
    super.init();
    // find the TypeSelect property and set its value
    for (const prop of Object.values(this.props)) {
      if (prop instanceof TypeSelect) {
        if (!prop.value) {
          prop.set(this.className);
        }
      }
    }
  }

  /** Replace this node with one of a compatible type
   * @param {string} className */
  replace(className) {
    if (!this.parent) return;
    if (this.className == className) return;
    // extract the values of the old props
    const props = Object.fromEntries(
      Object.entries(this)
        .filter(([_, prop]) => prop instanceof Prop)
        .map(([name, prop]) => [name, prop.value]),
    );
    const replacement = TreeBase.create(className, null, props);
    replacement.init();
    const index = this.parent.children.indexOf(this);
    this.parent.children[index] = replacement;
    replacement.parent = this.parent;
    this.update();
  }
}

class Messages extends TreeBase {
  /** @type {string[]} */
  messages = [];

  template() {
    if (this.messages.length) {
      const result = html`<div id="messages">
        ${this.messages.map((message) => html`<p>${message}</p>`)}
      </div> `;
      this.messages = [];
      return result;
    } else {
      return html`<div />`;
    }
  }

  report(message = "") {
    console.log({ message });
    this.messages.push(message);
  }
}

/** Display an error message for user feedback
 * @param {string} msg - the error message
 * @param {string[]} trace - stack trace
 */
function reportInternalError(msg, trace) {
  const result = document.createElement("div");
  result.id = "ErrorReport";
  render(
    result,
    html`<div id="ErrorReport">
      <h1>Internal Error</h1>
      <p>
        Your browser has detected an internal error in OS-DPI. It was very
        likely caused by our program bug. We hope you will help us by sending a
        report of the information below. Simply click this button
        <button
          @click=${() => {
            const html =
              document.getElementById("ErrorReportBody")?.innerHTML || "";
            const blob = new Blob([html], { type: "text/html" });
            const data = [new ClipboardItem({ "text/html": blob })];
            navigator.clipboard.write(data);
          }}
        >
          Copy report to clipboard
        </button>
        and then paste into an email to
        <a
          href="mailto:gb@cs.unc.edu?subject=OS-DPI Error Report"
          target="email"
          >gb@cs.unc.edu</a
        >.
        <button
          @click=${() => {
            document.getElementById("ErrorReport")?.remove();
          }}
        >
          Dismiss this dialog
        </button>
      </p>
      <div id="ErrorReportBody">
        <h2>Error Report</h2>
        <p>${msg}</p>
        <h2>Stack Trace</h2>
        <ul>
          ${trace.map((s) => html`<li>${s}</li>`)}
        </ul>
      </div>
    </div>`,
  );
  document.body.prepend(result);
}

/** @param {string} msg
 * @param {string} _file
 * @param {number} _line
 * @param {number} _col
 * @param {Error} error
 */
window.onerror = async function (msg, _file, _line, _col, error) {
  console.error("onerror", msg, error);
  if (error instanceof Error) {
    try {
      const frames = await stacktraceExports.fromError(error);
      const trace = frames.map((frame) => `${frame.toString()}`);
      reportInternalError(msg.toString(), trace);
    } catch (e) {
      const msg2 = `Caught an error trying to report an error.
        The original message was "${msg.toString()}".
        With file=${_file} line=${_line} column=${_col}
        error=${error.toString()}`;
      reportInternalError(msg2, []);
    }
  }
};

/** @param {Error} error */
function errorHandler(error, extra = "") {
  let stack = [];
  let cause = `${error.name}${extra}`;
  if (error.stack) {
    const errorLines = error.stack.split("\n");
    stack = errorLines.slice(1);
    cause = errorLines[0] + extra;
  }
  reportInternalError(cause, stack);
}
/** @param {PromiseRejectionEvent} error */
window.onunhandledrejection = function (error) {
  console.error("onunhandlederror", error);
  error.preventDefault();
  reportInternalError(
    error.reason.message,
    error.reason.stack?.split("\n") || ["no stack"],
  );
};

const gridfilter = '';

class GridFilter extends TreeBase {
  field = new Field({ hiddenLabel: true });
  operator = new Select(Object.keys(comparators), { hiddenLabel: true });
  value = new Expression("", { hiddenLabel: true });

  /** move my parent instead of me.
   * @param {boolean} up
   */
  moveUpDown(up) {
    this.parent?.moveUpDown(up);
  }

  /** Format the settings
   * @param {GridFilter[]} filters
   * @return {Hole}
   */
  static FilterSettings(filters) {
    /** @type {Hole} */
    let table;
    if (filters.length > 0) {
      table = html`
        <table class="GridFilter">
          <thead>
            <tr>
              <th>#</th>
              <th>Field</th>
              <th>Operator</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            ${filters.map(
              (filter, index) => html`
                <tr id=${filter.id + "-settings"}>
                  <td>${index + 1}</td>
                  <td>${filter.field.input()}</td>
                  <td>${filter.operator.input()}</td>
                  <td>${filter.value.input()}</td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      `;
    } else {
      table = html`<div />`;
    }
    return html`<fieldset>
      <legend>Filters</legend>
      ${table}
    </fieldset>`;
  }

  /** Convert from Props to values for data module
   * @param {GridFilter[]} filters
   */
  static toContentFilters(filters) {
    return filters.map((child) => ({
      field: child.field.value,
      operator: child.operator.value,
      value: child.value.value,
    }));
  }
}
TreeBase.register(GridFilter, "GridFilter");

const collator = new Intl.Collator("en", { sensitivity: "base" });
const collatorNumber = new Intl.Collator("en", { numeric: true });

/** Implement comparison operators
 * @typedef {function(string, string): boolean} Comparator
 *
 * @type {Object<string, Comparator>}
 */
const comparators = {
  equals: (f, v) => collator.compare(f, v) === 0 || f === "*" || v === "*",
  "starts with": (f, v) => f.toUpperCase().startsWith(v.toUpperCase()),
  empty: (f) => !f,
  "not empty": (f) => !!f,
  "less than": (f, v) => collatorNumber.compare(f, v) < 0,
  "greater than": (f, v) => collatorNumber.compare(f, v) > 0,
  "less or equal": (f, v) => collatorNumber.compare(f, v) <= 0,
  "greater or equal": (f, v) => collatorNumber.compare(f, v) >= 0,
};

/** Test a row with a filter
 * @param {ContentFilter} filter
 * @param {Row} row
 * @returns {boolean}
 */
function match(filter, row) {
  const field = row[filter.field.slice(1)] || "";
  let value = filter.value || "";
  const comparator = comparators[filter.operator];
  if (!comparator) return true;
  let r = comparator(field.toString(), value.toString());
  return r;
}

class Data {
  /** @param {Rows} rows - rows coming from the spreadsheet */
  constructor(rows) {
    this.contentRows = (Array.isArray(rows) && rows) || [];
    this.allrows = this.contentRows;
    /** @type {Set<string>} */
    this.allFields = new Set();
    this.updateAllFields();
    this.loadTime = new Date();
  }

  updateAllFields() {
    this.allFields = this.contentRows.reduce((previous, current) => {
      for (const field of Object.keys(current)) {
        previous.add("#" + field);
      }
      return previous;
    }, new Set());
    this.clearFields = {};
    for (const field of this.allFields) {
      this.clearFields[field.slice(1)] = null;
    }
  }

  /**
   * Extract rows with the given filters
   *
   * @param {GridFilter[]} filters - each filter must return true
   * @param {boolean} [clearFields] - return null for undefined fields
   * @return {Rows} Rows that pass the filters
   */
  getMatchingRows(filters, clearFields = true) {
    // all the filters must match the row
    const boundFilters = filters.map((filter) => ({
      field: filter.field.value,
      operator: filter.operator.value,
      value: filter.value.value,
    }));
    let result = this.allrows.filter((row) =>
      boundFilters.every((filter) => match(filter, row)),
    );
    if (clearFields)
      result = result.map((row) => ({ ...this.clearFields, ...row }));
    return result;
  }

  /**
   * Test if any rows exist after filtering
   *
   * @param {GridFilter[]} filters
   * @param {EvalContext} context
   * @return {Boolean} true if tag combination occurs
   */
  hasMatchingRows(filters, context) {
    const boundFilters = filters.map((filter) => ({
      field: filter.field.value,
      operator: filter.operator.value,
      value: filter.value.valueInContext(context),
    }));
    const result = this.allrows.some((row) =>
      boundFilters.every((filter) => match(filter, row)),
    );
    return result;
  }

  /**
   * Add rows from the socket interface
   * @param {Rows} rows
   */
  setDynamicRows(rows) {
    if (!Array.isArray(rows)) return;
    this.allrows = rows.concat(this.contentRows);
    this.updateAllFields();
    this.loadTime = new Date();
  }
}

const e$1=Object.assign||((e,t)=>(t&&Object.keys(t).forEach(o=>e[o]=t[o]),e)),t$1=(e,r,s)=>{const c=typeof s;if(s&&"object"===c)if(Array.isArray(s))for(const o of s)r=t$1(e,r,o);else for(const c of Object.keys(s)){const f=s[c];"function"==typeof f?r[c]=f(r[c],o$1):void 0===f?e&&!isNaN(c)?r.splice(c,1):delete r[c]:null===f||"object"!=typeof f||Array.isArray(f)?r[c]=f:"object"==typeof r[c]?r[c]=f===r[c]?f:o$1(r[c],f):r[c]=t$1(!1,{},f);}else "function"===c&&(r=s(r,o$1));return r},o$1=(o,...r)=>{const s=Array.isArray(o);return t$1(s,s?o.slice():e$1({},o),r)};

let State$1 = class State {
  constructor(persistKey = "") {
    this.persistKey = persistKey;
    /** @type {Set<function>} */
    this.listeners = new Set();
    /** @type {Object} */
    this.values = {};
    /** @type {Set<string>} */
    this.updated = new Set();
    if (this.persistKey) {
      /* persistence */
      const persist = window.sessionStorage.getItem(this.persistKey);
      if (persist) {
        this.values = JSON.parse(persist);
      }
    }
  }

  /** unified interface to state
   * @param {string} [name] - possibly dotted path to a value
   * @param {any} defaultValue
   * @returns {any}
   */
  get(name, defaultValue = "") {
    if (name && name.length) {
      return name
        .split(".")
        .reduce((o, p) => (o ? o[p] : defaultValue), this.values);
    } else {
      return undefined;
    }
  }

  /**
   * update the state with a patch and invoke any listeners
   *
   * @param {Object} patch - the changes to make to the state
   * @return {void}
   */
  update(patch = {}) {
    for (const key in patch) {
      this.updated.add(key);
    }
    this.values = o$1(this.values, patch);
    for (const callback of this.listeners) {
      callback();
    }

    if (this.persistKey) {
      const persist = JSON.stringify(this.values);
      window.sessionStorage.setItem(this.persistKey, persist);
      // console.trace("persist $tabControl", this.values["$tabControl"]);
    }
  }

  /**
   * return a new state with the patch applied
   * @param {Object} patch - changes to apply
   * @return {State} - new independent state
   */
  clone(patch = {}) {
    const result = new State();
    result.values = o$1(this.values, patch);
    return result;
  }

  /** clear - reset the state
   */
  clear() {
    const userState = Object.keys(this.values).filter((name) =>
      name.startsWith("$"),
    );
    const patch = Object.fromEntries(
      userState.map((name) => [name, undefined]),
    );
    this.update(patch);
  }

  /** observe - call this function when the state updates
   * @param {Function} callback
   */
  observe(callback) {
    this.listeners.add(callback);
  }

  /** return true if the given state has been upated on this cycle
   * @param {string} stateName
   * @returns boolean
   */
  hasBeenUpdated(stateName) {
    return this.updated.has(stateName);
  }

  /** clear updated for the next cycle
   */
  clearUpdated() {
    this.updated.clear();
  }

  /** define - add a named state to the global system state
   * @param {String} name - name of the state
   * @param {any} defaultValue - value if not already defined
   */
  define(name, defaultValue) {
    if (typeof this.values[name] === "undefined") {
      this.values[name] = defaultValue;
    }
  }
  /** interpolate
   * @param {string} input
   * @returns {string} input with $name replaced by values from the state
   */
  interpolate(input) {
    let result = input.replace(/(\$[a-zA-Z0-9_.]+)/g, (_, name) =>
      this.get(name),
    );
    result = result.replace(/\$\{([a-zA-Z0-9_.]+)}/g, (_, name) =>
      this.get("$" + name),
    );
    return result;
  }
};

const stack = '';

class Stack extends TreeBase {
  direction = new Select(["row", "column"], { defaultValue: "column" });
  background = new Color("");
  scale = new Float(1);

  allowedChildren = [
    "Stack",
    "Gap",
    "Grid",
    "Display",
    "Radio",
    "TabControl",
    "VSD",
    "Button",
  ];

  /** @returns {Hole} */
  template() {
    /** return the scale of the child making sure it isn't zero or undefined.
     * @param {TreeBase } child
     * @returns {number}
     */
    function getScale(child) {
      const SCALE_MIN = 0.0;
      let scale = +child["scale"]?.value;
      if (!scale || scale < SCALE_MIN) {
        scale = SCALE_MIN;
      }
      return scale;
    }
    const scaleSum = this.children.reduce(
      (sum, child) => sum + getScale(child),
      0,
    );
    const empty = this.children.length && scaleSum ? "" : "empty";
    const direction = this.direction.value;
    const dimension = direction == "row" ? "width" : "height";

    return this.component(
      {
        classes: [this.CSSClasses(direction, empty)],
        style: {
          backgroundColor: this.background.value,
        },
      },
      html`${this.children.map(
        (child) =>
          html`<div
            style=${styleString({
              [dimension]: `${(100 * getScale(child)) / scaleSum}%`,
            })}
          >
            ${child.safeTemplate()}
          </div>`,
      )}`,
    );
  }
}
TreeBase.register(Stack, "Stack");

class Page extends Stack {
  // you can't delete the page
  allowDelete = false;

  constructor() {
    super();
    this.allowedChildren = this.allowedChildren.concat(
      "Speech",
      "Audio",
      "Logger",
      "ModalDialog",
      "Customize",
      "HeadMouse"
    );
  }
}
Stack.register(Page, "Page");

/** Gather Slots code into one module
 *
 * Slots are coded in strings like $$ kind = value $$ where kind is used
 * to access the Content for choices and value is the initial and default value.
 *
 */


/** Slot descriptor
 * @typedef {Object} Slot
 * @property {string} name - the name of the slot list
 * @property {string} value - the current value
 */

/** Editor state
 * @typedef {Object} Editor
 * @property {"editor"} type
 * @property {string} message - the message text
 * @property {Slot[]} slots - slots if any
 * @property {number} slotIndex - slot being edited
 * @property {string} slotName - current slot type
 * @property {string} value - value stripped of any markup
 */

/**
 * Edit slots markup to replace with highlighed values
 * @param {string|Editor} msg - the string possibly containing $$ kind = value $$ markup
 * @returns {Hole[]} - formatted string
 */
function formatSlottedString(msg) {
  if (typeof msg === "string") {
    return msg.split(/(\$\$.*?\$\$)/).map((part) => {
      const m = part.match(/\$\$(?<name>.*?)=(?<value>.*?)\$\$/);
      if (m) {
        return html`<b>${m.groups?.value || ""}</b>`;
      } else {
        return html`${part}`;
      }
    });
  } else if (typeof msg === "object" && msg.type === "editor") {
    let editor = msg;
    // otherwise it is an editor object
    // highlight the current slot
    let i = 0;
    return editor.message.split(/(\$\$.*?\$\$)/).map((part) => {
      const m = part.match(/\$\$(?<name>.*?)=(?<value>.*?)\$\$/);
      if (m) {
        if (i === editor.slotIndex) {
          // highlight the current slot
          return html`<b>${editor.slots[i++].value}</b>`;
        } else {
          return html`${editor.slots[i++].value.replace(/^\*/, "")}`;
        }
      }
      return html`${part}`;
    });
  } else {
    return [];
  }
}

/** Edit slots markup to replace with values
 * @param {string|Editor} value
 * @returns {string}
 */
function toString(value) {
  value ??= "";
  if (typeof value === "string") {
    // strip any slot markup
    value = value.replaceAll(/\$\$(?<name>.*?)=(?<value>.*?)\$\$/g, "$2");
    return value;
  } else if (typeof value === "object" && value.type === "editor") {
    let editor = value;
    // otherwise it is an editor object
    let i = 0;
    const parts = editor.message.split(/(\$\$.*?\$\$)/).map((part) => {
      const m = part.match(/\$\$(?<name>.*?)=(?<value>.*?)\$\$/);
      if (m) {
        return editor.slots[i++].value.replace(/^\*/, "");
      }
      return part;
    });
    return parts.join("");
  }
  return value.toString();
}

/** We need to keep some additional state around to enable editing slotted messages.
 *
 * These functions are used in Updates to manipulate the state.
 */

/** Test if this message has slots
 * @param {string|Editor} message
 * @returns {boolean}
 */
function hasSlots(message) {
  if (message instanceof Object && message.type === "editor") {
    return message.slots.length > 0;
  } else if (typeof message == "string") return message.indexOf("$$") >= 0;
  return false;
}

/** initialize the editor
 * @param {String} message
 * @returns Editor
 */
function init(message) {
  message = message || "";
  const slots = Array.from(
    message.matchAll(/\$\$(?<name>.*?)=(?<value>.*?)\$\$/g),
  ).map((m) => m.groups);
  let result = {
    type: "editor",
    message,
    slots,
    slotIndex: 0,
    slotName: (slots[0] && slots[0].name) || "",
  };
  return result;
}

/** cancel slot editing
 * @returns Editor
 */
function cancel() {
  return {
    type: "editor",
    message: "",
    slots: [],
    slotIndex: 0,
    slotName: "",
  };
}

/** update the value of the current slot
 * @param {String} message
 */
function update(message) {
  message ??= "";
  /** @param {Editor} old
   * @returns {Editor|string}
   */
  return (old) => {
    // copy the slots from the old value
    if (!old || !old.slots) {
      return "";
    }
    const slots = [...old.slots];
    let slotIndex = old.slotIndex;
    // replace the current one
    if (message.startsWith("*")) {
      slots[slotIndex].value = message;
    } else {
      if (slots[slotIndex].value.startsWith("*")) {
        slots[slotIndex].value = `${slots[slotIndex].value} ${message}`;
      } else {
        slots[slotIndex].value = message;
      }
      slotIndex++;
      if (slotIndex >= slots.length) {
        Globals.actions.queueEvent("okSlot", "press");
      }
    }
    return o$1(old, {
      slots,
      slotIndex,
      slotName: slots[slotIndex]?.name,
    });
  };
}

/** advance to the next slot
 */
function nextSlot() {
  /** @param {Editor} old
   */
  return (old) => {
    if (!old || !old.slots) return;
    const slotIndex = old.slotIndex + 1;
    if (slotIndex >= old.slots.length) {
      Globals.actions.queueEvent("okSlot", "press");
    }
    return o$1(old, { slotIndex, slotName: old.slots[slotIndex]?.name });
  };
}

/** duplicate the current slot
 */
function duplicate() {
  /** @param {Editor} old
   */
  return (old) => {
    if (!old || !old.slots) return;
    const matches = Array.from(
      old.message.matchAll(/\$\$(?<name>.*?)=(?<value>.*?)\$\$/g),
    );
    const current = matches[old.slotIndex];
    if (current !== undefined && current.index !== undefined) {
      const message =
        old.message.slice(0, current.index) +
        current[0] +
        " and " +
        current[0] +
        old.message.slice(current.index + current[0].length);
      const slots = [
        ...old.slots.slice(0, old.slotIndex + 1),
        { ...old.slots[old.slotIndex] }, // copy it
        ...old.slots.slice(old.slotIndex + 1),
      ];
      return o$1(old, {
        message,
        slots,
      });
    } else {
      return old;
    }
  };
}

/** Get the slot name
 * @param {string|Editor} message
 * @returns string;
 */
function slotName(message) {
  if (typeof message === "object" && message.type === "editor") {
    return message.slotName;
  }
  return "";
}
{
  Functions["slots"] = {
    init,
    cancel,
    update,
    hasSlots,
    duplicate,
    nextSlot,
    slotName,
    toString,
  };
}

const grid = '';

/**
 * Return an image or video element given the name + parameters
 * like "foo.mp4 autoplay loop".
 * @param {string} src
 * @param {string} title
 * @param {null|function():void} onload
 * @returns {Hole}
 */
function imageOrVideo(src, title, onload = null) {
  const match = /(?<src>.*\.(?:mp4|webm))(?<options>.*$)/.exec(src);

  if (match && match.groups) {
    // video
    const options = match.groups.options;
    const vsrc = match.groups.src;
    return html`<video
      is="video-db"
      dbsrc=${vsrc}
      title=${title}
      ?loop=${options.indexOf("loop") >= 0}
      ?autoplay=${options.indexOf("autoplay") >= 0}
      ?muted=${options.indexOf("muted") >= 0}
      @load=${onload}
    />`;
  } else {
    // image
    return html`<img
      is="img-db"
      dbsrc=${src}
      title=${title}
      @load=${onload}
    />`;
  }
}

class Grid extends TreeBase {
  fillItems = new Boolean$1(false);
  rows = new Integer(3);
  columns = new Integer(3);
  scale = new Float(1);
  name = new String$1("grid");
  background = new Color("white");

  allowedChildren = ["GridFilter"];

  /** @type {GridFilter[]} */
  children = [];

  page = 1;
  pageBoundaries = { 0: 0 }; //track starting indices of pages

  /** @param {Row} item */
  gridCell(item) {
    const name = this.name.value;
    /** @type {Hole[]} */
    let content;
    let msg = formatSlottedString(item.label || "");
    if (item.symbol) {
      content = [
        html`<div>
          <figure>
            ${imageOrVideo(item.symbol, item.label || "")}
            <figcaption>${msg}</figcaption>
          </figure>
        </div>`,
      ];
    } else {
      content = msg;
    }
    return html`<button
      tabindex="-1"
      data=${{
        ...item,
        ComponentName: name,
        ComponentType: this.className,
      }}
      ?disabled=${!item.label && !item.symbol}
    >
      ${content}
    </button>`;
  }

  emptyCell() {
    return html`<button tabindex="-1" disabled></button>`;
  }

  /**
   * Allow selecting pages in the grid
   *
   * @param {Number} pages
   * @param {Row} info
   */
  pageSelector(pages, info) {
    const { state } = Globals;
    const background = this.background.value;
    const name = this.name.value;

    return html`<div class="page-control">
      <div class="text">Page ${this.page} of ${pages}</div>
      <div class="back-next">
        <button
          style=${styleString({ backgroundColor: background })}
          .disabled=${this.page == 1}
          data=${{
            ...info,
            ComponentName: name,
            ComponentType: this.className,
          }}
          click
          @Activate=${() => {
            this.page = ((((this.page - 2) % pages) + pages) % pages) + 1;
            state.update(); // trigger redraw
          }}
          tabindex="-1"
        >
          &#9754;</button
        ><button
          .disabled=${this.page == pages}
          data=${{
            ...info,
            ComponentName: name,
            ComponentType: this.className,
          }}
          click
          @Activate=${() => {
            this.page = (this.page % pages) + 1;
            state.update(); // trigger redraw
          }}
          tabindex="-1"
        >
          &#9755;
        </button>
      </div>
    </div>`;
  }

  template() {
    /** @type {Partial<CSSStyleDeclaration>} */
    const style = { backgroundColor: this.background.value };
    const { data } = Globals;
    let rows = this.rows.value;
    let columns = this.columns.value;
    let fillItems = this.fillItems.value;
    /** @type {Rows} */
    let items = data.getMatchingRows(this.children);
    let maxPage = 1;
    const result = [];
    if (!fillItems) {
      // collect the items for the current page
      // and get the dimensions
      let maxRow = 0,
        maxColumn = 0;
      const itemMap = new Map();
      /**
       * @param {number} row
       * @param {number} column
       */
      const itemKey = (row, column) => row * 1000 + column;

      for (const item of items) {
        // ignore items without row and column
        if (!item.row || !item.column) continue;
        // get the max page value if any
        maxPage = Math.max(maxPage, item.page || 1);
        // collect the items on this page
        if (this.page == (item.page || 1)) {
          maxRow = Math.max(maxRow, item.row);
          maxColumn = Math.max(maxColumn, item.column);
          const key = itemKey(item.row, item.column);
          // only use the first one
          if (!itemMap.has(key)) itemMap.set(key, item);
        }
      }
      rows = maxRow;
      columns = maxColumn;
      for (let row = 1; row <= rows; row++) {
        for (let column = 1; column <= columns; column++) {
          if (maxPage > 1 && row == rows && column == columns) {
            // draw the page selector in the last cell
            result.push(this.pageSelector(maxPage, { row, column }));
          } else {
            const key = itemKey(row, column);
            if (itemMap.has(key)) {
              result.push(this.gridCell(itemMap.get(key)));
            } else {
              result.push(this.emptyCell());
            }
          }
        }
      }
    } else {
      // fill items sequentially
      let perPage = rows * columns;
      if (items.length > perPage) {
        perPage = perPage - 1;
      }
      maxPage = Math.ceil(items.length / perPage);
      // get the items on this page
      items = items.slice((this.page - 1) * perPage, this.page * perPage);
      // render them into the result
      for (let i = 0; i < items.length; i++) {
        const row = Math.floor(i / columns) + 1;
        const column = (i % columns) + 1;
        const item = { ...items[i], row, column };
        result.push(this.gridCell({ ...item, row: row, column: column }));
      }
      // fill any spaces that remain
      for (let i = items.length; i < perPage; i++) {
        result.push(this.emptyCell());
      }
      // draw the page selector if needed
      if (maxPage > 1) {
        result.push(this.pageSelector(maxPage, { row: rows, column: columns }));
      }
    }

    // empty result provokes a crash from uhtmlV4
    if (!result.length) {
      rows = columns = 1;
      result.push(this.emptyCell());
    }

    style.gridTemplate = `repeat(${rows}, calc(100% / ${rows})) / repeat(${columns}, 1fr)`;

    const body = html`<div style=${styleString(style)}>${result}</div>`;

    return this.component({}, body);
  }

  settingsDetails() {
    const props = this.props;
    const inputs = Object.values(props).map((prop) => prop.input());
    const filters = GridFilter.FilterSettings(this.children);
    return [html`<div>${filters}${inputs}</div>`];
  }

  settingsChildren() {
    return html`<div />`;
  }
}
TreeBase.register(Grid, "Grid");

const display = '';

class Display extends TreeBase {
  stateName = new String$1("$Display");
  Name = new String$1("");
  background = new Color("white");
  fontSize = new Float(2);
  scale = new Float(1);

  /** @type {HTMLDivElement | null} */
  current = null;

  static functionsInitialized = false;

  template() {
    const { state } = Globals;
    let value = state.get(this.stateName.value) || "";
    const content = formatSlottedString(value);
    return this.component(
      {
        style: {
          backgroundColor: this.background.value,
          fontSize: this.fontSize.value + "rem",
        },
      },
      html`<button
        ref=${this}
        @pointerup=${this.click}
        tabindex="-1"
        ?disabled=${!this.Name.value}
        data=${{
          name: this.Name.value,
          ComponentName: this.Name.value,
          ComponentType: this.className,
        }}
      >
        ${content}
      </button>`,
    );
  }

  /** Attempt to locate the word the user is touching
   */
  click = () => {
    const s = window.getSelection();
    if (!s) return;
    let word = "";
    if (s.isCollapsed) {
      s.modify("move", "forward", "character");
      s.modify("move", "backward", "word");
      s.modify("extend", "forward", "word");
      word = s.toString();
      s.modify("move", "forward", "character");
    } else {
      word = s.toString();
    }
    this.current?.setAttribute("data--clicked-word", word);
  };
}
TreeBase.register(Display, "Display");

const radio = '';

let Option$1 = class Option extends TreeBase {
  name = new String$1("", { hiddenLabel: true });
  value = new String$1("", { hiddenLabel: true });
  cache = {};
};
TreeBase.register(Option$1, "Option");

class Radio extends TreeBase {
  scale = new Float(1);
  label = new String$1("");
  stateName = new String$1("$radio");
  unselected = new Color("lightgray");
  selected = new Color("pink");

  allowedChildren = ["Option", "GridFilter"];

  /** @type {(Option | GridFilter)[]} */
  children = [];

  get options() {
    return this.filterChildren(Option$1);
  }

  /**
   * true if there exist rows with the this.filters and the value
   * @arg {Option} option
   * @returns {boolean}
   */
  valid(option) {
    const { data } = Globals;
    const filters = this.filterChildren(GridFilter);
    return (
      !filters.length ||
      data.hasMatchingRows(filters, {
        states: {
          [this.stateName.value]: option.value.value,
        },
      })
    );
  }

  /**
   * handle clicks on the chooser
   * @param {MouseEvent} event
   */
  handleClick({ target }) {
    if (target instanceof HTMLButtonElement) {
      const value = target.value;
      const name = this.stateName.value;
      Globals.state.update({ [name]: value });
    }
  }

  template() {
    const { state } = Globals;
    const stateName = this.stateName.value;
    const selected = this.selected.value;
    const unselected = this.unselected.value;
    const radioLabel = this.label.value;
    let currentValue = state.get(stateName);
    const choices = this.options.map((choice, index) => {
      const choiceDisabled = !this.valid(choice);
      const choiceValue = choice.value.value;
      const choiceName = choice.name.value;
      if (stateName && !currentValue && !choiceDisabled && choiceValue) {
        currentValue = choiceValue;
        state.define(stateName, choiceValue);
      }
      const color =
        choiceValue == currentValue || (!currentValue && index == 0)
          ? selected
          : unselected;
      return html`<button
        style=${styleString({ backgroundColor: color })}
        value=${choiceValue}
        ?disabled=${choiceDisabled}
        data=${{
          ComponentType: this.className,
          ComponentName: radioLabel || stateName,
          label: choiceName,
        }}
        click
        @Activate=${() => state.update({ [stateName]: choice.value.value })}
      >
        ${choiceName}
      </button>`;
    });

    return this.component(
      {},
      html`<fieldset class="flex">
        ${(radioLabel && [html`<legend>${radioLabel}</legend>`]) || []}
        ${choices}
      </fieldset>`,
    );
  }

  settingsDetails() {
    const props = this.props;
    const inputs = Object.values(props).map((prop) => prop.input());
    const filters = this.filterChildren(GridFilter);
    const editFilters = !filters.length
      ? []
      : [GridFilter.FilterSettings(filters)];
    const options = this.filterChildren(Option$1);
    const editOptions = html`<fieldset>
      <legend>Options</legend>
      <table class="RadioOptions">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          ${options.map(
            (option, index) => html`
              <tr>
                <td>${index + 1}</td>
                <td>${option.name.input()}</td>
                <td>${option.value.input()}</td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    </fieldset>`;
    return [html`<div>${editFilters}${editOptions}${inputs}</div>`];
  }

  settingsChildren() {
    return html`<div />`;
  }
}
TreeBase.register(Radio, "Radio");

const gap = '';

class Gap extends TreeBase {
  scale = new Float(1);
  background = new Color("");

  template() {
    return this.component(
      {
        style: styleString({
          backgroundColor: this.background.value,
        }),
      },
      html`<div />`,
    );
  }
}
TreeBase.register(Gap, "Gap");

const tabcontrol = '';

/** @type {Function[]} */
const PostRenderFunctions = [];
/** @param {Function} f */
function callAfterRender(f) {
  PostRenderFunctions.push(f);
}
function postRender() {
  while (PostRenderFunctions.length > 0) {
    const PRF = PostRenderFunctions.pop();
    if (PRF) PRF();
  }
}

/** @param {string} id
 * @param {TreeBase} component
 */
function safeRender(id, component) {
  const where = document.getElementById(id);
  if (!where) {
    console.error({ id, where });
    return;
  }
  let r;
  {
    try {
      let what = component.safeTemplate();
      if (Array.isArray(what)) what = html`${what}`;
      r = render(where, what);
    } catch (error) {
      if (error instanceof Error) {
        errorHandler(error, ` rendering ${component.className} ${id}`);
      } else {
        console.error("crash", error);
      }
      return;
    }
  }
  return r;
}

class TabControl extends TreeBase {
  stateName = new String$1("$tabControl");
  background = new Color("");
  scale = new Float(6);
  tabEdge = new Select(["bottom", "top", "left", "right", "none"], {
    defaultValue: "top",
  });
  name = new String$1("tabs");

  allowedChildren = ["TabPanel"];

  /** @type {TabPanel[]} */
  children = [];

  /** @type {TabPanel | undefined} */
  currentPanel = undefined;

  template() {
    const { state } = Globals;
    const panels = this.children;
    let activeTabName = state.get(this.stateName.value);
    // collect panel info
    panels.forEach((panel, index) => {
      panel.tabName = state.interpolate(panel.name.value); // internal name
      panel.tabLabel = state.interpolate(panel.label.value || panel.name.value); // display name
      if (index == 0 && !activeTabName) {
        activeTabName = panel.tabName;
        state.define(this.stateName.value, panel.tabName);
      }
      panel.active = activeTabName == panel.tabName || panels.length === 1;
    });
    let buttons = [];
    if (this.tabEdge.value != "none") {
      buttons = panels
        .filter((panel) => panel.label.value != "UNLABELED")
        .map((panel) => {
          const color = panel.background.value;
          const buttonStyle = {
            backgroundColor: color,
          };
          return html`<li>
            <button
              ?active=${panel.active}
              style=${styleString(buttonStyle)}
              data=${{
                name: this.name.value,
                label: panel.tabLabel,
                component: this.constructor.name,
                id: panel.id,
              }}
              click
              @Activate=${() => {
                this.switchTab(panel.tabName);
              }}
              tabindex="-1"
            >
              ${panel.tabLabel}
            </button>
          </li>`;
        });
    }
    return this.component(
      { classes: [this.tabEdge.value] },
      html`
        <ul class="buttons">
          ${buttons}
        </ul>
        <div class="panels flex">
          ${panels.map((panel) => panel.safeTemplate())}
        </div>
      `,
    );
  }

  /**
   * @param {string} tabName
   */
  switchTab(tabName) {
    Globals.state.update({ [this.stateName.value]: tabName });
  }
}
TreeBase.register(TabControl, "TabControl");

class TabPanel extends Stack {
  name = new String$1("");
  label = new String$1("");

  /** @type {TabControl | null} */
  parent = null;

  active = false;
  tabName = "";
  tabLabel = "";
  lastFocused = "";

  /**
   * Render the details of a components settings
   */
  settingsDetails() {
    const caption = this.active ? "Active" : "Activate";
    let details = super.settingsDetails();
    if (!Array.isArray(details)) details = [details];
    return [
      ...details,
      html`<button
        id=${this.id + "-activate"}
        ?active=${this.active}
        @click=${() => {
          if (this.parent) {
            const parent = this.parent;
            callAfterRender(() => {
              Globals.layout.highlight();
            });
            parent.switchTab(this.name.value);
          }
        }}
      >
        ${caption}
      </button>`,
    ];
  }

  /** @param {string[]} classes
   * @returns {string}
   */
  CSSClasses(...classes) {
    if (this.active) {
      classes.push("ActivePanel");
    }
    return super.CSSClasses(...classes);
  }

  highlight() {}
}
TreeBase.register(TabPanel, "TabPanel");

const modalDialog = '';

class ModalDialog extends TreeBase {
  stateName = new String$1("$modalOpen");
  open = new Boolean$1(false);

  allowedChildren = ["Stack"];

  template() {
    const state = Globals.state;
    const open =
      !!state.get(this.stateName.value) || this.open.value ? "open" : "";
    return this.component(
      { classes: [open] },
      html`<div>${this.children.map((child) => child.safeTemplate())}</div>`,
    );
  }
}
TreeBase.register(ModalDialog, "ModalDialog");

const vsd = '';

/** Allow await'ing for a short time
 * @param {number} ms */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Wait for a condition to be satisfied
 * @param {() => boolean} test
 * @param {number} delay */
async function waitFor(test, delay = 100) {
  while (!test()) await sleep(delay);
}

/**
 * Calculate the actual image size undoing the effects of object-fit
 * This is async so it can wait for the image to be loaded initially.
 *
 * @param {HTMLImageElement} img
 * */
async function getActualImageSize(img) {
  let left = 0,
    top = 0,
    width = 1,
    height = 1;
  if (img) {
    // wait for the image to load
    await waitFor(() => img.complete && img.naturalWidth != 0);
    const vsd = /** @type {HTMLDivElement} */ (img.closest("div.vsd"));
    const cw = img.width,
      ch = img.height,
      iw = img.naturalWidth,
      ih = img.naturalHeight,
      pw = vsd.clientWidth,
      ph = vsd.clientHeight,
      iratio = iw / ih,
      cratio = cw / ch;
    if (iratio > cratio) {
      width = cw;
      height = cw / iratio;
    } else {
      width = ch * iratio;
      height = ch;
    }
    left = (pw - width) / 2;
    top = (ph - height) / 2;
  }
  return { left, top, width, height };
}

/** @param {number} v */
function px(v) {
  return `${v}px`;
}
/** @param {number} v */
function pct(v) {
  return `${v}%`;
}

/** @typedef {Object} vsdData
 * @property {number} x
 * @property {number} y
 * @property {number} w
 * @property {number} h
 * @property {string} image
 * @property {boolean} invisible
 */
/** @typedef {Row & vsdData} VRow */
class VSD extends TreeBase {
  name = new String$1("vsd");
  scale = new Float(1);

  /** @type {GridFilter[]} */
  children = [];

  allowedChildren = ["GridFilter"];

  /** @type {HTMLDivElement} */
  markers;

  template() {
    const { data, state, actions } = Globals;
    const editing = state.get("editing");
    const items = /** @type {VRow[]} */ (data.getMatchingRows(this.children));
    const src = items.find((item) => item.image)?.image || "";
    let dragging = 0;
    const coords = [
      [0, 0], // start x and y
      [0, 0], // end x and y
    ];
    let clip = "";

    return this.component(
      { classes: ["show"] },
      html`<div>
        ${imageOrVideo(src, "", () => {
          this.sizeMarkers(this.markers);
        })}
        <div
          class="markers"
          ref=${(/** @type {HTMLDivElement & { observer: any }} */ node) => {
            this.sizeMarkers(node);
          }}
          @pointermove=${editing &&
          ((/** @type {PointerEvent} */ event) => {
            const rect = this.markers.getBoundingClientRect();
            const div = document.querySelector("#UI span.coords");
            if (!div) return;
            coords[dragging][0] = Math.round(
              (100 * (event.pageX - rect.left)) / rect.width,
            );
            coords[dragging][1] = Math.round(
              (100 * (event.pageY - rect.top)) / rect.height,
            );
            clip = `${coords[0][0]}\t${coords[0][1]}`;
            if (dragging) {
              clip =
                clip +
                `\t${coords[1][0] - coords[0][0]}\t${
                  coords[1][1] - coords[0][1]
                }`;
            }
            div.innerHTML = clip;
          })}
          @pointerdown=${editing &&
          (() => {
            dragging = 1;
          })}
          @pointerup=${editing &&
          (() => {
            dragging = 0;
            navigator.clipboard.writeText(clip);
          })}
        >
          ${items
            .filter((item) => item.w)
            .map(
              (item) =>
                html`<button
                  style=${styleString({
                    left: pct(item.x),
                    top: pct(item.y),
                    width: pct(item.w),
                    height: pct(item.h),
                    position: "absolute",
                  })}
                  ?invisible=${!!item.invisible}
                  data=${{
                    ComponentName: this.name.value,
                    ComponentType: this.constructor.name,
                    ...item,
                  }}
                  click
                  @Activate=${actions.handler(this.name.value, item, "press")}
                >
                  <span>${item.label || ""}</span>
                </button>`,
            )}
          <span class="coords" style="background-color: white"></span>
        </div>
      </div>`,
    );
  }

  /** @param {HTMLDivElement} node */
  async sizeMarkers(node) {
    this.markers = node;
    const img = /** @type {HTMLImageElement} */ (node.previousElementSibling);
    const rect = await getActualImageSize(img);
    node.style.position = "absolute";
    node.style.left = px(rect.left);
    node.style.top = px(rect.top);
    node.style.width = px(rect.width);
    node.style.height = px(rect.height);
  }

  settingsDetails() {
    const props = this.props;
    const inputs = Object.values(props).map((prop) => prop.input());
    const filters = GridFilter.FilterSettings(this.children);
    return [html`<div>${filters}${inputs}</div>`];
  }

  settingsChildren() {
    return html`<div />`;
  }
}
TreeBase.register(VSD, "VSD");

const button = '';

class Button extends TreeBase {
  label = new String$1("click me");
  name = new String$1("button");
  background = new Color("");
  scale = new Float(1);

  template() {
    const style = styleString({ backgroundColor: this.background.value });
    const name = this.name.value;
    const label = this.label.value;
    return this.component(
      {},
      html`<button
        class="button"
        name=${name}
        style=${style}
        data=${{
          name: name,
          label: label,
          ComponentName: name,
          ComponentType: this.constructor.name,
        }}
      >
        ${label}
      </button>`,
    );
  }

  getChildren() {
    return [];
  }
}
TreeBase.register(Button, "Button");

const monitor = '';

class Monitor extends TreeBase {
  template() {
    const { state, actions: rules } = Globals;
    const stateKeys = [
      ...new Set([...Object.keys(state.values), ...accessed.keys()]),
    ].sort();
    const s = html`<table class="state">
      <thead>
        <tr>
          <th>State</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        ${stateKeys
          .filter((key) => key.startsWith("$"))
          .map((key) => {
            let value = state.get(key);
            value = toString(value);
            let clamped = value.slice(0, 30);
            if (value.length > clamped.length) {
              clamped += "...";
            }
            return html`<tr
              ?updated=${state.hasBeenUpdated(key)}
              ?undefined=${accessed.get(key) === false}
            >
              <td>${key}</td>
              <td>${clamped}</td>
            </tr>`;
          })}
      </tbody>
    </table>`;

    const row = rules.last.data || {};
    const rowAccessedKeys = [...accessed.keys()]
      .filter((key) => key.startsWith("_"))
      .map((key) => key.slice(1));
    const rowKeys = [
      ...new Set([...Object.keys(row), ...rowAccessedKeys]),
    ].sort();
    const f = html`<table class="fields">
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        ${rowKeys.map((key) => {
          const value = row[key];
          return html`<tr
            ?undefined=${accessed.get(`_${key}`) === false}
            ?accessed=${accessed.has(`_${key}`)}
          >
            <td>#${key}</td>
            <td>${value}</td>
          </tr>`;
        })}
      </tbody>
    </table>`;

    return html`<button
        @click=${() => {
          state.clear();
          rules.configure();
        }}
      >
        Clear state
      </button>
      <div>${s}${f}</div>`;
  }
}
TreeBase.register(Monitor, "Monitor");

class Speech extends TreeBase {
  stateName = new String$1("$Speak");
  voiceURI = new Voice("", { label: "Voice" });
  pitch = new Float(1);
  rate = new Float(1);
  volume = new Float(1);

  async speak() {
    const { state } = Globals;
    const voiceURI = this.voiceURI.value;
    const message = toString(state.get(this.stateName.value));
    const voices = await getVoices();
    const voice =
      voiceURI && voices.find((voice) => voice.voiceURI == voiceURI);
    const utterance = new SpeechSynthesisUtterance(message);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    utterance.pitch = this.pitch.value;
    utterance.rate = this.rate.value;
    utterance.volume = this.volume.value;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  template() {
    const { state } = Globals;
    if (state.hasBeenUpdated(this.stateName.value)) {
      this.speak();
    }
    return html`<div />`;
  }
}
TreeBase.register(Speech, "Speech");

/** @type{SpeechSynthesisVoice[]} */
let voices = [];

/**
 * Promise to return voices
 *
 * @return {Promise<SpeechSynthesisVoice[]>} Available voices
 */
function getVoices() {
  return new Promise(function (resolve) {
    // iOS won't fire the voiceschanged event so we have to poll for them
    function f() {
      voices = (voices.length && voices) || speechSynthesis.getVoices();
      if (voices.length) resolve(voices);
      else setTimeout(f, 100);
    }
    f();
  });
}

class VoiceSelect extends HTMLSelectElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.addVoices();
  }

  async addVoices() {
    const voices = await getVoices();
    const current = this.getAttribute("value");
    for (const voice of voices) {
      const item = document.createElement("option");
      item.value = voice.voiceURI;
      if (voice.voiceURI == current) item.setAttribute("selected", "");
      item.innerText = voice.name;
      this.add(item);
    }
  }
}
customElements.define("select-voice", VoiceSelect, { extends: "select" });

const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
    return (idbProxyableTypes ||
        (idbProxyableTypes = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
        ]));
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
    return (cursorAdvanceMethods ||
        (cursorAdvanceMethods = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey,
        ]));
}
const cursorRequestMap = new WeakMap();
const transactionDoneMap = new WeakMap();
const transactionStoreNamesMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
        const unlisten = () => {
            request.removeEventListener('success', success);
            request.removeEventListener('error', error);
        };
        const success = () => {
            resolve(wrap(request.result));
            unlisten();
        };
        const error = () => {
            reject(request.error);
            unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
    });
    promise
        .then((value) => {
        // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
        // (see wrapFunction).
        if (value instanceof IDBCursor) {
            cursorRequestMap.set(value, request);
        }
        // Catching to avoid "Uncaught Promise exceptions"
    })
        .catch(() => { });
    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.
    reverseTransformCache.set(promise, request);
    return promise;
}
function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx))
        return;
    const done = new Promise((resolve, reject) => {
        const unlisten = () => {
            tx.removeEventListener('complete', complete);
            tx.removeEventListener('error', error);
            tx.removeEventListener('abort', error);
        };
        const complete = () => {
            resolve();
            unlisten();
        };
        const error = () => {
            reject(tx.error || new DOMException('AbortError', 'AbortError'));
            unlisten();
        };
        tx.addEventListener('complete', complete);
        tx.addEventListener('error', error);
        tx.addEventListener('abort', error);
    });
    // Cache it for later retrieval.
    transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
    get(target, prop, receiver) {
        if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === 'done')
                return transactionDoneMap.get(target);
            // Polyfill for objectStoreNames because of Edge.
            if (prop === 'objectStoreNames') {
                return target.objectStoreNames || transactionStoreNamesMap.get(target);
            }
            // Make tx.store return the only store in the transaction, or undefined if there are many.
            if (prop === 'store') {
                return receiver.objectStoreNames[1]
                    ? undefined
                    : receiver.objectStore(receiver.objectStoreNames[0]);
            }
        }
        // Else transform whatever we get back.
        return wrap(target[prop]);
    },
    set(target, prop, value) {
        target[prop] = value;
        return true;
    },
    has(target, prop) {
        if (target instanceof IDBTransaction &&
            (prop === 'done' || prop === 'store')) {
            return true;
        }
        return prop in target;
    },
};
function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
    if (func === IDBDatabase.prototype.transaction &&
        !('objectStoreNames' in IDBTransaction.prototype)) {
        return function (storeNames, ...args) {
            const tx = func.call(unwrap(this), storeNames, ...args);
            transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
            return wrap(tx);
        };
    }
    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.
    if (getCursorAdvanceMethods().includes(func)) {
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            func.apply(unwrap(this), args);
            return wrap(cursorRequestMap.get(this));
        };
    }
    return function (...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap(func.apply(unwrap(this), args));
    };
}
function transformCachableValue(value) {
    if (typeof value === 'function')
        return wrapFunction(value);
    // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).
    if (value instanceof IDBTransaction)
        cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
        return new Proxy(value, idbProxyTraps);
    // Return the same value back if we're not going to transform it.
    return value;
}
function wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest)
        return promisifyRequest(value);
    // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.
    if (transformCache.has(value))
        return transformCache.get(value);
    const newValue = transformCachableValue(value);
    // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.
    if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
    }
    return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);

/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
        request.addEventListener('upgradeneeded', (event) => {
            upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
        });
    }
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event.newVersion, event));
    }
    openPromise
        .then((db) => {
        if (terminated)
            db.addEventListener('close', () => terminated());
        if (blocking) {
            db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));
        }
    })
        .catch(() => { });
    return openPromise;
}

const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
const writeMethods = ['put', 'add', 'delete', 'clear'];
const cachedMethods = new Map();
function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase &&
        !(prop in target) &&
        typeof prop === 'string')) {
        return;
    }
    if (cachedMethods.get(prop))
        return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, '');
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
        !(isWrite || readMethods.includes(targetFuncName))) {
        return;
    }
    const method = async function (storeName, ...args) {
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
        let target = tx.store;
        if (useIndex)
            target = target.index(args.shift());
        // Must reject if op rejects.
        // If it's a write operation, must reject if tx.done rejects.
        // Must reject with op rejection first.
        // Must resolve with op value.
        // Must handle both promises (no unhandled rejections)
        return (await Promise.all([
            target[targetFuncName](...args),
            isWrite && tx.done,
        ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
}
replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
}));

const advanceMethodProps = ['continue', 'continuePrimaryKey', 'advance'];
const methodMap = {};
const advanceResults = new WeakMap();
const ittrProxiedCursorToOriginalProxy = new WeakMap();
const cursorIteratorTraps = {
    get(target, prop) {
        if (!advanceMethodProps.includes(prop))
            return target[prop];
        let cachedFunc = methodMap[prop];
        if (!cachedFunc) {
            cachedFunc = methodMap[prop] = function (...args) {
                advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
            };
        }
        return cachedFunc;
    },
};
async function* iterate(...args) {
    // tslint:disable-next-line:no-this-assignment
    let cursor = this;
    if (!(cursor instanceof IDBCursor)) {
        cursor = await cursor.openCursor(...args);
    }
    if (!cursor)
        return;
    cursor = cursor;
    const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
    ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
    // Map this double-proxy back to the original, so other cursor methods work.
    reverseTransformCache.set(proxiedCursor, unwrap(cursor));
    while (cursor) {
        yield proxiedCursor;
        // If one of the advancing methods was not called, call continue().
        cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
        advanceResults.delete(proxiedCursor);
    }
}
function isIteratorProp(target, prop) {
    return ((prop === Symbol.asyncIterator &&
        instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor])) ||
        (prop === 'iterate' && instanceOfAny(target, [IDBIndex, IDBObjectStore])));
}
replaceTraps((oldTraps) => ({
    ...oldTraps,
    get(target, prop, receiver) {
        if (isIteratorProp(target, prop))
            return iterate;
        return oldTraps.get(target, prop, receiver);
    },
    has(target, prop) {
        return isIteratorProp(target, prop) || oldTraps.has(target, prop);
    },
}));

// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
// Some of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// However, the vast majority of the codebase has diverged from UZIP.js to increase performance and reduce bundle size.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).

// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
// code length index map
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
// get base, reverse index map from extra bits
var freb = function (eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
    }
    // numbers here are at max 18 bits
    var r = new i32(b[30]);
    for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
            r[j] = ((j - b[i]) << 5) | i;
        }
    }
    return { b: b, r: r };
};
var _a = freb(fleb, 2), fl = _a.b, revfl = _a.r;
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b.b, revfd = _b.r;
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
    // reverse table algorithm from SO
    var x = ((i & 0xAAAA) >> 1) | ((i & 0x5555) << 1);
    x = ((x & 0xCCCC) >> 2) | ((x & 0x3333) << 2);
    x = ((x & 0xF0F0) >> 4) | ((x & 0x0F0F) << 4);
    rev[i] = (((x & 0xFF00) >> 8) | ((x & 0x00FF) << 8)) >> 1;
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap = (function (cd, mb, r) {
    var s = cd.length;
    // index
    var i = 0;
    // u16 "map": index -> # of codes with bit length = index
    var l = new u16(mb);
    // length of cd must be 288 (total # of codes)
    for (; i < s; ++i) {
        if (cd[i])
            ++l[cd[i] - 1];
    }
    // u16 "map": index -> minimum code for bit length = index
    var le = new u16(mb);
    for (i = 1; i < mb; ++i) {
        le[i] = (le[i - 1] + l[i - 1]) << 1;
    }
    var co;
    if (r) {
        // u16 "map": index -> number of actual bits, symbol for code
        co = new u16(1 << mb);
        // bits to remove for reverser
        var rvb = 15 - mb;
        for (i = 0; i < s; ++i) {
            // ignore 0 lengths
            if (cd[i]) {
                // num encoding both symbol and bits read
                var sv = (i << 4) | cd[i];
                // free bits
                var r_1 = mb - cd[i];
                // start value
                var v = le[cd[i] - 1]++ << r_1;
                // m is end value
                for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                    // every 16 bit value starting with the code yields the same result
                    co[rev[v] >> rvb] = sv;
                }
            }
        }
    }
    else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
            if (cd[i]) {
                co[i] = rev[le[cd[i] - 1]++] >> (15 - cd[i]);
            }
        }
    }
    return co;
});
// fixed length tree
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
    flt[i] = 8;
for (var i = 144; i < 256; ++i)
    flt[i] = 9;
for (var i = 256; i < 280; ++i)
    flt[i] = 7;
for (var i = 280; i < 288; ++i)
    flt[i] = 8;
// fixed distance tree
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
    fdt[i] = 5;
// fixed length map
var flm = /*#__PURE__*/ hMap(flt, 9, 0), flrm = /*#__PURE__*/ hMap(flt, 9, 1);
// fixed distance map
var fdm = /*#__PURE__*/ hMap(fdt, 5, 0), fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);
// find max of array
var max = function (a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
        if (a[i] > m)
            m = a[i];
    }
    return m;
};
// read d, starting at bit p and mask with m
var bits = function (d, p, m) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
};
// read d, starting at bit p continuing for at least 16 bits
var bits16 = function (d, p) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7));
};
// get end of byte
var shft = function (p) { return ((p + 7) / 8) | 0; };
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
    if (s == null || s < 0)
        s = 0;
    if (e == null || e > v.length)
        e = v.length;
    // can't use .constructor in case user-supplied
    return new u8(v.subarray(s, e));
};
// error codes
var ec = [
    'unexpected EOF',
    'invalid block type',
    'invalid length/literal',
    'invalid distance',
    'stream finished',
    'no stream handler',
    ,
    'no callback',
    'invalid UTF-8 data',
    'extra field too long',
    'date not in range 1980-2099',
    'filename too long',
    'stream finishing',
    'invalid zip data'
    // determined by unknown compression method
];
var err = function (ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
        Error.captureStackTrace(e, err);
    if (!nt)
        throw e;
    return e;
};
// expands raw DEFLATE data
var inflt = function (dat, st, buf, dict) {
    // source length       dict length
    var sl = dat.length, dl = dict ? dict.length : 0;
    if (!sl || st.f && !st.l)
        return buf || new u8(0);
    var noBuf = !buf;
    // have to estimate size
    var resize = noBuf || st.i != 2;
    // no state
    var noSt = st.i;
    // Assumes roughly 33% compression ratio average
    if (noBuf)
        buf = new u8(sl * 3);
    // ensure buffer can fit at least l elements
    var cbuf = function (l) {
        var bl = buf.length;
        // need to increase size to fit
        if (l > bl) {
            // Double or set to necessary, whichever is greater
            var nbuf = new u8(Math.max(bl * 2, l));
            nbuf.set(buf);
            buf = nbuf;
        }
    };
    //  last chunk         bitpos           bytes
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    // total bits
    var tbts = sl * 8;
    do {
        if (!lm) {
            // BFINAL - this is only 1 when last chunk is next
            final = bits(dat, pos, 1);
            // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
            var type = bits(dat, pos + 1, 3);
            pos += 3;
            if (!type) {
                // go to end of byte boundary
                var s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
                if (t > sl) {
                    if (noSt)
                        err(0);
                    break;
                }
                // ensure size
                if (resize)
                    cbuf(bt + l);
                // Copy over uncompressed data
                buf.set(dat.subarray(s, t), bt);
                // Get new bitpos, update byte count
                st.b = bt += l, st.p = pos = t * 8, st.f = final;
                continue;
            }
            else if (type == 1)
                lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
            else if (type == 2) {
                //  literal                            lengths
                var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
                var tl = hLit + bits(dat, pos + 5, 31) + 1;
                pos += 14;
                // length+distance tree
                var ldt = new u8(tl);
                // code length tree
                var clt = new u8(19);
                for (var i = 0; i < hcLen; ++i) {
                    // use index map to get real code
                    clt[clim[i]] = bits(dat, pos + i * 3, 7);
                }
                pos += hcLen * 3;
                // code lengths bits
                var clb = max(clt), clbmsk = (1 << clb) - 1;
                // code lengths map
                var clm = hMap(clt, clb, 1);
                for (var i = 0; i < tl;) {
                    var r = clm[bits(dat, pos, clbmsk)];
                    // bits read
                    pos += r & 15;
                    // symbol
                    var s = r >> 4;
                    // code length to copy
                    if (s < 16) {
                        ldt[i++] = s;
                    }
                    else {
                        //  copy   count
                        var c = 0, n = 0;
                        if (s == 16)
                            n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
                        else if (s == 17)
                            n = 3 + bits(dat, pos, 7), pos += 3;
                        else if (s == 18)
                            n = 11 + bits(dat, pos, 127), pos += 7;
                        while (n--)
                            ldt[i++] = c;
                    }
                }
                //    length tree                 distance tree
                var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
                // max length bits
                lbt = max(lt);
                // max dist bits
                dbt = max(dt);
                lm = hMap(lt, lbt, 1);
                dm = hMap(dt, dbt, 1);
            }
            else
                err(1);
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
        }
        // Make sure the buffer can hold this + the largest possible addition
        // Maximum chunk size (practically, theoretically infinite) is 2^17
        if (resize)
            cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (;; lpos = pos) {
            // bits read, code
            var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
            pos += c & 15;
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
            if (!c)
                err(2);
            if (sym < 256)
                buf[bt++] = sym;
            else if (sym == 256) {
                lpos = pos, lm = null;
                break;
            }
            else {
                var add = sym - 254;
                // no extra bits needed if less
                if (sym > 264) {
                    // index
                    var i = sym - 257, b = fleb[i];
                    add = bits(dat, pos, (1 << b) - 1) + fl[i];
                    pos += b;
                }
                // dist
                var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
                if (!d)
                    err(3);
                pos += d & 15;
                var dt = fd[dsym];
                if (dsym > 3) {
                    var b = fdeb[dsym];
                    dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
                }
                if (pos > tbts) {
                    if (noSt)
                        err(0);
                    break;
                }
                if (resize)
                    cbuf(bt + 131072);
                var end = bt + add;
                if (bt < dt) {
                    var shift = dl - dt, dend = Math.min(dt, end);
                    if (shift + bt < 0)
                        err(3);
                    for (; bt < dend; ++bt)
                        buf[bt] = dict[shift + bt];
                }
                for (; bt < end; ++bt)
                    buf[bt] = buf[bt - dt];
            }
        }
        st.l = lm, st.p = lpos, st.b = bt, st.f = final;
        if (lm)
            final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    // don't reallocate for streams or user buffers
    return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
// starting at p, write the minimum number of bits that can hold v to d
var wbits = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >> 8;
};
// starting at p, write the minimum number of bits (>8) that can hold v to d
var wbits16 = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >> 8;
    d[o + 2] |= v >> 16;
};
// creates code lengths from a frequency table
var hTree = function (d, mb) {
    // Need extra info to make a tree
    var t = [];
    for (var i = 0; i < d.length; ++i) {
        if (d[i])
            t.push({ s: i, f: d[i] });
    }
    var s = t.length;
    var t2 = t.slice();
    if (!s)
        return { t: et, l: 0 };
    if (s == 1) {
        var v = new u8(t[0].s + 1);
        v[t[0].s] = 1;
        return { t: v, l: 1 };
    }
    t.sort(function (a, b) { return a.f - b.f; });
    // after i2 reaches last ind, will be stopped
    // freq must be greater than largest possible number of symbols
    t.push({ s: -1, f: 25001 });
    var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
    t[0] = { s: -1, f: l.f + r.f, l: l, r: r };
    // efficient algorithm from UZIP.js
    // i0 is lookbehind, i2 is lookahead - after processing two low-freq
    // symbols that combined have high freq, will start processing i2 (high-freq,
    // non-composite) symbols instead
    // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
    while (i1 != s - 1) {
        l = t[t[i0].f < t[i2].f ? i0++ : i2++];
        r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
        t[i1++] = { s: -1, f: l.f + r.f, l: l, r: r };
    }
    var maxSym = t2[0].s;
    for (var i = 1; i < s; ++i) {
        if (t2[i].s > maxSym)
            maxSym = t2[i].s;
    }
    // code lengths
    var tr = new u16(maxSym + 1);
    // max bits in tree
    var mbt = ln(t[i1 - 1], tr, 0);
    if (mbt > mb) {
        // more algorithms from UZIP.js
        // TODO: find out how this code works (debt)
        //  ind    debt
        var i = 0, dt = 0;
        //    left            cost
        var lft = mbt - mb, cst = 1 << lft;
        t2.sort(function (a, b) { return tr[b.s] - tr[a.s] || a.f - b.f; });
        for (; i < s; ++i) {
            var i2_1 = t2[i].s;
            if (tr[i2_1] > mb) {
                dt += cst - (1 << (mbt - tr[i2_1]));
                tr[i2_1] = mb;
            }
            else
                break;
        }
        dt >>= lft;
        while (dt > 0) {
            var i2_2 = t2[i].s;
            if (tr[i2_2] < mb)
                dt -= 1 << (mb - tr[i2_2]++ - 1);
            else
                ++i;
        }
        for (; i >= 0 && dt; --i) {
            var i2_3 = t2[i].s;
            if (tr[i2_3] == mb) {
                --tr[i2_3];
                ++dt;
            }
        }
        mbt = mb;
    }
    return { t: new u8(tr), l: mbt };
};
// get the max length and assign length codes
var ln = function (n, l, d) {
    return n.s == -1
        ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1))
        : (l[n.s] = d);
};
// length codes generation
var lc = function (c) {
    var s = c.length;
    // Note that the semicolon was intentional
    while (s && !c[--s])
        ;
    var cl = new u16(++s);
    //  ind      num         streak
    var cli = 0, cln = c[0], cls = 1;
    var w = function (v) { cl[cli++] = v; };
    for (var i = 1; i <= s; ++i) {
        if (c[i] == cln && i != s)
            ++cls;
        else {
            if (!cln && cls > 2) {
                for (; cls > 138; cls -= 138)
                    w(32754);
                if (cls > 2) {
                    w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305);
                    cls = 0;
                }
            }
            else if (cls > 3) {
                w(cln), --cls;
                for (; cls > 6; cls -= 6)
                    w(8304);
                if (cls > 2)
                    w(((cls - 3) << 5) | 8208), cls = 0;
            }
            while (cls--)
                w(cln);
            cls = 1;
            cln = c[i];
        }
    }
    return { c: cl.subarray(0, cli), n: s };
};
// calculate the length of output from tree, code lengths
var clen = function (cf, cl) {
    var l = 0;
    for (var i = 0; i < cl.length; ++i)
        l += cf[i] * cl[i];
    return l;
};
// writes a fixed block
// returns the new bit pos
var wfblk = function (out, pos, dat) {
    // no need to write 00 as type: TypedArray defaults to 0
    var s = dat.length;
    var o = shft(pos + 2);
    out[o] = s & 255;
    out[o + 1] = s >> 8;
    out[o + 2] = out[o] ^ 255;
    out[o + 3] = out[o + 1] ^ 255;
    for (var i = 0; i < s; ++i)
        out[o + i + 4] = dat[i];
    return (o + 4 + s) * 8;
};
// writes a block
var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
    wbits(out, p++, final);
    ++lf[256];
    var _a = hTree(lf, 15), dlt = _a.t, mlb = _a.l;
    var _b = hTree(df, 15), ddt = _b.t, mdb = _b.l;
    var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
    var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
    var lcfreq = new u16(19);
    for (var i = 0; i < lclt.length; ++i)
        ++lcfreq[lclt[i] & 31];
    for (var i = 0; i < lcdt.length; ++i)
        ++lcfreq[lcdt[i] & 31];
    var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
    var nlcc = 19;
    for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
    var flen = (bl + 5) << 3;
    var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
    var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
    if (bs >= 0 && flen <= ftlen && flen <= dtlen)
        return wfblk(out, p, dat.subarray(bs, bs + bl));
    var lm, ll, dm, dl;
    wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
    if (dtlen < ftlen) {
        lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
        var llm = hMap(lct, mlcb, 0);
        wbits(out, p, nlc - 257);
        wbits(out, p + 5, ndc - 1);
        wbits(out, p + 10, nlcc - 4);
        p += 14;
        for (var i = 0; i < nlcc; ++i)
            wbits(out, p + 3 * i, lct[clim[i]]);
        p += 3 * nlcc;
        var lcts = [lclt, lcdt];
        for (var it = 0; it < 2; ++it) {
            var clct = lcts[it];
            for (var i = 0; i < clct.length; ++i) {
                var len = clct[i] & 31;
                wbits(out, p, llm[len]), p += lct[len];
                if (len > 15)
                    wbits(out, p, (clct[i] >> 5) & 127), p += clct[i] >> 12;
            }
        }
    }
    else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
    }
    for (var i = 0; i < li; ++i) {
        var sym = syms[i];
        if (sym > 255) {
            var len = (sym >> 18) & 31;
            wbits16(out, p, lm[len + 257]), p += ll[len + 257];
            if (len > 7)
                wbits(out, p, (sym >> 23) & 31), p += fleb[len];
            var dst = sym & 31;
            wbits16(out, p, dm[dst]), p += dl[dst];
            if (dst > 3)
                wbits16(out, p, (sym >> 5) & 8191), p += fdeb[dst];
        }
        else {
            wbits16(out, p, lm[sym]), p += ll[sym];
        }
    }
    wbits16(out, p, lm[256]);
    return p + ll[256];
};
// deflate options (nice << 13) | chain
var deo = /*#__PURE__*/ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
// empty
var et = /*#__PURE__*/ new u8(0);
// compresses data into a raw DEFLATE buffer
var dflt = function (dat, lvl, plvl, pre, post, st) {
    var s = st.z || dat.length;
    var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7000)) + post);
    // writing to this writes to the output buffer
    var w = o.subarray(pre, o.length - post);
    var lst = st.l;
    var pos = (st.r || 0) & 7;
    if (lvl) {
        if (pos)
            w[0] = st.r >> 3;
        var opt = deo[lvl - 1];
        var n = opt >> 13, c = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        //    prev 2-byte val map    curr 2-byte val map
        var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = function (i) { return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1; };
        // 24576 is an arbitrary number of maximum symbols per block
        // 424 buffer for last block
        var syms = new i32(25000);
        // length/literal freq   distance freq
        var lf = new u16(288), df = new u16(32);
        //  l/lcnt  exbits  index          l/lind  waitdx          blkpos
        var lc_1 = 0, eb = 0, i = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
        for (; i + 2 < s; ++i) {
            // hash value
            var hv = hsh(i);
            // index mod 32768    previous index mod
            var imod = i & 32767, pimod = head[hv];
            prev[imod] = pimod;
            head[hv] = imod;
            // We always should modify head and prev, but only add symbols if
            // this data is not yet processed ("wait" for wait index)
            if (wi <= i) {
                // bytes remaining
                var rem = s - i;
                if ((lc_1 > 7000 || li > 24576) && (rem > 423 || !lst)) {
                    pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
                    li = lc_1 = eb = 0, bs = i;
                    for (var j = 0; j < 286; ++j)
                        lf[j] = 0;
                    for (var j = 0; j < 30; ++j)
                        df[j] = 0;
                }
                //  len    dist   chain
                var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
                if (rem > 2 && hv == hsh(i - dif)) {
                    var maxn = Math.min(n, rem) - 1;
                    var maxd = Math.min(32767, i);
                    // max possible length
                    // not capped at dif because decompressors implement "rolling" index population
                    var ml = Math.min(258, rem);
                    while (dif <= maxd && --ch_1 && imod != pimod) {
                        if (dat[i + l] == dat[i + l - dif]) {
                            var nl = 0;
                            for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                                ;
                            if (nl > l) {
                                l = nl, d = dif;
                                // break out early when we reach "nice" (we are satisfied enough)
                                if (nl > maxn)
                                    break;
                                // now, find the rarest 2-byte sequence within this
                                // length of literals and search for that instead.
                                // Much faster than just using the start
                                var mmd = Math.min(dif, nl - 2);
                                var md = 0;
                                for (var j = 0; j < mmd; ++j) {
                                    var ti = i - dif + j & 32767;
                                    var pti = prev[ti];
                                    var cd = ti - pti & 32767;
                                    if (cd > md)
                                        md = cd, pimod = ti;
                                }
                            }
                        }
                        // check the previous match
                        imod = pimod, pimod = prev[imod];
                        dif += imod - pimod & 32767;
                    }
                }
                // d will be nonzero only when a match was found
                if (d) {
                    // store both dist and len data in one int32
                    // Make sure this is recognized as a len/dist with 28th bit (2^28)
                    syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d];
                    var lin = revfl[l] & 31, din = revfd[d] & 31;
                    eb += fleb[lin] + fdeb[din];
                    ++lf[257 + lin];
                    ++df[din];
                    wi = i + l;
                    ++lc_1;
                }
                else {
                    syms[li++] = dat[i];
                    ++lf[dat[i]];
                }
            }
        }
        for (i = Math.max(i, wi); i < s; ++i) {
            syms[li++] = dat[i];
            ++lf[dat[i]];
        }
        pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
        if (!lst) {
            st.r = (pos & 7) | w[(pos / 8) | 0] << 3;
            // shft(pos) now 1 less if pos & 7 != 0
            pos -= 7;
            st.h = head, st.p = prev, st.i = i, st.w = wi;
        }
    }
    else {
        for (var i = st.w || 0; i < s + lst; i += 65535) {
            // end
            var e = i + 65535;
            if (e >= s) {
                // write final block
                w[(pos / 8) | 0] = lst;
                e = s;
            }
            pos = wfblk(w, pos + 1, dat.subarray(i, e));
        }
        st.i = s;
    }
    return slc(o, 0, pre + shft(pos) + post);
};
// CRC32 table
var crct = /*#__PURE__*/ (function () {
    var t = new Int32Array(256);
    for (var i = 0; i < 256; ++i) {
        var c = i, k = 9;
        while (--k)
            c = ((c & 1) && -306674912) ^ (c >>> 1);
        t[i] = c;
    }
    return t;
})();
// CRC32
var crc = function () {
    var c = -1;
    return {
        p: function (d) {
            // closures have awful performance
            var cr = c;
            for (var i = 0; i < d.length; ++i)
                cr = crct[(cr & 255) ^ d[i]] ^ (cr >>> 8);
            c = cr;
        },
        d: function () { return ~c; }
    };
};
// deflate with opts
var dopt = function (dat, opt, pre, post, st) {
    if (!st) {
        st = { l: 1 };
        if (opt.dictionary) {
            var dict = opt.dictionary.subarray(-32768);
            var newDat = new u8(dict.length + dat.length);
            newDat.set(dict);
            newDat.set(dat, dict.length);
            dat = newDat;
            st.w = dict.length;
        }
    }
    return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : (12 + opt.mem), pre, post, st);
};
// Walmart object spread
var mrg = function (a, b) {
    var o = {};
    for (var k in a)
        o[k] = a[k];
    for (var k in b)
        o[k] = b[k];
    return o;
};
// read 2 bytes
var b2 = function (d, b) { return d[b] | (d[b + 1] << 8); };
// read 4 bytes
var b4 = function (d, b) { return (d[b] | (d[b + 1] << 8) | (d[b + 2] << 16) | (d[b + 3] << 24)) >>> 0; };
var b8 = function (d, b) { return b4(d, b) + (b4(d, b + 4) * 4294967296); };
// write bytes
var wbytes = function (d, b, v) {
    for (; v; ++b)
        d[b] = v, v >>>= 8;
};
/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */
function deflateSync(data, opts) {
    return dopt(data, opts || {}, 0, 0);
}
/**
 * Expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param opts The decompression options
 * @returns The decompressed version of the data
 */
function inflateSync(data, opts) {
    return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
// flatten a directory structure
var fltn = function (d, p, t, o) {
    for (var k in d) {
        var val = d[k], n = p + k, op = o;
        if (Array.isArray(val))
            op = mrg(o, val[1]), val = val[0];
        if (val instanceof u8)
            t[n] = [val, op];
        else {
            t[n += '/'] = [new u8(0), op];
            fltn(val, n, t, o);
        }
    }
};
// text encoder
var te = typeof TextEncoder != 'undefined' && /*#__PURE__*/ new TextEncoder();
// text decoder
var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder();
// text decoder stream
var tds = 0;
try {
    td.decode(et, { stream: true });
    tds = 1;
}
catch (e) { }
// decode UTF8
var dutf8 = function (d) {
    for (var r = '', i = 0;;) {
        var c = d[i++];
        var eb = (c > 127) + (c > 223) + (c > 239);
        if (i + eb > d.length)
            return { s: r, r: slc(d, i - 1) };
        if (!eb)
            r += String.fromCharCode(c);
        else if (eb == 3) {
            c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63)) - 65536,
                r += String.fromCharCode(55296 | (c >> 10), 56320 | (c & 1023));
        }
        else if (eb & 1)
            r += String.fromCharCode((c & 31) << 6 | (d[i++] & 63));
        else
            r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63));
    }
};
/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */
function strToU8(str, latin1) {
    if (latin1) {
        var ar_1 = new u8(str.length);
        for (var i = 0; i < str.length; ++i)
            ar_1[i] = str.charCodeAt(i);
        return ar_1;
    }
    if (te)
        return te.encode(str);
    var l = str.length;
    var ar = new u8(str.length + (str.length >> 1));
    var ai = 0;
    var w = function (v) { ar[ai++] = v; };
    for (var i = 0; i < l; ++i) {
        if (ai + 5 > ar.length) {
            var n = new u8(ai + 8 + ((l - i) << 1));
            n.set(ar);
            ar = n;
        }
        var c = str.charCodeAt(i);
        if (c < 128 || latin1)
            w(c);
        else if (c < 2048)
            w(192 | (c >> 6)), w(128 | (c & 63));
        else if (c > 55295 && c < 57344)
            c = 65536 + (c & 1023 << 10) | (str.charCodeAt(++i) & 1023),
                w(240 | (c >> 18)), w(128 | ((c >> 12) & 63)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
        else
            w(224 | (c >> 12)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
    }
    return slc(ar, 0, ai);
}
/**
 * Converts a Uint8Array to a string
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */
function strFromU8(dat, latin1) {
    if (latin1) {
        var r = '';
        for (var i = 0; i < dat.length; i += 16384)
            r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
        return r;
    }
    else if (td) {
        return td.decode(dat);
    }
    else {
        var _a = dutf8(dat), s = _a.s, r = _a.r;
        if (r.length)
            err(8);
        return s;
    }
}
// skip local zip header
var slzh = function (d, b) { return b + 30 + b2(d, b + 26) + b2(d, b + 28); };
// read zip header
var zh = function (d, b, z) {
    var fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl, bs = b4(d, b + 20);
    var _a = z && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)], sc = _a[0], su = _a[1], off = _a[2];
    return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off];
};
// read zip64 extra field
var z64e = function (d, b) {
    for (; b2(d, b) != 1; b += 4 + b2(d, b + 2))
        ;
    return [b8(d, b + 12), b8(d, b + 4), b8(d, b + 20)];
};
// extra field length
var exfl = function (ex) {
    var le = 0;
    if (ex) {
        for (var k in ex) {
            var l = ex[k].length;
            if (l > 65535)
                err(9);
            le += l + 4;
        }
    }
    return le;
};
// write zip header
var wzh = function (d, b, f, fn, u, c, ce, co) {
    var fl = fn.length, ex = f.extra, col = co && co.length;
    var exl = exfl(ex);
    wbytes(d, b, ce != null ? 0x2014B50 : 0x4034B50), b += 4;
    if (ce != null)
        d[b++] = 20, d[b++] = f.os;
    d[b] = 20, b += 2; // spec compliance? what's that?
    d[b++] = (f.flag << 1) | (c < 0 && 8), d[b++] = u && 8;
    d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
    var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
    if (y < 0 || y > 119)
        err(10);
    wbytes(d, b, (y << 25) | ((dt.getMonth() + 1) << 21) | (dt.getDate() << 16) | (dt.getHours() << 11) | (dt.getMinutes() << 5) | (dt.getSeconds() >> 1)), b += 4;
    if (c != -1) {
        wbytes(d, b, f.crc);
        wbytes(d, b + 4, c < 0 ? -c - 2 : c);
        wbytes(d, b + 8, f.size);
    }
    wbytes(d, b + 12, fl);
    wbytes(d, b + 14, exl), b += 16;
    if (ce != null) {
        wbytes(d, b, col);
        wbytes(d, b + 6, f.attrs);
        wbytes(d, b + 10, ce), b += 14;
    }
    d.set(fn, b);
    b += fl;
    if (exl) {
        for (var k in ex) {
            var exf = ex[k], l = exf.length;
            wbytes(d, b, +k);
            wbytes(d, b + 2, l);
            d.set(exf, b + 4), b += 4 + l;
        }
    }
    if (col)
        d.set(co, b), b += col;
    return b;
};
// write zip footer (end of central directory)
var wzf = function (o, b, c, d, e) {
    wbytes(o, b, 0x6054B50); // skip disk
    wbytes(o, b + 8, c);
    wbytes(o, b + 10, c);
    wbytes(o, b + 12, d);
    wbytes(o, b + 16, e);
};
/**
 * Synchronously creates a ZIP file. Prefer using `zip` for better performance
 * with more than one file.
 * @param data The directory structure for the ZIP archive
 * @param opts The main options, merged with per-file options
 * @returns The generated ZIP archive
 */
function zipSync(data, opts) {
    if (!opts)
        opts = {};
    var r = {};
    var files = [];
    fltn(data, '', r, opts);
    var o = 0;
    var tot = 0;
    for (var fn in r) {
        var _a = r[fn], file = _a[0], p = _a[1];
        var compression = p.level == 0 ? 0 : 8;
        var f = strToU8(fn), s = f.length;
        var com = p.comment, m = com && strToU8(com), ms = m && m.length;
        var exl = exfl(p.extra);
        if (s > 65535)
            err(11);
        var d = compression ? deflateSync(file, p) : file, l = d.length;
        var c = crc();
        c.p(file);
        files.push(mrg(p, {
            size: file.length,
            crc: c.d(),
            c: d,
            f: f,
            m: m,
            u: s != fn.length || (m && (com.length != ms)),
            o: o,
            compression: compression
        }));
        o += 30 + s + exl + l;
        tot += 76 + 2 * (s + exl) + (ms || 0) + l;
    }
    var out = new u8(tot + 22), oe = o, cdl = tot - o;
    for (var i = 0; i < files.length; ++i) {
        var f = files[i];
        wzh(out, f.o, f, f.f, f.u, f.c.length);
        var badd = 30 + f.f.length + exfl(f.extra);
        out.set(f.c, f.o + badd);
        wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
    }
    wzf(out, o, files.length, cdl, oe);
    return out;
}
/**
 * Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
 * performance with more than one file.
 * @param data The raw compressed ZIP file
 * @param opts The ZIP extraction options
 * @returns The decompressed files
 */
function unzipSync(data, opts) {
    var files = {};
    var e = data.length - 22;
    for (; b4(data, e) != 0x6054B50; --e) {
        if (!e || data.length - e > 65558)
            err(13);
    }
    var c = b2(data, e + 8);
    if (!c)
        return {};
    var o = b4(data, e + 16);
    var z = o == 4294967295 || c == 65535;
    if (z) {
        var ze = b4(data, e - 12);
        z = b4(data, ze) == 0x6064B50;
        if (z) {
            c = b4(data, ze + 32);
            o = b4(data, ze + 48);
        }
    }
    var fltr = opts && opts.filter;
    for (var i = 0; i < c; ++i) {
        var _a = zh(data, o, z), c_2 = _a[0], sc = _a[1], su = _a[2], fn = _a[3], no = _a[4], off = _a[5], b = slzh(data, off);
        o = no;
        if (!fltr || fltr({
            name: fn,
            size: sc,
            originalSize: su,
            compression: c_2
        })) {
            if (!c_2)
                files[fn] = slc(data, b, b + sc);
            else if (c_2 == 8)
                files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
            else
                err(14, 'unknown compression type ' + c_2);
        }
    }
    return files;
}

const e=(()=>{if("undefined"==typeof self)return !1;if("top"in self&&self!==top)try{top;}catch(e){return !1}return "showOpenFilePicker"in self})(),t=e?Promise.resolve().then(function(){return l}):Promise.resolve().then(function(){return v});async function n(...e){return (await t).default(...e)}e?Promise.resolve().then(function(){return y}):Promise.resolve().then(function(){return b});const a=e?Promise.resolve().then(function(){return m}):Promise.resolve().then(function(){return k});async function o(...e){return (await a).default(...e)}const s=async e=>{const t=await e.getFile();return t.handle=e,t};var c=async(e=[{}])=>{Array.isArray(e)||(e=[e]);const t=[];e.forEach((e,n)=>{t[n]={description:e.description||"Files",accept:{}},e.mimeTypes?e.mimeTypes.map(r=>{t[n].accept[r]=e.extensions||[];}):t[n].accept["*/*"]=e.extensions||[];});const n=await window.showOpenFilePicker({id:e[0].id,startIn:e[0].startIn,types:t,multiple:e[0].multiple||!1,excludeAcceptAllOption:e[0].excludeAcceptAllOption||!1}),r=await Promise.all(n.map(s));return e[0].multiple?r:r[0]},l={__proto__:null,default:c};function u(e){function t(e){if(Object(e)!==e)return Promise.reject(new TypeError(e+" is not an object."));var t=e.done;return Promise.resolve(e.value).then(function(e){return {value:e,done:t}})}return u=function(e){this.s=e,this.n=e.next;},u.prototype={s:null,n:null,next:function(){return t(this.n.apply(this.s,arguments))},return:function(e){var n=this.s.return;return void 0===n?Promise.resolve({value:e,done:!0}):t(n.apply(this.s,arguments))},throw:function(e){var n=this.s.return;return void 0===n?Promise.reject(e):t(n.apply(this.s,arguments))}},new u(e)}const p=async(e,t,n=e.name,r)=>{const i=[],a=[];var o,s=!1,c=!1;try{for(var l,d=function(e){var t,n,r,i=2;for("undefined"!=typeof Symbol&&(n=Symbol.asyncIterator,r=Symbol.iterator);i--;){if(n&&null!=(t=e[n]))return t.call(e);if(r&&null!=(t=e[r]))return new u(t.call(e));n="@@asyncIterator",r="@@iterator";}throw new TypeError("Object is not async iterable")}(e.values());s=!(l=await d.next()).done;s=!1){const o=l.value,s=`${n}/${o.name}`;"file"===o.kind?a.push(o.getFile().then(t=>(t.directoryHandle=e,t.handle=o,Object.defineProperty(t,"webkitRelativePath",{configurable:!0,enumerable:!0,get:()=>s})))):"directory"!==o.kind||!t||r&&r(o)||i.push(p(o,t,s,r));}}catch(e){c=!0,o=e;}finally{try{s&&null!=d.return&&await d.return();}finally{if(c)throw o}}return [...(await Promise.all(i)).flat(),...await Promise.all(a)]};var d=async(e={})=>{e.recursive=e.recursive||!1,e.mode=e.mode||"read";const t=await window.showDirectoryPicker({id:e.id,startIn:e.startIn,mode:e.mode});return (await(await t.values()).next()).done?[t]:p(t,e.recursive,void 0,e.skipDirectory)},y={__proto__:null,default:d},f=async(e,t=[{}],n=null,r=!1,i=null)=>{Array.isArray(t)||(t=[t]),t[0].fileName=t[0].fileName||"Untitled";const a=[];let o=null;if(e instanceof Blob&&e.type?o=e.type:e.headers&&e.headers.get("content-type")&&(o=e.headers.get("content-type")),t.forEach((e,t)=>{a[t]={description:e.description||"Files",accept:{}},e.mimeTypes?(0===t&&o&&e.mimeTypes.push(o),e.mimeTypes.map(n=>{a[t].accept[n]=e.extensions||[];})):o?a[t].accept[o]=e.extensions||[]:a[t].accept["*/*"]=e.extensions||[];}),n)try{await n.getFile();}catch(e){if(n=null,r)throw e}const s=n||await window.showSaveFilePicker({suggestedName:t[0].fileName,id:t[0].id,startIn:t[0].startIn,types:a,excludeAcceptAllOption:t[0].excludeAcceptAllOption||!1});!n&&i&&i(s);const c=await s.createWritable();if("stream"in e){const t=e.stream();return await t.pipeTo(c),s}return "body"in e?(await e.body.pipeTo(c),s):(await c.write(await e),await c.close(),s)},m={__proto__:null,default:f},w=async(e=[{}])=>(Array.isArray(e)||(e=[e]),new Promise((t,n)=>{const r=document.createElement("input");r.type="file";const i=[...e.map(e=>e.mimeTypes||[]),...e.map(e=>e.extensions||[])].join();r.multiple=e[0].multiple||!1,r.accept=i||"",r.style.display="none",document.body.append(r);const a=e=>{"function"==typeof o&&o(),t(e);},o=e[0].legacySetup&&e[0].legacySetup(a,()=>o(n),r),s=()=>{window.removeEventListener("focus",s),r.remove();};r.addEventListener("click",()=>{window.addEventListener("focus",s);}),r.addEventListener("change",()=>{window.removeEventListener("focus",s),r.remove(),a(r.multiple?Array.from(r.files):r.files[0]);}),"showPicker"in HTMLInputElement.prototype?r.showPicker():r.click();})),v={__proto__:null,default:w},h=async(e=[{}])=>(Array.isArray(e)||(e=[e]),e[0].recursive=e[0].recursive||!1,new Promise((t,n)=>{const r=document.createElement("input");r.type="file",r.webkitdirectory=!0;const i=e=>{"function"==typeof a&&a(),t(e);},a=e[0].legacySetup&&e[0].legacySetup(i,()=>a(n),r);r.addEventListener("change",()=>{let t=Array.from(r.files);e[0].recursive?e[0].recursive&&e[0].skipDirectory&&(t=t.filter(t=>t.webkitRelativePath.split("/").every(t=>!e[0].skipDirectory({name:t,kind:"directory"})))):t=t.filter(e=>2===e.webkitRelativePath.split("/").length),i(t);}),"showPicker"in HTMLInputElement.prototype?r.showPicker():r.click();})),b={__proto__:null,default:h},P=async(e,t={})=>{Array.isArray(t)&&(t=t[0]);const n=document.createElement("a");let r=e;"body"in e&&(r=await async function(e,t){const n=e.getReader(),r=new ReadableStream({start:e=>async function t(){return n.read().then(({done:n,value:r})=>{if(!n)return e.enqueue(r),t();e.close();})}()}),i=new Response(r),a=await i.blob();return n.releaseLock(),new Blob([a],{type:t})}(e.body,e.headers.get("content-type"))),n.download=t.fileName||"Untitled",n.href=URL.createObjectURL(await r);const i=()=>{"function"==typeof a&&a();},a=t.legacySetup&&t.legacySetup(i,()=>a(),n);return n.addEventListener("click",()=>{setTimeout(()=>URL.revokeObjectURL(n.href),3e4),i();}),n.click(),null},k={__proto__:null,default:P};

const N_RECORDS_SAVE = 10;
const N_RECORDS_MAX = 20;

class DB {
  constructor() {
    this.dbPromise = openDB("os-dpi", 4, {
      upgrade(db, oldVersion, newVersion) {
        if (oldVersion && oldVersion < 3) {
          for (const name of ["store", "media", "saved", "url"]) {
            try {
              db.deleteObjectStore(name);
            } catch (e) {
              // ignore the error
            }
          }
        } else if (oldVersion == 3) {
          db.deleteObjectStore("images");
        }
        if (oldVersion < 3) {
          let objectStore = db.createObjectStore("store", {
            keyPath: "id",
            autoIncrement: true,
          });
          objectStore.createIndex("by-name", "name");
          objectStore.createIndex("by-name-type", ["name", "type"]);
        }
        if (newVersion && newVersion >= 4) {
          db.createObjectStore("media");
        }
        if (oldVersion < 3) {
          // keep track of the name and ETag (if any) of designs that have been saved
          let savedStore = db.createObjectStore("saved", {
            keyPath: "name",
          });
          savedStore.createIndex("by-etag", "etag");
          // track etags for urls
          db.createObjectStore("url", {
            keyPath: "url",
          });
        }
      },
    });
    this.updateListeners = [];
    this.designName = "";
    this.fileName = "";
    this.fileHandle = null;
    this.fileVersion = 0.0;
    this.fileUid = "";
  }

  /** set the name for the current design
   * @param {string} name
   */
  setDesignName(name) {
    this.designName = name;
    document.title = name;
  }

  /** rename the design
   * @param {string} newName
   */
  async renameDesign(newName) {
    const db = await this.dbPromise;
    newName = await this.uniqueName(newName);
    const tx = db.transaction(["store", "media", "saved"], "readwrite");
    const index = tx.objectStore("store").index("by-name");
    for await (const cursor of index.iterate(this.designName)) {
      const record = { ...cursor.value };
      record.name = newName;
      cursor.update(record);
    }
    const mst = tx.objectStore("media");
    for await (const cursor of mst.iterate()) {
      if (cursor && cursor.key[0] == this.designName) {
        const record = { ...cursor.value };
        const key = cursor.key;
        cursor.delete();
        key[0] = newName;
        mst.put(record, key);
      }
    }
    const cursor = await tx.objectStore("saved").openCursor(this.designName);
    if (cursor) {
      cursor.delete();
    }
    await tx.done;
    this.fileHandle = null;
    this.fileName = "";

    this.notify({ action: "rename", name: this.designName, newName });
    this.designName = newName;
  }

  /**
   * return list of names of designs in the db
   * @returns {Promise<string[]>}
   */
  async names() {
    const db = await this.dbPromise;
    const index = db.transaction("store", "readonly").store.index("by-name");
    const result = [];
    for await (const cursor of index.iterate(null, "nextunique")) {
      result.push(/** @type {string} */ (cursor.key));
    }
    return result;
  }

  /**
   * return list of names of saved designs in the db
   * @returns {Promise<string[]>}
   */
  async saved() {
    const db = await this.dbPromise;
    const result = [];
    for (const key of await db.getAllKeys("saved")) {
      result.push(key.toString());
    }
    return result;
  }

  /**
   * Create a unique name for new design
   * @param {string} name - the desired name
   * @returns {Promise<string>}
   */
  async uniqueName(name = "new") {
    // strip off any suffix
    name = name.replace(/\.osdpi$|\.zip$/, "");
    // strip any -number off the end of base
    name = name.replace(/-\d+$/, "") || name;
    // replace characters we don't want with _
    name = name.replaceAll(/[^a-zA-Z0-9]/g, "_");
    // replace multiple _ with one
    name = name.replaceAll(/_+/g, "_");
    // remove trailing _
    name = name.replace(/_+$/, "");
    // remove leading _
    name = name.replace(/^_+/, "");
    // if we're left with nothing the call it noname
    name = name || "noname";
    const allNames = await this.names();
    if (allNames.indexOf(name) < 0) return name;
    const base = name;
    for (let i = 1; ; i++) {
      const name = `${base}-${i}`;
      if (allNames.indexOf(name) < 0) return name;
    }
  }

  /** Return the most recent record for the type
   * @param {string} type
   * @param {any} defaultValue
   * @returns {Promise<Object>}
   */
  async read(type, defaultValue = {}) {
    const db = await this.dbPromise;
    const index = db
      .transaction("store", "readonly")
      .store.index("by-name-type");
    const cursor = await index.openCursor([this.designName, type], "prev");
    if (cursor) {
      const data = cursor.value.data;
      if (
        (Array.isArray(defaultValue) && !Array.isArray(data)) ||
        typeof data != typeof defaultValue
      ) {
        return defaultValue;
      }
      return data;
    }
    return defaultValue;
  }

  /**
   * Read all records of the given type
   *
   * @param {string} type
   * @returns {Promise<Object[]>}
   */
  async readAll(type) {
    const db = await this.dbPromise;
    const index = db
      .transaction("store", "readonly")
      .store.index("by-name-type");
    const key = [this.designName, type];
    const result = [];
    for await (const cursor of index.iterate(key)) {
      const data = cursor.value.data;
      result.push(data);
    }
    return result;
  }

  /** Add a new record
   * @param {string} type
   * @param {Object} data
   */
  async write(type, data) {
    const db = await this.dbPromise;
    // do all this in a transaction
    const tx = db.transaction(["store", "saved"], "readwrite");
    // note that this design has been updated
    await tx.objectStore("saved").delete(this.designName);
    // add the record to the store
    const store = tx.objectStore("store");
    await store.put({ name: this.designName, type, data });

    let n_max = N_RECORDS_MAX; // zero to prevent limiting
    let n_save = N_RECORDS_SAVE;
    if (type == "content") {
      n_max = n_save = 1; // only save 1 content record
    } else if (type == "log") {
      n_max = n_save = 0; // don't limit log records
    }

    /* Only keep the last few records per type */
    const index = store.index("by-name-type");
    const key = [this.designName, type];
    if (n_max > 0) {
      // count how many we have
      let count = await index.count(key);
      if (count > n_max) {
        // get the number to delete
        let toDelete = count - n_save;
        // we're getting them in order so this will delete the oldest ones
        for await (const cursor of index.iterate(key)) {
          if (--toDelete <= 0) break;
          cursor.delete();
        }
      }
    }
    await tx.done;

    this.notify({ action: "update", name: this.designName });
  }

  /**
   * delete records of this type
   *
   * @param {string} type
   * @returns {Promise<void>}
   */
  async clear(type) {
    const db = await this.dbPromise;
    const tx = db.transaction("store", "readwrite");
    const index = tx.store.index("by-name-type");
    for await (const cursor of index.iterate([this.designName, type])) {
      cursor.delete();
    }
    await tx.done;
  }

  /** Undo by deleting the most recent record
   * @param {string} type
   */
  async undo(type) {
    if (type == "content") return;
    const db = await this.dbPromise;
    const index = db
      .transaction("store", "readwrite")
      .store.index("by-name-type");
    const cursor = await index.openCursor([this.designName, type], "prev");
    if (cursor) await cursor.delete();
    await db.delete("saved", this.designName);
    this.notify({ action: "update", name: this.designName });
  }

  /** Read a design from a local file
   * @param {import("browser-fs-access").FileWithHandle} file
   */
  async readDesignFromFile(file) {
    // keep the handle so we can save to it later
    this.fileHandle = file.handle;
    return this.readDesignFromBlob(file, file.name);
  }

  /** Read a design from a URL
   * @param {string} url
   */
  async readDesignFromURL(url) {
    const db = await this.dbPromise;
    // have we seen this url before?
    const urlRecord = await db.get("url", url);
    /** @type {HeadersInit} */
    const headers = {}; // for the fetch
    let name = "";
    if (urlRecord) {
      /** @type {string} */
      const etag = urlRecord.etag;
      // do we have any saved designs with this etag?
      const savedKey = await db.getKeyFromIndex("saved", "by-etag", etag);
      if (savedKey) {
        // yes we have a previously saved design from this url
        // set the headers to check if it has changed
        headers["If-None-Match"] = etag;
        name = savedKey.toString();
      }
    }

    const response = await fetch(url, { headers });
    if (response.status == 304) {
      // we already have it
      this.designName = name;
      return;
    }
    if (!response.ok) {
      throw new Error(`Fetching the URL (${url}) failed: ${response.status}`);
    }
    const etag = response.headers.get("ETag") || "";
    await db.put("url", { url, etag });

    const urlParts = new URL(url, window.location.origin);
    const pathParts = urlParts.pathname.split("/");
    if (
      pathParts.length > 0 &&
      pathParts[pathParts.length - 1].endsWith(".osdpi")
    ) {
      name = pathParts[pathParts.length - 1];
    } else {
      throw new Error(`Design files should have .osdpi suffix`);
    }

    const blob = await response.blob();
    // parse the URL
    return this.readDesignFromBlob(blob, name, etag);
  }

  /** Read a design from a zip file
   * @param {Blob} blob
   * @param {string} filename
   * @param {string} etag
   */
  async readDesignFromBlob(blob, filename, etag = "none") {
    const db = await this.dbPromise;
    this.fileName = filename;

    const zippedBuf = await readAsArrayBuffer(blob);
    const zippedArray = new Uint8Array(zippedBuf);
    const unzipped = unzipSync(zippedArray);

    // normalize the fileName to make the design name
    let name = this.fileName;
    // make sure it is unique
    name = await this.uniqueName(name);

    this.designName = name;

    for (const fname in unzipped) {
      const mimetype = mime(fname) || "application/octet-stream";
      if (mimetype == "application/json") {
        const text = strFromU8(unzipped[fname]);
        let obj = {};
        try {
          obj = JSON.parse(text);
        } catch (e) {
          obj = {};
          console.trace(e);
        }
        const type = fname.split(".")[0];
        await this.write(type, obj);
      } else if (
        mimetype.startsWith("image") ||
        mimetype.startsWith("audio") ||
        mimetype.startsWith("video")
      ) {
        const blob = new Blob([unzipped[fname]], {
          type: mimetype,
        });
        await db.put(
          "media",
          {
            name: fname,
            content: blob,
          },
          [name, fname],
        );
      }
    }
    await db.put("saved", { name: this.designName, etag });
    this.notify({ action: "update", name: this.designName });
    return;
  }

  // do this part async to avoid file picker timeout
  async convertDesignToBlob() {
    const db = await this.dbPromise;
    // collect the parts of the design
    const layout = Globals.tree.toObject();
    const actions = Globals.actions.toObject();
    const content = await this.read("content");
    const method = Globals.method.toObject();
    const pattern = Globals.patterns.toObject();
    const cues = Globals.cues.toObject();

    const zipargs = {
      "layout.json": strToU8(JSON.stringify(layout)),
      "actions.json": strToU8(JSON.stringify(actions)),
      "content.json": strToU8(JSON.stringify(content)),
      "method.json": strToU8(JSON.stringify(method)),
      "pattern.json": strToU8(JSON.stringify(pattern)),
      "cues.json": strToU8(JSON.stringify(cues)),
    };

    const mediaKeys = (await db.getAllKeys("media")).filter((pair) =>
      Object.values(pair).includes(this.designName),
    );

    // add the encoded image to the zipargs
    for (const key of mediaKeys) {
      const record = await db.get("media", key);
      if (record) {
        const contentBuf = await record.content.arrayBuffer();
        const contentArray = new Uint8Array(contentBuf);
        zipargs[key[1]] = contentArray;
      }
    }

    // zip it
    const zip = zipSync(zipargs);
    // create a blob from the zipped result
    const blob = new Blob([zip], { type: "application/octet-stream" });
    return blob;
  }

  /** Save a design into a zip file
   */
  async saveDesign() {
    const db = await this.dbPromise;

    const options = {
      fileName: this.fileName || this.designName + ".osdpi",
      extensions: [".osdpi", ".zip"],
      id: "osdpi",
    };
    try {
      await o(this.convertDesignToBlob(), options, this.fileHandle);
      await db.put("saved", { name: this.designName });
    } catch (error) {
      console.error("Export failed");
      console.error(error);
    }
  }

  /** Unload a design from the database
   * @param {string} name - the name of the design to delete
   */
  async unload(name) {
    const db = await this.dbPromise;
    const tx = db.transaction("store", "readwrite");
    const index = tx.store.index("by-name");
    for await (const cursor of index.iterate(name)) {
      cursor.delete();
    }
    await tx.done;
    // delete media
    const txm = db.transaction("media", "readwrite");
    const mediaKeys = (await txm.store.getAllKeys()).filter(
      (pair) => Object.values(pair)[0] == name,
    );

    // delete the media
    for (const key of mediaKeys) {
      await txm.store.delete(key);
    }
    await txm.done;
    await db.delete("saved", name);
    this.notify({ action: "unload", name });
  }

  /** Return an image from the database
   * @param {string} name
   * @returns {Promise<HTMLImageElement>}
   */
  async getImage(name) {
    const db = await this.dbPromise;
    const record = await db.get("media", [this.designName, name]);
    const img = new Image();
    if (record) {
      img.src = URL.createObjectURL(record.content);
    }
    img.title = record.name;
    return img;
  }

  /** Return an audio file from the database
   * @param {string} name
   * @returns {Promise<HTMLAudioElement>}
   */
  async getAudio(name) {
    const db = await this.dbPromise;
    const record = await db.get("media", [this.designName, name]);
    const audio = new Audio();
    if (record) {
      audio.src = URL.createObjectURL(record.content);
    }
    return audio;
  }

  /** Return an image URL from the database
   * @param {string} name
   * @returns {Promise<string>}
   */
  async getMediaURL(name) {
    const db = await this.dbPromise;
    const record = await db.get("media", [this.designName, name]);
    if (record) return URL.createObjectURL(record.content);
    else return "";
  }

  /** Add media to the database
   * @param {Blob} blob
   * @param {string} name
   */
  async addMedia(blob, name) {
    const db = await this.dbPromise;
    return await db.put(
      "media",
      {
        name: name,
        content: blob,
      },
      [this.designName, name],
    );
  }

  /** List media entries from a given store
   * @returns {Promise<string[]>}
   * */
  async listMedia() {
    const db = await this.dbPromise;
    const keys = (await db.getAllKeys("media")).filter(
      (key) => key[0] == this.designName, //only show resources from this design
    );
    const result = [];
    for (const key of keys) {
      result.push(key[1].toString());
    }
    return result;
  }

  /** delete media files
   * @param {string[]} names
   */
  async deleteMedia(...names) {
    const db = await this.dbPromise;
    const tx = db.transaction(["media", "saved"], "readwrite");
    const mst = tx.objectStore("media");
    for await (const cursor of mst.iterate()) {
      if (
        cursor &&
        cursor.key[0] == this.designName &&
        names.includes(cursor.key[1])
      ) {
        cursor.delete();
      }
    }
    const cursor = await tx.objectStore("saved").openCursor(this.designName);
    if (cursor) {
      cursor.delete();
    }
    await tx.done;
  }

  /** Listen for database update
   * @param {(message: UpdateNotification) =>void} callback
   */
  addUpdateListener(callback) {
    this.updateListeners.push(callback);
  }

  /** Notify listeners of database update
   * @param {UpdateNotification} message
   */
  notify(message) {
    for (const listener of this.updateListeners) {
      listener(message);
    }
  }
}

const db = new DB();

/** Convert a blob into an array buffer
 * @param {Blob} blob */
function readAsArrayBuffer(blob) {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onloadend = () => fr.result instanceof ArrayBuffer && resolve(fr.result);
    fr.readAsArrayBuffer(blob);
  });
}

const mimetypes = {
  ".json": "application/json",
  ".aac": "audio/aac",
  ".mp3": "audio/mpeg",
  ".mp4": "audio/mp4",
  ".oga": "audio/ogg",
  ".wav": "audio/wav",
  ".weba": "audio/webm",
  ".webm": "video/webm",
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".jfif": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".webp": "image/webp",
};
/** Map filenames to mimetypes for unpacking the zip file
 * @param {string} fname
 */
function mime(fname) {
  const extension = /\.[-a-zA-Z0-9]+$/.exec(fname);
  if (!extension) return false;
  return mimetypes[extension] || false;
}

let Audio$1 = class Audio extends TreeBase {
  stateName = new String$1("$Audio");

  async playAudio() {
    const { state } = Globals;
    const fileName = state.get(this.stateName.value) || "";
    (await db.getAudio(fileName)).play();
  }

  template() {
    const { state } = Globals;
    if (state.hasBeenUpdated(this.stateName.value)) {
      this.playAudio();
    }
    return html`<div />`;
  }
};
TreeBase.register(Audio$1, "Audio");

const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "/OS-DPI/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
    // @ts-expect-error true will be replaced with boolean later
    if (!true || !deps || deps.length === 0) {
        return baseModule();
    }
    const links = document.getElementsByTagName('link');
    return Promise.all(deps.map((dep) => {
        // @ts-expect-error assetsURL is declared before preload.toString()
        dep = assetsURL(dep);
        if (dep in seen)
            return;
        seen[dep] = true;
        const isCss = dep.endsWith('.css');
        const cssSelector = isCss ? '[rel="stylesheet"]' : '';
        const isBaseRelative = !!importerUrl;
        // check if the file is already preloaded by SSR markup
        if (isBaseRelative) {
            // When isBaseRelative is true then we have `importerUrl` and `dep` is
            // already converted to an absolute URL by the `assetsURL` function
            for (let i = links.length - 1; i >= 0; i--) {
                const link = links[i];
                // The `links[i].href` is an absolute URL thanks to browser doing the work
                // for us. See https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes:idl-domstring-5
                if (link.href === dep && (!isCss || link.rel === 'stylesheet')) {
                    return;
                }
            }
        }
        else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
            return;
        }
        const link = document.createElement('link');
        link.rel = isCss ? 'stylesheet' : scriptRel;
        if (!isCss) {
            link.as = 'script';
            link.crossOrigin = '';
        }
        link.href = dep;
        document.head.appendChild(link);
        if (isCss) {
            return new Promise((res, rej) => {
                link.addEventListener('load', res);
                link.addEventListener('error', () => rej(new Error(`Unable to preload CSS for ${dep}`)));
            });
        }
    }))
        .then(() => baseModule())
        .catch((err) => {
        const e = new Event('vite:preloadError', { cancelable: true });
        // @ts-expect-error custom payload
        e.payload = err;
        window.dispatchEvent(e);
        if (!e.defaultPrevented) {
            throw err;
        }
    });
};

const designer = '';

class Designer extends TreeBase {
  stateName = new String$1("$tabControl");
  background = new String$1("");
  scale = new Float(6);
  name = new String$1("tabs");

  hint = "T";

  allowedChildren = ["DesignerPanel"];

  /** @type {DesignerPanel[]} */
  children = [];

  /** @type {DesignerPanel | undefined} */
  currentPanel = undefined;

  template() {
    const { state } = Globals;
    const panels = this.children;
    let activeTabName = state.get(this.stateName.value);
    // collect panel info
    panels.forEach((panel, index) => {
      panel.tabName = state.interpolate(panel.name.value); // internal name
      panel.tabLabel = state.interpolate(panel.label.value || panel.name.value); // display name
      if (index == 0 && !activeTabName) {
        activeTabName = panel.tabName;
        state.define(this.stateName.value, panel.tabName);
      }
      panel.active = activeTabName == panel.tabName || panels.length === 1;
      if (panel.active) {
        this.currentPanel = panel;
      }
    });
    let buttons = [];
    buttons = panels
      .filter((panel) => panel.label.value != "UNLABELED")
      .map((panel) => {
        return html`<li>
          <button
            ?active=${panel.active}
            data=${{
              name: this.name.value,
              label: panel.tabLabel,
              component: this.constructor.name,
              id: panel.id,
            }}
            @click=${() => {
              this.switchTab(panel.tabName);
            }}
            tabindex="-1"
          >
            ${panel.tabLabel}
          </button>
        </li>`;
      });
    return this.component(
      { classes: ["top", "tabcontrol"] },
      html`
        <ul class="buttons" hint="T" @keyup=${this.tabButtonKeyHandler}>
          ${buttons}
        </ul>
        <div
          class="panels flex"
          @keydown=${this.keyHandler}
          @focusin=${this.focusin}
          @click=${this.designerClick}
        >
          ${panels.map((panel) => panel.settings())}
        </div>
        ${colorNamesDataList()}
      `,
    );
  }

  /**
   * @param {string} tabName
   */
  switchTab(tabName) {
    callAfterRender(() => this.restoreFocus());
    Globals.state.update({ [this.stateName.value]: tabName });
  }

  /**
   * capture focusin events so we can remember what was focused last
   * @param {FocusEvent} event
   */
  focusin = (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (event.target.hasAttribute("aria-selected")) return;
    if (!this.currentPanel) return;
    const panel = document.getElementById(this.currentPanel.id);
    if (!panel) return;
    for (const element of panel.querySelectorAll("[aria-selected]")) {
      element.removeAttribute("aria-selected");
    }
    if (panel.contains(event.target)) {
      const id = event.target.closest("[id]")?.id || "";
      this.currentPanel.lastFocused = id;
      event.target.setAttribute("aria-selected", "true");
    }

    if (this.currentPanel.name.value == "Layout") {
      this.currentPanel.highlight();
    }
  };

  /** @returns {TreeBase | null} */
  get selectedComponent() {
    // Figure out which tab is active
    const { designer } = Globals;
    const panel = designer.currentPanel;

    // Ask that tab which component is focused
    if (!panel?.lastFocused) {
      console.log("no lastFocused");
      return null;
    }
    const component = TreeBase.componentFromId(panel.lastFocused);
    if (!component) {
      console.log("no component");
      return null;
    }
    return component;
  }

  restoreFocus() {
    if (this.currentPanel) {
      if (this.currentPanel.lastFocused) {
        let targetId = this.currentPanel.lastFocused;
        let elem = document.getElementById(targetId);
        if (!elem) {
          // perhaps this one is embeded, look for something that starts with it
          const m = targetId.match(/^TreeBase-\d+/);
          if (m) {
            const prefix = m[0];
            elem = document.querySelector(`[id^=${prefix}]`);
          }
        }
        if (elem) elem.focus();
      } else {
        const panelNode = document.getElementById(this.currentPanel.id);
        if (panelNode) {
          const focusable = /** @type {HTMLElement} */ (
            panelNode.querySelector(
              "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), " +
                'textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), ' +
                "summary:not(:disabled)",
            )
          );

          if (focusable) {
            focusable.focus();
          } else {
            panelNode.focus();
          }
        }
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  keyHandler = (event) => {
    if (!this.currentPanel) return;
    if (
      event.target instanceof HTMLButtonElement &&
      event.target.matches("#designer .buttons button")
    ) {
      this.tabButtonKeyHandler(event);
    } else {
      const panel = document.getElementById(this.currentPanel.id);
      if (
        panel &&
        event.target instanceof HTMLElement &&
        panel.contains(event.target)
      ) {
        this.panelKeyHandler(event);
      }
    }
  };
  /**
   * @param {KeyboardEvent} event
   */
  panelKeyHandler(event) {
    if (event.target instanceof HTMLTextAreaElement) return;
    if (event.key != "ArrowDown" && event.key != "ArrowUp") return;
    if (event.shiftKey) {
      // move the component
      const component = Globals.designer.selectedComponent;
      if (!component) return;
      component.moveUpDown(event.key == "ArrowUp");
      callAfterRender(() => Globals.designer.restoreFocus());
      Globals.state.update();
    } else {
      event.preventDefault();
      // get the components on this panel
      // todo expand this to all components
      const components = [
        ...document.querySelectorAll(".DesignerPanel.ActivePanel .settings"),
      ];
      // determine which one contains the focus
      const focusedComponent = document.querySelector(
        '.DesignerPanel.ActivePanel .settings:has([aria-selected="true"]):not(:has(.settings [aria-selected="true"]))',
      );
      if (!focusedComponent) return;
      // get its index
      const index = components.indexOf(focusedComponent);
      // get the next index
      const nextIndex = Math.min(
        components.length - 1,
        Math.max(0, index + (event.key == "ArrowUp" ? -1 : 1)),
      );
      if (nextIndex != index) {
        // focus on the first focusable in the next component
        const focusable = /** @type {HTMLElement} */ (
          components[nextIndex].querySelector(
            "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), " +
              'textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), ' +
              "summary:not(:disabled)",
          )
        );
        if (focusable) {
          focusable.focus();
        }
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  tabButtonKeyHandler({ key }) {
    const tabButtons = /** @type {HTMLButtonElement[]} */ ([
      ...document.querySelectorAll("#designer .buttons button"),
    ]);
    const focused = /** @type {HTMLButtonElement} */ (
      document.querySelector("#designer .buttons button:focus")
    );
    if (key == "Escape") {
      Globals.designer.restoreFocus();
    } else if (key.startsWith("Arrow")) {
      const index = tabButtons.indexOf(focused);
      const step = key == "ArrowUp" || key == "ArrowLeft" ? -1 : 1;
      let nextIndex = (index + step + tabButtons.length) % tabButtons.length;
      tabButtons[nextIndex].focus();
    } else if (key == "Home") {
      tabButtons[0].focus();
    } else if (key == "End") {
      tabButtons[tabButtons.length - 1].focus();
    } else if (
      key.length == 1 &&
      ((key >= "a" && key <= "z") || (key >= "A" && key <= "Z"))
    ) {
      const index = tabButtons.indexOf(focused);
      for (let i = 1; i < tabButtons.length; i++) {
        const j = (index + i) % tabButtons.length;
        if (tabButtons[j].innerText.toLowerCase().startsWith(key)) {
          tabButtons[j].focus();
          break;
        }
      }
    }
  }

  /** Tweak the focus behavior in the designer
   * I want clicking on blank space to focus the nearest focusable element

   * @param {KeyboardEvent} event
   */
  designerClick = (event) => {
    // return if target is not an HTMLElement
    if (!(event.target instanceof HTMLElement)) return;

    const panel = document.querySelector("#designer .designer div.panels");
    // return if not in designer
    if (!panel) return;
    // return if click is not inside the panel
    if (!panel.contains(event.target)) return;
    // check for background elements
    if (
      event.target instanceof HTMLDivElement ||
      event.target instanceof HTMLFieldSetElement ||
      event.target instanceof HTMLTableRowElement ||
      event.target instanceof HTMLTableCellElement ||
      event.target instanceof HTMLDetailsElement
    ) {
      if (event.target.matches('[tabindex="0"]')) return;
      /** @type {HTMLElement | null} */
      let target = event.target;
      while (target) {
        const focusable = /** @type {HTMLElement} */ (
          target.querySelector(
            "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), " +
              'textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), ' +
              "summary:not(:disabled)",
          )
        );
        if (focusable) {
          focusable.focus();
          break;
        }
        target = target.parentElement;
      }
    }
  };
}
TreeBase.register(Designer, "Designer");

class DesignerPanel extends TreeBase {
  name = new String$1("");
  label = new String$1("");

  /** @type {Designer | null} */
  parent = null;

  active = false;
  tabName = "";
  tabLabel = "";
  lastFocused = "";

  // where to store in the db
  static tableName = "";
  // default value if it isn't found
  static defaultValue = {};

  /** @returns {string} */
  get staticTableName() {
    // @ts-expect-error
    return this.constructor.tableName;
  }

  /**
   * Load a panel from the database.
   *
   * I don't know why I have to pass the class as a parameter to get the types
   * to work. Why can't I refer to this in the static method which should be
   * the class.
   *
   * @template {DesignerPanel} T
   * @param {new()=>T} expected
   * @returns {Promise<T>}
   */
  static async load(expected) {
    let obj = await db.read(this.tableName, this.defaultValue);
    obj = this.upgrade(obj);
    const result = this.fromObject(obj);
    if (result instanceof expected) {
      result.configure();
      return result;
    }
    // I don't think this happens
    return this.create(expected);
  }

  /**
   * Render the details of a components settings
   */
  settingsDetails() {
    const caption = this.active ? "Active" : "Activate";
    let details = super.settingsDetails();
    if (!Array.isArray(details)) details = [details];
    return [
      ...details,
      html`<button
        id=${this.id + "-activate"}
        ?active=${this.active}
        @click=${() => {
          if (this.parent) {
            const parent = this.parent;
            callAfterRender(() => {
              Globals.layout.highlight();
            });
            parent.switchTab(this.name.value);
          }
        }}
      >
        ${caption}
      </button>`,
    ];
  }

  highlight() {}

  /**
   * An opportunity to upgrade the format if needed
   * @param {any} obj
   * @returns {Object}
   */
  static upgrade(obj) {
    return obj;
  }

  configure() {}

  onUpdate() {
    const tableName = this.staticTableName;
    if (tableName) {
      db.write(tableName, this.toObject());
      Globals.state.update();
    }
  }

  async undo() {
    const tableName = this.staticTableName;
    if (tableName) {
      await db.undo(tableName);
      Globals.restart();
    }
  }

  /** @param {string[]} classes
   * @returns {string}
   */
  CSSClasses(...classes) {
    classes.push("DesignerPanel");
    if (this.active) {
      classes.push("ActivePanel");
    }
    return super.CSSClasses(...classes);
  }
}

const content = '';

const wait$1 = '';

/**
 * Handle displaying a "please wait" message and error reporting for
 * async functions that may take a while or throw errors
 * @template T
 * @param {Promise<T>} promise
 * @param {string} message
 * @returns {Promise<T>}
 */
async function wait(promise, message = "Please wait") {
  const div = document.createElement("div");
  div.id = "PleaseWait";
  document.body.appendChild(div);
  const timer = window.setTimeout(() => {
    render(div, html`<div><p class="message">${message}</p></div>`);
  }, 500);
  try {
    const result = await promise;
    clearTimeout(timer);
    div.remove();
    return result;
  } catch (e) {
    console.trace("wait error");
    clearTimeout(timer);
    return new Promise((resolve) => {
      render(
        div,
        html`<div>
          <p class="error">${e.message}</p>
          <button
            @click=${() => {
              div.remove();
              resolve(e.message);
            }}
          >
            OK
          </button>
        </div>`,
      );
    });
  }
}

/** @param {Blob} blob */
async function readSheetFromBlob(blob) {
  const XLSX = await __vitePreload(() => import('./xlsx.js'),true?[]:void 0);
  const data = await blob.arrayBuffer();
  const workbook = XLSX.read(data, { codepage: 65001 });
  /** @type {Rows} */
  const dataArray = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const ref = sheet["!ref"];
    if (!ref) continue;
    const range = XLSX.utils.decode_range(ref);
    const names = [];
    const handlers = [];
    const validColumns = [];
    // process the header and choose a handler for each column
    for (let c = range.s.c; c <= range.e.c; c++) {
      let columnName = sheet[XLSX.utils.encode_cell({ r: 0, c })]?.v;
      if (typeof columnName !== "string" || !columnName) {
        continue;
      }
      columnName = columnName.toLowerCase();
      names.push(columnName.trim(" "));
      validColumns.push(c);
      switch (columnName) {
        case "row":
        case "column":
        case "page":
          handlers.push("number");
          break;
        default:
          handlers.push("string");
          break;
      }
    }
    // Process the rows
    for (let r = range.s.r + 1; r <= range.e.r; r++) {
      /** @type {Row} */
      const row = { sheetName };
      for (let i = 0; i < validColumns.length; i++) {
        /** @type {string} */
        const name = names[i];
        const c = validColumns[i];
        let value = sheet[XLSX.utils.encode_cell({ r, c })]?.v;
        switch (handlers[i]) {
          case "string":
            if (typeof value === "undefined") {
              value = "";
            }
            if (typeof value !== "string") {
              value = value.toString(10);
            }
            if (value && typeof value === "string") {
              row[name] = value;
            }
            break;
          case "number":
            if (typeof value === "number") {
              row[name] = Math.floor(value);
            } else if (value && typeof value === "string") {
              value = parseInt(value, 10);
              if (isNaN(value)) {
                value = 0;
              }
              row[name] = value;
            }
            break;
        }
      }
      if (Object.keys(row).length > 1) dataArray.push(row);
    }
  }
  return dataArray;
}

/** Save the content as a spreadsheet
 * @param {string} name
 * @param {Row[]} rows
 * @param {string} type
 */
async function saveContent(name, rows, type) {
  const XLSX = await wait(__vitePreload(() => import('./xlsx.js'),true?[]:void 0));
  const sheetNames = new Set(rows.map((row) => row.sheetName || "sheet1"));
  const workbook = XLSX.utils.book_new();
  for (const sheetName of sheetNames) {
    let sheetRows = rows.filter(
      (row) => sheetName == (row.sheetName || "sheet1"),
    );
    if (type != "csv") {
      sheetRows = sheetRows.map((row) => {
        const { sheetName, ...rest } = row;
        return rest;
      });
    }
    const worksheet = XLSX.utils.json_to_sheet(sheetRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }
  XLSX.writeFileXLSX(workbook, `${name}.${type}`);
}

class Content extends DesignerPanel {
  name = new String$1("Content");

  lastFocused = this.id;

  /** Delete the media files that are checked */
  async deleteSelected() {
    // list the names that are checked
    const toDelete = [
      ...document.querySelectorAll(
        "#ContentMedia input[type=checkbox]:checked",
      ),
    ].map((element) => {
      // clear the checks as we go
      const checkbox = /** @type{HTMLInputElement} */ (element);
      checkbox.checked = false;
      return checkbox.name;
    });
    const selectAll = /** @type {HTMLInputElement} */ (
      document.getElementById("ContentSelectAll")
    );
    if (selectAll) selectAll.checked = false;
    // delete them
    await wait(db.deleteMedia(...toDelete));
    // refresh the page
    Globals.state.update();
  }

  /** Check or uncheck all the media file checkboxes */
  selectAll({ target }) {
    for (const element of document.querySelectorAll(
      '#ContentMedia input[type="checkbox"]',
    )) {
      const checkbox = /** @type {HTMLInputElement} */ (element);
      checkbox.checked = target.checked;
    }
  }

  settings() {
    const data = Globals.data;
    return html`<div class=${this.CSSClasses("content")} id=${this.id}>
      <div>
        <h1>Content</h1>
        <p>
          ${data.allrows.length} rows with these fields:
          ${String([...data.allFields].sort()).replaceAll(",", ", ")}
        </p>
        <h2>Media files</h2>
        <button @click=${this.deleteSelected}>Delete checked</button>
        <label
          ><input
            type="checkbox"
            name="Select all"
            id="ContentSelectAll"
            @input=${this.selectAll}
          />Select All</label
        >
        <ol
          id="ContentMedia"
          style="column-count: 3"
          ref=${(/** @type {HTMLOListElement} */ ol) => {
            db.listMedia().then((names) => {
              const list = names.map(
                (name) =>
                  html`<li>
                    <label><input type="checkbox" name=${name} />${name}</label>
                  </li>`,
              );
              render(ol, html`${list}`);
            });
          }}
        ></ol>
      </div>
    </div>`;
  }
}
TreeBase.register(Content, "Content");

const logger = '';

class Logger extends TreeBase {
  // name = new Props.String("Log");
  stateName = new String$1("$Log");
  logUntil = new ADate();

  // I expect a string like #field1 $state1 $state2 #field3
  logThese = new TextArea("", {
    validate: this.validate,
    placeholder: "Enter state and field names to log",
  });

  // I expect a string listing event names to log
  logTheseEvents = new TextArea("", {
    validate: this.validateEventNames,
    placeholder: "Enter names of events to log",
  });

  /**
   * @param {string} s
   * @returns {string}
   */
  validate(s) {
    return /^(?:[#$]\w+\s*)*$/.test(s) ? "" : "Invalid input";
  }

  /**
   * Check for strings that look like event names
   *
   * @param {string} s
   * @returns {string}
   */
  validateEventNames(s) {
    return /^(?:\w+\s*)*$/.test(s) ? "" : "Invalid input";
  }

  template() {
    const { state, actions } = Globals;
    const stateName = this.stateName.value;
    const logUntil = this.logUntil.value;
    const logThese = this.logThese.value;
    const logging =
      !!state.get(stateName) && logUntil && new Date() < new Date(logUntil);
    const getValue = access(state, actions.last.data);

    if (logging) {
      const names = logThese.split(/\s+/);
      const record = {};
      for (const name of names) {
        const value = getValue(name);
        if (value) {
          record[name] = value;
        }
      }
      this.log(record);
    }

    return html`<div
      class="logging-indicator"
      ?logging=${logging}
      title="Logging"
    ></div>`;
  }

  /** Log a record to the database
   * @param {Object} record
   * @returns {void}
   */
  log(record) {
    const DateTime = new Date().toLocaleDateString("en-US", {
      fractionalSecondDigits: 2,
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    record = { DateTime, ...record };
    db.write("log", record);
  }

  init() {
    super.init();
    this.onUpdate();
  }

  /** @type {Set<string>} */
  listeners = new Set();
  onUpdate() {
    const UI = document.getElementById("UI");
    if (!UI) return;
    // cancel any listeners that are currently active
    for (const eventName of this.listeners) {
      UI.removeEventListener(eventName, this);
    }
    this.listeners.clear();

    // listen for each of the listed events
    for (const match of this.logTheseEvents.value.matchAll(/\w+/g)) {
      UI.addEventListener(match[0], this);
      this.listeners.add(match[0]);
    }
  }

  typesToInclude = new Set(["boolean", "number", "string"]);
  propsToExclude = new Set([
    "isTrusted",
    "bubbles",
    "cancelBubble",
    "cancelable",
    "defaultPrevented",
    "eventPhase",
    "returnValue",
    "timeStamp",
  ]);
  /**
   * Make this object a listener
   * @param {Event} e
   */
  handleEvent(e) {
    // grab all the fields of the event that are simple types
    const record = {};
    for (const prop in e) {
      // skip all upper case and _
      if (/^[A-Z_]+$/.test(prop)) continue;
      const value = e[prop];
      if (this.propsToExclude.has(prop)) continue;
      if (!this.typesToInclude.has(typeof value)) continue;
      record[prop] = value;
    }
    this.log(record);
  }
}
TreeBase.register(Logger, "Logger");

async function SaveLogs() {
  let toSave = await db.readAll("log");
  if (toSave.length > 0) {
    await saveContent("log", toSave, "xlsx");
  } else {
    Globals.error.report("No log records to be saved.");
    Globals.state.update();
  }
}

async function ClearLogs() {
  await db.clear("log");
}

const layout = '';

const emptyPage = {
  className: "Page",
  props: {},
  children: [
    {
      className: "Speech",
      props: {},
      children: [],
    },
  ],
};

// map old names to new for the transition
const typeToClassName = {
  audio: "Audio",
  stack: "Stack",
  page: "Page",
  grid: "Grid",
  speech: "Speech",
  button: "Button",
  logger: "Logger",
  gap: "Gap",
  option: "Option",
  radio: "Radio",
  vsd: "VSD",
  "modal dialog": "ModalDialog",
  "tab control": "TabControl",
  "tab panel": "TabPanel",
  display: "Display",
};

class Layout extends DesignerPanel {
  allowDelete = false;

  static tableName = "layout";
  static defaultValue = emptyPage;

  settings() {
    return html`<div
      class=${this.CSSClasses("layout")}
      help="Layout tab"
      id=${this.id}
      @keydown=${(/** @type {KeyboardEvent} */ event) => {
        const { key, ctrlKey } = event;
        if ((key == "H" || key == "h") && ctrlKey) {
          event.preventDefault();
          this.highlight();
        }
      }}
    >
      ${this.children[0].settings()}
    </div>`;
  }

  allowedChildren = ["Page"];

  /**
   * An opportunity to upgrade the format if needed
   * @param {any} obj
   * @returns {Object}
   */
  static upgrade(obj) {
    /** @param {Object} obj */
    function oldToNew(obj) {
      if ("type" in obj) {
        // convert to new representation
        const newObj = {
          children: obj.children.map((/** @type {Object} */ child) =>
            oldToNew(child),
          ),
        };
        if ("filters" in obj.props) {
          for (const filter of obj.props.filters) {
            newObj.children.push({
              className: "GridFilter",
              props: { ...filter },
              children: [],
            });
          }
        }
        newObj.className = typeToClassName[obj.type];
        const { filters, ...props } = obj.props;
        newObj.props = props;
        obj = newObj;
      }
      return obj;
    }
    obj = oldToNew(obj);
    // upgrade from the old format
    return {
      className: "Layout",
      props: { name: "Layout" },
      children: [obj],
    };
  }

  toObject() {
    return this.children[0].toObject();
  }

  /** Update the state
   */
  onUpdate() {
    db.write("layout", this.children[0].toObject());
    Globals.state.update();
  }

  /** Allow highlighting the current component in the UI
   */
  highlight() {
    // clear any existing highlight
    for (const element of document.querySelectorAll("#UI [highlight]")) {
      element.removeAttribute("highlight");
    }
    // find the selection in the panel
    let selected = document.querySelector("#UI [aria-selected]");
    if (!selected) return;
    selected = selected.closest("[id]");
    if (!selected) return;
    const id = selected.id;
    if (!id) return;
    let component = TreeBase.componentFromId(id);
    if (component) {
      const element = document.getElementById(component.id);
      if (element) {
        element.setAttribute("highlight", "component");
        return;
      }
      // the component is not currently visible. Find its nearest visible parent
      component = component.parent;
      while (component) {
        const element = document.getElementById(component.id);
        if (element) {
          element.setAttribute("highlight", "parent");
          return;
        }
        component = component.parent;
      }
    }
  }

  makeVisible() {
    let component = Globals.designer.selectedComponent;
    if (component) {
      const element = document.getElementById(component.id);
      if (element) {
        return; // already visible
      }
      // climb the tree scheduling updates to parent to make this component visible
      component = component.parent;
      let patch = {};
      while (component) {
        if (
          component instanceof TabPanel &&
          component.parent &&
          component.parent.currentPanel != component
        ) {
          patch[component.parent.stateName.value] = component.name.value;
        } else if (component instanceof ModalDialog) {
          patch[component.stateName.value] = 1;
        }
        component = component.parent;
      }
      callAfterRender(() => this.highlight());
      Globals.state.update(patch);
    }
  }
}
TreeBase.register(Layout, "Layout");

const actions = '';

class Actions extends DesignerPanel {
  name = new String$1("Actions");
  scale = new Float(1);

  allowedChildren = ["Action"];

  static tableName = "actions";
  static defaultValue = {
    className: "Actions",
    props: {},
    children: [],
  };

  /** @type {Action[]} */
  children = [];
  last = {
    /** @type {Action|Null} */
    rule: null,
    /** @type {Row} */
    data: {},
    /** @type {string} */
    event: "",
    /** @type {string} */
    origin: "",
  };

  allowDelete = false;

  configure() {
    this.applyRules("init", "init", {});
  }

  /** @typedef {Object} eventQueueItem
   * @property {string} origin
   * @property {string} event
   */

  /** @type {eventQueueItem[]} */
  eventQueue = [];

  /** queue an event from within an event handler
   * @param {String} origin
   * @param {String} event
   */
  queueEvent(origin, event) {
    this.eventQueue.push({ origin, event });
  }

  /**
   * Attempt to apply a rule
   *
   * @param {string} origin - name of the originating element
   * @param {string} event - type of event that occurred, i.e.press
   * @param {Object} data - data associated with the event
   */
  applyRules(origin, event, data) {
    // console.trace({ origin, event, data });
    this.last = { origin, event, data, rule: null };
    // first for the event then for any that got queued.
    for (;;) {
      for (const rule of this.children) {
        if (origin != rule.origin.value && rule.origin.value != "*") {
          continue;
        }
        const result = rule.conditions.every((restriction) =>
          restriction.Condition.valueInContext({ data }),
        );
        if (result) {
          this.last.rule = rule;
          const patch = Object.fromEntries(
            rule.updates.map((update) => [
              update.stateName.value,
              update.newValue.valueInContext({ data }),
            ]),
          );
          Globals.state.update(patch);
          break;
        }
      }
      if (this.eventQueue.length == 0) break;
      const item = this.eventQueue.pop();
      if (item) {
        origin = item.origin;
        event = item.event;
      }
      data = {};
    }
  }

  /**
   * Pass event to rules
   *
   * @param {string} origin - name of the originating element
   * @param {Object} data - data associated with the event
   * @param {string} [event] - optional name for the event
   * @return {(event:Event) => void}
   */
  handler(origin, data, event) {
    return (e) => {
      let ev = event;
      if (e instanceof PointerEvent && e.altKey) {
        ev = "alt-" + event;
      }
      this.applyRules(origin, ev || e.type, data);
    };
  }

  /** @returns {Set<string>} */
  allStates() {
    const result = new Set();
    for (const rule of this.children) {
      for (const condition of rule.conditions) {
        for (const [match] of condition.Condition.text.matchAll(/\$\w+/g)) {
          result.add(match);
        }
      }
      for (const update of rule.updates) {
        result.add(update.stateName.value);
        for (const [match] of update.newValue.text.matchAll(/\$\w+/g)) {
          result.add(match);
        }
      }
    }
    return result;
  }

  settings() {
    const { actions } = Globals;
    const rule = this.last.rule;
    return html`<div
      class=${this.CSSClasses("actions")}
      help="Actions"
      id=${this.id}
    >
      <table>
        <thead>
          <tr>
            <th rowspan="2" style="width:13%">Origin</th>
            <th rowspan="2" style="width:25%">Conditions</th>
            <th colspan="2" style="width:50%">Updates</th>
          </tr>
          <tr>
            <th style="width:15%">State</th>
            <th style="width:35%">New value</th>
          </tr>
        </thead>
        ${actions.children.map((action) => {
          const updates = action.updates;
          const rs = updates.length;
          const used = action === actions.last.rule;
          /** @param {ActionUpdate} update */
          function showUpdate(update) {
            return html`
              <td>${update.stateName.input()}</td>
              <td class="update">${update.newValue.input()}</td>
            `;
          }
          return html`<tbody ?highlight=${rule == action} class="settings">
            <tr ?used=${used}>
              <td rowspan=${rs}>${action.origin.input()}</td>
              <td class="conditions" rowspan=${rs}>
                <div class="conditions">
                  ${action.conditions.map(
                    (condition) =>
                      html`<div class="condition">
                        ${condition.Condition.input()}
                      </div>`,
                  )}
                </div>
              </td>
              ${!rs
                ? html`<td></td>
                    <td></td>`
                : showUpdate(updates[0])}
            </tr>
            ${updates.slice(1).map(
              (update) =>
                html`<tr ?used=${used}>
                  ${showUpdate(update)}
                </tr>`,
            )}
          </tbody>`;
        })}
      </table>
    </div>`;
  }

  /** @param {any} actions */
  static upgrade(actions) {
    // convert from the old format if necessary
    if (Array.isArray(actions)) {
      actions = {
        className: "Actions",
        props: {},
        children: actions.map((action) => {
          let { event, origin, conditions, updates } = action;
          const children = [];
          for (const condition of conditions) {
            children.push({
              className: "ActionCondition",
              props: { Condition: condition },
              children: [],
            });
          }
          for (const [$var, value] of Object.entries(updates)) {
            children.push({
              className: "ActionUpdate",
              props: { stateName: $var, newValue: value },
              children: [],
            });
          }
          if (event == "init") origin = "init";
          return {
            className: "Action",
            props: { origin },
            children,
          };
        }),
      };
    }
    return actions;
  }
}
TreeBase.register(Actions, "Actions");

let Action$1 = class Action extends TreeBase {
  allowedChildren = ["ActionCondition", "ActionUpdate"];
  /** @type {(ActionCondition | ActionUpdate)[]} */
  children = [];

  origin = new String$1("", { hiddenLabel: true });

  get conditions() {
    return this.filterChildren(ActionCondition);
  }

  get updates() {
    return this.filterChildren(ActionUpdate);
  }

  init() {
    super.init();
    if (this.children.length == 0) {
      // add a condition and update if none are present
      TreeBase.create(ActionCondition, this, {}).init();
      TreeBase.create(ActionUpdate, this, {}).init();
    }
  }
};
TreeBase.register(Action$1, "Action");

class ActionCondition extends TreeBase {
  Condition = new Conditional("", {
    hiddenLabel: true,
    valueWhenEmpty: true,
  });

  /** move my parent instead of me.
   * @param {boolean} up
   */
  moveUpDown(up) {
    this.parent?.moveUpDown(up);
  }
}
TreeBase.register(ActionCondition, "ActionCondition");

class ActionUpdate extends TreeBase {
  stateName = new String$1("", { hiddenLabel: true });
  newValue = new Expression("", { hiddenLabel: true });

  /** move my parent instead of me.
   * @param {boolean} up
   */
  moveUpDown(up) {
    this.parent?.moveUpDown(up);
  }
}
TreeBase.register(ActionUpdate, "ActionUpdate");

const hotkeys = '';

/** Global Hot Keys for keyboard access */


function showHints() {
  document.body.classList.add("hints");
}

function clearHints() {
  document.body.classList.remove("hints");
}

function editMode() {
  Globals.state.update({ editing: true });
}

function userMode() {
  Globals.state.update({ editing: false });
  clearHints();
}

/**
 * Click a toolbar input based on its hint
 * @param {string} key
 */
function clickToolbar(key) {
  clearHints();
  const hint = document.querySelector(`.toolbar div[hint="${key}" i]`);
  if (hint) {
    const input = /** @type {HTMLInputElement} */ (
      hint.querySelector("button,input")
    );
    input.focus();
    input.click();
  }
}

/**
 * Focus on the UI part of the designer for testing keyboard input
 * @returns {void}
 */
function focusUI() {
  clearHints();
  document.getElementById("UI")?.focus();
}

/**
 * Restore focus to the designer panel
 * @returns {void}
 */
function focusPanel() {
  clearHints();
  Globals.designer.restoreFocus();
}

function focusTabs() {
  clearHints();
  const currentTab = /** @type {HTMLButtonElement} */ (
    document.querySelector("#designer #tabs .buttons button[active]")
  );
  console.log({ currentTab });
  if (currentTab) {
    currentTab.focus();
    return;
  }
  const tabs = /** @type {HTMLButtonElement[]} */ ([
    ...document.querySelectorAll(".designing #designer #tabs .buttons button"),
  ]);
  if (!tabs.length) return;
  tabs[0].focus();
}

/** Implement a state machine for managing the hotkeys
 * @enum {string}
 */
const State = {
  user: "user",
  userA: "userA",
  editing: "editing",
  hints: "hints",
};

/** @type {State | undefined} */
let state = undefined;

/**
 * State machine transition table
 * @typedef {Object} Transition
 * @property {State} state - current state
 * @property {RegExp} key - input key
 * @property {State} next - next state
 * @property {Function} [call] - function to call on entering
 */

/** @type {Transition[]} */
// prettier-ignore
const transitions = [
  { state: State.user,    key: /alt/i,    next: State.userA                       },
  { state: State.userA,   key: /d/i,      next: State.editing, call: editMode     },
  { state: State.editing, key: /alt/i,    next: State.hints,   call: showHints    },
  { state: State.hints,   key: /d/i,      next: State.user,    call: userMode     },
  { state: State.hints,   key: /[nfeah]/i,next: State.editing, call: clickToolbar },
  { state: State.hints,   key: /t/i,      next: State.editing, call: focusTabs    },
  { state: State.hints,   key: /u/i,      next: State.editing, call: focusUI      },
  { state: State.hints,   key: /p/i,      next: State.editing, call: focusPanel   },
  { state: State.hints,   key: /shift/i,  next: State.hints                       },
  { state: State.hints,   key: /.*/i,     next: State.editing, call: clearHints   },
];

/** Toolbar activation and hints
 *
 * @param {KeyboardEvent} event */
function HotKeyHandler(event) {
  if (!Globals.state) return;
  if (!state) {
    // initialize the state on first call
    state = Globals.state.get("editing") ? State.editing : State.user;
  }
  const key = event.key;
  if (!key) return;
  for (const T of transitions) {
    if (T.state == state) {
      const match = key.match(T.key);
      if (match && match[0].length === key.length) {
        // exact match
        event.preventDefault();
        if (event.repeat) break; // kill key repeat
        state = T.next;
        if (T.call) {
          T.call(key);
        }
        break;
      }
    }
  }
}
document.addEventListener("keydown", HotKeyHandler, { capture: true });

window.addEventListener("blur", () => {
  clearHints();
});

/**
 * Customize component allows modifying the CSS of the UI to
 * adjust colors, size and placement of elements.
 */
class Customize extends TreeBase {
  name = new String$1("Style");
  css = new Code("", { placeholder: "Enter CSS", label: "CSS" });

  /** @type {string[]} */
  allowedChildren = [];

  template() {
    return html`<style>
      ${Globals.state.interpolate(this.css.editedValue)}
    </style>`;
  }
}
TreeBase.register(Customize, "Customize");

/**
 * An image that is extracted from the database
 */
class imgFromDb extends HTMLImageElement {
  // watch for changes in dbsrc
  static get observedAttributes() {
    return ["dbsrc", "refresh"];
  }

  /**
   * Handle changes in dbsrc
   * @param {string} name
   * @param {string} _
   * @param {string} newValue */
  attributeChangedCallback(name, _, newValue) {
    if (name === "dbsrc" && newValue) {
      this.updateSrcFromDb(newValue);
    }
  }

  /**
   * Look again at the db which may have changed
   */
  async refresh() {
    const url = this.getAttribute("dbsrc") || "";
    return this.updateSrcFromDb(url);
  }

  /** Update the img src from the db or the provided url
   * @param {string} url
   */
  async updateSrcFromDb(url) {
    // if it contains a slash treat it like an external url
    // if not, fetch it from the db
    if (url && url.indexOf("/") < 0) url = await db.getMediaURL(url);
    if (url) {
      this.src = url;
      this.dispatchEvent(new Event("load", { bubbles: true }));
    }
  }
}
customElements.define("img-db", imgFromDb, { extends: "img" });

/**
 * A video that is extracted from the database
 */
class videoFromDb extends HTMLVideoElement {
  // watch for changes in dbsrc
  static get observedAttributes() {
    return ["dbsrc", "refresh"];
  }

  /**
   * Handle changes in dbsrc
   * @param {string} name
   * @param {string} _
   * @param {string} newValue */
  attributeChangedCallback(name, _, newValue) {
    if (name === "dbsrc" && newValue) {
      this.updateSrcFromDb(newValue);
    }
  }

  /**
   * Look again at the db which may have changed
   */
  async refresh() {
    const url = this.getAttribute("dbsrc") || "";
    return this.updateSrcFromDb(url);
  }

  /** Update the img src from the db or the provided url
   * @param {string} url
   */
  async updateSrcFromDb(url) {
    // if it contains a slash treat it like an external url
    // if not, fetch it from the db
    if (url && url.indexOf("/") < 0) url = await db.getMediaURL(url);
    if (url) this.src = url;
  }
}
customElements.define("video-db", videoFromDb, { extends: "video" });

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
  function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function isFunction(value) {
    return typeof value === 'function';
}

function createErrorClass(createImpl) {
    var _super = function (instance) {
        Error.call(instance);
        instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
}

var UnsubscriptionError = createErrorClass(function (_super) {
    return function UnsubscriptionErrorImpl(errors) {
        _super(this);
        this.message = errors
            ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ')
            : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
    };
});

function arrRemove(arr, item) {
    if (arr) {
        var index = arr.indexOf(item);
        0 <= index && arr.splice(index, 1);
    }
}

var Subscription = (function () {
    function Subscription(initialTeardown) {
        this.initialTeardown = initialTeardown;
        this.closed = false;
        this._parentage = null;
        this._finalizers = null;
    }
    Subscription.prototype.unsubscribe = function () {
        var e_1, _a, e_2, _b;
        var errors;
        if (!this.closed) {
            this.closed = true;
            var _parentage = this._parentage;
            if (_parentage) {
                this._parentage = null;
                if (Array.isArray(_parentage)) {
                    try {
                        for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                            var parent_1 = _parentage_1_1.value;
                            parent_1.remove(this);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else {
                    _parentage.remove(this);
                }
            }
            var initialFinalizer = this.initialTeardown;
            if (isFunction(initialFinalizer)) {
                try {
                    initialFinalizer();
                }
                catch (e) {
                    errors = e instanceof UnsubscriptionError ? e.errors : [e];
                }
            }
            var _finalizers = this._finalizers;
            if (_finalizers) {
                this._finalizers = null;
                try {
                    for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
                        var finalizer = _finalizers_1_1.value;
                        try {
                            execFinalizer(finalizer);
                        }
                        catch (err) {
                            errors = errors !== null && errors !== void 0 ? errors : [];
                            if (err instanceof UnsubscriptionError) {
                                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                            }
                            else {
                                errors.push(err);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            if (errors) {
                throw new UnsubscriptionError(errors);
            }
        }
    };
    Subscription.prototype.add = function (teardown) {
        var _a;
        if (teardown && teardown !== this) {
            if (this.closed) {
                execFinalizer(teardown);
            }
            else {
                if (teardown instanceof Subscription) {
                    if (teardown.closed || teardown._hasParent(this)) {
                        return;
                    }
                    teardown._addParent(this);
                }
                (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
            }
        }
    };
    Subscription.prototype._hasParent = function (parent) {
        var _parentage = this._parentage;
        return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
    };
    Subscription.prototype._addParent = function (parent) {
        var _parentage = this._parentage;
        this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription.prototype._removeParent = function (parent) {
        var _parentage = this._parentage;
        if (_parentage === parent) {
            this._parentage = null;
        }
        else if (Array.isArray(_parentage)) {
            arrRemove(_parentage, parent);
        }
    };
    Subscription.prototype.remove = function (teardown) {
        var _finalizers = this._finalizers;
        _finalizers && arrRemove(_finalizers, teardown);
        if (teardown instanceof Subscription) {
            teardown._removeParent(this);
        }
    };
    Subscription.EMPTY = (function () {
        var empty = new Subscription();
        empty.closed = true;
        return empty;
    })();
    return Subscription;
}());
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
    return (value instanceof Subscription ||
        (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
}
function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
        finalizer();
    }
    else {
        finalizer.unsubscribe();
    }
}

var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: undefined,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false,
};

var timeoutProvider = {
    setTimeout: function (handler, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var delegate = timeoutProvider.delegate;
        if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
            return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
        }
        return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearTimeout: function (handle) {
        var delegate = timeoutProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: undefined,
};

function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function () {
        {
            throw err;
        }
    });
}

function noop() { }

function errorContext(cb) {
    {
        cb();
    }
}

var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destination) {
        var _this = _super.call(this) || this;
        _this.isStopped = false;
        if (destination) {
            _this.destination = destination;
            if (isSubscription(destination)) {
                destination.add(_this);
            }
        }
        else {
            _this.destination = EMPTY_OBSERVER;
        }
        return _this;
    }
    Subscriber.create = function (next, error, complete) {
        return new SafeSubscriber(next, error, complete);
    };
    Subscriber.prototype.next = function (value) {
        if (this.isStopped) ;
        else {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (this.isStopped) ;
        else {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (this.isStopped) ;
        else {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
            this.destination = null;
        }
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        try {
            this.destination.error(err);
        }
        finally {
            this.unsubscribe();
        }
    };
    Subscriber.prototype._complete = function () {
        try {
            this.destination.complete();
        }
        finally {
            this.unsubscribe();
        }
    };
    return Subscriber;
}(Subscription));
var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
}
var ConsumerObserver = (function () {
    function ConsumerObserver(partialObserver) {
        this.partialObserver = partialObserver;
    }
    ConsumerObserver.prototype.next = function (value) {
        var partialObserver = this.partialObserver;
        if (partialObserver.next) {
            try {
                partialObserver.next(value);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    ConsumerObserver.prototype.error = function (err) {
        var partialObserver = this.partialObserver;
        if (partialObserver.error) {
            try {
                partialObserver.error(err);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
        else {
            handleUnhandledError(err);
        }
    };
    ConsumerObserver.prototype.complete = function () {
        var partialObserver = this.partialObserver;
        if (partialObserver.complete) {
            try {
                partialObserver.complete();
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    return ConsumerObserver;
}());
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        var partialObserver;
        if (isFunction(observerOrNext) || !observerOrNext) {
            partialObserver = {
                next: (observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : undefined),
                error: error !== null && error !== void 0 ? error : undefined,
                complete: complete !== null && complete !== void 0 ? complete : undefined,
            };
        }
        else {
            var context_1;
            if (_this && config.useDeprecatedNextContext) {
                context_1 = Object.create(observerOrNext);
                context_1.unsubscribe = function () { return _this.unsubscribe(); };
                partialObserver = {
                    next: observerOrNext.next && bind(observerOrNext.next, context_1),
                    error: observerOrNext.error && bind(observerOrNext.error, context_1),
                    complete: observerOrNext.complete && bind(observerOrNext.complete, context_1),
                };
            }
            else {
                partialObserver = observerOrNext;
            }
        }
        _this.destination = new ConsumerObserver(partialObserver);
        return _this;
    }
    return SafeSubscriber;
}(Subscriber));
function handleUnhandledError(error) {
    {
        reportUnhandledError(error);
    }
}
function defaultErrorHandler(err) {
    throw err;
}
var EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop,
};

var observable = (function () { return (typeof Symbol === 'function' && Symbol.observable) || '@@observable'; })();

function identity(x) {
    return x;
}

function pipeFromArray(fns) {
    if (fns.length === 0) {
        return identity;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}

var Observable = (function () {
    function Observable(subscribe) {
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var _this = this;
        var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
        errorContext(function () {
            var _a = _this, operator = _a.operator, source = _a.source;
            subscriber.add(operator
                ?
                    operator.call(subscriber, source)
                : source
                    ?
                        _this._subscribe(subscriber)
                    :
                        _this._trySubscribe(subscriber));
        });
        return subscriber;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.error(err);
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscriber = new SafeSubscriber({
                next: function (value) {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscriber.unsubscribe();
                    }
                },
                error: reject,
                complete: resolve,
            });
            _this.subscribe(subscriber);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var _a;
        return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    };
    Observable.prototype[observable] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        return pipeFromArray(operations)(this);
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return (value = x); }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
function getPromiseCtor(promiseCtor) {
    var _a;
    return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
    return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
}

function hasLift(source) {
    return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
    return function (source) {
        if (hasLift(source)) {
            return source.lift(function (liftedSource) {
                try {
                    return init(liftedSource, this);
                }
                catch (err) {
                    this.error(err);
                }
            });
        }
        throw new TypeError('Unable to lift unknown Observable type');
    };
}

function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = (function (_super) {
    __extends(OperatorSubscriber, _super);
    function OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
        var _this = _super.call(this, destination) || this;
        _this.onFinalize = onFinalize;
        _this.shouldUnsubscribe = shouldUnsubscribe;
        _this._next = onNext
            ? function (value) {
                try {
                    onNext(value);
                }
                catch (err) {
                    destination.error(err);
                }
            }
            : _super.prototype._next;
        _this._error = onError
            ? function (err) {
                try {
                    onError(err);
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._error;
        _this._complete = onComplete
            ? function () {
                try {
                    onComplete();
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._complete;
        return _this;
    }
    OperatorSubscriber.prototype.unsubscribe = function () {
        var _a;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            var closed_1 = this.closed;
            _super.prototype.unsubscribe.call(this);
            !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
        }
    };
    return OperatorSubscriber;
}(Subscriber));

var ObjectUnsubscribedError = createErrorClass(function (_super) {
    return function ObjectUnsubscribedErrorImpl() {
        _super(this);
        this.name = 'ObjectUnsubscribedError';
        this.message = 'object unsubscribed';
    };
});

var Subject = (function (_super) {
    __extends(Subject, _super);
    function Subject() {
        var _this = _super.call(this) || this;
        _this.closed = false;
        _this.currentObservers = null;
        _this.observers = [];
        _this.isStopped = false;
        _this.hasError = false;
        _this.thrownError = null;
        return _this;
    }
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype._throwIfClosed = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
    };
    Subject.prototype.next = function (value) {
        var _this = this;
        errorContext(function () {
            var e_1, _a;
            _this._throwIfClosed();
            if (!_this.isStopped) {
                if (!_this.currentObservers) {
                    _this.currentObservers = Array.from(_this.observers);
                }
                try {
                    for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var observer = _c.value;
                        observer.next(value);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        });
    };
    Subject.prototype.error = function (err) {
        var _this = this;
        errorContext(function () {
            _this._throwIfClosed();
            if (!_this.isStopped) {
                _this.hasError = _this.isStopped = true;
                _this.thrownError = err;
                var observers = _this.observers;
                while (observers.length) {
                    observers.shift().error(err);
                }
            }
        });
    };
    Subject.prototype.complete = function () {
        var _this = this;
        errorContext(function () {
            _this._throwIfClosed();
            if (!_this.isStopped) {
                _this.isStopped = true;
                var observers = _this.observers;
                while (observers.length) {
                    observers.shift().complete();
                }
            }
        });
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = this.closed = true;
        this.observers = this.currentObservers = null;
    };
    Object.defineProperty(Subject.prototype, "observed", {
        get: function () {
            var _a;
            return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
        },
        enumerable: false,
        configurable: true
    });
    Subject.prototype._trySubscribe = function (subscriber) {
        this._throwIfClosed();
        return _super.prototype._trySubscribe.call(this, subscriber);
    };
    Subject.prototype._subscribe = function (subscriber) {
        this._throwIfClosed();
        this._checkFinalizedStatuses(subscriber);
        return this._innerSubscribe(subscriber);
    };
    Subject.prototype._innerSubscribe = function (subscriber) {
        var _this = this;
        var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
        if (hasError || isStopped) {
            return EMPTY_SUBSCRIPTION;
        }
        this.currentObservers = null;
        observers.push(subscriber);
        return new Subscription(function () {
            _this.currentObservers = null;
            arrRemove(observers, subscriber);
        });
    };
    Subject.prototype._checkFinalizedStatuses = function (subscriber) {
        var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
        if (hasError) {
            subscriber.error(thrownError);
        }
        else if (isStopped) {
            subscriber.complete();
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable));
var AnonymousSubject = (function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.source = source;
        return _this;
    }
    AnonymousSubject.prototype.next = function (value) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    };
    AnonymousSubject.prototype.error = function (err) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
    };
    AnonymousSubject.prototype.complete = function () {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var _a, _b;
        return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
    };
    return AnonymousSubject;
}(Subject));

var dateTimestampProvider = {
    now: function () {
        return (dateTimestampProvider.delegate || Date).now();
    },
    delegate: undefined,
};

var ReplaySubject = (function (_super) {
    __extends(ReplaySubject, _super);
    function ReplaySubject(_bufferSize, _windowTime, _timestampProvider) {
        if (_bufferSize === void 0) { _bufferSize = Infinity; }
        if (_windowTime === void 0) { _windowTime = Infinity; }
        if (_timestampProvider === void 0) { _timestampProvider = dateTimestampProvider; }
        var _this = _super.call(this) || this;
        _this._bufferSize = _bufferSize;
        _this._windowTime = _windowTime;
        _this._timestampProvider = _timestampProvider;
        _this._buffer = [];
        _this._infiniteTimeWindow = true;
        _this._infiniteTimeWindow = _windowTime === Infinity;
        _this._bufferSize = Math.max(1, _bufferSize);
        _this._windowTime = Math.max(1, _windowTime);
        return _this;
    }
    ReplaySubject.prototype.next = function (value) {
        var _a = this, isStopped = _a.isStopped, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
        if (!isStopped) {
            _buffer.push(value);
            !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
        }
        this._trimBuffer();
        _super.prototype.next.call(this, value);
    };
    ReplaySubject.prototype._subscribe = function (subscriber) {
        this._throwIfClosed();
        this._trimBuffer();
        var subscription = this._innerSubscribe(subscriber);
        var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow, _buffer = _a._buffer;
        var copy = _buffer.slice();
        for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
            subscriber.next(copy[i]);
        }
        this._checkFinalizedStatuses(subscriber);
        return subscription;
    };
    ReplaySubject.prototype._trimBuffer = function () {
        var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
        var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
        _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
        if (!_infiniteTimeWindow) {
            var now = _timestampProvider.now();
            var last = 0;
            for (var i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
                last = i;
            }
            last && _buffer.splice(0, last + 1);
        }
    };
    return ReplaySubject;
}(Subject));

var Action = (function (_super) {
    __extends(Action, _super);
    function Action(scheduler, work) {
        return _super.call(this) || this;
    }
    Action.prototype.schedule = function (state, delay) {
        return this;
    };
    return Action;
}(Subscription));

var intervalProvider = {
    setInterval: function (handler, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var delegate = intervalProvider.delegate;
        if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) {
            return delegate.setInterval.apply(delegate, __spreadArray([handler, timeout], __read(args)));
        }
        return setInterval.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearInterval: function (handle) {
        var delegate = intervalProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
    },
    delegate: undefined,
};

var AsyncAction = (function (_super) {
    __extends(AsyncAction, _super);
    function AsyncAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        _this.pending = false;
        return _this;
    }
    AsyncAction.prototype.schedule = function (state, delay) {
        var _a;
        if (delay === void 0) { delay = 0; }
        if (this.closed) {
            return this;
        }
        this.state = state;
        var id = this.id;
        var scheduler = this.scheduler;
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        this.pending = true;
        this.delay = delay;
        this.id = (_a = this.id) !== null && _a !== void 0 ? _a : this.requestAsyncId(scheduler, this.id, delay);
        return this;
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, _id, delay) {
        if (delay === void 0) { delay = 0; }
        return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (_scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        if (delay != null && this.delay === delay && this.pending === false) {
            return id;
        }
        if (id != null) {
            intervalProvider.clearInterval(id);
        }
        return undefined;
    };
    AsyncAction.prototype.execute = function (state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        var error = this._execute(state, delay);
        if (error) {
            return error;
        }
        else if (this.pending === false && this.id != null) {
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    };
    AsyncAction.prototype._execute = function (state, _delay) {
        var errored = false;
        var errorValue;
        try {
            this.work(state);
        }
        catch (e) {
            errored = true;
            errorValue = e ? e : new Error('Scheduled action threw falsy error');
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    };
    AsyncAction.prototype.unsubscribe = function () {
        if (!this.closed) {
            var _a = this, id = _a.id, scheduler = _a.scheduler;
            var actions = scheduler.actions;
            this.work = this.state = this.scheduler = null;
            this.pending = false;
            arrRemove(actions, this);
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, null);
            }
            this.delay = null;
            _super.prototype.unsubscribe.call(this);
        }
    };
    return AsyncAction;
}(Action));

var Scheduler = (function () {
    function Scheduler(schedulerActionCtor, now) {
        if (now === void 0) { now = Scheduler.now; }
        this.schedulerActionCtor = schedulerActionCtor;
        this.now = now;
    }
    Scheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) { delay = 0; }
        return new this.schedulerActionCtor(this, work).schedule(state, delay);
    };
    Scheduler.now = dateTimestampProvider.now;
    return Scheduler;
}());

var AsyncScheduler = (function (_super) {
    __extends(AsyncScheduler, _super);
    function AsyncScheduler(SchedulerAction, now) {
        if (now === void 0) { now = Scheduler.now; }
        var _this = _super.call(this, SchedulerAction, now) || this;
        _this.actions = [];
        _this._active = false;
        return _this;
    }
    AsyncScheduler.prototype.flush = function (action) {
        var actions = this.actions;
        if (this._active) {
            actions.push(action);
            return;
        }
        var error;
        this._active = true;
        do {
            if ((error = action.execute(action.state, action.delay))) {
                break;
            }
        } while ((action = actions.shift()));
        this._active = false;
        if (error) {
            while ((action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsyncScheduler;
}(Scheduler));

var asyncScheduler = new AsyncScheduler(AsyncAction);
var async = asyncScheduler;

var EMPTY = new Observable(function (subscriber) { return subscriber.complete(); });

function isScheduler(value) {
    return value && isFunction(value.schedule);
}

function last(arr) {
    return arr[arr.length - 1];
}
function popScheduler(args) {
    return isScheduler(last(args)) ? args.pop() : undefined;
}
function popNumber(args, defaultValue) {
    return typeof last(args) === 'number' ? args.pop() : defaultValue;
}

var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

function isPromise(value) {
    return isFunction(value === null || value === void 0 ? void 0 : value.then);
}

function isInteropObservable(input) {
    return isFunction(input[observable]);
}

function isAsyncIterable(obj) {
    return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}

function createInvalidObservableTypeError(input) {
    return new TypeError("You provided " + (input !== null && typeof input === 'object' ? 'an invalid object' : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}

function getSymbolIterator() {
    if (typeof Symbol !== 'function' || !Symbol.iterator) {
        return '@@iterator';
    }
    return Symbol.iterator;
}
var iterator = getSymbolIterator();

function isIterable(input) {
    return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
}

function readableStreamLikeToAsyncGenerator(readableStream) {
    return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
        var reader, _a, value, done;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reader = readableStream.getReader();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 9, 10]);
                    _b.label = 2;
                case 2:
                    return [4, __await(reader.read())];
                case 3:
                    _a = _b.sent(), value = _a.value, done = _a.done;
                    if (!done) return [3, 5];
                    return [4, __await(void 0)];
                case 4: return [2, _b.sent()];
                case 5: return [4, __await(value)];
                case 6: return [4, _b.sent()];
                case 7:
                    _b.sent();
                    return [3, 2];
                case 8: return [3, 10];
                case 9:
                    reader.releaseLock();
                    return [7];
                case 10: return [2];
            }
        });
    });
}
function isReadableStreamLike(obj) {
    return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
}

function innerFrom(input) {
    if (input instanceof Observable) {
        return input;
    }
    if (input != null) {
        if (isInteropObservable(input)) {
            return fromInteropObservable(input);
        }
        if (isArrayLike(input)) {
            return fromArrayLike(input);
        }
        if (isPromise(input)) {
            return fromPromise(input);
        }
        if (isAsyncIterable(input)) {
            return fromAsyncIterable(input);
        }
        if (isIterable(input)) {
            return fromIterable(input);
        }
        if (isReadableStreamLike(input)) {
            return fromReadableStreamLike(input);
        }
    }
    throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
    return new Observable(function (subscriber) {
        var obs = obj[observable]();
        if (isFunction(obs.subscribe)) {
            return obs.subscribe(subscriber);
        }
        throw new TypeError('Provided object does not correctly implement Symbol.observable');
    });
}
function fromArrayLike(array) {
    return new Observable(function (subscriber) {
        for (var i = 0; i < array.length && !subscriber.closed; i++) {
            subscriber.next(array[i]);
        }
        subscriber.complete();
    });
}
function fromPromise(promise) {
    return new Observable(function (subscriber) {
        promise
            .then(function (value) {
            if (!subscriber.closed) {
                subscriber.next(value);
                subscriber.complete();
            }
        }, function (err) { return subscriber.error(err); })
            .then(null, reportUnhandledError);
    });
}
function fromIterable(iterable) {
    return new Observable(function (subscriber) {
        var e_1, _a;
        try {
            for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                var value = iterable_1_1.value;
                subscriber.next(value);
                if (subscriber.closed) {
                    return;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        subscriber.complete();
    });
}
function fromAsyncIterable(asyncIterable) {
    return new Observable(function (subscriber) {
        process(asyncIterable, subscriber).catch(function (err) { return subscriber.error(err); });
    });
}
function fromReadableStreamLike(readableStream) {
    return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
function process(asyncIterable, subscriber) {
    var asyncIterable_1, asyncIterable_1_1;
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function () {
        var value, e_2_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, 6, 11]);
                    asyncIterable_1 = __asyncValues(asyncIterable);
                    _b.label = 1;
                case 1: return [4, asyncIterable_1.next()];
                case 2:
                    if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
                    value = asyncIterable_1_1.value;
                    subscriber.next(value);
                    if (subscriber.closed) {
                        return [2];
                    }
                    _b.label = 3;
                case 3: return [3, 1];
                case 4: return [3, 11];
                case 5:
                    e_2_1 = _b.sent();
                    e_2 = { error: e_2_1 };
                    return [3, 11];
                case 6:
                    _b.trys.push([6, , 9, 10]);
                    if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
                    return [4, _a.call(asyncIterable_1)];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8: return [3, 10];
                case 9:
                    if (e_2) throw e_2.error;
                    return [7];
                case 10: return [7];
                case 11:
                    subscriber.complete();
                    return [2];
            }
        });
    });
}

function executeSchedule(parentSubscription, scheduler, work, delay, repeat) {
    if (delay === void 0) { delay = 0; }
    if (repeat === void 0) { repeat = false; }
    var scheduleSubscription = scheduler.schedule(function () {
        work();
        if (repeat) {
            parentSubscription.add(this.schedule(null, delay));
        }
        else {
            this.unsubscribe();
        }
    }, delay);
    parentSubscription.add(scheduleSubscription);
    if (!repeat) {
        return scheduleSubscription;
    }
}

function observeOn(scheduler, delay) {
    if (delay === void 0) { delay = 0; }
    return operate(function (source, subscriber) {
        source.subscribe(createOperatorSubscriber(subscriber, function (value) { return executeSchedule(subscriber, scheduler, function () { return subscriber.next(value); }, delay); }, function () { return executeSchedule(subscriber, scheduler, function () { return subscriber.complete(); }, delay); }, function (err) { return executeSchedule(subscriber, scheduler, function () { return subscriber.error(err); }, delay); }));
    });
}

function subscribeOn(scheduler, delay) {
    if (delay === void 0) { delay = 0; }
    return operate(function (source, subscriber) {
        subscriber.add(scheduler.schedule(function () { return source.subscribe(subscriber); }, delay));
    });
}

function scheduleObservable(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

function schedulePromise(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

function scheduleArray(input, scheduler) {
    return new Observable(function (subscriber) {
        var i = 0;
        return scheduler.schedule(function () {
            if (i === input.length) {
                subscriber.complete();
            }
            else {
                subscriber.next(input[i++]);
                if (!subscriber.closed) {
                    this.schedule();
                }
            }
        });
    });
}

function scheduleIterable(input, scheduler) {
    return new Observable(function (subscriber) {
        var iterator$1;
        executeSchedule(subscriber, scheduler, function () {
            iterator$1 = input[iterator]();
            executeSchedule(subscriber, scheduler, function () {
                var _a;
                var value;
                var done;
                try {
                    (_a = iterator$1.next(), value = _a.value, done = _a.done);
                }
                catch (err) {
                    subscriber.error(err);
                    return;
                }
                if (done) {
                    subscriber.complete();
                }
                else {
                    subscriber.next(value);
                }
            }, 0, true);
        });
        return function () { return isFunction(iterator$1 === null || iterator$1 === void 0 ? void 0 : iterator$1.return) && iterator$1.return(); };
    });
}

function scheduleAsyncIterable(input, scheduler) {
    if (!input) {
        throw new Error('Iterable cannot be null');
    }
    return new Observable(function (subscriber) {
        executeSchedule(subscriber, scheduler, function () {
            var iterator = input[Symbol.asyncIterator]();
            executeSchedule(subscriber, scheduler, function () {
                iterator.next().then(function (result) {
                    if (result.done) {
                        subscriber.complete();
                    }
                    else {
                        subscriber.next(result.value);
                    }
                });
            }, 0, true);
        });
    });
}

function scheduleReadableStreamLike(input, scheduler) {
    return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}

function scheduled(input, scheduler) {
    if (input != null) {
        if (isInteropObservable(input)) {
            return scheduleObservable(input, scheduler);
        }
        if (isArrayLike(input)) {
            return scheduleArray(input, scheduler);
        }
        if (isPromise(input)) {
            return schedulePromise(input, scheduler);
        }
        if (isAsyncIterable(input)) {
            return scheduleAsyncIterable(input, scheduler);
        }
        if (isIterable(input)) {
            return scheduleIterable(input, scheduler);
        }
        if (isReadableStreamLike(input)) {
            return scheduleReadableStreamLike(input, scheduler);
        }
    }
    throw createInvalidObservableTypeError(input);
}

function from(input, scheduler) {
    return scheduler ? scheduled(input, scheduler) : innerFrom(input);
}

function of() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var scheduler = popScheduler(args);
    return from(args, scheduler);
}

function isValidDate(value) {
    return value instanceof Date && !isNaN(value);
}

function map(project, thisArg) {
    return operate(function (source, subscriber) {
        var index = 0;
        source.subscribe(createOperatorSubscriber(subscriber, function (value) {
            subscriber.next(project.call(thisArg, value, index++));
        }));
    });
}

var isArray$1 = Array.isArray;
function callOrApply(fn, args) {
    return isArray$1(args) ? fn.apply(void 0, __spreadArray([], __read(args))) : fn(args);
}
function mapOneOrManyArgs(fn) {
    return map(function (args) { return callOrApply(fn, args); });
}

function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
    var buffer = [];
    var active = 0;
    var index = 0;
    var isComplete = false;
    var checkComplete = function () {
        if (isComplete && !buffer.length && !active) {
            subscriber.complete();
        }
    };
    var outerNext = function (value) { return (active < concurrent ? doInnerSub(value) : buffer.push(value)); };
    var doInnerSub = function (value) {
        expand && subscriber.next(value);
        active++;
        var innerComplete = false;
        innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function (innerValue) {
            onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
            if (expand) {
                outerNext(innerValue);
            }
            else {
                subscriber.next(innerValue);
            }
        }, function () {
            innerComplete = true;
        }, undefined, function () {
            if (innerComplete) {
                try {
                    active--;
                    var _loop_1 = function () {
                        var bufferedValue = buffer.shift();
                        if (innerSubScheduler) {
                            executeSchedule(subscriber, innerSubScheduler, function () { return doInnerSub(bufferedValue); });
                        }
                        else {
                            doInnerSub(bufferedValue);
                        }
                    };
                    while (buffer.length && active < concurrent) {
                        _loop_1();
                    }
                    checkComplete();
                }
                catch (err) {
                    subscriber.error(err);
                }
            }
        }));
    };
    source.subscribe(createOperatorSubscriber(subscriber, outerNext, function () {
        isComplete = true;
        checkComplete();
    }));
    return function () {
        additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
    };
}

function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) { concurrent = Infinity; }
    if (isFunction(resultSelector)) {
        return mergeMap(function (a, i) { return map(function (b, ii) { return resultSelector(a, b, i, ii); })(innerFrom(project(a, i))); }, concurrent);
    }
    else if (typeof resultSelector === 'number') {
        concurrent = resultSelector;
    }
    return operate(function (source, subscriber) { return mergeInternals(source, subscriber, project, concurrent); });
}

function mergeAll(concurrent) {
    if (concurrent === void 0) { concurrent = Infinity; }
    return mergeMap(identity, concurrent);
}

function concatAll() {
    return mergeAll(1);
}

function concat() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return concatAll()(from(args, popScheduler(args)));
}

var nodeEventEmitterMethods = ['addListener', 'removeListener'];
var eventTargetMethods = ['addEventListener', 'removeEventListener'];
var jqueryMethods = ['on', 'off'];
function fromEvent(target, eventName, options, resultSelector) {
    if (isFunction(options)) {
        resultSelector = options;
        options = undefined;
    }
    if (resultSelector) {
        return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs(resultSelector));
    }
    var _a = __read(isEventTarget(target)
        ? eventTargetMethods.map(function (methodName) { return function (handler) { return target[methodName](eventName, handler, options); }; })
        :
            isNodeStyleEventEmitter(target)
                ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName))
                : isJQueryStyleEventEmitter(target)
                    ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName))
                    : [], 2), add = _a[0], remove = _a[1];
    if (!add) {
        if (isArrayLike(target)) {
            return mergeMap(function (subTarget) { return fromEvent(subTarget, eventName, options); })(innerFrom(target));
        }
    }
    if (!add) {
        throw new TypeError('Invalid event target');
    }
    return new Observable(function (subscriber) {
        var handler = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return subscriber.next(1 < args.length ? args : args[0]);
        };
        add(handler);
        return function () { return remove(handler); };
    });
}
function toCommonHandlerRegistry(target, eventName) {
    return function (methodName) { return function (handler) { return target[methodName](eventName, handler); }; };
}
function isNodeStyleEventEmitter(target) {
    return isFunction(target.addListener) && isFunction(target.removeListener);
}
function isJQueryStyleEventEmitter(target) {
    return isFunction(target.on) && isFunction(target.off);
}
function isEventTarget(target) {
    return isFunction(target.addEventListener) && isFunction(target.removeEventListener);
}

function timer(dueTime, intervalOrScheduler, scheduler) {
    if (dueTime === void 0) { dueTime = 0; }
    if (scheduler === void 0) { scheduler = async; }
    var intervalDuration = -1;
    if (intervalOrScheduler != null) {
        if (isScheduler(intervalOrScheduler)) {
            scheduler = intervalOrScheduler;
        }
        else {
            intervalDuration = intervalOrScheduler;
        }
    }
    return new Observable(function (subscriber) {
        var due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
        if (due < 0) {
            due = 0;
        }
        var n = 0;
        return scheduler.schedule(function () {
            if (!subscriber.closed) {
                subscriber.next(n++);
                if (0 <= intervalDuration) {
                    this.schedule(undefined, intervalDuration);
                }
                else {
                    subscriber.complete();
                }
            }
        }, due);
    });
}

function merge$1() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var scheduler = popScheduler(args);
    var concurrent = popNumber(args, Infinity);
    var sources = args;
    return !sources.length
        ?
            EMPTY
        : sources.length === 1
            ?
                innerFrom(sources[0])
            :
                mergeAll(concurrent)(from(sources, scheduler));
}

var isArray = Array.isArray;
function argsOrArgArray(args) {
    return args.length === 1 && isArray(args[0]) ? args[0] : args;
}

function filter(predicate, thisArg) {
    return operate(function (source, subscriber) {
        var index = 0;
        source.subscribe(createOperatorSubscriber(subscriber, function (value) { return predicate.call(thisArg, value, index++) && subscriber.next(value); }));
    });
}

function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
    return function (source, subscriber) {
        var hasState = hasSeed;
        var state = seed;
        var index = 0;
        source.subscribe(createOperatorSubscriber(subscriber, function (value) {
            var i = index++;
            state = hasState
                ?
                    accumulator(state, value, i)
                :
                    ((hasState = true), value);
            emitOnNext && subscriber.next(state);
        }, emitBeforeComplete &&
            (function () {
                hasState && subscriber.next(state);
                subscriber.complete();
            })));
    };
}

function debounceTime(dueTime, scheduler) {
    if (scheduler === void 0) { scheduler = asyncScheduler; }
    return operate(function (source, subscriber) {
        var activeTask = null;
        var lastValue = null;
        var lastTime = null;
        var emit = function () {
            if (activeTask) {
                activeTask.unsubscribe();
                activeTask = null;
                var value = lastValue;
                lastValue = null;
                subscriber.next(value);
            }
        };
        function emitWhenIdle() {
            var targetTime = lastTime + dueTime;
            var now = scheduler.now();
            if (now < targetTime) {
                activeTask = this.schedule(undefined, targetTime - now);
                subscriber.add(activeTask);
                return;
            }
            emit();
        }
        source.subscribe(createOperatorSubscriber(subscriber, function (value) {
            lastValue = value;
            lastTime = scheduler.now();
            if (!activeTask) {
                activeTask = scheduler.schedule(emitWhenIdle, dueTime);
                subscriber.add(activeTask);
            }
        }, function () {
            emit();
            subscriber.complete();
        }, undefined, function () {
            lastValue = activeTask = null;
        }));
    });
}

function take(count) {
    return count <= 0
        ?
            function () { return EMPTY; }
        : operate(function (source, subscriber) {
            var seen = 0;
            source.subscribe(createOperatorSubscriber(subscriber, function (value) {
                if (++seen <= count) {
                    subscriber.next(value);
                    if (count <= seen) {
                        subscriber.complete();
                    }
                }
            }));
        });
}

function ignoreElements() {
    return operate(function (source, subscriber) {
        source.subscribe(createOperatorSubscriber(subscriber, noop));
    });
}

function mapTo(value) {
    return map(function () { return value; });
}

function delayWhen(delayDurationSelector, subscriptionDelay) {
    if (subscriptionDelay) {
        return function (source) {
            return concat(subscriptionDelay.pipe(take(1), ignoreElements()), source.pipe(delayWhen(delayDurationSelector)));
        };
    }
    return mergeMap(function (value, index) { return innerFrom(delayDurationSelector(value, index)).pipe(take(1), mapTo(value)); });
}

function delay(due, scheduler) {
    if (scheduler === void 0) { scheduler = asyncScheduler; }
    var duration = timer(due, scheduler);
    return delayWhen(function () { return duration; });
}

function distinctUntilChanged(comparator, keySelector) {
    if (keySelector === void 0) { keySelector = identity; }
    comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
    return operate(function (source, subscriber) {
        var previousKey;
        var first = true;
        source.subscribe(createOperatorSubscriber(subscriber, function (value) {
            var currentKey = keySelector(value);
            if (first || !comparator(previousKey, currentKey)) {
                first = false;
                previousKey = currentKey;
                subscriber.next(value);
            }
        }));
    });
}
function defaultCompare(a, b) {
    return a === b;
}

function distinctUntilKeyChanged(key, compare) {
    return distinctUntilChanged(function (x, y) { return compare ? compare(x[key], y[key]) : x[key] === y[key]; });
}

function groupBy(keySelector, elementOrOptions, duration, connector) {
    return operate(function (source, subscriber) {
        var element;
        if (!elementOrOptions || typeof elementOrOptions === 'function') {
            element = elementOrOptions;
        }
        else {
            (duration = elementOrOptions.duration, element = elementOrOptions.element, connector = elementOrOptions.connector);
        }
        var groups = new Map();
        var notify = function (cb) {
            groups.forEach(cb);
            cb(subscriber);
        };
        var handleError = function (err) { return notify(function (consumer) { return consumer.error(err); }); };
        var activeGroups = 0;
        var teardownAttempted = false;
        var groupBySourceSubscriber = new OperatorSubscriber(subscriber, function (value) {
            try {
                var key_1 = keySelector(value);
                var group_1 = groups.get(key_1);
                if (!group_1) {
                    groups.set(key_1, (group_1 = connector ? connector() : new Subject()));
                    var grouped = createGroupedObservable(key_1, group_1);
                    subscriber.next(grouped);
                    if (duration) {
                        var durationSubscriber_1 = createOperatorSubscriber(group_1, function () {
                            group_1.complete();
                            durationSubscriber_1 === null || durationSubscriber_1 === void 0 ? void 0 : durationSubscriber_1.unsubscribe();
                        }, undefined, undefined, function () { return groups.delete(key_1); });
                        groupBySourceSubscriber.add(innerFrom(duration(grouped)).subscribe(durationSubscriber_1));
                    }
                }
                group_1.next(element ? element(value) : value);
            }
            catch (err) {
                handleError(err);
            }
        }, function () { return notify(function (consumer) { return consumer.complete(); }); }, handleError, function () { return groups.clear(); }, function () {
            teardownAttempted = true;
            return activeGroups === 0;
        });
        source.subscribe(groupBySourceSubscriber);
        function createGroupedObservable(key, groupSubject) {
            var result = new Observable(function (groupSubscriber) {
                activeGroups++;
                var innerSub = groupSubject.subscribe(groupSubscriber);
                return function () {
                    innerSub.unsubscribe();
                    --activeGroups === 0 && teardownAttempted && groupBySourceSubscriber.unsubscribe();
                };
            });
            result.key = key;
            return result;
        }
    });
}

function merge() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var scheduler = popScheduler(args);
    var concurrent = popNumber(args, Infinity);
    args = argsOrArgArray(args);
    return operate(function (source, subscriber) {
        mergeAll(concurrent)(from(__spreadArray([source], __read(args)), scheduler)).subscribe(subscriber);
    });
}

function mergeWith() {
    var otherSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        otherSources[_i] = arguments[_i];
    }
    return merge.apply(void 0, __spreadArray([], __read(otherSources)));
}

function retry(configOrCount) {
    if (configOrCount === void 0) { configOrCount = Infinity; }
    var config;
    if (configOrCount && typeof configOrCount === 'object') {
        config = configOrCount;
    }
    else {
        config = {
            count: configOrCount,
        };
    }
    var _a = config.count, count = _a === void 0 ? Infinity : _a, delay = config.delay, _b = config.resetOnSuccess, resetOnSuccess = _b === void 0 ? false : _b;
    return count <= 0
        ? identity
        : operate(function (source, subscriber) {
            var soFar = 0;
            var innerSub;
            var subscribeForRetry = function () {
                var syncUnsub = false;
                innerSub = source.subscribe(createOperatorSubscriber(subscriber, function (value) {
                    if (resetOnSuccess) {
                        soFar = 0;
                    }
                    subscriber.next(value);
                }, undefined, function (err) {
                    if (soFar++ < count) {
                        var resub_1 = function () {
                            if (innerSub) {
                                innerSub.unsubscribe();
                                innerSub = null;
                                subscribeForRetry();
                            }
                            else {
                                syncUnsub = true;
                            }
                        };
                        if (delay != null) {
                            var notifier = typeof delay === 'number' ? timer(delay) : innerFrom(delay(err, soFar));
                            var notifierSubscriber_1 = createOperatorSubscriber(subscriber, function () {
                                notifierSubscriber_1.unsubscribe();
                                resub_1();
                            }, function () {
                                subscriber.complete();
                            });
                            notifier.subscribe(notifierSubscriber_1);
                        }
                        else {
                            resub_1();
                        }
                    }
                    else {
                        subscriber.error(err);
                    }
                }));
                if (syncUnsub) {
                    innerSub.unsubscribe();
                    innerSub = null;
                    subscribeForRetry();
                }
            };
            subscribeForRetry();
        });
}

function scan(accumulator, seed) {
    return operate(scanInternals(accumulator, seed, arguments.length >= 2, true));
}

function share(options) {
    if (options === void 0) { options = {}; }
    var _a = options.connector, connector = _a === void 0 ? function () { return new Subject(); } : _a, _b = options.resetOnError, resetOnError = _b === void 0 ? true : _b, _c = options.resetOnComplete, resetOnComplete = _c === void 0 ? true : _c, _d = options.resetOnRefCountZero, resetOnRefCountZero = _d === void 0 ? true : _d;
    return function (wrapperSource) {
        var connection;
        var resetConnection;
        var subject;
        var refCount = 0;
        var hasCompleted = false;
        var hasErrored = false;
        var cancelReset = function () {
            resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
            resetConnection = undefined;
        };
        var reset = function () {
            cancelReset();
            connection = subject = undefined;
            hasCompleted = hasErrored = false;
        };
        var resetAndUnsubscribe = function () {
            var conn = connection;
            reset();
            conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
        };
        return operate(function (source, subscriber) {
            refCount++;
            if (!hasErrored && !hasCompleted) {
                cancelReset();
            }
            var dest = (subject = subject !== null && subject !== void 0 ? subject : connector());
            subscriber.add(function () {
                refCount--;
                if (refCount === 0 && !hasErrored && !hasCompleted) {
                    resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
                }
            });
            dest.subscribe(subscriber);
            if (!connection &&
                refCount > 0) {
                connection = new SafeSubscriber({
                    next: function (value) { return dest.next(value); },
                    error: function (err) {
                        hasErrored = true;
                        cancelReset();
                        resetConnection = handleReset(reset, resetOnError, err);
                        dest.error(err);
                    },
                    complete: function () {
                        hasCompleted = true;
                        cancelReset();
                        resetConnection = handleReset(reset, resetOnComplete);
                        dest.complete();
                    },
                });
                innerFrom(source).subscribe(connection);
            }
        })(wrapperSource);
    };
}
function handleReset(reset, on) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (on === true) {
        reset();
        return;
    }
    if (on === false) {
        return;
    }
    var onSubscriber = new SafeSubscriber({
        next: function () {
            onSubscriber.unsubscribe();
            reset();
        },
    });
    return innerFrom(on.apply(void 0, __spreadArray([], __read(args)))).subscribe(onSubscriber);
}

function skipWhile(predicate) {
    return operate(function (source, subscriber) {
        var taking = false;
        var index = 0;
        source.subscribe(createOperatorSubscriber(subscriber, function (value) { return (taking || (taking = !predicate(value, index++))) && subscriber.next(value); }));
    });
}

function switchMap(project, resultSelector) {
    return operate(function (source, subscriber) {
        var innerSubscriber = null;
        var index = 0;
        var isComplete = false;
        var checkComplete = function () { return isComplete && !innerSubscriber && subscriber.complete(); };
        source.subscribe(createOperatorSubscriber(subscriber, function (value) {
            innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
            var innerIndex = 0;
            var outerIndex = index++;
            innerFrom(project(value, outerIndex)).subscribe((innerSubscriber = createOperatorSubscriber(subscriber, function (innerValue) { return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue); }, function () {
                innerSubscriber = null;
                checkComplete();
            })));
        }, function () {
            isComplete = true;
            checkComplete();
        }));
    });
}

function takeUntil(notifier) {
    return operate(function (source, subscriber) {
        innerFrom(notifier).subscribe(createOperatorSubscriber(subscriber, function () { return subscriber.complete(); }, noop));
        !subscriber.closed && source.subscribe(subscriber);
    });
}

function tap(observerOrNext, error, complete) {
    var tapObserver = isFunction(observerOrNext) || error || complete
        ?
            { next: observerOrNext, error: error, complete: complete }
        : observerOrNext;
    return tapObserver
        ? operate(function (source, subscriber) {
            var _a;
            (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
            var isUnsub = true;
            source.subscribe(createOperatorSubscriber(subscriber, function (value) {
                var _a;
                (_a = tapObserver.next) === null || _a === void 0 ? void 0 : _a.call(tapObserver, value);
                subscriber.next(value);
            }, function () {
                var _a;
                isUnsub = false;
                (_a = tapObserver.complete) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                subscriber.complete();
            }, function (err) {
                var _a;
                isUnsub = false;
                (_a = tapObserver.error) === null || _a === void 0 ? void 0 : _a.call(tapObserver, err);
                subscriber.error(err);
            }, function () {
                var _a, _b;
                if (isUnsub) {
                    (_a = tapObserver.unsubscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                }
                (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
            }));
        })
        :
            identity;
}

function throttle(durationSelector, config) {
    return operate(function (source, subscriber) {
        var _a = config !== null && config !== void 0 ? config : {}, _b = _a.leading, leading = _b === void 0 ? true : _b, _c = _a.trailing, trailing = _c === void 0 ? false : _c;
        var hasValue = false;
        var sendValue = null;
        var throttled = null;
        var isComplete = false;
        var endThrottling = function () {
            throttled === null || throttled === void 0 ? void 0 : throttled.unsubscribe();
            throttled = null;
            if (trailing) {
                send();
                isComplete && subscriber.complete();
            }
        };
        var cleanupThrottling = function () {
            throttled = null;
            isComplete && subscriber.complete();
        };
        var startThrottle = function (value) {
            return (throttled = innerFrom(durationSelector(value)).subscribe(createOperatorSubscriber(subscriber, endThrottling, cleanupThrottling)));
        };
        var send = function () {
            if (hasValue) {
                hasValue = false;
                var value = sendValue;
                sendValue = null;
                subscriber.next(value);
                !isComplete && startThrottle(value);
            }
        };
        source.subscribe(createOperatorSubscriber(subscriber, function (value) {
            hasValue = true;
            sendValue = value;
            !(throttled && !throttled.closed) && (leading ? send() : startThrottle(value));
        }, function () {
            isComplete = true;
            !(trailing && hasValue && throttled && !throttled.closed) && subscriber.complete();
        }));
    });
}

function throttleTime(duration, scheduler, config) {
    if (scheduler === void 0) { scheduler = asyncScheduler; }
    var duration$ = timer(duration, scheduler);
    return throttle(function () { return duration$; }, config);
}

const defaultMethods = {
  className: "MethodChooser",
  props: {},
  children: [
    {
      className: "Method",
      props: {
        Name: "2 switch",
        Key: "idl6e14meiwzjdcquhgk9",
        KeyDebounce: 0.1,
        PointerEnterDebounce: 0,
        PointerDownDebounce: 0,
        Active: "false",
        Pattern: "DefaultPattern",
      },
      children: [
        {
          className: "KeyHandler",
          props: { Signal: "keyup" },
          children: [
            {
              className: "HandlerKeyCondition",
              props: { Key: " " },
              children: [],
            },
            {
              className: "HandlerKeyCondition",
              props: { Key: "ArrowRight" },
              children: [],
            },
            {
              className: "ResponderNext",
              props: { Response: "ResponderNext" },
              children: [],
            },
          ],
        },
        {
          className: "KeyHandler",
          props: { Signal: "keyup" },
          children: [
            {
              className: "HandlerKeyCondition",
              props: { Key: "Enter" },
              children: [],
            },
            {
              className: "HandlerKeyCondition",
              props: { Key: "ArrowLeft" },
              children: [],
            },
            {
              className: "ResponderActivate",
              props: { Response: "ResponderActivate" },
              children: [],
            },
          ],
        },
      ],
    },
    {
      className: "Method",
      props: {
        Name: "Pointer dwell",
        Key: "idl6wcdmjjkb48xmbxscn",
        KeyDebounce: 0,
        PointerEnterDebounce: 0.1,
        PointerDownDebounce: 0.1,
        Active: "false",
        Pattern: "idl83jg7qtj9wmyggtxf",
      },
      children: [
        {
          className: "PointerHandler",
          props: { Signal: "pointerover" },
          children: [
            {
              className: "ResponderCue",
              props: { Response: "ResponderCue", Cue: "idl7qm4cs28fh2ogf4ni" },
              children: [],
            },
            {
              className: "ResponderStartTimer",
              props: {
                Response: "ResponderStartTimer",
                TimerName: "idl7yrtido633vxa1bb1v",
              },
              children: [],
            },
          ],
        },
        {
          className: "PointerHandler",
          props: { Signal: "pointerout" },
          children: [
            {
              className: "ResponderClearCue",
              props: { Response: "ResponderClearCue" },
              children: [],
            },
          ],
        },
        {
          className: "PointerHandler",
          props: { Signal: "pointerdown" },
          children: [
            {
              className: "ResponderActivate",
              props: { Response: "ResponderActivate" },
              children: [],
            },
          ],
        },
        {
          className: "Timer",
          props: {
            Interval: "1.5",
            Name: "dwell",
            Key: "idl7yrtido633vxa1bb1v",
          },
          children: [],
        },
        {
          className: "TimerHandler",
          props: { Signal: "timer", TimerName: "idl7yrtido633vxa1bb1v" },
          children: [
            {
              className: "ResponderActivate",
              props: { Response: "ResponderActivate" },
              children: [],
            },
          ],
        },
      ],
    },
    {
      className: "Method",
      props: {
        Name: "Mouse",
        KeyDebounce: 0,
        PointerEnterDebounce: 0,
        PointerDownDebounce: 0,
        Key: "idl84ljjeoebyl94sow87",
        Active: "true",
        Pattern: "idl83jg7qtj9wmyggtxf",
      },
      children: [
        {
          className: "PointerHandler",
          props: { Signal: "pointerdown" },
          children: [
            {
              className: "ResponderActivate",
              props: { Response: "ResponderActivate" },
              children: [],
            },
          ],
        },
        {
          className: "PointerHandler",
          props: { Signal: "pointerover" },
          children: [
            {
              className: "ResponderCue",
              props: { Response: "ResponderCue", Cue: "idl7qm4cs28fh2ogf4ni" },
              children: [],
            },
          ],
        },
        {
          className: "PointerHandler",
          props: { Signal: "pointerout" },
          children: [
            {
              className: "ResponderClearCue",
              props: { Response: "ResponderClearCue" },
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

const method = '';

/**
 * Conditionally show an indicator with a title
 *
 * @param {boolean} toggle
 * @param {string} title
 * @returns {Hole}
 */
function toggleIndicator(toggle, title) {
  if (toggle) {
    return html`<span class="indicator" title=${title}>&#9679;</span>`;
  } else {
    return html`<!--empty-->`;
  }
}

// allow tearing down handlers when changing configurations
const stop$ = new Subject();

class MethodChooser extends DesignerPanel {
  name = new String$1("Methods");

  allowedChildren = ["Method"];
  /** @type {Method[]} */
  children = [];

  allowDelete = false;

  static tableName = "method";
  static defaultValue = defaultMethods;

  onUpdate() {
    super.onUpdate();
    this.configure();
  }

  configure() {
    // tear down the old configuration if any
    this.stop();
    for (const method of this.children) {
      method.configure(stop$);
    }
  }

  stop() {
    stop$.next(1);
  }

  settings() {
    return html`<div class=${this.CSSClasses("MethodChooser")} id=${this.id}>
      ${this.unorderedChildren()}
    </div> `;
  }

  refresh() {
    this.children
      .filter((child) => child.Active.value)
      .forEach((child) => child.refresh());
  }

  /**
   * Upgrade Methods
   * @param {any} obj
   * @returns {Object}
   */
  static upgrade(obj) {
    // Debounce moves up to the method from the individual handlers
    // Take the maximum of all times for each category
    if (obj.className != "MethodChooser") return obj;

    for (const method of obj.children) {
      if (method.className != "Method") {
        throw new Error("Invalid Method upgrade");
      }
      if (!("KeyDebounce" in method.props)) {
        let keyDebounce = 0;
        let enterDebounce = 0;
        let downDebounce = 0;
        for (const handler of method.children) {
          if (["PointerHandler", "KeyHandler"].includes(handler.className)) {
            const debounce = parseFloat(handler.props.Debounce || "0");
            const signal = handler.props.Signal;
            if (signal.startsWith("key")) {
              keyDebounce = Math.max(keyDebounce, debounce);
            } else if (["pointerover", "pointerout"].includes(signal)) {
              enterDebounce = Math.max(enterDebounce, debounce);
            } else if (["pointerdown", "pointerup"].includes(signal)) {
              downDebounce = Math.max(downDebounce, debounce);
            }
          }
        }
        method.props.KeyDebounce = keyDebounce.toString();
        method.props.PointerEnterDebounce = enterDebounce.toString();
        method.props.PointerDownDebounce = downDebounce.toString();
      }
      if (!("Pattern" in method.props)) {
        /* guess the best pattern to use
         * Prior to this upgrade PointerHandlers ignored the pattern. Now they don't.
         * To avoid breaking Methods that using PointerHandlers I'm defaulting them
         * to the NullPattern. This won't fix everything for sure but it shoudl help.
         */
        let pattern = "DefaultPattern";
        if (
          method.children.some(
            (/** @type {Object} */ handler) =>
              handler.className == "PointerHandler",
          )
        ) {
          pattern = "NullPattern";
        }
        method.props.Pattern = pattern;
      }
    }
    return obj;
  }
}
TreeBase.register(MethodChooser, "MethodChooser");

class Method extends TreeBase {
  Name = new String$1("New method");
  Pattern = new Pattern({ defaultValue: "DefaultPattern" });
  KeyDebounce = new Float(0, { label: "Key down/up" });
  PointerEnterDebounce = new Float(0, { label: "Pointer enter/leave" });
  PointerDownDebounce = new Float(0, { label: "Pointer down/up" });
  Key = new UID();
  Active = new OneOfGroup(false, { group: "ActiveMethod" });

  allowedChildren = [
    "Timer",
    "KeyHandler",
    "PointerHandler",
    "TimerHandler",
    "SocketHandler",
  ];

  open = false;

  // Event streams from the devices
  /** @type {Object<string, RxJs.Observable<EventLike>>} */
  streams = {};

  /** clear the pointerStream on any changes from below
   * @param {TreeBase} _start
   */
  onUpdate(_start) {
    super.onUpdate(_start);
  }

  /** @type {(Handler | Timer)[]} */
  children = [];

  /** Return a Map from Timer Key to the Timer
   * @returns {Map<string, Timer>}
   * */
  get timers() {
    return new Map(
      this.filterChildren(Timer).map((child) => [child.Key.value, child]),
    );
  }

  /** Return a Map from Timer Key to its Name */
  get timerNames() {
    return new Map(
      this.filterChildren(Timer).map((timer) => [
        timer.Key.value,
        timer.Name.value,
      ]),
    );
  }

  /** Return a Timer given its key
   *     @param {string} key
   *  */
  timer(key) {
    return this.filterChildren(Timer).find((timer) => timer.Key.value == key);
  }

  /** Cancel all active Timers
   */
  cancelTimers() {
    for (const timer of this.timers.values()) {
      timer.cancel();
    }
  }

  /** Return an array of the Handlers */
  get handlers() {
    return this.filterChildren(Handler);
  }

  settingsSummary() {
    const { Name, Active } = this;
    return html`<h3>
      ${Name.value} ${toggleIndicator(Active.value, "Active")}
    </h3>`;
  }

  settingsDetails() {
    const {
      Name,
      Pattern,
      Active,
      KeyDebounce,
      PointerEnterDebounce,
      PointerDownDebounce,
    } = this;
    const timers = [...this.timers.values()];
    // determine which debounce controls we should display
    const handlerClasses = new Set(
      this.handlers.map((handler) => handler.className),
    );
    const keyDebounce = handlerClasses.has("KeyHandler")
      ? [KeyDebounce.input()]
      : [];
    const pointerDebounce = handlerClasses.has("PointerHandler")
      ? [PointerDownDebounce.input(), PointerEnterDebounce.input()]
      : [];
    const Debounce =
      handlerClasses.has("KeyHandler") || handlerClasses.has("PointerHandler")
        ? [
            html`<fieldset>
              <legend>Debounce</legend>
              ${keyDebounce} ${pointerDebounce}
            </fieldset> `,
          ]
        : [];
    return [
      html`<div>
        ${Name.input()} ${Active.input()} ${Pattern.input()} ${Debounce}
        ${timers.length > 0
          ? [
              html`<fieldset>
                <legend>Timers</legend>
                ${this.unorderedChildren(timers)}
              </fieldset>`,
            ]
          : []}
        <fieldset>
          <legend>Handlers</legend>
          ${this.orderedChildren(this.handlers)}
        </fieldset>
      </div>`,
    ];
  }

  settingsChildren() {
    return html`<div />`;
  }

  /** Configure the rxjs pipelines to implement this method */
  /** @param {RxJs.Subject} stop$
   * */
  configure(stop$) {
    if (this.Active.value) {
      this.streams = {};
      for (const child of this.handlers) {
        child.configure(stop$);
      }
      const streams = Object.values(this.streams);
      if (streams.length > 0) {
        const stream$ = merge$1(...streams).pipe(takeUntil(stop$));
        stream$.subscribe((e) => {
          for (const handler of this.handlers) {
            if (handler.test(e)) {
              handler.respond(e);
              return;
            }
          }
        });
      }
    }
  }

  get pattern() {
    return Globals.patterns.patternFromKey(this.Pattern.value);
  }

  /** Refresh the pattern and other state on redraw */
  refresh() {
    this.pattern.refresh();
  }
}
TreeBase.register(Method, "Method");

class Timer extends TreeBase {
  Interval = new Float(0.5, { hiddenLabel: true });
  Name = new String$1("timer", { hiddenLabel: true });
  Key = new UID();

  /** @type {RxJs.Subject<EventLike>} */
  subject$ = new Subject();

  settings() {
    return html`<div>
      ${this.Name.input()} ${this.Interval.input()}
      <style>
        ${`:root { --${this.Key.value}: ${this.Interval.value}s}`}
      </style>
    </div>`;
  }

  /** @param {EventLike} event */
  start(event) {
    const fakeEvent = /** @type {EventLike} */ ({
      type: "timer",
      target: event.target,
      access: event.access,
    });
    this.subject$.next(fakeEvent);
  }

  cancel() {
    const event = { type: "cancel", target: null, timeStamp: 0 };
    this.subject$.next(event);
  }
}
TreeBase.register(Timer, "Timer");

/** Handler is a base class for all event handlers */
class Handler extends TreeBase {
  /** @type {(HandlerCondition | HandlerKeyCondition | HandlerResponse)[]} */
  children = [];

  /** Return the method containing this Handler */
  get method() {
    return /** @type {Method} */ (this.parent);
  }

  // overridden in the derived classes
  Signal = new Select();

  get conditions() {
    return this.filterChildren(HandlerCondition);
  }

  get keys() {
    return this.filterChildren(HandlerKeyCondition);
  }

  get responses() {
    return this.filterChildren(HandlerResponse);
  }

  /**
   * Test the conditions for this handler
   * @param {EventLike} event
   * @returns {boolean}
   */
  test(event) {
    return (
      this.Signal.value == event.type &&
      this.conditions.every((condition) =>
        condition.eval({ data: event.access }),
      )
    );
  }

  /**
   * @param {RxJs.Subject} _stop$
   * */
  configure(_stop$) {
    throw new TypeError("Must override configure");
  }

  /** @param {EventLike} event */
  respond(event) {
    const method = this.nearestParent(Method);
    if (!method) return;
    method.cancelTimers();
    for (const response of this.responses) {
      response.respond(event);
    }
  }
}

class HandlerCondition extends TreeBase {
  Condition = new Conditional("", { hiddenLabel: true });

  settings() {
    const { Condition } = this;
    return html`<div class="Condition">${Condition.input()}</div>`;
  }

  /** @param {EvalContext} context */
  eval(context) {
    return this.Condition.valueInContext(context);
  }

  /** move my parent instead of me.
   * @param {boolean} up
   */
  moveUpDown(up) {
    this.parent?.moveUpDown(up);
  }
}
TreeBase.register(HandlerCondition, "HandlerCondition");

class HandlerKeyCondition extends HandlerCondition {
  Key = new KeyName("", {
    placeholder: "Press Enter to edit",
    hiddenLabel: true,
  });

  settings() {
    const { Key } = this;
    return html`<div class="Key">${Key.input()}</div>`;
  }

  /** @param {EvalContext} context */
  eval(context) {
    return this.Key.value == context.data.key;
  }
}
TreeBase.register(HandlerKeyCondition, "HandlerKeyCondition");

const ResponderTypeMap = new Map([
  ["HandlerResponse", "none"],
  ["ResponderCue", "cue"],
  ["ResponderActivate", "activate"],
  ["ResponderClearCue", "clear cue"],
  ["ResponderEmit", "emit"],
  ["ResponderNext", "next"],
  ["ResponderStartTimer", "start timer"],
]);

class HandlerResponse extends TreeBaseSwitchable {
  Response = new TypeSelect(ResponderTypeMap, { hiddenLabel: true });

  /** @param {EventLike} event */
  respond(event) {
    console.log("no response for", event);
  }

  settings() {
    return html`<div class="Response">
      ${this.Response.input()} ${this.subTemplate()}
    </div>`;
  }

  subTemplate() {
    return html`<div />`;
  }

  /** move my parent instead of me.
   * @param {boolean} up
   */
  moveUpDown(up) {
    this.parent?.moveUpDown(up);
  }
}
TreeBase.register(HandlerResponse, "HandlerResponse");

const pattern = '';

const defaultPatterns = {
  className: "PatternList",
  props: {
    direction: "",
    background: "",
    scale: 1,
    name: "Patterns",
    label: "",
  },
  children: [
    {
      className: "PatternManager",
      props: {
        Cycles: "2",
        Cue: "DefaultCue",
        Name: "None",
        Key: "idl83jg7qtj9wmyggtxf",
        Active: false,
      },
      children: [],
    },
    {
      className: "PatternManager",
      props: {
        Cycles: "2",
        Cue: "DefaultCue",
        Name: "Row Column",
        Key: "idl83jjo4z0ibii6748fx",
        Active: true,
      },
      children: [
        {
          className: "PatternSelector",
          props: {},
          children: [
            {
              className: "GroupBy",
              props: {
                GroupBy: "#row",
                Name: "Row #row",
                Cue: "DefaultCue",
                Cycles: "2",
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      className: "PatternManager",
      props: {
        Cycles: 2,
        Cue: "DefaultCue",
        Name: "Column Row",
        Key: "idlh6dwljzc1nwvfrrp9v",
        Active: false,
      },
      children: [
        {
          className: "PatternSelector",
          props: {},
          children: [
            {
              className: "GroupBy",
              props: {
                GroupBy: "#column",
                Name: "Column #column",
                Cue: "DefaultCue",
                Cycles: 2,
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      className: "PatternManager",
      props: {
        Cycles: "2",
        Cue: "DefaultCue",
        Name: "Controls and Rows",
        Key: "idl83jjo4z0ibii6748fx",
        Active: false,
      },
      children: [
        {
          className: "PatternGroup",
          props: { Name: "Controls", Cycles: "2", Cue: "DefaultCue" },
          children: [
            {
              className: "PatternSelector",
              props: {},
              children: [
                {
                  className: "Filter",
                  props: { Filter: "#controls" },
                  children: [],
                },
                {
                  className: "OrderBy",
                  props: { OrderBy: "#controls" },
                  children: [],
                },
              ],
            },
          ],
        },
        {
          className: "PatternSelector",
          props: {},
          children: [
            {
              className: "Filter",
              props: { Filter: "! #controls" },
              children: [],
            },
            {
              className: "GroupBy",
              props: {
                GroupBy: "#ComponentName",
                Name: " Component",
                Cue: "DefaultCue",
                Cycles: "2",
              },
              children: [],
            },
            {
              className: "GroupBy",
              props: {
                GroupBy: "#row",
                Name: "Row #row",
                Cue: "DefaultCue",
                Cycles: "2",
              },
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

// only run one animation at a time
let animationNonce = 0;

/** @param {Target} target
 * @param {string} defaultValue */
function cueTarget(target, defaultValue) {
  if (target instanceof HTMLButtonElement) {
    target.setAttribute("cue", defaultValue);
    const video = target.querySelector("video");
    if (video && !video.hasAttribute("autoplay")) {
      if (video.hasAttribute("muted")) video.muted = true;
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => {})
          .catch((error) => {
            console.log("autoplay prevented", error);
          });
      }
    }
  } else if (target instanceof Group) {
    target.cue();
  }
}

function clearCues() {
  for (const element of document.querySelectorAll("#UI [cue]")) {
    element.removeAttribute("cue");
    const video = element.querySelector("video");
    if (video && !video.hasAttribute("autoplay")) {
      video.pause();
      video.currentTime = 0;
    }
  }
}

/**
 * Group is a collection of Buttons or Groups and associated properties such as
 * the label and cue.
 */
class Group {
  /**
   * @param {Target[]} members
   * @param {Object} props
   */
  constructor(members, props) {
    /** @type {Target[]} */
    this.members = members;
    this.access = props;
  }

  get length() {
    return this.members.length * +this.access.Cycles;
  }

  /** @param {Number} index */
  member(index) {
    if (index < 0 || index >= this.length) {
      return undefined;
    } else {
      return this.members[index % this.members.length];
    }
  }

  /** @param {string} value */
  cue(value = "") {
    if (!value) {
      value = this.access.Cue;
    }
    for (const member of this.members) {
      if (member instanceof HTMLButtonElement) cueTarget(member, value);
      else if (member instanceof Group) member.cue(value);
    }
  }

  /** Test if this group contains a button return the top-level index if so, -1 if not
   * @param {HTMLButtonElement} button
   * @returns {number}
   */
  contains(button) {
    for (let i = 0; i < this.members.length; i++) {
      const member = this.members[i];
      if (
        member === button ||
        (member instanceof Group && member.contains(button) >= 0)
      )
        return i;
    }
    return -1;
  }
}

class PatternBase extends TreeBase {
  /** @type {PatternBase[]} */
  children = [];

  /**
   * @param {Target[]} input
   * @returns {Target[]}
   */
  apply(input) {
    return input;
  }
}

class PatternList extends DesignerPanel {
  name = new String$1("Patterns");
  allowDelete = false;

  allowedChildren = ["PatternManager"];
  /** @type {PatternManager[]} */
  children = [];

  static tableName = "pattern";
  static defaultValue = defaultPatterns;

  settings() {
    return html`<div class=${this.CSSClasses("PatternList")} id=${this.id}>
      ${this.unorderedChildren()}
    </div>`;
  }

  /**
   * @returns {PatternManager}
   */
  get activePattern() {
    return (
      this.children.find((child) => child.Active.value) || this.children[0]
    );
  }

  get patternMap() {
    /** @type {[string,string][]} */
    const entries = this.children.map((child) => [
      child.Key.value,
      child.Name.value,
    ]);
    entries.unshift(["DefaultPattern", "Default Pattern"]);
    entries.unshift(["NullPattern", "No Pattern"]);
    return new Map(entries);
  }

  /**
   * return the pattern given its key
   * @param {string} key
   */
  patternFromKey(key) {
    let result;
    if (key === "NullPattern") {
      return nullPatternManager;
    }
    result = this.children.find((pattern) => pattern.Key.value == key);
    if (!result) {
      result = this.activePattern;
    }
    return result;
  }
}
TreeBase.register(PatternList, "PatternList");

class PatternManager extends PatternBase {
  allowedChildren = ["PatternSelector", "PatternGroup"];

  /** @type {Group} */
  targets = new Group([], {});
  /**
   * Stack keeps track of the nesting as we walk the tree
   *
   * @type {{ group: Group; index: number }[]}
   */
  stack = [];

  /**
   * @type {Boolean} - cue is active when true
   */
  cued = false;

  // props
  Cue = new Cue$1({ defaultValue: "DefaultCue" });
  Name = new String$1("a pattern");
  Key = new UID();
  Active = new OneOfGroup(false, {
    group: "pattern-active",
    label: "Default",
  });

  settingsSummary() {
    const { Name, Active } = this;
    return html`<h3>
      ${Name.value} ${toggleIndicator(Active.value, "Active")}
    </h3>`;
  }

  settingsDetails() {
    const { Cue, Name, Active } = this;
    return [
      html`
        <div>
          ${Name.input()} ${Active.input()} ${Cue.input()}
          <button
            @click=${() => {
              this.animate();
            }}
          >
            Animate
          </button>
          ${this.orderedChildren()}
        </div>
      `,
    ];
  }

  settingsChildren() {
    return html`<div />`;
  }

  /**
   * @param {Target[]} input
   * @returns {Target[]}
   */
  apply(input) {
    let members = [];
    for (const child of this.children) {
      const r = child.apply(input);
      if (r.length > 0) {
        if (r instanceof Group) {
          members.push(r);
        } else {
          members = members.concat(r);
        }
      }
    }
    if (members.length > 0) return [new Group(members, this.propsAsObject)];
    else return [];
  }

  /** Collect the nodes from the DOM and process them into targets */
  refresh() {
    // gather the buttons from the UI
    const buttons = [];
    for (const node of /** @type {NodeListOf<HTMLButtonElement>} */ (
      document.querySelectorAll("#UI button:not(:disabled)")
    )) {
      buttons.push(node);
    }

    let members = [];
    if (this.children.length) {
      for (const child of this.children) {
        const r = child.apply(buttons);
        if (r.length > 0) {
          if (r instanceof Group) {
            members.push(r);
          } else {
            members = members.concat(r);
          }
        }
      }
    } else {
      members = buttons;
    }
    this.targets = new Group(members, { ...this.propsAsObject, Cycles: 1 });
    this.stack = [{ group: this.targets, index: 0 }];
    this.cue();

    // stop any running animations
    animationNonce += 1;
  }

  /**
   * Current keeps track of the currently active node or group
   *
   * @type {Target | undefined}
   */
  get current() {
    const { group, index } = this.stack[0];
    return group.member(index);
  }

  next() {
    const top = this.stack[0];
    if (top.index < top.group.length - 1) {
      top.index++;
    } else if (this.stack.length > 1) {
      this.stack.shift();
    } else if (this.stack.length == 1) {
      top.index = 0;
    } else ;
    this.cue();
  }

  /** @param {EventLike} event */
  activate(event) {
    const target = event.target;
    if (target) {
      // adjust the stack to accomodate the target
      for (;;) {
        const top = this.stack[0];
        const newIndex = top.group.members.indexOf(target);
        if (newIndex >= 0) {
          top.index = newIndex;
          break;
        }
        if (this.stack.length == 1) {
          top.index = 0;
          break;
        } else {
          this.stack.shift();
        }
      }
    }
    let current = this.current;
    if (!current) return;
    if (current instanceof Group) {
      while (current.length == 1 && current.members[0] instanceof Group) {
        current = current.members[0];
      }
      // I need to work out the index here. Should be the group under the pointer
      this.stack.unshift({ group: current, index: event?.groupIndex || 0 });
    } else if (current instanceof HTMLButtonElement) {
      if (current.hasAttribute("click")) {
        current.dispatchEvent(new Event("Activate"));
      } else {
        const name = current.dataset.ComponentName;
        Globals.actions.applyRules(name || "", "press", current.dataset);
      }
    }
    this.cue();
  }

  clearCue() {
    this.cued = false;
    clearCues();
  }

  cue() {
    this.clearCue();
    const current = this.current;
    if (!current) return;
    this.cued = true;
    cueTarget(current, this.Cue.value);
  }

  /** Return the access info for current
   */
  getCurrentAccess() {
    const current = this.current;
    if (!current) return {};
    if (current instanceof HTMLButtonElement) {
      return current.dataset;
    } else if (current instanceof Group) {
      return { ...current.access };
    }
    return {};
  }

  /** Map the event target to a group
   * @param {EventLike} event
   * @returns {EventLike}
   */
  remapEventTarget(event) {
    event = {
      type: event.type,
      target: event.target,
      timeStamp: event.timeStamp,
    };
    if (event.target instanceof HTMLButtonElement) {
      event.access = event.target.dataset;
    }
    if (!event.target) return event;
    event.originalTarget = event.target;
    for (let level = 0; level < this.stack.length; level++) {
      const group = this.stack[level].group;
      const members = group.members;
      // first scan to see if the element is top level in this group
      let index = members.indexOf(event.target);
      if (index >= 0) {
        if (level === 0) {
          return event;
        } else {
          return {
            ...event,
            target: group,
            groupIndex: index,
            access: { ...event.access, ...group.access },
          };
        }
      } else if (event.target instanceof HTMLButtonElement) {
        // otherwise check to see if any group members contain it
        for (index = 0; index < members.length; index++) {
          const member = members[index];
          if (member instanceof Group) {
            let i = member.contains(event.target);
            if (i >= 0) {
              return {
                ...event,
                target: member,
                groupIndex: i,
                access: { ...event.access, ...member.access },
              };
            }
          }
        }
      }
    }
    return event;
  }

  async animate() {
    /** @param {Group} group
     * @param {string} cue
     */
    function* animateGroup(group, cue) {
      const cycles = +group.access.Cycles;
      const groupTime = 500;
      const buttonTime = Math.max(
        100,
        Math.min(500, 600 / group.members.length),
      );
      for (let cycle = 0; cycle < cycles; cycle++) {
        for (const member of group.members) {
          cueTarget(member, cue);
          yield new Promise((resolve) =>
            setTimeout(
              resolve,
              member instanceof Group ? groupTime : buttonTime,
            ),
          );
          clearCues();
          if (member instanceof Group) {
            yield* animateGroup(member, cue);
          }
        }
      }
    }
    this.clearCue();
    this.refresh();

    // kill any running animations and save the new value
    let nonce = ++animationNonce;

    for (const promise of animateGroup(this.targets, this.Cue.value)) {
      await promise;
      // quit if the animationNonce changes
      if (nonce !== animationNonce) return;
    }
  }
}
PatternBase.register(PatternManager, "PatternManager");

const nullPatternManager = TreeBase.create(PatternManager);

class PatternGroup extends PatternBase {
  // props
  Name = new String$1("");
  Cycles = new Integer(2, { min: 1 });
  Cue = new Cue$1({ defaultValue: "DefaultCue" });

  allowedChildren = ["PatternGroup", "PatternSelector"];

  settings() {
    const { Name, Cycles, Cue } = this;
    return html`<fieldset class=${this.className} tabindex="0" id=${this.id}>
      <legend>Group: ${Name.value}</legend>
      ${Name.input()} ${Cycles.input()} ${Cue.input()} ${this.orderedChildren()}
    </fieldset>`;
  }

  /**
   * Build a group from the output of the selectors applied to the input
   *
   * @param {Target[]} input
   */
  apply(input) {
    let members = [];
    for (const child of this.children) {
      const r = child.apply(input);
      if (r.length > 0) {
        if (r instanceof Group) {
          members.push(r);
        } else {
          members = members.concat(r);
        }
      }
    }
    if (members.length > 0) return [new Group(members, this.propsAsObject)];
    else return [];
  }
}
PatternBase.register(PatternGroup, "PatternGroup");

class PatternSelector extends PatternBase {
  allowedChildren = ["Filter", "GroupBy", "OrderBy"];
  settings() {
    return html`<fieldset class=${this.className} tabindex="0" id=${this.id}>
      <legend>Selector</legend>
      ${this.unorderedChildren()}
    </fieldset>`;
  }

  /**
   * Select buttons from the input
   *
   * @param {Target[]} input
   * @returns {Target[]}
   */
  apply(input) {
    return this.children.reduce(
      (previous, operator) => operator.apply(previous),
      input,
    );
  }
}
PatternBase.register(PatternSelector, "PatternSelector");

class Filter extends PatternBase {
  Filter = new Expression();
  settings() {
    const { Filter } = this;
    return html`<div class=${this.className} tabindex="0" id=${this.id}>
      ${Filter.input()}
    </div>`;
  }
  /**
   * Select buttons from the input
   *
   * @param {Target[]} input
   * @returns {Target[]}
   */
  apply(input) {
    if (input[0] instanceof Group) {
      return input
        .map(
          (/** @type {Group} */ group) =>
            new Group(this.apply(group.members), group.access),
        )
        .filter((target) => target.length > 0);
    } else {
      return input.filter((/** @type {HTMLButtonElement} */ button) =>
        this.Filter.valueInContext({ data: button.dataset }),
      );
    }
  }
}
PatternBase.register(Filter, "Filter");

// allow the sort to handle numbers reasonably
const comparator = new Intl.Collator(undefined, {
  numeric: true,
});

class OrderBy extends PatternBase {
  OrderBy = new Field();
  settings() {
    const { OrderBy } = this;
    return html`<div class=${this.className} tabindex="0" id=${this.id}>
      ${OrderBy.input()}
    </div>`;
  }
  /**
   * Select buttons from the input
   *
   * @param {Target[]} input
   * @returns {Target[]}
   */
  apply(input) {
    if (input[0] instanceof Group) {
      return input
        .map(
          (/** @type {Group} */ group) =>
            new Group(this.apply(group.members), group.access),
        )
        .filter((target) => target.length > 0);
    } else {
      const key = this.OrderBy.value.slice(1);
      return [.../** @type {HTMLButtonElement[]} */ (input)].sort((a, b) =>
        comparator.compare(a.dataset[key] || "", b.dataset[key] || ""),
      );
    }
  }
}
PatternBase.register(OrderBy, "OrderBy");

class GroupBy extends PatternBase {
  GroupBy = new Field();
  Name = new String$1("");
  Cue = new Cue$1({ defaultValue: "DefaultCue" });
  Cycles = new Integer(2);
  settings() {
    const { GroupBy, Name, Cue, Cycles } = this;
    const fields = toMap([
      ...new Set([
        ...Globals.data.allFields,
        "#ComponentName",
        "#row",
        "#column",
      ]),
    ]);
    return html`<div class=${this.className} tabindex="0" id=${this.id}>
      ${GroupBy.input(fields)} ${Name.input()} ${Cue.input()} ${Cycles.input()}
    </div>`;
  }
  /**
   * Select buttons from the input
   *
   * @param {Target[]} input
   * @returns {Target[]}
   */
  apply(input) {
    if (input[0] instanceof Group) {
      return input
        .map(
          (/** @type {Group} */ group) =>
            new Group(this.apply(group.members), group.access),
        )
        .filter((target) => target.length > 0);
    } else {
      const { GroupBy, Name, ...props } = this.propsAsObject;
      const key = GroupBy.slice(1);
      const result = [];
      const groupMap = new Map();
      for (const button of /** @type {HTMLButtonElement[]} */ (input)) {
        let k = button.dataset[key] || "";
        // if (!k) continue;
        k = k.toString();
        // we got a key, check to see if we have a group
        let group = groupMap.get(k);
        if (!group) {
          // no group, create one and add it to the map and the result
          group = new Group([button], {
            GroupName: Name.replace(GroupBy, k),
            [key]: k,
            ...props,
          });
          groupMap.set(k, group);
          result.push(group);
        } else {
          group.members.push(button);
        }
      }
      if (result.length === 1) {
        return result[0].members;
      }
      return result;
    }
  }
}
PatternBase.register(GroupBy, "GroupBy");

class ResponderNext extends HandlerResponse {
  respond() {
    const method = this.nearestParent(Method);
    if (!method) return;
    method.pattern.next();
  }
}
TreeBase.register(ResponderNext, "ResponderNext");

class ResponderActivate extends HandlerResponse {
  /** @param {EventLike} event */
  respond(event) {
    const method = this.nearestParent(Method);
    if (!method) return;
    method.pattern.activate(event);
  }
}
TreeBase.register(ResponderActivate, "ResponderActivate");

class ResponderCue extends HandlerResponse {
  Cue = new Cue$1();

  subTemplate() {
    return this.Cue.input();
  }

  /** @param {EventLike} event */
  respond(event) {
    cueTarget(event.target, this.Cue.value);
  }
}
TreeBase.register(ResponderCue, "ResponderCue");

class ResponderClearCue extends HandlerResponse {
  respond() {
    clearCues();
  }
}
TreeBase.register(ResponderClearCue, "ResponderClearCue");

class ResponderEmit extends HandlerResponse {
  /** @param {EventLike} event */
  respond(event) {
    const method = this.nearestParent(Method);
    if (!method) return;
    Globals.actions.applyRules(method.Name.value, "press", event.access);
  }
}
TreeBase.register(ResponderEmit, "ResponderEmit");

class ResponderStartTimer extends HandlerResponse {
  TimerName = new Select(() => this.nearestParent(Method).timerNames, {
    placeholder: "Choose a timer",
    hiddenLabel: true,
  });

  subTemplate() {
    return this.TimerName.input();
  }

  /** @param {EventLike} event */
  respond(event) {
    const timer = this.nearestParent(Method)?.timer(this.TimerName.value);
    if (!timer) return;
    // hand the interval to Cue CSS for animations
    document.documentElement.style.setProperty(
      "--timerInterval",
      `${timer.Interval.value}s`,
    );
    timer.start(event);
  }
}
TreeBase.register(ResponderStartTimer, "ResponderStartTimer");

const keySignals = new Map([
  ["keyup", "Key up"],
  ["keydown", "Key down"],
]);

class KeyHandler extends Handler {
  allowedChildren = [
    "HandlerKeyCondition",
    "HandlerCondition",
    "HandlerResponse",
  ];

  Signal = new Select(keySignals);

  settings() {
    const { conditions, responses, keys } = this;
    const { Signal } = this;
    return html`
      <fieldset class="Handler" tabindex="0" id=${this.id}>
        <legend>Key Handler</legend>
        ${Signal.input()}
        <fieldset class="Keys">
          <legend>Keys</legend>
          ${this.unorderedChildren(keys)}
        </fieldset>
        <fieldset class="Conditions">
          <legend>Conditions</legend>
          ${this.unorderedChildren(
            conditions.filter((c) => !(c instanceof HandlerKeyCondition)),
          )}
        </fieldset>
        <fieldset class="Responses">
          <legend>Responses</legend>
          ${this.unorderedChildren(responses)}
        </fieldset>
      </fieldset>
    `;
  }

  /** @param {RxJs.Subject} _stop$ */
  configure(_stop$) {
    const method = this.method;
    const streamName = "key";

    // only create it once
    if (method.streams[streamName]) return;

    // construct debounced key event stream
    const debounceInterval = method.KeyDebounce.value * 1000;
    const keyDown$ = /** @type RxJs.Observable<KeyboardEvent> */ (
      fromEvent(document, "keydown")
    );

    const keyUp$ = /** @type RxJs.Observable<KeyboardEvent> */ (
      fromEvent(document, "keyup")
    );

    // don't capture key events originating in the designer
    function notDesigner({ target }) {
      const designer = document.getElementById("designer");
      return !designer || !designer.contains(target);
    }

    // build the debounced key event stream
    const keyEvents$ = /** @type RxJs.Observable<KeyboardEvent> */ (
      // start with the key down stream
      keyDown$.pipe(
        // merge with the key up stream
        mergeWith(keyUp$),
        // ignore events from the designer
        filter((e) => notDesigner(e)),
        // prevent default actions
        tap((e) => e.preventDefault()),
        // remove any repeats
        filter((e) => !e.repeat),
        // group by the key
        groupBy((e) => e.key),
        // process each group and merge the results
        mergeMap((group$) =>
          group$.pipe(
            // debounce flurries of events
            debounceTime(debounceInterval),
            // wait for a key down
            skipWhile((e) => e.type != "keydown"),
            // only output when the type changes
            distinctUntilKeyChanged("type"),
          ),
        ),
        map((e) => {
          // add context info to event for use in the conditions and response
          /** @type {EventLike} */
          let kw = {
            type: e.type,
            target: null,
            timeStamp: e.timeStamp,
            access: {
              key: e.key,
              altKey: e.altKey,
              ctrlKey: e.ctrlKey,
              metaKey: e.metaKey,
              shiftKey: e.shiftKey,
              eventType: e.type,
              ...method.pattern.getCurrentAccess(),
            },
          };
          return kw;
        }),
      )
    );
    method.streams[streamName] = keyEvents$;
  }

  /**
   * Test the conditions for this handler
   * @param {EventLike} event
   * @returns {boolean}
   */
  test(event) {
    const signal = this.Signal.value;

    // key conditions are OR'ed together
    // Other conditions are AND'ed
    const keys = this.keys;
    const conditions = this.conditions.filter(
      (condition) => !(condition instanceof HandlerKeyCondition),
    );
    return (
      event.type == signal &&
      (keys.length == 0 ||
        keys.some((key) => key.eval({ data: event.access }))) &&
      conditions.every((condition) => condition.eval({ data: event.access }))
    );
  }
}
TreeBase.register(KeyHandler, "KeyHandler");

/**
 * Handle pointer events integrated with Pattern.Groups
 *
 * TODO: we should be "over" the current button after activate. We are
 * currently not until you leave the current button and return.
 */


const pointerSignals = new Map([
  ["pointerdown", "Pointer down"],
  ["pointerup", "Pointer up"],
  ["pointerover", "Pointer enter"],
  ["pointerout", "Pointer leave"],
]);

class PointerHandler extends Handler {
  allowedChildren = ["HandlerCondition", "HandlerResponse"];

  Signal = new Select(pointerSignals);

  settings() {
    const { conditions, responses, Signal } = this;
    return html`
      <fieldset class="Handler" tabindex="0" id="${this.id}">
        <legend>Pointer Handler</legend>
        ${Signal.input()}
        <fieldset class="Conditions">
          <legend>Conditions</legend>
          ${this.unorderedChildren(conditions)}
        </fieldset>
        <fieldset class="Responses">
          <legend>Responses</legend>
          ${this.unorderedChildren(responses)}
        </fieldset>
      </fieldset>
    `;
  }

  /** @param {RxJs.Subject} _ */
  configure(_) {
    const method = this.method;
    const streamName = "pointer";
    // only create it once
    if (method.streams[streamName]) return;

    const pattern = method.pattern;

    const inOutThreshold = method.PointerEnterDebounce.value * 1000;
    const upDownThreshold = method.PointerDownDebounce.value * 1000;

    /**
     * Get the types correct
     *
     * @param {string} event
     * @returns {RxJs.Observable<PointerEvent>}
     */
    function fromPointerEvent(event) {
      return /** @type {RxJs.Observable<PointerEvent>} */ (
        fromEvent(document, event)
      );
    }

    const pointerDown$ = fromPointerEvent("pointerdown").pipe(
      // disable pointer capture
      tap(
        (x) =>
          x.target instanceof Element &&
          x.target.hasPointerCapture(x.pointerId) &&
          x.target.releasePointerCapture(x.pointerId),
      ),
      throttleTime(upDownThreshold),
    );

    const pointerUp$ = fromPointerEvent("pointerup").pipe(
      throttleTime(upDownThreshold),
    );

    /** @type {EventLike} */
    const None = { type: "none", target: null, timeStamp: 0 };

    /** This function defines the State Machine that will be applied to the stream
     * of events by the RxJs.scan operator. It takes this function and an initial state
     * and produces a stream of states. On each cycle after the first the input state
     * will be the output state from the previous cycle.
     *
     * Define the state for the machine
     *
     * @typedef {Object} machineState
     * @property {EventLike} current - the currently active target
     * @property {EventLike} over - the element we're currently over
     * @property {number} timeStamp - the time of the last event
     * @property {Map<Target | null, number>} accumulators - total time spent over each element
     * @property {EventLike[]} emittedEvents - events to pass along
     *
     * @param {machineState} state
     * @param {EventLike} event - the incoming pointer event
     * @returns {machineState}
     */
    function stateMachine(
      { current, over, timeStamp, accumulators, emittedEvents },
      event,
    ) {
      // whenever we emit an event the pattern might get changed in the response
      // check here to see if the target is still the same
      if (emittedEvents.length > 0 && over !== None) {
        const newOver = pattern.remapEventTarget({
          ...over,
          target: over.originalTarget,
        });
        if (newOver.target !== over.target) {
          // copy the accumulator to the new target
          accumulators.set(newOver.target, accumulators.get(over.target) || 0);
          // zero the old target
          accumulators.set(over.target, 0);
          // use this new target
          over = newOver;
        }
      }

      // time since last event
      const dt = event.timeStamp - timeStamp;
      timeStamp = event.timeStamp;
      // clear the emitted Events
      emittedEvents = [];
      // increment the time of the target we are over
      let sum = accumulators.get(over.target) || 0;
      sum += dt;
      accumulators.set(over.target, sum);
      const threshold = inOutThreshold;
      // exceeding the threshold triggers production of events
      if (sum > threshold) {
        // clamp it at the threshold value
        accumulators.set(over.target, threshold);
        if (over.target != current.target) {
          if (current !== None) {
            emittedEvents.push({ ...current, type: "pointerout" });
          }
          current = over;
          if (current !== None) {
            emittedEvents.push({ ...current, type: "pointerover" });
          }
        } else {
          current = over;
        }
      }
      // decrement the other accumulators
      for (let [target, value] of accumulators) {
        if (target !== over.target) {
          value -= dt;
          if (value <= 0) {
            // this should prevent keeping old ones alive
            accumulators.delete(target);
          } else {
            accumulators.set(target, value);
          }
        }
      }
      if (event.type == "pointerover") {
        over = pattern.remapEventTarget(event);
      } else if (event.type == "pointerout") {
        over = None;
      } else if (event.type == "pointerdown" && current !== None) {
        emittedEvents.push({ ...current, type: "pointerdown" });
      } else if (event.type == "pointerup" && current !== None) {
        emittedEvents.push({ ...current, type: "pointerup" });
      }
      return {
        current,
        over,
        timeStamp,
        accumulators,
        emittedEvents,
      };
    }

    const pointerStream$ = pointerDown$.pipe(
      // merge the streams
      mergeWith(
        pointerUp$,
        fromPointerEvent("pointerover"),
        fromPointerEvent("pointerout"),
        fromPointerEvent("contextmenu"),
      ),
      // keep only events related to buttons within the UI
      filter(
        (e) =>
          e.target instanceof HTMLButtonElement &&
          e.target.closest("div#UI") !== null &&
          !e.target.disabled,
      ),
      // kill contextmenu events
      tap((e) => e.type === "contextmenu" && e.preventDefault()),

      // Add the timer events
      mergeWith(
        // I pulled 10ms out of my ear, would 20 or even 50 do?
        timer(10, 10).pipe(map(() => new PointerEvent("tick"))),
      ),
      // run the state machine
      scan(stateMachine, {
        // the initial state
        current: None,
        over: None,
        timeStamp: 0,
        accumulators: new Map(),
        emittedEvents: [],
      }),
      filter((s) => s.emittedEvents.length > 0),
      mergeMap((state) =>
        of(
          ...state.emittedEvents.map((event) => {
            /** @type {EventLike} */
            let w = {
              ...event,
              timeStamp: state.timeStamp,
              access: event.access,
            };
            w.access.eventType = event.type;
            return w;
          }),
        ),
      ),
      // multicast the stream
      share(),
    );

    method.streams[streamName] = pointerStream$;
  }
}
TreeBase.register(PointerHandler, "PointerHandler");

var DEFAULT_WEBSOCKET_CONFIG = {
    url: '',
    deserializer: function (e) { return JSON.parse(e.data); },
    serializer: function (value) { return JSON.stringify(value); },
};
var WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT = 'WebSocketSubject.error must be called with an object with an error code, and an optional reason: { code: number, reason: string }';
var WebSocketSubject = (function (_super) {
    __extends(WebSocketSubject, _super);
    function WebSocketSubject(urlConfigOrSource, destination) {
        var _this = _super.call(this) || this;
        _this._socket = null;
        if (urlConfigOrSource instanceof Observable) {
            _this.destination = destination;
            _this.source = urlConfigOrSource;
        }
        else {
            var config = (_this._config = __assign({}, DEFAULT_WEBSOCKET_CONFIG));
            _this._output = new Subject();
            if (typeof urlConfigOrSource === 'string') {
                config.url = urlConfigOrSource;
            }
            else {
                for (var key in urlConfigOrSource) {
                    if (urlConfigOrSource.hasOwnProperty(key)) {
                        config[key] = urlConfigOrSource[key];
                    }
                }
            }
            if (!config.WebSocketCtor && WebSocket) {
                config.WebSocketCtor = WebSocket;
            }
            else if (!config.WebSocketCtor) {
                throw new Error('no WebSocket constructor can be found');
            }
            _this.destination = new ReplaySubject();
        }
        return _this;
    }
    WebSocketSubject.prototype.lift = function (operator) {
        var sock = new WebSocketSubject(this._config, this.destination);
        sock.operator = operator;
        sock.source = this;
        return sock;
    };
    WebSocketSubject.prototype._resetState = function () {
        this._socket = null;
        if (!this.source) {
            this.destination = new ReplaySubject();
        }
        this._output = new Subject();
    };
    WebSocketSubject.prototype.multiplex = function (subMsg, unsubMsg, messageFilter) {
        var self = this;
        return new Observable(function (observer) {
            try {
                self.next(subMsg());
            }
            catch (err) {
                observer.error(err);
            }
            var subscription = self.subscribe({
                next: function (x) {
                    try {
                        if (messageFilter(x)) {
                            observer.next(x);
                        }
                    }
                    catch (err) {
                        observer.error(err);
                    }
                },
                error: function (err) { return observer.error(err); },
                complete: function () { return observer.complete(); },
            });
            return function () {
                try {
                    self.next(unsubMsg());
                }
                catch (err) {
                    observer.error(err);
                }
                subscription.unsubscribe();
            };
        });
    };
    WebSocketSubject.prototype._connectSocket = function () {
        var _this = this;
        var _a = this._config, WebSocketCtor = _a.WebSocketCtor, protocol = _a.protocol, url = _a.url, binaryType = _a.binaryType;
        var observer = this._output;
        var socket = null;
        try {
            socket = protocol ? new WebSocketCtor(url, protocol) : new WebSocketCtor(url);
            this._socket = socket;
            if (binaryType) {
                this._socket.binaryType = binaryType;
            }
        }
        catch (e) {
            observer.error(e);
            return;
        }
        var subscription = new Subscription(function () {
            _this._socket = null;
            if (socket && socket.readyState === 1) {
                socket.close();
            }
        });
        socket.onopen = function (evt) {
            var _socket = _this._socket;
            if (!_socket) {
                socket.close();
                _this._resetState();
                return;
            }
            var openObserver = _this._config.openObserver;
            if (openObserver) {
                openObserver.next(evt);
            }
            var queue = _this.destination;
            _this.destination = Subscriber.create(function (x) {
                if (socket.readyState === 1) {
                    try {
                        var serializer = _this._config.serializer;
                        socket.send(serializer(x));
                    }
                    catch (e) {
                        _this.destination.error(e);
                    }
                }
            }, function (err) {
                var closingObserver = _this._config.closingObserver;
                if (closingObserver) {
                    closingObserver.next(undefined);
                }
                if (err && err.code) {
                    socket.close(err.code, err.reason);
                }
                else {
                    observer.error(new TypeError(WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT));
                }
                _this._resetState();
            }, function () {
                var closingObserver = _this._config.closingObserver;
                if (closingObserver) {
                    closingObserver.next(undefined);
                }
                socket.close();
                _this._resetState();
            });
            if (queue && queue instanceof ReplaySubject) {
                subscription.add(queue.subscribe(_this.destination));
            }
        };
        socket.onerror = function (e) {
            _this._resetState();
            observer.error(e);
        };
        socket.onclose = function (e) {
            if (socket === _this._socket) {
                _this._resetState();
            }
            var closeObserver = _this._config.closeObserver;
            if (closeObserver) {
                closeObserver.next(e);
            }
            if (e.wasClean) {
                observer.complete();
            }
            else {
                observer.error(e);
            }
        };
        socket.onmessage = function (e) {
            try {
                var deserializer = _this._config.deserializer;
                observer.next(deserializer(e));
            }
            catch (err) {
                observer.error(err);
            }
        };
    };
    WebSocketSubject.prototype._subscribe = function (subscriber) {
        var _this = this;
        var source = this.source;
        if (source) {
            return source.subscribe(subscriber);
        }
        if (!this._socket) {
            this._connectSocket();
        }
        this._output.subscribe(subscriber);
        subscriber.add(function () {
            var _socket = _this._socket;
            if (_this._output.observers.length === 0) {
                if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
                    _socket.close();
                }
                _this._resetState();
            }
        });
        return subscriber;
    };
    WebSocketSubject.prototype.unsubscribe = function () {
        var _socket = this._socket;
        if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
            _socket.close();
        }
        this._resetState();
        _super.prototype.unsubscribe.call(this);
    };
    return WebSocketSubject;
}(AnonymousSubject));

function webSocket(urlConfigOrSource) {
    return new WebSocketSubject(urlConfigOrSource);
}

class SocketHandler extends Handler {
  allowedChildren = ["HandlerCondition", "HandlerResponse", "GridFilter"];

  StateName = new String$1("$socket");
  URL = new String$1("ws://localhost:5678/");

  get filters() {
    return this.filterChildren(GridFilter);
  }

  settings() {
    const { conditions, responses, StateName, URL } = this;
    return html`
      <fieldset class="Handler">
        <legend>Socket Handler</legend>
        ${StateName.input()} ${URL.input()}
        <fieldset class="Conditions">
          <legend>Conditions</legend>
          ${this.unorderedChildren(conditions)}
        </fieldset>
        <fieldset class="Responses">
          <legend>Responses</legend>
          ${this.unorderedChildren(responses)}
        </fieldset>
        ${GridFilter.FilterSettings(this.filters)}
      </fieldset>
    `;
  }

  init() {
    super.init();
    // set the signal value
    this.Signal.set("socket");

    // arrange to watch for state changes
    // TODO: figure out how to remove these or make them weak
    Globals.state.observe(() => {
      if (Globals.state.hasBeenUpdated(this.StateName.value)) {
        if (!this.socket) {
          // the connect wasn't successfully opened, try again
          console.error("socket is not active");
          return;
        }
        this.sendData();
      }
    });
  }

  /** The websocket wrapper object
   * @type {import("rxjs/webSocket").WebSocketSubject<any> | undefined} */
  socket = undefined;

  /** The stream of events from the websocket
   * @type {RxJs.Observable<EventLike> | undefined} */
  socket$ = undefined;

  /** @param {RxJs.Subject} _stop$ */
  configure(_stop$) {
    const method = this.method;
    const streamName = "socket";
    // only create it once
    if (method.streams[streamName]) return;

    // this is the socket object
    this.socket = webSocket(this.URL.value);

    // this is the stream of events from it
    this.socket$ = this.socket.pipe(
      retry({ count: 10, delay: 5000 }),
      map((msg) => {
        const event = new Event("socket");
        /** @type {EventLike} */
        const wrapped = {
          type: "socket",
          timeStamp: event.timeStamp,
          access: msg,
          target: null,
        };
        return wrapped;
      }),
      tap((e) => console.log("socket", e)),
    );
    method.streams[streamName] = this.socket$;
  }

  /** @param {EventLike} event */
  respond(event) {
    console.log("socket respond", event.type);

    /* Incoming data arrives here in the .access property. This code will filter any arrays of objects and
     * include them in the dynamic data
     */
    let dynamicRows = [];
    const fields = [];
    for (const [key, value] of Object.entries(event.access)) {
      console.log(key, value);
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "object" &&
        value[0] !== null
      ) {
        dynamicRows = dynamicRows.concat(value);
      } else {
        fields.push([key, value]);
      }
    }
    event.access = Object.fromEntries(fields);
    if (dynamicRows.length > 0) {
      Globals.data.setDynamicRows(dynamicRows);
    }
    // pass incoming messages to the response
    super.respond(event);
  }

  sendData() {
    if (!this.socket) return;

    // send the data over the websocket
    const name = this.method.Name.value;
    const message = {
      method: name,
      stateName: this.StateName.value,
      URL: this.URL.value,
      state: Globals.state.values,
    };
    const filters = this.filters;
    if (filters.length > 0) {
      const content = Globals.data.getMatchingRows(
        filters,
        false, // do not pass NULL for the undefined fields
      );
      message["content"] = content;
    }
    this.socket.next(message);
  }
}
TreeBase.register(SocketHandler, "SocketHandler");

const timerSignals = new Map([
  ["transitionend", "Transition end"],
  ["animationend", "Animation end"],
  ["timer", "Timer complete"],
]);

class TimerHandler extends Handler {
  allowedChildren = ["HandlerCondition", "HandlerResponse"];

  Signal = new Select(timerSignals);
  TimerName = new Select([], { hiddenLabel: true });

  settings() {
    const { conditions, responses, Signal } = this;
    const timerNames = this.nearestParent(Method)?.timerNames;
    return html`
      <fieldset class="Handler" tabindex="0" id=${this.id}>
        <legend>Timer Handler</legend>
        ${Signal.input()} ${this.TimerName.input(timerNames)}
        <fieldset class="Conditions">
          <legend>Conditions</legend>
          ${this.unorderedChildren(conditions)}
        </fieldset>
        <fieldset class="Responses">
          <legend>Responses</legend>
          ${this.unorderedChildren(responses)}
        </fieldset>
      </fieldset>
    `;
  }

  /** @param {RxJs.Subject} _stop$ */
  configure(_stop$) {
    const method = this.method;
    const timerName = this.TimerName.value;
    // there could be multiple timers active at once
    const streamName = `timer-${timerName}`;
    // only create it once
    if (method.streams[streamName]) return;

    const timer = method.timer(timerName);
    if (!timer) return;

    const delayTime = 1000 * timer.Interval.value;
    method.streams[streamName] = timer.subject$.pipe(
      switchMap((event) =>
        event.type == "cancel"
          ? EMPTY
          : of(event).pipe(delay(delayTime)),
      ),
    );
  }
}
TreeBase.register(TimerHandler, "TimerHandler");

const cues = '';

const defaultCues = {
  className: "CueList",
  props: {
    direction: "",
    background: "",
    scale: 1,
    name: "Cues",
    label: "",
  },
  children: [
    {
      className: "CueOverlay",
      props: {
        Name: "red overlay",
        Key: "idl7w16hghqop9hcgn95",
        CueType: "CueOverlay",
        Default: true,
        Color: "red",
        Opacity: "0.2",
      },
      children: [],
    },
    {
      className: "CueFill",
      props: {
        Name: "fill",
        Key: "idl7ysqw4agxg63qvx4j5",
        CueType: "CueFill",
        Default: false,
        Color: "#7BAFD4",
        Opacity: "0.3",
        Direction: "top",
        Repeat: false,
      },
      children: [],
    },
    {
      className: "CueCircle",
      props: {
        Name: "circle",
        Key: "idl7ythslqew02w4pom29",
        CueType: "CueCircle",
        Default: false,
        Color: "#7BAFD4",
        Opacity: 0.7,
      },
      children: [],
    },
    {
      className: "CueCss",
      props: {
        Name: "yellow overlay using CSS",
        Key: "idl7qm4cs28fh2ogf4ni",
        CueType: "CueCss",
        Default: false,
        Code: `button[cue="$Key"] {
  position: relative;
  border-color: yellow;
}
button[cue="$Key"]:after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: yellow;
  opacity: 0.3;
  z-index: 10;
}`,
      },
      children: [],
    },
  ],
};

class CueList extends DesignerPanel {
  name = new String$1("Cues");

  static tableName = "cues";
  static defaultValue = defaultCues;

  allowedChildren = ["CueCss", "CueFill", "CueOverlay", "CueCircle"];
  /** @type {Cue[]} */
  children = [];

  allowDelete = false;

  settings() {
    return html`<div class=${this.CSSClasses("CueList")} id=${this.id}>
      ${this.unorderedChildren()}
    </div>`;
  }

  template() {
    const result = this.children.map(
      (child) =>
        html`<style>
          ${child.css}
        </style>`,
    );
    if (this.children.length > 0) {
      const defaultCue = this.defaultCue;
      const defaultCSS = defaultCue.css.replaceAll(
        defaultCue.Key.value,
        "DefaultCue",
      );
      result.push(
        html`<style>
          ${defaultCSS}
        </style>`,
      );
    }
    return html`${result}`;
  }

  get cueMap() {
    /** @type {[string,string][]} */
    const entries = this.children.map((child) => [
      child.Key.value,
      child.Name.value,
    ]);
    entries.unshift(["DefaultCue", "Default Cue"]);
    return new Map(entries);
  }

  get defaultCue() {
    return this.children.find((cue) => cue.Default.value) || this.children[0];
  }

  /** @param {Object} obj */
  static upgrade(obj) {
    // update any CueCss entries to the new style interpolation
    if (obj.className == "CueList") {
      for (const child of obj.children) {
        if (child.className == "CueCss") {
          child.props.Code = child.props.Code.replaceAll("{{Key}}", "$Key");
        }
      }
    }
    return obj;
  }
}
TreeBase.register(CueList, "CueList");

const CueTypes = new Map([
  ["Cue", "none"],
  ["CueOverlay", "overlay"],
  ["CueFill", "fill"],
  ["CueCss", "css"],
  ["CueCircle", "circle"],
]);

class Cue extends TreeBaseSwitchable {
  Name = new String$1("a cue");
  Key = new UID();
  CueType = new TypeSelect(CueTypes);
  Default = new OneOfGroup(false, { group: "DefaultCue" });

  settingsSummary() {
    return html`<h3>
      ${this.Name.value} ${toggleIndicator(this.Default.value, "Default cue")}
    </h3>`;
  }

  settingsDetails() {
    return [
      html`<div class="Cue">
        ${this.Name.input()} ${this.Default.input()} ${this.CueType.input()}
        ${this.subTemplate()}
      </div>`,
    ];
  }

  /** @returns {Hole[]} */
  subTemplate() {
    return [];
  }

  get css() {
    return "";
  }
}
TreeBase.register(Cue, "Cue");

class CueCss extends Cue {
  Code = new Code("", {
    placeholder: "Enter CSS for this cue",
    hiddenLabel: true,
  });

  subTemplate() {
    return [this.Code.input()];
  }

  get css() {
    return Globals.state.interpolate(this.Code.editedValue);
  }

  onUpdate() {
    this.Code.editCSS(this.propsAsObject);
  }

  init() {
    super.init();
    this.onUpdate();
  }
}
TreeBase.register(CueCss, "CueCss");

class CueOverlay extends Cue {
  Color = new Color("yellow");
  Opacity = new Float(0.3);

  subTemplate() {
    return [
      this.Color.input(),
      this.Opacity.input(),
      html`<details>
        <summary>generated CSS</summary>
        <pre><code>${this.css.replaceAll(this.Key.value, "$Key")}</code></pre>
      </details>`,
    ];
  }

  get css() {
    return `
#UI button[cue="${this.Key.value}"] {
        position: relative;
        border-color: ${getColor(this.Color.value)};
      }
#UI button[cue="${this.Key.value}"]:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${getColor(this.Color.value)};
        opacity: ${this.Opacity.value};
        z-index: 10;
      }
    `;
  }
}
TreeBase.register(CueOverlay, "CueOverlay");

const fillDirections = new Map([
  ["top", "up"],
  ["bottom", "down"],
  ["right", "left to right"],
  ["left", "right to left"],
]);
class CueFill extends Cue {
  Color = new Color("blue");
  Opacity = new Float(0.3);
  Direction = new Select(fillDirections);
  Repeat = new Boolean$1(false);

  subTemplate() {
    return [
      this.Color.input(),
      this.Opacity.input(),
      this.Direction.input(),
      this.Repeat.input(),
      html`<details>
        <summary>generated CSS</summary>
        <pre><code>${this.css.replaceAll(this.Key.value, "$Key")}</code></pre>
      </details>`,
    ];
  }

  get css() {
    return `
      button[cue="${this.Key.value}"] {
        position: relative;
        border-color: ${getColor(this.Color.value)};
      }
      button[cue="${this.Key.value}"]:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        background-color: ${getColor(this.Color.value)};
        opacity: ${this.Opacity.value};
        z-index: 10;
        animation-name: ${this.Key.value};
        animation-duration: var(--timerInterval);
        animation-timing-function: linear;
        animation-iteration-count: ${this.Repeat.value ? "infinite" : 1};
      }
      @keyframes ${this.Key.value} {
        0% { ${this.Direction.value}: 100%; }
      100% { ${this.Direction.value}: 0%; }
      }
    `;
  }
}
TreeBase.register(CueFill, "CueFill");

class CueCircle extends Cue {
  Color = new Color("lightblue");
  Opacity = new Float(0.3);

  subTemplate() {
    return [
      this.Color.input(),
      this.Opacity.input(),
      html`<details>
        <summary>generated CSS</summary>
        <pre><code>${this.css.replaceAll(this.Key.value, "$Key")}</code></pre>
      </details>`,
    ];
  }

  get css() {
    return `
@property --percent-${this.Key.value} {
  syntax: "<percentage>";
  initial-value: 100%;
  inherits: false;
}
button[cue="${this.Key.value}"] {
  position: relative;
  border-color: ${getColor(this.Color.value)};
}
button[cue="${this.Key.value}"]:after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  -webkit-mask-image: radial-gradient(
    transparent,
    transparent 50%,
    #000 51%,
    #000 0
  );
  mask: radial-gradient(transparent, transparent 50%, #000 51%, #000 0);

  background-image: conic-gradient(
    from 0,
      ${getColor(this.Color.value)},
      ${getColor(this.Color.value)} var(--percent-${this.Key.value}),
    transparent var(--percent-${this.Key.value})
  );
  opacity: ${this.Opacity.value};

  animation-name: conic-gradient-${this.Key.value};
  animation-duration: var(--timerInterval);
  animation-timing-function: linear;

  z-index: 0;
}

@keyframes conic-gradient-${this.Key.value} {
  0% {
    --percent-${this.Key.value}: 0%;
  }

  100% {
    --percent-${this.Key.value}: 100%;
  }
}
    `;
  }
}
TreeBase.register(CueCircle, "CueCircle");

const TrackyMouse = {
  dependenciesRoot: "./tracky-mouse",
};

TrackyMouse.loadDependencies = function () {
  TrackyMouse.dependenciesRoot = TrackyMouse.dependenciesRoot.replace(
    /\/+$/,
    "",
  );
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      // This wouldn't wait for them to load
      // for (const script of document.scripts) {
      // 	if (script.src.includes(src)) {
      // 		resolve();
      // 		return;
      // 	}
      // }
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = resolve;
      script.onerror = reject;
      script.src = src;
      document.head.append(script);
    });
  };
  const scriptFiles = [
    `${TrackyMouse.dependenciesRoot}/lib/clmtrackr.js`,
    `${TrackyMouse.dependenciesRoot}/lib/facemesh/facemesh.js`,
    `${TrackyMouse.dependenciesRoot}/lib/stats.js`,
    `${TrackyMouse.dependenciesRoot}/lib/tf.js`,
  ];
  return Promise.all(scriptFiles.map(loadScript));
};

TrackyMouse.init = function (div) {
  var uiContainer = div || document.createElement("div");
  uiContainer.classList.add("tracky-mouse-ui");
  uiContainer.innerHTML = `
		<div class="tracky-mouse-controls">
        <button id="tracky-mouse-close">Close</button>
			<br>
			<label><span class="label-text">Horizontal Sensitivity</span> <input type="range" min="0" max="100" value="25" id="sensitivity-x"></label>
			<label><span class="label-text">Vertical Sensitivity</span> <input type="range" min="0" max="100" value="50" id="sensitivity-y"></label>
			<!-- <label><span class="label-text">Smoothing</span> <input type="range" min="0" max="100" value="50" id="smoothing"></label> -->
			<label><span class="label-text">Acceleration</span> <input type="range" min="0" max="100" value="50" id="acceleration"></label>
			<!-- <label><span class="label-text">Easy Stop (min distance to move)</span> <input type="range" min="0" max="100" value="50" id="min-distance"></label> -->
			<br>
			<label><span class="label-text"><input type="checkbox" checked id="mirror"> Mirror</label>
			<br>
		</div>
		<canvas class="tracky-mouse-canvas" id="tracky-mouse-canvas"></canvas>
	`;
  if (!div) {
    document.body.appendChild(uiContainer);
  }
  var mirrorCheckbox = uiContainer.querySelector("#mirror");
  var sensitivityXSlider = uiContainer.querySelector("#sensitivity-x");
  var sensitivityYSlider = uiContainer.querySelector("#sensitivity-y");
  var accelerationSlider = uiContainer.querySelector("#acceleration");
  var closeButton = uiContainer.querySelector("#tracky-mouse-close");

  closeButton.addEventListener("click", () => {
    console.log("click");
    TrackyMouse.showUI(false);
  });

  var canvas = uiContainer.querySelector("#tracky-mouse-canvas");
  var ctx = canvas.getContext("2d");

  var pointerEl = document.createElement("div");
  pointerEl.className = "tracky-mouse-pointer";
  document.body.appendChild(pointerEl);

  var cameraVideo = document.createElement("video");
  // required to work in iOS 11 & up:
  cameraVideo.setAttribute("playsinline", "");

  // var stats = new Stats();
  // stats.domElement.style.position = "absolute";
  // stats.domElement.style.top = "0px";
  // stats.domElement.style.right = "0px";
  // stats.domElement.style.left = "";
  // document.body.appendChild(stats.domElement);

  var defaultWidth = 640;
  var defaultHeight = 480;
  var maxPoints = 1000;
  var mouseX = 0;
  var mouseY = 0;
  var prevMovementX = 0;
  var prevMovementY = 0;
  // var movementXSinceFacemeshUpdate = 0;
  // var movementYSinceFacemeshUpdate = 0;
  var cameraFramesSinceFacemeshUpdate = [];
  var sensitivityX;
  var sensitivityY;
  var acceleration;
  var face;
  var faceScore = 0;
  var faceScoreThreshold = 0.5;
  var pointsBasedOnFaceScore = 0;
  var paused = false;
  var mouseNeedsInitPos = true;
  var mirror;

  var useClmTracking = false;
  var showClmTracking = useClmTracking;
  var useFacemesh = true;
  var facemeshOptions = {
    maxContinuousChecks: 5,
    detectionConfidence: 0.9,
    maxFaces: 1,
    iouThreshold: 0.3,
    scoreThreshold: 0.75,
  };
  var fallbackTimeoutID;

  var facemeshLoaded = false;
  var facemeshFirstEstimation = true;
  var facemeshEstimating = false;
  var facemeshRejectNext = 0;
  var facemeshPrediction;
  var facemeshEstimateFaces;
  var faceInViewConfidenceThreshold = 0.7;
  var pointsBasedOnFaceInViewConfidence = 0;

  // scale of size of frames that are passed to worker and then computed several at once when backtracking for latency compensation
  // reducing this makes it much more likely to drop points and thus not work
  // THIS IS DISABLED and using a performance optimization of currentCameraImageData instead of getCameraImageData;
  // (the currentCameraImageData is also scaled differently, to the fixed canvas size instead of using the native camera image size)
  // const frameScaleForWorker = 1;

  var mainOops;
  var workerSyncedOops;

  // const frameCanvas = document.createElement("canvas");
  // const frameCtx = frameCanvas.getContext("2d");
  // const getCameraImageData = () => {
  // 	if (cameraVideo.videoWidth * frameScaleForWorker * cameraVideo.videoHeight * frameScaleForWorker < 1) {
  // 		return;
  // 	}
  // 	frameCanvas.width = cameraVideo.videoWidth * frameScaleForWorker;
  // 	frameCanvas.height = cameraVideo.videoHeight * frameScaleForWorker;
  // 	frameCtx.drawImage(cameraVideo, 0, 0, frameCanvas.width, frameCanvas.height);
  // 	return frameCtx.getImageData(0, 0, frameCanvas.width, frameCanvas.height);
  // };

  let currentCameraImageData;
  let facemeshWorker;
  const initFacemeshWorker = () => {
    if (facemeshWorker) {
      facemeshWorker.terminate();
    }
    facemeshEstimating = false;
    facemeshFirstEstimation = true;
    facemeshLoaded = false;
    facemeshWorker = new Worker(
      `${TrackyMouse.dependenciesRoot}/facemesh.worker.js`,
    );
    facemeshWorker.addEventListener(
      "message",
      (e) => {
        if (e.data.type === "LOADED") {
          facemeshLoaded = true;
          facemeshEstimateFaces = () => {
            const imageData = currentCameraImageData; //getCameraImageData();
            if (!imageData) {
              return;
            }
            facemeshWorker.postMessage({ type: "ESTIMATE_FACES", imageData });
            return new Promise((resolve, reject) => {
              facemeshWorker.addEventListener(
                "message",
                (e) => {
                  if (e.data.type === "ESTIMATED_FACES") {
                    resolve(e.data.predictions);
                  }
                },
                { once: true },
              );
            });
          };
        }
      },
      { once: true },
    );
    facemeshWorker.postMessage({ type: "LOAD", options: facemeshOptions });
  };

  {
    initFacemeshWorker();
  }

  sensitivityXSlider.onchange = () => {
    sensitivityX = sensitivityXSlider.value / 1000;
  };
  sensitivityYSlider.onchange = () => {
    sensitivityY = sensitivityYSlider.value / 1000;
  };
  accelerationSlider.onchange = () => {
    acceleration = accelerationSlider.value / 100;
  };
  mirrorCheckbox.onchange = () => {
    mirror = mirrorCheckbox.checked;
  };
  mirrorCheckbox.onchange();
  sensitivityXSlider.onchange();
  sensitivityYSlider.onchange();
  accelerationSlider.onchange();

  // Don't use WebGL because clmTracker is our fallback! It's also not much slower than with WebGL.
  var clmTracker = new clm.tracker({ useWebGL: false });
  clmTracker.init();
  var clmTrackingStarted = false;

  const reset = () => {
    clmTrackingStarted = false;
    cameraFramesSinceFacemeshUpdate.length = 0;
    if (facemeshPrediction) {
      // facemesh has a setting maxContinuousChecks that determines "How many frames to go without running
      // the bounding box detector. Only relevant if maxFaces > 1. Defaults to 5."
      facemeshRejectNext = facemeshOptions.maxContinuousChecks;
    }
    facemeshPrediction = null;
    useClmTracking = true;
    showClmTracking = true;
    pointsBasedOnFaceScore = 0;
    faceScore = 0;
  };

  TrackyMouse.useCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          width: defaultWidth,
          height: defaultHeight,
          facingMode: "user",
        },
      })
      .then(
        (stream) => {
          reset();
          try {
            if ("srcObject" in cameraVideo) {
              cameraVideo.srcObject = stream;
            } else {
              cameraVideo.src = window.URL.createObjectURL(stream);
            }
          } catch (err) {
            cameraVideo.src = stream;
          }
        },
        (error) => {
          console.log(error);
        },
      );
    paused = false;
  };

  TrackyMouse.pauseCamera = () => {
    cameraVideo.srcObject &&
      cameraVideo.srcObject.getTracks().forEach((track) => track.stop());
    paused = true;
  };

  TrackyMouse.showUI = (show) => {
    document
      .querySelector("div.tracky-mouse-ui")
      .classList.toggle("show", show);
  };
  // useDemoFootageButton.onclick = TrackyMouse.useDemoFootage = () => {
  //   reset();
  //   cameraVideo.srcObject = null;
  //   cameraVideo.src = `${TrackyMouse.dependenciesRoot}/private/demo-input-footage.webm`;
  //   cameraVideo.loop = true;
  // };

  if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
    console.log("getUserMedia not supported in this browser");
  }

  cameraVideo.addEventListener("loadedmetadata", () => {
    cameraVideo.play();
    cameraVideo.width = cameraVideo.videoWidth;
    cameraVideo.height = cameraVideo.videoHeight;
    canvas.width = cameraVideo.videoWidth;
    canvas.height = cameraVideo.videoHeight;
    debugFramesCanvas.width = cameraVideo.videoWidth;
    debugFramesCanvas.height = cameraVideo.videoHeight;
    debugPointsCanvas.width = cameraVideo.videoWidth;
    debugPointsCanvas.height = cameraVideo.videoHeight;

    mainOops = new OOPS();
    {
      workerSyncedOops = new OOPS();
    }
  });
  cameraVideo.addEventListener("play", () => {
    clmTracker.reset();
    clmTracker.initFaceDetector(cameraVideo);
    clmTrackingStarted = true;
  });

  canvas.width = defaultWidth;
  canvas.height = defaultHeight;
  cameraVideo.width = defaultWidth;
  cameraVideo.height = defaultHeight;

  const debugFramesCanvas = document.createElement("canvas");
  debugFramesCanvas.width = canvas.width;
  debugFramesCanvas.height = canvas.height;
  debugFramesCanvas.getContext("2d");

  const debugPointsCanvas = document.createElement("canvas");
  debugPointsCanvas.width = canvas.width;
  debugPointsCanvas.height = canvas.height;
  const debugPointsCtx = debugPointsCanvas.getContext("2d");

  // function getPyramidData(pyramid) {
  // 	const array = new Float32Array(pyramid.data.reduce((sum, matrix)=> sum + matrix.buffer.f32.length, 0));
  // 	let offset = 0;
  // 	for (const matrix of pyramid.data) {
  // 		copy matrix.buffer.f32 into array starting at offset;
  // 		offset += matrix.buffer.f32.length;
  // 	}
  // 	return array;
  // }
  // function setPyramidData(pyramid, array) {
  // 	let offset = 0;
  // 	for (const matrix of pyramid.data) {
  // 		copy portion of array starting at offset into matrix.buffer.f32
  // 		offset += matrix.buffer.f32.length;
  // 	}
  // }

  // maybe should be based on size of head in view?
  const pruningGridSize = 5;
  const minDistanceToAddPoint = pruningGridSize * 1.5;

  // Object Oriented Programming Sucks
  // or Optical flOw Points System
  class OOPS {
    constructor() {
      this.curPyramid = new jsfeat.pyramid_t(3);
      this.prevPyramid = new jsfeat.pyramid_t(3);
      this.curPyramid.allocate(
        cameraVideo.videoWidth,
        cameraVideo.videoHeight,
        jsfeat.U8C1_t,
      );
      this.prevPyramid.allocate(
        cameraVideo.videoWidth,
        cameraVideo.videoHeight,
        jsfeat.U8C1_t,
      );

      this.pointCount = 0;
      this.pointStatus = new Uint8Array(maxPoints);
      this.prevXY = new Float32Array(maxPoints * 2);
      this.curXY = new Float32Array(maxPoints * 2);
    }
    addPoint(x, y) {
      if (this.pointCount < maxPoints) {
        var pointIndex = this.pointCount * 2;
        this.curXY[pointIndex] = x;
        this.curXY[pointIndex + 1] = y;
        this.prevXY[pointIndex] = x;
        this.prevXY[pointIndex + 1] = y;
        this.pointCount++;
      }
    }
    filterPoints(condition) {
      var outputPointIndex = 0;
      for (
        var inputPointIndex = 0;
        inputPointIndex < this.pointCount;
        inputPointIndex++
      ) {
        if (condition(inputPointIndex)) {
          if (outputPointIndex < inputPointIndex) {
            var inputOffset = inputPointIndex * 2;
            var outputOffset = outputPointIndex * 2;
            this.curXY[outputOffset] = this.curXY[inputOffset];
            this.curXY[outputOffset + 1] = this.curXY[inputOffset + 1];
            this.prevXY[outputOffset] = this.prevXY[inputOffset];
            this.prevXY[outputOffset + 1] = this.prevXY[inputOffset + 1];
          }
          outputPointIndex++;
        } else {
          debugPointsCtx.fillStyle = "red";
          var inputOffset = inputPointIndex * 2;
          circle(
            debugPointsCtx,
            this.curXY[inputOffset],
            this.curXY[inputOffset + 1],
            5,
          );
          debugPointsCtx.fillText(
            condition.toString(),
            5 + this.curXY[inputOffset],
            this.curXY[inputOffset + 1],
          );
          // console.log(this.curXY[inputOffset], this.curXY[inputOffset + 1]);
          ctx.strokeStyle = ctx.fillStyle;
          ctx.beginPath();
          ctx.moveTo(this.prevXY[inputOffset], this.prevXY[inputOffset + 1]);
          ctx.lineTo(this.curXY[inputOffset], this.curXY[inputOffset + 1]);
          ctx.stroke();
        }
      }
      this.pointCount = outputPointIndex;
    }
    prunePoints() {
      // pointStatus is only valid (indices line up) before filtering occurs, so must come first (could be combined though)
      this.filterPoints((pointIndex) => this.pointStatus[pointIndex] == 1);

      // De-duplicate points that are too close together
      // - Points that have collapsed together are completely useless.
      // - Points that are too close together are not necessarily helpful,
      //   and may adversely affect the tracking due to uneven weighting across your face.
      // - Reducing the number of points improves FPS.
      const grid = {};
      for (let pointIndex = 0; pointIndex < this.pointCount; pointIndex++) {
        const pointOffset = pointIndex * 2;
        grid[
          `${~~(this.curXY[pointOffset] / pruningGridSize)},${~~(
            this.curXY[pointOffset + 1] / pruningGridSize
          )}`
        ] = pointIndex;
      }
      const indexesToKeep = Object.values(grid);
      this.filterPoints((pointIndex) => indexesToKeep.includes(pointIndex));
    }
    update(imageData) {
      [this.prevXY, this.curXY] = [this.curXY, this.prevXY];
      [this.prevPyramid, this.curPyramid] = [this.curPyramid, this.prevPyramid];

      // these are options worth breaking out and exploring
      var winSize = 20;
      var maxIterations = 30;
      var epsilon = 0.01;
      var minEigen = 0.001;

      jsfeat.imgproc.grayscale(
        imageData.data,
        imageData.width,
        imageData.height,
        this.curPyramid.data[0],
      );
      this.curPyramid.build(this.curPyramid.data[0], true);
      jsfeat.optical_flow_lk.track(
        this.prevPyramid,
        this.curPyramid,
        this.prevXY,
        this.curXY,
        this.pointCount,
        winSize,
        maxIterations,
        this.pointStatus,
        epsilon,
        minEigen,
      );
      this.prunePoints();
    }
    draw(ctx) {
      for (var i = 0; i < this.pointCount; i++) {
        var pointOffset = i * 2;
        // var distMoved = Math.hypot(
        // 	this.prevXY[pointOffset] - this.curXY[pointOffset],
        // 	this.prevXY[pointOffset + 1] - this.curXY[pointOffset + 1]
        // );
        // if (distMoved >= 1) {
        // 	ctx.fillStyle = "lime";
        // } else {
        // 	ctx.fillStyle = "gray";
        // }
        circle(ctx, this.curXY[pointOffset], this.curXY[pointOffset + 1], 3);
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();
        ctx.moveTo(this.prevXY[pointOffset], this.prevXY[pointOffset + 1]);
        ctx.lineTo(this.curXY[pointOffset], this.curXY[pointOffset + 1]);
        ctx.stroke();
      }
    }
    getMovement() {
      var movementX = 0;
      var movementY = 0;
      var numMovements = 0;
      for (var i = 0; i < this.pointCount; i++) {
        var pointOffset = i * 2;
        movementX += this.curXY[pointOffset] - this.prevXY[pointOffset];
        movementY += this.curXY[pointOffset + 1] - this.prevXY[pointOffset + 1];
        numMovements += 1;
      }
      if (numMovements > 0) {
        movementX /= numMovements;
        movementY /= numMovements;
      }
      return [movementX, movementY];
    }
  }

  canvas.addEventListener("click", (event) => {
    if (!mainOops) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    if (mirror) {
      mainOops.addPoint(
        ((rect.right - event.clientX) / rect.width) * canvas.width,
        ((event.clientY - rect.top) / rect.height) * canvas.height,
      );
    } else {
      mainOops.addPoint(
        ((event.clientX - rect.left) / rect.width) * canvas.width,
        ((event.clientY - rect.top) / rect.height) * canvas.height,
      );
    }
  });

  function maybeAddPoint(oops, x, y) {
    // In order to prefer points that already exist, since they're already tracking,
    // in order to keep a smooth overall tracking calculation,
    // don't add points if they're close to an existing point.
    // Otherwise, it would not just be redundant, but often remove the older points, in the pruning.
    for (var pointIndex = 0; pointIndex < oops.pointCount; pointIndex++) {
      var pointOffset = pointIndex * 2;
      // var distance = Math.hypot(
      // 	x - oops.curXY[pointOffset],
      // 	y - oops.curXY[pointOffset + 1]
      // );
      // if (distance < 8) {
      // 	return;
      // }
      // It might be good to base this on the size of the face...
      // Also, since we're pruning points based on a grid,
      // there's not much point in using Euclidean distance here,
      // we can just look at x and y distances.
      if (
        Math.abs(x - oops.curXY[pointOffset]) <= minDistanceToAddPoint ||
        Math.abs(y - oops.curXY[pointOffset + 1]) <= minDistanceToAddPoint
      ) {
        return;
      }
    }
    oops.addPoint(x, y);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!paused)
      draw((!paused || document.visibilityState === "visible"));
  }

  function draw(update = true) {
    ctx.resetTransform(); // in case there is an error, don't flip constantly back and forth due to mirroring
    ctx.clearRect(0, 0, canvas.width, canvas.height); // in case there's no footage
    ctx.save();
    ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    currentCameraImageData = imageData;

    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
    }

    if (!mainOops) {
      return;
    }

    if (update) {
      if (clmTrackingStarted) {
        if (useClmTracking || showClmTracking) {
          try {
            clmTracker.track(cameraVideo);
          } catch (error) {
            console.warn("Error in clmTracker.track()", error);
            if (clmTracker.getCurrentParameters().includes(NaN)) {
              console.warn("NaNs creeped in.");
            }
          }
          face = clmTracker.getCurrentPosition();
          faceScore = clmTracker.getScore();
          Math.pow(clmTracker.getConvergence(), 0.5);
        }
        if (facemeshLoaded && !facemeshEstimating) {
          facemeshEstimating = true;
          // movementXSinceFacemeshUpdate = 0;
          // movementYSinceFacemeshUpdate = 0;
          cameraFramesSinceFacemeshUpdate = [];
          // If I switch virtual console desktop sessions in Ubuntu with Ctrl+Alt+F1 (and back with Ctrl+Alt+F2),
          // WebGL context is lost, which breaks facemesh (and clmTracker if useWebGL is not false)
          // Error: Size(8192) must match the product of shape 0, 0, 0
          //     at inferFromImplicitShape (tf.js:14142)
          //     at Object.reshape$3 [as kernelFunc] (tf.js:110368)
          //     at kernelFunc (tf.js:17241)
          //     at tf.js:17334
          //     at Engine.scopedRun (tf.js:17094)
          //     at Engine.runKernelFunc (tf.js:17328)
          //     at Engine.runKernel (tf.js:17171)
          //     at reshape_ (tf.js:25875)
          //     at reshape__op (tf.js:18348)
          //     at executeOp (tf.js:85396)
          // WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost

          // Note that the first estimation from facemesh often takes a while,
          // and we don't want to continuously terminate the worker as it's working on those first results.
          // And also, for the first estimate it hasn't actually disabled clmtracker yet, so it's fine if it's a long timeout.
          clearTimeout(fallbackTimeoutID);
          fallbackTimeoutID = setTimeout(
            () => {
              if (!useClmTracking) {
                reset();
                clmTracker.init();
                clmTracker.reset();
                clmTracker.initFaceDetector(cameraVideo);
                clmTrackingStarted = true;
                console.warn("Falling back to clmtracker");
              }
              // If you've switched desktop sessions, it will presuably fail to get a new webgl context until you've switched back
              // Is this setInterval useful, vs just starting the worker?
              // It probably has a faster cycle, with the code as it is now, but maybe not inherently.
              // TODO: do the extra getContext() calls add to a GPU process crash limit
              // that makes it only able to recover a couple times (outside the electron app)?
              // For electron, I set chromium flag --disable-gpu-process-crash-limit so it can recover unlimited times.
              // TODO: there's still the case of WebGL backend failing to initialize NOT due to the process crash limit,
              // where it'd be good to have it try again (maybe with exponential falloff?)
              // (I think I can move my fallbackTimeout code into/around `initFacemeshWorker` and `facemeshEstimateFaces`)

              // Note: clearTimeout/clearInterval work interchangably
              fallbackTimeoutID = setInterval(() => {
                try {
                  // Once we can create a webgl2 canvas...
                  document.createElement("canvas").getContext("webgl2");
                  clearInterval(fallbackTimeoutID);
                  // It's worth trying to re-initialize...
                  setTimeout(() => {
                    console.warn("Re-initializing facemesh worker");
                    initFacemeshWorker();
                    facemeshRejectNext = 1; // or more?
                  }, 1000);
                } catch (e) {}
              }, 500);
            },
            facemeshFirstEstimation ? 20000 : 2000,
          );
          facemeshEstimateFaces().then(
            (predictions) => {
              facemeshEstimating = false;
              facemeshFirstEstimation = false;

              facemeshRejectNext -= 1;
              if (facemeshRejectNext > 0) {
                return;
              }

              facemeshPrediction = predictions[0]; // undefined if no faces found

              useClmTracking = false;
              showClmTracking = false;
              clearTimeout(fallbackTimeoutID);

              if (!facemeshPrediction) {
                return;
              }
              // this applies to facemeshPrediction.annotations as well, which references the same points
              // facemeshPrediction.scaledMesh.forEach((point) => {
              // 	point[0] /= frameScaleForWorker;
              // 	point[1] /= frameScaleForWorker;
              // });

              // time travel latency compensation
              // keep a history of camera frames since the prediciton was requested,
              // and analyze optical flow of new points over that history

              // mainOops.filterPoints(() => false); // for DEBUG, empty points (could probably also just set pointCount = 0;

              workerSyncedOops.filterPoints(() => false); // empty points (could probably also just set pointCount = 0;

              const { annotations } = facemeshPrediction;
              // nostrils
              workerSyncedOops.addPoint(
                annotations.noseLeftCorner[0][0],
                annotations.noseLeftCorner[0][1],
              );
              workerSyncedOops.addPoint(
                annotations.noseRightCorner[0][0],
                annotations.noseRightCorner[0][1],
              );
              // midway between eyes
              workerSyncedOops.addPoint(
                annotations.midwayBetweenEyes[0][0],
                annotations.midwayBetweenEyes[0][1],
              );

              // Bring points from workerSyncedOops to realtime mainOops
              for (
                var pointIndex = 0;
                pointIndex < workerSyncedOops.pointCount;
                pointIndex++
              ) {
                const pointOffset = pointIndex * 2;
                maybeAddPoint(
                  mainOops,
                  workerSyncedOops.curXY[pointOffset],
                  workerSyncedOops.curXY[pointOffset + 1],
                );
              }
              // Don't do this! It's not how this is supposed to work.
              // mainOops.pointCount = workerSyncedOops.pointCount;
              // for (var pointIndex = 0; pointIndex < workerSyncedOops.pointCount; pointIndex++) {
              // 	const pointOffset = pointIndex * 2;
              // 	mainOops.curXY[pointOffset] = workerSyncedOops.curXY[pointOffset];
              // 	mainOops.curXY[pointOffset+1] = workerSyncedOops.curXY[pointOffset+1];
              // 	mainOops.prevXY[pointOffset] = workerSyncedOops.prevXY[pointOffset];
              // 	mainOops.prevXY[pointOffset+1] = workerSyncedOops.prevXY[pointOffset+1];
              // }

              // naive latency compensation
              // Note: this applies to facemeshPrediction.annotations as well which references the same point objects
              // Note: This latency compensation only really works if it's already tracking well
              // if (prevFaceInViewConfidence > 0.99) {
              // 	facemeshPrediction.scaledMesh.forEach((point) => {
              // 		point[0] += movementXSinceFacemeshUpdate;
              // 		point[1] += movementYSinceFacemeshUpdate;
              // 	});
              // }

              pointsBasedOnFaceInViewConfidence =
                facemeshPrediction.faceInViewConfidence;

              // TODO: separate confidence threshold for removing vs adding points?

              // cull points to those within useful facial region
              // TODO: use time travel for this too, probably! with a history of the points
              // a complexity would be that points can be removed over time and we need to keep them identified
              mainOops.filterPoints((pointIndex) => {
                var pointOffset = pointIndex * 2;
                // distance from tip of nose (stretched so make an ellipse taller than wide)
                var distance = Math.hypot(
                  (annotations.noseTip[0][0] - mainOops.curXY[pointOffset]) *
                    1.4,
                  annotations.noseTip[0][1] - mainOops.curXY[pointOffset + 1],
                );
                var headSize = Math.hypot(
                  annotations.leftCheek[0][0] - annotations.rightCheek[0][0],
                  annotations.leftCheek[0][1] - annotations.rightCheek[0][1],
                );
                if (distance > headSize) {
                  return false;
                }
                // Avoid blinking eyes affecting pointer position.
                // distance to outer corners of eyes
                distance = Math.min(
                  Math.hypot(
                    annotations.leftEyeLower0[0][0] -
                      mainOops.curXY[pointOffset],
                    annotations.leftEyeLower0[0][1] -
                      mainOops.curXY[pointOffset + 1],
                  ),
                  Math.hypot(
                    annotations.rightEyeLower0[0][0] -
                      mainOops.curXY[pointOffset],
                    annotations.rightEyeLower0[0][1] -
                      mainOops.curXY[pointOffset + 1],
                  ),
                );
                if (distance < headSize * 0.42) {
                  return false;
                }
                return true;
              });
            },
            () => {
              facemeshEstimating = false;
              facemeshFirstEstimation = false;
            },
          );
        }
      }
      mainOops.update(imageData);
    }

    if (facemeshPrediction) {
      ctx.fillStyle = "red";

      const bad =
        facemeshPrediction.faceInViewConfidence < faceInViewConfidenceThreshold;
      ctx.fillStyle = bad ? "rgb(255,255,0)" : "rgb(130,255,50)";
      if (
        !bad ||
        mainOops.pointCount < 3 ||
        facemeshPrediction.faceInViewConfidence >
          pointsBasedOnFaceInViewConfidence + 0.05
      ) {
        if (bad) {
          ctx.fillStyle = "rgba(255,0,255)";
        }
        if (update && useFacemesh) {
          // this should just be visual, since we only add/remove points based on the facemesh data when receiving it
          facemeshPrediction.scaledMesh.forEach((point) => {
            point[0] += prevMovementX;
            point[1] += prevMovementY;
          });
        }
        facemeshPrediction.scaledMesh.forEach(([x, y, z]) => {
          ctx.fillRect(x, y, 1, 1);
        });
      } else {
        if (update && useFacemesh) {
          pointsBasedOnFaceInViewConfidence -= 0.001;
        }
      }
    }

    if (face) {
      const bad = faceScore < faceScoreThreshold;
      ctx.strokeStyle = bad ? "rgb(255,255,0)" : "rgb(130,255,50)";
      if (
        !bad ||
        mainOops.pointCount < 2 ||
        faceScore > pointsBasedOnFaceScore + 0.05
      ) {
        if (bad) {
          ctx.strokeStyle = "rgba(255,0,255)";
        }
        if (update && useClmTracking) {
          pointsBasedOnFaceScore = faceScore;

          // nostrils
          maybeAddPoint(mainOops, face[42][0], face[42][1]);
          maybeAddPoint(mainOops, face[43][0], face[43][1]);
          // inner eye corners
          // maybeAddPoint(mainOops, face[25][0], face[25][1]);
          // maybeAddPoint(mainOops, face[30][0], face[30][1]);

          // TODO: separate confidence threshold for removing vs adding points?

          // cull points to those within useful facial region
          mainOops.filterPoints((pointIndex) => {
            var pointOffset = pointIndex * 2;
            // distance from tip of nose (stretched so make an ellipse taller than wide)
            var distance = Math.hypot(
              (face[62][0] - mainOops.curXY[pointOffset]) * 1.4,
              face[62][1] - mainOops.curXY[pointOffset + 1],
            );
            // distance based on outer eye corners
            var headSize = Math.hypot(
              face[23][0] - face[28][0],
              face[23][1] - face[28][1],
            );
            if (distance > headSize) {
              return false;
            }
            return true;
          });
        }
      } else {
        if (update && useClmTracking) {
          pointsBasedOnFaceScore -= 0.001;
        }
      }
      if (showClmTracking) {
        clmTracker.draw(canvas, undefined, undefined, true);
      }
    }
    ctx.fillStyle = "lime";
    mainOops.draw(ctx);
    debugPointsCtx.fillStyle = "green";
    mainOops.draw(debugPointsCtx);

    if (update) {
      var [movementX, movementY] = mainOops.getMovement();

      // Acceleration curves add a lot of stability,
      // letting you focus on a specific point without jitter, but still move quickly.

      // var accelerate = (delta, distance) => (delta / 10) * (distance ** 0.8);
      // var accelerate = (delta, distance) => (delta / 1) * (Math.abs(delta) ** 0.8);
      var accelerate = (delta, distance) =>
        (delta / 1) * Math.abs(delta * 5) ** acceleration;

      var distance = Math.hypot(movementX, movementY);
      var deltaX = accelerate(movementX * sensitivityX, distance);
      var deltaY = accelerate(movementY * sensitivityY, distance);

      // This should never happen
      if (!isFinite(deltaX) || !isFinite(deltaY)) {
        return;
      }

      if (!paused) {
        const screenWidth = window.moveMouse ? screen.width : innerWidth;
        const screenHeight = window.moveMouse ? screen.height : innerHeight;

        mouseX -= deltaX * screenWidth;
        mouseY += deltaY * screenHeight;

        mouseX = Math.min(Math.max(0, mouseX), screenWidth);
        mouseY = Math.min(Math.max(0, mouseY), screenHeight);

        if (mouseNeedsInitPos) {
          // TODO: option to get preexisting mouse position instead of set it to center of screen
          mouseX = screenWidth / 2;
          mouseY = screenHeight / 2;
          mouseNeedsInitPos = false;
        }
        if (window.moveMouse) {
          window.moveMouse(~~mouseX, ~~mouseY);
          pointerEl.style.display = "none";
        } else {
          pointerEl.style.display = "";
          pointerEl.style.left = `${mouseX}px`;
          pointerEl.style.top = `${mouseY}px`;
        }
        if (TrackyMouse.onPointerMove) {
          TrackyMouse.onPointerMove(mouseX, mouseY);
        }
      }
      prevMovementX = movementX;
      prevMovementY = movementY;
    }
    ctx.restore();
    // stats.update();
  }

  function circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  animate();

  if (window.moveMouse) {
    useCamera();
  }

  const handleShortcut = (shortcutType) => {
    if (shortcutType === "toggle-tracking") {
      paused = !paused;
      mouseNeedsInitPos = true;
      if (paused) {
        pointerEl.style.display = "none";
      }
    }
  };
  if (typeof onShortcut !== "undefined") {
    onShortcut(handleShortcut);
  } else {
    addEventListener("keydown", (event) => {
      // Same shortcut as the global shortcut in the electron app (is that gonna be a problem?)
      if (
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !event.shiftKey &&
        event.key === "F9"
      ) {
        handleShortcut("toggle-tracking");
      }
    });
  }
};

const trackyMouse = '';

class HeadMouse extends TreeBase {
  stateName = new String$1("$HeadMouse");

  /** @type {Promise} */
  promise;

  template() {
    const stateName = this.stateName.value;
    const { state } = Globals;
    const updated = state.hasBeenUpdated(stateName);
    this.promise.then(() => {
      if (updated) {
        const status = state.get(stateName, "off");
        if (status == "on" || status == "setup") {
          document.body.classList.toggle("HeadMouse", true);
          TrackyMouse.useCamera();
          TrackyMouse.showUI(status == "setup");
        } else if (status == "off") {
          document.body.classList.toggle("HeadMouse", false);
          TrackyMouse.pauseCamera();
          TrackyMouse.showUI(false);
        }
      }
    });
    return html`<div />`;
  }

  init() {
    super.init();
    TrackyMouse.dependenciesRoot = "./tracky-mouse";
    this.promise = TrackyMouse.loadDependencies();
    this.promise.then(() => {
      TrackyMouse.init();
      // TrackyMouse.useCamera();

      // Pointer event simulation logic should be built into tracky-mouse in the future.
      const getEventOptions = ({ x, y }) => {
        return {
          view: window, // needed so the browser can calculate offsetX/Y from the clientX/Y
          clientX: x,
          clientY: y,
          pointerId: 1234567890, // a special value so other code can detect these simulated events
          pointerType: "mouse",
          isPrimary: true,
        };
      };
      let last_el_over;
      /** @param {number} x
       * @param {number} y
       */
      TrackyMouse.onPointerMove = (x, y) => {
        const target = document.elementFromPoint(x, y) || document.body;
        if (target !== last_el_over) {
          if (last_el_over) {
            const event = new PointerEvent(
              "pointerout",
              Object.assign(getEventOptions({ x, y }), {
                button: 0,
                buttons: 1,
                bubbles: true,
                cancelable: false,
              }),
            );
            last_el_over.dispatchEvent(event);
          }
          const event = new PointerEvent(
            "pointerover",
            Object.assign(getEventOptions({ x, y }), {
              button: 0,
              buttons: 1,
              bubbles: true,
              cancelable: false,
            }),
          );
          target.dispatchEvent(event);
          last_el_over = target;
        }
        const event = new PointerEvent(
          "pointermove",
          Object.assign(getEventOptions({ x, y }), {
            button: 0,
            buttons: 1,
            bubbles: true,
            cancelable: true,
          }),
        );
        target.dispatchEvent(event);
      };
    });
  }
}
TreeBase.register(HeadMouse, "HeadMouse");

const toolbar = '';

const menu = '';

/** A menu object with these features:
 *  * Accessible
 *  * Dynamically update available items
 */


class MenuItem {
  /**
   * @param {Object} obj - argument object
   * @param {string} obj.label
   * @param {Function | null} [ obj.callback ]
   * @param {any[]} [ obj.args ]
   * @param {string} [ obj.title ]
   * @param {string} [ obj.divider ]
   */
  constructor({ label, callback = null, args = [], title = "", divider = "" }) {
    this.label = label;
    this.callback = callback;
    this.args = args;
    this.title = title;
    this.divider = divider;
  }

  apply() {
    if (this.callback) this.callback(...this.args);
  }
}

class Menu {
  // a unique id for each menu
  static _menuCount = 0;
  id = `menu_${Menu._menuCount++}`;

  // these are for aria references
  contentId = this.id + "_content";
  buttonId = this.id + "_button";

  expanded = false; // true when the menu is shown

  /** @type {MenuItem[]} */
  items = []; // cached items returned from the contentCallback

  /** @type {HTMLElement} - reference to the outer div */
  current;

  /**
   * @param {string} label - label on the menu button
   * @param {function(...any): MenuItem[]} contentCallback - returns the menu items to display
   * @param {any[]} callbackArgs - type
   */
  constructor(label, contentCallback, ...callbackArgs) {
    this.label = label;
    this.contentCallback = contentCallback;
    this.callbackArgs = callbackArgs;
  }

  render() {
    if (this.expanded) {
      this.items = this.contentCallback(...this.callbackArgs);
      if (this.items.length == 0) {
        this.items = [new MenuItem({ label: "None" })];
      }
    } else {
      this.items = [];
    }
    return html`<div
      class="Menu"
      id=${this.id}
      @focusout=${this.focusHandler}
      ref=${this}
    >
      <button
        id=${this.buttonId}
        aria-expanded=${this.expanded}
        aria-controls=${this.contentId}
        aria-haspopup="true"
        @click=${this.toggleExpanded}
        @keyup=${this.buttonKeyHandler}
      >
        ${this.label}
      </button>
      <ul
        ?hidden=${!this.expanded}
        role="menu"
        id=${this.contentId}
        aria-labelledby=${this.buttonId}
        @keyup=${this.menuKeyHandler}
      >
        ${this.items.map((item, index) => {
          return html`<li role="menuitem" divider=${item.divider}>
            <button
              index=${index}
              aria-disabled=${!item.callback}
              title=${item.title}
              @click=${() => {
                if (item.callback) {
                  this.toggleExpanded();
                  item.apply();
                }
              }}
            >
              ${item.label}
            </button>
          </li>`;
        })}
      </ul>
    </div>`;
  }

  /** @returns {HTMLButtonElement | null} */
  get focusedItem() {
    return this.current.querySelector("li > button:focus");
  }

  /** @param {number} index */
  setFocus(index) {
    // make it a circular buffer
    if (!this.items.length) return;
    index = (index + this.items.length) % this.items.length;
    const item = /** @type {HTMLElement} */ (
      this.current.querySelector(`button[index="${index}"]`)
    );
    if (item) item.focus();
  }

  /* Close the menu when it loses focus */
  focusHandler = ({ relatedTarget }) => {
    if (!relatedTarget) {
      // focus is gone, put it back on the button
      callAfterRender(() => {
        const button = document.getElementById(this.buttonId);
        if (button) button.focus();
      });
      if (this.expanded) this.toggleExpanded();
      return;
    }
    const menu = document.getElementById(this.id);
    if (menu && !menu.contains(relatedTarget) && this.expanded) {
      this.toggleExpanded();
    }
  };

  /* Toggle the menu state */
  toggleExpanded = (event = null, last = false) => {
    {
      this.expanded = !this.expanded;
      // this trick lets us distinguish between clicking the menu button with the mouse
      // and hitting Enter on the keyboard
      const mouseClick = event && event["detail"] !== 0;
      if (this.expanded && (!event || !mouseClick)) {
        // focus on the first element when expanding via keyboard
        callAfterRender(() => {
          if (last) {
            this.setFocus(-1);
          } else {
            this.setFocus(0);
          }
        });
      } else if (!this.expanded && mouseClick) {
        callAfterRender(() => Globals.designer.restoreFocus());
      }
      Globals.state.update();
    }
  };

  /** handle the keyboard when inside the menu
   *
   * @param {KeyboardEvent} event
   * */
  menuKeyHandler = ({ key }) => {
    if (key == "Escape" && this.expanded) {
      this.toggleExpanded();
    } else if (key == "ArrowUp" || key == "ArrowDown") {
      const focused = this.focusedItem;
      const index = +(focused?.getAttribute("index") || 0);
      const step = key == "ArrowUp" ? -1 : 1;
      this.setFocus(index + step);
    } else if (key == "Home") {
      this.setFocus(0);
    } else if (key == "End") {
      this.setFocus(-1);
    } else if (
      key.length == 1 &&
      ((key >= "a" && key <= "z") || (key >= "A" && key <= "Z"))
    ) {
      const focused = this.focusedItem;
      const index = +(focused?.getAttribute("index") || 0);
      for (let i = 1; i < this.items.length; i++) {
        if (
          this.items[(index + i) % this.items.length].label
            .toLowerCase()
            .startsWith(key)
        ) {
          this.setFocus(i + index);
          break;
        }
      }
    }
  };

  /**
   * Handle the keyboard when on the menu button
   *
   * @param {KeyboardEvent} event */
  buttonKeyHandler = (event) => {
    if (event.key == "ArrowDown" || event.key == " ") {
      event.preventDefault();
      this.toggleExpanded();
    } else if (event.key == "ArrowUp") {
      event.preventDefault();
      this.toggleExpanded(null, true);
    }
  };
}

const serviceWorker = '';

// Interface to the service worker for offline


/** A pointer to the service worker
 * @type {ServiceWorkerRegistration} */
let registration;

/**
 * Ask the service worker to check for an update
 */
function workerCheckForUpdate() {
  if (registration) {
    registration.update();
  }
}

/**
 * Show the update button when an update is available
 */
function signalUpdateAvailable() {
  document.body.classList.add("update-available");
}

// only start the service worker in production mode
if (navigator.serviceWorker) {
  window.addEventListener("load", async () => {
    registration = await navigator.serviceWorker.register("service-worker.js", {
      scope: "/OS-DPI/",
    });
    // ensure the case when the updatefound event was missed is also handled
    // by re-invoking the prompt when there's a waiting Service Worker
    if (registration.waiting) {
      signalUpdateAvailable();
    }

    // detect Service Worker update available and wait for it to become installed
    registration.addEventListener("updatefound", () => {
      if (registration.installing) {
        // wait until the new Service worker is actually installed (ready to take over)
        registration.installing.addEventListener("statechange", () => {
          if (registration.waiting) {
            // if there's an existing controller (previous Service Worker), show the prompt
            if (navigator.serviceWorker.controller) {
              signalUpdateAvailable();
            } else {
              // otherwise it's the first install, nothing to do
              console.log("Service Worker initialized for the first time");
            }
          }
        });
      }
    });

    let refreshing = false;

    // detect controller change and refresh the page
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        window.location.reload();
        refreshing = true;
      }
    });
  });
}

/**
 * Return a button for updating the service worker
 * CSS assures this is only visible when an update is available
 * @returns {Hole}
 */
function workerUpdateButton() {
  return html`<button
    id="update-available-button"
    @click=${() => {
      if (registration && registration.waiting) {
        registration.waiting.postMessage("SKIP_WAITING");
      }
    }}
    title="Click to update the app"
  >
    Update
  </button>`;
}

/** Return a list of available Menu items on this component
 *
 * @param {TreeBase} component
 * @param {"add" | "delete" | "move" | "all"} which - which actions to return
 * @param {function} wrapper
 * @returns {MenuItem[]}
 */
function getComponentMenuItems(component, which = "all", wrapper) {
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
    if (component.allowDelete) {
      result.push(
        new MenuItem({
          label: `Delete`,
          title: `Delete ${friendlyName(component.className)}`,
          callback: wrapper(() => {
            // remove returns the id of the nearest neighbor or the parent
            const nextId = component.remove();
            return nextId;
          }),
        }),
      );
    }
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
function getPanelMenuItems(type) {
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
      (component instanceof Stack && parent instanceof Stack) ||
      (component instanceof PatternGroup && parent instanceof PatternGroup) ||
      parent instanceof Designer
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
      label: "Import",
      callback: async () => {
        const local_db = new DB();
        n({
          mimeTypes: ["application/octet-stream"],
          extensions: [".osdpi", ".zip"],
          description: "OS-DPI designs",
          id: "os-dpi",
        })
          .then((file) => wait(local_db.readDesignFromFile(file)))
          .then(() => {
            window.open(`#${local_db.designName}`, "_blank", `noopener=true`);
          })
          .catch((e) => console.log(e));
      },
    }),
    new MenuItem({
      label: "Export",
      callback: () => {
        db.saveDesign();
      },
    }),
    new MenuItem({
      label: "New",
      callback: async () => {
        const name = await db.uniqueName("new");
        window.open(`#${name}`, "_blank", `noopener=true`);
      },
    }),
    new MenuItem({
      label: "Open",
      callback: () => {
        bar.designListDialog.open();
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
      label: "Load Sheet",
      title: "Load a spreadsheet of content",
      divider: "Content",
      callback: async () => {
        try {
          const blob = await n({
            extensions: [".csv", ".tsv", ".ods", ".xls", ".xlsx"],
            description: "Spreadsheets",
            id: "os-dpi",
          });
          if (blob) {
            sheet.handle = blob.handle;
            const result = await wait(readSheetFromBlob(blob));
            await db.write("content", result);
            Globals.data = new Data(result);
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
            const result = await wait(readSheetFromBlob(blob));
            await db.write("content", result);
            Globals.data = new Data(result);
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
        saveContent(db.designName, Globals.data.allrows, "xlsx");
      },
    }),
    new MenuItem({
      label: "Load media",
      title: "Load audio or images into the design",
      callback: async () => {
        try {
          const files = await n({
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
        SaveLogs();
      },
    }),
    new MenuItem({
      label: "Clear logs",
      title: "Clear any stored logs",
      callback: async () => {
        ClearLogs();
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

function getEditMenuItems() {
  let items = [
    new MenuItem({
      label: "Undo",
      callback: () => {
        Globals.designer.currentPanel?.undo();
      },
    }),
    new MenuItem({
      label: "Copy",
      callback: copyComponent,
    }),
    new MenuItem({
      label: "Cut",
      callback: async () => {
        copyComponent(true);
      },
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
        const anchor = Globals.designer.selectedComponent;
        if (!anchor) return;
        /** @type {TreeBase | null } */
        let current = anchor;
        while (current) {
          if (current.allowedChildren.indexOf(className) >= 0) {
            const result = TreeBase.fromObject(obj, current);
            if (
              anchor.parent === result.parent &&
              result.index != anchor.index + 1
            ) {
              anchor.moveTo(anchor.index + 1);
            }
            Globals.designer.currentPanel?.onUpdate();
            return;
          }
          current = current.parent;
        }
      },
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
            label = html`${name}`;
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
  render() {
    return html`<dialog id="OpenDialog"></dialog>`;
  }
}

class ToolBar extends TreeBase {
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
        ${this.designListDialog.render()}
      </div>
    `;
  }
}
TreeBase.register(ToolBar, "ToolBar");

const colors = '';

/** let me wait for the page to load */
const pageLoaded = new Promise((resolve) => {
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
    resolve(true);
  });
});

/** Load page and data then go
 */
async function start() {
  let editing = true;
  if (window.location.search && !window.location.hash.slice(1)) {
    const params = new URLSearchParams(window.location.search);
    const fetch = params.get("fetch");
    if (fetch) {
      await wait(db.readDesignFromURL(fetch));
      editing = params.get("edit") !== null;
      window.history.replaceState(
        {},
        document.title,
        window.location.origin + window.location.pathname + "#" + db.designName,
      );
    }
  }
  let name = window.location.hash.slice(1);
  if (!name) {
    name = await db.uniqueName("new");
    window.location.hash = `#${name}`;
  }
  db.setDesignName(name);
  const dataArray = await db.read("content", []);
  await pageLoaded;

  Globals.data = new Data(dataArray);
  const layout = await Layout.load(Layout);
  Globals.layout = layout;
  Globals.tree = layout.children[0];
  Globals.state = new State$1(`UIState`);
  Globals.actions = await Actions.load(Actions);
  Globals.cues = await CueList.load(CueList);
  Globals.patterns = await PatternList.load(PatternList);
  Globals.method = await MethodChooser.load(MethodChooser);
  Globals.restart = async () => {
    // tear down any existing event handlers before restarting
    Globals.method.stop();
    TreeBase.treeBaseCounter = 0;
    start();
  };
  Globals.error = new Messages();

  /** @param {() => void} f */
  function debounce(f) {
    let timeout = null;
    return () => {
      if (timeout) window.cancelAnimationFrame(timeout);
      timeout = window.requestAnimationFrame(f);
    };
  }

  /* Designer */
  Globals.state.define("editing", editing); // for now
  Globals.designer = /** @type {Designer} */ (
    Designer.fromObject({
      className: "Designer",
      props: { tabEdge: "top", stateName: "designerTab" },
      children: [
        layout,
        {
          className: "Content",
          props: {},
          children: [],
        },
        Globals.actions,
        Globals.cues,
        Globals.patterns,
        Globals.method,
      ],
    })
  );

  /* ToolBar */
  const toolbar = ToolBar.create("ToolBar", null);
  toolbar.init();

  /* Monitor */
  const monitor = Monitor.create("Monitor", null);
  monitor.init();

  function renderUI() {
    const startTime = performance.now();
    document.body.classList.toggle("designing", Globals.state.get("editing"));
    // clear the changed flag, TODO there must be a better way!
    safeRender("cues", Globals.cues);
    safeRender("UI", Globals.tree);
    safeRender("toolbar", toolbar);
    safeRender("tabs", Globals.designer);
    safeRender("monitor", monitor);
    safeRender("errors", Globals.error);
    postRender();
    Globals.method.refresh();
    // clear the accessed bits for the next cycle
    accessed.clear();
    // clear the updated bits for the next cycle
    Globals.state.clearUpdated();

    if (location.host.startsWith("localhost")) {
      const timer = document.getElementById("timer");
      if (timer) {
        timer.innerText = (performance.now() - startTime).toFixed(0);
      }
    }
    workerCheckForUpdate();
  }
  Globals.state.observe(debounce(renderUI));
  callAfterRender(() => Globals.designer.restoreFocus());
  renderUI();
}

/* Watch for updates happening in other tabs */
const channel = new BroadcastChannel("os-dpi");
/** @param {MessageEvent} event */
channel.onmessage = (event) => {
  const message = /** @type {UpdateNotification} */ (event.data);
  if (db.designName == message.name) {
    if (message.action == "update") {
      start();
    } else if (message.action == "rename" && message.newName) {
      window.location.hash = message.newName;
    } else if (message.action == "unload") {
      window.close();
      if (!window.closed) {
        window.location.hash = "new";
      }
    }
  }
};
db.addUpdateListener((message) => {
  channel.postMessage(message);
});

// watch for changes to the hash such as using the browser back button
window.addEventListener("hashchange", () => {
  sessionStorage.clear();
  start();
});

// watch for window resize and force a redraw
window.addEventListener("resize", () => {
  if (!Globals.state) return;
  Globals.state.update();
});

start();
//# sourceMappingURL=index.js.map
