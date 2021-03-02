
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

var axisDefault_1 = require("../axisDefault");

var Model_1 = require("../../model/Model");

var axisModelCommonMixin_1 = require("../axisModelCommonMixin");

var Component_1 = require("../../model/Component");

var valueAxisDefault = axisDefault_1["default"].value;

function defaultsShow(opt, show) {
  return zrUtil.defaults({
    show: show
  }, opt);
}

var RadarModel = function (_super) {
  tslib_1.__extends(RadarModel, _super);

  function RadarModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = RadarModel.type;
    return _this;
  }

  RadarModel.prototype.optionUpdated = function () {
    var boundaryGap = this.get('boundaryGap');
    var splitNumber = this.get('splitNumber');
    var scale = this.get('scale');
    var axisLine = this.get('axisLine');
    var axisTick = this.get('axisTick');
    var axisLabel = this.get('axisLabel');
    var nameTextStyle = this.get('axisName');
    var showName = this.get(['axisName', 'show']);
    var nameFormatter = this.get(['axisName', 'formatter']);
    var nameGap = this.get('axisNameGap');
    var triggerEvent = this.get('triggerEvent');
    var indicatorModels = zrUtil.map(this.get('indicator') || [], function (indicatorOpt) {
      if (indicatorOpt.max != null && indicatorOpt.max > 0 && !indicatorOpt.min) {
        indicatorOpt.min = 0;
      } else if (indicatorOpt.min != null && indicatorOpt.min < 0 && !indicatorOpt.max) {
        indicatorOpt.max = 0;
      }

      var iNameTextStyle = nameTextStyle;

      if (indicatorOpt.color != null) {
        iNameTextStyle = zrUtil.defaults({
          color: indicatorOpt.color
        }, nameTextStyle);
      }

      var innerIndicatorOpt = zrUtil.merge(zrUtil.clone(indicatorOpt), {
        boundaryGap: boundaryGap,
        splitNumber: splitNumber,
        scale: scale,
        axisLine: axisLine,
        axisTick: axisTick,
        axisLabel: axisLabel,
        name: indicatorOpt.text,
        nameLocation: 'end',
        nameGap: nameGap,
        nameTextStyle: iNameTextStyle,
        triggerEvent: triggerEvent
      }, false);

      if (!showName) {
        innerIndicatorOpt.name = '';
      }

      if (typeof nameFormatter === 'string') {
        var indName = innerIndicatorOpt.name;
        innerIndicatorOpt.name = nameFormatter.replace('{value}', indName != null ? indName : '');
      } else if (typeof nameFormatter === 'function') {
        innerIndicatorOpt.name = nameFormatter(innerIndicatorOpt.name, innerIndicatorOpt);
      }

      var model = new Model_1["default"](innerIndicatorOpt, null, this.ecModel);
      zrUtil.mixin(model, axisModelCommonMixin_1.AxisModelCommonMixin.prototype);
      model.mainType = 'radar';
      model.componentIndex = this.componentIndex;
      return model;
    }, this);
    this._indicatorModels = indicatorModels;
  };

  RadarModel.prototype.getIndicatorModels = function () {
    return this._indicatorModels;
  };

  RadarModel.type = 'radar';
  RadarModel.defaultOption = {
    zlevel: 0,
    z: 0,
    center: ['50%', '50%'],
    radius: '75%',
    startAngle: 90,
    axisName: {
      show: true
    },
    boundaryGap: [0, 0],
    splitNumber: 5,
    axisNameGap: 15,
    scale: false,
    shape: 'polygon',
    axisLine: zrUtil.merge({
      lineStyle: {
        color: '#bbb'
      }
    }, valueAxisDefault.axisLine),
    axisLabel: defaultsShow(valueAxisDefault.axisLabel, false),
    axisTick: defaultsShow(valueAxisDefault.axisTick, false),
    splitLine: defaultsShow(valueAxisDefault.splitLine, true),
    splitArea: defaultsShow(valueAxisDefault.splitArea, true),
    indicator: []
  };
  return RadarModel;
}(Component_1["default"]);

Component_1["default"].registerClass(RadarModel);
exports["default"] = RadarModel;