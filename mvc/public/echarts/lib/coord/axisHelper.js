
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

var Ordinal_1 = require("../scale/Ordinal");

var Interval_1 = require("../scale/Interval");

var Scale_1 = require("../scale/Scale");

var barGrid_1 = require("../layout/barGrid");

var BoundingRect_1 = require("zrender/lib/core/BoundingRect");

var Time_1 = require("../scale/Time");

var Log_1 = require("../scale/Log");

var dataStackHelper_1 = require("../data/helper/dataStackHelper");

var scaleRawExtentInfo_1 = require("./scaleRawExtentInfo");

function getScaleExtent(scale, model) {
  var scaleType = scale.type;
  var rawExtentResult = scaleRawExtentInfo_1.ensureScaleRawExtentInfo(scale, model, scale.getExtent()).calculate();
  scale.setBlank(rawExtentResult.isBlank);
  var min = rawExtentResult.min;
  var max = rawExtentResult.max;
  var ecModel = model.ecModel;

  if (ecModel && scaleType === 'time') {
    var barSeriesModels = barGrid_1.prepareLayoutBarSeries('bar', ecModel);
    var isBaseAxisAndHasBarSeries_1 = false;
    zrUtil.each(barSeriesModels, function (seriesModel) {
      isBaseAxisAndHasBarSeries_1 = isBaseAxisAndHasBarSeries_1 || seriesModel.getBaseAxis() === model.axis;
    });

    if (isBaseAxisAndHasBarSeries_1) {
      var barWidthAndOffset = barGrid_1.makeColumnLayout(barSeriesModels);
      var adjustedScale = adjustScaleForOverflow(min, max, model, barWidthAndOffset);
      min = adjustedScale.min;
      max = adjustedScale.max;
    }
  }

  return {
    extent: [min, max],
    fixMin: rawExtentResult.minFixed,
    fixMax: rawExtentResult.maxFixed
  };
}

exports.getScaleExtent = getScaleExtent;

function adjustScaleForOverflow(min, max, model, barWidthAndOffset) {
  var axisExtent = model.axis.getExtent();
  var axisLength = axisExtent[1] - axisExtent[0];
  var barsOnCurrentAxis = barGrid_1.retrieveColumnLayout(barWidthAndOffset, model.axis);

  if (barsOnCurrentAxis === undefined) {
    return {
      min: min,
      max: max
    };
  }

  var minOverflow = Infinity;
  zrUtil.each(barsOnCurrentAxis, function (item) {
    minOverflow = Math.min(item.offset, minOverflow);
  });
  var maxOverflow = -Infinity;
  zrUtil.each(barsOnCurrentAxis, function (item) {
    maxOverflow = Math.max(item.offset + item.width, maxOverflow);
  });
  minOverflow = Math.abs(minOverflow);
  maxOverflow = Math.abs(maxOverflow);
  var totalOverFlow = minOverflow + maxOverflow;
  var oldRange = max - min;
  var oldRangePercentOfNew = 1 - (minOverflow + maxOverflow) / axisLength;
  var overflowBuffer = oldRange / oldRangePercentOfNew - oldRange;
  max += overflowBuffer * (maxOverflow / totalOverFlow);
  min -= overflowBuffer * (minOverflow / totalOverFlow);
  return {
    min: min,
    max: max
  };
}

function niceScaleExtent(scale, model) {
  var extentInfo = getScaleExtent(scale, model);
  var extent = extentInfo.extent;
  var splitNumber = model.get('splitNumber');

  if (scale instanceof Log_1["default"]) {
    scale.base = model.get('logBase');
  }

  var scaleType = scale.type;
  scale.setExtent(extent[0], extent[1]);
  scale.niceExtent({
    splitNumber: splitNumber,
    fixMin: extentInfo.fixMin,
    fixMax: extentInfo.fixMax,
    minInterval: scaleType === 'interval' || scaleType === 'time' ? model.get('minInterval') : null,
    maxInterval: scaleType === 'interval' || scaleType === 'time' ? model.get('maxInterval') : null
  });
  var interval = model.get('interval');

  if (interval != null) {
    scale.setInterval && scale.setInterval(interval);
  }
}

exports.niceScaleExtent = niceScaleExtent;

function createScaleByModel(model, axisType) {
  axisType = axisType || model.get('type');

  if (axisType) {
    switch (axisType) {
      case 'category':
        return new Ordinal_1["default"]({
          ordinalMeta: model.getOrdinalMeta ? model.getOrdinalMeta() : model.getCategories(),
          extent: [Infinity, -Infinity]
        });

      case 'time':
        return new Time_1["default"]({
          locale: model.ecModel.getLocaleModel(),
          useUTC: model.ecModel.get('useUTC')
        });

      default:
        return new (Scale_1["default"].getClass(axisType) || Interval_1["default"])();
    }
  }
}

exports.createScaleByModel = createScaleByModel;

