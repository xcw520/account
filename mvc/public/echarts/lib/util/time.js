
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

var numberUtil = require("./number");

var locale_1 = require("../locale");

var Model_1 = require("../model/Model");

exports.ONE_SECOND = 1000;
exports.ONE_MINUTE = exports.ONE_SECOND * 60;
exports.ONE_HOUR = exports.ONE_MINUTE * 60;
exports.ONE_DAY = exports.ONE_HOUR * 24;
exports.ONE_YEAR = exports.ONE_DAY * 365;
exports.defaultLeveledFormatter = {
  year: '{yyyy}',
  month: '{MMM}',
  day: '{d}',
  hour: '{HH}:{mm}',
  minute: '{HH}:{mm}',
  second: '{HH}:{mm}:{ss}',
  millisecond: '{hh}:{mm}:{ss} {SSS}',
  none: '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss} {SSS}'
};
var fullDayFormatter = '{yyyy}-{MM}-{dd}';
exports.fullLeveledFormatter = {
  year: '{yyyy}',
  month: '{yyyy}-{MM}',
  day: fullDayFormatter,
  hour: fullDayFormatter + ' ' + exports.defaultLeveledFormatter.hour,
  minute: fullDayFormatter + ' ' + exports.defaultLeveledFormatter.minute,
  second: fullDayFormatter + ' ' + exports.defaultLeveledFormatter.second,
  millisecond: exports.defaultLeveledFormatter.none
};
exports.primaryTimeUnits = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
exports.timeUnits = ['year', 'half-year', 'quarter', 'month', 'week', 'half-week', 'day', 'half-day', 'quarter-day', 'hour', 'minute', 'second', 'millisecond'];

function pad(str, len) {
  str += '';
  return '0000'.substr(0, len - str.length) + str;
}

exports.pad = pad;

function getPrimaryTimeUnit(timeUnit) {
  switch (timeUnit) {
    case 'half-year':
    case 'quarter':
      return 'month';

    case 'week':
    case 'half-week':
      return 'day';

    case 'half-day':
    case 'quarter-day':
      return 'hour';

    default:
      return timeUnit;
  }
}

exports.getPrimaryTimeUnit = getPrimaryTimeUnit;

function isPrimaryTimeUnit(timeUnit) {
  return timeUnit === getPrimaryTimeUnit(timeUnit);
}

exports.isPrimaryTimeUnit = isPrimaryTimeUnit;

function getDefaultFormatPrecisionOfInterval(timeUnit) {
  switch (timeUnit) {
    case 'year':
    case 'month':
      return 'day';

    case 'millisecond':
      return 'millisecond';

    default:
      return 'second';
  }
}

exports.getDefaultFormatPrecisionOfInterval = getDefaultFormatPrecisionOfInterval;

function format(time, template, isUTC, lang) {
  var date = numberUtil.parseDate(time);
  var y = date[fullYearGetterName(isUTC)]();
  var M = date[monthGetterName(isUTC)]() + 1;
  var q = Math.floor((M - 1) / 4) + 1;
  var d = date[dateGetterName(isUTC)]();
  var e = date['get' + (isUTC ? 'UTC' : '') + 'Day']();
  var H = date[hoursGetterName(isUTC)]();
  var h = (H - 1) % 12 + 1;
  var m = date[minutesGetterName(isUTC)]();
  var s = date[secondsGetterName(isUTC)]();
  var S = date[millisecondsGetterName(isUTC)]();
  var localeModel = lang instanceof Model_1["default"] ? lang : locale_1.getLocaleModel(lang || locale_1.SYSTEM_LANG) || locale_1.getDefaultLocaleModel();
  var timeModel = localeModel.getModel('time');
  var month = timeModel.get('month');
  var monthAbbr = timeModel.get('monthAbbr');
  var dayOfWeek = timeModel.get('dayOfWeek');
  var dayOfWeekAbbr = timeModel.get('dayOfWeekAbbr');
  return (template || '').replace(/{yyyy}/g, y + '').replace(/{yy}/g, y % 100 + '').replace(/{Q}/g, q + '').replace(/{MMMM}/g, month[M - 1]).replace(/{MMM}/g, monthAbbr[M - 1]).replace(/{MM}/g, pad(M, 2)).replace(/{M}/g, M + '').replace(/{dd}/g, pad(d, 2)).replace(/{d}/g, d + '').replace(/{eeee}/g, dayOfWeek[e]).replace(/{ee}/g, dayOfWeekAbbr[e]).replace(/{e}/g, e + '').replace(/{HH}/g, pad(H, 2)).replace(/{H}/g, H + '').replace(/{hh}/g, pad(h + '', 2)).replace(/{h}/g, h + '').replace(/{mm}/g, pad(m, 2)).replace(/{m}/g, m + '').replace(/{ss}/g, pad(s, 2)).replace(/{s}/g, s + '').replace(/{SSS}/g, pad(S, 3)).replace(/{S}/g, S + '');
}

exports.format = format;

