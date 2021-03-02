
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

var pathTool = require("zrender/lib/tool/path");

var matrix = require("zrender/lib/core/matrix");

var vector = require("zrender/lib/core/vector");

var Path_1 = require("zrender/lib/graphic/Path");

exports.Path = Path_1["default"];

var Transformable_1 = require("zrender/lib/core/Transformable");

var Image_1 = require("zrender/lib/graphic/Image");

exports.Image = Image_1["default"];

var Group_1 = require("zrender/lib/graphic/Group");

exports.Group = Group_1["default"];

var Text_1 = require("zrender/lib/graphic/Text");

exports.Text = Text_1["default"];

var Circle_1 = require("zrender/lib/graphic/shape/Circle");

exports.Circle = Circle_1["default"];

var Ellipse_1 = require("zrender/lib/graphic/shape/Ellipse");

exports.Ellipse = Ellipse_1["default"];

var Sector_1 = require("zrender/lib/graphic/shape/Sector");

exports.Sector = Sector_1["default"];

var Ring_1 = require("zrender/lib/graphic/shape/Ring");

exports.Ring = Ring_1["default"];

var Polygon_1 = require("zrender/lib/graphic/shape/Polygon");

exports.Polygon = Polygon_1["default"];

var Polyline_1 = require("zrender/lib/graphic/shape/Polyline");

exports.Polyline = Polyline_1["default"];

var Rect_1 = require("zrender/lib/graphic/shape/Rect");

exports.Rect = Rect_1["default"];

var Line_1 = require("zrender/lib/graphic/shape/Line");

exports.Line = Line_1["default"];

var BezierCurve_1 = require("zrender/lib/graphic/shape/BezierCurve");

exports.BezierCurve = BezierCurve_1["default"];

var Arc_1 = require("zrender/lib/graphic/shape/Arc");

exports.Arc = Arc_1["default"];

var CompoundPath_1 = require("zrender/lib/graphic/CompoundPath");

exports.CompoundPath = CompoundPath_1["default"];

var LinearGradient_1 = require("zrender/lib/graphic/LinearGradient");

exports.LinearGradient = LinearGradient_1["default"];

var RadialGradient_1 = require("zrender/lib/graphic/RadialGradient");

exports.RadialGradient = RadialGradient_1["default"];

var BoundingRect_1 = require("zrender/lib/core/BoundingRect");

exports.BoundingRect = BoundingRect_1["default"];

var OrientedBoundingRect_1 = require("zrender/lib/core/OrientedBoundingRect");

exports.OrientedBoundingRect = OrientedBoundingRect_1["default"];

var Point_1 = require("zrender/lib/core/Point");

exports.Point = Point_1["default"];

var IncrementalDisplayable_1 = require("zrender/lib/graphic/IncrementalDisplayable");

exports.IncrementalDisplayable = IncrementalDisplayable_1["default"];

var subPixelOptimizeUtil = require("zrender/lib/graphic/helper/subPixelOptimize");

var util_1 = require("zrender/lib/core/util");

var innerStore_1 = require("./innerStore");

var mathMax = Math.max;
var mathMin = Math.min;
var _customShapeMap = {};

function extendShape(opts) {
  return Path_1["default"].extend(opts);
}

exports.extendShape = extendShape;
var extendPathFromString = pathTool.extendFromString;

function extendPath(pathData, opts) {
  return extendPathFromString(pathData, opts);
}

exports.extendPath = extendPath;

function registerShape(name, ShapeClass) {
  _customShapeMap[name] = ShapeClass;
}

exports.registerShape = registerShape;

function getShapeClass(name) {
  if (_customShapeMap.hasOwnProperty(name)) {
    return _customShapeMap[name];
  }
}

exports.getShapeClass = getShapeClass;

function makePath(pathData, opts, rect, layout) {
  var path = pathTool.createFromString(pathData, opts);

  if (rect) {
    if (layout === 'center') {
      rect = centerGraphic(rect, path.getBoundingRect());
    }

    resizePath(path, rect);
  }

  return path;
}

exports.makePath = makePath;

