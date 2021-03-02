
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

var format_1 = require("../../util/format");

var util_1 = require("zrender/lib/core/util");

var dataValueHelper_1 = require("../../data/helper/dataValueHelper");

var number_1 = require("../../util/number");

var TOOLTIP_NAME_TEXT_STYLE_CSS = 'font-size:12px;color:#6e7079';
var TOOLTIP_TEXT_STYLE_RICH = {
  fontSize: 12,
  fill: '#6e7079'
};
var TOOLTIP_VALUE_TEXT_STYLE_CSS = 'font-size:14px;color:#464646;font-weight:900';
var TOOLTIP_VALUE_TEXT_STYLE_RICH = {
  fontSize: 14,
  fill: '#464646',
  fontWeight: 900
};
var TOOLTIP_LINE_HEIGHT_CSS = 'line-height:1';
var HTML_GAPS = [0, 10, 20, 30];
var RICH_TEXT_GAPS = ['', '\n', '\n\n', '\n\n\n'];

function createTooltipMarkup(type, option) {
  option.type = type;
  return option;
}

exports.createTooltipMarkup = createTooltipMarkup;

function getBuilder(fragment) {
  return util_1.hasOwn(builderMap, fragment.type) && builderMap[fragment.type];
}

var builderMap = {
  section: {
    planLayout: function (fragment) {
      var subBlockLen = fragment.blocks.length;
      var thisBlockHasInnerGap = subBlockLen > 1 || subBlockLen > 0 && !fragment.noHeader;
      var thisGapLevelBetweenSubBlocks = 0;
      util_1.each(fragment.blocks, function (subBlock) {
        getBuilder(subBlock).planLayout(subBlock);
        var subGapLevel = subBlock.__gapLevelBetweenSubBlocks;

        if (subGapLevel >= thisGapLevelBetweenSubBlocks) {
          thisGapLevelBetweenSubBlocks = subGapLevel + (thisBlockHasInnerGap && (!subGapLevel || subBlock.type === 'section' && !subBlock.noHeader) ? 1 : 0);
        }
      });
      fragment.__gapLevelBetweenSubBlocks = thisGapLevelBetweenSubBlocks;
    },
    build: function (ctx, fragment, topMarginForOuterGap) {
      var noHeader = fragment.noHeader;
      var gaps = getGap(fragment);
      var subMarkupText = buildSubBlocks(ctx, fragment, noHeader ? topMarginForOuterGap : gaps.html);

      if (noHeader) {
        return subMarkupText;
      }

      var displayableHeader = format_1.makeValueReadable(fragment.header, 'ordinal', ctx.useUTC);

      if (ctx.renderMode === 'richText') {
        return wrapInlineNameRichText(ctx, displayableHeader) + gaps.richText + subMarkupText;
      } else {
        return wrapBlockHTML("<div style=\"" + TOOLTIP_NAME_TEXT_STYLE_CSS + ";" + TOOLTIP_LINE_HEIGHT_CSS + ";\">" + format_1.encodeHTML(displayableHeader) + '</div>' + subMarkupText, topMarginForOuterGap);
      }
    }
  },
  nameValue: {
    planLayout: function (fragment) {
      fragment.__gapLevelBetweenSubBlocks = 0;
    },
    build: function (ctx, fragment, topMarginForOuterGap) {
      var renderMode = ctx.renderMode;
      var noName = fragment.noName;
      var noValue = fragment.noValue;
      var noMarker = !fragment.markerType;
      var name = fragment.name;
      var value = fragment.value;
      var useUTC = ctx.useUTC;

      if (noName && noValue) {
        return;
      }

      var markerStr = noMarker ? '' : ctx.markupStyleCreator.makeTooltipMarker(fragment.markerType, fragment.markerColor || '#333', renderMode);
      var readableName = noName ? '' : format_1.makeValueReadable(name, 'ordinal', useUTC);
      var valueTypeOption = fragment.valueType;
      var readableValueList = noValue ? [] : util_1.isArray(value) ? util_1.map(value, function (val, idx) {
        return format_1.makeValueReadable(val, util_1.isArray(valueTypeOption) ? valueTypeOption[idx] : valueTypeOption, useUTC);
      }) : [format_1.makeValueReadable(value, util_1.isArray(valueTypeOption) ? valueTypeOption[0] : valueTypeOption, useUTC)];
      var valueAlignRight = !noMarker || !noName;
      var valueCloseToMarker = !noMarker && noName;
      return renderMode === 'richText' ? (noMarker ? '' : markerStr) + (noName ? '' : wrapInlineNameRichText(ctx, readableName)) + (noValue ? '' : wrapInlineValueRichText(ctx, readableValueList, valueAlignRight, valueCloseToMarker)) : wrapBlockHTML((noMarker ? '' : markerStr) + (noName ? '' : wrapInlineNameHTML(readableName, !noMarker)) + (noValue ? '' : wrapInlineValueHTML(readableValueList, valueAlignRight, valueCloseToMarker)), topMarginForOuterGap);
    }
  }
};

