
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

var dataProvider_1 = require("../../data/helper/dataProvider");

var util_1 = require("zrender/lib/core/util");

function getDefaultLabel(data, dataIndex) {
  var labelDims = data.mapDimensionsAll('defaultedLabel');
  var len = labelDims.length;

  if (len === 1) {
    return dataProvider_1.retrieveRawValue(data, dataIndex, labelDims[0]);
  } else if (len) {
    var vals = [];

    for (var i = 0; i < labelDims.length; i++) {
      vals.push(dataProvider_1.retrieveRawValue(data, dataIndex, labelDims[i]));
    }

    return vals.join(' ');
  }
}

exports.getDefaultLabel = getDefaultLabel;

function getDefaultInterpolatedLabel(data, interpolatedValue) {
  var labelDims = data.mapDimensionsAll('defaultedLabel');

  if (!util_1.isArray(interpolatedValue)) {
    return interpolatedValue + '';
  }

  var vals = [];

  for (var i = 0; i < labelDims.length; i++) {
    var dimInfo = data.getDimensionInfo(labelDims[i]);

    if (dimInfo) {
      vals.push(interpolatedValue[dimInfo.index]);
    }
  }

  return vals.join(' ');
}

exports.getDefaultInterpolatedLabel = getDefaultInterpolatedLabel;