
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

var number_1 = require("../../util/number");

var util_1 = require("zrender/lib/core/util");

var log_1 = require("../../util/log");

function parseDataValue(value, opt) {
  var dimType = opt && opt.type;

  if (dimType === 'ordinal') {
    var ordinalMeta = opt && opt.ordinalMeta;
    return ordinalMeta ? ordinalMeta.parseAndCollect(value) : value;
  }

  if (dimType === 'time' && typeof value !== 'number' && value != null && value !== '-') {
    value = +number_1.parseDate(value);
  }

  return value == null || value === '' ? NaN : +value;
}

exports.parseDataValue = parseDataValue;
;
var valueParserMap = util_1.createHashMap({
  'number': function (val) {
    return parseFloat(val);
  },
  'time': function (val) {
    return +number_1.parseDate(val);
  },
  'trim': function (val) {
    return typeof val === 'string' ? util_1.trim(val) : val;
  }
});

function getRawValueParser(type) {
  return valueParserMap.get(type);
}

exports.getRawValueParser = getRawValueParser;
var ORDER_COMPARISON_OP_MAP = {
  lt: function (lval, rval) {
    return lval < rval;
  },
  lte: function (lval, rval) {
    return lval <= rval;
  },
  gt: function (lval, rval) {
    return lval > rval;
  },
  gte: function (lval, rval) {
    return lval >= rval;
  }
};

var FilterOrderComparator = function () {
  function FilterOrderComparator(op, rval) {
    if (typeof rval !== 'number') {
      var errMsg = '';

      if (process.env.NODE_ENV !== 'production') {
        errMsg = 'rvalue of "<", ">", "<=", ">=" can only be number in filter.';
      }

      log_1.throwError(errMsg);
    }

    this._opFn = ORDER_COMPARISON_OP_MAP[op];
    this._rvalFloat = number_1.numericToNumber(rval);
  }

  FilterOrderComparator.prototype.evaluate = function (lval) {
    return typeof lval === 'number' ? this._opFn(lval, this._rvalFloat) : this._opFn(number_1.numericToNumber(lval), this._rvalFloat);
  };

  return FilterOrderComparator;
}();

var SortOrderComparator = function () {
  function SortOrderComparator(order, incomparable) {
    var isDesc = order === 'desc';
    this._resultLT = isDesc ? 1 : -1;

    if (incomparable == null) {
      incomparable = isDesc ? 'min' : 'max';
    }

    this._incomparable = incomparable === 'min' ? -Infinity : Infinity;
  }

  SortOrderComparator.prototype.evaluate = function (lval, rval) {
    var lvalTypeof = typeof lval;
    var rvalTypeof = typeof rval;
    var lvalFloat = lvalTypeof === 'number' ? lval : number_1.numericToNumber(lval);
    var rvalFloat = rvalTypeof === 'number' ? rval : number_1.numericToNumber(rval);
    var lvalNotNumeric = isNaN(lvalFloat);
    var rvalNotNumeric = isNaN(rvalFloat);

    if (lvalNotNumeric) {
      lvalFloat = this._incomparable;
    }

    if (rvalNotNumeric) {
      rvalFloat = this._incomparable;
    }

    if (lvalNotNumeric && rvalNotNumeric) {
      var lvalIsStr = lvalTypeof === 'string';
      var rvalIsStr = rvalTypeof === 'string';

      if (lvalIsStr) {
        lvalFloat = rvalIsStr ? lval : 0;
      }

      if (rvalIsStr) {
        rvalFloat = lvalIsStr ? rval : 0;
      }
    }

    return lvalFloat < rvalFloat ? this._resultLT : lvalFloat > rvalFloat ? -this._resultLT : 0;
  };

  return SortOrderComparator;
}();

exports.SortOrderComparator = SortOrderComparator;

var FilterEqualityComparator = function () {
  function FilterEqualityComparator(isEq, rval) {
    this._rval = rval;
    this._isEQ = isEq;
    this._rvalTypeof = typeof rval;
    this._rvalFloat = number_1.numericToNumber(rval);
  }

  FilterEqualityComparator.prototype.evaluate = function (lval) {
    var eqResult = lval === this._rval;

    if (!eqResult) {
      var lvalTypeof = typeof lval;

      if (lvalTypeof !== this._rvalTypeof && (lvalTypeof === 'number' || this._rvalTypeof === 'number')) {
        eqResult = number_1.numericToNumber(lval) === this._rvalFloat;
      }
    }

    return this._isEQ ? eqResult : !eqResult;
  };

  return FilterEqualityComparator;
}();

function createFilterComparator(op, rval) {
  return op === 'eq' || op === 'ne' ? new FilterEqualityComparator(op === 'eq', rval) : util_1.hasOwn(ORDER_COMPARISON_OP_MAP, op) ? new FilterOrderComparator(op, rval) : null;
}

exports.createFilterComparator = createFilterComparator;