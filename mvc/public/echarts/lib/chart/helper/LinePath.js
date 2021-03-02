
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

var tslib_1 = require("tslib");

var graphic = require("../../util/graphic");

var vec2 = require("zrender/lib/core/vector");

var straightLineProto = graphic.Line.prototype;
var bezierCurveProto = graphic.BezierCurve.prototype;

var StraightLineShape = function () {
  function StraightLineShape() {
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.percent = 1;
  }

  return StraightLineShape;
}();

var CurveShape = function (_super) {
  tslib_1.__extends(CurveShape, _super);

  function CurveShape() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return CurveShape;
}(StraightLineShape);

function isStraightLine(shape) {
  return isNaN(+shape.cpx1) || isNaN(+shape.cpy1);
}

var ECLinePath = function (_super) {
  tslib_1.__extends(ECLinePath, _super);

  function ECLinePath(opts) {
    var _this = _super.call(this, opts) || this;

    _this.type = 'ec-line';
    return _this;
  }

  ECLinePath.prototype.getDefaultStyle = function () {
    return {
      stroke: '#000',
      fill: null
    };
  };

  ECLinePath.prototype.getDefaultShape = function () {
    return new StraightLineShape();
  };

  ECLinePath.prototype.buildPath = function (ctx, shape) {
    if (isStraightLine(shape)) {
      straightLineProto.buildPath.call(this, ctx, shape);
    } else {
      bezierCurveProto.buildPath.call(this, ctx, shape);
    }
  };

  ECLinePath.prototype.pointAt = function (t) {
    if (isStraightLine(this.shape)) {
      return straightLineProto.pointAt.call(this, t);
    } else {
      return bezierCurveProto.pointAt.call(this, t);
    }
  };

  ECLinePath.prototype.tangentAt = function (t) {
    var shape = this.shape;
    var p = isStraightLine(shape) ? [shape.x2 - shape.x1, shape.y2 - shape.y1] : bezierCurveProto.tangentAt.call(this, t);
    return vec2.normalize(p, p);
  };

  return ECLinePath;
}(graphic.Path);

exports["default"] = ECLinePath;