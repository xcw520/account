
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

var parseSVG_1 = require("zrender/lib/tool/parseSVG");

var Group_1 = require("zrender/lib/graphic/Group");

var Rect_1 = require("zrender/lib/graphic/shape/Rect");

var util_1 = require("zrender/lib/core/util");

var BoundingRect_1 = require("zrender/lib/core/BoundingRect");

var model_1 = require("../../util/model");

var inner = model_1.makeInner();
exports["default"] = {
  load: function (mapName, mapRecord) {
    var originRoot = inner(mapRecord).originRoot;

    if (originRoot) {
      return {
        root: originRoot,
        boundingRect: inner(mapRecord).boundingRect
      };
    }

    var graphic = buildGraphic(mapRecord);
    inner(mapRecord).originRoot = graphic.root;
    inner(mapRecord).boundingRect = graphic.boundingRect;
    return graphic;
  },
  makeGraphic: function (mapName, mapRecord, hostKey) {
    var field = inner(mapRecord);
    var rootMap = field.rootMap || (field.rootMap = util_1.createHashMap());
    var root = rootMap.get(hostKey);

    if (root) {
      return root;
    }

    var originRoot = field.originRoot;
    var boundingRect = field.boundingRect;

    if (!field.originRootHostKey) {
      field.originRootHostKey = hostKey;
      root = originRoot;
    } else {
      root = buildGraphic(mapRecord, boundingRect).root;
    }

    return rootMap.set(hostKey, root);
  },
  removeGraphic: function (mapName, mapRecord, hostKey) {
    var field = inner(mapRecord);
    var rootMap = field.rootMap;
    rootMap && rootMap.removeKey(hostKey);

    if (hostKey === field.originRootHostKey) {
      field.originRootHostKey = null;
    }
  }
};

function buildGraphic(mapRecord, boundingRect) {
  var svgXML = mapRecord.svgXML;
  var result;
  var root;

  try {
    result = svgXML && parseSVG_1.parseSVG(svgXML, {
      ignoreViewBox: true,
      ignoreRootClip: true
    }) || {};
    root = result.root;
    util_1.assert(root != null);
  } catch (e) {
    throw new Error('Invalid svg format\n' + e.message);
  }

  var svgWidth = result.width;
  var svgHeight = result.height;
  var viewBoxRect = result.viewBoxRect;

  if (!boundingRect) {
    boundingRect = svgWidth == null || svgHeight == null ? root.getBoundingRect() : new BoundingRect_1["default"](0, 0, 0, 0);

    if (svgWidth != null) {
      boundingRect.width = svgWidth;
    }

    if (svgHeight != null) {
      boundingRect.height = svgHeight;
    }
  }

  if (viewBoxRect) {
    var viewBoxTransform = parseSVG_1.makeViewBoxTransform(viewBoxRect, boundingRect.width, boundingRect.height);
    var elRoot = root;
    root = new Group_1["default"]();
    root.add(elRoot);
    elRoot.scaleX = elRoot.scaleY = viewBoxTransform.scale;
    elRoot.x = viewBoxTransform.x;
    elRoot.y = viewBoxTransform.y;
  }

  root.setClipPath(new Rect_1["default"]({
    shape: boundingRect.plain()
  }));
  return {
    root: root,
    boundingRect: boundingRect
  };
}