
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

var util_1 = require("zrender/lib/core/util");

var deprecatedLogs = {};

function isEC4CompatibleStyle(style, elType, hasOwnTextContentOption, hasOwnTextConfig) {
  return style && (style.legacy || style.legacy !== false && !hasOwnTextContentOption && !hasOwnTextConfig && elType !== 'tspan' && (elType === 'text' || util_1.hasOwn(style, 'text')));
}

exports.isEC4CompatibleStyle = isEC4CompatibleStyle;

function convertFromEC4CompatibleStyle(hostStyle, elType, isNormal) {
  var srcStyle = hostStyle;
  var textConfig;
  var textContent;
  var textContentStyle;

  if (elType === 'text') {
    textContentStyle = srcStyle;
  } else {
    textContentStyle = {};
    util_1.hasOwn(srcStyle, 'text') && (textContentStyle.text = srcStyle.text);
    util_1.hasOwn(srcStyle, 'rich') && (textContentStyle.rich = srcStyle.rich);
    util_1.hasOwn(srcStyle, 'textFill') && (textContentStyle.fill = srcStyle.textFill);
    util_1.hasOwn(srcStyle, 'textStroke') && (textContentStyle.stroke = srcStyle.textStroke);
    textContent = {
      type: 'text',
      style: textContentStyle,
      silent: true
    };
    textConfig = {};
    var hasOwnPos = util_1.hasOwn(srcStyle, 'textPosition');

    if (isNormal) {
      textConfig.position = hasOwnPos ? srcStyle.textPosition : 'inside';
    } else {
      hasOwnPos && (textConfig.position = srcStyle.textPosition);
    }

    util_1.hasOwn(srcStyle, 'textPosition') && (textConfig.position = srcStyle.textPosition);
    util_1.hasOwn(srcStyle, 'textOffset') && (textConfig.offset = srcStyle.textOffset);
    util_1.hasOwn(srcStyle, 'textRotation') && (textConfig.rotation = srcStyle.textRotation);
    util_1.hasOwn(srcStyle, 'textDistance') && (textConfig.distance = srcStyle.textDistance);
  }

  convertEC4CompatibleRichItem(textContentStyle, hostStyle);
  util_1.each(textContentStyle.rich, function (richItem) {
    convertEC4CompatibleRichItem(richItem, richItem);
  });
  return {
    textConfig: textConfig,
    textContent: textContent
  };
}

exports.convertFromEC4CompatibleStyle = convertFromEC4CompatibleStyle;

function convertEC4CompatibleRichItem(out, richItem) {
  if (!richItem) {
    return;
  }

  richItem.font = richItem.textFont || richItem.font;
  util_1.hasOwn(richItem, 'textStrokeWidth') && (out.lineWidth = richItem.textStrokeWidth);
  util_1.hasOwn(richItem, 'textAlign') && (out.align = richItem.textAlign);
  util_1.hasOwn(richItem, 'textVerticalAlign') && (out.verticalAlign = richItem.textVerticalAlign);
  util_1.hasOwn(richItem, 'textLineHeight') && (out.lineHeight = richItem.textLineHeight);
  util_1.hasOwn(richItem, 'textWidth') && (out.width = richItem.textWidth);
  util_1.hasOwn(richItem, 'textHeight') && (out.height = richItem.textHeight);
  util_1.hasOwn(richItem, 'textBackgroundColor') && (out.backgroundColor = richItem.textBackgroundColor);
  util_1.hasOwn(richItem, 'textPadding') && (out.padding = richItem.textPadding);
  util_1.hasOwn(richItem, 'textBorderColor') && (out.borderColor = richItem.textBorderColor);
  util_1.hasOwn(richItem, 'textBorderWidth') && (out.borderWidth = richItem.textBorderWidth);
  util_1.hasOwn(richItem, 'textBorderRadius') && (out.borderRadius = richItem.textBorderRadius);
  util_1.hasOwn(richItem, 'textBoxShadowColor') && (out.shadowColor = richItem.textBoxShadowColor);
  util_1.hasOwn(richItem, 'textBoxShadowBlur') && (out.shadowBlur = richItem.textBoxShadowBlur);
  util_1.hasOwn(richItem, 'textBoxShadowOffsetX') && (out.shadowOffsetX = richItem.textBoxShadowOffsetX);
  util_1.hasOwn(richItem, 'textBoxShadowOffsetY') && (out.shadowOffsetY = richItem.textBoxShadowOffsetY);
}

