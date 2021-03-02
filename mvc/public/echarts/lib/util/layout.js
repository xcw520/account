
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

var BoundingRect_1 = require("zrender/lib/core/BoundingRect");

var number_1 = require("./number");

var formatUtil = require("./format");

var each = zrUtil.each;
exports.LOCATION_PARAMS = ['left', 'right', 'top', 'bottom', 'width', 'height'];
exports.HV_NAMES = [['width', 'left', 'right'], ['height', 'top', 'bottom']];

function boxLayout(orient, group, gap, maxWidth, maxHeight) {
  var x = 0;
  var y = 0;

  if (maxWidth == null) {
    maxWidth = Infinity;
  }

  if (maxHeight == null) {
    maxHeight = Infinity;
  }

  var currentLineMaxSize = 0;
  group.eachChild(function (child, idx) {
    var rect = child.getBoundingRect();
    var nextChild = group.childAt(idx + 1);
    var nextChildRect = nextChild && nextChild.getBoundingRect();
    var nextX;
    var nextY;

    if (orient === 'horizontal') {
      var moveX = rect.width + (nextChildRect ? -nextChildRect.x + rect.x : 0);
      nextX = x + moveX;

      if (nextX > maxWidth || child.newline) {
        x = 0;
        nextX = moveX;
        y += currentLineMaxSize + gap;
        currentLineMaxSize = rect.height;
      } else {
        currentLineMaxSize = Math.max(currentLineMaxSize, rect.height);
      }
    } else {
      var moveY = rect.height + (nextChildRect ? -nextChildRect.y + rect.y : 0);
      nextY = y + moveY;

      if (nextY > maxHeight || child.newline) {
        x += currentLineMaxSize + gap;
        y = 0;
        nextY = moveY;
        currentLineMaxSize = rect.width;
      } else {
        currentLineMaxSize = Math.max(currentLineMaxSize, rect.width);
      }
    }

    if (child.newline) {
      return;
    }

    child.x = x;
    child.y = y;
    child.markRedraw();
    orient === 'horizontal' ? x = nextX + gap : y = nextY + gap;
  });
}

exports.box = boxLayout;
exports.vbox = zrUtil.curry(boxLayout, 'vertical');
exports.hbox = zrUtil.curry(boxLayout, 'horizontal');

function getAvailableSize(positionInfo, containerRect, margin) {
  var containerWidth = containerRect.width;
  var containerHeight = containerRect.height;
  var x = number_1.parsePercent(positionInfo.left, containerWidth);
  var y = number_1.parsePercent(positionInfo.top, containerHeight);
  var x2 = number_1.parsePercent(positionInfo.right, containerWidth);
  var y2 = number_1.parsePercent(positionInfo.bottom, containerHeight);
  (isNaN(x) || isNaN(parseFloat(positionInfo.left))) && (x = 0);
  (isNaN(x2) || isNaN(parseFloat(positionInfo.right))) && (x2 = containerWidth);
  (isNaN(y) || isNaN(parseFloat(positionInfo.top))) && (y = 0);
  (isNaN(y2) || isNaN(parseFloat(positionInfo.bottom))) && (y2 = containerHeight);
  margin = formatUtil.normalizeCssArray(margin || 0);
  return {
    width: Math.max(x2 - x - margin[1] - margin[3], 0),
    height: Math.max(y2 - y - margin[0] - margin[2], 0)
  };
}

exports.getAvailableSize = getAvailableSize;

function getLayoutRect(positionInfo, containerRect, margin) {
  margin = formatUtil.normalizeCssArray(margin || 0);
  var containerWidth = containerRect.width;
  var containerHeight = containerRect.height;
  var left = number_1.parsePercent(positionInfo.left, containerWidth);
  var top = number_1.parsePercent(positionInfo.top, containerHeight);
  var right = number_1.parsePercent(positionInfo.right, containerWidth);
  var bottom = number_1.parsePercent(positionInfo.bottom, containerHeight);
  var width = number_1.parsePercent(positionInfo.width, containerWidth);
  var height = number_1.parsePercent(positionInfo.height, containerHeight);
  var verticalMargin = margin[2] + margin[0];
  var horizontalMargin = margin[1] + margin[3];
  var aspect = positionInfo.aspect;

  if (isNaN(width)) {
    width = containerWidth - right - horizontalMargin - left;
  }

  if (isNaN(height)) {
    height = containerHeight - bottom - verticalMargin - top;
  }

  if (aspect != null) {
    if (isNaN(width) && isNaN(height)) {
      if (aspect > containerWidth / containerHeight) {
        width = containerWidth * 0.8;
      } else {
        height = containerHeight * 0.8;
      }
    }

    if (isNaN(width)) {
      width = aspect * height;
    }

    if (isNaN(height)) {
      height = width / aspect;
    }
  }

  if (isNaN(left)) {
    left = containerWidth - right - width - horizontalMargin;
  }

  if (isNaN(top)) {
    top = containerHeight - bottom - height - verticalMargin;
  }

  switch (positionInfo.left || positionInfo.right) {
    case 'center':
      left = containerWidth / 2 - width / 2 - margin[3];
      break;

    case 'right':
      left = containerWidth - width - horizontalMargin;
      break;
  }

  switch (positionInfo.top || positionInfo.bottom) {
    case 'middle':
    case 'center':
      top = containerHeight / 2 - height / 2 - margin[0];
      break;

    case 'bottom':
      top = containerHeight - height - verticalMargin;
      break;
  }

  left = left || 0;
  top = top || 0;

  if (isNaN(width)) {
    width = containerWidth - horizontalMargin - left - (right || 0);
  }

  if (isNaN(height)) {
    height = containerHeight - verticalMargin - top - (bottom || 0);
  }

  var rect = new BoundingRect_1["default"](left + margin[3], top + margin[0], width, height);
  rect.margin = margin;
  return rect;
}

