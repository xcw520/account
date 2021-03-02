
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

var graphic_1 = require("../../util/graphic");

var formatUtil = require("../../util/format");

var layout = require("../../util/layout");

var VisualMapping_1 = require("../../visual/VisualMapping");

var Component_1 = require("../../view/Component");

var VisualMapView = function (_super) {
  tslib_1.__extends(VisualMapView, _super);

  function VisualMapView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = VisualMapView.type;
    _this.autoPositionValues = {
      left: 1,
      right: 1,
      top: 1,
      bottom: 1
    };
    return _this;
  }

  VisualMapView.prototype.init = function (ecModel, api) {
    this.ecModel = ecModel;
    this.api = api;
  };

  VisualMapView.prototype.render = function (visualMapModel, ecModel, api, payload) {
    this.visualMapModel = visualMapModel;

    if (visualMapModel.get('show') === false) {
      this.group.removeAll();
      return;
    }

    this.doRender(visualMapModel, ecModel, api, payload);
  };

  VisualMapView.prototype.renderBackground = function (group) {
    var visualMapModel = this.visualMapModel;
    var padding = formatUtil.normalizeCssArray(visualMapModel.get('padding') || 0);
    var rect = group.getBoundingRect();
    group.add(new graphic_1.Rect({
      z2: -1,
      silent: true,
      shape: {
        x: rect.x - padding[3],
        y: rect.y - padding[0],
        width: rect.width + padding[3] + padding[1],
        height: rect.height + padding[0] + padding[2]
      },
      style: {
        fill: visualMapModel.get('backgroundColor'),
        stroke: visualMapModel.get('borderColor'),
        lineWidth: visualMapModel.get('borderWidth')
      }
    }));
  };

  VisualMapView.prototype.getControllerVisual = function (targetValue, visualCluster, opts) {
    opts = opts || {};
    var forceState = opts.forceState;
    var visualMapModel = this.visualMapModel;
    var visualObj = {};

    if (visualCluster === 'symbol') {
      visualObj.symbol = visualMapModel.get('itemSymbol');
    }

    if (visualCluster === 'color') {
      var defaultColor = visualMapModel.get('contentColor');
      visualObj.color = defaultColor;
    }

    function getter(key) {
      return visualObj[key];
    }

    function setter(key, value) {
      visualObj[key] = value;
    }

    var mappings = visualMapModel.controllerVisuals[forceState || visualMapModel.getValueState(targetValue)];
    var visualTypes = VisualMapping_1["default"].prepareVisualTypes(mappings);
    zrUtil.each(visualTypes, function (type) {
      var visualMapping = mappings[type];

      if (opts.convertOpacityToAlpha && type === 'opacity') {
        type = 'colorAlpha';
        visualMapping = mappings.__alphaForOpacity;
      }

      if (VisualMapping_1["default"].dependsOn(type, visualCluster)) {
        visualMapping && visualMapping.applyVisual(targetValue, getter, setter);
      }
    });
    return visualObj[visualCluster];
  };

  VisualMapView.prototype.positionGroup = function (group) {
    var model = this.visualMapModel;
    var api = this.api;
    layout.positionElement(group, model.getBoxLayoutParams(), {
      width: api.getWidth(),
      height: api.getHeight()
    });
  };

  VisualMapView.prototype.doRender = function (visualMapModel, ecModel, api, payload) {};

  VisualMapView.type = 'visualMap';
  return VisualMapView;
}(Component_1["default"]);

Component_1["default"].registerClass(VisualMapView);
exports["default"] = VisualMapView;