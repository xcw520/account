
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

var zrUtil = require("zrender/lib/core/util");

var Model_1 = require("./Model");

var componentUtil = require("../util/component");

var clazz_1 = require("../util/clazz");

var model_1 = require("../util/model");

var layout = require("../util/layout");

var inner = model_1.makeInner();

var ComponentModel = function (_super) {
  tslib_1.__extends(ComponentModel, _super);

  function ComponentModel(option, parentModel, ecModel) {
    var _this = _super.call(this, option, parentModel, ecModel) || this;

    _this.uid = componentUtil.getUID('ec_cpt_model');
    return _this;
  }

  ComponentModel.prototype.init = function (option, parentModel, ecModel) {
    this.mergeDefaultAndTheme(option, ecModel);
  };

  ComponentModel.prototype.mergeDefaultAndTheme = function (option, ecModel) {
    var layoutMode = layout.fetchLayoutMode(this);
    var inputPositionParams = layoutMode ? layout.getLayoutParams(option) : {};
    var themeModel = ecModel.getTheme();
    zrUtil.merge(option, themeModel.get(this.mainType));
    zrUtil.merge(option, this.getDefaultOption());

    if (layoutMode) {
      layout.mergeLayoutParam(option, inputPositionParams, layoutMode);
    }
  };

  ComponentModel.prototype.mergeOption = function (option, ecModel) {
    zrUtil.merge(this.option, option, true);
    var layoutMode = layout.fetchLayoutMode(this);

    if (layoutMode) {
      layout.mergeLayoutParam(this.option, option, layoutMode);
    }
  };

  ComponentModel.prototype.optionUpdated = function (newCptOption, isInit) {};

  ComponentModel.prototype.getDefaultOption = function () {
    var ctor = this.constructor;

    if (!clazz_1.isExtendedClass(ctor)) {
      return ctor.defaultOption;
    }

    var fields = inner(this);

    if (!fields.defaultOption) {
      var optList = [];
      var clz = ctor;

      while (clz) {
        var opt = clz.prototype.defaultOption;
        opt && optList.push(opt);
        clz = clz.superClass;
      }

      var defaultOption = {};

      for (var i = optList.length - 1; i >= 0; i--) {
        defaultOption = zrUtil.merge(defaultOption, optList[i], true);
      }

      fields.defaultOption = defaultOption;
    }

    return fields.defaultOption;
  };

  ComponentModel.prototype.getReferringComponents = function (mainType, opt) {
    var indexKey = mainType + 'Index';
    var idKey = mainType + 'Id';
    return model_1.queryReferringComponents(this.ecModel, mainType, {
      index: this.get(indexKey, true),
      id: this.get(idKey, true)
    }, opt);
  };

  ComponentModel.prototype.getBoxLayoutParams = function () {
    var boxLayoutModel = this;
    return {
      left: boxLayoutModel.get('left'),
      top: boxLayoutModel.get('top'),
      right: boxLayoutModel.get('right'),
      bottom: boxLayoutModel.get('bottom'),
      width: boxLayoutModel.get('width'),
      height: boxLayoutModel.get('height')
    };
  };

  ComponentModel.protoInitialize = function () {
    var proto = ComponentModel.prototype;
    proto.type = 'component';
    proto.id = '';
    proto.name = '';
    proto.mainType = '';
    proto.subType = '';
    proto.componentIndex = 0;
  }();

  return ComponentModel;
}(Model_1["default"]);

clazz_1.mountExtend(ComponentModel, Model_1["default"]);
clazz_1.enableClassManagement(ComponentModel, {
  registerWhenExtend: true
});
componentUtil.enableSubTypeDefaulter(ComponentModel);
componentUtil.enableTopologicalTravel(ComponentModel, getDependencies);

function getDependencies(componentType) {
  var deps = [];
  zrUtil.each(ComponentModel.getClassesByMainType(componentType), function (clz) {
    deps = deps.concat(clz.dependencies || clz.prototype.dependencies || []);
  });
  deps = zrUtil.map(deps, function (type) {
    return clazz_1.parseClassType(type).main;
  });

  if (componentType !== 'dataset' && zrUtil.indexOf(deps, 'dataset') <= 0) {
    deps.unshift('dataset');
  }

  return deps;
}

exports["default"] = ComponentModel;