
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

var Group_1 = require("zrender/lib/graphic/Group");

var componentUtil = require("../util/component");

var clazzUtil = require("../util/clazz");

var ComponentView = function () {
  function ComponentView() {
    this.group = new Group_1["default"]();
    this.uid = componentUtil.getUID('viewComponent');
  }

  ComponentView.prototype.init = function (ecModel, api) {};

  ComponentView.prototype.render = function (model, ecModel, api, payload) {};

  ComponentView.prototype.dispose = function (ecModel, api) {};

  ComponentView.prototype.updateView = function (model, ecModel, api, payload) {};

  ComponentView.prototype.updateLayout = function (model, ecModel, api, payload) {};

  ComponentView.prototype.updateVisual = function (model, ecModel, api, payload) {};

  ComponentView.prototype.blurSeries = function (seriesModels, ecModel) {};

  return ComponentView;
}();

;
clazzUtil.enableClassExtend(ComponentView);
clazzUtil.enableClassManagement(ComponentView, {
  registerWhenExtend: true
});
exports["default"] = ComponentView;