exports.getLayoutRect = getLayoutRect;

function positionElement(el, positionInfo, containerRect, margin, opt) {
  var h = !opt || !opt.hv || opt.hv[0];
  var v = !opt || !opt.hv || opt.hv[1];
  var boundingMode = opt && opt.boundingMode || 'all';

  if (!h && !v) {
    return;
  }

  var rect;

  if (boundingMode === 'raw') {
    rect = el.type === 'group' ? new BoundingRect_1["default"](0, 0, +positionInfo.width || 0, +positionInfo.height || 0) : el.getBoundingRect();
  } else {
    rect = el.getBoundingRect();

    if (el.needLocalTransform()) {
      var transform = el.getLocalTransform();
      rect = rect.clone();
      rect.applyTransform(transform);
    }
  }

  var layoutRect = getLayoutRect(zrUtil.defaults({
    width: rect.width,
    height: rect.height
  }, positionInfo), containerRect, margin);
  var dx = h ? layoutRect.x - rect.x : 0;
  var dy = v ? layoutRect.y - rect.y : 0;

  if (boundingMode === 'raw') {
    el.x = dx;
    el.y = dy;
  } else {
    el.x += dx;
    el.y += dy;
  }

  el.markRedraw();
}

exports.positionElement = positionElement;

function sizeCalculable(option, hvIdx) {
  return option[exports.HV_NAMES[hvIdx][0]] != null || option[exports.HV_NAMES[hvIdx][1]] != null && option[exports.HV_NAMES[hvIdx][2]] != null;
}

exports.sizeCalculable = sizeCalculable;

function fetchLayoutMode(ins) {
  var layoutMode = ins.layoutMode || ins.constructor.layoutMode;
  return zrUtil.isObject(layoutMode) ? layoutMode : layoutMode ? {
    type: layoutMode
  } : null;
}

exports.fetchLayoutMode = fetchLayoutMode;

function mergeLayoutParam(targetOption, newOption, opt) {
  var ignoreSize = opt && opt.ignoreSize;
  !zrUtil.isArray(ignoreSize) && (ignoreSize = [ignoreSize, ignoreSize]);
  var hResult = merge(exports.HV_NAMES[0], 0);
  var vResult = merge(exports.HV_NAMES[1], 1);
  copy(exports.HV_NAMES[0], targetOption, hResult);
  copy(exports.HV_NAMES[1], targetOption, vResult);

  function merge(names, hvIdx) {
    var newParams = {};
    var newValueCount = 0;
    var merged = {};
    var mergedValueCount = 0;
    var enoughParamNumber = 2;
    each(names, function (name) {
      merged[name] = targetOption[name];
    });
    each(names, function (name) {
      hasProp(newOption, name) && (newParams[name] = merged[name] = newOption[name]);
      hasValue(newParams, name) && newValueCount++;
      hasValue(merged, name) && mergedValueCount++;
    });

    if (ignoreSize[hvIdx]) {
      if (hasValue(newOption, names[1])) {
        merged[names[2]] = null;
      } else if (hasValue(newOption, names[2])) {
        merged[names[1]] = null;
      }

      return merged;
    }

    if (mergedValueCount === enoughParamNumber || !newValueCount) {
      return merged;
    } else if (newValueCount >= enoughParamNumber) {
      return newParams;
    } else {
      for (var i = 0; i < names.length; i++) {
        var name_1 = names[i];

        if (!hasProp(newParams, name_1) && hasProp(targetOption, name_1)) {
          newParams[name_1] = targetOption[name_1];
          break;
        }
      }

      return newParams;
    }
  }

  function hasProp(obj, name) {
    return obj.hasOwnProperty(name);
  }

  function hasValue(obj, name) {
    return obj[name] != null && obj[name] !== 'auto';
  }

  function copy(names, target, source) {
    each(names, function (name) {
      target[name] = source[name];
    });
  }
}

exports.mergeLayoutParam = mergeLayoutParam;

function getLayoutParams(source) {
  return copyLayoutParams({}, source);
}

exports.getLayoutParams = getLayoutParams;

function copyLayoutParams(target, source) {
  source && target && each(exports.LOCATION_PARAMS, function (name) {
    source.hasOwnProperty(name) && (target[name] = source[name]);
  });
  return target;
}

exports.copyLayoutParams = copyLayoutParams;