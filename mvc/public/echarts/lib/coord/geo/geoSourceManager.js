
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

var mapDataStorage_1 = require("./mapDataStorage");

var geoJSONLoader_1 = require("./geoJSONLoader");

var geoSVGLoader_1 = require("./geoSVGLoader");

var BoundingRect_1 = require("zrender/lib/core/BoundingRect");

var loaders = {
  geoJSON: geoJSONLoader_1["default"],
  svg: geoSVGLoader_1["default"]
};
exports["default"] = {
  load: function (mapName, nameMap, nameProperty) {
    var regions = [];
    var regionsMap = util_1.createHashMap();
    var nameCoordMap = util_1.createHashMap();
    var boundingRect;
    var mapRecords = retrieveMap(mapName);
    util_1.each(mapRecords, function (record) {
      var singleSource = loaders[record.type].load(mapName, record, nameProperty);
      util_1.each(singleSource.regions, function (region) {
        var regionName = region.name;

        if (nameMap && nameMap.hasOwnProperty(regionName)) {
          region = region.cloneShallow(regionName = nameMap[regionName]);
        }

        regions.push(region);
        regionsMap.set(regionName, region);
        nameCoordMap.set(regionName, region.center);
      });
      var rect = singleSource.boundingRect;

      if (rect) {
        boundingRect ? boundingRect.union(rect) : boundingRect = rect.clone();
      }
    });
    return {
      regions: regions,
      regionsMap: regionsMap,
      nameCoordMap: nameCoordMap,
      boundingRect: boundingRect || new BoundingRect_1["default"](0, 0, 0, 0)
    };
  },
  makeGraphic: function (mapName, hostKey) {
    var mapRecords = retrieveMap(mapName);
    var results = [];
    util_1.each(mapRecords, function (record) {
      var method = loaders[record.type].makeGraphic;
      method && results.push(method(mapName, record, hostKey));
    });
    return results;
  },
  removeGraphic: function (mapName, hostKey) {
    var mapRecords = retrieveMap(mapName);
    util_1.each(mapRecords, function (record) {
      var method = loaders[record.type].makeGraphic;
      method && method(mapName, record, hostKey);
    });
  }
};

function mapNotExistsError(mapName) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Map ' + mapName + ' not exists. The GeoJSON of the map must be provided.');
  }
}

function retrieveMap(mapName) {
  var mapRecords = mapDataStorage_1["default"].retrieveMap(mapName) || [];

  if (process.env.NODE_ENV !== 'production') {
    if (!mapRecords.length) {
      mapNotExistsError(mapName);
    }
  }

  return mapRecords;
}