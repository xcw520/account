
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

var Chart_1 = require("../../view/Chart");

var graphic = require("../../util/graphic");

var states_1 = require("../../util/states");

var Path_1 = require("zrender/lib/graphic/Path");

var createClipPathFromCoordSys_1 = require("../helper/createClipPathFromCoordSys");

var SKIP_PROPS = ['color', 'borderColor'];

var CandlestickView = function (_super) {
  tslib_1.__extends(CandlestickView, _super);

  function CandlestickView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = CandlestickView.type;
    return _this;
  }

  CandlestickView.prototype.render = function (seriesModel, ecModel, api) {
    this.group.removeClipPath();

    this._updateDrawMode(seriesModel);

    this._isLargeDraw ? this._renderLarge(seriesModel) : this._renderNormal(seriesModel);
  };

  CandlestickView.prototype.incrementalPrepareRender = function (seriesModel, ecModel, api) {
    this._clear();

    this._updateDrawMode(seriesModel);
  };

  CandlestickView.prototype.incrementalRender = function (params, seriesModel, ecModel, api) {
    this._isLargeDraw ? this._incrementalRenderLarge(params, seriesModel) : this._incrementalRenderNormal(params, seriesModel);
  };

  CandlestickView.prototype._updateDrawMode = function (seriesModel) {
    var isLargeDraw = seriesModel.pipelineContext.large;

    if (this._isLargeDraw == null || isLargeDraw !== this._isLargeDraw) {
      this._isLargeDraw = isLargeDraw;

      this._clear();
    }
  };

  CandlestickView.prototype._renderNormal = function (seriesModel) {
    var data = seriesModel.getData();
    var oldData = this._data;
    var group = this.group;
    var isSimpleBox = data.getLayout('isSimpleBox');
    var needsClip = seriesModel.get('clip', true);
    var coord = seriesModel.coordinateSystem;
    var clipArea = coord.getArea && coord.getArea();

    if (!this._data) {
      group.removeAll();
    }

    data.diff(oldData).add(function (newIdx) {
      if (data.hasValue(newIdx)) {
        var itemLayout = data.getItemLayout(newIdx);

        if (needsClip && isNormalBoxClipped(clipArea, itemLayout)) {
          return;
        }

        var el = createNormalBox(itemLayout, newIdx, true);
        graphic.initProps(el, {
          shape: {
            points: itemLayout.ends
          }
        }, seriesModel, newIdx);
        setBoxCommon(el, data, newIdx, isSimpleBox);
        group.add(el);
        data.setItemGraphicEl(newIdx, el);
      }
    }).update(function (newIdx, oldIdx) {
      var el = oldData.getItemGraphicEl(oldIdx);

      if (!data.hasValue(newIdx)) {
        group.remove(el);
        return;
      }

      var itemLayout = data.getItemLayout(newIdx);

      if (needsClip && isNormalBoxClipped(clipArea, itemLayout)) {
        group.remove(el);
        return;
      }

      if (!el) {
        el = createNormalBox(itemLayout, newIdx);
      } else {
        graphic.updateProps(el, {
          shape: {
            points: itemLayout.ends
          }
        }, seriesModel, newIdx);
      }

      setBoxCommon(el, data, newIdx, isSimpleBox);
      group.add(el);
      data.setItemGraphicEl(newIdx, el);
    }).remove(function (oldIdx) {
      var el = oldData.getItemGraphicEl(oldIdx);
      el && group.remove(el);
    }).execute();
    this._data = data;
  };

  CandlestickView.prototype._renderLarge = function (seriesModel) {
    this._clear();

    createLarge(seriesModel, this.group);
    var clipPath = seriesModel.get('clip', true) ? createClipPathFromCoordSys_1.createClipPath(seriesModel.coordinateSystem, false, seriesModel) : null;

    if (clipPath) {
      this.group.setClipPath(clipPath);
    } else {
      this.group.removeClipPath();
    }
  };

  CandlestickView.prototype._incrementalRenderNormal = function (params, seriesModel) {
    var data = seriesModel.getData();
    var isSimpleBox = data.getLayout('isSimpleBox');
    var dataIndex;

    while ((dataIndex = params.next()) != null) {
      var itemLayout = data.getItemLayout(dataIndex);
      var el = createNormalBox(itemLayout, dataIndex);
      setBoxCommon(el, data, dataIndex, isSimpleBox);
      el.incremental = true;
      this.group.add(el);
    }
  };

  CandlestickView.prototype._incrementalRenderLarge = function (params, seriesModel) {
    createLarge(seriesModel, this.group, true);
  };

  CandlestickView.prototype.remove = function (ecModel) {
    this._clear();
  };

  CandlestickView.prototype._clear = function () {
    this.group.removeAll();
    this._data = null;
  };

  CandlestickView.type = 'candlestick';
  return CandlestickView;
}(Chart_1["default"]);

