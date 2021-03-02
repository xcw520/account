
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

var HeatmapLayer_1 = require("./HeatmapLayer");

var zrUtil = require("zrender/lib/core/util");

var Chart_1 = require("../../view/Chart");

var CoordinateSystem_1 = require("../../coord/CoordinateSystem");

var labelStyle_1 = require("../../label/labelStyle");

function getIsInPiecewiseRange(dataExtent, pieceList, selected) {
  var dataSpan = dataExtent[1] - dataExtent[0];
  pieceList = zrUtil.map(pieceList, function (piece) {
    return {
      interval: [(piece.interval[0] - dataExtent[0]) / dataSpan, (piece.interval[1] - dataExtent[0]) / dataSpan]
    };
  });
  var len = pieceList.length;
  var lastIndex = 0;
  return function (val) {
    var i;

    for (i = lastIndex; i < len; i++) {
      var interval = pieceList[i].interval;

      if (interval[0] <= val && val <= interval[1]) {
        lastIndex = i;
        break;
      }
    }

    if (i === len) {
      for (i = lastIndex - 1; i >= 0; i--) {
        var interval = pieceList[i].interval;

        if (interval[0] <= val && val <= interval[1]) {
          lastIndex = i;
          break;
        }
      }
    }

    return i >= 0 && i < len && selected[i];
  };
}

function getIsInContinuousRange(dataExtent, range) {
  var dataSpan = dataExtent[1] - dataExtent[0];
  range = [(range[0] - dataExtent[0]) / dataSpan, (range[1] - dataExtent[0]) / dataSpan];
  return function (val) {
    return val >= range[0] && val <= range[1];
  };
}

function isGeoCoordSys(coordSys) {
  var dimensions = coordSys.dimensions;
  return dimensions[0] === 'lng' && dimensions[1] === 'lat';
}

