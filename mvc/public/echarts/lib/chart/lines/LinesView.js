
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

var LineDraw_1 = require("../helper/LineDraw");

var EffectLine_1 = require("../helper/EffectLine");

var Line_1 = require("../helper/Line");

var Polyline_1 = require("../helper/Polyline");

var EffectPolyline_1 = require("../helper/EffectPolyline");

var LargeLineDraw_1 = require("../helper/LargeLineDraw");

var linesLayout_1 = require("./linesLayout");

var createClipPathFromCoordSys_1 = require("../helper/createClipPathFromCoordSys");

var Chart_1 = require("../../view/Chart");

var LinesView = function (_super) {
  tslib_1.__extends(LinesView, _super);

  function LinesView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = LinesView.type;
    return _this;
  }

  LinesView.prototype.render = function (seriesModel, ecModel, api) {
    var data = seriesModel.getData();

    var lineDraw = this._updateLineDraw(data, seriesModel);

    var zlevel = seriesModel.get('zlevel');
    var trailLength = seriesModel.get(['effect', 'trailLength']);
    var zr = api.getZr();
    var isSvg = zr.painter.getType() === 'svg';

    if (!isSvg) {
      zr.painter.getLayer(zlevel).clear(true);
    }

    if (this._lastZlevel != null && !isSvg) {
      zr.configLayer(this._lastZlevel, {
        motionBlur: false
      });
    }

    if (this._showEffect(seriesModel) && trailLength) {
      if (process.env.NODE_ENV !== 'production') {
        var notInIndividual_1 = false;
        ecModel.eachSeries(function (otherSeriesModel) {
          if (otherSeriesModel !== seriesModel && otherSeriesModel.get('zlevel') === zlevel) {
            notInIndividual_1 = true;
          }
        });
        notInIndividual_1 && console.warn('Lines with trail effect should have an individual zlevel');
      }

      if (!isSvg) {
        zr.configLayer(zlevel, {
          motionBlur: true,
          lastFrameAlpha: Math.max(Math.min(trailLength / 10 + 0.9, 1), 0)
        });
      }
    }

    lineDraw.updateData(data);
    var clipPath = seriesModel.get('clip', true) && createClipPathFromCoordSys_1.createClipPath(seriesModel.coordinateSystem, false, seriesModel);

    if (clipPath) {
      this.group.setClipPath(clipPath);
    } else {
      this.group.removeClipPath();
    }

    this._lastZlevel = zlevel;
    this._finished = true;
  };

  LinesView.prototype.incrementalPrepareRender = function (seriesModel, ecModel, api) {
    var data = seriesModel.getData();

    var lineDraw = this._updateLineDraw(data, seriesModel);

    lineDraw.incrementalPrepareUpdate(data);

    this._clearLayer(api);

    this._finished = false;
  };

  LinesView.prototype.incrementalRender = function (taskParams, seriesModel, ecModel) {
    this._lineDraw.incrementalUpdate(taskParams, seriesModel.getData());

    this._finished = taskParams.end === seriesModel.getData().count();
  };

  LinesView.prototype.updateTransform = function (seriesModel, ecModel, api) {
    var data = seriesModel.getData();
    var pipelineContext = seriesModel.pipelineContext;

    if (!this._finished || pipelineContext.large || pipelineContext.progressiveRender) {
      return {
        update: true
      };
    } else {
      var res = linesLayout_1["default"].reset(seriesModel, ecModel, api);

      if (res.progress) {
        res.progress({
          start: 0,
          end: data.count(),
          count: data.count()
        }, data);
      }

      this._lineDraw.updateLayout();

      this._clearLayer(api);
    }
  };

  LinesView.prototype._updateLineDraw = function (data, seriesModel) {
    var lineDraw = this._lineDraw;

    var hasEffect = this._showEffect(seriesModel);

    var isPolyline = !!seriesModel.get('polyline');
    var pipelineContext = seriesModel.pipelineContext;
    var isLargeDraw = pipelineContext.large;

    if (process.env.NODE_ENV !== 'production') {
      if (hasEffect && isLargeDraw) {
        console.warn('Large lines not support effect');
      }
    }

    if (!lineDraw || hasEffect !== this._hasEffet || isPolyline !== this._isPolyline || isLargeDraw !== this._isLargeDraw) {
      if (lineDraw) {
        lineDraw.remove();
      }

      lineDraw = this._lineDraw = isLargeDraw ? new LargeLineDraw_1["default"]() : new LineDraw_1["default"](isPolyline ? hasEffect ? EffectPolyline_1["default"] : Polyline_1["default"] : hasEffect ? EffectLine_1["default"] : Line_1["default"]);
      this._hasEffet = hasEffect;
      this._isPolyline = isPolyline;
      this._isLargeDraw = isLargeDraw;
      this.group.removeAll();
    }

    this.group.add(lineDraw.group);
    return lineDraw;
  };

  LinesView.prototype._showEffect = function (seriesModel) {
    return !!seriesModel.get(['effect', 'show']);
  };

  LinesView.prototype._clearLayer = function (api) {
    var zr = api.getZr();
    var isSvg = zr.painter.getType() === 'svg';

    if (!isSvg && this._lastZlevel != null) {
      zr.painter.getLayer(this._lastZlevel).clear(true);
    }
  };

  LinesView.prototype.remove = function (ecModel, api) {
    this._lineDraw && this._lineDraw.remove();
    this._lineDraw = null;

    this._clearLayer(api);
  };

  LinesView.type = 'lines';
  return LinesView;
}(Chart_1["default"]);

Chart_1["default"].registerClass(LinesView);
exports["default"] = LinesView;