function ifAxisCrossZero(axis) {
  var dataExtent = axis.scale.getExtent();
  var min = dataExtent[0];
  var max = dataExtent[1];
  return !(min > 0 && max > 0 || min < 0 && max < 0);
}

exports.ifAxisCrossZero = ifAxisCrossZero;

function makeLabelFormatter(axis) {
  var labelFormatter = axis.getLabelModel().get('formatter');
  var categoryTickStart = axis.type === 'category' ? axis.scale.getExtent()[0] : null;

  if (axis.scale.type === 'time') {
    return function (tpl) {
      return function (tick, idx) {
        return axis.scale.getFormattedLabel(tick, idx, tpl);
      };
    }(labelFormatter);
  } else if (typeof labelFormatter === 'string') {
    return function (tpl) {
      return function (tick) {
        var label = axis.scale.getLabel(tick);
        var text = tpl.replace('{value}', label != null ? label : '');
        return text;
      };
    }(labelFormatter);
  } else if (typeof labelFormatter === 'function') {
    return function (cb) {
      return function (tick, idx) {
        if (categoryTickStart != null) {
          idx = tick.value - categoryTickStart;
        }

        return cb(getAxisRawValue(axis, tick), idx, tick.level != null ? {
          level: tick.level
        } : null);
      };
    }(labelFormatter);
  } else {
    return function (tick) {
      return axis.scale.getLabel(tick);
    };
  }
}

exports.makeLabelFormatter = makeLabelFormatter;

function getAxisRawValue(axis, tick) {
  return axis.type === 'category' ? axis.scale.getLabel(tick) : tick.value;
}

exports.getAxisRawValue = getAxisRawValue;

function estimateLabelUnionRect(axis) {
  var axisModel = axis.model;
  var scale = axis.scale;

  if (!axisModel.get(['axisLabel', 'show']) || scale.isBlank()) {
    return;
  }

  var realNumberScaleTicks;
  var tickCount;
  var categoryScaleExtent = scale.getExtent();

  if (scale instanceof Ordinal_1["default"]) {
    tickCount = scale.count();
  } else {
    realNumberScaleTicks = scale.getTicks();
    tickCount = realNumberScaleTicks.length;
  }

  var axisLabelModel = axis.getLabelModel();
  var labelFormatter = makeLabelFormatter(axis);
  var rect;
  var step = 1;

  if (tickCount > 40) {
    step = Math.ceil(tickCount / 40);
  }

  for (var i = 0; i < tickCount; i += step) {
    var tick = realNumberScaleTicks ? realNumberScaleTicks[i] : {
      value: categoryScaleExtent[0] + i
    };
    var label = labelFormatter(tick, i);
    var unrotatedSingleRect = axisLabelModel.getTextRect(label);
    var singleRect = rotateTextRect(unrotatedSingleRect, axisLabelModel.get('rotate') || 0);
    rect ? rect.union(singleRect) : rect = singleRect;
  }

  return rect;
}

exports.estimateLabelUnionRect = estimateLabelUnionRect;

function rotateTextRect(textRect, rotate) {
  var rotateRadians = rotate * Math.PI / 180;
  var beforeWidth = textRect.width;
  var beforeHeight = textRect.height;
  var afterWidth = beforeWidth * Math.abs(Math.cos(rotateRadians)) + Math.abs(beforeHeight * Math.sin(rotateRadians));
  var afterHeight = beforeWidth * Math.abs(Math.sin(rotateRadians)) + Math.abs(beforeHeight * Math.cos(rotateRadians));
  var rotatedRect = new BoundingRect_1["default"](textRect.x, textRect.y, afterWidth, afterHeight);
  return rotatedRect;
}

function getOptionCategoryInterval(model) {
  var interval = model.get('interval');
  return interval == null ? 'auto' : interval;
}

exports.getOptionCategoryInterval = getOptionCategoryInterval;

function shouldShowAllLabels(axis) {
  return axis.type === 'category' && getOptionCategoryInterval(axis.getLabelModel()) === 0;
}

exports.shouldShowAllLabels = shouldShowAllLabels;

function getDataDimensionsOnAxis(data, axisDim) {
  var dataDimMap = {};
  zrUtil.each(data.mapDimensionsAll(axisDim), function (dataDim) {
    dataDimMap[dataStackHelper_1.getStackedDimension(data, dataDim)] = true;
  });
  return zrUtil.keys(dataDimMap);
}

exports.getDataDimensionsOnAxis = getDataDimensionsOnAxis;

function unionAxisExtentFromData(dataExtent, data, axisDim) {
  if (data) {
    zrUtil.each(getDataDimensionsOnAxis(data, axisDim), function (dim) {
      var seriesExtent = data.getApproximateExtent(dim);
      seriesExtent[0] < dataExtent[0] && (dataExtent[0] = seriesExtent[0]);
      seriesExtent[1] > dataExtent[1] && (dataExtent[1] = seriesExtent[1]);
    });
  }
}

exports.unionAxisExtentFromData = unionAxisExtentFromData;