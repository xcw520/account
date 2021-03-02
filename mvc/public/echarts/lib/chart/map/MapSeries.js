
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

var createListSimply_1 = require("../helper/createListSimply");

var Series_1 = require("../../model/Series");

var geoSourceManager_1 = require("../../coord/geo/geoSourceManager");

var sourceHelper_1 = require("../../data/helper/sourceHelper");

var tooltipMarkup_1 = require("../../component/tooltip/tooltipMarkup");

var MapSeries = function (_super) {
  tslib_1.__extends(MapSeries, _super);

  function MapSeries() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = MapSeries.type;
    _this.needsDrawMap = false;
    _this.seriesGroup = [];

    _this.getTooltipPosition = function (dataIndex) {
      if (dataIndex != null) {
        var name_1 = this.getData().getName(dataIndex);
        var geo = this.coordinateSystem;
        var region = geo.getRegion(name_1);
        return region && geo.dataToPoint(region.center);
      }
    };

    return _this;
  }

  MapSeries.prototype.getInitialData = function (option) {
    var data = createListSimply_1["default"](this, {
      coordDimensions: ['value'],
      encodeDefaulter: zrUtil.curry(sourceHelper_1.makeSeriesEncodeForNameBased, this)
    });
    var dataNameMap = zrUtil.createHashMap();
    var toAppendNames = [];

    for (var i = 0, len = data.count(); i < len; i++) {
      var name_2 = data.getName(i);
      dataNameMap.set(name_2, true);
    }

    var geoSource = geoSourceManager_1["default"].load(this.getMapType(), this.option.nameMap, this.option.nameProperty);
    zrUtil.each(geoSource.regions, function (region) {
      var name = region.name;

      if (!dataNameMap.get(name)) {
        toAppendNames.push(name);
      }
    });
    data.appendValues([], toAppendNames);
    return data;
  };

  MapSeries.prototype.getHostGeoModel = function () {
    var geoIndex = this.option.geoIndex;
    return geoIndex != null ? this.ecModel.getComponent('geo', geoIndex) : null;
  };

  MapSeries.prototype.getMapType = function () {
    return (this.getHostGeoModel() || this).option.map;
  };

  MapSeries.prototype.getRawValue = function (dataIndex) {
    var data = this.getData();
    return data.get(data.mapDimension('value'), dataIndex);
  };

  MapSeries.prototype.getRegionModel = function (regionName) {
    var data = this.getData();
    return data.getItemModel(data.indexOfName(regionName));
  };

  MapSeries.prototype.formatTooltip = function (dataIndex, multipleSeries, dataType) {
    var data = this.getData();
    var value = this.getRawValue(dataIndex);
    var name = data.getName(dataIndex);
    var seriesGroup = this.seriesGroup;
    var seriesNames = [];

    for (var i = 0; i < seriesGroup.length; i++) {
      var otherIndex = seriesGroup[i].originalData.indexOfName(name);
      var valueDim = data.mapDimension('value');

      if (!isNaN(seriesGroup[i].originalData.get(valueDim, otherIndex))) {
        seriesNames.push(seriesGroup[i].name);
      }
    }

    return tooltipMarkup_1.createTooltipMarkup('section', {
      header: seriesNames.join(', '),
      noHeader: !seriesNames.length,
      blocks: [tooltipMarkup_1.createTooltipMarkup('nameValue', {
        name: name,
        value: value
      })]
    });
  };

  MapSeries.prototype.setZoom = function (zoom) {
    this.option.zoom = zoom;
  };

  MapSeries.prototype.setCenter = function (center) {
    this.option.center = center;
  };

  MapSeries.type = 'series.map';
  MapSeries.dependencies = ['geo'];
  MapSeries.layoutMode = 'box';
  MapSeries.defaultOption = {
    zlevel: 0,
    z: 2,
    coordinateSystem: 'geo',
    map: '',
    left: 'center',
    top: 'center',
    aspectScale: 0.75,
    showLegendSymbol: true,
    boundingCoords: null,
    center: null,
    zoom: 1,
    scaleLimit: null,
    selectedMode: true,
    label: {
      show: false,
      color: '#000'
    },
    itemStyle: {
      borderWidth: 0.5,
      borderColor: '#444',
      areaColor: '#eee'
    },
    emphasis: {
      label: {
        show: true,
        color: 'rgb(100,0,0)'
      },
      itemStyle: {
        areaColor: 'rgba(255,215,0,0.8)'
      }
    },
    select: {
      label: {
        show: true,
        color: 'rgb(100,0,0)'
      },
      itemStyle: {
        color: 'rgba(255,215,0,0.8)'
      }
    },
    nameProperty: 'name'
  };
  return MapSeries;
}(Series_1["default"]);

Series_1["default"].registerClass(MapSeries);
exports["default"] = MapSeries;