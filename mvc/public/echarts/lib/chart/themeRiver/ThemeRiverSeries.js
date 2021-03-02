
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

var Series_1 = require("../../model/Series");

var createDimensions_1 = require("../../data/helper/createDimensions");

var dimensionHelper_1 = require("../../data/helper/dimensionHelper");

var List_1 = require("../../data/List");

var zrUtil = require("zrender/lib/core/util");

var model_1 = require("../../util/model");

var LegendVisualProvider_1 = require("../../visual/LegendVisualProvider");

var tooltipMarkup_1 = require("../../component/tooltip/tooltipMarkup");

var DATA_NAME_INDEX = 2;

var ThemeRiverSeriesModel = function (_super) {
  tslib_1.__extends(ThemeRiverSeriesModel, _super);

  function ThemeRiverSeriesModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = ThemeRiverSeriesModel.type;
    _this.useColorPaletteOnData = true;
    return _this;
  }

  ThemeRiverSeriesModel.prototype.init = function (option) {
    _super.prototype.init.apply(this, arguments);

    this.legendVisualProvider = new LegendVisualProvider_1["default"](zrUtil.bind(this.getData, this), zrUtil.bind(this.getRawData, this));
  };

  ThemeRiverSeriesModel.prototype.fixData = function (data) {
    var rawDataLength = data.length;
    var timeValueKeys = {};
    var groupResult = model_1.groupData(data, function (item) {
      if (!timeValueKeys.hasOwnProperty(item[0] + '')) {
        timeValueKeys[item[0] + ''] = -1;
      }

      return item[2];
    });
    var layerData = [];
    groupResult.buckets.each(function (items, key) {
      layerData.push({
        name: key,
        dataList: items
      });
    });
    var layerNum = layerData.length;

    for (var k = 0; k < layerNum; ++k) {
      var name_1 = layerData[k].name;

      for (var j = 0; j < layerData[k].dataList.length; ++j) {
        var timeValue = layerData[k].dataList[j][0] + '';
        timeValueKeys[timeValue] = k;
      }

      for (var timeValue in timeValueKeys) {
        if (timeValueKeys.hasOwnProperty(timeValue) && timeValueKeys[timeValue] !== k) {
          timeValueKeys[timeValue] = k;
          data[rawDataLength] = [timeValue, 0, name_1];
          rawDataLength++;
        }
      }
    }

    return data;
  };

  ThemeRiverSeriesModel.prototype.getInitialData = function (option, ecModel) {
    var singleAxisModel = this.getReferringComponents('singleAxis', model_1.SINGLE_REFERRING).models[0];
    var axisType = singleAxisModel.get('type');
    var filterData = zrUtil.filter(option.data, function (dataItem) {
      return dataItem[2] !== undefined;
    });
    var data = this.fixData(filterData || []);
    var nameList = [];
    var nameMap = this.nameMap = zrUtil.createHashMap();
    var count = 0;

    for (var i = 0; i < data.length; ++i) {
      nameList.push(data[i][DATA_NAME_INDEX]);

      if (!nameMap.get(data[i][DATA_NAME_INDEX])) {
        nameMap.set(data[i][DATA_NAME_INDEX], count);
        count++;
      }
    }

    var dimensionsInfo = createDimensions_1["default"](data, {
      coordDimensions: ['single'],
      dimensionsDefine: [{
        name: 'time',
        type: dimensionHelper_1.getDimensionTypeByAxis(axisType)
      }, {
        name: 'value',
        type: 'float'
      }, {
        name: 'name',
        type: 'ordinal'
      }],
      encodeDefine: {
        single: 0,
        value: 1,
        itemName: 2
      }
    });
    var list = new List_1["default"](dimensionsInfo, this);
    list.initData(data);
    return list;
  };

  ThemeRiverSeriesModel.prototype.getLayerSeries = function () {
    var data = this.getData();
    var lenCount = data.count();
    var indexArr = [];

    for (var i = 0; i < lenCount; ++i) {
      indexArr[i] = i;
    }

    var timeDim = data.mapDimension('single');
    var groupResult = model_1.groupData(indexArr, function (index) {
      return data.get('name', index);
    });
    var layerSeries = [];
    groupResult.buckets.each(function (items, key) {
      items.sort(function (index1, index2) {
        return data.get(timeDim, index1) - data.get(timeDim, index2);
      });
      layerSeries.push({
        name: key,
        indices: items
      });
    });
    return layerSeries;
  };

  ThemeRiverSeriesModel.prototype.getAxisTooltipData = function (dim, value, baseAxis) {
    if (!zrUtil.isArray(dim)) {
      dim = dim ? [dim] : [];
    }

    var data = this.getData();
    var layerSeries = this.getLayerSeries();
    var indices = [];
    var layerNum = layerSeries.length;
    var nestestValue;

    for (var i = 0; i < layerNum; ++i) {
      var minDist = Number.MAX_VALUE;
      var nearestIdx = -1;
      var pointNum = layerSeries[i].indices.length;

      for (var j = 0; j < pointNum; ++j) {
        var theValue = data.get(dim[0], layerSeries[i].indices[j]);
        var dist = Math.abs(theValue - value);

        if (dist <= minDist) {
          nestestValue = theValue;
          minDist = dist;
          nearestIdx = layerSeries[i].indices[j];
        }
      }

      indices.push(nearestIdx);
    }

    return {
      dataIndices: indices,
      nestestValue: nestestValue
    };
  };

  ThemeRiverSeriesModel.prototype.formatTooltip = function (dataIndex, multipleSeries, dataType) {
    var data = this.getData();
    var name = data.getName(dataIndex);
    var value = data.get(data.mapDimension('value'), dataIndex);
    return tooltipMarkup_1.createTooltipMarkup('nameValue', {
      name: name,
      value: value
    });
  };

  ThemeRiverSeriesModel.type = 'series.themeRiver';
  ThemeRiverSeriesModel.dependencies = ['singleAxis'];
  ThemeRiverSeriesModel.defaultOption = {
    zlevel: 0,
    z: 2,
    coordinateSystem: 'singleAxis',
    boundaryGap: ['10%', '10%'],
    singleAxisIndex: 0,
    animationEasing: 'linear',
    label: {
      margin: 4,
      show: true,
      position: 'left',
      fontSize: 11
    },
    emphasis: {
      label: {
        show: true
      }
    }
  };
  return ThemeRiverSeriesModel;
}(Series_1["default"]);

Series_1["default"].registerClass(ThemeRiverSeriesModel);
exports["default"] = ThemeRiverSeriesModel;