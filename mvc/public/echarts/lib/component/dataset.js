
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

var Component_1 = require("../model/Component");

var Component_2 = require("../view/Component");

var types_1 = require("../util/types");

var sourceManager_1 = require("../data/helper/sourceManager");

var DatasetModel = function (_super) {
  tslib_1.__extends(DatasetModel, _super);

  function DatasetModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = 'dataset';
    return _this;
  }

  DatasetModel.prototype.init = function (option, parentModel, ecModel) {
    _super.prototype.init.call(this, option, parentModel, ecModel);

    this._sourceManager = new sourceManager_1.SourceManager(this);
    sourceManager_1.disableTransformOptionMerge(this);
  };

  DatasetModel.prototype.mergeOption = function (newOption, ecModel) {
    _super.prototype.mergeOption.call(this, newOption, ecModel);

    sourceManager_1.disableTransformOptionMerge(this);
  };

  DatasetModel.prototype.optionUpdated = function () {
    this._sourceManager.dirty();
  };

  DatasetModel.prototype.getSourceManager = function () {
    return this._sourceManager;
  };

  DatasetModel.type = 'dataset';
  DatasetModel.defaultOption = {
    seriesLayoutBy: types_1.SERIES_LAYOUT_BY_COLUMN
  };
  return DatasetModel;
}(Component_1["default"]);

exports.DatasetModel = DatasetModel;
Component_1["default"].registerClass(DatasetModel);

var DatasetView = function (_super) {
  tslib_1.__extends(DatasetView, _super);

  function DatasetView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = 'dataset';
    return _this;
  }

  DatasetView.type = 'dataset';
  return DatasetView;
}(Component_2["default"]);

Component_2["default"].registerClass(DatasetView);