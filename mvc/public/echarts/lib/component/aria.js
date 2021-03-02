
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

var aria_1 = require("../visual/aria");

var preprocessor_1 = require("./aria/preprocessor");

var PRIORITY_VISUAL_ARIA = echarts.PRIORITY.VISUAL.ARIA;
echarts.registerPreprocessor(preprocessor_1["default"]);
echarts.registerVisual(PRIORITY_VISUAL_ARIA, aria_1["default"]);