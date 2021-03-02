
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

var OrdinalMeta = function () {
  function OrdinalMeta(opt) {
    this.categories = opt.categories || [];
    this._needCollect = opt.needCollect;
    this._deduplication = opt.deduplication;
  }

  OrdinalMeta.createByAxisModel = function (axisModel) {
    var option = axisModel.option;
    var data = option.data;
    var categories = data && util_1.map(data, getName);
    return new OrdinalMeta({
      categories: categories,
      needCollect: !categories,
      deduplication: option.dedplication !== false
    });
  };

  ;

  OrdinalMeta.prototype.getOrdinal = function (category) {
    return this._getOrCreateMap().get(category);
  };

  OrdinalMeta.prototype.parseAndCollect = function (category) {
    var index;
    var needCollect = this._needCollect;

    if (typeof category !== 'string' && !needCollect) {
      return category;
    }

    if (needCollect && !this._deduplication) {
      index = this.categories.length;
      this.categories[index] = category;
      return index;
    }

    var map = this._getOrCreateMap();

    index = map.get(category);

    if (index == null) {
      if (needCollect) {
        index = this.categories.length;
        this.categories[index] = category;
        map.set(category, index);
      } else {
        index = NaN;
      }
    }

    return index;
  };

  OrdinalMeta.prototype._getOrCreateMap = function () {
    return this._map || (this._map = util_1.createHashMap(this.categories));
  };

  return OrdinalMeta;
}();

function getName(obj) {
  if (util_1.isObject(obj) && obj.value != null) {
    return obj.value;
  } else {
    return obj + '';
  }
}

exports["default"] = OrdinalMeta;