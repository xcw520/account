
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

var BoundingRect_1 = require("zrender/lib/core/BoundingRect");

var matrix = require("zrender/lib/core/matrix");

var graphic = require("../../util/graphic");

var labelStyle_1 = require("../../label/labelStyle");

var layout = require("../../util/layout");

var TimelineView_1 = require("./TimelineView");

var TimelineAxis_1 = require("./TimelineAxis");

var symbol_1 = require("../../util/symbol");

var numberUtil = require("../../util/number");

var util_1 = require("zrender/lib/core/util");

var Component_1 = require("../../view/Component");

var Ordinal_1 = require("../../scale/Ordinal");

var Time_1 = require("../../scale/Time");

var Interval_1 = require("../../scale/Interval");

var text_1 = require("zrender/lib/contain/text");

var model_1 = require("../../util/model");

var innerStore_1 = require("../../util/innerStore");

var states_1 = require("../../util/states");

var tooltipMarkup_1 = require("../tooltip/tooltipMarkup");

var PI = Math.PI;
var labelDataIndexStore = model_1.makeInner();

var SliderTimelineView = function (_super) {
  tslib_1.__extends(SliderTimelineView, _super);

  function SliderTimelineView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = SliderTimelineView.type;
    return _this;
  }

  SliderTimelineView.prototype.init = function (ecModel, api) {
    this.api = api;
  };

  SliderTimelineView.prototype.render = function (timelineModel, ecModel, api) {
    this.model = timelineModel;
    this.api = api;
    this.ecModel = ecModel;
    this.group.removeAll();

    if (timelineModel.get('show', true)) {
      var layoutInfo_1 = this._layout(timelineModel, api);

      var mainGroup_1 = this._createGroup('_mainGroup');

      var labelGroup = this._createGroup('_labelGroup');

      var axis_1 = this._axis = this._createAxis(layoutInfo_1, timelineModel);

      timelineModel.formatTooltip = function (dataIndex) {
        var name = axis_1.scale.getLabel({
          value: dataIndex
        });
        return tooltipMarkup_1.createTooltipMarkup('nameValue', {
          noName: true,
          value: name
        });
      };

      util_1.each(['AxisLine', 'AxisTick', 'Control', 'CurrentPointer'], function (name) {
        this['_render' + name](layoutInfo_1, mainGroup_1, axis_1, timelineModel);
      }, this);

      this._renderAxisLabel(layoutInfo_1, labelGroup, axis_1, timelineModel);

      this._position(layoutInfo_1, timelineModel);
    }

    this._doPlayStop();

    this._updateTicksStatus();
  };

  SliderTimelineView.prototype.remove = function () {
    this._clearTimer();

    this.group.removeAll();
  };

  SliderTimelineView.prototype.dispose = function () {
    this._clearTimer();
  };

  SliderTimelineView.prototype._layout = function (timelineModel, api) {
    var labelPosOpt = timelineModel.get(['label', 'position']);
    var orient = timelineModel.get('orient');
    var viewRect = getViewRect(timelineModel, api);
    var parsedLabelPos;

    if (labelPosOpt == null || labelPosOpt === 'auto') {
      parsedLabelPos = orient === 'horizontal' ? viewRect.y + viewRect.height / 2 < api.getHeight() / 2 ? '-' : '+' : viewRect.x + viewRect.width / 2 < api.getWidth() / 2 ? '+' : '-';
    } else if (util_1.isString(labelPosOpt)) {
      parsedLabelPos = {
        horizontal: {
          top: '-',
          bottom: '+'
        },
        vertical: {
          left: '-',
          right: '+'
        }
      }[orient][labelPosOpt];
    } else {
      parsedLabelPos = labelPosOpt;
    }

    var labelAlignMap = {
      horizontal: 'center',
      vertical: parsedLabelPos >= 0 || parsedLabelPos === '+' ? 'left' : 'right'
    };
    var labelBaselineMap = {
      horizontal: parsedLabelPos >= 0 || parsedLabelPos === '+' ? 'top' : 'bottom',
      vertical: 'middle'
    };
    var rotationMap = {
      horizontal: 0,
      vertical: PI / 2
    };
    var mainLength = orient === 'vertical' ? viewRect.height : viewRect.width;
    var controlModel = timelineModel.getModel('controlStyle');
    var showControl = controlModel.get('show', true);
    var controlSize = showControl ? controlModel.get('itemSize') : 0;
    var controlGap = showControl ? controlModel.get('itemGap') : 0;
    var sizePlusGap = controlSize + controlGap;
    var labelRotation = timelineModel.get(['label', 'rotate']) || 0;
    labelRotation = labelRotation * PI / 180;
    var playPosition;
    var prevBtnPosition;
    var nextBtnPosition;
    var controlPosition = controlModel.get('position', true);
    var showPlayBtn = showControl && controlModel.get('showPlayBtn', true);
    var showPrevBtn = showControl && controlModel.get('showPrevBtn', true);
    var showNextBtn = showControl && controlModel.get('showNextBtn', true);
    var xLeft = 0;
    var xRight = mainLength;

    if (controlPosition === 'left' || controlPosition === 'bottom') {
      showPlayBtn && (playPosition = [0, 0], xLeft += sizePlusGap);
      showPrevBtn && (prevBtnPosition = [xLeft, 0], xLeft += sizePlusGap);
      showNextBtn && (nextBtnPosition = [xRight - controlSize, 0], xRight -= sizePlusGap);
    } else {
      showPlayBtn && (playPosition = [xRight - controlSize, 0], xRight -= sizePlusGap);
      showPrevBtn && (prevBtnPosition = [0, 0], xLeft += sizePlusGap);
      showNextBtn && (nextBtnPosition = [xRight - controlSize, 0], xRight -= sizePlusGap);
    }

    var axisExtent = [xLeft, xRight];

    if (timelineModel.get('inverse')) {
      axisExtent.reverse();
    }

    return {
      viewRect: viewRect,
      mainLength: mainLength,
      orient: orient,
      rotation: rotationMap[orient],
      labelRotation: labelRotation,
      labelPosOpt: parsedLabelPos,
      labelAlign: timelineModel.get(['label', 'align']) || labelAlignMap[orient],
      labelBaseline: timelineModel.get(['label', 'verticalAlign']) || timelineModel.get(['label', 'baseline']) || labelBaselineMap[orient],
      playPosition: playPosition,
      prevBtnPosition: prevBtnPosition,
      nextBtnPosition: nextBtnPosition,
      axisExtent: axisExtent,
      controlSize: controlSize,
      controlGap: controlGap
    };
  };

  SliderTimelineView.prototype._position = function (layoutInfo, timelineModel) {
    var mainGroup = this._mainGroup;
    var labelGroup = this._labelGroup;
    var viewRect = layoutInfo.viewRect;

    if (layoutInfo.orient === 'vertical') {
      var m = matrix.create();
      var rotateOriginX = viewRect.x;
      var rotateOriginY = viewRect.y + viewRect.height;
      matrix.translate(m, m, [-rotateOriginX, -rotateOriginY]);
      matrix.rotate(m, m, -PI / 2);
      matrix.translate(m, m, [rotateOriginX, rotateOriginY]);
      viewRect = viewRect.clone();
      viewRect.applyTransform(m);
    }

    var viewBound = getBound(viewRect);
    var mainBound = getBound(mainGroup.getBoundingRect());
    var labelBound = getBound(labelGroup.getBoundingRect());
    var mainPosition = [mainGroup.x, mainGroup.y];
    var labelsPosition = [labelGroup.x, labelGroup.y];
    labelsPosition[0] = mainPosition[0] = viewBound[0][0];
    var labelPosOpt = layoutInfo.labelPosOpt;

    if (labelPosOpt == null || util_1.isString(labelPosOpt)) {
      var mainBoundIdx = labelPosOpt === '+' ? 0 : 1;
      toBound(mainPosition, mainBound, viewBound, 1, mainBoundIdx);
      toBound(labelsPosition, labelBound, viewBound, 1, 1 - mainBoundIdx);
    } else {
      var mainBoundIdx = labelPosOpt >= 0 ? 0 : 1;
      toBound(mainPosition, mainBound, viewBound, 1, mainBoundIdx);
      labelsPosition[1] = mainPosition[1] + labelPosOpt;
    }

    mainGroup.setPosition(mainPosition);
    labelGroup.setPosition(labelsPosition);
    mainGroup.rotation = labelGroup.rotation = layoutInfo.rotation;
    setOrigin(mainGroup);
    setOrigin(labelGroup);

    function setOrigin(targetGroup) {
      targetGroup.originX = viewBound[0][0] - targetGroup.x;
      targetGroup.originY = viewBound[1][0] - targetGroup.y;
    }

    function getBound(rect) {
      return [[rect.x, rect.x + rect.width], [rect.y, rect.y + rect.height]];
    }

    function toBound(fromPos, from, to, dimIdx, boundIdx) {
      fromPos[dimIdx] += to[dimIdx][boundIdx] - from[dimIdx][boundIdx];
    }
  };

  SliderTimelineView.prototype._createAxis = function (layoutInfo, timelineModel) {
    var data = timelineModel.getData();
    var axisType = timelineModel.get('axisType');
    var scale = createScaleByModel(timelineModel, axisType);

    scale.getTicks = function () {
      return data.mapArray(['value'], function (value) {
        return {
          value: value
        };
      });
    };

    var dataExtent = data.getDataExtent('value');
    scale.setExtent(dataExtent[0], dataExtent[1]);
    scale.niceTicks();
    var axis = new TimelineAxis_1["default"]('value', scale, layoutInfo.axisExtent, axisType);
    axis.model = timelineModel;
    return axis;
  };

  SliderTimelineView.prototype._createGroup = function (key) {
    var newGroup = this[key] = new graphic.Group();
    this.group.add(newGroup);
    return newGroup;
  };

  SliderTimelineView.prototype._renderAxisLine = function (layoutInfo, group, axis, timelineModel) {
    var axisExtent = axis.getExtent();

    if (!timelineModel.get(['lineStyle', 'show'])) {
      return;
    }

    var line = new graphic.Line({
      shape: {
        x1: axisExtent[0],
        y1: 0,
        x2: axisExtent[1],
        y2: 0
      },
      style: util_1.extend({
        lineCap: 'round'
      }, timelineModel.getModel('lineStyle').getLineStyle()),
      silent: true,
      z2: 1
    });
    group.add(line);
    var progressLine = this._progressLine = new graphic.Line({
      shape: {
        x1: axisExtent[0],
        x2: this._currentPointer ? this._currentPointer.x : axisExtent[0],
        y1: 0,
        y2: 0
      },
      style: util_1.defaults({
        lineCap: 'round',
        lineWidth: line.style.lineWidth
      }, timelineModel.getModel(['progress', 'lineStyle']).getLineStyle()),
      silent: true,
      z2: 1
    });
    group.add(progressLine);
  };

  SliderTimelineView.prototype._renderAxisTick = function (layoutInfo, group, axis, timelineModel) {
    var _this = this;

    var data = timelineModel.getData();
    var ticks = axis.scale.getTicks();
    this._tickSymbols = [];
    util_1.each(ticks, function (tick) {
      var tickCoord = axis.dataToCoord(tick.value);
      var itemModel = data.getItemModel(tick.value);
      var itemStyleModel = itemModel.getModel('itemStyle');
      var hoverStyleModel = itemModel.getModel(['emphasis', 'itemStyle']);
      var progressStyleModel = itemModel.getModel(['progress', 'itemStyle']);
      var symbolOpt = {
        x: tickCoord,
        y: 0,
        onclick: util_1.bind(_this._changeTimeline, _this, tick.value)
      };
      var el = giveSymbol(itemModel, itemStyleModel, group, symbolOpt);
      el.ensureState('emphasis').style = hoverStyleModel.getItemStyle();
      el.ensureState('progress').style = progressStyleModel.getItemStyle();
      states_1.enableHoverEmphasis(el);
      var ecData = innerStore_1.getECData(el);

      if (itemModel.get('tooltip')) {
        ecData.dataIndex = tick.value;
        ecData.dataModel = timelineModel;
      } else {
        ecData.dataIndex = ecData.dataModel = null;
      }

      _this._tickSymbols.push(el);
    });
  };

  SliderTimelineView.prototype._renderAxisLabel = function (layoutInfo, group, axis, timelineModel) {
    var _this = this;

    var labelModel = axis.getLabelModel();

    if (!labelModel.get('show')) {
      return;
    }

    var data = timelineModel.getData();
    var labels = axis.getViewLabels();
    this._tickLabels = [];
    util_1.each(labels, function (labelItem) {
      var dataIndex = labelItem.tickValue;
      var itemModel = data.getItemModel(dataIndex);
      var normalLabelModel = itemModel.getModel('label');
      var hoverLabelModel = itemModel.getModel(['emphasis', 'label']);
      var progressLabelModel = itemModel.getModel(['progress', 'label']);
      var tickCoord = axis.dataToCoord(labelItem.tickValue);
      var textEl = new graphic.Text({
        x: tickCoord,
        y: 0,
        rotation: layoutInfo.labelRotation - layoutInfo.rotation,
        onclick: util_1.bind(_this._changeTimeline, _this, dataIndex),
        silent: false,
        style: labelStyle_1.createTextStyle(normalLabelModel, {
          text: labelItem.formattedLabel,
          align: layoutInfo.labelAlign,
          verticalAlign: layoutInfo.labelBaseline
        })
      });
      textEl.ensureState('emphasis').style = labelStyle_1.createTextStyle(hoverLabelModel);
      textEl.ensureState('progress').style = labelStyle_1.createTextStyle(progressLabelModel);
      group.add(textEl);
      states_1.enableHoverEmphasis(textEl);
      labelDataIndexStore(textEl).dataIndex = dataIndex;

      _this._tickLabels.push(textEl);
    });
  };

  SliderTimelineView.prototype._renderControl = function (layoutInfo, group, axis, timelineModel) {
    var controlSize = layoutInfo.controlSize;
    var rotation = layoutInfo.rotation;
    var itemStyle = timelineModel.getModel('controlStyle').getItemStyle();
    var hoverStyle = timelineModel.getModel(['emphasis', 'controlStyle']).getItemStyle();
    var playState = timelineModel.getPlayState();
    var inverse = timelineModel.get('inverse', true);
    makeBtn(layoutInfo.nextBtnPosition, 'next', util_1.bind(this._changeTimeline, this, inverse ? '-' : '+'));
    makeBtn(layoutInfo.prevBtnPosition, 'prev', util_1.bind(this._changeTimeline, this, inverse ? '+' : '-'));
    makeBtn(layoutInfo.playPosition, playState ? 'stop' : 'play', util_1.bind(this._handlePlayClick, this, !playState), true);

    function makeBtn(position, iconName, onclick, willRotate) {
      if (!position) {
        return;
      }

      var iconSize = text_1.parsePercent(util_1.retrieve2(timelineModel.get(['controlStyle', iconName + 'BtnSize']), controlSize), controlSize);
      var rect = [0, -iconSize / 2, iconSize, iconSize];
      var opt = {
        position: position,
        origin: [controlSize / 2, 0],
        rotation: willRotate ? -rotation : 0,
        rectHover: true,
        style: itemStyle,
        onclick: onclick
      };
      var btn = makeControlIcon(timelineModel, iconName + 'Icon', rect, opt);
      btn.ensureState('emphasis').style = hoverStyle;
      group.add(btn);
      states_1.enableHoverEmphasis(btn);
    }
  };

  SliderTimelineView.prototype._renderCurrentPointer = function (layoutInfo, group, axis, timelineModel) {
    var data = timelineModel.getData();
    var currentIndex = timelineModel.getCurrentIndex();
    var pointerModel = data.getItemModel(currentIndex).getModel('checkpointStyle');
    var me = this;
    var callback = {
      onCreate: function (pointer) {
        pointer.draggable = true;
        pointer.drift = util_1.bind(me._handlePointerDrag, me);
        pointer.ondragend = util_1.bind(me._handlePointerDragend, me);
        pointerMoveTo(pointer, me._progressLine, currentIndex, axis, timelineModel, true);
      },
      onUpdate: function (pointer) {
        pointerMoveTo(pointer, me._progressLine, currentIndex, axis, timelineModel);
      }
    };
    this._currentPointer = giveSymbol(pointerModel, pointerModel, this._mainGroup, {}, this._currentPointer, callback);
  };

  SliderTimelineView.prototype._handlePlayClick = function (nextState) {
    this._clearTimer();

    this.api.dispatchAction({
      type: 'timelinePlayChange',
      playState: nextState,
      from: this.uid
    });
  };

  SliderTimelineView.prototype._handlePointerDrag = function (dx, dy, e) {
    this._clearTimer();

    this._pointerChangeTimeline([e.offsetX, e.offsetY]);
  };

  SliderTimelineView.prototype._handlePointerDragend = function (e) {
    this._pointerChangeTimeline([e.offsetX, e.offsetY], true);
  };

  SliderTimelineView.prototype._pointerChangeTimeline = function (mousePos, trigger) {
    var toCoord = this._toAxisCoord(mousePos)[0];

    var axis = this._axis;
    var axisExtent = numberUtil.asc(axis.getExtent().slice());
    toCoord > axisExtent[1] && (toCoord = axisExtent[1]);
    toCoord < axisExtent[0] && (toCoord = axisExtent[0]);
    this._currentPointer.x = toCoord;

    this._currentPointer.markRedraw();

    this._progressLine.shape.x2 = toCoord;

    this._progressLine.dirty();

    var targetDataIndex = this._findNearestTick(toCoord);

    var timelineModel = this.model;

    if (trigger || targetDataIndex !== timelineModel.getCurrentIndex() && timelineModel.get('realtime')) {
      this._changeTimeline(targetDataIndex);
    }
  };

  SliderTimelineView.prototype._doPlayStop = function () {
    var _this = this;

    this._clearTimer();

    if (this.model.getPlayState()) {
      this._timer = setTimeout(function () {
        var timelineModel = _this.model;

        _this._changeTimeline(timelineModel.getCurrentIndex() + (timelineModel.get('rewind', true) ? -1 : 1));
      }, this.model.get('playInterval'));
    }
  };

  SliderTimelineView.prototype._toAxisCoord = function (vertex) {
    var trans = this._mainGroup.getLocalTransform();

    return graphic.applyTransform(vertex, trans, true);
  };

  SliderTimelineView.prototype._findNearestTick = function (axisCoord) {
    var data = this.model.getData();
    var dist = Infinity;
    var targetDataIndex;
    var axis = this._axis;
    data.each(['value'], function (value, dataIndex) {
      var coord = axis.dataToCoord(value);
      var d = Math.abs(coord - axisCoord);

      if (d < dist) {
        dist = d;
        targetDataIndex = dataIndex;
      }
    });
    return targetDataIndex;
  };

  SliderTimelineView.prototype._clearTimer = function () {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  };

  SliderTimelineView.prototype._changeTimeline = function (nextIndex) {
    var currentIndex = this.model.getCurrentIndex();

    if (nextIndex === '+') {
      nextIndex = currentIndex + 1;
    } else if (nextIndex === '-') {
      nextIndex = currentIndex - 1;
    }

    this.api.dispatchAction({
      type: 'timelineChange',
      currentIndex: nextIndex,
      from: this.uid
    });
  };

  SliderTimelineView.prototype._updateTicksStatus = function () {
    var currentIndex = this.model.getCurrentIndex();
    var tickSymbols = this._tickSymbols;
    var tickLabels = this._tickLabels;

    if (tickSymbols) {
      for (var i = 0; i < tickSymbols.length; i++) {
        tickSymbols && tickSymbols[i] && tickSymbols[i].toggleState('progress', i < currentIndex);
      }
    }

    if (tickLabels) {
      for (var i = 0; i < tickLabels.length; i++) {
        tickLabels && tickLabels[i] && tickLabels[i].toggleState('progress', labelDataIndexStore(tickLabels[i]).dataIndex <= currentIndex);
      }
    }
  };

  SliderTimelineView.type = 'timeline.slider';
  return SliderTimelineView;
}(TimelineView_1["default"]);