function leveledFormat(tick, idx, formatter, lang, isUTC) {
  var template = null;

  if (typeof formatter === 'string') {
    template = formatter;
  } else if (typeof formatter === 'function') {
    template = formatter(tick.value, idx, {
      level: tick.level
    });
  } else {
    var defaults = zrUtil.extend({}, exports.defaultLeveledFormatter);

    if (tick.level > 0) {
      for (var i = 0; i < exports.primaryTimeUnits.length; ++i) {
        defaults[exports.primaryTimeUnits[i]] = "{primary|" + defaults[exports.primaryTimeUnits[i]] + "}";
      }
    }

    var mergedFormatter = formatter ? formatter.inherit === false ? formatter : zrUtil.defaults(formatter, defaults) : defaults;
    var unit = getUnitFromValue(tick.value, isUTC);

    if (mergedFormatter[unit]) {
      template = mergedFormatter[unit];
    } else if (mergedFormatter.inherit) {
      var targetId = exports.timeUnits.indexOf(unit);

      for (var i = targetId - 1; i >= 0; --i) {
        if (mergedFormatter[unit]) {
          template = mergedFormatter[unit];
          break;
        }
      }

      template = template || defaults.none;
    }

    if (zrUtil.isArray(template)) {
      var levelId = tick.level == null ? 0 : tick.level >= 0 ? tick.level : template.length + tick.level;
      levelId = Math.min(levelId, template.length - 1);
      template = template[levelId];
    }
  }

  return format(new Date(tick.value), template, isUTC, lang);
}

exports.leveledFormat = leveledFormat;

function getUnitFromValue(value, isUTC) {
  var date = numberUtil.parseDate(value);
  var M = date[monthGetterName(isUTC)]() + 1;
  var d = date[dateGetterName(isUTC)]();
  var h = date[hoursGetterName(isUTC)]();
  var m = date[minutesGetterName(isUTC)]();
  var s = date[secondsGetterName(isUTC)]();
  var S = date[millisecondsGetterName(isUTC)]();
  var isSecond = S === 0;
  var isMinute = isSecond && s === 0;
  var isHour = isMinute && m === 0;
  var isDay = isHour && h === 0;
  var isMonth = isDay && d === 1;
  var isYear = isMonth && M === 1;

  if (isYear) {
    return 'year';
  } else if (isMonth) {
    return 'month';
  } else if (isDay) {
    return 'day';
  } else if (isHour) {
    return 'hour';
  } else if (isMinute) {
    return 'minute';
  } else if (isSecond) {
    return 'second';
  } else {
    return 'millisecond';
  }
}

exports.getUnitFromValue = getUnitFromValue;

function getUnitValue(value, unit, isUTC) {
  var date = typeof value === 'number' ? numberUtil.parseDate(value) : value;
  unit = unit || getUnitFromValue(value, isUTC);

  switch (unit) {
    case 'year':
      return date[fullYearGetterName(isUTC)]();

    case 'half-year':
      return date[monthGetterName(isUTC)]() >= 6 ? 1 : 0;

    case 'quarter':
      return Math.floor((date[monthGetterName(isUTC)]() + 1) / 4);

    case 'month':
      return date[monthGetterName(isUTC)]();

    case 'day':
      return date[dateGetterName(isUTC)]();

    case 'half-day':
      return date[hoursGetterName(isUTC)]() / 24;

    case 'hour':
      return date[hoursGetterName(isUTC)]();

    case 'minute':
      return date[minutesGetterName(isUTC)]();

    case 'second':
      return date[secondsGetterName(isUTC)]();

    case 'millisecond':
      return date[millisecondsGetterName(isUTC)]();
  }
}

exports.getUnitValue = getUnitValue;

function fullYearGetterName(isUTC) {
  return isUTC ? 'getUTCFullYear' : 'getFullYear';
}

exports.fullYearGetterName = fullYearGetterName;

function monthGetterName(isUTC) {
  return isUTC ? 'getUTCMonth' : 'getMonth';
}

exports.monthGetterName = monthGetterName;

function dateGetterName(isUTC) {
  return isUTC ? 'getUTCDate' : 'getDate';
}

exports.dateGetterName = dateGetterName;

function hoursGetterName(isUTC) {
  return isUTC ? 'getUTCHours' : 'getHours';
}

exports.hoursGetterName = hoursGetterName;

function minutesGetterName(isUTC) {
  return isUTC ? 'getUTCMinutes' : 'getMinutes';
}

exports.minutesGetterName = minutesGetterName;

function secondsGetterName(isUTC) {
  return isUTC ? 'getUTCSeconds' : 'getSeconds';
}

exports.secondsGetterName = secondsGetterName;

function millisecondsGetterName(isUTC) {
  return isUTC ? 'getUTCSeconds' : 'getSeconds';
}

exports.millisecondsGetterName = millisecondsGetterName;

function fullYearSetterName(isUTC) {
  return isUTC ? 'setUTCFullYear' : 'setFullYear';
}

exports.fullYearSetterName = fullYearSetterName;

function monthSetterName(isUTC) {
  return isUTC ? 'setUTCMonth' : 'setMonth';
}

exports.monthSetterName = monthSetterName;

function dateSetterName(isUTC) {
  return isUTC ? 'setUTCDate' : 'setDate';
}

exports.dateSetterName = dateSetterName;

function hoursSetterName(isUTC) {
  return isUTC ? 'setUTCHours' : 'setHours';
}

exports.hoursSetterName = hoursSetterName;

function minutesSetterName(isUTC) {
  return isUTC ? 'setUTCMinutes' : 'setMinutes';
}

exports.minutesSetterName = minutesSetterName;

function secondsSetterName(isUTC) {
  return isUTC ? 'setUTCSeconds' : 'setSeconds';
}

exports.secondsSetterName = secondsSetterName;

function millisecondsSetterName(isUTC) {
  return isUTC ? 'setUTCSeconds' : 'setSeconds';
}

exports.millisecondsSetterName = millisecondsSetterName;