function makeImage(imageUrl, rect, layout) {
  var zrImg = new Image_1["default"]({
    style: {
      image: imageUrl,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    },
    onload: function (img) {
      if (layout === 'center') {
        var boundingRect = {
          width: img.width,
          height: img.height
        };
        zrImg.setStyle(centerGraphic(rect, boundingRect));
      }
    }
  });
  return zrImg;
}

exports.makeImage = makeImage;

function centerGraphic(rect, boundingRect) {
  var aspect = boundingRect.width / boundingRect.height;
  var width = rect.height * aspect;
  var height;

  if (width <= rect.width) {
    height = rect.height;
  } else {
    width = rect.width;
    height = width / aspect;
  }

  var cx = rect.x + rect.width / 2;
  var cy = rect.y + rect.height / 2;
  return {
    x: cx - width / 2,
    y: cy - height / 2,
    width: width,
    height: height
  };
}

exports.mergePath = pathTool.mergePath;

function resizePath(path, rect) {
  if (!path.applyTransform) {
    return;
  }

  var pathRect = path.getBoundingRect();
  var m = pathRect.calculateTransform(rect);
  path.applyTransform(m);
}

exports.resizePath = resizePath;

function subPixelOptimizeLine(param) {
  subPixelOptimizeUtil.subPixelOptimizeLine(param.shape, param.shape, param.style);
  return param;
}

exports.subPixelOptimizeLine = subPixelOptimizeLine;

function subPixelOptimizeRect(param) {
  subPixelOptimizeUtil.subPixelOptimizeRect(param.shape, param.shape, param.style);
  return param;
}

exports.subPixelOptimizeRect = subPixelOptimizeRect;
exports.subPixelOptimize = subPixelOptimizeUtil.subPixelOptimize;

function animateOrSetProps(animationType, el, props, animatableModel, dataIndex, cb, during) {
  var isFrom = false;
  var removeOpt;

  if (typeof dataIndex === 'function') {
    during = cb;
    cb = dataIndex;
    dataIndex = null;
  } else if (util_1.isObject(dataIndex)) {
    cb = dataIndex.cb;
    during = dataIndex.during;
    isFrom = dataIndex.isFrom;
    removeOpt = dataIndex.removeOpt;
    dataIndex = dataIndex.dataIndex;
  }

  var isUpdate = animationType === 'update';
  var isRemove = animationType === 'remove';
  var animationPayload;

  if (animatableModel && animatableModel.ecModel) {
    var updatePayload = animatableModel.ecModel.getUpdatePayload();
    animationPayload = updatePayload && updatePayload.animation;
  }

  var animationEnabled = animatableModel && animatableModel.isAnimationEnabled();

  if (!isRemove) {
    el.stopAnimation('remove');
  }

  if (animationEnabled) {
    var duration = void 0;
    var animationEasing = void 0;
    var animationDelay = void 0;

    if (animationPayload) {
      duration = animationPayload.duration || 0;
      animationEasing = animationPayload.easing || 'cubicOut';
      animationDelay = animationPayload.delay || 0;
    } else if (isRemove) {
      removeOpt = removeOpt || {};
      duration = util_1.retrieve2(removeOpt.duration, 200);
      animationEasing = util_1.retrieve2(removeOpt.easing, 'cubicOut');
      animationDelay = 0;
    } else {
      duration = animatableModel.getShallow(isUpdate ? 'animationDurationUpdate' : 'animationDuration');
      animationEasing = animatableModel.getShallow(isUpdate ? 'animationEasingUpdate' : 'animationEasing');
      animationDelay = animatableModel.getShallow(isUpdate ? 'animationDelayUpdate' : 'animationDelay');
    }

    if (typeof animationDelay === 'function') {
      animationDelay = animationDelay(dataIndex, animatableModel.getAnimationDelayParams ? animatableModel.getAnimationDelayParams(el, dataIndex) : null);
    }

    if (typeof duration === 'function') {
      duration = duration(dataIndex);
    }

    duration > 0 ? isFrom ? el.animateFrom(props, {
      duration: duration,
      delay: animationDelay || 0,
      easing: animationEasing,
      done: cb,
      force: !!cb || !!during,
      scope: animationType,
      during: during
    }) : el.animateTo(props, {
      duration: duration,
      delay: animationDelay || 0,
      easing: animationEasing,
      done: cb,
      force: !!cb || !!during,
      setToFinal: true,
      scope: animationType,
      during: during
    }) : (el.stopAnimation(), !isFrom && el.attr(props), cb && cb());
  } else {
    el.stopAnimation();
    !isFrom && el.attr(props);
    during && during(1);
    cb && cb();
  }
}