function buildSubBlocks(ctx, fragment, topMarginForOuterGap) {
  var subMarkupTextList = [];
  var subBlocks = fragment.blocks || [];
  util_1.assert(!subBlocks || util_1.isArray(subBlocks));
  subBlocks = subBlocks || [];
  var orderMode = ctx.orderMode;

  if (fragment.sortBlocks && orderMode) {
    subBlocks = subBlocks.slice();
    var orderMap = {
      valueAsc: 'asc',
      valueDesc: 'desc'
    };

    if (util_1.hasOwn(orderMap, orderMode)) {
      var comparator_1 = new dataValueHelper_1.SortOrderComparator(orderMap[orderMode], null);
      subBlocks.sort(function (a, b) {
        return comparator_1.evaluate(a.sortParam, b.sortParam);
      });
    } else if (orderMode === 'seriesDesc') {
      subBlocks.reverse();
    }
  }

  var gaps = getGap(fragment);
  util_1.each(subBlocks, function (subBlock, idx) {
    var subMarkupText = getBuilder(subBlock).build(ctx, subBlock, idx > 0 ? gaps.html : 0);
    subMarkupText != null && subMarkupTextList.push(subMarkupText);
  });

  if (!subMarkupTextList.length) {
    return;
  }

  return ctx.renderMode === 'richText' ? subMarkupTextList.join(gaps.richText) : wrapBlockHTML(subMarkupTextList.join(''), topMarginForOuterGap);
}

function buildTooltipMarkup(fragment, markupStyleCreator, renderMode, orderMode, useUTC) {
  if (!fragment) {
    return;
  }

  var builder = getBuilder(fragment);
  builder.planLayout(fragment);
  var ctx = {
    useUTC: useUTC,
    renderMode: renderMode,
    orderMode: orderMode,
    markupStyleCreator: markupStyleCreator
  };
  return builder.build(ctx, fragment, 0);
}

exports.buildTooltipMarkup = buildTooltipMarkup;

function getGap(fragment) {
  var gapLevelBetweenSubBlocks = fragment.__gapLevelBetweenSubBlocks;
  return {
    html: HTML_GAPS[gapLevelBetweenSubBlocks],
    richText: RICH_TEXT_GAPS[gapLevelBetweenSubBlocks]
  };
}

function wrapBlockHTML(encodedContent, topGap) {
  var clearfix = '<div style="clear:both"></div>';
  var marginCSS = "margin: " + topGap + "px 0 0";
  return "<div style=\"" + marginCSS + ";" + TOOLTIP_LINE_HEIGHT_CSS + ";\">" + encodedContent + clearfix + '</div>';
}

function wrapInlineNameHTML(name, leftHasMarker) {
  var marginCss = leftHasMarker ? 'margin-left:2px' : '';
  return "<span style=\"" + TOOLTIP_NAME_TEXT_STYLE_CSS + ";" + marginCss + "\">" + format_1.encodeHTML(name) + '</span>';
}

function wrapInlineValueHTML(valueList, alignRight, valueCloseToMarker) {
  var paddingStr = valueCloseToMarker ? '10px' : '20px';
  var alignCSS = alignRight ? "float:right;margin-left:" + paddingStr : '';
  return "<span style=\"" + alignCSS + ";" + TOOLTIP_VALUE_TEXT_STYLE_CSS + "\">" + util_1.map(valueList, function (value) {
    return format_1.encodeHTML(value);
  }).join('&nbsp;&nbsp;') + '</span>';
}

function wrapInlineNameRichText(ctx, name) {
  return ctx.markupStyleCreator.wrapRichTextStyle(name, TOOLTIP_TEXT_STYLE_RICH);
}

function wrapInlineValueRichText(ctx, valueList, alignRight, valueCloseToMarker) {
  var styles = [TOOLTIP_VALUE_TEXT_STYLE_RICH];
  var paddingLeft = valueCloseToMarker ? 10 : 20;
  alignRight && styles.push({
    padding: [0, 0, 0, paddingLeft],
    align: 'right'
  });
  return ctx.markupStyleCreator.wrapRichTextStyle(valueList.join('  '), styles);
}

function retrieveVisualColorForTooltipMarker(series, dataIndex) {
  var style = series.getData().getItemVisual(dataIndex, 'style');
  var color = style[series.visualDrawType];
  return format_1.convertToColorString(color);
}

exports.retrieveVisualColorForTooltipMarker = retrieveVisualColorForTooltipMarker;

function getPaddingFromTooltipModel(model, renderMode) {
  var padding = model.get('padding');
  return padding != null ? padding : renderMode === 'richText' ? [8, 10] : 10;
}

exports.getPaddingFromTooltipModel = getPaddingFromTooltipModel;

var TooltipMarkupStyleCreator = function () {
  function TooltipMarkupStyleCreator() {
    this.richTextStyles = {};
    this._nextStyleNameId = number_1.getRandomIdBase();
  }

  TooltipMarkupStyleCreator.prototype._generateStyleName = function () {
    return '__EC_aUTo_' + this._nextStyleNameId++;
  };

  TooltipMarkupStyleCreator.prototype.makeTooltipMarker = function (markerType, colorStr, renderMode) {
    var markerId = renderMode === 'richText' ? this._generateStyleName() : null;
    var marker = format_1.getTooltipMarker({
      color: colorStr,
      type: markerType,
      renderMode: renderMode,
      markerId: markerId
    });

    if (util_1.isString(marker)) {
      return marker;
    } else {
      if (process.env.NODE_ENV !== 'production') {
        util_1.assert(markerId);
      }

      this.richTextStyles[markerId] = marker.style;
      return marker.content;
    }
  };

  TooltipMarkupStyleCreator.prototype.wrapRichTextStyle = function (text, styles) {
    var finalStl = {};

    if (util_1.isArray(styles)) {
      util_1.each(styles, function (stl) {
        return util_1.extend(finalStl, stl);
      });
    } else {
      util_1.extend(finalStl, styles);
    }

    var styleName = this._generateStyleName();

    this.richTextStyles[styleName] = finalStl;
    return "{" + styleName + "|" + text + "}";
  };

  return TooltipMarkupStyleCreator;
}();

exports.TooltipMarkupStyleCreator = TooltipMarkupStyleCreator;