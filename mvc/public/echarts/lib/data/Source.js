
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

var types_1 = require("../util/types");

var model_1 = require("../util/model");

;

var SourceImpl = function () {
  function SourceImpl(fields) {
    this.data = fields.data || (fields.sourceFormat === types_1.SOURCE_FORMAT_KEYED_COLUMNS ? {} : []);
    this.sourceFormat = fields.sourceFormat || types_1.SOURCE_FORMAT_UNKNOWN;
    this.seriesLayoutBy = fields.seriesLayoutBy || types_1.SERIES_LAYOUT_BY_COLUMN;
    this.startIndex = fields.startIndex || 0;
    this.dimensionsDefine = fields.dimensionsDefine;
    this.dimensionsDetectedCount = fields.dimensionsDetectedCount;
    this.encodeDefine = fields.encodeDefine;
    this.metaRawOption = fields.metaRawOption;
  }

  return SourceImpl;
}();

function isSourceInstance(val) {
  return val instanceof SourceImpl;
}

exports.isSourceInstance = isSourceInstance;

function createSource(sourceData, thisMetaRawOption, sourceFormat, encodeDefine) {
  sourceFormat = sourceFormat || detectSourceFormat(sourceData);
  var seriesLayoutBy = thisMetaRawOption.seriesLayoutBy;
  var determined = determineSourceDimensions(sourceData, sourceFormat, seriesLayoutBy, thisMetaRawOption.sourceHeader, thisMetaRawOption.dimensions);
  var source = new SourceImpl({
    data: sourceData,
    sourceFormat: sourceFormat,
    seriesLayoutBy: seriesLayoutBy,
    dimensionsDefine: determined.dimensionsDefine,
    startIndex: determined.startIndex,
    dimensionsDetectedCount: determined.dimensionsDetectedCount,
    encodeDefine: makeEncodeDefine(encodeDefine),
    metaRawOption: util_1.clone(thisMetaRawOption)
  });
  return source;
}

exports.createSource = createSource;

function createSourceFromSeriesDataOption(data) {
  return new SourceImpl({
    data: data,
    sourceFormat: util_1.isTypedArray(data) ? types_1.SOURCE_FORMAT_TYPED_ARRAY : types_1.SOURCE_FORMAT_ORIGINAL
  });
}

exports.createSourceFromSeriesDataOption = createSourceFromSeriesDataOption;

function cloneSourceShallow(source) {
  return new SourceImpl({
    data: source.data,
    sourceFormat: source.sourceFormat,
    seriesLayoutBy: source.seriesLayoutBy,
    dimensionsDefine: util_1.clone(source.dimensionsDefine),
    startIndex: source.startIndex,
    dimensionsDetectedCount: source.dimensionsDetectedCount,
    encodeDefine: makeEncodeDefine(source.encodeDefine)
  });
}

exports.cloneSourceShallow = cloneSourceShallow;

function makeEncodeDefine(encodeDefine) {
  return encodeDefine ? util_1.createHashMap(encodeDefine) : null;
}

function detectSourceFormat(data) {
  var sourceFormat = types_1.SOURCE_FORMAT_UNKNOWN;

  if (util_1.isTypedArray(data)) {
    sourceFormat = types_1.SOURCE_FORMAT_TYPED_ARRAY;
  } else if (util_1.isArray(data)) {
    if (data.length === 0) {
      sourceFormat = types_1.SOURCE_FORMAT_ARRAY_ROWS;
    }

    for (var i = 0, len = data.length; i < len; i++) {
      var item = data[i];

      if (item == null) {
        continue;
      } else if (util_1.isArray(item)) {
        sourceFormat = types_1.SOURCE_FORMAT_ARRAY_ROWS;
        break;
      } else if (util_1.isObject(item)) {
        sourceFormat = types_1.SOURCE_FORMAT_OBJECT_ROWS;
        break;
      }
    }
  } else if (util_1.isObject(data)) {
    for (var key in data) {
      if (util_1.hasOwn(data, key) && util_1.isArrayLike(data[key])) {
        sourceFormat = types_1.SOURCE_FORMAT_KEYED_COLUMNS;
        break;
      }
    }
  } else if (data != null) {
    throw new Error('Invalid data');
  }

  return sourceFormat;
}

