
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

var _a, _b, _c;

exports.__esModule = true;

var util_1 = require("zrender/lib/core/util");

var model_1 = require("../../util/model");

var Source_1 = require("../Source");

var types_1 = require("../../util/types");

var providerMethods;
var mountMethods;

var DefaultDataProvider = function () {
  function DefaultDataProvider(sourceParam, dimSize) {
    var source = !Source_1.isSourceInstance(sourceParam) ? Source_1.createSourceFromSeriesDataOption(sourceParam) : sourceParam;
    this._source = source;
    var data = this._data = source.data;

    if (source.sourceFormat === types_1.SOURCE_FORMAT_TYPED_ARRAY) {
      if (process.env.NODE_ENV !== 'production') {
        if (dimSize == null) {
          throw new Error('Typed array data must specify dimension size');
        }
      }

      this._offset = 0;
      this._dimSize = dimSize;
      this._data = data;
    }

    mountMethods(this, data, source);
  }

  DefaultDataProvider.prototype.getSource = function () {
    return this._source;
  };

  DefaultDataProvider.prototype.count = function () {
    return 0;
  };

  DefaultDataProvider.prototype.getItem = function (idx, out) {
    return;
  };

  DefaultDataProvider.prototype.appendData = function (newData) {};

  DefaultDataProvider.prototype.clean = function () {};

  DefaultDataProvider.protoInitialize = function () {
    var proto = DefaultDataProvider.prototype;
    proto.pure = false;
    proto.persistent = true;
  }();

  DefaultDataProvider.internalField = function () {
    var _a;

    mountMethods = function (provider, data, source) {
      var sourceFormat = source.sourceFormat;
      var seriesLayoutBy = source.seriesLayoutBy;
      var startIndex = source.startIndex;
      var dimsDef = source.dimensionsDefine;
      var methods = providerMethods[getMethodMapKey(sourceFormat, seriesLayoutBy)];

      if (process.env.NODE_ENV !== 'production') {
        util_1.assert(methods, 'Invalide sourceFormat: ' + sourceFormat);
      }

      util_1.extend(provider, methods);

      if (sourceFormat === types_1.SOURCE_FORMAT_TYPED_ARRAY) {
        provider.getItem = getItemForTypedArray;
        provider.count = countForTypedArray;
        provider.fillStorage = fillStorageForTypedArray;
      } else {
        var rawItemGetter = getRawSourceItemGetter(sourceFormat, seriesLayoutBy);
        provider.getItem = util_1.bind(rawItemGetter, null, data, startIndex, dimsDef);
        var rawCounter = getRawSourceDataCounter(sourceFormat, seriesLayoutBy);
        provider.count = util_1.bind(rawCounter, null, data, startIndex, dimsDef);
      }
    };

    var getItemForTypedArray = function (idx, out) {
      idx = idx - this._offset;
      out = out || [];
      var data = this._data;
      var dimSize = this._dimSize;
      var offset = dimSize * idx;

      for (var i = 0; i < dimSize; i++) {
        out[i] = data[offset + i];
      }

      return out;
    };

    var fillStorageForTypedArray = function (start, end, storage, extent) {
      var data = this._data;
      var dimSize = this._dimSize;

      for (var dim = 0; dim < dimSize; dim++) {
        var dimExtent = extent[dim];
        var min = dimExtent[0] == null ? Infinity : dimExtent[0];
        var max = dimExtent[1] == null ? -Infinity : dimExtent[1];
        var count = end - start;
        var arr = storage[dim];

        for (var i = 0; i < count; i++) {
          var val = data[(start + i) * dimSize + dim];
          arr[start + i] = val;
          val < min && (min = val);
          val > max && (max = val);
        }

        dimExtent[0] = min;
        dimExtent[1] = max;
      }
    };

    var countForTypedArray = function () {
      return this._data ? this._data.length / this._dimSize : 0;
    };

    providerMethods = (_a = {}, _a[types_1.SOURCE_FORMAT_ARRAY_ROWS + '_' + types_1.SERIES_LAYOUT_BY_COLUMN] = {
      pure: true,
      appendData: appendDataSimply
    }, _a[types_1.SOURCE_FORMAT_ARRAY_ROWS + '_' + types_1.SERIES_LAYOUT_BY_ROW] = {
      pure: true,
      appendData: function () {
        throw new Error('Do not support appendData when set seriesLayoutBy: "row".');
      }
    }, _a[types_1.SOURCE_FORMAT_OBJECT_ROWS] = {
      pure: true,
      appendData: appendDataSimply
    }, _a[types_1.SOURCE_FORMAT_KEYED_COLUMNS] = {
      pure: true,
      appendData: function (newData) {
        var data = this._data;
        util_1.each(newData, function (newCol, key) {
          var oldCol = data[key] || (data[key] = []);

          for (var i = 0; i < (newCol || []).length; i++) {
            oldCol.push(newCol[i]);
          }
        });
      }
    }, _a[types_1.SOURCE_FORMAT_ORIGINAL] = {
      appendData: appendDataSimply
    }, _a[types_1.SOURCE_FORMAT_TYPED_ARRAY] = {
      persistent: false,
      pure: true,
      appendData: function (newData) {
        if (process.env.NODE_ENV !== 'production') {
          util_1.assert(util_1.isTypedArray(newData), 'Added data must be TypedArray if data in initialization is TypedArray');
        }

        this._data = newData;
      },
      clean: function () {
        this._offset += this.count();
        this._data = null;
      }
    }, _a);

    function appendDataSimply(newData) {
      for (var i = 0; i < newData.length; i++) {
        this._data.push(newData[i]);
      }
    }
  }();

  return DefaultDataProvider;
}();

