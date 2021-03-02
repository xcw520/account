
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

var axisDefault_1 = require("./axisDefault");

var Component_1 = require("../model/Component");

var layout_1 = require("../util/layout");

var OrdinalMeta_1 = require("../data/OrdinalMeta");

var axisCommonTypes_1 = require("./axisCommonTypes");

function axisModelCreator(axisName, BaseAxisModelClass, extraDefaultOption) {
  zrUtil.each(axisCommonTypes_1.AXIS_TYPES, function (v, axisType) {
    var defaultOption = zrUtil.merge(zrUtil.merge({}, axisDefault_1["default"][axisType], true), extraDefaultOption, true);

    var AxisModel = function (_super) {
      tslib_1.__extends(AxisModel, _super);

      function AxisModel() {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        var _this = _super.apply(this, args) || this;

        _this.type = axisName + 'Axis.' + axisType;
        return _this;
      }

      AxisModel.prototype.mergeDefaultAndTheme = function (option, ecModel) {
        var layoutMode = layout_1.fetchLayoutMode(this);
        var inputPositionParams = layoutMode ? layout_1.getLayoutParams(option) : {};
        var themeModel = ecModel.getTheme();
        zrUtil.merge(option, themeModel.get(axisType + 'Axis'));
        zrUtil.merge(option, this.getDefaultOption());
        option.type = getAxisType(option);

        if (layoutMode) {
          layout_1.mergeLayoutParam(option, inputPositionParams, layoutMode);
        }
      };

      AxisModel.prototype.optionUpdated = function () {
        var thisOption = this.option;

        if (thisOption.type === 'category') {
          this.__ordinalMeta = OrdinalMeta_1["default"].createByAxisModel(this);
        }
      };

      AxisModel.prototype.getCategories = function (rawData) {
        var option = this.option;

        if (option.type === 'category') {
          if (rawData) {
            return option.data;
          }

          return this.__ordinalMeta.categories;
        }
      };

      AxisModel.prototype.getOrdinalMeta = function () {
        return this.__ordinalMeta;
      };

      AxisModel.type = axisName + 'Axis.' + axisType;
      AxisModel.defaultOption = defaultOption;
      return AxisModel;
    }(BaseAxisModelClass);

    Component_1["default"].registerClass(AxisModel);
  });
  Component_1["default"].registerSubTypeDefaulter(axisName + 'Axis', getAxisType);
}

exports["default"] = axisModelCreator;

function getAxisType(option) {
  return option.type || (option.data ? 'category' : 'value');
}