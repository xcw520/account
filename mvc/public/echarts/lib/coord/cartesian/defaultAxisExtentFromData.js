
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

var echarts = require("../../echarts");

var util_1 = require("zrender/lib/core/util");

var cartesianAxisHelper_1 = require("./cartesianAxisHelper");

var axisHelper_1 = require("../axisHelper");

var scaleRawExtentInfo_1 = require("../scaleRawExtentInfo");

echarts.registerProcessor(echarts.PRIORITY.PROCESSOR.FILTER + 10, {
  getTargetSeries: function (ecModel) {
    var seriesModelMap = util_1.createHashMap();
    ecModel.eachSeries(function (seriesModel) {
      cartesianAxisHelper_1.isCartesian2DSeries(seriesModel) && seriesModelMap.set(seriesModel.uid, seriesModel);
    });
    return seriesModelMap;
  },
  overallReset: function (ecModel, api) {
    var seriesRecords = [];
    var axisRecordMap = util_1.createHashMap();
    prepareDataExtentOnAxis(ecModel, axisRecordMap, seriesRecords);
    calculateFilteredExtent(axisRecordMap, seriesRecords);
    shrinkAxisExtent(axisRecordMap);
  }
});

function prepareDataExtentOnAxis(ecModel, axisRecordMap, seriesRecords) {
  ecModel.eachSeries(function (seriesModel) {
    if (!cartesianAxisHelper_1.isCartesian2DSeries(seriesModel)) {
      return;
    }

    var axesModelMap = cartesianAxisHelper_1.findAxisModels(seriesModel);
    var xAxisModel = axesModelMap.xAxisModel;
    var yAxisModel = axesModelMap.yAxisModel;
    var xAxis = xAxisModel.axis;
    var yAxis = yAxisModel.axis;
    var xRawExtentInfo = xAxis.scale.rawExtentInfo;
    var yRawExtentInfo = yAxis.scale.rawExtentInfo;
    var data = seriesModel.getData();

    if (xRawExtentInfo && xRawExtentInfo.frozen || yRawExtentInfo && yRawExtentInfo.frozen) {
      return;
    }

    seriesRecords.push({
      seriesModel: seriesModel,
      xAxisModel: xAxisModel,
      yAxisModel: yAxisModel
    });
    axisHelper_1.unionAxisExtentFromData(prepareAxisRecord(axisRecordMap, xAxisModel).condExtent, data, xAxis.dim);
    axisHelper_1.unionAxisExtentFromData(prepareAxisRecord(axisRecordMap, yAxisModel).condExtent, data, yAxis.dim);
  });
}