exports.DefaultDataProvider = DefaultDataProvider;

var getItemSimply = function (rawData, startIndex, dimsDef, idx) {
  return rawData[idx];
};

var rawSourceItemGetterMap = (_a = {}, _a[types_1.SOURCE_FORMAT_ARRAY_ROWS + '_' + types_1.SERIES_LAYOUT_BY_COLUMN] = function (rawData, startIndex, dimsDef, idx) {
  return rawData[idx + startIndex];
}, _a[types_1.SOURCE_FORMAT_ARRAY_ROWS + '_' + types_1.SERIES_LAYOUT_BY_ROW] = function (rawData, startIndex, dimsDef, idx) {
  idx += startIndex;
  var item = [];
  var data = rawData;

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    item.push(row ? row[idx] : null);
  }

  return item;
}, _a[types_1.SOURCE_FORMAT_OBJECT_ROWS] = getItemSimply, _a[types_1.SOURCE_FORMAT_KEYED_COLUMNS] = function (rawData, startIndex, dimsDef, idx) {
  var item = [];

  for (var i = 0; i < dimsDef.length; i++) {
    var dimName = dimsDef[i].name;

    if (process.env.NODE_ENV !== 'production') {
      if (dimName == null) {
        throw new Error();
      }
    }

    var col = rawData[dimName];
    item.push(col ? col[idx] : null);
  }

  return item;
}, _a[types_1.SOURCE_FORMAT_ORIGINAL] = getItemSimply, _a);

function getRawSourceItemGetter(sourceFormat, seriesLayoutBy) {
  var method = rawSourceItemGetterMap[getMethodMapKey(sourceFormat, seriesLayoutBy)];

  if (process.env.NODE_ENV !== 'production') {
    util_1.assert(method, 'Do not suppport get item on "' + sourceFormat + '", "' + seriesLayoutBy + '".');
  }

  return method;
}

exports.getRawSourceItemGetter = getRawSourceItemGetter;

var countSimply = function (rawData, startIndex, dimsDef) {
  return rawData.length;
};

