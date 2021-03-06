
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

var zrUtil = require("zrender/lib/core/util");

var Chart_1 = require("../../view/Chart");

var SunburstPiece_1 = require("./SunburstPiece");

var DataDiffer_1 = require("../../data/DataDiffer");

var sunburstAction_1 = require("./sunburstAction");

var format_1 = require("../../util/format");

var SunburstView = function (_super) {
  tslib_1.__extends(SunburstView, _super);

  function SunburstView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = SunburstView.type;
    return _this;
  }

  SunburstView.prototype.render = function (seriesModel, ecModel, api, payload) {
    var self = this;
    this.seriesModel = seriesModel;
    this.api = api;
    this.ecModel = ecModel;
    var data = seriesModel.getData();
    var virtualRoot = data.tree.root;
    var newRoot = seriesModel.getViewRoot();
    var group = this.group;
    var renderLabelForZeroData = seriesModel.get('renderLabelForZeroData');
    var newChildren = [];
    newRoot.eachNode(function (node) {
      newChildren.push(node);
    });
    var oldChildren = this._oldChildren || [];
    dualTravel(newChildren, oldChildren);
    renderRollUp(virtualRoot, newRoot);

    this._initEvents();

    this._oldChildren = newChildren;

    function dualTravel(newChildren, oldChildren) {
      if (newChildren.length === 0 && oldChildren.length === 0) {
        return;
      }

      new DataDiffer_1["default"](oldChildren, newChildren, getKey, getKey).add(processNode).update(processNode).remove(zrUtil.curry(processNode, null)).execute();

      function getKey(node) {
        return node.getId();
      }

      function processNode(newIdx, oldIdx) {
        var newNode = newIdx == null ? null : newChildren[newIdx];
        var oldNode = oldIdx == null ? null : oldChildren[oldIdx];
        doRenderNode(newNode, oldNode);
      }
    }

    function doRenderNode(newNode, oldNode) {
      if (!renderLabelForZeroData && newNode && !newNode.getValue()) {
        newNode = null;
      }

      if (newNode !== virtualRoot && oldNode !== virtualRoot) {
        if (oldNode && oldNode.piece) {
          if (newNode) {
            oldNode.piece.updateData(false, newNode, seriesModel, ecModel, api);
            data.setItemGraphicEl(newNode.dataIndex, oldNode.piece);
          } else {
            removeNode(oldNode);
          }
        } else if (newNode) {
          var piece = new SunburstPiece_1["default"](newNode, seriesModel, ecModel, api);
          group.add(piece);
          data.setItemGraphicEl(newNode.dataIndex, piece);
        }
      }
    }

    function removeNode(node) {
      if (!node) {
        return;
      }

      if (node.piece) {
        group.remove(node.piece);
        node.piece = null;
      }
    }

    function renderRollUp(virtualRoot, viewRoot) {
      if (viewRoot.depth > 0) {
        if (self.virtualPiece) {
          self.virtualPiece.updateData(false, virtualRoot, seriesModel, ecModel, api);
        } else {
          self.virtualPiece = new SunburstPiece_1["default"](virtualRoot, seriesModel, ecModel, api);
          group.add(self.virtualPiece);
        }

        viewRoot.piece.off('click');
        self.virtualPiece.on('click', function (e) {
          self._rootToNode(viewRoot.parentNode);
        });
      } else if (self.virtualPiece) {
        group.remove(self.virtualPiece);
        self.virtualPiece = null;
      }
    }
  };

  SunburstView.prototype._initEvents = function () {
    var _this = this;

    this.group.off('click');
    this.group.on('click', function (e) {
      var targetFound = false;

      var viewRoot = _this.seriesModel.getViewRoot();

      viewRoot.eachNode(function (node) {
        if (!targetFound && node.piece && node.piece === e.target) {
          var nodeClick = node.getModel().get('nodeClick');

          if (nodeClick === 'rootToNode') {
            _this._rootToNode(node);
          } else if (nodeClick === 'link') {
            var itemModel = node.getModel();
            var link = itemModel.get('link');

            if (link) {
              var linkTarget = itemModel.get('target', true) || '_blank';
              format_1.windowOpen(link, linkTarget);
            }
          }

          targetFound = true;
        }
      });
    });
  };

  SunburstView.prototype._rootToNode = function (node) {
    if (node !== this.seriesModel.getViewRoot()) {
      this.api.dispatchAction({
        type: sunburstAction_1.ROOT_TO_NODE_ACTION,
        from: this.uid,
        seriesId: this.seriesModel.id,
        targetNode: node
      });
    }
  };

  SunburstView.prototype.containPoint = function (point, seriesModel) {
    var treeRoot = seriesModel.getData();
    var itemLayout = treeRoot.getItemLayout(0);

    if (itemLayout) {
      var dx = point[0] - itemLayout.cx;
      var dy = point[1] - itemLayout.cy;
      var radius = Math.sqrt(dx * dx + dy * dy);
      return radius <= itemLayout.r && radius >= itemLayout.r0;
    }
  };

  SunburstView.type = 'sunburst';
  return SunburstView;
}(Chart_1["default"]);

Chart_1["default"].registerClass(SunburstView);
exports["default"] = SunburstView;