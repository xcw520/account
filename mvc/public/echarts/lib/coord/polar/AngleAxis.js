
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

var textContain = require("zrender/lib/contain/text");

var Axis_1 = require("../Axis");

var model_1 = require("../../util/model");

var inner = model_1.makeInner();

var AngleAxis = function (_super) {
  tslib_1.__extends(AngleAxis, _super);

  function AngleAxis(scale, angleExtent) {
    return _super.call(this, 'angle', scale, angleExtent || [0, 360]) || this;
  }

  AngleAxis.prototype.pointToData = function (point, clamp) {
    return this.polar.pointToData(point, clamp)[this.dim === 'radius' ? 0 : 1];
  };

  AngleAxis.prototype.calculateCategoryInterval = function () {
    var axis = this;
    var labelModel = axis.getLabelModel();
    var ordinalScale = axis.scale;
    var ordinalExtent = ordinalScale.getExtent();
    var tickCount = ordinalScale.count();

    if (ordinalExtent[1] - ordinalExtent[0] < 1) {
      return 0;
    }

    var tickValue = ordinalExtent[0];
    var unitSpan = axis.dataToCoord(tickValue + 1) - axis.dataToCoord(tickValue);
    var unitH = Math.abs(unitSpan);
    var rect = textContain.getBoundingRect(tickValue == null ? '' : tickValue + '', labelModel.getFont(), 'center', 'top');
    var maxH = Math.max(rect.height, 7);
    var dh = maxH / unitH;
    isNaN(dh) && (dh = Infinity);
    var interval = Math.max(0, Math.floor(dh));
    var cache = inner(axis.model);
    var lastAutoInterval = cache.lastAutoInterval;
    var lastTickCount = cache.lastTickCount;

    if (lastAutoInterval != null && lastTickCount != null && Math.abs(lastAutoInterval - interval) <= 1 && Math.abs(lastTickCount - tickCount) <= 1 && lastAutoInterval > interval) {
      interval = lastAutoInterval;
    } else {
      cache.lastTickCount = tickCount;
      cache.lastAutoInterval = interval;
    }

    return interval;
  };

  return AngleAxis;
}(Axis_1["default"]);

AngleAxis.prototype.dataToAngle = Axis_1["default"].prototype.dataToCoord;
AngleAxis.prototype.angleToData = Axis_1["default"].prototype.coordToData;
exports["default"] = AngleAxis;