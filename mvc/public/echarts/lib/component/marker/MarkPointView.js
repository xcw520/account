
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

var SymbolDraw_1 = require("../../chart/helper/SymbolDraw");

var numberUtil = require("../../util/number");

var List_1 = require("../../data/List");

var markerHelper = require("./markerHelper");

var MarkerView_1 = require("./MarkerView");

var Component_1 = require("../../view/Component");

var MarkerModel_1 = require("./MarkerModel");

var util_1 = require("zrender/lib/core/util");

var innerStore_1 = require("../../util/innerStore");

var helper_1 = require("../../visual/helper");

function updateMarkerLayout(mpData, seriesModel, api) {
  var coordSys = seriesModel.coordinateSystem;
  mpData.each(function (idx) {
    var itemModel = mpData.getItemModel(idx);
    var point;
    var xPx = numberUtil.parsePercent(itemModel.get('x'), api.getWidth());
    var yPx = numberUtil.parsePercent(itemModel.get('y'), api.getHeight());

    if (!isNaN(xPx) && !isNaN(yPx)) {
      point = [xPx, yPx];
    } else if (seriesModel.getMarkerPosition) {
      point = seriesModel.getMarkerPosition(mpData.getValues(mpData.dimensions, idx));
    } else if (coordSys) {
      var x = mpData.get(coordSys.dimensions[0], idx);
      var y = mpData.get(coordSys.dimensions[1], idx);
      point = coordSys.dataToPoint([x, y]);
    }

    if (!isNaN(xPx)) {
      point[0] = xPx;
    }

    if (!isNaN(yPx)) {
      point[1] = yPx;
    }

    mpData.setItemLayout(idx, point);
  });
}

var MarkPointView = function (_super) {
  tslib_1.__extends(MarkPointView, _super);

  function MarkPointView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = MarkPointView.type;
    return _this;
  }

  MarkPointView.prototype.updateTransform = function (markPointModel, ecModel, api) {
    ecModel.eachSeries(function (seriesModel) {
      var mpModel = MarkerModel_1["default"].getMarkerModelFromSeries(seriesModel, 'markPoint');

      if (mpModel) {
        updateMarkerLayout(mpModel.getData(), seriesModel, api);
        this.markerGroupMap.get(seriesModel.id).updateLayout();
      }
    }, this);
  };

  MarkPointView.prototype.renderSeries = function (seriesModel, mpModel, ecModel, api) {
    var coordSys = seriesModel.coordinateSystem;
    var seriesId = seriesModel.id;
    var seriesData = seriesModel.getData();
    var symbolDrawMap = this.markerGroupMap;
    var symbolDraw = symbolDrawMap.get(seriesId) || symbolDrawMap.set(seriesId, new SymbolDraw_1["default"]());
    var mpData = createList(coordSys, seriesModel, mpModel);
    mpModel.setData(mpData);
    updateMarkerLayout(mpModel.getData(), seriesModel, api);
    mpData.each(function (idx) {
      var itemModel = mpData.getItemModel(idx);
      var symbol = itemModel.getShallow('symbol');
      var symbolSize = itemModel.getShallow('symbolSize');
      var symbolRotate = itemModel.getShallow('symbolRotate');

      if (util_1.isFunction(symbol) || util_1.isFunction(symbolSize) || util_1.isFunction(symbolRotate)) {
        var rawIdx = mpModel.getRawValue(idx);
        var dataParams = mpModel.getDataParams(idx);

        if (util_1.isFunction(symbol)) {
          symbol = symbol(rawIdx, dataParams);
        }

        if (util_1.isFunction(symbolSize)) {
          symbolSize = symbolSize(rawIdx, dataParams);
        }

        if (util_1.isFunction(symbolRotate)) {
          symbolRotate = symbolRotate(rawIdx, dataParams);
        }
      }

      var style = itemModel.getModel('itemStyle').getItemStyle();
      var color = helper_1.getVisualFromData(seriesData, 'color');

      if (!style.fill) {
        style.fill = color;
      }

      mpData.setItemVisual(idx, {
        symbol: symbol,
        symbolSize: symbolSize,
        symbolRotate: symbolRotate,
        style: style
      });
    });
    symbolDraw.updateData(mpData);
    this.group.add(symbolDraw.group);
    mpData.eachItemGraphicEl(function (el) {
      el.traverse(function (child) {
        innerStore_1.getECData(child).dataModel = mpModel;
      });
    });
    this.markKeep(symbolDraw);
    symbolDraw.group.silent = mpModel.get('silent') || seriesModel.get('silent');
  };

  MarkPointView.type = 'markPoint';
  return MarkPointView;
}(MarkerView_1["default"]);

function createList(coordSys, seriesModel, mpModel) {
  var coordDimsInfos;

  if (coordSys) {
    coordDimsInfos = util_1.map(coordSys && coordSys.dimensions, function (coordDim) {
      var info = seriesModel.getData().getDimensionInfo(seriesModel.getData().mapDimension(coordDim)) || {};
      return util_1.defaults({
        name: coordDim
      }, info);
    });
  } else {
    coordDimsInfos = [{
      name: 'value',
      type: 'float'
    }];
  }

  var mpData = new List_1["default"](coordDimsInfos, mpModel);
  var dataOpt = util_1.map(mpModel.get('data'), util_1.curry(markerHelper.dataTransform, seriesModel));

  if (coordSys) {
    dataOpt = util_1.filter(dataOpt, util_1.curry(markerHelper.dataFilter, coordSys));
  }

  mpData.initData(dataOpt, null, coordSys ? markerHelper.dimValueGetter : function (item) {
    return item.value;
  });
  return mpData;
}

Component_1["default"].registerClass(MarkPointView);