function updateProps(el, props, animatableModel, dataIndex, cb, during) {
  animateOrSetProps('update', el, props, animatableModel, dataIndex, cb, during);
}

exports.updateProps = updateProps;

function initProps(el, props, animatableModel, dataIndex, cb, during) {
  animateOrSetProps('init', el, props, animatableModel, dataIndex, cb, during);
}

exports.initProps = initProps;

function removeElement(el, props, animatableModel, dataIndex, cb, during) {
  if (isElementRemoved(el)) {
    return;
  }

  animateOrSetProps('remove', el, props, animatableModel, dataIndex, cb, during);
}

exports.removeElement = removeElement;

function fadeOutDisplayable(el, animatableModel, dataIndex, done) {
  el.removeTextContent();
  el.removeTextGuideLine();
  removeElement(el, {
    style: {
      opacity: 0
    }
  }, animatableModel, dataIndex, done);
}

function removeElementWithFadeOut(el, animatableModel, dataIndex) {
  function doRemove() {
    el.parent && el.parent.remove(el);
  }

  if (!el.isGroup) {
    fadeOutDisplayable(el, animatableModel, dataIndex, doRemove);
  } else {
    el.traverse(function (disp) {
      if (!disp.isGroup) {
        fadeOutDisplayable(disp, animatableModel, dataIndex, doRemove);
      }
    });
  }
}

exports.removeElementWithFadeOut = removeElementWithFadeOut;

function isElementRemoved(el) {
  if (!el.__zr) {
    return true;
  }

  for (var i = 0; i < el.animators.length; i++) {
    var animator = el.animators[i];

    if (animator.scope === 'remove') {
      return true;
    }
  }

  return false;
}

exports.isElementRemoved = isElementRemoved;

function getTransform(target, ancestor) {
  var mat = matrix.identity([]);

  while (target && target !== ancestor) {
    matrix.mul(mat, target.getLocalTransform(), mat);
    target = target.parent;
  }

  return mat;
}

exports.getTransform = getTransform;

function applyTransform(target, transform, invert) {
  if (transform && !util_1.isArrayLike(transform)) {
    transform = Transformable_1["default"].getLocalTransform(transform);
  }

  if (invert) {
    transform = matrix.invert([], transform);
  }

  return vector.applyTransform([], target, transform);
}

exports.applyTransform = applyTransform;

function transformDirection(direction, transform, invert) {
  var hBase = transform[4] === 0 || transform[5] === 0 || transform[0] === 0 ? 1 : Math.abs(2 * transform[4] / transform[0]);
  var vBase = transform[4] === 0 || transform[5] === 0 || transform[2] === 0 ? 1 : Math.abs(2 * transform[4] / transform[2]);
  var vertex = [direction === 'left' ? -hBase : direction === 'right' ? hBase : 0, direction === 'top' ? -vBase : direction === 'bottom' ? vBase : 0];
  vertex = applyTransform(vertex, transform, invert);
  return Math.abs(vertex[0]) > Math.abs(vertex[1]) ? vertex[0] > 0 ? 'right' : 'left' : vertex[1] > 0 ? 'bottom' : 'top';
}

exports.transformDirection = transformDirection;

function isNotGroup(el) {
  return !el.isGroup;
}

function isPath(el) {
  return el.shape != null;
}

