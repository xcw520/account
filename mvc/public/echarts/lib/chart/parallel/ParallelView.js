
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

var states_1 = require("../../util/states");

var Chart_1 = require("../../view/Chart");

var number_1 = require("../../util/number");

var util_1 = require("zrender/lib/core/util");

var DEFAULT_SMOOTH = 0.3;

var ParallelView = function (_super) {
  tslib_1.__extends(ParallelView, _super);

  function ParallelView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = ParallelView.type;
    _this._dataGroup = new graphic.Group();
    _this._initialized = false;
    return _this;
  }

  ParallelView.prototype.init = function () {
    this.group.add(this._dataGroup);
  };

  ParallelView.prototype.render = function (seriesModel, ecModel, api, payload) {
    var dataGroup = this._dataGroup;
    var data = seriesModel.getData();
    var oldData = this._data;
    var coordSys = seriesModel.coordinateSystem;
    var dimensions = coordSys.dimensions;
    var seriesScope = makeSeriesScope(seriesModel);
    data.diff(oldData).add(add).update(update).remove(remove).execute();

    function add(newDataIndex) {
      var line = addEl(data, dataGroup, newDataIndex, dimensions, coordSys);
      updateElCommon(line, data, newDataIndex, seriesScope);
    }

    function update(newDataIndex, oldDataIndex) {
      var line = oldData.getItemGraphicEl(oldDataIndex);
      var points = createLinePoints(data, newDataIndex, dimensions, coordSys);
      data.setItemGraphicEl(newDataIndex, line);
      graphic.updateProps(line, {
        shape: {
          points: points
        }
      }, seriesModel, newDataIndex);
      updateElCommon(line, data, newDataIndex, seriesScope);
    }

    function remove(oldDataIndex) {
      var line = oldData.getItemGraphicEl(oldDataIndex);
      dataGroup.remove(line);
    }

    if (!this._initialized) {
      this._initialized = true;
      var clipPath = createGridClipShape(coordSys, seriesModel, function () {
        setTimeout(function () {
          dataGroup.removeClipPath();
        });
      });
      dataGroup.setClipPath(clipPath);
    }

    this._data = data;
  };

  ParallelView.prototype.incrementalPrepareRender = function (seriesModel, ecModel, api) {
    this._initialized = true;
    this._data = null;

    this._dataGroup.removeAll();
  };

  ParallelView.prototype.incrementalRender = function (taskParams, seriesModel, ecModel) {
    var data = seriesModel.getData();
    var coordSys = seriesModel.coordinateSystem;
    var dimensions = coordSys.dimensions;
    var seriesScope = makeSeriesScope(seriesModel);

    for (var dataIndex = taskParams.start; dataIndex < taskParams.end; dataIndex++) {
      var line = addEl(data, this._dataGroup, dataIndex, dimensions, coordSys);
      line.incremental = true;
      updateElCommon(line, data, dataIndex, seriesScope);
    }
  };

  ParallelView.prototype.remove = function () {
    this._dataGroup && this._dataGroup.removeAll();
    this._data = null;
  };

  ParallelView.type = 'parallel';
  return ParallelView;
}(Chart_1["default"]);

function createGridClipShape(coordSys, seriesModel, cb) {
  var parallelModel = coordSys.model;
  var rect = coordSys.getRect();
  var rectEl = new graphic.Rect({
    shape: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    }
  });
  var dim = parallelModel.get('layout') === 'horizontal' ? 'width' : 'height';
  rectEl.setShape(dim, 0);
  graphic.initProps(rectEl, {
    shape: {
      width: rect.width,
      height: rect.height
    }
  }, seriesModel, cb);
  return rectEl;
}

function createLinePoints(data, dataIndex, dimensions, coordSys) {
  var points = [];

  for (var i = 0; i < dimensions.length; i++) {
    var dimName = dimensions[i];
    var value = data.get(data.mapDimension(dimName), dataIndex);

    if (!isEmptyValue(value, coordSys.getAxis(dimName).type)) {
      points.push(coordSys.dataToPoint(value, dimName));
    }
  }

  return points;
}

function addEl(data, dataGroup, dataIndex, dimensions, coordSys) {
  var points = createLinePoints(data, dataIndex, dimensions, coordSys);
  var line = new graphic.Polyline({
    shape: {
      points: points
    },
    z2: 10
  });
  dataGroup.add(line);
  data.setItemGraphicEl(dataIndex, line);
  return line;
}

function makeSeriesScope(seriesModel) {
  var smooth = seriesModel.get('smooth', true);
  smooth === true && (smooth = DEFAULT_SMOOTH);
  smooth = number_1.numericToNumber(smooth);
  util_1.eqNaN(smooth) && (smooth = 0);
  return {
    smooth: smooth
  };
}

function updateElCommon(el, data, dataIndex, seriesScope) {
  el.useStyle(data.getItemVisual(dataIndex, 'style'));
  el.style.fill = null;
  el.setShape('smooth', seriesScope.smooth);
  var itemModel = data.getItemModel(dataIndex);
  var emphasisModel = itemModel.getModel('emphasis');
  states_1.setStatesStylesFromModel(el, itemModel, 'lineStyle');
  states_1.enableHoverEmphasis(el, emphasisModel.get('focus'), emphasisModel.get('blurScope'));
}

function isEmptyValue(val, axisType) {
  return axisType === 'category' ? val == null : val == null || isNaN(val);
}

Chart_1["default"].registerClass(ParallelView);
exports["default"] = ParallelView;