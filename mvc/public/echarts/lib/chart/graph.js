
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

var echarts = require("../echarts");

require("./graph/GraphSeries");

require("./graph/GraphView");

require("./graph/graphAction");

var categoryFilter_1 = require("./graph/categoryFilter");

var categoryVisual_1 = require("./graph/categoryVisual");

var edgeVisual_1 = require("./graph/edgeVisual");

var simpleLayout_1 = require("./graph/simpleLayout");

var circularLayout_1 = require("./graph/circularLayout");

var forceLayout_1 = require("./graph/forceLayout");

var createView_1 = require("./graph/createView");

var View_1 = require("../coord/View");

echarts.registerProcessor(categoryFilter_1["default"]);
echarts.registerVisual(categoryVisual_1["default"]);
echarts.registerVisual(edgeVisual_1["default"]);
echarts.registerLayout(simpleLayout_1["default"]);
echarts.registerLayout(echarts.PRIORITY.VISUAL.POST_CHART_LAYOUT, circularLayout_1["default"]);
echarts.registerLayout(forceLayout_1["default"]);
echarts.registerCoordinateSystem('graphView', {
  dimensions: View_1["default"].dimensions,
  create: createView_1["default"]
});