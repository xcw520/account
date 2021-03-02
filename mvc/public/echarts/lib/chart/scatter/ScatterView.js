
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

var LargeSymbolDraw_1 = require("../helper/LargeSymbolDraw");

var points_1 = require("../../layout/points");

var Chart_1 = require("../../view/Chart");

var ScatterView = function (_super) {
  tslib_1.__extends(ScatterView, _super);

  function ScatterView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = ScatterView.type;
    return _this;
  }

  ScatterView.prototype.render = function (seriesModel, ecModel, api) {
    var data = seriesModel.getData();

    var symbolDraw = this._updateSymbolDraw(data, seriesModel);

    symbolDraw.updateData(data, {
      clipShape: this._getClipShape(seriesModel)
    });
    this._finished = true;
  };

  ScatterView.prototype.incrementalPrepareRender = function (seriesModel, ecModel, api) {
    var data = seriesModel.getData();

    var symbolDraw = this._updateSymbolDraw(data, seriesModel);

    symbolDraw.incrementalPrepareUpdate(data);
    this._finished = false;
  };

  ScatterView.prototype.incrementalRender = function (taskParams, seriesModel, ecModel) {
    this._symbolDraw.incrementalUpdate(taskParams, seriesModel.getData(), {
      clipShape: this._getClipShape(seriesModel)
    });

    this._finished = taskParams.end === seriesModel.getData().count();
  };

  ScatterView.prototype.updateTransform = function (seriesModel, ecModel, api) {
    var data = seriesModel.getData();
    this.group.dirty();

    if (!this._finished || data.count() > 1e4 || !this._symbolDraw.isPersistent()) {
      return {
        update: true
      };
    } else {
      var res = points_1["default"]('').reset(seriesModel, ecModel, api);

      if (res.progress) {
        res.progress({
          start: 0,
          end: data.count(),
          count: data.count()
        }, data);
      }

      this._symbolDraw.updateLayout(data);
    }
  };

  ScatterView.prototype._getClipShape = function (seriesModel) {
    var coordSys = seriesModel.coordinateSystem;
    var clipArea = coordSys && coordSys.getArea && coordSys.getArea();
    return seriesModel.get('clip', true) ? clipArea : null;
  };

  ScatterView.prototype._updateSymbolDraw = function (data, seriesModel) {
    var symbolDraw = this._symbolDraw;
    var pipelineContext = seriesModel.pipelineContext;
    var isLargeDraw = pipelineContext.large;

    if (!symbolDraw || isLargeDraw !== this._isLargeDraw) {
      symbolDraw && symbolDraw.remove();
      symbolDraw = this._symbolDraw = isLargeDraw ? new LargeSymbolDraw_1["default"]() : new SymbolDraw_1["default"]();
      this._isLargeDraw = isLargeDraw;
      this.group.removeAll();
    }

    this.group.add(symbolDraw.group);
    return symbolDraw;
  };

  ScatterView.prototype.remove = function (ecModel, api) {
    this._symbolDraw && this._symbolDraw.remove(true);
    this._symbolDraw = null;
  };

  ScatterView.prototype.dispose = function () {};

  ScatterView.type = 'scatter';
  return ScatterView;
}(Chart_1["default"]);

Chart_1["default"].registerClass(ScatterView);
exports["default"] = ScatterView;