function createScaleByModel(model, axisType) {
  axisType = axisType || model.get('type');

  if (axisType) {
    switch (axisType) {
      case 'category':
        return new Ordinal_1["default"]({
          ordinalMeta: model.getCategories(),
          extent: [Infinity, -Infinity]
        });

      case 'time':
        return new Time_1["default"]({
          locale: model.ecModel.getLocaleModel(),
          useUTC: model.ecModel.get('useUTC')
        });

      default:
        return new Interval_1["default"]();
    }
  }
}

function getViewRect(model, api) {
  return layout.getLayoutRect(model.getBoxLayoutParams(), {
    width: api.getWidth(),
    height: api.getHeight()
  }, model.get('padding'));
}

function makeControlIcon(timelineModel, objPath, rect, opts) {
  var style = opts.style;
  var icon = graphic.createIcon(timelineModel.get(['controlStyle', objPath]), opts || {}, new BoundingRect_1["default"](rect[0], rect[1], rect[2], rect[3]));

  if (style) {
    icon.setStyle(style);
  }

  return icon;
}

function giveSymbol(hostModel, itemStyleModel, group, opt, symbol, callback) {
  var color = itemStyleModel.get('color');

  if (!symbol) {
    var symbolType = hostModel.get('symbol');
    symbol = symbol_1.createSymbol(symbolType, -1, -1, 2, 2, color);
    symbol.setStyle('strokeNoScale', true);
    group.add(symbol);
    callback && callback.onCreate(symbol);
  } else {
    symbol.setColor(color);
    group.add(symbol);
    callback && callback.onUpdate(symbol);
  }

  var itemStyle = itemStyleModel.getItemStyle(['color']);
  symbol.setStyle(itemStyle);
  opt = util_1.merge({
    rectHover: true,
    z2: 100
  }, opt, true);
  var symbolSize = hostModel.get('symbolSize');
  symbolSize = symbolSize instanceof Array ? symbolSize.slice() : [+symbolSize, +symbolSize];
  opt.scaleX = symbolSize[0] / 2;
  opt.scaleY = symbolSize[1] / 2;
  var symbolOffset = hostModel.get('symbolOffset');

  if (symbolOffset) {
    opt.x = opt.x || 0;
    opt.y = opt.y || 0;
    opt.x += numberUtil.parsePercent(symbolOffset[0], symbolSize[0]);
    opt.y += numberUtil.parsePercent(symbolOffset[1], symbolSize[1]);
  }

  var symbolRotate = hostModel.get('symbolRotate');
  opt.rotation = (symbolRotate || 0) * Math.PI / 180 || 0;
  symbol.attr(opt);
  symbol.updateTransform();
  return symbol;
}

function pointerMoveTo(pointer, progressLine, dataIndex, axis, timelineModel, noAnimation) {
  if (pointer.dragging) {
    return;
  }

  var pointerModel = timelineModel.getModel('checkpointStyle');
  var toCoord = axis.dataToCoord(timelineModel.getData().get('value', dataIndex));

  if (noAnimation || !pointerModel.get('animation', true)) {
    pointer.attr({
      x: toCoord,
      y: 0
    });
    progressLine && progressLine.attr({
      shape: {
        x2: toCoord
      }
    });
  } else {
    var animationCfg = {
      duration: pointerModel.get('animationDuration', true),
      easing: pointerModel.get('animationEasing', true)
    };
    pointer.stopAnimation(null, true);
    pointer.animateTo({
      x: toCoord,
      y: 0
    }, animationCfg);
    progressLine && progressLine.animateTo({
      shape: {
        x2: toCoord
      }
    }, animationCfg);
  }
}

Component_1["default"].registerClass(SliderTimelineView);
exports["default"] = SliderTimelineView;