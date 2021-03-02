
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

var env_1 = require("zrender/lib/core/env");

var clazz_1 = require("../util/clazz");

var areaStyle_1 = require("./mixin/areaStyle");

var textStyle_1 = require("./mixin/textStyle");

var lineStyle_1 = require("./mixin/lineStyle");

var itemStyle_1 = require("./mixin/itemStyle");

var util_1 = require("zrender/lib/core/util");

var Model = function () {
  function Model(option, parentModel, ecModel) {
    this.parentModel = parentModel;
    this.ecModel = ecModel;
    this.option = option;
  }

  Model.prototype.init = function (option, parentModel, ecModel) {
    var rest = [];

    for (var _i = 3; _i < arguments.length; _i++) {
      rest[_i - 3] = arguments[_i];
    }
  };

  Model.prototype.mergeOption = function (option, ecModel) {
    util_1.merge(this.option, option, true);
  };

  Model.prototype.get = function (path, ignoreParent) {
    if (path == null) {
      return this.option;
    }

    return this._doGet(this.parsePath(path), !ignoreParent && this.parentModel);
  };

  Model.prototype.getShallow = function (key, ignoreParent) {
    var option = this.option;
    var val = option == null ? option : option[key];

    if (val == null && !ignoreParent) {
      var parentModel = this.parentModel;

      if (parentModel) {
        val = parentModel.getShallow(key);
      }
    }

    return val;
  };

  Model.prototype.getModel = function (path, parentModel) {
    var hasPath = path != null;
    var pathFinal = hasPath ? this.parsePath(path) : null;
    var obj = hasPath ? this._doGet(pathFinal) : this.option;
    parentModel = parentModel || this.parentModel && this.parentModel.getModel(this.resolveParentPath(pathFinal));
    return new Model(obj, parentModel, this.ecModel);
  };

  Model.prototype.isEmpty = function () {
    return this.option == null;
  };

  Model.prototype.restoreData = function () {};

  Model.prototype.clone = function () {
    var Ctor = this.constructor;
    return new Ctor(util_1.clone(this.option));
  };

  Model.prototype.parsePath = function (path) {
    if (typeof path === 'string') {
      return path.split('.');
    }

    return path;
  };

  Model.prototype.resolveParentPath = function (path) {
    return path;
  };

  Model.prototype.isAnimationEnabled = function () {
    if (!env_1["default"].node && this.option) {
      if (this.option.animation != null) {
        return !!this.option.animation;
      } else if (this.parentModel) {
        return this.parentModel.isAnimationEnabled();
      }
    }
  };

  Model.prototype._doGet = function (pathArr, parentModel) {
    var obj = this.option;

    if (!pathArr) {
      return obj;
    }

    for (var i = 0; i < pathArr.length; i++) {
      if (!pathArr[i]) {
        continue;
      }

      obj = obj && typeof obj === 'object' ? obj[pathArr[i]] : null;

      if (obj == null) {
        break;
      }
    }

    if (obj == null && parentModel) {
      obj = parentModel._doGet(this.resolveParentPath(pathArr), parentModel.parentModel);
    }

    return obj;
  };

  return Model;
}();

;
clazz_1.enableClassExtend(Model);
clazz_1.enableClassCheck(Model);
util_1.mixin(Model, lineStyle_1.LineStyleMixin);
util_1.mixin(Model, itemStyle_1.ItemStyleMixin);
util_1.mixin(Model, areaStyle_1.AreaStyleMixin);
util_1.mixin(Model, textStyle_1["default"]);
exports["default"] = Model;