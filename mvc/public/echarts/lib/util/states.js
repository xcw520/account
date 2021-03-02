
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

var LRU_1 = require("zrender/lib/core/LRU");

var util_1 = require("zrender/lib/core/util");

var innerStore_1 = require("./innerStore");

var colorTool = require("zrender/lib/tool/color");

var model_1 = require("./model");

var Path_1 = require("zrender/lib/graphic/Path");

var _highlightNextDigit = 1;
var _highlightKeyMap = {};
var getSavedStates = model_1.makeInner();
exports.HOVER_STATE_NORMAL = 0;
exports.HOVER_STATE_BLUR = 1;
exports.HOVER_STATE_EMPHASIS = 2;
exports.SPECIAL_STATES = ['emphasis', 'blur', 'select'];
exports.DISPLAY_STATES = ['normal', 'emphasis', 'blur', 'select'];
exports.Z2_EMPHASIS_LIFT = 10;
exports.Z2_SELECT_LIFT = 9;
exports.HIGHLIGHT_ACTION_TYPE = 'highlight';
exports.DOWNPLAY_ACTION_TYPE = 'downplay';
exports.SELECT_ACTION_TYPE = 'select';
exports.UNSELECT_ACTION_TYPE = 'unselect';
exports.TOGGLE_SELECT_ACTION_TYPE = 'toggleSelect';

function hasFillOrStroke(fillOrStroke) {
  return fillOrStroke != null && fillOrStroke !== 'none';
}

var liftedColorCache = new LRU_1["default"](100);

function liftColor(color) {
  if (typeof color !== 'string') {
    return color;
  }

  var liftedColor = liftedColorCache.get(color);

  if (!liftedColor) {
    liftedColor = colorTool.lift(color, -0.1);
    liftedColorCache.put(color, liftedColor);
  }

  return liftedColor;
}

function doChangeHoverState(el, stateName, hoverStateEnum) {
  if (el.onHoverStateChange && (el.hoverState || 0) !== hoverStateEnum) {
    el.onHoverStateChange(stateName);
  }

  el.hoverState = hoverStateEnum;
}

function singleEnterEmphasis(el) {
  doChangeHoverState(el, 'emphasis', exports.HOVER_STATE_EMPHASIS);
}

function singleLeaveEmphasis(el) {
  if (el.hoverState === exports.HOVER_STATE_EMPHASIS) {
    doChangeHoverState(el, 'normal', exports.HOVER_STATE_NORMAL);
  }
}

function singleEnterBlur(el) {
  doChangeHoverState(el, 'blur', exports.HOVER_STATE_BLUR);
}

function singleLeaveBlur(el) {
  if (el.hoverState === exports.HOVER_STATE_BLUR) {
    doChangeHoverState(el, 'normal', exports.HOVER_STATE_NORMAL);
  }
}

function singleEnterSelect(el) {
  el.selected = true;
}

function singleLeaveSelect(el) {
  el.selected = false;
}

function updateElementState(el, updater, commonParam) {
  updater(el, commonParam);
}

function traverseUpdateState(el, updater, commonParam) {
  updateElementState(el, updater, commonParam);
  el.isGroup && el.traverse(function (child) {
    updateElementState(child, updater, commonParam);
  });
}

function setStatesFlag(el, stateName) {
  switch (stateName) {
    case 'emphasis':
      el.hoverState = exports.HOVER_STATE_EMPHASIS;
      break;

    case 'normal':
      el.hoverState = exports.HOVER_STATE_NORMAL;
      break;

    case 'blur':
      el.hoverState = exports.HOVER_STATE_BLUR;
      break;

    case 'select':
      el.selected = true;
  }
}

exports.setStatesFlag = setStatesFlag;

function clearStates(el) {
  if (el.isGroup) {
    el.traverse(function (child) {
      child.clearStates();
    });
  } else {
    el.clearStates();
  }
}

exports.clearStates = clearStates;

function getFromStateStyle(el, props, toStateName, defaultValue) {
  var style = el.style;
  var fromState = {};

  for (var i = 0; i < props.length; i++) {
    var propName = props[i];
    var val = style[propName];
    fromState[propName] = val == null ? defaultValue && defaultValue[propName] : val;
  }

  for (var i = 0; i < el.animators.length; i++) {
    var animator = el.animators[i];

    if (animator.__fromStateTransition && animator.__fromStateTransition.indexOf(toStateName) < 0 && animator.targetName === 'style') {
      animator.saveFinalToTarget(fromState, props);
    }
  }

  return fromState;
}

