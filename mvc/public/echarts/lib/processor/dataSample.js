
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
var samplers = {
  average: function (frame) {
    var sum = 0;
    var count = 0;

    for (var i = 0; i < frame.length; i++) {
      if (!isNaN(frame[i])) {
        sum += frame[i];
        count++;
      }
    }

    return count === 0 ? NaN : sum / count;
  },
  sum: function (frame) {
    var sum = 0;

    for (var i = 0; i < frame.length; i++) {
      sum += frame[i] || 0;
    }

    return sum;
  },
  max: function (frame) {
    var max = -Infinity;

    for (var i = 0; i < frame.length; i++) {
      frame[i] > max && (max = frame[i]);
    }

    return isFinite(max) ? max : NaN;
  },
  min: function (frame) {
    var min = Infinity;

    for (var i = 0; i < frame.length; i++) {
      frame[i] < min && (min = frame[i]);
    }

    return isFinite(min) ? min : NaN;
  },
  nearest: function (frame) {
    return frame[0];
  }
};

var indexSampler = function (frame) {
  return Math.round(frame.length / 2);
};

function dataSample(seriesType) {
  return {
    seriesType: seriesType,
    reset: function (seriesModel, ecModel, api) {
      var data = seriesModel.getData();
      var sampling = seriesModel.get('sampling');
      var coordSys = seriesModel.coordinateSystem;
      var count = data.count();

      if (count > 10 && coordSys.type === 'cartesian2d' && sampling) {
        var baseAxis = coordSys.getBaseAxis();
        var valueAxis = coordSys.getOtherAxis(baseAxis);
        var extent = baseAxis.getExtent();
        var dpr = api.getDevicePixelRatio();
        var size = Math.abs(extent[1] - extent[0]) * (dpr || 1);
        var rate = Math.round(count / size);

        if (rate > 1) {
          if (sampling === 'lttb') {
            seriesModel.setData(data.lttbDownSample(data.mapDimension(valueAxis.dim), 1 / rate));
          }

          var sampler = void 0;

          if (typeof sampling === 'string') {
            sampler = samplers[sampling];
          } else if (typeof sampling === 'function') {
            sampler = sampling;
          }

          if (sampler) {
            seriesModel.setData(data.downSample(data.mapDimension(valueAxis.dim), 1 / rate, sampler, indexSampler));
          }
        }
      }
    }
  };
}

exports["default"] = dataSample;