
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

var DataZoomModel_1 = require("./DataZoomModel");

var Component_1 = require("../../model/Component");

var component_1 = require("../../util/component");

var InsideZoomModel = function (_super) {
  tslib_1.__extends(InsideZoomModel, _super);

  function InsideZoomModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = InsideZoomModel.type;
    return _this;
  }

  InsideZoomModel.type = 'dataZoom.inside';
  InsideZoomModel.defaultOption = component_1.inheritDefaultOption(DataZoomModel_1["default"].defaultOption, {
    disabled: false,
    zoomLock: false,
    zoomOnMouseWheel: true,
    moveOnMouseMove: true,
    moveOnMouseWheel: false,
    preventDefaultMouseMove: true
  });
  return InsideZoomModel;
}(DataZoomModel_1["default"]);

Component_1["default"].registerClass(InsideZoomModel);
exports["default"] = InsideZoomModel;