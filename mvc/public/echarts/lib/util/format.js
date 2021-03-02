
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

var zrUtil = require("zrender/lib/core/util");

var number_1 = require("./number");

var time_1 = require("./time");

var log_1 = require("./log");

function addCommas(x) {
  if (!number_1.isNumeric(x)) {
    return zrUtil.isString(x) ? x : '-';
  }

  var parts = (x + '').split('.');
  return parts[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + (parts.length > 1 ? '.' + parts[1] : '');
}

exports.addCommas = addCommas;

function toCamelCase(str, upperCaseFirst) {
  str = (str || '').toLowerCase().replace(/-(.)/g, function (match, group1) {
    return group1.toUpperCase();
  });

  if (upperCaseFirst && str) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
  }

  return str;
}

exports.toCamelCase = toCamelCase;
exports.normalizeCssArray = zrUtil.normalizeCssArray;
var replaceReg = /([&<>"'])/g;
var replaceMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;'
};

function encodeHTML(source) {
  return source == null ? '' : (source + '').replace(replaceReg, function (str, c) {
    return replaceMap[c];
  });
}

exports.encodeHTML = encodeHTML;

function makeValueReadable(value, valueType, useUTC) {
  var USER_READABLE_DEFUALT_TIME_PATTERN = 'yyyy-MM-dd hh:mm:ss';

  function stringToUserReadable(str) {
    return str && zrUtil.trim(str) ? str : '-';
  }

  function isNumberUserReadable(num) {
    return !!(num != null && !isNaN(num) && isFinite(num));
  }

  var isTypeTime = valueType === 'time';
  var isValueDate = value instanceof Date;

  if (isTypeTime || isValueDate) {
    var date = isTypeTime ? number_1.parseDate(value) : value;

    if (!isNaN(+date)) {
      return time_1.format(date, USER_READABLE_DEFUALT_TIME_PATTERN, useUTC);
    } else if (isValueDate) {
      return '-';
    }
  }

  if (valueType === 'ordinal') {
    return zrUtil.isStringSafe(value) ? stringToUserReadable(value) : zrUtil.isNumber(value) ? isNumberUserReadable(value) ? value + '' : '-' : '-';
  }

  var numericResult = number_1.numericToNumber(value);
  return isNumberUserReadable(numericResult) ? addCommas(numericResult) : zrUtil.isStringSafe(value) ? stringToUserReadable(value) : '-';
}

exports.makeValueReadable = makeValueReadable;
var TPL_VAR_ALIAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

var wrapVar = function (varName, seriesIdx) {
  return '{' + varName + (seriesIdx == null ? '' : seriesIdx) + '}';
};

function formatTpl(tpl, paramsList, encode) {
  if (!zrUtil.isArray(paramsList)) {
    paramsList = [paramsList];
  }

  var seriesLen = paramsList.length;

  if (!seriesLen) {
    return '';
  }

  var $vars = paramsList[0].$vars || [];

  for (var i = 0; i < $vars.length; i++) {
    var alias = TPL_VAR_ALIAS[i];
    tpl = tpl.replace(wrapVar(alias), wrapVar(alias, 0));
  }

  for (var seriesIdx = 0; seriesIdx < seriesLen; seriesIdx++) {
    for (var k = 0; k < $vars.length; k++) {
      var val = paramsList[seriesIdx][$vars[k]];
      tpl = tpl.replace(wrapVar(TPL_VAR_ALIAS[k], seriesIdx), encode ? encodeHTML(val) : val);
    }
  }

  return tpl;
}

exports.formatTpl = formatTpl;

function formatTplSimple(tpl, param, encode) {
  zrUtil.each(param, function (value, key) {
    tpl = tpl.replace('{' + key + '}', encode ? encodeHTML(value) : value);
  });
  return tpl;
}

exports.formatTplSimple = formatTplSimple;

function getTooltipMarker(inOpt, extraCssText) {
  var opt = zrUtil.isString(inOpt) ? {
    color: inOpt,
    extraCssText: extraCssText
  } : inOpt || {};
  var color = opt.color;
  var type = opt.type;
  extraCssText = opt.extraCssText;
  var renderMode = opt.renderMode || 'html';

  if (!color) {
    return '';
  }

  if (renderMode === 'html') {
    return type === 'subItem' ? '<span style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;' + 'border-radius:4px;width:4px;height:4px;background-color:' + encodeHTML(color) + ';' + (extraCssText || '') + '"></span>' : '<span style="display:inline-block;margin-right:4px;' + 'border-radius:10px;width:10px;height:10px;background-color:' + encodeHTML(color) + ';' + (extraCssText || '') + '"></span>';
  } else {
    var markerId = opt.markerId || 'markerX';
    return {
      renderMode: renderMode,
      content: '{' + markerId + '|}  ',
      style: type === 'subItem' ? {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: color
      } : {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: color
      }
    };
  }
}

exports.getTooltipMarker = getTooltipMarker;

function formatTime(tpl, value, isUTC) {
  if (process.env.NODE_ENV !== 'production') {
    log_1.deprecateReplaceLog('echarts.format.formatTime', 'echarts.time.format');
  }

  if (tpl === 'week' || tpl === 'month' || tpl === 'quarter' || tpl === 'half-year' || tpl === 'year') {
    tpl = 'MM-dd\nyyyy';
  }

  var date = number_1.parseDate(value);
  var utc = isUTC ? 'UTC' : '';
  var y = date['get' + utc + 'FullYear']();
  var M = date['get' + utc + 'Month']() + 1;
  var d = date['get' + utc + 'Date']();
  var h = date['get' + utc + 'Hours']();
  var m = date['get' + utc + 'Minutes']();
  var s = date['get' + utc + 'Seconds']();
  var S = date['get' + utc + 'Milliseconds']();
  tpl = tpl.replace('MM', time_1.pad(M, 2)).replace('M', M).replace('yyyy', y).replace('yy', y % 100 + '').replace('dd', time_1.pad(d, 2)).replace('d', d).replace('hh', time_1.pad(h, 2)).replace('h', h).replace('mm', time_1.pad(m, 2)).replace('m', m).replace('ss', time_1.pad(s, 2)).replace('s', s).replace('SSS', time_1.pad(S, 3));
  return tpl;
}

exports.formatTime = formatTime;

function capitalFirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.substr(1) : str;
}

exports.capitalFirst = capitalFirst;

function convertToColorString(color, defaultColor) {
  defaultColor = defaultColor || 'transparent';
  return zrUtil.isString(color) ? color : zrUtil.isObject(color) ? color.colorStops && (color.colorStops[0] || {}).color || defaultColor : defaultColor;
}

exports.convertToColorString = convertToColorString;

var parseText_1 = require("zrender/lib/graphic/helper/parseText");

exports.truncateText = parseText_1.truncateText;

function windowOpen(link, target) {
  if (target === '_blank' || target === 'blank') {
    var blank = window.open();
    blank.opener = null;
    blank.location.href = link;
  } else {
    window.open(link, target);
  }
}

exports.windowOpen = windowOpen;

var getTextRect_1 = require("../legacy/getTextRect");

exports.getTextRect = getTextRect_1.getTextRect;