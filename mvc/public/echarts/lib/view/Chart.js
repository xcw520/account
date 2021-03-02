
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

var Group_1 = require("zrender/lib/graphic/Group");

var componentUtil = require("../util/component");

var clazzUtil = require("../util/clazz");

var modelUtil = require("../util/model");

var states_1 = require("../util/states");

var task_1 = require("../stream/task");

var createRenderPlanner_1 = require("../chart/helper/createRenderPlanner");

var inner = modelUtil.makeInner();
var renderPlanner = createRenderPlanner_1["default"]();

var ChartView = function () {
  function ChartView() {
    this.group = new Group_1["default"]();
    this.uid = componentUtil.getUID('viewChart');
    this.renderTask = task_1.createTask({
      plan: renderTaskPlan,
      reset: renderTaskReset
    });
    this.renderTask.context = {
      view: this
    };
  }

  ChartView.prototype.init = function (ecModel, api) {};

  ChartView.prototype.render = function (seriesModel, ecModel, api, payload) {};

  ChartView.prototype.highlight = function (seriesModel, ecModel, api, payload) {
    toggleHighlight(seriesModel.getData(), payload, 'emphasis');
  };

  ChartView.prototype.downplay = function (seriesModel, ecModel, api, payload) {
    toggleHighlight(seriesModel.getData(), payload, 'normal');
  };

  ChartView.prototype.remove = function (ecModel, api) {
    this.group.removeAll();
  };

  ChartView.prototype.dispose = function (ecModel, api) {};

  ChartView.prototype.updateView = function (seriesModel, ecModel, api, payload) {
    this.render(seriesModel, ecModel, api, payload);
  };

  ChartView.prototype.updateLayout = function (seriesModel, ecModel, api, payload) {
    this.render(seriesModel, ecModel, api, payload);
  };

  ChartView.prototype.updateVisual = function (seriesModel, ecModel, api, payload) {
    this.render(seriesModel, ecModel, api, payload);
  };

  ChartView.markUpdateMethod = function (payload, methodName) {
    inner(payload).updateMethod = methodName;
  };

  ChartView.protoInitialize = function () {
    var proto = ChartView.prototype;
    proto.type = 'chart';
  }();

  return ChartView;
}();

;

function elSetState(el, state, highlightDigit) {
  if (el) {
    (state === 'emphasis' ? states_1.enterEmphasis : states_1.leaveEmphasis)(el, highlightDigit);
  }
}

function toggleHighlight(data, payload, state) {
  var dataIndex = modelUtil.queryDataIndex(data, payload);
  var highlightDigit = payload && payload.highlightKey != null ? states_1.getHighlightDigit(payload.highlightKey) : null;

  if (dataIndex != null) {
    util_1.each(modelUtil.normalizeToArray(dataIndex), function (dataIdx) {
      elSetState(data.getItemGraphicEl(dataIdx), state, highlightDigit);
    });
  } else {
    data.eachItemGraphicEl(function (el) {
      elSetState(el, state, highlightDigit);
    });
  }
}

clazzUtil.enableClassExtend(ChartView, ['dispose']);
clazzUtil.enableClassManagement(ChartView, {
  registerWhenExtend: true
});

function renderTaskPlan(context) {
  return renderPlanner(context.model);
}

function renderTaskReset(context) {
  var seriesModel = context.model;
  var ecModel = context.ecModel;
  var api = context.api;
  var payload = context.payload;
  var progressiveRender = seriesModel.pipelineContext.progressiveRender;
  var view = context.view;
  var updateMethod = payload && inner(payload).updateMethod;
  var methodName = progressiveRender ? 'incrementalPrepareRender' : updateMethod && view[updateMethod] ? updateMethod : 'render';

  if (methodName !== 'render') {
    view[methodName](seriesModel, ecModel, api, payload);
  }

  return progressMethodMap[methodName];
}

var progressMethodMap = {
  incrementalPrepareRender: {
    progress: function (params, context) {
      context.view.incrementalRender(params, context.model, context.ecModel, context.api, context.payload);
    }
  },
  render: {
    forceFirstProgress: true,
    progress: function (params, context) {
      context.view.render(context.model, context.ecModel, context.api, context.payload);
    }
  }
};
exports["default"] = ChartView;