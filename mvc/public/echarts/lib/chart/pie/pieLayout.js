
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

var number_1 = require("../../util/number");

var layout = require("../../util/layout");

var zrUtil = require("zrender/lib/core/util");

var PI2 = Math.PI * 2;
var RADIAN = Math.PI / 180;

function getViewRect(seriesModel, api) {
  return layout.getLayoutRect(seriesModel.getBoxLayoutParams(), {
    width: api.getWidth(),
    height: api.getHeight()
  });
}

function pieLayout(seriesType, ecModel, api) {
  ecModel.eachSeriesByType(seriesType, function (seriesModel) {
    var data = seriesModel.getData();
    var valueDim = data.mapDimension('value');
    var viewRect = getViewRect(seriesModel, api);
    var center = seriesModel.get('center');
    var radius = seriesModel.get('radius');

    if (!zrUtil.isArray(radius)) {
      radius = [0, radius];
    }

    if (!zrUtil.isArray(center)) {
      center = [center, center];
    }

    var width = number_1.parsePercent(viewRect.width, api.getWidth());
    var height = number_1.parsePercent(viewRect.height, api.getHeight());
    var size = Math.min(width, height);
    var cx = number_1.parsePercent(center[0], width) + viewRect.x;
    var cy = number_1.parsePercent(center[1], height) + viewRect.y;
    var r0 = number_1.parsePercent(radius[0], size / 2);
    var r = number_1.parsePercent(radius[1], size / 2);
    var startAngle = -seriesModel.get('startAngle') * RADIAN;
    var minAngle = seriesModel.get('minAngle') * RADIAN;
    var validDataCount = 0;
    data.each(valueDim, function (value) {
      !isNaN(value) && validDataCount++;
    });
    var sum = data.getSum(valueDim);
    var unitRadian = Math.PI / (sum || validDataCount) * 2;
    var clockwise = seriesModel.get('clockwise');
    var roseType = seriesModel.get('roseType');
    var stillShowZeroSum = seriesModel.get('stillShowZeroSum');
    var extent = data.getDataExtent(valueDim);
    extent[0] = 0;
    var restAngle = PI2;
    var valueSumLargerThanMinAngle = 0;
    var currentAngle = startAngle;
    var dir = clockwise ? 1 : -1;
    data.setLayout({
      viewRect: viewRect,
      r: r
    });
    data.each(valueDim, function (value, idx) {
      var angle;

      if (isNaN(value)) {
        data.setItemLayout(idx, {
          angle: NaN,
          startAngle: NaN,
          endAngle: NaN,
          clockwise: clockwise,
          cx: cx,
          cy: cy,
          r0: r0,
          r: roseType ? NaN : r
        });
        return;
      }

      if (roseType !== 'area') {
        angle = sum === 0 && stillShowZeroSum ? unitRadian : value * unitRadian;
      } else {
        angle = PI2 / validDataCount;
      }

      if (angle < minAngle) {
        angle = minAngle;
        restAngle -= minAngle;
      } else {
        valueSumLargerThanMinAngle += value;
      }

      var endAngle = currentAngle + dir * angle;
      data.setItemLayout(idx, {
        angle: angle,
        startAngle: currentAngle,
        endAngle: endAngle,
        clockwise: clockwise,
        cx: cx,
        cy: cy,
        r0: r0,
        r: roseType ? number_1.linearMap(value, extent, [r0, r]) : r
      });
      currentAngle = endAngle;
    });

    if (restAngle < PI2 && validDataCount) {
      if (restAngle <= 1e-3) {
        var angle_1 = PI2 / validDataCount;
        data.each(valueDim, function (value, idx) {
          if (!isNaN(value)) {
            var layout_1 = data.getItemLayout(idx);
            layout_1.angle = angle_1;
            layout_1.startAngle = startAngle + dir * idx * angle_1;
            layout_1.endAngle = startAngle + dir * (idx + 1) * angle_1;
          }
        });
      } else {
        unitRadian = restAngle / valueSumLargerThanMinAngle;
        currentAngle = startAngle;
        data.each(valueDim, function (value, idx) {
          if (!isNaN(value)) {
            var layout_2 = data.getItemLayout(idx);
            var angle = layout_2.angle === minAngle ? minAngle : value * unitRadian;
            layout_2.startAngle = currentAngle;
            layout_2.endAngle = currentAngle + dir * angle;
            currentAngle += dir * angle;
          }
        });
      }
    }
  });
}

exports["default"] = pieLayout;