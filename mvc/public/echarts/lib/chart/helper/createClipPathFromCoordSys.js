
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

var graphic = require("../../util/graphic");

var number_1 = require("../../util/number");

function createGridClipPath(cartesian, hasAnimation, seriesModel, done, during) {
  var rect = cartesian.getArea();
  var x = rect.x;
  var y = rect.y;
  var width = rect.width;
  var height = rect.height;
  var lineWidth = seriesModel.get(['lineStyle', 'width']) || 2;
  x -= lineWidth / 2;
  y -= lineWidth / 2;
  width += lineWidth;
  height += lineWidth;
  x = Math.floor(x);
  width = Math.round(width);
  var clipPath = new graphic.Rect({
    shape: {
      x: x,
      y: y,
      width: width,
      height: height
    }
  });

  if (hasAnimation) {
    var baseAxis = cartesian.getBaseAxis();
    var isHorizontal = baseAxis.isHorizontal();
    var isAxisInversed = baseAxis.inverse;

    if (isHorizontal) {
      if (isAxisInversed) {
        clipPath.shape.x += width;
      }

      clipPath.shape.width = 0;
    } else {
      if (!isAxisInversed) {
        clipPath.shape.y += height;
      }

      clipPath.shape.height = 0;
    }

    var duringCb = typeof during === 'function' ? function (percent) {
      during(percent, clipPath);
    } : null;
    graphic.initProps(clipPath, {
      shape: {
        width: width,
        height: height,
        x: x,
        y: y
      }
    }, seriesModel, null, done, duringCb);
  }

  return clipPath;
}

exports.createGridClipPath = createGridClipPath;

function createPolarClipPath(polar, hasAnimation, seriesModel) {
  var sectorArea = polar.getArea();
  var r0 = number_1.round(sectorArea.r0, 1);
  var r = number_1.round(sectorArea.r, 1);
  var clipPath = new graphic.Sector({
    shape: {
      cx: number_1.round(polar.cx, 1),
      cy: number_1.round(polar.cy, 1),
      r0: r0,
      r: r,
      startAngle: sectorArea.startAngle,
      endAngle: sectorArea.endAngle,
      clockwise: sectorArea.clockwise
    }
  });

  if (hasAnimation) {
    var isRadial = polar.getBaseAxis().dim === 'angle';

    if (isRadial) {
      clipPath.shape.endAngle = sectorArea.startAngle;
    } else {
      clipPath.shape.r = r0;
    }

    graphic.initProps(clipPath, {
      shape: {
        endAngle: sectorArea.endAngle,
        r: r
      }
    }, seriesModel);
  }

  return clipPath;
}

exports.createPolarClipPath = createPolarClipPath;

function createClipPath(coordSys, hasAnimation, seriesModel, done, during) {
  if (!coordSys) {
    return null;
  } else if (coordSys.type === 'polar') {
    return createPolarClipPath(coordSys, hasAnimation, seriesModel);
  } else if (coordSys.type === 'cartesian2d') {
    return createGridClipPath(coordSys, hasAnimation, seriesModel, done, during);
  }

  return null;
}

exports.createClipPath = createClipPath;