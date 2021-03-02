
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

var echarts = require("../../../echarts");

var zrUtil = require("zrender/lib/core/util");

var featureManager_1 = require("../featureManager");

var event_1 = require("zrender/lib/core/event");

var BLOCK_SPLITER = new Array(60).join('-');
var ITEM_SPLITER = '\t';

function groupSeries(ecModel) {
  var seriesGroupByCategoryAxis = {};
  var otherSeries = [];
  var meta = [];
  ecModel.eachRawSeries(function (seriesModel) {
    var coordSys = seriesModel.coordinateSystem;

    if (coordSys && (coordSys.type === 'cartesian2d' || coordSys.type === 'polar')) {
      var baseAxis = coordSys.getBaseAxis();

      if (baseAxis.type === 'category') {
        var key = baseAxis.dim + '_' + baseAxis.index;

        if (!seriesGroupByCategoryAxis[key]) {
          seriesGroupByCategoryAxis[key] = {
            categoryAxis: baseAxis,
            valueAxis: coordSys.getOtherAxis(baseAxis),
            series: []
          };
          meta.push({
            axisDim: baseAxis.dim,
            axisIndex: baseAxis.index
          });
        }

        seriesGroupByCategoryAxis[key].series.push(seriesModel);
      } else {
        otherSeries.push(seriesModel);
      }
    } else {
      otherSeries.push(seriesModel);
    }
  });
  return {
    seriesGroupByCategoryAxis: seriesGroupByCategoryAxis,
    other: otherSeries,
    meta: meta
  };
}

function assembleSeriesWithCategoryAxis(groups) {
  var tables = [];
  zrUtil.each(groups, function (group, key) {
    var categoryAxis = group.categoryAxis;
    var valueAxis = group.valueAxis;
    var valueAxisDim = valueAxis.dim;
    var headers = [' '].concat(zrUtil.map(group.series, function (series) {
      return series.name;
    }));
    var columns = [categoryAxis.model.getCategories()];
    zrUtil.each(group.series, function (series) {
      var rawData = series.getRawData();
      columns.push(series.getRawData().mapArray(rawData.mapDimension(valueAxisDim), function (val) {
        return val;
      }));
    });
    var lines = [headers.join(ITEM_SPLITER)];

    for (var i = 0; i < columns[0].length; i++) {
      var items = [];

      for (var j = 0; j < columns.length; j++) {
        items.push(columns[j][i]);
      }

      lines.push(items.join(ITEM_SPLITER));
    }

    tables.push(lines.join('\n'));
  });
  return tables.join('\n\n' + BLOCK_SPLITER + '\n\n');
}

function assembleOtherSeries(series) {
  return zrUtil.map(series, function (series) {
    var data = series.getRawData();
    var lines = [series.name];
    var vals = [];
    data.each(data.dimensions, function () {
      var argLen = arguments.length;
      var dataIndex = arguments[argLen - 1];
      var name = data.getName(dataIndex);

      for (var i = 0; i < argLen - 1; i++) {
        vals[i] = arguments[i];
      }

      lines.push((name ? name + ITEM_SPLITER : '') + vals.join(ITEM_SPLITER));
    });
    return lines.join('\n');
  }).join('\n\n' + BLOCK_SPLITER + '\n\n');
}

function getContentFromModel(ecModel) {
  var result = groupSeries(ecModel);
  return {
    value: zrUtil.filter([assembleSeriesWithCategoryAxis(result.seriesGroupByCategoryAxis), assembleOtherSeries(result.other)], function (str) {
      return !!str.replace(/[\n\t\s]/g, '');
    }).join('\n\n' + BLOCK_SPLITER + '\n\n'),
    meta: result.meta
  };
}

