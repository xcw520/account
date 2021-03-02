
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

var echarts = require("../../echarts");

var helper = require("../helper/treeHelper");

var util_1 = require("zrender/lib/core/util");

var log_1 = require("../../util/log");

exports.ROOT_TO_NODE_ACTION = 'sunburstRootToNode';
echarts.registerAction({
  type: exports.ROOT_TO_NODE_ACTION,
  update: 'updateView'
}, function (payload, ecModel) {
  ecModel.eachComponent({
    mainType: 'series',
    subType: 'sunburst',
    query: payload
  }, handleRootToNode);

  function handleRootToNode(model, index) {
    var targetInfo = helper.retrieveTargetInfo(payload, [exports.ROOT_TO_NODE_ACTION], model);

    if (targetInfo) {
      var originViewRoot = model.getViewRoot();

      if (originViewRoot) {
        payload.direction = helper.aboveViewRoot(originViewRoot, targetInfo.node) ? 'rollUp' : 'drillDown';
      }

      model.resetViewRoot(targetInfo.node);
    }
  }
});
var HIGHLIGHT_ACTION = 'sunburstHighlight';
echarts.registerAction({
  type: HIGHLIGHT_ACTION,
  update: 'none'
}, function (payload, ecModel, api) {
  payload = util_1.extend({}, payload);
  ecModel.eachComponent({
    mainType: 'series',
    subType: 'sunburst',
    query: payload
  }, handleHighlight);

  function handleHighlight(model) {
    var targetInfo = helper.retrieveTargetInfo(payload, [HIGHLIGHT_ACTION], model);

    if (targetInfo) {
      payload.dataIndex = targetInfo.node.dataIndex;
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    log_1.deprecateReplaceLog('highlight', 'sunburstHighlight');
  }

  api.dispatchAction(util_1.extend(payload, {
    type: 'highlight'
  }));
});
var UNHIGHLIGHT_ACTION = 'sunburstUnhighlight';
echarts.registerAction({
  type: UNHIGHLIGHT_ACTION,
  update: 'updateView'
}, function (payload, ecModel, api) {
  payload = util_1.extend({}, payload);

  if (process.env.NODE_ENV !== 'production') {
    log_1.deprecateReplaceLog('downplay', 'sunburstUnhighlight');
  }

  api.dispatchAction(util_1.extend(payload, {
    type: 'downplay'
  }));
});