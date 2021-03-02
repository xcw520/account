
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

var echarts = require("../echarts");

var zrUtil = require("zrender/lib/core/util");

var throttleUtil = require("../util/throttle");

var parallelPreprocessor_1 = require("../coord/parallel/parallelPreprocessor");

require("../coord/parallel/parallelCreator");

require("./parallelAxis");

require("../coord/parallel/ParallelModel");

var Component_1 = require("../view/Component");

var CLICK_THRESHOLD = 5;

var ParallelView = function (_super) {
  tslib_1.__extends(ParallelView, _super);

  function ParallelView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = ParallelView.type;
    return _this;
  }

  ParallelView.prototype.render = function (parallelModel, ecModel, api) {
    this._model = parallelModel;
    this._api = api;

    if (!this._handlers) {
      this._handlers = {};
      zrUtil.each(handlers, function (handler, eventName) {
        api.getZr().on(eventName, this._handlers[eventName] = zrUtil.bind(handler, this));
      }, this);
    }

    throttleUtil.createOrUpdate(this, '_throttledDispatchExpand', parallelModel.get('axisExpandRate'), 'fixRate');
  };

  ParallelView.prototype.dispose = function (ecModel, api) {
    zrUtil.each(this._handlers, function (handler, eventName) {
      api.getZr().off(eventName, handler);
    });
    this._handlers = null;
  };

  ParallelView.prototype._throttledDispatchExpand = function (opt) {
    this._dispatchExpand(opt);
  };

  ParallelView.prototype._dispatchExpand = function (opt) {
    opt && this._api.dispatchAction(zrUtil.extend({
      type: 'parallelAxisExpand'
    }, opt));
  };

  ParallelView.type = 'parallel';
  return ParallelView;
}(Component_1["default"]);

Component_1["default"].registerClass(ParallelView);
var handlers = {
  mousedown: function (e) {
    if (checkTrigger(this, 'click')) {
      this._mouseDownPoint = [e.offsetX, e.offsetY];
    }
  },
  mouseup: function (e) {
    var mouseDownPoint = this._mouseDownPoint;

    if (checkTrigger(this, 'click') && mouseDownPoint) {
      var point = [e.offsetX, e.offsetY];
      var dist = Math.pow(mouseDownPoint[0] - point[0], 2) + Math.pow(mouseDownPoint[1] - point[1], 2);

      if (dist > CLICK_THRESHOLD) {
        return;
      }

      var result = this._model.coordinateSystem.getSlidedAxisExpandWindow([e.offsetX, e.offsetY]);

      result.behavior !== 'none' && this._dispatchExpand({
        axisExpandWindow: result.axisExpandWindow
      });
    }

    this._mouseDownPoint = null;
  },
  mousemove: function (e) {
    if (this._mouseDownPoint || !checkTrigger(this, 'mousemove')) {
      return;
    }

    var model = this._model;
    var result = model.coordinateSystem.getSlidedAxisExpandWindow([e.offsetX, e.offsetY]);
    var behavior = result.behavior;
    behavior === 'jump' && this._throttledDispatchExpand.debounceNextCall(model.get('axisExpandDebounce'));

    this._throttledDispatchExpand(behavior === 'none' ? null : {
      axisExpandWindow: result.axisExpandWindow,
      animation: behavior === 'jump' ? null : {
        duration: 0
      }
    });
  }
};

function checkTrigger(view, triggerOn) {
  var model = view._model;
  return model.get('axisExpandable') && model.get('axisExpandTriggerOn') === triggerOn;
}

echarts.registerPreprocessor(parallelPreprocessor_1["default"]);