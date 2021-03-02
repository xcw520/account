
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

var Polar_1 = require("./Polar");

var number_1 = require("../../util/number");

var axisHelper_1 = require("../../coord/axisHelper");

var CoordinateSystem_1 = require("../../CoordinateSystem");

var model_1 = require("../../util/model");

function resizePolar(polar, polarModel, api) {
  var center = polarModel.get('center');
  var width = api.getWidth();
  var height = api.getHeight();
  polar.cx = number_1.parsePercent(center[0], width);
  polar.cy = number_1.parsePercent(center[1], height);
  var radiusAxis = polar.getRadiusAxis();
  var size = Math.min(width, height) / 2;
  var radius = polarModel.get('radius');

  if (radius == null) {
    radius = [0, '100%'];
  } else if (!zrUtil.isArray(radius)) {
    radius = [0, radius];
  }

  var parsedRadius = [number_1.parsePercent(radius[0], size), number_1.parsePercent(radius[1], size)];
  radiusAxis.inverse ? radiusAxis.setExtent(parsedRadius[1], parsedRadius[0]) : radiusAxis.setExtent(parsedRadius[0], parsedRadius[1]);
}

function updatePolarScale(ecModel, api) {
  var polar = this;
  var angleAxis = polar.getAngleAxis();
  var radiusAxis = polar.getRadiusAxis();
  angleAxis.scale.setExtent(Infinity, -Infinity);
  radiusAxis.scale.setExtent(Infinity, -Infinity);
  ecModel.eachSeries(function (seriesModel) {
    if (seriesModel.coordinateSystem === polar) {
      var data_1 = seriesModel.getData();
      zrUtil.each(axisHelper_1.getDataDimensionsOnAxis(data_1, 'radius'), function (dim) {
        radiusAxis.scale.unionExtentFromData(data_1, dim);
      });
      zrUtil.each(axisHelper_1.getDataDimensionsOnAxis(data_1, 'angle'), function (dim) {
        angleAxis.scale.unionExtentFromData(data_1, dim);
      });
    }
  });
  axisHelper_1.niceScaleExtent(angleAxis.scale, angleAxis.model);
  axisHelper_1.niceScaleExtent(radiusAxis.scale, radiusAxis.model);

  if (angleAxis.type === 'category' && !angleAxis.onBand) {
    var extent = angleAxis.getExtent();
    var diff = 360 / angleAxis.scale.count();
    angleAxis.inverse ? extent[1] += diff : extent[1] -= diff;
    angleAxis.setExtent(extent[0], extent[1]);
  }
}

function isAngleAxisModel(axisModel) {
  return axisModel.mainType === 'angleAxis';
}

function setAxis(axis, axisModel) {
  axis.type = axisModel.get('type');
  axis.scale = axisHelper_1.createScaleByModel(axisModel);
  axis.onBand = axisModel.get('boundaryGap') && axis.type === 'category';
  axis.inverse = axisModel.get('inverse');

  if (isAngleAxisModel(axisModel)) {
    axis.inverse = axis.inverse !== axisModel.get('clockwise');
    var startAngle = axisModel.get('startAngle');
    axis.setExtent(startAngle, startAngle + (axis.inverse ? -360 : 360));
  }

  axisModel.axis = axis;
  axis.model = axisModel;
}

var polarCreator = {
  dimensions: Polar_1["default"].prototype.dimensions,
  create: function (ecModel, api) {
    var polarList = [];
    ecModel.eachComponent('polar', function (polarModel, idx) {
      var polar = new Polar_1["default"](idx + '');
      polar.update = updatePolarScale;
      var radiusAxis = polar.getRadiusAxis();
      var angleAxis = polar.getAngleAxis();
      var radiusAxisModel = polarModel.findAxisModel('radiusAxis');
      var angleAxisModel = polarModel.findAxisModel('angleAxis');
      setAxis(radiusAxis, radiusAxisModel);
      setAxis(angleAxis, angleAxisModel);
      resizePolar(polar, polarModel, api);
      polarList.push(polar);
      polarModel.coordinateSystem = polar;
      polar.model = polarModel;
    });
    ecModel.eachSeries(function (seriesModel) {
      if (seriesModel.get('coordinateSystem') === 'polar') {
        var polarModel = seriesModel.getReferringComponents('polar', model_1.SINGLE_REFERRING).models[0];

        if (process.env.NODE_ENV !== 'production') {
          if (!polarModel) {
            throw new Error('Polar "' + zrUtil.retrieve(seriesModel.get('polarIndex'), seriesModel.get('polarId'), 0) + '" not found');
          }
        }

        seriesModel.coordinateSystem = polarModel.coordinateSystem;
      }
    });
    return polarList;
  }
};
CoordinateSystem_1["default"].register('polar', polarCreator);