function trim(str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function isTSVFormat(block) {
  var firstLine = block.slice(0, block.indexOf('\n'));

  if (firstLine.indexOf(ITEM_SPLITER) >= 0) {
    return true;
  }
}

var itemSplitRegex = new RegExp('[' + ITEM_SPLITER + ']+', 'g');

function parseTSVContents(tsv) {
  var tsvLines = tsv.split(/\n+/g);
  var headers = trim(tsvLines.shift()).split(itemSplitRegex);
  var categories = [];
  var series = zrUtil.map(headers, function (header) {
    return {
      name: header,
      data: []
    };
  });

  for (var i = 0; i < tsvLines.length; i++) {
    var items = trim(tsvLines[i]).split(itemSplitRegex);
    categories.push(items.shift());

    for (var j = 0; j < items.length; j++) {
      series[j] && (series[j].data[i] = items[j]);
    }
  }

  return {
    series: series,
    categories: categories
  };
}

function parseListContents(str) {
  var lines = str.split(/\n+/g);
  var seriesName = trim(lines.shift());
  var data = [];

  for (var i = 0; i < lines.length; i++) {
    var line = trim(lines[i]);

    if (!line) {
      continue;
    }

    var items = line.split(itemSplitRegex);
    var name_1 = '';
    var value = void 0;
    var hasName = false;

    if (isNaN(items[0])) {
      hasName = true;
      name_1 = items[0];
      items = items.slice(1);
      data[i] = {
        name: name_1,
        value: []
      };
      value = data[i].value;
    } else {
      value = data[i] = [];
    }

    for (var j = 0; j < items.length; j++) {
      value.push(+items[j]);
    }

    if (value.length === 1) {
      hasName ? data[i].value = value[0] : data[i] = value[0];
    }
  }

  return {
    name: seriesName,
    data: data
  };
}

function parseContents(str, blockMetaList) {
  var blocks = str.split(new RegExp('\n*' + BLOCK_SPLITER + '\n*', 'g'));
  var newOption = {
    series: []
  };
  zrUtil.each(blocks, function (block, idx) {
    if (isTSVFormat(block)) {
      var result = parseTSVContents(block);
      var blockMeta = blockMetaList[idx];
      var axisKey = blockMeta.axisDim + 'Axis';

      if (blockMeta) {
        newOption[axisKey] = newOption[axisKey] || [];
        newOption[axisKey][blockMeta.axisIndex] = {
          data: result.categories
        };
        newOption.series = newOption.series.concat(result.series);
      }
    } else {
      var result = parseListContents(block);
      newOption.series.push(result);
    }
  });
  return newOption;
}

var DataView = function (_super) {
  tslib_1.__extends(DataView, _super);

  function DataView() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  DataView.prototype.onclick = function (ecModel, api) {
    var container = api.getDom();
    var model = this.model;

    if (this._dom) {
      container.removeChild(this._dom);
    }

    var root = document.createElement('div');
    root.style.cssText = 'position:absolute;left:5px;top:5px;bottom:5px;right:5px;';
    root.style.backgroundColor = model.get('backgroundColor') || '#fff';
    var header = document.createElement('h4');
    var lang = model.get('lang') || [];
    header.innerHTML = lang[0] || model.get('title');
    header.style.cssText = 'margin: 10px 20px;';
    header.style.color = model.get('textColor');
    var viewMain = document.createElement('div');
    var textarea = document.createElement('textarea');
    viewMain.style.cssText = 'display:block;width:100%;overflow:auto;';
    var optionToContent = model.get('optionToContent');
    var contentToOption = model.get('contentToOption');
    var result = getContentFromModel(ecModel);

    if (typeof optionToContent === 'function') {
      var htmlOrDom = optionToContent(api.getOption());

      if (typeof htmlOrDom === 'string') {
        viewMain.innerHTML = htmlOrDom;
      } else if (zrUtil.isDom(htmlOrDom)) {
        viewMain.appendChild(htmlOrDom);
      }
    } else {
      viewMain.appendChild(textarea);
      textarea.readOnly = model.get('readOnly');
      textarea.style.cssText = 'width:100%;height:100%;font-family:monospace;font-size:14px;line-height:1.6rem;';
      textarea.style.color = model.get('textColor');
      textarea.style.borderColor = model.get('textareaBorderColor');
      textarea.style.backgroundColor = model.get('textareaColor');
      textarea.value = result.value;
    }

    var blockMetaList = result.meta;
    var buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'position:absolute;bottom:0;left:0;right:0;';
    var buttonStyle = 'float:right;margin-right:20px;border:none;' + 'cursor:pointer;padding:2px 5px;font-size:12px;border-radius:3px';
    var closeButton = document.createElement('div');
    var refreshButton = document.createElement('div');
    buttonStyle += ';background-color:' + model.get('buttonColor');
    buttonStyle += ';color:' + model.get('buttonTextColor');
    var self = this;

    function close() {
      container.removeChild(root);
      self._dom = null;
    }

    event_1.addEventListener(closeButton, 'click', close);
    event_1.addEventListener(refreshButton, 'click', function () {
      if (contentToOption == null && optionToContent != null || contentToOption != null && optionToContent == null) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('It seems you have just provided one of `contentToOption` and `optionToContent` functions but missed the other one. Data change is ignored.');
        }

        close();
        return;
      }

      var newOption;

      try {
        if (typeof contentToOption === 'function') {
          newOption = contentToOption(viewMain, api.getOption());
        } else {
          newOption = parseContents(textarea.value, blockMetaList);
        }
      } catch (e) {
        close();
        throw new Error('Data view format error ' + e);
      }

      if (newOption) {
        api.dispatchAction({
          type: 'changeDataView',
          newOption: newOption
        });
      }

      close();
    });
    closeButton.innerHTML = lang[1];
    refreshButton.innerHTML = lang[2];
    refreshButton.style.cssText = buttonStyle;
    closeButton.style.cssText = buttonStyle;
    !model.get('readOnly') && buttonContainer.appendChild(refreshButton);
    buttonContainer.appendChild(closeButton);
    root.appendChild(header);
    root.appendChild(viewMain);
    root.appendChild(buttonContainer);
    viewMain.style.height = container.clientHeight - 80 + 'px';
    container.appendChild(root);
    this._dom = root;
  };

  DataView.prototype.remove = function (ecModel, api) {
    this._dom && api.getDom().removeChild(this._dom);
  };

  DataView.prototype.dispose = function (ecModel, api) {
    this.remove(ecModel, api);
  };

  DataView.getDefaultOption = function (ecModel) {
    var defaultOption = {
      show: true,
      readOnly: false,
      optionToContent: null,
      contentToOption: null,
      icon: 'M17.5,17.3H33 M17.5,17.3H33 M45.4,29.5h-28 M11.5,2v56H51V14.8L38.4,2H11.5z M38.4,2.2v12.7H51 M45.4,41.7h-28',
      title: ecModel.getLocale(['toolbox', 'dataView', 'title']),
      lang: ecModel.getLocale(['toolbox', 'dataView', 'lang']),
      backgroundColor: '#fff',
      textColor: '#000',
      textareaColor: '#fff',
      textareaBorderColor: '#333',
      buttonColor: '#c23531',
      buttonTextColor: '#fff'
    };
    return defaultOption;
  };

  return DataView;
}(featureManager_1.ToolboxFeature);