Chart_1["default"].registerClass(CandlestickView);

var NormalBoxPathShape = function () {
  function NormalBoxPathShape() {}

  return NormalBoxPathShape;
}();

var NormalBoxPath = function (_super) {
  tslib_1.__extends(NormalBoxPath, _super);

  function NormalBoxPath(opts) {
    var _this = _super.call(this, opts) || this;

    _this.type = 'normalCandlestickBox';
    return _this;
  }

  NormalBoxPath.prototype.getDefaultShape = function () {
    return new NormalBoxPathShape();
  };

  NormalBoxPath.prototype.buildPath = function (ctx, shape) {
    var ends = shape.points;

    if (this.__simpleBox) {
      ctx.moveTo(ends[4][0], ends[4][1]);
      ctx.lineTo(ends[6][0], ends[6][1]);
    } else {
      ctx.moveTo(ends[0][0], ends[0][1]);
      ctx.lineTo(ends[1][0], ends[1][1]);
      ctx.lineTo(ends[2][0], ends[2][1]);
      ctx.lineTo(ends[3][0], ends[3][1]);
      ctx.closePath();
      ctx.moveTo(ends[4][0], ends[4][1]);
      ctx.lineTo(ends[5][0], ends[5][1]);
      ctx.moveTo(ends[6][0], ends[6][1]);
      ctx.lineTo(ends[7][0], ends[7][1]);
    }
  };

  return NormalBoxPath;
}(Path_1["default"]);

function createNormalBox(itemLayout, dataIndex, isInit) {
  var ends = itemLayout.ends;
  return new NormalBoxPath({
    shape: {
      points: isInit ? transInit(ends, itemLayout) : ends
    },
    z2: 100
  });
}

function isNormalBoxClipped(clipArea, itemLayout) {
  var clipped = true;

  for (var i = 0; i < itemLayout.ends.length; i++) {
    if (clipArea.contain(itemLayout.ends[i][0], itemLayout.ends[i][1])) {
      clipped = false;
      break;
    }
  }

  return clipped;
}

function setBoxCommon(el, data, dataIndex, isSimpleBox) {
  var itemModel = data.getItemModel(dataIndex);
  el.useStyle(data.getItemVisual(dataIndex, 'style'));
  el.style.strokeNoScale = true;
  el.__simpleBox = isSimpleBox;
  states_1.setStatesStylesFromModel(el, itemModel);
}

function transInit(points, itemLayout) {
  return zrUtil.map(points, function (point) {
    point = point.slice();
    point[1] = itemLayout.initBaseline;
    return point;
  });
}

var LargeBoxPathShape = function () {
  function LargeBoxPathShape() {}

  return LargeBoxPathShape;
}();

var LargeBoxPath = function (_super) {
  tslib_1.__extends(LargeBoxPath, _super);

  function LargeBoxPath(opts) {
    var _this = _super.call(this, opts) || this;

    _this.type = 'largeCandlestickBox';
    return _this;
  }

  LargeBoxPath.prototype.getDefaultShape = function () {
    return new LargeBoxPathShape();
  };

  LargeBoxPath.prototype.buildPath = function (ctx, shape) {
    var points = shape.points;

    for (var i = 0; i < points.length;) {
      if (this.__sign === points[i++]) {
        var x = points[i++];
        ctx.moveTo(x, points[i++]);
        ctx.lineTo(x, points[i++]);
      } else {
        i += 3;
      }
    }
  };

  return LargeBoxPath;
}(Path_1["default"]);

function createLarge(seriesModel, group, incremental) {
  var data = seriesModel.getData();
  var largePoints = data.getLayout('largePoints');
  var elP = new LargeBoxPath({
    shape: {
      points: largePoints
    },
    __sign: 1
  });
  group.add(elP);
  var elN = new LargeBoxPath({
    shape: {
      points: largePoints
    },
    __sign: -1
  });
  group.add(elN);
  setLargeStyle(1, elP, seriesModel, data);
  setLargeStyle(-1, elN, seriesModel, data);

  if (incremental) {
    elP.incremental = true;
    elN.incremental = true;
  }
}

function setLargeStyle(sign, el, seriesModel, data) {
  var borderColor = seriesModel.get(['itemStyle', sign > 0 ? 'borderColor' : 'borderColor0']) || seriesModel.get(['itemStyle', sign > 0 ? 'color' : 'color0']);
  var itemStyle = seriesModel.getModel('itemStyle').getItemStyle(SKIP_PROPS);
  el.useStyle(itemStyle);
  el.style.fill = null;
  el.style.stroke = borderColor;
}

exports["default"] = CandlestickView;