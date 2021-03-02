
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

var zrUtil = require("zrender/lib/core/util");

var vector = require("zrender/lib/core/vector");

var matrix = require("zrender/lib/core/matrix");

var BoundingRect_1 = require("zrender/lib/core/BoundingRect");

var Transformable_1 = require("zrender/lib/core/Transformable");

var v2ApplyTransform = vector.applyTransform;

var View = function (_super) {
  tslib_1.__extends(View, _super);

  function View(name) {
    var _this = _super.call(this) || this;

    _this.type = 'view';
    _this.dimensions = ['x', 'y'];
    _this._roamTransformable = new Transformable_1["default"]();
    _this._rawTransformable = new Transformable_1["default"]();
    _this.name = name;
    return _this;
  }

  View.prototype.setBoundingRect = function (x, y, width, height) {
    this._rect = new BoundingRect_1["default"](x, y, width, height);
    return this._rect;
  };

  View.prototype.getBoundingRect = function () {
    return this._rect;
  };

  View.prototype.setViewRect = function (x, y, width, height) {
    this.transformTo(x, y, width, height);
    this._viewRect = new BoundingRect_1["default"](x, y, width, height);
  };

  View.prototype.transformTo = function (x, y, width, height) {
    var rect = this.getBoundingRect();
    var rawTransform = this._rawTransformable;
    rawTransform.transform = rect.calculateTransform(new BoundingRect_1["default"](x, y, width, height));
    rawTransform.decomposeTransform();

    this._updateTransform();
  };

  View.prototype.setCenter = function (centerCoord) {
    if (!centerCoord) {
      return;
    }

    this._center = centerCoord;

    this._updateCenterAndZoom();
  };

  View.prototype.setZoom = function (zoom) {
    zoom = zoom || 1;
    var zoomLimit = this.zoomLimit;

    if (zoomLimit) {
      if (zoomLimit.max != null) {
        zoom = Math.min(zoomLimit.max, zoom);
      }

      if (zoomLimit.min != null) {
        zoom = Math.max(zoomLimit.min, zoom);
      }
    }

    this._zoom = zoom;

    this._updateCenterAndZoom();
  };

  View.prototype.getDefaultCenter = function () {
    var rawRect = this.getBoundingRect();
    var cx = rawRect.x + rawRect.width / 2;
    var cy = rawRect.y + rawRect.height / 2;
    return [cx, cy];
  };

  View.prototype.getCenter = function () {
    return this._center || this.getDefaultCenter();
  };

  View.prototype.getZoom = function () {
    return this._zoom || 1;
  };

  View.prototype.getRoamTransform = function () {
    return this._roamTransformable.getLocalTransform();
  };

  View.prototype._updateCenterAndZoom = function () {
    var rawTransformMatrix = this._rawTransformable.getLocalTransform();

    var roamTransform = this._roamTransformable;
    var defaultCenter = this.getDefaultCenter();
    var center = this.getCenter();
    var zoom = this.getZoom();
    center = vector.applyTransform([], center, rawTransformMatrix);
    defaultCenter = vector.applyTransform([], defaultCenter, rawTransformMatrix);
    roamTransform.originX = center[0];
    roamTransform.originY = center[1];
    roamTransform.x = defaultCenter[0] - center[0];
    roamTransform.y = defaultCenter[1] - center[1];
    roamTransform.scaleX = roamTransform.scaleY = zoom;

    this._updateTransform();
  };

  View.prototype._updateTransform = function () {
    var roamTransformable = this._roamTransformable;
    var rawTransformable = this._rawTransformable;
    rawTransformable.parent = roamTransformable;
    roamTransformable.updateTransform();
    rawTransformable.updateTransform();
    matrix.copy(this.transform || (this.transform = []), rawTransformable.transform || matrix.create());
    this._rawTransform = rawTransformable.getLocalTransform();
    this.invTransform = this.invTransform || [];
    matrix.invert(this.invTransform, this.transform);
    this.decomposeTransform();
  };

  View.prototype.getTransformInfo = function () {
    var roamTransform = this._roamTransformable.transform;
    var rawTransformable = this._rawTransformable;
    return {
      roamTransform: roamTransform ? zrUtil.slice(roamTransform) : matrix.create(),
      rawScaleX: rawTransformable.scaleX,
      rawScaleY: rawTransformable.scaleY,
      rawX: rawTransformable.x,
      rawY: rawTransformable.y
    };
  };

  View.prototype.getViewRect = function () {
    return this._viewRect;
  };

  View.prototype.getViewRectAfterRoam = function () {
    var rect = this.getBoundingRect().clone();
    rect.applyTransform(this.transform);
    return rect;
  };

  View.prototype.dataToPoint = function (data, noRoam, out) {
    var transform = noRoam ? this._rawTransform : this.transform;
    out = out || [];
    return transform ? v2ApplyTransform(out, data, transform) : vector.copy(out, data);
  };

  View.prototype.pointToData = function (point) {
    var invTransform = this.invTransform;
    return invTransform ? v2ApplyTransform([], point, invTransform) : [point[0], point[1]];
  };

  View.prototype.convertToPixel = function (ecModel, finder, value) {
    var coordSys = getCoordSys(finder);
    return coordSys === this ? coordSys.dataToPoint(value) : null;
  };

  View.prototype.convertFromPixel = function (ecModel, finder, pixel) {
    var coordSys = getCoordSys(finder);
    return coordSys === this ? coordSys.pointToData(pixel) : null;
  };

  View.prototype.containPoint = function (point) {
    return this.getViewRectAfterRoam().contain(point[0], point[1]);
  };

  View.dimensions = ['x', 'y'];
  return View;
}(Transformable_1["default"]);

function getCoordSys(finder) {
  var seriesModel = finder.seriesModel;
  return seriesModel ? seriesModel.coordinateSystem : null;
}

exports["default"] = View;