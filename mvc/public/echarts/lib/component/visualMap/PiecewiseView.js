
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

var VisualMapView_1 = require("./VisualMapView");

var graphic = require("../../util/graphic");

var symbol_1 = require("../../util/symbol");

var layout = require("../../util/layout");

var helper = require("./helper");

var Component_1 = require("../../view/Component");

var PiecewiseVisualMapView = function (_super) {
  tslib_1.__extends(PiecewiseVisualMapView, _super);

  function PiecewiseVisualMapView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = PiecewiseVisualMapView.type;
    return _this;
  }

  PiecewiseVisualMapView.prototype.doRender = function () {
    var thisGroup = this.group;
    thisGroup.removeAll();
    var visualMapModel = this.visualMapModel;
    var textGap = visualMapModel.get('textGap');
    var textStyleModel = visualMapModel.textStyleModel;
    var textFont = textStyleModel.getFont();
    var textFill = textStyleModel.getTextColor();

    var itemAlign = this._getItemAlign();

    var itemSize = visualMapModel.itemSize;

    var viewData = this._getViewData();

    var endsText = viewData.endsText;
    var showLabel = zrUtil.retrieve(visualMapModel.get('showLabel', true), !endsText);
    endsText && this._renderEndsText(thisGroup, endsText[0], itemSize, showLabel, itemAlign);
    zrUtil.each(viewData.viewPieceList, function (item) {
      var piece = item.piece;
      var itemGroup = new graphic.Group();
      itemGroup.onclick = zrUtil.bind(this._onItemClick, this, piece);

      this._enableHoverLink(itemGroup, item.indexInModelPieceList);

      var representValue = visualMapModel.getRepresentValue(piece);

      this._createItemSymbol(itemGroup, representValue, [0, 0, itemSize[0], itemSize[1]]);

      if (showLabel) {
        var visualState = this.visualMapModel.getValueState(representValue);
        itemGroup.add(new graphic.Text({
          style: {
            x: itemAlign === 'right' ? -textGap : itemSize[0] + textGap,
            y: itemSize[1] / 2,
            text: piece.text,
            verticalAlign: 'middle',
            align: itemAlign,
            font: textFont,
            fill: textFill,
            opacity: visualState === 'outOfRange' ? 0.5 : 1
          }
        }));
      }

      thisGroup.add(itemGroup);
    }, this);
    endsText && this._renderEndsText(thisGroup, endsText[1], itemSize, showLabel, itemAlign);
    layout.box(visualMapModel.get('orient'), thisGroup, visualMapModel.get('itemGap'));
    this.renderBackground(thisGroup);
    this.positionGroup(thisGroup);
  };

  PiecewiseVisualMapView.prototype._enableHoverLink = function (itemGroup, pieceIndex) {
    var _this = this;

    itemGroup.on('mouseover', function () {
      return onHoverLink('highlight');
    }).on('mouseout', function () {
      return onHoverLink('downplay');
    });

    var onHoverLink = function (method) {
      var visualMapModel = _this.visualMapModel;
      visualMapModel.option.hoverLink && _this.api.dispatchAction({
        type: method,
        batch: helper.makeHighDownBatch(visualMapModel.findTargetDataIndices(pieceIndex), visualMapModel)
      });
    };
  };

  PiecewiseVisualMapView.prototype._getItemAlign = function () {
    var visualMapModel = this.visualMapModel;
    var modelOption = visualMapModel.option;

    if (modelOption.orient === 'vertical') {
      return helper.getItemAlign(visualMapModel, this.api, visualMapModel.itemSize);
    } else {
      var align = modelOption.align;

      if (!align || align === 'auto') {
        align = 'left';
      }

      return align;
    }
  };

  PiecewiseVisualMapView.prototype._renderEndsText = function (group, text, itemSize, showLabel, itemAlign) {
    if (!text) {
      return;
    }

    var itemGroup = new graphic.Group();
    var textStyleModel = this.visualMapModel.textStyleModel;
    itemGroup.add(new graphic.Text({
      style: {
        x: showLabel ? itemAlign === 'right' ? itemSize[0] : 0 : itemSize[0] / 2,
        y: itemSize[1] / 2,
        verticalAlign: 'middle',
        align: showLabel ? itemAlign : 'center',
        text: text,
        font: textStyleModel.getFont(),
        fill: textStyleModel.getTextColor()
      }
    }));
    group.add(itemGroup);
  };

  PiecewiseVisualMapView.prototype._getViewData = function () {
    var visualMapModel = this.visualMapModel;
    var viewPieceList = zrUtil.map(visualMapModel.getPieceList(), function (piece, index) {
      return {
        piece: piece,
        indexInModelPieceList: index
      };
    });
    var endsText = visualMapModel.get('text');
    var orient = visualMapModel.get('orient');
    var inverse = visualMapModel.get('inverse');

    if (orient === 'horizontal' ? inverse : !inverse) {
      viewPieceList.reverse();
    } else if (endsText) {
      endsText = endsText.slice().reverse();
    }

    return {
      viewPieceList: viewPieceList,
      endsText: endsText
    };
  };

  PiecewiseVisualMapView.prototype._createItemSymbol = function (group, representValue, shapeParam) {
    group.add(symbol_1.createSymbol(this.getControllerVisual(representValue, 'symbol'), shapeParam[0], shapeParam[1], shapeParam[2], shapeParam[3], this.getControllerVisual(representValue, 'color')));
  };

  PiecewiseVisualMapView.prototype._onItemClick = function (piece) {
    var visualMapModel = this.visualMapModel;
    var option = visualMapModel.option;
    var selected = zrUtil.clone(option.selected);
    var newKey = visualMapModel.getSelectedMapKey(piece);

    if (option.selectedMode === 'single') {
      selected[newKey] = true;
      zrUtil.each(selected, function (o, key) {
        selected[key] = key === newKey;
      });
    } else {
      selected[newKey] = !selected[newKey];
    }

    this.api.dispatchAction({
      type: 'selectDataRange',
      from: this.uid,
      visualMapId: this.visualMapModel.id,
      selected: selected
    });
  };

  PiecewiseVisualMapView.type = 'visualMap.piecewise';
  return PiecewiseVisualMapView;
}(VisualMapView_1["default"]);

Component_1["default"].registerClass(PiecewiseVisualMapView);
exports["default"] = PiecewiseVisualMapView;