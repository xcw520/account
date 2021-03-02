
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

var zrUtil = require("zrender/lib/core/util");

var barGrid_1 = require("../layout/barGrid");

require("../coord/cartesian/Grid");

require("./bar/BarSeries");

require("./bar/BarView");

require("../action/changeAxisOrder");

require("../component/gridSimple");

var dataSample_1 = require("../processor/dataSample");

echarts.registerLayout(echarts.PRIORITY.VISUAL.LAYOUT, zrUtil.curry(barGrid_1.layout, 'bar'));
echarts.registerLayout(echarts.PRIORITY.VISUAL.PROGRESSIVE_LAYOUT, barGrid_1.largeLayout);
echarts.registerVisual({
  seriesType: 'bar',
  reset: function (seriesModel) {
    seriesModel.getData().setVisual('legendSymbol', 'roundRect');
  }
});
echarts.registerProcessor(echarts.PRIORITY.PROCESSOR.STATISTIC, dataSample_1["default"]('bar'));