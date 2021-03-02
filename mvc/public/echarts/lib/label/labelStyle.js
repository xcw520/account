
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

var Text_1 = require("zrender/lib/graphic/Text");

var util_1 = require("zrender/lib/core/util");

var states_1 = require("../util/states");

var log_1 = require("../util/log");

var model_1 = require("../util/model");

var graphic_1 = require("../util/graphic");

var EMPTY_OBJ = {};

function setLabelText(label, labelTexts) {
  for (var i = 0; i < states_1.SPECIAL_STATES.length; i++) {
    var stateName = states_1.SPECIAL_STATES[i];
    var text = labelTexts[stateName];
    var state = label.ensureState(stateName);
    state.style = state.style || {};
    state.style.text = text;
  }

  var oldStates = label.currentStates.slice();
  label.clearStates(true);
  label.setStyle({
    text: labelTexts.normal
  });
  label.useStates(oldStates, true);
}

exports.setLabelText = setLabelText;

function getLabelText(opt, stateModels, overrideValue) {
  var labelFetcher = opt.labelFetcher;
  var labelDataIndex = opt.labelDataIndex;
  var labelDimIndex = opt.labelDimIndex;
  var normalModel = stateModels.normal;
  var baseText;

  if (labelFetcher) {
    baseText = labelFetcher.getFormattedLabel(labelDataIndex, 'normal', null, labelDimIndex, normalModel && normalModel.get('formatter'), overrideValue != null ? {
      value: overrideValue
    } : null);
  }

  if (baseText == null) {
    baseText = util_1.isFunction(opt.defaultText) ? opt.defaultText(labelDataIndex, opt, overrideValue) : opt.defaultText;
  }

  var statesText = {
    normal: baseText
  };

  for (var i = 0; i < states_1.SPECIAL_STATES.length; i++) {
    var stateName = states_1.SPECIAL_STATES[i];
    var stateModel = stateModels[stateName];
    statesText[stateName] = util_1.retrieve2(labelFetcher ? labelFetcher.getFormattedLabel(labelDataIndex, stateName, null, labelDimIndex, stateModel && stateModel.get('formatter')) : null, baseText);
  }

  return statesText;
}

exports.getLabelText = getLabelText;

function setLabelStyle(targetEl, labelStatesModels, opt, stateSpecified) {
  opt = opt || EMPTY_OBJ;
  var isSetOnText = targetEl instanceof Text_1["default"];
  var needsCreateText = false;

  for (var i = 0; i < states_1.DISPLAY_STATES.length; i++) {
    var stateModel = labelStatesModels[states_1.DISPLAY_STATES[i]];

    if (stateModel && stateModel.getShallow('show')) {
      needsCreateText = true;
      break;
    }
  }

  var textContent = isSetOnText ? targetEl : targetEl.getTextContent();

  if (needsCreateText) {
    if (!isSetOnText) {
      if (!textContent) {
        textContent = new Text_1["default"]();
        targetEl.setTextContent(textContent);
      }

      if (targetEl.stateProxy) {
        textContent.stateProxy = targetEl.stateProxy;
      }
    }

    var labelStatesTexts = getLabelText(opt, labelStatesModels);
    var normalModel = labelStatesModels.normal;
    var showNormal = !!normalModel.getShallow('show');
    var normalStyle = createTextStyle(normalModel, stateSpecified && stateSpecified.normal, opt, false, !isSetOnText);
    normalStyle.text = labelStatesTexts.normal;

    if (!isSetOnText) {
      targetEl.setTextConfig(createTextConfig(normalModel, opt, false));
    }

    for (var i = 0; i < states_1.SPECIAL_STATES.length; i++) {
      var stateName = states_1.SPECIAL_STATES[i];
      var stateModel = labelStatesModels[stateName];

      if (stateModel) {
        var stateObj = textContent.ensureState(stateName);
        var stateShow = !!util_1.retrieve2(stateModel.getShallow('show'), showNormal);

        if (stateShow !== showNormal) {
          stateObj.ignore = !stateShow;
        }

        stateObj.style = createTextStyle(stateModel, stateSpecified && stateSpecified[stateName], opt, true, !isSetOnText);
        stateObj.style.text = labelStatesTexts[stateName];

        if (!isSetOnText) {
          var targetElEmphasisState = targetEl.ensureState(stateName);
          targetElEmphasisState.textConfig = createTextConfig(stateModel, opt, true);
        }
      }
    }

    textContent.silent = !!normalModel.getShallow('silent');

    if (textContent.style.x != null) {
      normalStyle.x = textContent.style.x;
    }

    if (textContent.style.y != null) {
      normalStyle.y = textContent.style.y;
    }

    textContent.ignore = !showNormal;
    textContent.useStyle(normalStyle);
    textContent.dirty();

    if (opt.enableTextSetter) {
      exports.labelInner(textContent).setLabelText = function (overrideValue) {
        var labelStatesTexts = getLabelText(opt, labelStatesModels, overrideValue);
        setLabelText(textContent, labelStatesTexts);
      };
    }
  } else if (textContent) {
    textContent.ignore = true;
  }

  targetEl.dirty();
}