var HeatmapView = function (_super) {
  tslib_1.__extends(HeatmapView, _super);

  function HeatmapView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = HeatmapView.type;
    return _this;
  }

  HeatmapView.prototype.render = function (seriesModel, ecModel, api) {
    var visualMapOfThisSeries;
    ecModel.eachComponent('visualMap', function (visualMap) {
      visualMap.eachTargetSeries(function (targetSeries) {
        if (targetSeries === seriesModel) {
          visualMapOfThisSeries = visualMap;
        }
      });
    });

    if (process.env.NODE_ENV !== 'production') {
      if (!visualMapOfThisSeries) {
        throw new Error('Heatmap must use with visualMap');
      }
    }

    this.group.removeAll();
    this._incrementalDisplayable = null;
    var coordSys = seriesModel.coordinateSystem;

    if (coordSys.type === 'cartesian2d' || coordSys.type === 'calendar') {
      this._renderOnCartesianAndCalendar(seriesModel, api, 0, seriesModel.getData().count());
    } else if (isGeoCoordSys(coordSys)) {
      this._renderOnGeo(coordSys, seriesModel, visualMapOfThisSeries, api);
    }
  };

  HeatmapView.prototype.incrementalPrepareRender = function (seriesModel, ecModel, api) {
    this.group.removeAll();
  };

  HeatmapView.prototype.incrementalRender = function (params, seriesModel, ecModel, api) {
    var coordSys = seriesModel.coordinateSystem;

    if (coordSys) {
      this._renderOnCartesianAndCalendar(seriesModel, api, params.start, params.end, true);
    }
  };

  HeatmapView.prototype._renderOnCartesianAndCalendar = function (seriesModel, api, start, end, incremental) {
    var coordSys = seriesModel.coordinateSystem;
    var width;
    var height;
    var xAxisExtent;
    var yAxisExtent;

    if (CoordinateSystem_1.isCoordinateSystemType(coordSys, 'cartesian2d')) {
      var xAxis = coordSys.getAxis('x');
      var yAxis = coordSys.getAxis('y');

      if (process.env.NODE_ENV !== 'production') {
        if (!(xAxis.type === 'category' && yAxis.type === 'category')) {
          throw new Error('Heatmap on cartesian must have two category axes');
        }

        if (!(xAxis.onBand && yAxis.onBand)) {
          throw new Error('Heatmap on cartesian must have two axes with boundaryGap true');
        }
      }

      width = xAxis.getBandWidth();
      height = yAxis.getBandWidth();
      xAxisExtent = xAxis.scale.getExtent();
      yAxisExtent = yAxis.scale.getExtent();
    }

    var group = this.group;
    var data = seriesModel.getData();
    var emphasisStyle = seriesModel.getModel(['emphasis', 'itemStyle']).getItemStyle();
    var blurStyle = seriesModel.getModel(['blur', 'itemStyle']).getItemStyle();
    var selectStyle = seriesModel.getModel(['select', 'itemStyle']).getItemStyle();
    var labelStatesModels = labelStyle_1.getLabelStatesModels(seriesModel);
    var focus = seriesModel.get(['emphasis', 'focus']);
    var blurScope = seriesModel.get(['emphasis', 'blurScope']);
    var dataDims = CoordinateSystem_1.isCoordinateSystemType(coordSys, 'cartesian2d') ? [data.mapDimension('x'), data.mapDimension('y'), data.mapDimension('value')] : [data.mapDimension('time'), data.mapDimension('value')];

    for (var idx = start; idx < end; idx++) {
      var rect = void 0;
      var style = data.getItemVisual(idx, 'style');

      if (CoordinateSystem_1.isCoordinateSystemType(coordSys, 'cartesian2d')) {
        var dataDimX = data.get(dataDims[0], idx);
        var dataDimY = data.get(dataDims[1], idx);

        if (isNaN(data.get(dataDims[2], idx)) || dataDimX < xAxisExtent[0] || dataDimX > xAxisExtent[1] || dataDimY < yAxisExtent[0] || dataDimY > yAxisExtent[1]) {
          continue;
        }

        var point = coordSys.dataToPoint([dataDimX, dataDimY]);
        rect = new graphic.Rect({
          shape: {
            x: Math.floor(Math.round(point[0]) - width / 2),
            y: Math.floor(Math.round(point[1]) - height / 2),
            width: Math.ceil(width),
            height: Math.ceil(height)
          },
          style: style
        });
      } else {
        if (isNaN(data.get(dataDims[1], idx))) {
          continue;
        }

        rect = new graphic.Rect({
          z2: 1,
          shape: coordSys.dataToRect([data.get(dataDims[0], idx)]).contentShape,
          style: style
        });
      }

      var itemModel = data.getItemModel(idx);

      if (data.hasItemOption) {
        var emphasisModel = itemModel.getModel('emphasis');
        emphasisStyle = emphasisModel.getModel('itemStyle').getItemStyle();
        blurStyle = itemModel.getModel(['blur', 'itemStyle']).getItemStyle();
        selectStyle = itemModel.getModel(['select', 'itemStyle']).getItemStyle();
        focus = emphasisModel.get('focus');
        blurScope = emphasisModel.get('blurScope');
        labelStatesModels = labelStyle_1.getLabelStatesModels(itemModel);
      }

      var rawValue = seriesModel.getRawValue(idx);
      var defaultText = '-';

      if (rawValue && rawValue[2] != null) {
        defaultText = rawValue[2] + '';
      }

      labelStyle_1.setLabelStyle(rect, labelStatesModels, {
        labelFetcher: seriesModel,
        labelDataIndex: idx,
        defaultOpacity: style.opacity,
        defaultText: defaultText
      });
      rect.ensureState('emphasis').style = emphasisStyle;
      rect.ensureState('blur').style = blurStyle;
      rect.ensureState('select').style = selectStyle;
      states_1.enableHoverEmphasis(rect, focus, blurScope);
      rect.incremental = incremental;

      if (incremental) {
        rect.states.emphasis.hoverLayer = true;
      }

      group.add(rect);
      data.setItemGraphicEl(idx, rect);
    }
  };

  HeatmapView.prototype._renderOnGeo = function (geo, seriesModel, visualMapModel, api) {
    var inRangeVisuals = visualMapModel.targetVisuals.inRange;
    var outOfRangeVisuals = visualMapModel.targetVisuals.outOfRange;
    var data = seriesModel.getData();
    var hmLayer = this._hmLayer || this._hmLayer || new HeatmapLayer_1["default"]();
    hmLayer.blurSize = seriesModel.get('blurSize');
    hmLayer.pointSize = seriesModel.get('pointSize');
    hmLayer.minOpacity = seriesModel.get('minOpacity');
    hmLayer.maxOpacity = seriesModel.get('maxOpacity');
    var rect = geo.getViewRect().clone();
    var roamTransform = geo.getRoamTransform();
    rect.applyTransform(roamTransform);
    var x = Math.max(rect.x, 0);
    var y = Math.max(rect.y, 0);
    var x2 = Math.min(rect.width + rect.x, api.getWidth());
    var y2 = Math.min(rect.height + rect.y, api.getHeight());
    var width = x2 - x;
    var height = y2 - y;
    var dims = [data.mapDimension('lng'), data.mapDimension('lat'), data.mapDimension('value')];
    var points = data.mapArray(dims, function (lng, lat, value) {
      var pt = geo.dataToPoint([lng, lat]);
      pt[0] -= x;
      pt[1] -= y;
      pt.push(value);
      return pt;
    });
    var dataExtent = visualMapModel.getExtent();
    var isInRange = visualMapModel.type === 'visualMap.continuous' ? getIsInContinuousRange(dataExtent, visualMapModel.option.range) : getIsInPiecewiseRange(dataExtent, visualMapModel.getPieceList(), visualMapModel.option.selected);
    hmLayer.update(points, width, height, inRangeVisuals.color.getNormalizer(), {
      inRange: inRangeVisuals.color.getColorMapper(),
      outOfRange: outOfRangeVisuals.color.getColorMapper()
    }, isInRange);
    var img = new graphic.Image({
      style: {
        width: width,
        height: height,
        x: x,
        y: y,
        image: hmLayer.canvas
      },
      silent: true
    });
    this.group.add(img);
  };

  HeatmapView.type = 'heatmap';
  return HeatmapView;
}(Chart_1["default"]);

Chart_1["default"].registerClass(HeatmapView);
exports["default"] = HeatmapView;