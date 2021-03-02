
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

var SymbolDraw_1 = require("../helper/SymbolDraw");

var EffectSymbol_1 = require("../helper/EffectSymbol");

var matrix = require("zrender/lib/core/matrix");

var points_1 = require("../../layout/points");

var Chart_1 = require("../../view/Chart");

var EffectScatterView = function (_super) {
  tslib_1.__extends(EffectScatterView, _super);

  function EffectScatterView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = EffectScatterView.type;
    return _this;
  }

  EffectScatterView.prototype.init = function () {
    this._symbolDraw = new SymbolDraw_1["default"](EffectSymbol_1["default"]);
  };

  EffectScatterView.prototype.render = function (seriesModel, ecModel, api) {
    var data = seriesModel.getData();
    var effectSymbolDraw = this._symbolDraw;
    effectSymbolDraw.updateData(data);
    this.group.add(effectSymbolDraw.group);
  };

  EffectScatterView.prototype.updateTransform = function (seriesModel, ecModel, api) {
    var data = seriesModel.getData();
    this.group.dirty();
    var res = points_1["default"]('').reset(seriesModel, ecModel, api);

    if (res.progress) {
      res.progress({
        start: 0,
        end: data.count(),
        count: data.count()
      }, data);
    }

    this._symbolDraw.updateLayout();
  };

  EffectScatterView.prototype._updateGroupTransform = function (seriesModel) {
    var coordSys = seriesModel.coordinateSystem;

    if (coordSys && coordSys.getRoamTransform) {
      this.group.transform = matrix.clone(coordSys.getRoamTransform());
      this.group.decomposeTransform();
    }
  };

  EffectScatterView.prototype.remove = function (ecModel, api) {
    this._symbolDraw && this._symbolDraw.remove(true);
  };

  EffectScatterView.type = 'effectScatter';
  return EffectScatterView;
}(Chart_1["default"]);

Chart_1["default"].registerClass(EffectScatterView);
exports["default"] = EffectScatterView;