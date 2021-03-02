
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

var graphic_1 = require("../util/graphic");

var innerStore_1 = require("../util/innerStore");

var number_1 = require("../util/number");

var Transformable_1 = require("zrender/lib/core/Transformable");

var labelGuideHelper_1 = require("./labelGuideHelper");

var model_1 = require("../util/model");

var util_1 = require("zrender/lib/core/util");

var labelLayoutHelper_1 = require("./labelLayoutHelper");

var labelStyle_1 = require("./labelStyle");

function cloneArr(points) {
  if (points) {
    var newPoints = [];

    for (var i = 0; i < points.length; i++) {
      newPoints.push(points[i].slice());
    }

    return newPoints;
  }
}

function prepareLayoutCallbackParams(labelItem, hostEl) {
  var label = labelItem.label;
  var labelLine = hostEl && hostEl.getTextGuideLine();
  return {
    dataIndex: labelItem.dataIndex,
    dataType: labelItem.dataType,
    seriesIndex: labelItem.seriesModel.seriesIndex,
    text: labelItem.label.style.text,
    rect: labelItem.hostRect,
    labelRect: labelItem.rect,
    align: label.style.align,
    verticalAlign: label.style.verticalAlign,
    labelLinePoints: cloneArr(labelLine && labelLine.shape.points)
  };
}

var LABEL_OPTION_TO_STYLE_KEYS = ['align', 'verticalAlign', 'width', 'height', 'fontSize'];
var dummyTransformable = new Transformable_1["default"]();
var labelLayoutInnerStore = model_1.makeInner();
var labelLineAnimationStore = model_1.makeInner();

function extendWithKeys(target, source, keys) {
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    if (source[key] != null) {
      target[key] = source[key];
    }
  }
}

var LABEL_LAYOUT_PROPS = ['x', 'y', 'rotation'];

