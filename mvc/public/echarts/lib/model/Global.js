
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

var util_1 = require("zrender/lib/core/util");

var modelUtil = require("../util/model");

var Model_1 = require("./Model");

var Component_1 = require("./Component");

var globalDefault_1 = require("./globalDefault");

var sourceHelper_1 = require("../data/helper/sourceHelper");

var internalComponentCreator_1 = require("./internalComponentCreator");

var palette_1 = require("./mixin/palette");

var reCreateSeriesIndices;
var assertSeriesInitialized;
var initBase;
var OPTION_INNER_KEY = '\0_ec_inner';

var GlobalModel = function (_super) {
  tslib_1.__extends(GlobalModel, _super);

  function GlobalModel() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  GlobalModel.prototype.init = function (option, parentModel, ecModel, theme, locale, optionManager) {
    theme = theme || {};
    this.option = null;
    this._theme = new Model_1["default"](theme);
    this._locale = new Model_1["default"](locale);
    this._optionManager = optionManager;
  };

  GlobalModel.prototype.setOption = function (option, opts, optionPreprocessorFuncs) {
    util_1.assert(!(OPTION_INNER_KEY in option), 'please use chart.getOption()');
    var innerOpt = normalizeSetOptionInput(opts);

    this._optionManager.setOption(option, optionPreprocessorFuncs, innerOpt);

    this._resetOption(null, innerOpt);
  };

  GlobalModel.prototype.resetOption = function (type, opt) {
    return this._resetOption(type, normalizeSetOptionInput(opt));
  };

  GlobalModel.prototype._resetOption = function (type, opt) {
    var optionChanged = false;
    var optionManager = this._optionManager;

    if (!type || type === 'recreate') {
      var baseOption = optionManager.mountOption(type === 'recreate');

      if (!this.option || type === 'recreate') {
        initBase(this, baseOption);
      } else {
        this.restoreData();

        this._mergeOption(baseOption, opt);
      }

      optionChanged = true;
    }

    if (type === 'timeline' || type === 'media') {
      this.restoreData();
    }

    if (!type || type === 'recreate' || type === 'timeline') {
      var timelineOption = optionManager.getTimelineOption(this);

      if (timelineOption) {
        optionChanged = true;

        this._mergeOption(timelineOption, opt);
      }
    }

    if (!type || type === 'recreate' || type === 'media') {
      var mediaOptions = optionManager.getMediaOption(this);

      if (mediaOptions.length) {
        util_1.each(mediaOptions, function (mediaOption) {
          optionChanged = true;

          this._mergeOption(mediaOption, opt);
        }, this);
      }
    }

    return optionChanged;
  };

  GlobalModel.prototype.mergeOption = function (option) {
    this._mergeOption(option, null);
  };

  GlobalModel.prototype._mergeOption = function (newOption, opt) {
    var option = this.option;
    var componentsMap = this._componentsMap;
    var componentsCount = this._componentsCount;
    var newCmptTypes = [];
    var newCmptTypeMap = util_1.createHashMap();
    var replaceMergeMainTypeMap = opt && opt.replaceMergeMainTypeMap;
    sourceHelper_1.resetSourceDefaulter(this);
    util_1.each(newOption, function (componentOption, mainType) {
      if (componentOption == null) {
        return;
      }

      if (!Component_1["default"].hasClass(mainType)) {
        option[mainType] = option[mainType] == null ? util_1.clone(componentOption) : util_1.merge(option[mainType], componentOption, true);
      } else if (mainType) {
        newCmptTypes.push(mainType);
        newCmptTypeMap.set(mainType, true);
      }
    });

    if (replaceMergeMainTypeMap) {
      replaceMergeMainTypeMap.each(function (val, mainTypeInReplaceMerge) {
        if (Component_1["default"].hasClass(mainTypeInReplaceMerge) && !newCmptTypeMap.get(mainTypeInReplaceMerge)) {
          newCmptTypes.push(mainTypeInReplaceMerge);
          newCmptTypeMap.set(mainTypeInReplaceMerge, true);
        }
      });
    }

    Component_1["default"].topologicalTravel(newCmptTypes, Component_1["default"].getAllClassMainTypes(), visitComponent, this);

    function visitComponent(mainType) {
      var newCmptOptionList = internalComponentCreator_1.concatInternalOptions(this, mainType, modelUtil.normalizeToArray(newOption[mainType]));
      var oldCmptList = componentsMap.get(mainType);
      var mergeMode = !oldCmptList ? 'replaceAll' : replaceMergeMainTypeMap && replaceMergeMainTypeMap.get(mainType) ? 'replaceMerge' : 'normalMerge';
      var mappingResult = modelUtil.mappingToExists(oldCmptList, newCmptOptionList, mergeMode);
      modelUtil.setComponentTypeToKeyInfo(mappingResult, mainType, Component_1["default"]);
      option[mainType] = null;
      componentsMap.set(mainType, null);
      componentsCount.set(mainType, 0);
      var optionsByMainType = [];
      var cmptsByMainType = [];
      var cmptsCountByMainType = 0;
      util_1.each(mappingResult, function (resultItem, index) {
        var componentModel = resultItem.existing;
        var newCmptOption = resultItem.newOption;

        if (!newCmptOption) {
          if (componentModel) {
            componentModel.mergeOption({}, this);
            componentModel.optionUpdated({}, false);
          }
        } else {
          var ComponentModelClass = Component_1["default"].getClass(mainType, resultItem.keyInfo.subType, true);

          if (componentModel && componentModel.constructor === ComponentModelClass) {
            componentModel.name = resultItem.keyInfo.name;
            componentModel.mergeOption(newCmptOption, this);
            componentModel.optionUpdated(newCmptOption, false);
          } else {
            var extraOpt = util_1.extend({
              componentIndex: index
            }, resultItem.keyInfo);
            componentModel = new ComponentModelClass(newCmptOption, this, this, extraOpt);
            util_1.extend(componentModel, extraOpt);

            if (resultItem.brandNew) {
              componentModel.__requireNewView = true;
            }

            componentModel.init(newCmptOption, this, this);
            componentModel.optionUpdated(null, true);
          }
        }

        if (componentModel) {
          optionsByMainType.push(componentModel.option);
          cmptsByMainType.push(componentModel);
          cmptsCountByMainType++;
        } else {
          optionsByMainType.push(void 0);
          cmptsByMainType.push(void 0);
        }
      }, this);
      option[mainType] = optionsByMainType;
      componentsMap.set(mainType, cmptsByMainType);
      componentsCount.set(mainType, cmptsCountByMainType);

      if (mainType === 'series') {
        reCreateSeriesIndices(this);
      }
    }

    if (!this._seriesIndices) {
      reCreateSeriesIndices(this);
    }
  };

  GlobalModel.prototype.getOption = function () {
    var option = util_1.clone(this.option);
    util_1.each(option, function (optInMainType, mainType) {
      if (Component_1["default"].hasClass(mainType)) {
        var opts = modelUtil.normalizeToArray(optInMainType);
        var realLen = opts.length;
        var metNonInner = false;

        for (var i = realLen - 1; i >= 0; i--) {
          if (opts[i] && !modelUtil.isComponentIdInternal(opts[i])) {
            metNonInner = true;
          } else {
            opts[i] = null;
            !metNonInner && realLen--;
          }
        }

        opts.length = realLen;
        option[mainType] = opts;
      }
    });
    delete option[OPTION_INNER_KEY];
    return option;
  };

  GlobalModel.prototype.getTheme = function () {
    return this._theme;
  };

  GlobalModel.prototype.getLocaleModel = function () {
    return this._locale;
  };

  GlobalModel.prototype.getLocale = function (localePosition) {
    var locale = this.getLocaleModel();
    return locale.get(localePosition);
  };

  GlobalModel.prototype.setUpdatePayload = function (payload) {
    this._payload = payload;
  };

  GlobalModel.prototype.getUpdatePayload = function () {
    return this._payload;
  };

  GlobalModel.prototype.getComponent = function (mainType, idx) {
    var list = this._componentsMap.get(mainType);

    if (list) {
      var cmpt = list[idx || 0];

      if (cmpt) {
        return cmpt;
      } else if (idx == null) {
        for (var i = 0; i < list.length; i++) {
          if (list[i]) {
            return list[i];
          }
        }
      }
    }
  };

  GlobalModel.prototype.queryComponents = function (condition) {
    var mainType = condition.mainType;

    if (!mainType) {
      return [];
    }

    var index = condition.index;
    var id = condition.id;
    var name = condition.name;

    var cmpts = this._componentsMap.get(mainType);

    if (!cmpts || !cmpts.length) {
      return [];
    }

    var result;

    if (index != null) {
      result = [];
      util_1.each(modelUtil.normalizeToArray(index), function (idx) {
        cmpts[idx] && result.push(cmpts[idx]);
      });
    } else if (id != null) {
      result = queryByIdOrName('id', id, cmpts);
    } else if (name != null) {
      result = queryByIdOrName('name', name, cmpts);
    } else {
      result = util_1.filter(cmpts, function (cmpt) {
        return !!cmpt;
      });
    }

    return filterBySubType(result, condition);
  };

  GlobalModel.prototype.findComponents = function (condition) {
    var query = condition.query;
    var mainType = condition.mainType;
    var queryCond = getQueryCond(query);
    var result = queryCond ? this.queryComponents(queryCond) : util_1.filter(this._componentsMap.get(mainType), function (cmpt) {
      return !!cmpt;
    });
    return doFilter(filterBySubType(result, condition));

    function getQueryCond(q) {
      var indexAttr = mainType + 'Index';
      var idAttr = mainType + 'Id';
      var nameAttr = mainType + 'Name';
      return q && (q[indexAttr] != null || q[idAttr] != null || q[nameAttr] != null) ? {
        mainType: mainType,
        index: q[indexAttr],
        id: q[idAttr],
        name: q[nameAttr]
      } : null;
    }

    function doFilter(res) {
      return condition.filter ? util_1.filter(res, condition.filter) : res;
    }
  };

  GlobalModel.prototype.eachComponent = function (mainType, cb, context) {
    var componentsMap = this._componentsMap;

    if (util_1.isFunction(mainType)) {
      var ctxForAll_1 = cb;
      var cbForAll_1 = mainType;
      componentsMap.each(function (cmpts, componentType) {
        for (var i = 0; cmpts && i < cmpts.length; i++) {
          var cmpt = cmpts[i];
          cmpt && cbForAll_1.call(ctxForAll_1, componentType, cmpt, cmpt.componentIndex);
        }
      });
    } else {
      var cmpts = util_1.isString(mainType) ? componentsMap.get(mainType) : util_1.isObject(mainType) ? this.findComponents(mainType) : null;

      for (var i = 0; cmpts && i < cmpts.length; i++) {
        var cmpt = cmpts[i];
        cmpt && cb.call(context, cmpt, cmpt.componentIndex);
      }
    }
  };

  GlobalModel.prototype.getSeriesByName = function (name) {
    var nameStr = modelUtil.convertOptionIdName(name, null);
    return util_1.filter(this._componentsMap.get('series'), function (oneSeries) {
      return !!oneSeries && nameStr != null && oneSeries.name === nameStr;
    });
  };

  GlobalModel.prototype.getSeriesByIndex = function (seriesIndex) {
    return this._componentsMap.get('series')[seriesIndex];
  };

  GlobalModel.prototype.getSeriesByType = function (subType) {
    return util_1.filter(this._componentsMap.get('series'), function (oneSeries) {
      return !!oneSeries && oneSeries.subType === subType;
    });
  };

  GlobalModel.prototype.getSeries = function () {
    return util_1.filter(this._componentsMap.get('series').slice(), function (oneSeries) {
      return !!oneSeries;
    });
  };

  GlobalModel.prototype.getSeriesCount = function () {
    return this._componentsCount.get('series');
  };

  GlobalModel.prototype.eachSeries = function (cb, context) {
    assertSeriesInitialized(this);
    util_1.each(this._seriesIndices, function (rawSeriesIndex) {
      var series = this._componentsMap.get('series')[rawSeriesIndex];

      cb.call(context, series, rawSeriesIndex);
    }, this);
  };

  GlobalModel.prototype.eachRawSeries = function (cb, context) {
    util_1.each(this._componentsMap.get('series'), function (series) {
      series && cb.call(context, series, series.componentIndex);
    });
  };

  GlobalModel.prototype.eachSeriesByType = function (subType, cb, context) {
    assertSeriesInitialized(this);
    util_1.each(this._seriesIndices, function (rawSeriesIndex) {
      var series = this._componentsMap.get('series')[rawSeriesIndex];

      if (series.subType === subType) {
        cb.call(context, series, rawSeriesIndex);
      }
    }, this);
  };

  GlobalModel.prototype.eachRawSeriesByType = function (subType, cb, context) {
    return util_1.each(this.getSeriesByType(subType), cb, context);
  };

  GlobalModel.prototype.isSeriesFiltered = function (seriesModel) {
    assertSeriesInitialized(this);
    return this._seriesIndicesMap.get(seriesModel.componentIndex) == null;
  };

  GlobalModel.prototype.getCurrentSeriesIndices = function () {
    return (this._seriesIndices || []).slice();
  };

  GlobalModel.prototype.filterSeries = function (cb, context) {
    assertSeriesInitialized(this);
    var newSeriesIndices = [];
    util_1.each(this._seriesIndices, function (seriesRawIdx) {
      var series = this._componentsMap.get('series')[seriesRawIdx];

      cb.call(context, series, seriesRawIdx) && newSeriesIndices.push(seriesRawIdx);
    }, this);
    this._seriesIndices = newSeriesIndices;
    this._seriesIndicesMap = util_1.createHashMap(newSeriesIndices);
  };

  GlobalModel.prototype.restoreData = function (payload) {
    reCreateSeriesIndices(this);
    var componentsMap = this._componentsMap;
    var componentTypes = [];
    componentsMap.each(function (components, componentType) {
      if (Component_1["default"].hasClass(componentType)) {
        componentTypes.push(componentType);
      }
    });
    Component_1["default"].topologicalTravel(componentTypes, Component_1["default"].getAllClassMainTypes(), function (componentType) {
      util_1.each(componentsMap.get(componentType), function (component) {
        if (component && (componentType !== 'series' || !isNotTargetSeries(component, payload))) {
          component.restoreData();
        }
      });
    });
  };

  GlobalModel.internalField = function () {
    reCreateSeriesIndices = function (ecModel) {
      var seriesIndices = ecModel._seriesIndices = [];
      util_1.each(ecModel._componentsMap.get('series'), function (series) {
        series && seriesIndices.push(series.componentIndex);
      });
      ecModel._seriesIndicesMap = util_1.createHashMap(seriesIndices);
    };

    assertSeriesInitialized = function (ecModel) {
      if (process.env.NODE_ENV !== 'production') {
        if (!ecModel._seriesIndices) {
          throw new Error('Option should contains series.');
        }
      }
    };

    initBase = function (ecModel, baseOption) {
      ecModel.option = {};
      ecModel.option[OPTION_INNER_KEY] = 1;
      ecModel._componentsMap = util_1.createHashMap({
        series: []
      });
      ecModel._componentsCount = util_1.createHashMap();
      var airaOption = baseOption.aria;

      if (util_1.isObject(airaOption) && airaOption.enabled == null) {
        airaOption.enabled = true;
      }

      mergeTheme(baseOption, ecModel._theme.option);
      util_1.merge(baseOption, globalDefault_1["default"], false);

      ecModel._mergeOption(baseOption, null);
    };
  }();

  return GlobalModel;
}(Model_1["default"]);

