
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

var makeStyleMapper_1 = require("../../model/mixin/makeStyleMapper");

var axisModelCreator_1 = require("../axisModelCreator");

var numberUtil = require("../../util/number");

var axisModelCommonMixin_1 = require("../axisModelCommonMixin");

var ParallelAxisModel = function (_super) {
  tslib_1.__extends(ParallelAxisModel, _super);

  function ParallelAxisModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = ParallelAxisModel.type;
    _this.activeIntervals = [];
    return _this;
  }

  ParallelAxisModel.prototype.getAreaSelectStyle = function () {
    return makeStyleMapper_1["default"]([['fill', 'color'], ['lineWidth', 'borderWidth'], ['stroke', 'borderColor'], ['width', 'width'], ['opacity', 'opacity']])(this.getModel('areaSelectStyle'));
  };

  ParallelAxisModel.prototype.setActiveIntervals = function (intervals) {
    var activeIntervals = this.activeIntervals = zrUtil.clone(intervals);

    if (activeIntervals) {
      for (var i = activeIntervals.length - 1; i >= 0; i--) {
        numberUtil.asc(activeIntervals[i]);
      }
    }
  };

  ParallelAxisModel.prototype.getActiveState = function (value) {
    var activeIntervals = this.activeIntervals;

    if (!activeIntervals.length) {
      return 'normal';
    }

    if (value == null || isNaN(+value)) {
      return 'inactive';
    }

    if (activeIntervals.length === 1) {
      var interval = activeIntervals[0];

      if (interval[0] <= value && value <= interval[1]) {
        return 'active';
      }
    } else {
      for (var i = 0, len = activeIntervals.length; i < len; i++) {
        if (activeIntervals[i][0] <= value && value <= activeIntervals[i][1]) {
          return 'active';
        }
      }
    }

    return 'inactive';
  };

  return ParallelAxisModel;
}(Component_1["default"]);

var defaultOption = {
  type: 'value',
  areaSelectStyle: {
    width: 20,
    borderWidth: 1,
    borderColor: 'rgba(160,197,232)',
    color: 'rgba(160,197,232)',
    opacity: 0.3
  },
  realtime: true,
  z: 10
};
Component_1["default"].registerClass(ParallelAxisModel);
zrUtil.mixin(ParallelAxisModel, axisModelCommonMixin_1.AxisModelCommonMixin);
axisModelCreator_1["default"]('parallel', ParallelAxisModel, defaultOption);
exports["default"] = ParallelAxisModel;