var LabelManager = function () {
  function LabelManager() {
    this._labelList = [];
    this._chartViewList = [];
  }

  LabelManager.prototype.clearLabels = function () {
    this._labelList = [];
    this._chartViewList = [];
  };

  LabelManager.prototype._addLabel = function (dataIndex, dataType, seriesModel, label, layoutOption) {
    var labelStyle = label.style;
    var hostEl = label.__hostTarget;
    var textConfig = hostEl.textConfig || {};
    var labelTransform = label.getComputedTransform();
    var labelRect = label.getBoundingRect().plain();
    graphic_1.BoundingRect.applyTransform(labelRect, labelRect, labelTransform);

    if (labelTransform) {
      dummyTransformable.setLocalTransform(labelTransform);
    } else {
      dummyTransformable.x = dummyTransformable.y = dummyTransformable.rotation = dummyTransformable.originX = dummyTransformable.originY = 0;
      dummyTransformable.scaleX = dummyTransformable.scaleY = 1;
    }

    var host = label.__hostTarget;
    var hostRect;

    if (host) {
      hostRect = host.getBoundingRect().plain();
      var transform = host.getComputedTransform();
      graphic_1.BoundingRect.applyTransform(hostRect, hostRect, transform);
    }

    var labelGuide = hostRect && host.getTextGuideLine();

    this._labelList.push({
      label: label,
      labelLine: labelGuide,
      seriesModel: seriesModel,
      dataIndex: dataIndex,
      dataType: dataType,
      layoutOption: layoutOption,
      computedLayoutOption: null,
      rect: labelRect,
      hostRect: hostRect,
      priority: hostRect ? hostRect.width * hostRect.height : 0,
      defaultAttr: {
        ignore: label.ignore,
        labelGuideIgnore: labelGuide && labelGuide.ignore,
        x: dummyTransformable.x,
        y: dummyTransformable.y,
        rotation: dummyTransformable.rotation,
        style: {
          x: labelStyle.x,
          y: labelStyle.y,
          align: labelStyle.align,
          verticalAlign: labelStyle.verticalAlign,
          width: labelStyle.width,
          height: labelStyle.height,
          fontSize: labelStyle.fontSize
        },
        cursor: label.cursor,
        attachedPos: textConfig.position,
        attachedRot: textConfig.rotation
      }
    });
  };

  LabelManager.prototype.addLabelsOfSeries = function (chartView) {
    var _this = this;

    this._chartViewList.push(chartView);

    var seriesModel = chartView.__model;
    var layoutOption = seriesModel.get('labelLayout');

    if (!(util_1.isFunction(layoutOption) || util_1.keys(layoutOption).length)) {
      return;
    }

    chartView.group.traverse(function (child) {
      if (child.ignore) {
        return true;
      }

      var textEl = child.getTextContent();
      var ecData = innerStore_1.getECData(child);

      if (textEl && !textEl.disableLabelLayout) {
        _this._addLabel(ecData.dataIndex, ecData.dataType, seriesModel, textEl, layoutOption);
      }
    });
  };

  LabelManager.prototype.updateLayoutConfig = function (api) {
    var width = api.getWidth();
    var height = api.getHeight();

    function createDragHandler(el, labelLineModel) {
      return function () {
        labelGuideHelper_1.updateLabelLinePoints(el, labelLineModel);
      };
    }

    for (var i = 0; i < this._labelList.length; i++) {
      var labelItem = this._labelList[i];
      var label = labelItem.label;
      var hostEl = label.__hostTarget;
      var defaultLabelAttr = labelItem.defaultAttr;
      var layoutOption = void 0;

      if (typeof labelItem.layoutOption === 'function') {
        layoutOption = labelItem.layoutOption(prepareLayoutCallbackParams(labelItem, hostEl));
      } else {
        layoutOption = labelItem.layoutOption;
      }

      layoutOption = layoutOption || {};
      labelItem.computedLayoutOption = layoutOption;
      var degreeToRadian = Math.PI / 180;

      if (hostEl) {
        hostEl.setTextConfig({
          local: false,
          position: layoutOption.x != null || layoutOption.y != null ? null : defaultLabelAttr.attachedPos,
          rotation: layoutOption.rotate != null ? layoutOption.rotate * degreeToRadian : defaultLabelAttr.attachedRot,
          offset: [layoutOption.dx || 0, layoutOption.dy || 0]
        });
      }

      var needsUpdateLabelLine = false;

      if (layoutOption.x != null) {
        label.x = number_1.parsePercent(layoutOption.x, width);
        label.setStyle('x', 0);
        needsUpdateLabelLine = true;
      } else {
        label.x = defaultLabelAttr.x;
        label.setStyle('x', defaultLabelAttr.style.x);
      }

      if (layoutOption.y != null) {
        label.y = number_1.parsePercent(layoutOption.y, height);
        label.setStyle('y', 0);
        needsUpdateLabelLine = true;
      } else {
        label.y = defaultLabelAttr.y;
        label.setStyle('y', defaultLabelAttr.style.y);
      }

      if (layoutOption.labelLinePoints) {
        var guideLine = hostEl.getTextGuideLine();

        if (guideLine) {
          guideLine.setShape({
            points: layoutOption.labelLinePoints
          });
          needsUpdateLabelLine = false;
        }
      }

      var labelLayoutStore = labelLayoutInnerStore(label);
      labelLayoutStore.needsUpdateLabelLine = needsUpdateLabelLine;
      label.rotation = layoutOption.rotate != null ? layoutOption.rotate * degreeToRadian : defaultLabelAttr.rotation;

      for (var k = 0; k < LABEL_OPTION_TO_STYLE_KEYS.length; k++) {
        var key = LABEL_OPTION_TO_STYLE_KEYS[k];
        label.setStyle(key, layoutOption[key] != null ? layoutOption[key] : defaultLabelAttr.style[key]);
      }

      if (layoutOption.draggable) {
        label.draggable = true;
        label.cursor = 'move';

        if (hostEl) {
          var hostModel = labelItem.seriesModel;

          if (labelItem.dataIndex != null) {
            var data = labelItem.seriesModel.getData(labelItem.dataType);
            hostModel = data.getItemModel(labelItem.dataIndex);
          }

          label.on('drag', createDragHandler(hostEl, hostModel.getModel('labelLine')));
        }
      } else {
        label.off('drag');
        label.cursor = defaultLabelAttr.cursor;
      }
    }
  };

  LabelManager.prototype.layout = function (api) {
    var width = api.getWidth();
    var height = api.getHeight();
    var labelList = labelLayoutHelper_1.prepareLayoutList(this._labelList);
    var labelsNeedsAdjustOnX = util_1.filter(labelList, function (item) {
      return item.layoutOption.moveOverlap === 'shiftX';
    });
    var labelsNeedsAdjustOnY = util_1.filter(labelList, function (item) {
      return item.layoutOption.moveOverlap === 'shiftY';
    });
    labelLayoutHelper_1.shiftLayoutOnX(labelsNeedsAdjustOnX, 0, width);
    labelLayoutHelper_1.shiftLayoutOnY(labelsNeedsAdjustOnY, 0, height);
    var labelsNeedsHideOverlap = util_1.filter(labelList, function (item) {
      return item.layoutOption.hideOverlap;
    });
    labelLayoutHelper_1.hideOverlap(labelsNeedsHideOverlap);
  };

  LabelManager.prototype.processLabelsOverall = function () {
    var _this = this;

    util_1.each(this._chartViewList, function (chartView) {
      var seriesModel = chartView.__model;
      var ignoreLabelLineUpdate = chartView.ignoreLabelLineUpdate;
      var animationEnabled = seriesModel.isAnimationEnabled();
      chartView.group.traverse(function (child) {
        if (child.ignore) {
          return true;
        }

        var needsUpdateLabelLine = !ignoreLabelLineUpdate;
        var label = child.getTextContent();

        if (!needsUpdateLabelLine && label) {
          needsUpdateLabelLine = labelLayoutInnerStore(label).needsUpdateLabelLine;
        }

        if (needsUpdateLabelLine) {
          _this._updateLabelLine(child, seriesModel);
        }

        if (animationEnabled) {
          _this._animateLabels(child, seriesModel);
        }
      });
    });
  };

  LabelManager.prototype._updateLabelLine = function (el, seriesModel) {
    var textEl = el.getTextContent();
    var ecData = innerStore_1.getECData(el);
    var dataIndex = ecData.dataIndex;

    if (textEl && dataIndex != null) {
      var data = seriesModel.getData(ecData.dataType);
      var itemModel = data.getItemModel(dataIndex);
      var defaultStyle = {};
      var visualStyle = data.getItemVisual(dataIndex, 'style');
      var visualType = data.getVisual('drawType');
      defaultStyle.stroke = visualStyle[visualType];
      var labelLineModel = itemModel.getModel('labelLine');
      labelGuideHelper_1.setLabelLineStyle(el, labelGuideHelper_1.getLabelLineStatesModels(itemModel), defaultStyle);
      labelGuideHelper_1.updateLabelLinePoints(el, labelLineModel);
    }
  };

  LabelManager.prototype._animateLabels = function (el, seriesModel) {
    var textEl = el.getTextContent();
    var guideLine = el.getTextGuideLine();

    if (textEl && !textEl.ignore && !textEl.invisible && !el.disableLabelAnimation && !graphic_1.isElementRemoved(el)) {
      var layoutStore = labelLayoutInnerStore(textEl);
      var oldLayout = layoutStore.oldLayout;
      var ecData = innerStore_1.getECData(el);
      var dataIndex = ecData.dataIndex;
      var newProps = {
        x: textEl.x,
        y: textEl.y,
        rotation: textEl.rotation
      };
      var data = seriesModel.getData(ecData.dataType);

      if (!oldLayout) {
        textEl.attr(newProps);

        if (!labelStyle_1.labelInner(textEl).valueAnimation) {
          var oldOpacity = util_1.retrieve2(textEl.style.opacity, 1);
          textEl.style.opacity = 0;
          graphic_1.initProps(textEl, {
            style: {
              opacity: oldOpacity
            }
          }, seriesModel, dataIndex);
        }
      } else {
        textEl.attr(oldLayout);
        var prevStates = el.prevStates;

        if (prevStates) {
          if (util_1.indexOf(prevStates, 'select') >= 0) {
            textEl.attr(layoutStore.oldLayoutSelect);
          }

          if (util_1.indexOf(prevStates, 'emphasis') >= 0) {
            textEl.attr(layoutStore.oldLayoutEmphasis);
          }
        }

        graphic_1.updateProps(textEl, newProps, seriesModel, dataIndex);
      }

      layoutStore.oldLayout = newProps;

      if (textEl.states.select) {
        var layoutSelect = layoutStore.oldLayoutSelect = {};
        extendWithKeys(layoutSelect, newProps, LABEL_LAYOUT_PROPS);
        extendWithKeys(layoutSelect, textEl.states.select, LABEL_LAYOUT_PROPS);
      }

      if (textEl.states.emphasis) {
        var layoutEmphasis = layoutStore.oldLayoutEmphasis = {};
        extendWithKeys(layoutEmphasis, newProps, LABEL_LAYOUT_PROPS);
        extendWithKeys(layoutEmphasis, textEl.states.emphasis, LABEL_LAYOUT_PROPS);
      }

      labelStyle_1.animateLabelValue(textEl, dataIndex, data, seriesModel);
    }

    if (guideLine && !guideLine.ignore && !guideLine.invisible) {
      var layoutStore = labelLineAnimationStore(guideLine);
      var oldLayout = layoutStore.oldLayout;
      var newLayout = {
        points: guideLine.shape.points
      };

      if (!oldLayout) {
        guideLine.setShape(newLayout);
        guideLine.style.strokePercent = 0;
        graphic_1.initProps(guideLine, {
          style: {
            strokePercent: 1
          }
        }, seriesModel);
      } else {
        guideLine.attr({
          shape: oldLayout
        });
        graphic_1.updateProps(guideLine, {
          shape: newLayout
        }, seriesModel);
      }

      layoutStore.oldLayout = newLayout;
    }
  };

  return LabelManager;
}();

exports["default"] = LabelManager;