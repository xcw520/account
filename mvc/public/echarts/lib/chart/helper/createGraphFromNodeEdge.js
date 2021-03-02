
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

var zrUtil = require("zrender/lib/core/util");

var List_1 = require("../../data/List");

var Graph_1 = require("../../data/Graph");

var linkList_1 = require("../../data/helper/linkList");

var createDimensions_1 = require("../../data/helper/createDimensions");

var CoordinateSystem_1 = require("../../CoordinateSystem");

var createListFromArray_1 = require("./createListFromArray");

var model_1 = require("../../util/model");

function createGraphFromNodeEdge(nodes, edges, seriesModel, directed, beforeLink) {
  var graph = new Graph_1["default"](directed);

  for (var i = 0; i < nodes.length; i++) {
    graph.addNode(zrUtil.retrieve(nodes[i].id, nodes[i].name, i), i);
  }

  var linkNameList = [];
  var validEdges = [];
  var linkCount = 0;

  for (var i = 0; i < edges.length; i++) {
    var link = edges[i];
    var source = link.source;
    var target = link.target;

    if (graph.addEdge(source, target, linkCount)) {
      validEdges.push(link);
      linkNameList.push(zrUtil.retrieve(model_1.convertOptionIdName(link.id, null), source + ' > ' + target));
      linkCount++;
    }
  }

  var coordSys = seriesModel.get('coordinateSystem');
  var nodeData;

  if (coordSys === 'cartesian2d' || coordSys === 'polar') {
    nodeData = createListFromArray_1["default"](nodes, seriesModel);
  } else {
    var coordSysCtor = CoordinateSystem_1["default"].get(coordSys);
    var coordDimensions = coordSysCtor ? coordSysCtor.dimensions || [] : [];

    if (zrUtil.indexOf(coordDimensions, 'value') < 0) {
      coordDimensions.concat(['value']);
    }

    var dimensionNames = createDimensions_1["default"](nodes, {
      coordDimensions: coordDimensions
    });
    nodeData = new List_1["default"](dimensionNames, seriesModel);
    nodeData.initData(nodes);
  }

  var edgeData = new List_1["default"](['value'], seriesModel);
  edgeData.initData(validEdges, linkNameList);
  beforeLink && beforeLink(nodeData, edgeData);
  linkList_1["default"]({
    mainData: nodeData,
    struct: graph,
    structAttr: 'graph',
    datas: {
      node: nodeData,
      edge: edgeData
    },
    datasAttr: {
      node: 'data',
      edge: 'edgeData'
    }
  });
  graph.update();
  return graph;
}

exports["default"] = createGraphFromNodeEdge;