var rawSourceDataCounterMap = (_b = {}, _b[types_1.SOURCE_FORMAT_ARRAY_ROWS + '_' + types_1.SERIES_LAYOUT_BY_COLUMN] = function (rawData, startIndex, dimsDef) {
  return Math.max(0, rawData.length - startIndex);
}, _b[types_1.SOURCE_FORMAT_ARRAY_ROWS + '_' + types_1.SERIES_LAYOUT_BY_ROW] = function (rawData, startIndex, dimsDef) {
  var row = rawData[0];
  return row ? Math.max(0, row.length - startIndex) : 0;
}, _b[types_1.SOURCE_FORMAT_OBJECT_ROWS] = countSimply, _b[types_1.SOURCE_FORMAT_KEYED_COLUMNS] = function (rawData, startIndex, dimsDef) {
  var dimName = dimsDef[0].name;

  if (process.env.NODE_ENV !== 'production') {
    if (dimName == null) {
      throw new Error();
    }
  }

  var col = rawData[dimName];
  return col ? col.length : 0;
}, _b[types_1.SOURCE_FORMAT_ORIGINAL] = countSimply, _b);

function getRawSourceDataCounter(sourceFormat, seriesLayoutBy) {
  var method = rawSourceDataCounterMap[getMethodMapKey(sourceFormat, seriesLayoutBy)];

  if (process.env.NODE_ENV !== 'production') {
    util_1.assert(method, 'Do not suppport count on "' + sourceFormat + '", "' + seriesLayoutBy + '".');
  }

  return method;
}

exports.getRawSourceDataCounter = getRawSourceDataCounter;

var getRawValueSimply = function (dataItem, dimIndex, dimName) {
  return dimIndex != null ? dataItem[dimIndex] : dataItem;
};

var rawSourceValueGetterMap = (_c = {}, _c[types_1.SOURCE_FORMAT_ARRAY_ROWS] = getRawValueSimply, _c[types_1.SOURCE_FORMAT_OBJECT_ROWS] = function (dataItem, dimIndex, dimName) {
  return dimIndex != null ? dataItem[dimName] : dataItem;
}, _c[types_1.SOURCE_FORMAT_KEYED_COLUMNS] = getRawValueSimply, _c[types_1.SOURCE_FORMAT_ORIGINAL] = function (dataItem, dimIndex, dimName) {
  var value = model_1.getDataItemValue(dataItem);
  return dimIndex == null || !(value instanceof Array) ? value : value[dimIndex];
}, _c[types_1.SOURCE_FORMAT_TYPED_ARRAY] = getRawValueSimply, _c);

function getRawSourceValueGetter(sourceFormat) {
  var method = rawSourceValueGetterMap[sourceFormat];

  if (process.env.NODE_ENV !== 'production') {
    util_1.assert(method, 'Do not suppport get value on "' + sourceFormat + '".');
  }

  return method;
}

exports.getRawSourceValueGetter = getRawSourceValueGetter;

function getMethodMapKey(sourceFormat, seriesLayoutBy) {
  return sourceFormat === types_1.SOURCE_FORMAT_ARRAY_ROWS ? sourceFormat + '_' + seriesLayoutBy : sourceFormat;
}

function retrieveRawValue(data, dataIndex, dim) {
  if (!data) {
    return;
  }

  var dataItem = data.getRawDataItem(dataIndex);

  if (dataItem == null) {
    return;
  }

  var sourceFormat = data.getProvider().getSource().sourceFormat;
  var dimName;
  var dimIndex;
  var dimInfo = data.getDimensionInfo(dim);

  if (dimInfo) {
    dimName = dimInfo.name;
    dimIndex = dimInfo.index;
  }

  return getRawSourceValueGetter(sourceFormat)(dataItem, dimIndex, dimName);
}

exports.retrieveRawValue = retrieveRawValue;

function retrieveRawAttr(data, dataIndex, attr) {
  if (!data) {
    return;
  }

  var sourceFormat = data.getProvider().getSource().sourceFormat;

  if (sourceFormat !== types_1.SOURCE_FORMAT_ORIGINAL && sourceFormat !== types_1.SOURCE_FORMAT_OBJECT_ROWS) {
    return;
  }

  var dataItem = data.getRawDataItem(dataIndex);

  if (sourceFormat === types_1.SOURCE_FORMAT_ORIGINAL && !util_1.isObject(dataItem)) {
    dataItem = null;
  }

  if (dataItem) {
    return dataItem[attr];
  }
}

exports.retrieveRawAttr = retrieveRawAttr;