exports.setLabelStyle = setLabelStyle;

function getLabelStatesModels(itemModel, labelName) {
  labelName = labelName || 'label';
  var statesModels = {
    normal: itemModel.getModel(labelName)
  };

  for (var i = 0; i < states_1.SPECIAL_STATES.length; i++) {
    var stateName = states_1.SPECIAL_STATES[i];
    statesModels[stateName] = itemModel.getModel([stateName, labelName]);
  }

  return statesModels;
}

exports.getLabelStatesModels = getLabelStatesModels;

function createTextStyle(textStyleModel, specifiedTextStyle, opt, isNotNormal, isAttached) {
  var textStyle = {};
  setTextStyleCommon(textStyle, textStyleModel, opt, isNotNormal, isAttached);
  specifiedTextStyle && util_1.extend(textStyle, specifiedTextStyle);
  return textStyle;
}

exports.createTextStyle = createTextStyle;

function createTextConfig(textStyleModel, opt, isNotNormal) {
  opt = opt || {};
  var textConfig = {};
  var labelPosition;
  var labelRotate = textStyleModel.getShallow('rotate');
  var labelDistance = util_1.retrieve2(textStyleModel.getShallow('distance'), isNotNormal ? null : 5);
  var labelOffset = textStyleModel.getShallow('offset');
  labelPosition = textStyleModel.getShallow('position') || (isNotNormal ? null : 'inside');
  labelPosition === 'outside' && (labelPosition = opt.defaultOutsidePosition || 'top');

  if (labelPosition != null) {
    textConfig.position = labelPosition;
  }

  if (labelOffset != null) {
    textConfig.offset = labelOffset;
  }

  if (labelRotate != null) {
    labelRotate *= Math.PI / 180;
    textConfig.rotation = labelRotate;
  }

  if (labelDistance != null) {
    textConfig.distance = labelDistance;
  }

  textConfig.outsideFill = textStyleModel.get('color') === 'inherit' ? opt.inheritColor || null : 'auto';
  return textConfig;
}

exports.createTextConfig = createTextConfig;

function setTextStyleCommon(textStyle, textStyleModel, opt, isNotNormal, isAttached) {
  opt = opt || EMPTY_OBJ;
  var ecModel = textStyleModel.ecModel;
  var globalTextStyle = ecModel && ecModel.option.textStyle;
  var richItemNames = getRichItemNames(textStyleModel);
  var richResult;

  if (richItemNames) {
    richResult = {};

    for (var name_1 in richItemNames) {
      if (richItemNames.hasOwnProperty(name_1)) {
        var richTextStyle = textStyleModel.getModel(['rich', name_1]);
        setTokenTextStyle(richResult[name_1] = {}, richTextStyle, globalTextStyle, opt, isNotNormal, isAttached, false, true);
      }
    }
  }

  if (richResult) {
    textStyle.rich = richResult;
  }

  var overflow = textStyleModel.get('overflow');

  if (overflow) {
    textStyle.overflow = overflow;
  }

  var margin = textStyleModel.get('minMargin');

  if (margin != null) {
    textStyle.margin = margin;
  }

  setTokenTextStyle(textStyle, textStyleModel, globalTextStyle, opt, isNotNormal, isAttached, true, false);
}

