
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

var util_1 = require("zrender/lib/core/util");

var Series_1 = require("../../model/Series");

var createListFromArray_1 = require("../helper/createListFromArray");

var ParallelSeriesModel = function (_super) {
  tslib_1.__extends(ParallelSeriesModel, _super);

  function ParallelSeriesModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = ParallelSeriesModel.type;
    _this.visualStyleAccessPath = 'lineStyle';
    _this.visualDrawType = 'stroke';
    return _this;
  }

  ParallelSeriesModel.prototype.getInitialData = function (option, ecModel) {
    return createListFromArray_1["default"](this.getSource(), this, {
      useEncodeDefaulter: util_1.bind(makeDefaultEncode, null, this)
    });
  };

  ParallelSeriesModel.prototype.getRawIndicesByActiveState = function (activeState) {
    var coordSys = this.coordinateSystem;
    var data = this.getData();
    var indices = [];
    coordSys.eachActiveState(data, function (theActiveState, dataIndex) {
      if (activeState === theActiveState) {
        indices.push(data.getRawIndex(dataIndex));
      }
    });
    return indices;
  };

  ParallelSeriesModel.type = 'series.parallel';
  ParallelSeriesModel.dependencies = ['parallel'];
  ParallelSeriesModel.defaultOption = {
    zlevel: 0,
    z: 2,
    coordinateSystem: 'parallel',
    parallelIndex: 0,
    label: {
      show: false
    },
    inactiveOpacity: 0.05,
    activeOpacity: 1,
    lineStyle: {
      width: 1,
      opacity: 0.45,
      type: 'solid'
    },
    emphasis: {
      label: {
        show: false
      }
    },
    progressive: 500,
    smooth: false,
    animationEasing: 'linear'
  };
  return ParallelSeriesModel;
}(Series_1["default"]);

Series_1["default"].registerClass(ParallelSeriesModel);

function makeDefaultEncode(seriesModel) {
  var parallelModel = seriesModel.ecModel.getComponent('parallel', seriesModel.get('parallelIndex'));

  if (!parallelModel) {
    return;
  }

  var encodeDefine = {};
  util_1.each(parallelModel.dimensions, function (axisDim) {
    var dataDimIndex = convertDimNameToNumber(axisDim);
    encodeDefine[axisDim] = dataDimIndex;
  });
  return encodeDefine;
}

function convertDimNameToNumber(dimName) {
  return +dimName.replace('dim', '');
}

exports["default"] = ParallelSeriesModel;