
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/



/**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */

"use strict";

exports.__esModule = true;

var util_1 = require("zrender/lib/core/util");

var ECHARTS_PREFIX = '[ECharts] ';
var storedLogs = {};
var hasConsole = typeof console !== 'undefined' && console.warn && console.log;

function log(str) {
  if (hasConsole) {
    console.log(ECHARTS_PREFIX + str);
  }
}

exports.log = log;

function warn(str) {
  if (hasConsole) {
    console.warn(ECHARTS_PREFIX + str);
  }
}

exports.warn = warn;

function error(str) {
  if (hasConsole) {
    console.error(ECHARTS_PREFIX + str);
  }
}

exports.error = error;

function deprecateLog(str) {
  if (process.env.NODE_ENV !== 'production') {
    if (storedLogs[str]) {
      return;
    }

    if (hasConsole) {
      storedLogs[str] = true;
      console.warn(ECHARTS_PREFIX + 'DEPRECATED: ' + str);
    }
  }
}

exports.deprecateLog = deprecateLog;

function deprecateReplaceLog(oldOpt, newOpt, scope) {
  if (process.env.NODE_ENV !== 'production') {
    deprecateLog((scope ? "[" + scope + "]" : '') + (oldOpt + " is deprecated, use " + newOpt + " instead."));
  }
}

exports.deprecateReplaceLog = deprecateReplaceLog;

function consoleLog() {
  var args = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }

  if (process.env.NODE_ENV !== 'production') {
    if (typeof console !== 'undefined' && console.log) {
      console.log.apply(console, args);
    }
  }
}

exports.consoleLog = consoleLog;

function makePrintable() {
  var hintInfo = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    hintInfo[_i] = arguments[_i];
  }

  var msg = '';

  if (process.env.NODE_ENV !== 'production') {
    var makePrintableStringIfPossible_1 = function (val) {
      return val === void 0 ? 'undefined' : val === Infinity ? 'Infinity' : val === -Infinity ? '-Infinity' : util_1.eqNaN(val) ? 'NaN' : val instanceof Date ? 'Date(' + val.toISOString() + ')' : util_1.isFunction(val) ? 'function () { ... }' : util_1.isRegExp(val) ? val + '' : null;
    };

    msg = util_1.map(hintInfo, function (arg) {
      if (util_1.isString(arg)) {
        return arg;
      } else {
        var printableStr = makePrintableStringIfPossible_1(arg);

        if (printableStr != null) {
          return printableStr;
        } else if (typeof JSON !== 'undefined' && JSON.stringify) {
          try {
            return JSON.stringify(arg, function (n, val) {
              var printableStr = makePrintableStringIfPossible_1(val);
              return printableStr == null ? val : printableStr;
            });
          } catch (err) {
            return '?';
          }
        } else {
          return '?';
        }
      }
    }).join(' ');
  }

  return msg;
}

exports.makePrintable = makePrintable;

function throwError(msg) {
  throw new Error(msg);
}

exports.throwError = throwError;