function convertToEC4StyleForCustomSerise(itemStl, txStl, txCfg) {
  var out = itemStl;
  out.textPosition = out.textPosition || txCfg.position || 'inside';
  txCfg.offset != null && (out.textOffset = txCfg.offset);
  txCfg.rotation != null && (out.textRotation = txCfg.rotation);
  txCfg.distance != null && (out.textDistance = txCfg.distance);
  var isInside = out.textPosition.indexOf('inside') >= 0;
  var hostFill = itemStl.fill || '#000';
  convertToEC4RichItem(out, txStl);
  var textFillNotSet = out.textFill == null;

  if (isInside) {
    if (textFillNotSet) {
      out.textFill = txCfg.insideFill || '#fff';
      !out.textStroke && txCfg.insideStroke && (out.textStroke = txCfg.insideStroke);
      !out.textStroke && (out.textStroke = hostFill);
      out.textStrokeWidth == null && (out.textStrokeWidth = 2);
    }
  } else {
    if (textFillNotSet) {
      out.textFill = txCfg.outsideFill || hostFill;
    }

    !out.textStroke && txCfg.outsideStroke && (out.textStroke = txCfg.outsideStroke);
  }

  out.text = txStl.text;
  out.rich = txStl.rich;
  util_1.each(txStl.rich, function (richItem) {
    convertToEC4RichItem(richItem, richItem);
  });
  return out;
}

exports.convertToEC4StyleForCustomSerise = convertToEC4StyleForCustomSerise;

function convertToEC4RichItem(out, richItem) {
  if (!richItem) {
    return;
  }

  util_1.hasOwn(richItem, 'fill') && (out.textFill = richItem.fill);
  util_1.hasOwn(richItem, 'stroke') && (out.textStroke = richItem.fill);
  util_1.hasOwn(richItem, 'lineWidth') && (out.textStrokeWidth = richItem.lineWidth);
  util_1.hasOwn(richItem, 'font') && (out.font = richItem.font);
  util_1.hasOwn(richItem, 'fontStyle') && (out.fontStyle = richItem.fontStyle);
  util_1.hasOwn(richItem, 'fontWeight') && (out.fontWeight = richItem.fontWeight);
  util_1.hasOwn(richItem, 'fontSize') && (out.fontSize = richItem.fontSize);
  util_1.hasOwn(richItem, 'fontFamily') && (out.fontFamily = richItem.fontFamily);
  util_1.hasOwn(richItem, 'align') && (out.textAlign = richItem.align);
  util_1.hasOwn(richItem, 'verticalAlign') && (out.textVerticalAlign = richItem.verticalAlign);
  util_1.hasOwn(richItem, 'lineHeight') && (out.textLineHeight = richItem.lineHeight);
  util_1.hasOwn(richItem, 'width') && (out.textWidth = richItem.width);
  util_1.hasOwn(richItem, 'height') && (out.textHeight = richItem.height);
  util_1.hasOwn(richItem, 'backgroundColor') && (out.textBackgroundColor = richItem.backgroundColor);
  util_1.hasOwn(richItem, 'padding') && (out.textPadding = richItem.padding);
  util_1.hasOwn(richItem, 'borderColor') && (out.textBorderColor = richItem.borderColor);
  util_1.hasOwn(richItem, 'borderWidth') && (out.textBorderWidth = richItem.borderWidth);
  util_1.hasOwn(richItem, 'borderRadius') && (out.textBorderRadius = richItem.borderRadius);
  util_1.hasOwn(richItem, 'shadowColor') && (out.textBoxShadowColor = richItem.shadowColor);
  util_1.hasOwn(richItem, 'shadowBlur') && (out.textBoxShadowBlur = richItem.shadowBlur);
  util_1.hasOwn(richItem, 'shadowOffsetX') && (out.textBoxShadowOffsetX = richItem.shadowOffsetX);
  util_1.hasOwn(richItem, 'shadowOffsetY') && (out.textBoxShadowOffsetY = richItem.shadowOffsetY);
  util_1.hasOwn(richItem, 'textShadowColor') && (out.textShadowColor = richItem.textShadowColor);
  util_1.hasOwn(richItem, 'textShadowBlur') && (out.textShadowBlur = richItem.textShadowBlur);
  util_1.hasOwn(richItem, 'textShadowOffsetX') && (out.textShadowOffsetX = richItem.textShadowOffsetX);
  util_1.hasOwn(richItem, 'textShadowOffsetY') && (out.textShadowOffsetY = richItem.textShadowOffsetY);
}

function warnDeprecated(deprecated, insteadApproach) {
  if (process.env.NODE_ENV !== 'production') {
    var key = deprecated + '^_^' + insteadApproach;

    if (!deprecatedLogs[key]) {
      console.warn("[ECharts] DEPRECATED: \"" + deprecated + "\" has been deprecated. " + insteadApproach);
      deprecatedLogs[key] = true;
    }
  }
}

exports.warnDeprecated = warnDeprecated;