function createEmphasisDefaultState(el, stateName, targetStates, state) {
  var hasSelect = targetStates && util_1.indexOf(targetStates, 'select') >= 0;
  var cloned = false;

  if (el instanceof Path_1["default"]) {
    var store = getSavedStates(el);
    var fromFill = hasSelect ? store.selectFill || store.normalFill : store.normalFill;
    var fromStroke = hasSelect ? store.selectStroke || store.normalStroke : store.normalStroke;

    if (hasFillOrStroke(fromFill) || hasFillOrStroke(fromStroke)) {
      state = state || {};
      var emphasisStyle = state.style || {};

      if (!hasFillOrStroke(emphasisStyle.fill) && hasFillOrStroke(fromFill)) {
        cloned = true;
        state = util_1.extend({}, state);
        emphasisStyle = util_1.extend({}, emphasisStyle);
        emphasisStyle.fill = liftColor(fromFill);
      } else if (!hasFillOrStroke(emphasisStyle.stroke) && hasFillOrStroke(fromStroke)) {
        if (!cloned) {
          state = util_1.extend({}, state);
          emphasisStyle = util_1.extend({}, emphasisStyle);
        }

        emphasisStyle.stroke = liftColor(fromStroke);
      }

      state.style = emphasisStyle;
    }
  }

  if (state) {
    if (state.z2 == null) {
      if (!cloned) {
        state = util_1.extend({}, state);
      }

      var z2EmphasisLift = el.z2EmphasisLift;
      state.z2 = el.z2 + (z2EmphasisLift != null ? z2EmphasisLift : exports.Z2_EMPHASIS_LIFT);
    }
  }

  return state;
}

function createSelectDefaultState(el, stateName, state) {
  if (state) {
    if (state.z2 == null) {
      state = util_1.extend({}, state);
      var z2SelectLift = el.z2SelectLift;
      state.z2 = el.z2 + (z2SelectLift != null ? z2SelectLift : exports.Z2_SELECT_LIFT);
    }
  }

  return state;
}

function createBlurDefaultState(el, stateName, state) {
  var hasBlur = util_1.indexOf(el.currentStates, stateName) >= 0;
  var currentOpacity = el.style.opacity;
  var fromState = !hasBlur ? getFromStateStyle(el, ['opacity'], stateName, {
    opacity: 1
  }) : null;
  state = state || {};
  var blurStyle = state.style || {};

  if (blurStyle.opacity == null) {
    state = util_1.extend({}, state);
    blurStyle = util_1.extend({
      opacity: hasBlur ? currentOpacity : fromState.opacity * 0.1
    }, blurStyle);
    state.style = blurStyle;
  }

  return state;
}

function elementStateProxy(stateName, targetStates) {
  var state = this.states[stateName];

  if (this.style) {
    if (stateName === 'emphasis') {
      return createEmphasisDefaultState(this, stateName, targetStates, state);
    } else if (stateName === 'blur') {
      return createBlurDefaultState(this, stateName, state);
    } else if (stateName === 'select') {
      return createSelectDefaultState(this, stateName, state);
    }
  }

  return state;
}

function setDefaultStateProxy(el) {
  el.stateProxy = elementStateProxy;
  var textContent = el.getTextContent();
  var textGuide = el.getTextGuideLine();

  if (textContent) {
    textContent.stateProxy = elementStateProxy;
  }

  if (textGuide) {
    textGuide.stateProxy = elementStateProxy;
  }
}

exports.setDefaultStateProxy = setDefaultStateProxy;

function enterEmphasisWhenMouseOver(el, e) {
  !shouldSilent(el, e) && !el.__highByOuter && traverseUpdateState(el, singleEnterEmphasis);
}

exports.enterEmphasisWhenMouseOver = enterEmphasisWhenMouseOver;

function leaveEmphasisWhenMouseOut(el, e) {
  !shouldSilent(el, e) && !el.__highByOuter && traverseUpdateState(el, singleLeaveEmphasis);
}

exports.leaveEmphasisWhenMouseOut = leaveEmphasisWhenMouseOut;

function enterEmphasis(el, highlightDigit) {
  el.__highByOuter |= 1 << (highlightDigit || 0);
  traverseUpdateState(el, singleEnterEmphasis);
}

exports.enterEmphasis = enterEmphasis;

function leaveEmphasis(el, highlightDigit) {
  !(el.__highByOuter &= ~(1 << (highlightDigit || 0))) && traverseUpdateState(el, singleLeaveEmphasis);
}

exports.leaveEmphasis = leaveEmphasis;

function enterBlur(el) {
  traverseUpdateState(el, singleEnterBlur);
}

exports.enterBlur = enterBlur;

function leaveBlur(el) {
  traverseUpdateState(el, singleLeaveBlur);
}

exports.leaveBlur = leaveBlur;

function enterSelect(el) {
  traverseUpdateState(el, singleEnterSelect);
}

exports.enterSelect = enterSelect;

function leaveSelect(el) {
  traverseUpdateState(el, singleLeaveSelect);
}

