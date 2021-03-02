
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

var types_1 = require("../../util/types");

var log_1 = require("../../util/log");

var util_1 = require("zrender/lib/core/util");

var model_1 = require("../../util/model");

var dataValueHelper_1 = require("../../data/helper/dataValueHelper");

var sampleLog = '';

if (process.env.NODE_ENV !== 'production') {
  sampleLog = ['Valid config is like:', '{ dimension: "age", order: "asc" }', 'or [{ dimension: "age", order: "asc"], { dimension: "date", order: "desc" }]'].join(' ');
}

exports.sortTransform = {
  type: 'echarts:sort',
  transform: function (params) {
    var upstream = params.upstream;
    var config = params.config;
    var errMsg = '';
    var orderExprList = model_1.normalizeToArray(config);

    if (!orderExprList.length) {
      if (process.env.NODE_ENV !== 'production') {
        errMsg = 'Empty `config` in sort transform.';
      }

      log_1.throwError(errMsg);
    }

    var orderDefList = [];
    util_1.each(orderExprList, function (orderExpr) {
      var dimLoose = orderExpr.dimension;
      var order = orderExpr.order;
      var parserName = orderExpr.parser;
      var incomparable = orderExpr.incomparable;

      if (dimLoose == null) {
        if (process.env.NODE_ENV !== 'production') {
          errMsg = 'Sort transform config must has "dimension" specified.' + sampleLog;
        }

        log_1.throwError(errMsg);
      }

      if (order !== 'asc' && order !== 'desc') {
        if (process.env.NODE_ENV !== 'production') {
          errMsg = 'Sort transform config must has "order" specified.' + sampleLog;
        }

        log_1.throwError(errMsg);
      }

      if (incomparable && incomparable !== 'min' && incomparable !== 'max') {
        var errMsg_1 = '';

        if (process.env.NODE_ENV !== 'production') {
          errMsg_1 = 'incomparable must be "min" or "max" rather than "' + incomparable + '".';
        }

        log_1.throwError(errMsg_1);
      }

      if (order !== 'asc' && order !== 'desc') {
        var errMsg_2 = '';

        if (process.env.NODE_ENV !== 'production') {
          errMsg_2 = 'order must be "asc" or "desc" rather than "' + order + '".';
        }

        log_1.throwError(errMsg_2);
      }

      var dimInfo = upstream.getDimensionInfo(dimLoose);

      if (!dimInfo) {
        if (process.env.NODE_ENV !== 'production') {
          errMsg = log_1.makePrintable('Can not find dimension info via: ' + dimLoose + '.\n', 'Existing dimensions: ', upstream.cloneAllDimensionInfo(), '.\n', 'Illegal config:', orderExpr, '.\n');
        }

        log_1.throwError(errMsg);
      }

      var parser = parserName ? dataValueHelper_1.getRawValueParser(parserName) : null;

      if (parserName && !parser) {
        if (process.env.NODE_ENV !== 'production') {
          errMsg = log_1.makePrintable('Invalid parser name ' + parserName + '.\n', 'Illegal config:', orderExpr, '.\n');
        }

        log_1.throwError(errMsg);
      }

      orderDefList.push({
        dimIdx: dimInfo.index,
        parser: parser,
        comparator: new dataValueHelper_1.SortOrderComparator(order, incomparable)
      });
    });
    var sourceFormat = upstream.sourceFormat;

    if (sourceFormat !== types_1.SOURCE_FORMAT_ARRAY_ROWS && sourceFormat !== types_1.SOURCE_FORMAT_OBJECT_ROWS) {
      if (process.env.NODE_ENV !== 'production') {
        errMsg = 'sourceFormat "' + sourceFormat + '" is not supported yet';
      }

      log_1.throwError(errMsg);
    }

    var resultData = [];

    for (var i = 0, len = upstream.count(); i < len; i++) {
      resultData.push(upstream.getRawDataItem(i));
    }

    resultData.sort(function (item0, item1) {
      for (var i = 0; i < orderDefList.length; i++) {
        var orderDef = orderDefList[i];
        var val0 = upstream.retrieveValueFromItem(item0, orderDef.dimIdx);
        var val1 = upstream.retrieveValueFromItem(item1, orderDef.dimIdx);

        if (orderDef.parser) {
          val0 = orderDef.parser(val0);
          val1 = orderDef.parser(val1);
        }

        var result = orderDef.comparator.evaluate(val0, val1);

        if (result !== 0) {
          return result;
        }
      }

      return 0;
    });
    return {
      data: resultData
    };
  }
};