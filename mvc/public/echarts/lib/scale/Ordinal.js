
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

var Scale_1 = require("./Scale");

var OrdinalMeta_1 = require("../data/OrdinalMeta");

var scaleHelper = require("./helper");

var util_1 = require("zrender/lib/core/util");

var OrdinalScale = function (_super) {
  tslib_1.__extends(OrdinalScale, _super);

  function OrdinalScale(setting) {
    var _this = _super.call(this, setting) || this;

    _this.type = 'ordinal';

    var ordinalMeta = _this.getSetting('ordinalMeta');

    if (!ordinalMeta) {
      ordinalMeta = new OrdinalMeta_1["default"]({});
    }

    if (util_1.isArray(ordinalMeta)) {
      ordinalMeta = new OrdinalMeta_1["default"]({
        categories: util_1.map(ordinalMeta, function (item) {
          return util_1.isObject(item) ? item.value : item;
        })
      });
    }

    _this._ordinalMeta = ordinalMeta;
    _this._categorySortInfo = [];
    _this._extent = _this.getSetting('extent') || [0, ordinalMeta.categories.length - 1];
    return _this;
  }

  OrdinalScale.prototype.parse = function (val) {
    return typeof val === 'string' ? this._ordinalMeta.getOrdinal(val) : Math.round(val);
  };

  OrdinalScale.prototype.contain = function (rank) {
    rank = this.parse(rank);
    return scaleHelper.contain(rank, this._extent) && this._ordinalMeta.categories[rank] != null;
  };

  OrdinalScale.prototype.normalize = function (val) {
    val = this.getCategoryIndex(this.parse(val));
    return scaleHelper.normalize(val, this._extent);
  };

  OrdinalScale.prototype.scale = function (val) {
    val = this.getCategoryIndex(val);
    return Math.round(scaleHelper.scale(val, this._extent));
  };

  OrdinalScale.prototype.getTicks = function () {
    var ticks = [];
    var extent = this._extent;
    var rank = extent[0];

    while (rank <= extent[1]) {
      ticks.push({
        value: this.getCategoryIndex(rank)
      });
      rank++;
    }

    return ticks;
  };

  OrdinalScale.prototype.getMinorTicks = function (splitNumber) {
    return;
  };

  OrdinalScale.prototype.setCategorySortInfo = function (info) {
    this._categorySortInfo = info;
  };

  OrdinalScale.prototype.getCategorySortInfo = function () {
    return this._categorySortInfo;
  };

  OrdinalScale.prototype.getCategoryIndex = function (n) {
    if (this._categorySortInfo.length) {
      return this._categorySortInfo[n].beforeSortIndex;
    } else {
      return n;
    }
  };

  OrdinalScale.prototype.getRawIndex = function (displayIndex) {
    if (this._categorySortInfo.length) {
      return this._categorySortInfo[displayIndex].ordinalNumber;
    } else {
      return displayIndex;
    }
  };

  OrdinalScale.prototype.getLabel = function (tick) {
    if (!this.isBlank()) {
      var rawIndex = this.getRawIndex(tick.value);
      var cateogry = this._ordinalMeta.categories[rawIndex];
      return cateogry == null ? '' : cateogry + '';
    }
  };

  OrdinalScale.prototype.count = function () {
    return this._extent[1] - this._extent[0] + 1;
  };

  OrdinalScale.prototype.unionExtentFromData = function (data, dim) {
    this.unionExtent(data.getApproximateExtent(dim));
  };

  OrdinalScale.prototype.isInExtentRange = function (value) {
    value = this.getCategoryIndex(value);
    return this._extent[0] <= value && this._extent[1] >= value;
  };

  OrdinalScale.prototype.getOrdinalMeta = function () {
    return this._ordinalMeta;
  };

  OrdinalScale.prototype.niceTicks = function () {};

  OrdinalScale.prototype.niceExtent = function () {};

  OrdinalScale.type = 'ordinal';
  return OrdinalScale;
}(Scale_1["default"]);

Scale_1["default"].registerClass(OrdinalScale);
exports["default"] = OrdinalScale;