exports.leaveSelect = leaveSelect;

function shouldSilent(el, e) {
  return el.__highDownSilentOnTouch && e.zrByTouch;
}

function allLeaveBlur(api) {
  var model = api.getModel();
  model.eachComponent(function (componentType, componentModel) {
    var view = componentType === 'series' ? api.getViewOfSeriesModel(componentModel) : api.getViewOfComponentModel(componentModel);
    view.group.traverse(function (child) {
      singleLeaveBlur(child);
    });
  });
}

function toggleSeriesBlurState(targetSeriesIndex, focus, blurScope, api, isBlur) {
  var ecModel = api.getModel();
  blurScope = blurScope || 'coordinateSystem';

  function leaveBlurOfIndices(data, dataIndices) {
    for (var i = 0; i < dataIndices.length; i++) {
      var itemEl = data.getItemGraphicEl(dataIndices[i]);
      itemEl && leaveBlur(itemEl);
    }
  }

  if (!isBlur) {
    allLeaveBlur(api);
    return;
  }

  if (targetSeriesIndex == null) {
    return;
  }

  if (!focus || focus === 'none') {
    return;
  }

  var targetSeriesModel = ecModel.getSeriesByIndex(targetSeriesIndex);
  var targetCoordSys = targetSeriesModel.coordinateSystem;

  if (targetCoordSys && targetCoordSys.master) {
    targetCoordSys = targetCoordSys.master;
  }

  var blurredSeries = [];
  ecModel.eachSeries(function (seriesModel) {
    var sameSeries = targetSeriesModel === seriesModel;
    var coordSys = seriesModel.coordinateSystem;

    if (coordSys && coordSys.master) {
      coordSys = coordSys.master;
    }

    var sameCoordSys = coordSys && targetCoordSys ? coordSys === targetCoordSys : sameSeries;

    if (!(blurScope === 'series' && !sameSeries || blurScope === 'coordinateSystem' && !sameCoordSys || focus === 'series' && sameSeries)) {
      var view = api.getViewOfSeriesModel(seriesModel);
      view.group.traverse(function (child) {
        singleEnterBlur(child);
      });

      if (util_1.isArrayLike(focus)) {
        leaveBlurOfIndices(seriesModel.getData(), focus);
      } else if (util_1.isObject(focus)) {
        var dataTypes = util_1.keys(focus);

        for (var d = 0; d < dataTypes.length; d++) {
          leaveBlurOfIndices(seriesModel.getData(dataTypes[d]), focus[dataTypes[d]]);
        }
      }

      blurredSeries.push(seriesModel);
    }
  });
  ecModel.eachComponent(function (componentType, componentModel) {
    if (componentType === 'series') {
      return;
    }

    var view = api.getViewOfComponentModel(componentModel);

    if (view && view.blurSeries) {
      view.blurSeries(blurredSeries, ecModel);
    }
  });
}

exports.toggleSeriesBlurState = toggleSeriesBlurState;

function toggleSeriesBlurStateFromPayload(seriesModel, payload, api) {
  if (!isHighDownPayload(payload)) {
    return;
  }

  var isHighlight = payload.type === exports.HIGHLIGHT_ACTION_TYPE;
  var seriesIndex = seriesModel.seriesIndex;
  var data = seriesModel.getData(payload.dataType);
  var dataIndex = model_1.queryDataIndex(data, payload);
  dataIndex = (util_1.isArray(dataIndex) ? dataIndex[0] : dataIndex) || 0;
  var el = data.getItemGraphicEl(dataIndex);

  if (!el) {
    var count = data.count();
    var current = 0;

    while (!el && current < count) {
      el = data.getItemGraphicEl(current++);
    }
  }

  if (el) {
    var ecData = innerStore_1.getECData(el);
    toggleSeriesBlurState(seriesIndex, ecData.focus, ecData.blurScope, api, isHighlight);
  } else {
    var focus_1 = seriesModel.get(['emphasis', 'focus']);
    var blurScope = seriesModel.get(['emphasis', 'blurScope']);

    if (focus_1 != null) {
      toggleSeriesBlurState(seriesIndex, focus_1, blurScope, api, isHighlight);
    }
  }
}

exports.toggleSeriesBlurStateFromPayload = toggleSeriesBlurStateFromPayload;

function toggleSelectionFromPayload(seriesModel, payload, api) {
  if (!isSelectChangePayload(payload)) {
    return;
  }

  var dataType = payload.dataType;
  var data = seriesModel.getData(dataType);
  var dataIndex = model_1.queryDataIndex(data, payload);

  if (!util_1.isArray(dataIndex)) {
    dataIndex = [dataIndex];
  }

  seriesModel[payload.type === exports.TOGGLE_SELECT_ACTION_TYPE ? 'toggleSelect' : payload.type === exports.SELECT_ACTION_TYPE ? 'select' : 'unselect'](dataIndex, dataType);
}