function getRichItemNames(textStyleModel) {
  var richItemNameMap;

  while (textStyleModel && textStyleModel !== textStyleModel.ecModel) {
    var rich = (textStyleModel.option || EMPTY_OBJ).rich;

    if (rich) {
      richItemNameMap = richItemNameMap || {};
      var richKeys = util_1.keys(rich);

      for (var i = 0; i < richKeys.length; i++) {
        var richKey = richKeys[i];
        richItemNameMap[richKey] = 1;
      }
    }

    textStyleModel = textStyleModel.parentModel;
  }

  return richItemNameMap;
}

var TEXT_PROPS_WITH_GLOBAL = ['fontStyle', 'fontWeight', 'fontSize', 'fontFamily', 'textShadowColor', 'textShadowBlur', 'textShadowOffsetX', 'textShadowOffsetY'];
var TEXT_PROPS_SELF = ['align', 'lineHeight', 'width', 'height', 'tag', 'verticalAlign'];
var TEXT_PROPS_BOX = ['padding', 'borderWidth', 'borderRadius', 'borderDashOffset', 'backgroundColor', 'borderColor', 'shadowColor', 'shadowBlur', 'shadowOffsetX', 'shadowOffsetY'];

function setTokenTextStyle(textStyle, textStyleModel, globalTextStyle, opt, isNotNormal, isAttached, isBlock, inRich) {
  globalTextStyle = !isNotNormal && globalTextStyle || EMPTY_OBJ;
  var inheritColor = opt && opt.inheritColor;
  var fillColor = textStyleModel.getShallow('color');
  var strokeColor = textStyleModel.getShallow('textBorderColor');
  var opacity = util_1.retrieve2(textStyleModel.getShallow('opacity'), globalTextStyle.opacity);

  if (fillColor === 'inherit' || fillColor === 'auto') {
    if (process.env.NODE_ENV !== 'production') {
      if (fillColor === 'auto') {
        log_1.deprecateReplaceLog('color: \'auto\'', 'color: \'inherit\'');
      }
    }

    if (inheritColor) {
      fillColor = inheritColor;
    } else {
      fillColor = null;
    }
  }

  if (strokeColor === 'inherit' || strokeColor === 'auto') {
    if (process.env.NODE_ENV !== 'production') {
      if (strokeColor === 'auto') {
        log_1.deprecateReplaceLog('color: \'auto\'', 'color: \'inherit\'');
      }
    }

    if (inheritColor) {
      strokeColor = inheritColor;
    } else {
      strokeColor = null;
    }
  }

  if (!isAttached) {
    fillColor = fillColor || globalTextStyle.color;
    strokeColor = strokeColor || globalTextStyle.textBorderColor;
  }

  if (fillColor != null) {
    textStyle.fill = fillColor;
  }

  if (strokeColor != null) {
    textStyle.stroke = strokeColor;
  }

  var textBorderWidth = util_1.retrieve2(textStyleModel.getShallow('textBorderWidth'), globalTextStyle.textBorderWidth);

  if (textBorderWidth != null) {
    textStyle.lineWidth = textBorderWidth;
  }

  var textBorderType = util_1.retrieve2(textStyleModel.getShallow('textBorderType'), globalTextStyle.textBorderType);

  if (textBorderType != null) {
    textStyle.lineDash = textBorderType;
  }

  var textBorderDashOffset = util_1.retrieve2(textStyleModel.getShallow('textBorderDashOffset'), globalTextStyle.textBorderDashOffset);

  if (textBorderDashOffset != null) {
    textStyle.lineDashOffset = textBorderDashOffset;
  }

  if (!isNotNormal && opacity == null && !inRich) {
    opacity = opt && opt.defaultOpacity;
  }

  if (opacity != null) {
    textStyle.opacity = opacity;
  }

  if (!isNotNormal && !isAttached) {
    if (textStyle.fill == null && opt.inheritColor) {
      textStyle.fill = opt.inheritColor;
    }
  }

  for (var i = 0; i < TEXT_PROPS_WITH_GLOBAL.length; i++) {
    var key = TEXT_PROPS_WITH_GLOBAL[i];
    var val = util_1.retrieve2(textStyleModel.getShallow(key), globalTextStyle[key]);

    if (val != null) {
      textStyle[key] = val;
    }
  }

  for (var i = 0; i < TEXT_PROPS_SELF.length; i++) {
    var key = TEXT_PROPS_SELF[i];
    var val = textStyleModel.getShallow(key);

    if (val != null) {
      textStyle[key] = val;
    }
  }

  if (textStyle.verticalAlign == null) {
    var baseline = textStyleModel.getShallow('baseline');

    if (baseline != null) {
      textStyle.verticalAlign = baseline;
    }
  }

  if (!isBlock || !opt.disableBox) {
    for (var i = 0; i < TEXT_PROPS_BOX.length; i++) {
      var key = TEXT_PROPS_BOX[i];
      var val = textStyleModel.getShallow(key);

      if (val != null) {
        textStyle[key] = val;
      }
    }

    var borderType = textStyleModel.getShallow('borderType');

    if (borderType != null) {
      textStyle.borderDash = borderType;
    }

    if ((textStyle.backgroundColor === 'auto' || textStyle.backgroundColor === 'inherit') && inheritColor) {
      if (process.env.NODE_ENV !== 'production') {
        if (textStyle.backgroundColor === 'auto') {
          log_1.deprecateReplaceLog('backgroundColor: \'auto\'', 'backgroundColor: \'inherit\'');
        }
      }

      textStyle.backgroundColor = inheritColor;
    }

    if ((textStyle.borderColor === 'auto' || textStyle.borderColor === 'inherit') && inheritColor) {
      if (process.env.NODE_ENV !== 'production') {
        if (textStyle.borderColor === 'auto') {
          log_1.deprecateReplaceLog('borderColor: \'auto\'', 'borderColor: \'inherit\'');
        }
      }

      textStyle.borderColor = inheritColor;
    }
  }
}