function determineSourceDimensions(data, sourceFormat, seriesLayoutBy, sourceHeader, dimensionsDefine) {
  var dimensionsDetectedCount;
  var startIndex;

  if (!data) {
    return {
      dimensionsDefine: normalizeDimensionsOption(dimensionsDefine),
      startIndex: startIndex,
      dimensionsDetectedCount: dimensionsDetectedCount
    };
  }

  if (sourceFormat === types_1.SOURCE_FORMAT_ARRAY_ROWS) {
    var dataArrayRows = data;

    if (sourceHeader === 'auto' || sourceHeader == null) {
      arrayRowsTravelFirst(function (val) {
        if (val != null && val !== '-') {
          if (util_1.isString(val)) {
            startIndex == null && (startIndex = 1);
          } else {
            startIndex = 0;
          }
        }
      }, seriesLayoutBy, dataArrayRows, 10);
    } else {
      startIndex = util_1.isNumber(sourceHeader) ? sourceHeader : sourceHeader ? 1 : 0;
    }

    if (!dimensionsDefine && startIndex === 1) {
      dimensionsDefine = [];
      arrayRowsTravelFirst(function (val, index) {
        dimensionsDefine[index] = val != null ? val + '' : '';
      }, seriesLayoutBy, dataArrayRows, Infinity);
    }

    dimensionsDetectedCount = dimensionsDefine ? dimensionsDefine.length : seriesLayoutBy === types_1.SERIES_LAYOUT_BY_ROW ? dataArrayRows.length : dataArrayRows[0] ? dataArrayRows[0].length : null;
  } else if (sourceFormat === types_1.SOURCE_FORMAT_OBJECT_ROWS) {
    if (!dimensionsDefine) {
      dimensionsDefine = objectRowsCollectDimensions(data);
    }
  } else if (sourceFormat === types_1.SOURCE_FORMAT_KEYED_COLUMNS) {
    if (!dimensionsDefine) {
      dimensionsDefine = [];
      util_1.each(data, function (colArr, key) {
        dimensionsDefine.push(key);
      });
    }
  } else if (sourceFormat === types_1.SOURCE_FORMAT_ORIGINAL) {
    var value0 = model_1.getDataItemValue(data[0]);
    dimensionsDetectedCount = util_1.isArray(value0) && value0.length || 1;
  } else if (sourceFormat === types_1.SOURCE_FORMAT_TYPED_ARRAY) {
    if (process.env.NODE_ENV !== 'production') {
      util_1.assert(!!dimensionsDefine, 'dimensions must be given if data is TypedArray.');
    }
  }

  return {
    startIndex: startIndex,
    dimensionsDefine: normalizeDimensionsOption(dimensionsDefine),
    dimensionsDetectedCount: dimensionsDetectedCount
  };
}

function objectRowsCollectDimensions(data) {
  var firstIndex = 0;
  var obj;

  while (firstIndex < data.length && !(obj = data[firstIndex++])) {}

  if (obj) {
    var dimensions_1 = [];
    util_1.each(obj, function (value, key) {
      dimensions_1.push(key);
    });
    return dimensions_1;
  }
}

function normalizeDimensionsOption(dimensionsDefine) {
  if (!dimensionsDefine) {
    return;
  }

  var nameMap = util_1.createHashMap();
  return util_1.map(dimensionsDefine, function (rawItem, index) {
    rawItem = util_1.isObject(rawItem) ? rawItem : {
      name: rawItem
    };
    var item = {
      name: rawItem.name,
      displayName: rawItem.displayName,
      type: rawItem.type
    };

    if (name == null) {
      return item;
    }

    item.name += '';

    if (item.displayName == null) {
      item.displayName = item.name;
    }

    var exist = nameMap.get(item.name);

    if (!exist) {
      nameMap.set(item.name, {
        count: 1
      });
    } else {
      item.name += '-' + exist.count++;
    }

    return item;
  });
}

function arrayRowsTravelFirst(cb, seriesLayoutBy, data, maxLoop) {
  if (seriesLayoutBy === types_1.SERIES_LAYOUT_BY_ROW) {
    for (var i = 0; i < data.length && i < maxLoop; i++) {
      cb(data[i] ? data[i][0] : null, i);
    }
  } else {
    var value0 = data[0] || [];

    for (var i = 0; i < value0.length && i < maxLoop; i++) {
      cb(value0[i], i);
    }
  }
}