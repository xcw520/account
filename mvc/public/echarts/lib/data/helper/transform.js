
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

var types_1 = require("../../util/types");

var model_1 = require("../../util/model");

var util_1 = require("zrender/lib/core/util");

var dataProvider_1 = require("./dataProvider");

var dataValueHelper_1 = require("./dataValueHelper");

var sourceHelper_1 = require("./sourceHelper");

var log_1 = require("../../util/log");

var Source_1 = require("../Source");

var ExternalSource = function () {
  function ExternalSource() {}

  ExternalSource.prototype.getRawData = function () {
    throw new Error('not supported');
  };

  ExternalSource.prototype.getRawDataItem = function (dataIndex) {
    throw new Error('not supported');
  };

  ExternalSource.prototype.cloneRawData = function () {
    return;
  };

  ExternalSource.prototype.getDimensionInfo = function (dim) {
    return;
  };

  ExternalSource.prototype.cloneAllDimensionInfo = function () {
    return;
  };

  ExternalSource.prototype.count = function () {
    return;
  };

  ExternalSource.prototype.retrieveValue = function (dataIndex, dimIndex) {
    return;
  };

  ExternalSource.prototype.retrieveValueFromItem = function (dataItem, dimIndex) {
    return;
  };

  ExternalSource.prototype.convertValue = function (rawVal, dimInfo) {
    return dataValueHelper_1.parseDataValue(rawVal, dimInfo);
  };

  return ExternalSource;
}();

exports.ExternalSource = ExternalSource;

function createExternalSource(internalSource, externalTransform) {
  var extSource = new ExternalSource();
  var data = internalSource.data;
  var sourceFormat = extSource.sourceFormat = internalSource.sourceFormat;
  var sourceHeaderCount = internalSource.startIndex;
  var dimensions = [];
  var dimsByName = {};
  var dimsDef = internalSource.dimensionsDefine;

  if (dimsDef) {
    util_1.each(dimsDef, function (dimDef, idx) {
      var name = dimDef.name;
      var dimDefExt = {
        index: idx,
        name: name,
        displayName: dimDef.displayName
      };
      dimensions.push(dimDefExt);

      if (name != null) {
        var errMsg = '';

        if (util_1.hasOwn(dimsByName, name)) {
          if (process.env.NODE_ENV !== 'production') {
            errMsg = 'dimension name "' + name + '" duplicated.';
          }

          log_1.throwError(errMsg);
        }

        dimsByName[name] = dimDefExt;
      }
    });
  } else {
    for (var i = 0; i < internalSource.dimensionsDetectedCount || 0; i++) {
      dimensions.push({
        index: i
      });
    }
  }

  var rawItemGetter = dataProvider_1.getRawSourceItemGetter(sourceFormat, types_1.SERIES_LAYOUT_BY_COLUMN);

  if (externalTransform.__isBuiltIn) {
    extSource.getRawDataItem = function (dataIndex) {
      return rawItemGetter(data, sourceHeaderCount, dimensions, dataIndex);
    };

    extSource.getRawData = util_1.bind(getRawData, null, internalSource);
  }

  extSource.cloneRawData = util_1.bind(cloneRawData, null, internalSource);
  var rawCounter = dataProvider_1.getRawSourceDataCounter(sourceFormat, types_1.SERIES_LAYOUT_BY_COLUMN);
  extSource.count = util_1.bind(rawCounter, null, data, sourceHeaderCount, dimensions);
  var rawValueGetter = dataProvider_1.getRawSourceValueGetter(sourceFormat);

  extSource.retrieveValue = function (dataIndex, dimIndex) {
    var rawItem = rawItemGetter(data, sourceHeaderCount, dimensions, dataIndex);
    return retrieveValueFromItem(rawItem, dimIndex);
  };

  var retrieveValueFromItem = extSource.retrieveValueFromItem = function (dataItem, dimIndex) {
    if (dataItem == null) {
      return;
    }

    var dimDef = dimensions[dimIndex];

    if (dimDef) {
      return rawValueGetter(dataItem, dimIndex, dimDef.name);
    }
  };

  extSource.getDimensionInfo = util_1.bind(getDimensionInfo, null, dimensions, dimsByName);
  extSource.cloneAllDimensionInfo = util_1.bind(cloneAllDimensionInfo, null, dimensions);
  return extSource;
}

function getRawData(upstream) {
  var sourceFormat = upstream.sourceFormat;
  var data = upstream.data;

  if (sourceFormat === types_1.SOURCE_FORMAT_ARRAY_ROWS || sourceFormat === types_1.SOURCE_FORMAT_OBJECT_ROWS || !data || util_1.isArray(data) && !data.length) {
    return upstream.data;
  }

  var errMsg = '';

  if (process.env.NODE_ENV !== 'production') {
    errMsg = '`getRawData` is not supported in source format ' + sourceFormat;
  }

  log_1.throwError(errMsg);
}

function cloneRawData(upstream) {
  var sourceFormat = upstream.sourceFormat;
  var data = upstream.data;

  if (!data) {
    return data;
  } else if (util_1.isArray(data) && !data.length) {
    return [];
  } else if (sourceFormat === types_1.SOURCE_FORMAT_ARRAY_ROWS) {
    var result = [];

    for (var i = 0, len = data.length; i < len; i++) {
      result.push(data[i].slice());
    }

    return result;
  } else if (sourceFormat === types_1.SOURCE_FORMAT_OBJECT_ROWS) {
    var result = [];

    for (var i = 0, len = data.length; i < len; i++) {
      result.push(util_1.extend({}, data[i]));
    }

    return result;
  }
}