function isNotTargetSeries(seriesModel, payload) {
  if (payload) {
    var index = payload.seriesIndex;
    var id = payload.seriesId;
    var name_1 = payload.seriesName;
    return index != null && seriesModel.componentIndex !== index || id != null && seriesModel.id !== id || name_1 != null && seriesModel.name !== name_1;
  }
}

function mergeTheme(option, theme) {
  var notMergeColorLayer = option.color && !option.colorLayer;
  util_1.each(theme, function (themeItem, name) {
    if (name === 'colorLayer' && notMergeColorLayer) {
      return;
    }

    if (!Component_1["default"].hasClass(name)) {
      if (typeof themeItem === 'object') {
        option[name] = !option[name] ? util_1.clone(themeItem) : util_1.merge(option[name], themeItem, false);
      } else {
        if (option[name] == null) {
          option[name] = themeItem;
        }
      }
    }
  });
}

function queryByIdOrName(attr, idOrName, cmpts) {
  if (util_1.isArray(idOrName)) {
    var keyMap_1 = util_1.createHashMap();
    util_1.each(idOrName, function (idOrNameItem) {
      if (idOrNameItem != null) {
        var idName = modelUtil.convertOptionIdName(idOrNameItem, null);
        idName != null && keyMap_1.set(idOrNameItem, true);
      }
    });
    return util_1.filter(cmpts, function (cmpt) {
      return cmpt && keyMap_1.get(cmpt[attr]);
    });
  } else {
    var idName_1 = modelUtil.convertOptionIdName(idOrName, null);
    return util_1.filter(cmpts, function (cmpt) {
      return cmpt && idName_1 != null && cmpt[attr] === idName_1;
    });
  }
}

function filterBySubType(components, condition) {
  return condition.hasOwnProperty('subType') ? util_1.filter(components, function (cmpt) {
    return cmpt && cmpt.subType === condition.subType;
  }) : components;
}

function normalizeSetOptionInput(opts) {
  var replaceMergeMainTypeMap = util_1.createHashMap();
  opts && util_1.each(modelUtil.normalizeToArray(opts.replaceMerge), function (mainType) {
    if (process.env.NODE_ENV !== 'production') {
      util_1.assert(Component_1["default"].hasClass(mainType), '"' + mainType + '" is not valid component main type in "replaceMerge"');
    }

    replaceMergeMainTypeMap.set(mainType, true);
  });
  return {
    replaceMergeMainTypeMap: replaceMergeMainTypeMap
  };
}

util_1.mixin(GlobalModel, palette_1.PaletteMixin);
exports["default"] = GlobalModel;