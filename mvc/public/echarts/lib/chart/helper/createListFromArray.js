
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

var zrUtil = require("zrender/lib/core/util");

var List_1 = require("../../data/List");

var createDimensions_1 = require("../../data/helper/createDimensions");

var dimensionHelper_1 = require("../../data/helper/dimensionHelper");

var model_1 = require("../../util/model");

var CoordinateSystem_1 = require("../../CoordinateSystem");

var referHelper_1 = require("../../model/referHelper");

var Source_1 = require("../../data/Source");

var dataStackHelper_1 = require("../../data/helper/dataStackHelper");

var sourceHelper_1 = require("../../data/helper/sourceHelper");

var types_1 = require("../../util/types");

function createListFromArray(source, seriesModel, opt) {
  opt = opt || {};

  if (!Source_1.isSourceInstance(source)) {
    source = Source_1.createSourceFromSeriesDataOption(source);
  }

  var coordSysName = seriesModel.get('coordinateSystem');
  var registeredCoordSys = CoordinateSystem_1["default"].get(coordSysName);
  var coordSysInfo = referHelper_1.getCoordSysInfoBySeries(seriesModel);
  var coordSysDimDefs;

  if (coordSysInfo && coordSysInfo.coordSysDims) {
    coordSysDimDefs = zrUtil.map(coordSysInfo.coordSysDims, function (dim) {
      var dimInfo = {
        name: dim
      };
      var axisModel = coordSysInfo.axisMap.get(dim);

      if (axisModel) {
        var axisType = axisModel.get('type');
        dimInfo.type = dimensionHelper_1.getDimensionTypeByAxis(axisType);
      }

      return dimInfo;
    });
  }

  if (!coordSysDimDefs) {
    coordSysDimDefs = registeredCoordSys && (registeredCoordSys.getDimensionsInfo ? registeredCoordSys.getDimensionsInfo() : registeredCoordSys.dimensions.slice()) || ['x', 'y'];
  }

  var useEncodeDefaulter = opt.useEncodeDefaulter;
  var dimInfoList = createDimensions_1["default"](source, {
    coordDimensions: coordSysDimDefs,
    generateCoord: opt.generateCoord,
    encodeDefaulter: zrUtil.isFunction(useEncodeDefaulter) ? useEncodeDefaulter : useEncodeDefaulter ? zrUtil.curry(sourceHelper_1.makeSeriesEncodeForAxisCoordSys, coordSysDimDefs, seriesModel) : null
  });
  var firstCategoryDimIndex;
  var hasNameEncode;
  coordSysInfo && zrUtil.each(dimInfoList, function (dimInfo, dimIndex) {
    var coordDim = dimInfo.coordDim;
    var categoryAxisModel = coordSysInfo.categoryAxisMap.get(coordDim);

    if (categoryAxisModel) {
      if (firstCategoryDimIndex == null) {
        firstCategoryDimIndex = dimIndex;
      }

      dimInfo.ordinalMeta = categoryAxisModel.getOrdinalMeta();
    }

    if (dimInfo.otherDims.itemName != null) {
      hasNameEncode = true;
    }
  });

  if (!hasNameEncode && firstCategoryDimIndex != null) {
    dimInfoList[firstCategoryDimIndex].otherDims.itemName = 0;
  }

  var stackCalculationInfo = dataStackHelper_1.enableDataStack(seriesModel, dimInfoList);
  var list = new List_1["default"](dimInfoList, seriesModel);
  list.setCalculationInfo(stackCalculationInfo);
  var dimValueGetter = firstCategoryDimIndex != null && isNeedCompleteOrdinalData(source) ? function (itemOpt, dimName, dataIndex, dimIndex) {
    return dimIndex === firstCategoryDimIndex ? dataIndex : this.defaultDimValueGetter(itemOpt, dimName, dataIndex, dimIndex);
  } : null;
  list.hasItemOption = false;
  list.initData(source, null, dimValueGetter);
  return list;
}

function isNeedCompleteOrdinalData(source) {
  if (source.sourceFormat === types_1.SOURCE_FORMAT_ORIGINAL) {
    var sampleItem = firstDataNotNull(source.data || []);
    return sampleItem != null && !zrUtil.isArray(model_1.getDataItemValue(sampleItem));
  }
}

function firstDataNotNull(data) {
  var i = 0;

  while (i < data.length && data[i] == null) {
    i++;
  }

  return data[i];
}

exports["default"] = createListFromArray;