function tryMergeDataOption(newData, originalData) {
  return zrUtil.map(newData, function (newVal, idx) {
    var original = originalData && originalData[idx];

    if (zrUtil.isObject(original) && !zrUtil.isArray(original)) {
      var newValIsObject = zrUtil.isObject(newVal) && !zrUtil.isArray(newVal);

      if (!newValIsObject) {
        newVal = {
          value: newVal
        };
      }

      var shouldDeleteName = original.name != null && newVal.name == null;
      newVal = zrUtil.defaults(newVal, original);
      shouldDeleteName && delete newVal.name;
      return newVal;
    } else {
      return newVal;
    }
  });
}

featureManager_1.registerFeature('dataView', DataView);
echarts.registerAction({
  type: 'changeDataView',
  event: 'dataViewChanged',
  update: 'prepareAndUpdate'
}, function (payload, ecModel) {
  var newSeriesOptList = [];
  zrUtil.each(payload.newOption.series, function (seriesOpt) {
    var seriesModel = ecModel.getSeriesByName(seriesOpt.name)[0];

    if (!seriesModel) {
      newSeriesOptList.push(zrUtil.extend({
        type: 'scatter'
      }, seriesOpt));
    } else {
      var originalData = seriesModel.get('data');
      newSeriesOptList.push({
        name: seriesOpt.name,
        data: tryMergeDataOption(seriesOpt.data, originalData)
      });
    }
  });
  ecModel.mergeOption(zrUtil.defaults({
    series: newSeriesOptList
  }, payload.newOption));
});
exports["default"] = DataView;