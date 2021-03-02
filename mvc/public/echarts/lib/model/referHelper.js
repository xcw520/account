
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

var util_1 = require("zrender/lib/core/util");

var model_1 = require("../util/model");

var CoordSysInfo = function () {
  function CoordSysInfo(coordSysName) {
    this.coordSysDims = [];
    this.axisMap = util_1.createHashMap();
    this.categoryAxisMap = util_1.createHashMap();
    this.coordSysName = coordSysName;
  }

  return CoordSysInfo;
}();

function getCoordSysInfoBySeries(seriesModel) {
  var coordSysName = seriesModel.get('coordinateSystem');
  var result = new CoordSysInfo(coordSysName);
  var fetch = fetchers[coordSysName];

  if (fetch) {
    fetch(seriesModel, result, result.axisMap, result.categoryAxisMap);
    return result;
  }
}

exports.getCoordSysInfoBySeries = getCoordSysInfoBySeries;
var fetchers = {
  cartesian2d: function (seriesModel, result, axisMap, categoryAxisMap) {
    var xAxisModel = seriesModel.getReferringComponents('xAxis', model_1.SINGLE_REFERRING).models[0];
    var yAxisModel = seriesModel.getReferringComponents('yAxis', model_1.SINGLE_REFERRING).models[0];

    if (process.env.NODE_ENV !== 'production') {
      if (!xAxisModel) {
        throw new Error('xAxis "' + util_1.retrieve(seriesModel.get('xAxisIndex'), seriesModel.get('xAxisId'), 0) + '" not found');
      }

      if (!yAxisModel) {
        throw new Error('yAxis "' + util_1.retrieve(seriesModel.get('xAxisIndex'), seriesModel.get('yAxisId'), 0) + '" not found');
      }
    }

    result.coordSysDims = ['x', 'y'];
    axisMap.set('x', xAxisModel);
    axisMap.set('y', yAxisModel);

    if (isCategory(xAxisModel)) {
      categoryAxisMap.set('x', xAxisModel);
      result.firstCategoryDimIndex = 0;
    }

    if (isCategory(yAxisModel)) {
      categoryAxisMap.set('y', yAxisModel);
      result.firstCategoryDimIndex == null && (result.firstCategoryDimIndex = 1);
    }
  },
  singleAxis: function (seriesModel, result, axisMap, categoryAxisMap) {
    var singleAxisModel = seriesModel.getReferringComponents('singleAxis', model_1.SINGLE_REFERRING).models[0];

    if (process.env.NODE_ENV !== 'production') {
      if (!singleAxisModel) {
        throw new Error('singleAxis should be specified.');
      }
    }

    result.coordSysDims = ['single'];
    axisMap.set('single', singleAxisModel);

    if (isCategory(singleAxisModel)) {
      categoryAxisMap.set('single', singleAxisModel);
      result.firstCategoryDimIndex = 0;
    }
  },
  polar: function (seriesModel, result, axisMap, categoryAxisMap) {
    var polarModel = seriesModel.getReferringComponents('polar', model_1.SINGLE_REFERRING).models[0];
    var radiusAxisModel = polarModel.findAxisModel('radiusAxis');
    var angleAxisModel = polarModel.findAxisModel('angleAxis');

    if (process.env.NODE_ENV !== 'production') {
      if (!angleAxisModel) {
        throw new Error('angleAxis option not found');
      }

      if (!radiusAxisModel) {
        throw new Error('radiusAxis option not found');
      }
    }

    result.coordSysDims = ['radius', 'angle'];
    axisMap.set('radius', radiusAxisModel);
    axisMap.set('angle', angleAxisModel);

    if (isCategory(radiusAxisModel)) {
      categoryAxisMap.set('radius', radiusAxisModel);
      result.firstCategoryDimIndex = 0;
    }

    if (isCategory(angleAxisModel)) {
      categoryAxisMap.set('angle', angleAxisModel);
      result.firstCategoryDimIndex == null && (result.firstCategoryDimIndex = 1);
    }
  },
  geo: function (seriesModel, result, axisMap, categoryAxisMap) {
    result.coordSysDims = ['lng', 'lat'];
  },
  parallel: function (seriesModel, result, axisMap, categoryAxisMap) {
    var ecModel = seriesModel.ecModel;
    var parallelModel = ecModel.getComponent('parallel', seriesModel.get('parallelIndex'));
    var coordSysDims = result.coordSysDims = parallelModel.dimensions.slice();
    util_1.each(parallelModel.parallelAxisIndex, function (axisIndex, index) {
      var axisModel = ecModel.getComponent('parallelAxis', axisIndex);
      var axisDim = coordSysDims[index];
      axisMap.set(axisDim, axisModel);

      if (isCategory(axisModel)) {
        categoryAxisMap.set(axisDim, axisModel);

        if (result.firstCategoryDimIndex == null) {
          result.firstCategoryDimIndex = index;
        }
      }
    });
  }
};

function isCategory(axisModel) {
  return axisModel.get('type') === 'category';
}