function getFont(opt, ecModel) {
  var gTextStyleModel = ecModel && ecModel.getModel('textStyle');
  return util_1.trim([opt.fontStyle || gTextStyleModel && gTextStyleModel.getShallow('fontStyle') || '', opt.fontWeight || gTextStyleModel && gTextStyleModel.getShallow('fontWeight') || '', (opt.fontSize || gTextStyleModel && gTextStyleModel.getShallow('fontSize') || 12) + 'px', opt.fontFamily || gTextStyleModel && gTextStyleModel.getShallow('fontFamily') || 'sans-serif'].join(' '));
}

exports.getFont = getFont;
exports.labelInner = model_1.makeInner();

function setLabelValueAnimation(label, labelStatesModels, value, getDefaultText) {
  if (!label) {
    return;
  }

  var obj = exports.labelInner(label);
  obj.prevValue = obj.value;
  obj.value = value;
  var normalLabelModel = labelStatesModels.normal;
  obj.valueAnimation = normalLabelModel.get('valueAnimation');

  if (obj.valueAnimation) {
    obj.precision = normalLabelModel.get('precision');
    obj.defaultInterpolatedText = getDefaultText;
    obj.statesModels = labelStatesModels;
  }
}

exports.setLabelValueAnimation = setLabelValueAnimation;

function animateLabelValue(textEl, dataIndex, data, seriesModel) {
  var labelInnerStore = exports.labelInner(textEl);

  if (!labelInnerStore.valueAnimation) {
    return;
  }

  var defaultInterpolatedText = labelInnerStore.defaultInterpolatedText;
  var prevValue = labelInnerStore.prevValue;
  var currentValue = labelInnerStore.value;

  function during(percent) {
    var interpolated = model_1.interpolateRawValues(data, labelInnerStore.precision, prevValue, currentValue, percent);
    var labelText = getLabelText({
      labelDataIndex: dataIndex,
      defaultText: defaultInterpolatedText ? defaultInterpolatedText(interpolated) : interpolated + ''
    }, labelInnerStore.statesModels, interpolated);
    setLabelText(textEl, labelText);
  }

  (prevValue == null ? graphic_1.initProps : graphic_1.updateProps)(textEl, {}, seriesModel, dataIndex, null, during);
}

exports.animateLabelValue = animateLabelValue;