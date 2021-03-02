
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

var parseGeoJson_1 = require("./parseGeoJson");

var model_1 = require("../../util/model");

var nanhai_1 = require("./fix/nanhai");

var textCoord_1 = require("./fix/textCoord");

var geoCoord_1 = require("./fix/geoCoord");

var diaoyuIsland_1 = require("./fix/diaoyuIsland");

var inner = model_1.makeInner();
exports["default"] = {
  load: function (mapName, mapRecord, nameProperty) {
    var parsed = inner(mapRecord).parsed;

    if (parsed) {
      return parsed;
    }

    var specialAreas = mapRecord.specialAreas || {};
    var geoJSON = mapRecord.geoJSON;
    var regions;

    try {
      regions = geoJSON ? parseGeoJson_1["default"](geoJSON, nameProperty) : [];
    } catch (e) {
      throw new Error('Invalid geoJson format\n' + e.message);
    }

    nanhai_1["default"](mapName, regions);
    util_1.each(regions, function (region) {
      var regionName = region.name;
      textCoord_1["default"](mapName, region);
      geoCoord_1["default"](mapName, region);
      diaoyuIsland_1["default"](mapName, region);
      var specialArea = specialAreas[regionName];

      if (specialArea) {
        region.transformTo(specialArea.left, specialArea.top, specialArea.width, specialArea.height);
      }
    });
    return inner(mapRecord).parsed = {
      regions: regions,
      boundingRect: getBoundingRect(regions)
    };
  }
};

function getBoundingRect(regions) {
  var rect;

  for (var i = 0; i < regions.length; i++) {
    var regionRect = regions[i].getBoundingRect();
    rect = rect || regionRect.clone();
    rect.union(regionRect);
  }

  return rect;
}