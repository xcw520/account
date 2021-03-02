
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

var tooltipMarkup_1 = require("./tooltipMarkup");

var dataProvider_1 = require("../../data/helper/dataProvider");

var model_1 = require("../../util/model");

function defaultSeriesFormatTooltip(opt) {
  var series = opt.series;
  var dataIndex = opt.dataIndex;
  var multipleSeries = opt.multipleSeries;
  var data = series.getData();
  var tooltipDims = data.mapDimensionsAll('defaultedTooltip');
  var tooltipDimLen = tooltipDims.length;
  var value = series.getRawValue(dataIndex);
  var isValueArr = util_1.isArray(value);
  var markerColor = tooltipMarkup_1.retrieveVisualColorForTooltipMarker(series, dataIndex);
  var inlineValue;
  var inlineValueType;
  var subBlocks;
  var sortParam;

  if (tooltipDimLen > 1 || isValueArr && !tooltipDimLen) {
    var formatArrResult = formatTooltipArrayValue(value, series, dataIndex, tooltipDims, markerColor);
    inlineValue = formatArrResult.inlineValues;
    inlineValueType = formatArrResult.inlineValueTypes;
    subBlocks = formatArrResult.blocks;
    sortParam = formatArrResult.inlineValues[0];
  } else if (tooltipDimLen) {
    var dimInfo = data.getDimensionInfo(tooltipDims[0]);
    sortParam = inlineValue = dataProvider_1.retrieveRawValue(data, dataIndex, tooltipDims[0]);
    inlineValueType = dimInfo.type;
  } else {
    sortParam = inlineValue = isValueArr ? value[0] : value;
  }

  var seriesNameSpecified = model_1.isNameSpecified(series);
  var seriesName = seriesNameSpecified && series.name || '';
  var itemName = data.getName(dataIndex);
  var inlineName = multipleSeries ? seriesName : itemName;
  return tooltipMarkup_1.createTooltipMarkup('section', {
    header: seriesName,
    noHeader: multipleSeries || !seriesNameSpecified,
    sortParam: sortParam,
    blocks: [tooltipMarkup_1.createTooltipMarkup('nameValue', {
      markerType: 'item',
      markerColor: markerColor,
      name: inlineName,
      noName: !util_1.trim(inlineName),
      value: inlineValue,
      valueType: inlineValueType
    })].concat(subBlocks || [])
  });
}

exports.defaultSeriesFormatTooltip = defaultSeriesFormatTooltip;

function formatTooltipArrayValue(value, series, dataIndex, tooltipDims, colorStr) {
  var data = series.getData();
  var isValueMultipleLine = util_1.reduce(value, function (isValueMultipleLine, val, idx) {
    var dimItem = data.getDimensionInfo(idx);
    return isValueMultipleLine = isValueMultipleLine || dimItem && dimItem.tooltip !== false && dimItem.displayName != null;
  }, false);
  var inlineValues = [];
  var inlineValueTypes = [];
  var blocks = [];
  tooltipDims.length ? util_1.each(tooltipDims, function (dim) {
    setEachItem(dataProvider_1.retrieveRawValue(data, dataIndex, dim), dim);
  }) : util_1.each(value, setEachItem);

  function setEachItem(val, dim) {
    var dimInfo = data.getDimensionInfo(dim);

    if (!dimInfo || dimInfo.otherDims.tooltip === false) {
      return;
    }

    if (isValueMultipleLine) {
      blocks.push(tooltipMarkup_1.createTooltipMarkup('nameValue', {
        markerType: 'subItem',
        markerColor: colorStr,
        name: dimInfo.displayName,
        value: val,
        valueType: dimInfo.type
      }));
    } else {
      inlineValues.push(val);
      inlineValueTypes.push(dimInfo.type);
    }
  }

  return {
    inlineValues: inlineValues,
    inlineValueTypes: inlineValueTypes,
    blocks: blocks
  };
}