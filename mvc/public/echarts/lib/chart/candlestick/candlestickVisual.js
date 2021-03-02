
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

var createRenderPlanner_1 = require("../helper/createRenderPlanner");

var util_1 = require("zrender/lib/core/util");

var positiveBorderColorQuery = ['itemStyle', 'borderColor'];
var negativeBorderColorQuery = ['itemStyle', 'borderColor0'];
var positiveColorQuery = ['itemStyle', 'color'];
var negativeColorQuery = ['itemStyle', 'color0'];
var candlestickVisual = {
  seriesType: 'candlestick',
  plan: createRenderPlanner_1["default"](),
  performRawSeries: true,
  reset: function (seriesModel, ecModel) {
    function getColor(sign, model) {
      return model.get(sign > 0 ? positiveColorQuery : negativeColorQuery);
    }

    function getBorderColor(sign, model) {
      return model.get(sign > 0 ? positiveBorderColorQuery : negativeBorderColorQuery);
    }

    var data = seriesModel.getData();
    data.setVisual('legendSymbol', 'roundRect');

    if (ecModel.isSeriesFiltered(seriesModel)) {
      return;
    }

    var isLargeRender = seriesModel.pipelineContext.large;
    return !isLargeRender && {
      progress: function (params, data) {
        var dataIndex;

        while ((dataIndex = params.next()) != null) {
          var itemModel = data.getItemModel(dataIndex);
          var sign = data.getItemLayout(dataIndex).sign;
          var style = itemModel.getItemStyle();
          style.fill = getColor(sign, itemModel);
          style.stroke = getBorderColor(sign, itemModel) || style.fill;
          var existsStyle = data.ensureUniqueItemVisual(dataIndex, 'style');
          util_1.extend(existsStyle, style);
        }
      }
    };
  }
};
exports["default"] = candlestickVisual;