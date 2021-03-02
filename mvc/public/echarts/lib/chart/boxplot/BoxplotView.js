
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

var BoxplotView = function (_super) {
  tslib_1.__extends(BoxplotView, _super);

  function BoxplotView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = BoxplotView.type;
    return _this;
  }

  BoxplotView.prototype.render = function (seriesModel, ecModel, api) {
    var data = seriesModel.getData();
    var group = this.group;
    var oldData = this._data;

    if (!this._data) {
      group.removeAll();
    }

    var constDim = seriesModel.get('layout') === 'horizontal' ? 1 : 0;
    data.diff(oldData).add(function (newIdx) {
      if (data.hasValue(newIdx)) {
        var itemLayout = data.getItemLayout(newIdx);
        var symbolEl = createNormalBox(itemLayout, data, newIdx, constDim, true);
        data.setItemGraphicEl(newIdx, symbolEl);
        group.add(symbolEl);
      }
    }).update(function (newIdx, oldIdx) {
      var symbolEl = oldData.getItemGraphicEl(oldIdx);

      if (!data.hasValue(newIdx)) {
        group.remove(symbolEl);
        return;
      }

      var itemLayout = data.getItemLayout(newIdx);

      if (!symbolEl) {
        symbolEl = createNormalBox(itemLayout, data, newIdx, constDim);
      } else {
        updateNormalBoxData(itemLayout, symbolEl, data, newIdx);
      }

      group.add(symbolEl);
      data.setItemGraphicEl(newIdx, symbolEl);
    }).remove(function (oldIdx) {
      var el = oldData.getItemGraphicEl(oldIdx);
      el && group.remove(el);
    }).execute();
    this._data = data;
  };

  BoxplotView.prototype.remove = function (ecModel) {
    var group = this.group;
    var data = this._data;
    this._data = null;
    data && data.eachItemGraphicEl(function (el) {
      el && group.remove(el);
    });
  };

  BoxplotView.type = 'boxplot';
  return BoxplotView;
}(Chart_1["default"]);

var BoxPathShape = function () {
  function BoxPathShape() {}

  return BoxPathShape;
}();

var BoxPath = function (_super) {
  tslib_1.__extends(BoxPath, _super);

  function BoxPath(opts) {
    var _this = _super.call(this, opts) || this;

    _this.type = 'boxplotBoxPath';
    return _this;
  }

  BoxPath.prototype.getDefaultShape = function () {
    return new BoxPathShape();
  };

  BoxPath.prototype.buildPath = function (ctx, shape) {
    var ends = shape.points;
    var i = 0;
    ctx.moveTo(ends[i][0], ends[i][1]);
    i++;

    for (; i < 4; i++) {
      ctx.lineTo(ends[i][0], ends[i][1]);
    }

    ctx.closePath();

    for (; i < ends.length; i++) {
      ctx.moveTo(ends[i][0], ends[i][1]);
      i++;
      ctx.lineTo(ends[i][0], ends[i][1]);
    }
  };

  return BoxPath;
}(Path_1["default"]);

function createNormalBox(itemLayout, data, dataIndex, constDim, isInit) {
  var ends = itemLayout.ends;
  var el = new BoxPath({
    shape: {
      points: isInit ? transInit(ends, constDim, itemLayout) : ends
    }
  });
  updateNormalBoxData(itemLayout, el, data, dataIndex, isInit);
  return el;
}

function updateNormalBoxData(itemLayout, el, data, dataIndex, isInit) {
  var seriesModel = data.hostModel;
  var updateMethod = graphic[isInit ? 'initProps' : 'updateProps'];
  updateMethod(el, {
    shape: {
      points: itemLayout.ends
    }
  }, seriesModel, dataIndex);
  el.useStyle(data.getItemVisual(dataIndex, 'style'));
  el.style.strokeNoScale = true;
  el.z2 = 100;
  var itemModel = data.getItemModel(dataIndex);
  states_1.setStatesStylesFromModel(el, itemModel);
  states_1.enableHoverEmphasis(el, itemModel.get(['emphasis', 'focus']), itemModel.get(['emphasis', 'blurScope']));
}

function transInit(points, dim, itemLayout) {
  return zrUtil.map(points, function (point) {
    point = point.slice();
    point[dim] = itemLayout.initBaseline;
    return point;
  });
}

Chart_1["default"].registerClass(BoxplotView);
exports["default"] = BoxplotView;