function calculateFilteredExtent(axisRecordMap, seriesRecords) {
  util_1.each(seriesRecords, function (seriesRecord) {
    var xAxisModel = seriesRecord.xAxisModel;
    var yAxisModel = seriesRecord.yAxisModel;
    var xAxis = xAxisModel.axis;
    var yAxis = yAxisModel.axis;
    var xAxisRecord = prepareAxisRecord(axisRecordMap, xAxisModel);
    var yAxisRecord = prepareAxisRecord(axisRecordMap, yAxisModel);
    xAxisRecord.rawExtentInfo = scaleRawExtentInfo_1.ensureScaleRawExtentInfo(xAxis.scale, xAxisModel, xAxisRecord.condExtent);
    yAxisRecord.rawExtentInfo = scaleRawExtentInfo_1.ensureScaleRawExtentInfo(yAxis.scale, yAxisModel, yAxisRecord.condExtent);
    xAxisRecord.rawExtentResult = xAxisRecord.rawExtentInfo.calculate();
    yAxisRecord.rawExtentResult = yAxisRecord.rawExtentInfo.calculate();
    var data = seriesRecord.seriesModel.getData();
    var condDimMap = {};
    var tarDimMap = {};
    var condAxis;
    var tarAxisRecord;

    function addCondition(axis, axisRecord) {
      var condExtent = axisRecord.condExtent;
      var rawExtentResult = axisRecord.rawExtentResult;

      if (axis.type === 'category' && (condExtent[0] < rawExtentResult.min || rawExtentResult.max < condExtent[1])) {
        util_1.each(axisHelper_1.getDataDimensionsOnAxis(data, axis.dim), function (dataDim) {
          if (!util_1.hasOwn(condDimMap, dataDim)) {
            condDimMap[dataDim] = true;
            condAxis = axis;
          }
        });
      }
    }

    function addTarget(axis, axisRecord) {
      var rawExtentResult = axisRecord.rawExtentResult;

      if (axis.type !== 'category' && (!rawExtentResult.minFixed || !rawExtentResult.maxFixed)) {
        util_1.each(axisHelper_1.getDataDimensionsOnAxis(data, axis.dim), function (dataDim) {
          if (!util_1.hasOwn(condDimMap, dataDim) && !util_1.hasOwn(tarDimMap, dataDim)) {
            tarDimMap[dataDim] = true;
            tarAxisRecord = axisRecord;
          }
        });
      }
    }

    addCondition(xAxis, xAxisRecord);
    addCondition(yAxis, yAxisRecord);
    addTarget(xAxis, xAxisRecord);
    addTarget(yAxis, yAxisRecord);
    var condDims = util_1.keys(condDimMap);
    var tarDims = util_1.keys(tarDimMap);
    var tarDimExtents = util_1.map(tarDims, function () {
      return initExtent();
    });
    var condDimsLen = condDims.length;
    var tarDimsLen = tarDims.length;

    if (!condDimsLen || !tarDimsLen) {
      return;
    }

    var singleCondDim = condDimsLen === 1 ? condDims[0] : null;
    var singleTarDim = tarDimsLen === 1 ? tarDims[0] : null;
    var dataLen = data.count();

    if (singleCondDim && singleTarDim) {
      for (var dataIdx = 0; dataIdx < dataLen; dataIdx++) {
        var condVal = data.get(singleCondDim, dataIdx);

        if (condAxis.scale.isInExtentRange(condVal)) {
          unionExtent(tarDimExtents[0], data.get(singleTarDim, dataIdx));
        }
      }
    } else {
      for (var dataIdx = 0; dataIdx < dataLen; dataIdx++) {
        for (var j = 0; j < condDimsLen; j++) {
          var condVal = data.get(condDims[j], dataIdx);

          if (condAxis.scale.isInExtentRange(condVal)) {
            for (var k = 0; k < tarDimsLen; k++) {
              unionExtent(tarDimExtents[k], data.get(tarDims[k], dataIdx));
            }

            break;
          }
        }
      }
    }

    util_1.each(tarDimExtents, function (tarDimExtent, i) {
      var dim = tarDims[i];
      data.setApproximateExtent(tarDimExtent, dim);
      var tarAxisExtent = tarAxisRecord.tarExtent = tarAxisRecord.tarExtent || initExtent();
      unionExtent(tarAxisExtent, tarDimExtent[0]);
      unionExtent(tarAxisExtent, tarDimExtent[1]);
    });
  });
}

function shrinkAxisExtent(axisRecordMap) {
  axisRecordMap.each(function (axisRecord) {
    var tarAxisExtent = axisRecord.tarExtent;

    if (tarAxisExtent) {
      var rawExtentResult = axisRecord.rawExtentResult;
      var rawExtentInfo = axisRecord.rawExtentInfo;

      if (!rawExtentResult.minFixed && tarAxisExtent[0] > rawExtentResult.min) {
        rawExtentInfo.modifyDataMinMax('min', tarAxisExtent[0]);
      }

      if (!rawExtentResult.maxFixed && tarAxisExtent[1] < rawExtentResult.max) {
        rawExtentInfo.modifyDataMinMax('max', tarAxisExtent[1]);
      }
    }
  });
}

function prepareAxisRecord(axisRecordMap, axisModel) {
  return axisRecordMap.get(axisModel.uid) || axisRecordMap.set(axisModel.uid, {
    condExtent: initExtent()
  });
}

function initExtent() {
  return [Infinity, -Infinity];
}

function unionExtent(extent, val) {
  val < extent[0] && (extent[0] = val);
  val > extent[1] && (extent[1] = val);
}