
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

var createListSimply_1 = require("../helper/createListSimply");

var zrUtil = require("zrender/lib/core/util");

var dimensionHelper_1 = require("../../data/helper/dimensionHelper");

var sourceHelper_1 = require("../../data/helper/sourceHelper");

var WhiskerBoxCommonMixin = function () {
  function WhiskerBoxCommonMixin() {}

  WhiskerBoxCommonMixin.prototype.getInitialData = function (option, ecModel) {
    var ordinalMeta;
    var xAxisModel = ecModel.getComponent('xAxis', this.get('xAxisIndex'));
    var yAxisModel = ecModel.getComponent('yAxis', this.get('yAxisIndex'));
    var xAxisType = xAxisModel.get('type');
    var yAxisType = yAxisModel.get('type');
    var addOrdinal;

    if (xAxisType === 'category') {
      option.layout = 'horizontal';
      ordinalMeta = xAxisModel.getOrdinalMeta();
      addOrdinal = true;
    } else if (yAxisType === 'category') {
      option.layout = 'vertical';
      ordinalMeta = yAxisModel.getOrdinalMeta();
      addOrdinal = true;
    } else {
      option.layout = option.layout || 'horizontal';
    }

    var coordDims = ['x', 'y'];
    var baseAxisDimIndex = option.layout === 'horizontal' ? 0 : 1;
    var baseAxisDim = this._baseAxisDim = coordDims[baseAxisDimIndex];
    var otherAxisDim = coordDims[1 - baseAxisDimIndex];
    var axisModels = [xAxisModel, yAxisModel];
    var baseAxisType = axisModels[baseAxisDimIndex].get('type');
    var otherAxisType = axisModels[1 - baseAxisDimIndex].get('type');
    var data = option.data;

    if (data && addOrdinal) {
      var newOptionData_1 = [];
      zrUtil.each(data, function (item, index) {
        var newItem;

        if (zrUtil.isArray(item)) {
          newItem = item.slice();
          item.unshift(index);
        } else if (zrUtil.isArray(item.value)) {
          newItem = item.value.slice();
          item.value.unshift(index);
        } else {
          newItem = item;
        }

        newOptionData_1.push(newItem);
      });
      option.data = newOptionData_1;
    }

    var defaultValueDimensions = this.defaultValueDimensions;
    var coordDimensions = [{
      name: baseAxisDim,
      type: dimensionHelper_1.getDimensionTypeByAxis(baseAxisType),
      ordinalMeta: ordinalMeta,
      otherDims: {
        tooltip: false,
        itemName: 0
      },
      dimsDef: ['base']
    }, {
      name: otherAxisDim,
      type: dimensionHelper_1.getDimensionTypeByAxis(otherAxisType),
      dimsDef: defaultValueDimensions.slice()
    }];
    return createListSimply_1["default"](this, {
      coordDimensions: coordDimensions,
      dimensionsCount: defaultValueDimensions.length + 1,
      encodeDefaulter: zrUtil.curry(sourceHelper_1.makeSeriesEncodeForAxisCoordSys, coordDimensions, this)
    });
  };

  WhiskerBoxCommonMixin.prototype.getBaseAxis = function () {
    var dim = this._baseAxisDim;
    return this.ecModel.getComponent(dim + 'Axis', this.get(dim + 'AxisIndex')).axis;
  };

  return WhiskerBoxCommonMixin;
}();

exports.WhiskerBoxCommonMixin = WhiskerBoxCommonMixin;
;