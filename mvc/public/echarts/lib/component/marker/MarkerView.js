
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

var Component_1 = require("../../view/Component");

var util_1 = require("zrender/lib/core/util");

var MarkerModel_1 = require("./MarkerModel");

var model_1 = require("../../util/model");

var states_1 = require("../../util/states");

var inner = model_1.makeInner();

var MarkerView = function (_super) {
  tslib_1.__extends(MarkerView, _super);

  function MarkerView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = MarkerView.type;
    return _this;
  }

  MarkerView.prototype.init = function () {
    this.markerGroupMap = util_1.createHashMap();
  };

  MarkerView.prototype.render = function (markerModel, ecModel, api) {
    var _this = this;

    var markerGroupMap = this.markerGroupMap;
    markerGroupMap.each(function (item) {
      inner(item).keep = false;
    });
    ecModel.eachSeries(function (seriesModel) {
      var markerModel = MarkerModel_1["default"].getMarkerModelFromSeries(seriesModel, _this.type);
      markerModel && _this.renderSeries(seriesModel, markerModel, ecModel, api);
    });
    markerGroupMap.each(function (item) {
      !inner(item).keep && _this.group.remove(item.group);
    });
  };

  MarkerView.prototype.markKeep = function (drawGroup) {
    inner(drawGroup).keep = true;
  };

  MarkerView.prototype.blurSeries = function (seriesModelList) {
    var _this = this;

    util_1.each(seriesModelList, function (seriesModel) {
      var markerModel = MarkerModel_1["default"].getMarkerModelFromSeries(seriesModel, _this.type);

      if (markerModel) {
        var data = markerModel.getData();
        data.eachItemGraphicEl(function (el) {
          if (el) {
            states_1.enterBlur(el);
          }
        });
      }
    });
  };

  MarkerView.type = 'marker';
  return MarkerView;
}(Component_1["default"]);

exports["default"] = MarkerView;