function getDimensionInfo(dimensions, dimsByName, dim) {
  if (dim == null) {
    return;
  }

  if (typeof dim === 'number' || !isNaN(dim) && !util_1.hasOwn(dimsByName, dim)) {
    return dimensions[dim];
  } else if (util_1.hasOwn(dimsByName, dim)) {
    return dimsByName[dim];
  }
}

function cloneAllDimensionInfo(dimensions) {
  return util_1.clone(dimensions);
}

var externalTransformMap = util_1.createHashMap();

function registerExternalTransform(externalTransform) {
  externalTransform = util_1.clone(externalTransform);
  var type = externalTransform.type;
  var errMsg = '';

  if (!type) {
    if (process.env.NODE_ENV !== 'production') {
      errMsg = 'Must have a `type` when `registerTransform`.';
    }

    log_1.throwError(errMsg);
  }

  var typeParsed = type.split(':');

  if (typeParsed.length !== 2) {
    if (process.env.NODE_ENV !== 'production') {
      errMsg = 'Name must include namespace like "ns:regression".';
    }

    log_1.throwError(errMsg);
  }

  var isBuiltIn = false;

  if (typeParsed[0] === 'echarts') {
    type = typeParsed[1];
    isBuiltIn = true;
  }

  externalTransform.__isBuiltIn = isBuiltIn;
  externalTransformMap.set(type, externalTransform);
}

exports.registerExternalTransform = registerExternalTransform;

function applyDataTransform(rawTransOption, sourceList, infoForPrint) {
  var pipedTransOption = model_1.normalizeToArray(rawTransOption);
  var pipeLen = pipedTransOption.length;
  var errMsg = '';

  if (!pipeLen) {
    if (process.env.NODE_ENV !== 'production') {
      errMsg = 'If `transform` declared, it should at least contain one transform.';
    }

    log_1.throwError(errMsg);
  }

  for (var i = 0, len = pipeLen; i < len; i++) {
    var transOption = pipedTransOption[i];
    sourceList = applySingleDataTransform(transOption, sourceList, infoForPrint, pipeLen === 1 ? null : i);

    if (i !== len - 1) {
      sourceList.length = Math.max(sourceList.length, 1);
    }
  }

  return sourceList;
}

exports.applyDataTransform = applyDataTransform;

function applySingleDataTransform(transOption, upSourceList, infoForPrint, pipeIndex) {
  var errMsg = '';

  if (!upSourceList.length) {
    if (process.env.NODE_ENV !== 'production') {
      errMsg = 'Must have at least one upstream dataset.';
    }

    log_1.throwError(errMsg);
  }

  if (!util_1.isObject(transOption)) {
    if (process.env.NODE_ENV !== 'production') {
      errMsg = 'transform declaration must be an object rather than ' + typeof transOption + '.';
    }

    log_1.throwError(errMsg);
  }

  var transType = transOption.type;
  var externalTransform = externalTransformMap.get(transType);

  if (!externalTransform) {
    if (process.env.NODE_ENV !== 'production') {
      errMsg = 'Can not find transform on type "' + transType + '".';
    }

    log_1.throwError(errMsg);
  }

  var extUpSourceList = util_1.map(upSourceList, function (upSource) {
    return createExternalSource(upSource, externalTransform);
  });
  var resultList = model_1.normalizeToArray(externalTransform.transform({
    upstream: extUpSourceList[0],
    upstreamList: extUpSourceList,
    config: util_1.clone(transOption.config)
  }));

  if (process.env.NODE_ENV !== 'production') {
    if (transOption.print) {
      var printStrArr = util_1.map(resultList, function (extSource) {
        var pipeIndexStr = pipeIndex != null ? ' === pipe index: ' + pipeIndex : '';
        return ['=== dataset index: ' + infoForPrint.datasetIndex + pipeIndexStr + ' ===', '- transform result data:', log_1.makePrintable(extSource.data), '- transform result dimensions:', log_1.makePrintable(extSource.dimensions)].join('\n');
      }).join('\n');
      log_1.consoleLog(printStrArr);
    }
  }

  return util_1.map(resultList, function (result) {
    var errMsg = '';

    if (!util_1.isObject(result)) {
      if (process.env.NODE_ENV !== 'production') {
        errMsg = 'A transform should not return some empty results.';
      }

      log_1.throwError(errMsg);
    }

    var resultData = result.data;

    if (resultData != null) {
      if (!util_1.isObject(resultData) && !util_1.isArrayLike(resultData)) {
        if (process.env.NODE_ENV !== 'production') {
          errMsg = 'Result data should be object or array in data transform.';
        }

        log_1.throwError(errMsg);
      }
    } else {
      resultData = upSourceList[0].data;
    }

    var resultMetaRawOption = sourceHelper_1.inheritSourceMetaRawOption(upSourceList[0], {
      seriesLayoutBy: types_1.SERIES_LAYOUT_BY_COLUMN,
      sourceHeader: 0,
      dimensions: result.dimensions
    });
    return Source_1.createSource(resultData, resultMetaRawOption, null, null);
  });
}