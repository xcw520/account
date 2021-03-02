
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

var Component_1 = require("../../model/Component");

var axisModelCreator_1 = require("../axisModelCreator");

var axisModelCommonMixin_1 = require("../axisModelCommonMixin");

var model_1 = require("../../util/model");

var PolarAxisModel = function (_super) {
  tslib_1.__extends(PolarAxisModel, _super);

  function PolarAxisModel() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  PolarAxisModel.prototype.getCoordSysModel = function () {
    return this.getReferringComponents('polar', model_1.SINGLE_REFERRING).models[0];
  };

  PolarAxisModel.type = 'polarAxis';
  return PolarAxisModel;
}(Component_1["default"]);

exports.PolarAxisModel = PolarAxisModel;
zrUtil.mixin(PolarAxisModel, axisModelCommonMixin_1.AxisModelCommonMixin);

var AngleAxisModel = function (_super) {
  tslib_1.__extends(AngleAxisModel, _super);

  function AngleAxisModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = AngleAxisModel.type;
    return _this;
  }

  AngleAxisModel.type = 'angleAxis';
  return AngleAxisModel;
}(PolarAxisModel);

exports.AngleAxisModel = AngleAxisModel;

var RadiusAxisModel = function (_super) {
  tslib_1.__extends(RadiusAxisModel, _super);

  function RadiusAxisModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = RadiusAxisModel.type;
    return _this;
  }

  RadiusAxisModel.type = 'radiusAxis';
  return RadiusAxisModel;
}(PolarAxisModel);

exports.RadiusAxisModel = RadiusAxisModel;
var angleAxisExtraOption = {
  startAngle: 90,
  clockwise: true,
  splitNumber: 12,
  axisLabel: {
    rotate: 0
  }
};
var radiusAxisExtraOption = {
  splitNumber: 5
};
axisModelCreator_1["default"]('angle', AngleAxisModel, angleAxisExtraOption);
axisModelCreator_1["default"]('radius', RadiusAxisModel, radiusAxisExtraOption);