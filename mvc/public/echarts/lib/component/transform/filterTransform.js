
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

var conditionalExpression_1 = require("../../util/conditionalExpression");

var util_1 = require("zrender/lib/core/util");

var log_1 = require("../../util/log");

exports.filterTransform = {
  type: 'echarts:filter',
  transform: function (params) {
    var upstream = params.upstream;
    var rawItem;
    var condition = conditionalExpression_1.parseConditionalExpression(params.config, {
      valueGetterAttrMap: util_1.createHashMap({
        dimension: true
      }),
      prepareGetValue: function (exprOption) {
        var errMsg = '';
        var dimLoose = exprOption.dimension;

        if (!util_1.hasOwn(exprOption, 'dimension')) {
          if (process.env.NODE_ENV !== 'production') {
            errMsg = log_1.makePrintable('Relation condition must has prop "dimension" specified.', 'Illegal condition:', exprOption);
          }

          log_1.throwError(errMsg);
        }

        var dimInfo = upstream.getDimensionInfo(dimLoose);

        if (!dimInfo) {
          if (process.env.NODE_ENV !== 'production') {
            errMsg = log_1.makePrintable('Can not find dimension info via: ' + dimLoose + '.\n', 'Existing dimensions: ', upstream.cloneAllDimensionInfo(), '.\n', 'Illegal condition:', exprOption, '.\n');
          }

          log_1.throwError(errMsg);
        }

        return {
          dimIdx: dimInfo.index
        };
      },
      getValue: function (param) {
        return upstream.retrieveValueFromItem(rawItem, param.dimIdx);
      }
    });
    var resultData = [];

    for (var i = 0, len = upstream.count(); i < len; i++) {
      rawItem = upstream.getRawDataItem(i);

      if (condition.evaluate()) {
        resultData.push(rawItem);
      }
    }

    return {
      data: resultData
    };
  }
};