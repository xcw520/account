
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

var tslib_1 = require("tslib");

var zrUtil = require("zrender/lib/core/util");

var createListSimply_1 = require("../helper/createListSimply");

var model_1 = require("../../util/model");

var sourceHelper_1 = require("../../data/helper/sourceHelper");

var LegendVisualProvider_1 = require("../../visual/LegendVisualProvider");

var Series_1 = require("../../model/Series");

var Component_1 = require("../../model/Component");

var FunnelSeriesModel = function (_super) {
  tslib_1.__extends(FunnelSeriesModel, _super);

  function FunnelSeriesModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = FunnelSeriesModel.type;
    _this.useColorPaletteOnData = true;
    return _this;
  }

  FunnelSeriesModel.prototype.init = function (option) {
    _super.prototype.init.apply(this, arguments);

    this.legendVisualProvider = new LegendVisualProvider_1["default"](zrUtil.bind(this.getData, this), zrUtil.bind(this.getRawData, this));

    this._defaultLabelLine(option);
  };

  FunnelSeriesModel.prototype.getInitialData = function (option, ecModel) {
    return createListSimply_1["default"](this, {
      coordDimensions: ['value'],
      encodeDefaulter: zrUtil.curry(sourceHelper_1.makeSeriesEncodeForNameBased, this)
    });
  };

  FunnelSeriesModel.prototype._defaultLabelLine = function (option) {
    model_1.defaultEmphasis(option, 'labelLine', ['show']);
    var labelLineNormalOpt = option.labelLine;
    var labelLineEmphasisOpt = option.emphasis.labelLine;
    labelLineNormalOpt.show = labelLineNormalOpt.show && option.label.show;
    labelLineEmphasisOpt.show = labelLineEmphasisOpt.show && option.emphasis.label.show;
  };

  FunnelSeriesModel.prototype.getDataParams = function (dataIndex) {
    var data = this.getData();

    var params = _super.prototype.getDataParams.call(this, dataIndex);

    var valueDim = data.mapDimension('value');
    var sum = data.getSum(valueDim);
    params.percent = !sum ? 0 : +(data.get(valueDim, dataIndex) / sum * 100).toFixed(2);
    params.$vars.push('percent');
    return params;
  };

  FunnelSeriesModel.type = 'series.funnel';
  FunnelSeriesModel.defaultOption = {
    zlevel: 0,
    z: 2,
    legendHoverLink: true,
    left: 80,
    top: 60,
    right: 80,
    bottom: 60,
    minSize: '0%',
    maxSize: '100%',
    sort: 'descending',
    orient: 'vertical',
    gap: 0,
    funnelAlign: 'center',
    label: {
      show: true,
      position: 'outer'
    },
    labelLine: {
      show: true,
      length: 20,
      lineStyle: {
        width: 1
      }
    },
    itemStyle: {
      borderColor: '#fff',
      borderWidth: 1
    },
    emphasis: {
      label: {
        show: true
      }
    },
    select: {
      itemStyle: {
        borderColor: '#212121'
      }
    }
  };
  return FunnelSeriesModel;
}(Series_1["default"]);

Component_1["default"].registerClass(FunnelSeriesModel);
exports["default"] = FunnelSeriesModel;