function groupTransition(g1, g2, animatableModel) {
  if (!g1 || !g2) {
    return;
  }

  function getElMap(g) {
    var elMap = {};
    g.traverse(function (el) {
      if (isNotGroup(el) && el.anid) {
        elMap[el.anid] = el;
      }
    });
    return elMap;
  }

  function getAnimatableProps(el) {
    var obj = {
      x: el.x,
      y: el.y,
      rotation: el.rotation
    };

    if (isPath(el)) {
      obj.shape = util_1.extend({}, el.shape);
    }

    return obj;
  }

  var elMap1 = getElMap(g1);
  g2.traverse(function (el) {
    if (isNotGroup(el) && el.anid) {
      var oldEl = elMap1[el.anid];

      if (oldEl) {
        var newProp = getAnimatableProps(el);
        el.attr(getAnimatableProps(oldEl));
        updateProps(el, newProp, animatableModel, innerStore_1.getECData(el).dataIndex);
      }
    }
  });
}

exports.groupTransition = groupTransition;

function clipPointsByRect(points, rect) {
  return util_1.map(points, function (point) {
    var x = point[0];
    x = mathMax(x, rect.x);
    x = mathMin(x, rect.x + rect.width);
    var y = point[1];
    y = mathMax(y, rect.y);
    y = mathMin(y, rect.y + rect.height);
    return [x, y];
  });
}

exports.clipPointsByRect = clipPointsByRect;

function clipRectByRect(targetRect, rect) {
  var x = mathMax(targetRect.x, rect.x);
  var x2 = mathMin(targetRect.x + targetRect.width, rect.x + rect.width);
  var y = mathMax(targetRect.y, rect.y);
  var y2 = mathMin(targetRect.y + targetRect.height, rect.y + rect.height);

  if (x2 >= x && y2 >= y) {
    return {
      x: x,
      y: y,
      width: x2 - x,
      height: y2 - y
    };
  }
}

exports.clipRectByRect = clipRectByRect;

function createIcon(iconStr, opt, rect) {
  var innerOpts = util_1.extend({
    rectHover: true
  }, opt);
  var style = innerOpts.style = {
    strokeNoScale: true
  };
  rect = rect || {
    x: -1,
    y: -1,
    width: 2,
    height: 2
  };

  if (iconStr) {
    return iconStr.indexOf('image://') === 0 ? (style.image = iconStr.slice(8), util_1.defaults(style, rect), new Image_1["default"](innerOpts)) : makePath(iconStr.replace('path://', ''), innerOpts, rect, 'center');
  }
}

exports.createIcon = createIcon;

function linePolygonIntersect(a1x, a1y, a2x, a2y, points) {
  for (var i = 0, p2 = points[points.length - 1]; i < points.length; i++) {
    var p = points[i];

    if (lineLineIntersect(a1x, a1y, a2x, a2y, p[0], p[1], p2[0], p2[1])) {
      return true;
    }

    p2 = p;
  }
}

exports.linePolygonIntersect = linePolygonIntersect;

function lineLineIntersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {
  var mx = a2x - a1x;
  var my = a2y - a1y;
  var nx = b2x - b1x;
  var ny = b2y - b1y;
  var nmCrossProduct = crossProduct2d(nx, ny, mx, my);

  if (nearZero(nmCrossProduct)) {
    return false;
  }

  var b1a1x = a1x - b1x;
  var b1a1y = a1y - b1y;
  var q = crossProduct2d(b1a1x, b1a1y, mx, my) / nmCrossProduct;

  if (q < 0 || q > 1) {
    return false;
  }

  var p = crossProduct2d(b1a1x, b1a1y, nx, ny) / nmCrossProduct;

  if (p < 0 || p > 1) {
    return false;
  }

  return true;
}

exports.lineLineIntersect = lineLineIntersect;

function crossProduct2d(x1, y1, x2, y2) {
  return x1 * y2 - x2 * y1;
}

function nearZero(val) {
  return val <= 1e-6 && val >= -1e-6;
}

registerShape('circle', Circle_1["default"]);
registerShape('ellipse', Ellipse_1["default"]);
registerShape('sector', Sector_1["default"]);
registerShape('ring', Ring_1["default"]);
registerShape('polygon', Polygon_1["default"]);
registerShape('polyline', Polyline_1["default"]);
registerShape('rect', Rect_1["default"]);
registerShape('line', Line_1["default"]);
registerShape('bezierCurve', BezierCurve_1["default"]);
registerShape('arc', Arc_1["default"]);