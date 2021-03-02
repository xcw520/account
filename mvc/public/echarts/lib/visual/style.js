
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

var makeStyleMapper_1 = require("../model/mixin/makeStyleMapper");

var itemStyle_1 = require("../model/mixin/itemStyle");

var lineStyle_1 = require("../model/mixin/lineStyle");

var Model_1 = require("../model/Model");

var model_1 = require("../util/model");

var inner = model_1.makeInner();
var defaultStyleMappers = {
  itemStyle: makeStyleMapper_1["default"](itemStyle_1.ITEM_STYLE_KEY_MAP, true),
  lineStyle: makeStyleMapper_1["default"](lineStyle_1.LINE_STYLE_KEY_MAP, true)
};
var defaultColorKey = {
  lineStyle: 'stroke',
  itemStyle: 'fill'
};

function getStyleMapper(seriesModel, stylePath) {
  var styleMapper = seriesModel.visualStyleMapper || defaultStyleMappers[stylePath];

  if (!styleMapper) {
    console.warn("Unkown style type '" + stylePath + "'.");
    return defaultStyleMappers.itemStyle;
  }

  return styleMapper;
}

function getDefaultColorKey(seriesModel, stylePath) {
  var colorKey = seriesModel.visualDrawType || defaultColorKey[stylePath];

  if (!colorKey) {
    console.warn("Unkown style type '" + stylePath + "'.");
    return 'fill';
  }

  return colorKey;
}

var seriesStyleTask = {
  createOnAllSeries: true,
  performRawSeries: true,
  reset: function (seriesModel, ecModel) {
    var data = seriesModel.getData();
    var stylePath = seriesModel.visualStyleAccessPath || 'itemStyle';
    var styleModel = seriesModel.getModel(stylePath);
    var getStyle = getStyleMapper(seriesModel, stylePath);
    var globalStyle = getStyle(styleModel);
    var decalOption = styleModel.getShallow('decal');

    if (decalOption) {
      data.setVisual('decal', decalOption);
      decalOption.dirty = true;
    }

    var colorKey = getDefaultColorKey(seriesModel, stylePath);
    var color = globalStyle[colorKey];
    var colorCallback = util_1.isFunction(color) ? color : null;

    if (!globalStyle[colorKey] || colorCallback) {
      globalStyle[colorKey] = seriesModel.getColorFromPalette(seriesModel.name, null, ecModel.getSeriesCount());
      data.setVisual('colorFromPalette', true);
    }

    data.setVisual('style', globalStyle);
    data.setVisual('drawType', colorKey);

    if (!ecModel.isSeriesFiltered(seriesModel) && colorCallback) {
      data.setVisual('colorFromPalette', false);
      return {
        dataEach: function (data, idx) {
          var dataParams = seriesModel.getDataParams(idx);
          var itemStyle = util_1.extend({}, globalStyle);
          itemStyle[colorKey] = colorCallback(dataParams);
          data.setItemVisual(idx, 'style', itemStyle);
        }
      };
    }
  }
};
exports.seriesStyleTask = seriesStyleTask;
var sharedModel = new Model_1["default"]();
var dataStyleTask = {
  createOnAllSeries: true,
  performRawSeries: true,
  reset: function (seriesModel, ecModel) {
    if (seriesModel.ignoreStyleOnData || ecModel.isSeriesFiltered(seriesModel)) {
      return;
    }

    var data = seriesModel.getData();
    var stylePath = seriesModel.visualStyleAccessPath || 'itemStyle';
    var getStyle = getStyleMapper(seriesModel, stylePath);
    var colorKey = data.getVisual('drawType');
    return {
      dataEach: data.hasItemOption ? function (data, idx) {
        var rawItem = data.getRawDataItem(idx);

        if (rawItem && rawItem[stylePath]) {
          sharedModel.option = rawItem[stylePath];
          var style = getStyle(sharedModel);
          var existsStyle = data.ensureUniqueItemVisual(idx, 'style');
          util_1.extend(existsStyle, style);

          if (sharedModel.option.decal) {
            data.setItemVisual(idx, 'decal', sharedModel.option.decal);
            sharedModel.option.decal.dirty = true;
          }

          if (colorKey in style) {
            data.setItemVisual(idx, 'colorFromPalette', false);
          }
        }
      } : null
    };
  }
};
exports.dataStyleTask = dataStyleTask;
var dataColorPaletteTask = {
  performRawSeries: true,
  overallReset: function (ecModel) {
    var paletteScopeGroupByType = util_1.createHashMap();
    ecModel.eachSeries(function (seriesModel) {
      if (!seriesModel.useColorPaletteOnData) {
        return;
      }

      var colorScope = paletteScopeGroupByType.get(seriesModel.type);

      if (!colorScope) {
        colorScope = {};
        paletteScopeGroupByType.set(seriesModel.type, colorScope);
      }

      inner(seriesModel).scope = colorScope;
    });
    ecModel.eachSeries(function (seriesModel) {
      if (!seriesModel.useColorPaletteOnData || ecModel.isSeriesFiltered(seriesModel)) {
        return;
      }

      var dataAll = seriesModel.getRawData();
      var idxMap = {};
      var data = seriesModel.getData();
      var colorScope = inner(seriesModel).scope;
      var stylePath = seriesModel.visualStyleAccessPath || 'itemStyle';
      var colorKey = getDefaultColorKey(seriesModel, stylePath);
      data.each(function (idx) {
        var rawIdx = data.getRawIndex(idx);
        idxMap[rawIdx] = idx;
      });
      dataAll.each(function (rawIdx) {
        var idx = idxMap[rawIdx];
        var fromPalette = data.getItemVisual(idx, 'colorFromPalette');

        if (fromPalette) {
          var itemStyle = data.ensureUniqueItemVisual(idx, 'style');
          var name_1 = dataAll.getName(rawIdx) || rawIdx + '';
          var dataCount = dataAll.count();
          itemStyle[colorKey] = seriesModel.getColorFromPalette(name_1, colorScope, dataCount);
        }
      });
    });
  }
};
exports.dataColorPaletteTask = dataColorPaletteTask;