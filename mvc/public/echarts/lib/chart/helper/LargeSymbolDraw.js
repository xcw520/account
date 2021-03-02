
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

var graphic = require("../../util/graphic");

var symbol_1 = require("../../util/symbol");

var IncrementalDisplayable_1 = require("zrender/lib/graphic/IncrementalDisplayable");

var innerStore_1 = require("../../util/innerStore");

var BOOST_SIZE_THRESHOLD = 4;

var LargeSymbolPathShape = function () {
  function LargeSymbolPathShape() {}

  return LargeSymbolPathShape;
}();

var LargeSymbolPath = function (_super) {
  tslib_1.__extends(LargeSymbolPath, _super);

  function LargeSymbolPath(opts) {
    return _super.call(this, opts) || this;
  }

  LargeSymbolPath.prototype.getDefaultShape = function () {
    return new LargeSymbolPathShape();
  };

  LargeSymbolPath.prototype.buildPath = function (path, shape) {
    var points = shape.points;
    var size = shape.size;
    var symbolProxy = this.symbolProxy;
    var symbolProxyShape = symbolProxy.shape;
    var ctx = path.getContext ? path.getContext() : path;
    var canBoost = ctx && size[0] < BOOST_SIZE_THRESHOLD;

    if (canBoost) {
      this._ctx = ctx;
      return;
    }

    this._ctx = null;

    for (var i = 0; i < points.length;) {
      var x = points[i++];
      var y = points[i++];

      if (isNaN(x) || isNaN(y)) {
        continue;
      }

      if (this.softClipShape && !this.softClipShape.contain(x, y)) {
        continue;
      }

      symbolProxyShape.x = x - size[0] / 2;
      symbolProxyShape.y = y - size[1] / 2;
      symbolProxyShape.width = size[0];
      symbolProxyShape.height = size[1];
      symbolProxy.buildPath(path, symbolProxyShape, true);
    }
  };

  LargeSymbolPath.prototype.afterBrush = function () {
    var shape = this.shape;
    var points = shape.points;
    var size = shape.size;
    var ctx = this._ctx;

    if (!ctx) {
      return;
    }

    for (var i = 0; i < points.length;) {
      var x = points[i++];
      var y = points[i++];

      if (isNaN(x) || isNaN(y)) {
        continue;
      }

      if (this.softClipShape && !this.softClipShape.contain(x, y)) {
        continue;
      }

      ctx.fillRect(x - size[0] / 2, y - size[1] / 2, size[0], size[1]);
    }
  };

  LargeSymbolPath.prototype.findDataIndex = function (x, y) {
    var shape = this.shape;
    var points = shape.points;
    var size = shape.size;
    var w = Math.max(size[0], 4);
    var h = Math.max(size[1], 4);

    for (var idx = points.length / 2 - 1; idx >= 0; idx--) {
      var i = idx * 2;
      var x0 = points[i] - w / 2;
      var y0 = points[i + 1] - h / 2;

      if (x >= x0 && y >= y0 && x <= x0 + w && y <= y0 + h) {
        return idx;
      }
    }

    return -1;
  };

  return LargeSymbolPath;
}(graphic.Path);

var LargeSymbolDraw = function () {
  function LargeSymbolDraw() {
    this.group = new graphic.Group();
  }

  LargeSymbolDraw.prototype.isPersistent = function () {
    return !this._incremental;
  };

  ;

  LargeSymbolDraw.prototype.updateData = function (data, opt) {
    this.group.removeAll();
    var symbolEl = new LargeSymbolPath({
      rectHover: true,
      cursor: 'default'
    });
    symbolEl.setShape({
      points: data.getLayout('points')
    });

    this._setCommon(symbolEl, data, false, opt);

    this.group.add(symbolEl);
    this._incremental = null;
  };

  LargeSymbolDraw.prototype.updateLayout = function (data) {
    if (this._incremental) {
      return;
    }

    var points = data.getLayout('points');
    this.group.eachChild(function (child) {
      if (child.startIndex != null) {
        var len = (child.endIndex - child.startIndex) * 2;
        var byteOffset = child.startIndex * 4 * 2;
        points = new Float32Array(points.buffer, byteOffset, len);
      }

      child.setShape('points', points);
    });
  };

  LargeSymbolDraw.prototype.incrementalPrepareUpdate = function (data) {
    this.group.removeAll();

    this._clearIncremental();

    if (data.count() > 2e6) {
      if (!this._incremental) {
        this._incremental = new IncrementalDisplayable_1["default"]({
          silent: true
        });
      }

      this.group.add(this._incremental);
    } else {
      this._incremental = null;
    }
  };

  LargeSymbolDraw.prototype.incrementalUpdate = function (taskParams, data, opt) {
    var symbolEl;

    if (this._incremental) {
      symbolEl = new LargeSymbolPath();

      this._incremental.addDisplayable(symbolEl, true);
    } else {
      symbolEl = new LargeSymbolPath({
        rectHover: true,
        cursor: 'default',
        startIndex: taskParams.start,
        endIndex: taskParams.end
      });
      symbolEl.incremental = true;
      this.group.add(symbolEl);
    }

    symbolEl.setShape({
      points: data.getLayout('points')
    });

    this._setCommon(symbolEl, data, !!this._incremental, opt);
  };

  LargeSymbolDraw.prototype._setCommon = function (symbolEl, data, isIncremental, opt) {
    var hostModel = data.hostModel;
    opt = opt || {};
    var size = data.getVisual('symbolSize');
    symbolEl.setShape('size', size instanceof Array ? size : [size, size]);
    symbolEl.softClipShape = opt.clipShape || null;
    symbolEl.symbolProxy = symbol_1.createSymbol(data.getVisual('symbol'), 0, 0, 0, 0);
    symbolEl.setColor = symbolEl.symbolProxy.setColor;
    var extrudeShadow = symbolEl.shape.size[0] < BOOST_SIZE_THRESHOLD;
    symbolEl.useStyle(hostModel.getModel('itemStyle').getItemStyle(extrudeShadow ? ['color', 'shadowBlur', 'shadowColor'] : ['color']));
    var globalStyle = data.getVisual('style');
    var visualColor = globalStyle && globalStyle.fill;

    if (visualColor) {
      symbolEl.setColor(visualColor);
    }

    if (!isIncremental) {
      var ecData_1 = innerStore_1.getECData(symbolEl);
      ecData_1.seriesIndex = hostModel.seriesIndex;
      symbolEl.on('mousemove', function (e) {
        ecData_1.dataIndex = null;
        var dataIndex = symbolEl.findDataIndex(e.offsetX, e.offsetY);

        if (dataIndex >= 0) {
          ecData_1.dataIndex = dataIndex + (symbolEl.startIndex || 0);
        }
      });
    }
  };

  LargeSymbolDraw.prototype.remove = function () {
    this._clearIncremental();

    this._incremental = null;
    this.group.removeAll();
  };

  LargeSymbolDraw.prototype._clearIncremental = function () {
    var incremental = this._incremental;

    if (incremental) {
      incremental.clearDisplaybles();
    }
  };

  return LargeSymbolDraw;
}();

exports["default"] = LargeSymbolDraw;