exports.toggleSelectionFromPayload = toggleSelectionFromPayload;

function updateSeriesElementSelection(seriesModel) {
  var allData = seriesModel.getAllData();
  util_1.each(allData, function (_a) {
    var data = _a.data,
        type = _a.type;
    data.eachItemGraphicEl(function (el, idx) {
      seriesModel.isSelected(idx, type) ? enterSelect(el) : leaveSelect(el);
    });
  });
}

exports.updateSeriesElementSelection = updateSeriesElementSelection;

function getAllSelectedIndices(ecModel) {
  var ret = [];
  ecModel.eachSeries(function (seriesModel) {
    var allData = seriesModel.getAllData();
    util_1.each(allData, function (_a) {
      var data = _a.data,
          type = _a.type;
      var dataIndices = seriesModel.getSelectedDataIndices();

      if (dataIndices.length > 0) {
        var item = {
          dataIndex: dataIndices,
          seriesIndex: seriesModel.seriesIndex
        };

        if (type != null) {
          item.dataType = type;
        }

        ret.push(item);
      }
    });
  });
  return ret;
}

exports.getAllSelectedIndices = getAllSelectedIndices;

function enableHoverEmphasis(el, focus, blurScope) {
  setAsHighDownDispatcher(el, true);
  traverseUpdateState(el, setDefaultStateProxy);
  enableHoverFocus(el, focus, blurScope);
}

exports.enableHoverEmphasis = enableHoverEmphasis;

function enableHoverFocus(el, focus, blurScope) {
  var ecData = innerStore_1.getECData(el);

  if (focus != null) {
    ecData.focus = focus;
    ecData.blurScope = blurScope;
  } else if (ecData.focus) {
    ecData.focus = null;
  }
}

exports.enableHoverFocus = enableHoverFocus;
var OTHER_STATES = ['emphasis', 'blur', 'select'];
var defaultStyleGetterMap = {
  itemStyle: 'getItemStyle',
  lineStyle: 'getLineStyle',
  areaStyle: 'getAreaStyle'
};

function setStatesStylesFromModel(el, itemModel, styleType, getter) {
  styleType = styleType || 'itemStyle';

  for (var i = 0; i < OTHER_STATES.length; i++) {
    var stateName = OTHER_STATES[i];
    var model = itemModel.getModel([stateName, styleType]);
    var state = el.ensureState(stateName);
    state.style = getter ? getter(model) : model[defaultStyleGetterMap[styleType]]();
  }
}

exports.setStatesStylesFromModel = setStatesStylesFromModel;

function setAsHighDownDispatcher(el, asDispatcher) {
  var disable = asDispatcher === false;
  var extendedEl = el;

  if (el.highDownSilentOnTouch) {
    extendedEl.__highDownSilentOnTouch = el.highDownSilentOnTouch;
  }

  if (!disable || extendedEl.__highDownDispatcher) {
    extendedEl.__highByOuter = extendedEl.__highByOuter || 0;
    extendedEl.__highDownDispatcher = !disable;
  }
}

exports.setAsHighDownDispatcher = setAsHighDownDispatcher;

function isHighDownDispatcher(el) {
  return !!(el && el.__highDownDispatcher);
}

exports.isHighDownDispatcher = isHighDownDispatcher;

function getHighlightDigit(highlightKey) {
  var highlightDigit = _highlightKeyMap[highlightKey];

  if (highlightDigit == null && _highlightNextDigit <= 32) {
    highlightDigit = _highlightKeyMap[highlightKey] = _highlightNextDigit++;
  }

  return highlightDigit;
}

exports.getHighlightDigit = getHighlightDigit;

function isSelectChangePayload(payload) {
  var payloadType = payload.type;
  return payloadType === exports.SELECT_ACTION_TYPE || payloadType === exports.UNSELECT_ACTION_TYPE || payloadType === exports.TOGGLE_SELECT_ACTION_TYPE;
}

exports.isSelectChangePayload = isSelectChangePayload;

function isHighDownPayload(payload) {
  var payloadType = payload.type;
  return payloadType === exports.HIGHLIGHT_ACTION_TYPE || payloadType === exports.DOWNPLAY_ACTION_TYPE;
}

exports.isHighDownPayload = isHighDownPayload;

function savePathStates(el) {
  var store = getSavedStates(el);
  store.normalFill = el.style.fill;
  store.normalStroke = el.style.stroke;
  var selectState = el.states.select || {};
  store.selectFill = selectState.style && selectState.style.fill || null;
  store.selectStroke = selectState.style && selectState.style.stroke || null;
}

exports.savePathStates = savePathStates;