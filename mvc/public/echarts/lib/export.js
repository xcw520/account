
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

var zrender = require("zrender/lib/zrender");

exports.zrender = zrender;

var matrix = require("zrender/lib/core/matrix");

exports.matrix = matrix;

var vector = require("zrender/lib/core/vector");

exports.vector = vector;

var zrUtil = require("zrender/lib/core/util");

var colorTool = require("zrender/lib/tool/color");

exports.color = colorTool;

var graphicUtil = require("./util/graphic");

var numberUtil = require("./util/number");

var formatUtil = require("./util/format");

var timeUtil = require("./util/time");

var throttle_1 = require("./util/throttle");

exports.throttle = throttle_1.throttle;

var ecHelper = require("./helper");

exports.helper = ecHelper;

var parseGeoJson_1 = require("./coord/geo/parseGeoJson");

exports.parseGeoJSON = parseGeoJson_1["default"];

var graphic_1 = require("zrender/lib/canvas/graphic");

exports.innerDrawElementOnCanvas = graphic_1.brushSingle;

var List_1 = require("./data/List");

exports.List = List_1["default"];

var Model_1 = require("./model/Model");

exports.Model = Model_1["default"];

var Axis_1 = require("./coord/Axis");

exports.Axis = Axis_1["default"];

var env_1 = require("zrender/lib/core/env");

exports.env = env_1["default"];
exports.parseGeoJson = parseGeoJson_1["default"];
exports.number = {};
zrUtil.each(['linearMap', 'round', 'asc', 'getPrecision', 'getPrecisionSafe', 'getPixelPrecision', 'getPercentWithPrecision', 'MAX_SAFE_INTEGER', 'remRadian', 'isRadianAroundZero', 'parseDate', 'quantity', 'quantityExponent', 'nice', 'quantile', 'reformIntervals', 'isNumeric', 'numericToNumber'], function (name) {
  exports.number[name] = numberUtil[name];
});
exports.format = {};
zrUtil.each(['addCommas', 'toCamelCase', 'normalizeCssArray', 'encodeHTML', 'formatTpl', 'getTooltipMarker', 'formatTime', 'capitalFirst', 'truncateText', 'getTextRect'], function (name) {
  exports.format[name] = formatUtil[name];
});
exports.time = {
  parse: numberUtil.parseDate,
  format: timeUtil.format
};
var ecUtil = {};
exports.util = ecUtil;
zrUtil.each(['map', 'each', 'filter', 'indexOf', 'inherits', 'reduce', 'filter', 'bind', 'curry', 'isArray', 'isString', 'isObject', 'isFunction', 'extend', 'defaults', 'clone', 'merge'], function (name) {
  ecUtil[name] = zrUtil[name];
});
var GRAPHIC_KEYS = ['extendShape', 'extendPath', 'makePath', 'makeImage', 'mergePath', 'resizePath', 'createIcon', 'updateProps', 'initProps', 'getTransform', 'clipPointsByRect', 'clipRectByRect', 'registerShape', 'getShapeClass', 'Group', 'Image', 'Text', 'Circle', 'Ellipse', 'Sector', 'Ring', 'Polygon', 'Polyline', 'Rect', 'Line', 'BezierCurve', 'Arc', 'IncrementalDisplayable', 'CompoundPath', 'LinearGradient', 'RadialGradient', 'BoundingRect'];
exports.graphic = {};
zrUtil.each(GRAPHIC_KEYS, function (name) {
  exports.graphic[name] = graphicUtil[name];
});