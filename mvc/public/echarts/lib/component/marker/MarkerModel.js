
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

var env_1 = require("zrender/lib/core/env");

var dataFormat_1 = require("../../model/mixin/dataFormat");

var Component_1 = require("../../model/Component");

var model_1 = require("../../util/model");

var tooltipMarkup_1 = require("../tooltip/tooltipMarkup");

function fillLabel(opt) {
  model_1.defaultEmphasis(opt, 'label', ['show']);
}

var inner = model_1.makeInner();

var MarkerModel = function (_super) {
  tslib_1.__extends(MarkerModel, _super);

  function MarkerModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = MarkerModel.type;
    _this.createdBySelf = false;
    return _this;
  }

  MarkerModel.prototype.init = function (option, parentModel, ecModel) {
    if (process.env.NODE_ENV !== 'production') {
      if (this.type === 'marker') {
        throw new Error('Marker component is abstract component. Use markLine, markPoint, markArea instead.');
      }
    }

    this.mergeDefaultAndTheme(option, ecModel);

    this._mergeOption(option, ecModel, false, true);
  };

  MarkerModel.prototype.isAnimationEnabled = function () {
    if (env_1["default"].node) {
      return false;
    }

    var hostSeries = this.__hostSeries;
    return this.getShallow('animation') && hostSeries && hostSeries.isAnimationEnabled();
  };

  MarkerModel.prototype.mergeOption = function (newOpt, ecModel) {
    this._mergeOption(newOpt, ecModel, false, false);
  };

  MarkerModel.prototype._mergeOption = function (newOpt, ecModel, createdBySelf, isInit) {
    var componentType = this.mainType;

    if (!createdBySelf) {
      ecModel.eachSeries(function (seriesModel) {
        var markerOpt = seriesModel.get(this.mainType, true);
        var markerModel = inner(seriesModel)[componentType];

        if (!markerOpt || !markerOpt.data) {
          inner(seriesModel)[componentType] = null;
          return;
        }

        if (!markerModel) {
          if (isInit) {
            fillLabel(markerOpt);
          }

          zrUtil.each(markerOpt.data, function (item) {
            if (item instanceof Array) {
              fillLabel(item[0]);
              fillLabel(item[1]);
            } else {
              fillLabel(item);
            }
          });
          markerModel = this.createMarkerModelFromSeries(markerOpt, this, ecModel);
          zrUtil.extend(markerModel, {
            mainType: this.mainType,
            seriesIndex: seriesModel.seriesIndex,
            name: seriesModel.name,
            createdBySelf: true
          });
          markerModel.__hostSeries = seriesModel;
        } else {
          markerModel._mergeOption(markerOpt, ecModel, true);
        }

        inner(seriesModel)[componentType] = markerModel;
      }, this);
    }
  };

  MarkerModel.prototype.formatTooltip = function (dataIndex, multipleSeries, dataType) {
    var data = this.getData();
    var value = this.getRawValue(dataIndex);
    var itemName = data.getName(dataIndex);
    return tooltipMarkup_1.createTooltipMarkup('section', {
      header: this.name,
      blocks: [tooltipMarkup_1.createTooltipMarkup('nameValue', {
        name: itemName,
        value: value,
        noName: !itemName,
        noValue: value == null
      })]
    });
  };

  MarkerModel.prototype.getData = function () {
    return this._data;
  };

  MarkerModel.prototype.setData = function (data) {
    this._data = data;
  };

  MarkerModel.getMarkerModelFromSeries = function (seriesModel, componentType) {
    return inner(seriesModel)[componentType];
  };

  MarkerModel.type = 'marker';
  MarkerModel.dependencies = ['series', 'grid', 'polar', 'geo'];
  return MarkerModel;
}(Component_1["default"]);

zrUtil.mixin(MarkerModel, dataFormat_1.DataFormatMixin.prototype);
exports["default"] = MarkerModel;