
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

var symbol_1 = require("../../util/symbol");

var graphic = require("../../util/graphic");

var innerStore_1 = require("../../util/innerStore");

var states_1 = require("../../util/states");

var number_1 = require("../../util/number");

var labelHelper_1 = require("./labelHelper");

var util_1 = require("zrender/lib/core/util");

var labelStyle_1 = require("../../label/labelStyle");

var Image_1 = require("zrender/lib/graphic/Image");

var Symbol = function (_super) {
  tslib_1.__extends(Symbol, _super);

  function Symbol(data, idx, seriesScope, opts) {
    var _this = _super.call(this) || this;

    _this.updateData(data, idx, seriesScope, opts);

    return _this;
  }

  Symbol.prototype._createSymbol = function (symbolType, data, idx, symbolSize, keepAspect) {
    this.removeAll();
    var symbolPath = symbol_1.createSymbol(symbolType, -1, -1, 2, 2, null, keepAspect);
    symbolPath.attr({
      z2: 100,
      culling: true,
      scaleX: symbolSize[0] / 2,
      scaleY: symbolSize[1] / 2
    });
    symbolPath.drift = driftSymbol;
    this._symbolType = symbolType;
    this.add(symbolPath);
  };

  Symbol.prototype.stopSymbolAnimation = function (toLastFrame) {
    this.childAt(0).stopAnimation(null, toLastFrame);
  };

  Symbol.prototype.getSymbolPath = function () {
    return this.childAt(0);
  };

  Symbol.prototype.highlight = function () {
    states_1.enterEmphasis(this.childAt(0));
  };

  Symbol.prototype.downplay = function () {
    states_1.leaveEmphasis(this.childAt(0));
  };

  Symbol.prototype.setZ = function (zlevel, z) {
    var symbolPath = this.childAt(0);
    symbolPath.zlevel = zlevel;
    symbolPath.z = z;
  };

  Symbol.prototype.setDraggable = function (draggable) {
    var symbolPath = this.childAt(0);
    symbolPath.draggable = draggable;
    symbolPath.cursor = draggable ? 'move' : symbolPath.cursor;
  };

  Symbol.prototype.updateData = function (data, idx, seriesScope, opts) {
    this.silent = false;
    var symbolType = data.getItemVisual(idx, 'symbol') || 'circle';
    var seriesModel = data.hostModel;
    var symbolSize = Symbol.getSymbolSize(data, idx);
    var isInit = symbolType !== this._symbolType;
    var disableAnimation = opts && opts.disableAnimation;

    if (isInit) {
      var keepAspect = data.getItemVisual(idx, 'symbolKeepAspect');

      this._createSymbol(symbolType, data, idx, symbolSize, keepAspect);
    } else {
      var symbolPath = this.childAt(0);
      symbolPath.silent = false;
      var target = {
        scaleX: symbolSize[0] / 2,
        scaleY: symbolSize[1] / 2
      };
      disableAnimation ? symbolPath.attr(target) : graphic.updateProps(symbolPath, target, seriesModel, idx);
    }

    this._updateCommon(data, idx, symbolSize, seriesScope, opts);

    if (isInit) {
      var symbolPath = this.childAt(0);

      if (!disableAnimation) {
        var target = {
          scaleX: this._sizeX,
          scaleY: this._sizeY,
          style: {
            opacity: symbolPath.style.opacity
          }
        };
        symbolPath.scaleX = symbolPath.scaleY = 0;
        symbolPath.style.opacity = 0;
        graphic.initProps(symbolPath, target, seriesModel, idx);
      }
    }

    if (disableAnimation) {
      this.childAt(0).stopAnimation('remove');
    }

    this._seriesModel = seriesModel;
  };

  Symbol.prototype._updateCommon = function (data, idx, symbolSize, seriesScope, opts) {
    var symbolPath = this.childAt(0);
    var seriesModel = data.hostModel;
    var emphasisItemStyle;
    var blurItemStyle;
    var selectItemStyle;
    var focus;
    var blurScope;
    var symbolOffset;
    var labelStatesModels;
    var hoverScale;
    var cursorStyle;

    if (seriesScope) {
      emphasisItemStyle = seriesScope.emphasisItemStyle;
      blurItemStyle = seriesScope.blurItemStyle;
      selectItemStyle = seriesScope.selectItemStyle;
      focus = seriesScope.focus;
      blurScope = seriesScope.blurScope;
      symbolOffset = seriesScope.symbolOffset;
      labelStatesModels = seriesScope.labelStatesModels;
      hoverScale = seriesScope.hoverScale;
      cursorStyle = seriesScope.cursorStyle;
    }

    if (!seriesScope || data.hasItemOption) {
      var itemModel = seriesScope && seriesScope.itemModel ? seriesScope.itemModel : data.getItemModel(idx);
      var emphasisModel = itemModel.getModel('emphasis');
      emphasisItemStyle = emphasisModel.getModel('itemStyle').getItemStyle();
      selectItemStyle = itemModel.getModel(['select', 'itemStyle']).getItemStyle();
      blurItemStyle = itemModel.getModel(['blur', 'itemStyle']).getItemStyle();
      focus = emphasisModel.get('focus');
      blurScope = emphasisModel.get('blurScope');
      symbolOffset = itemModel.getShallow('symbolOffset');
      labelStatesModels = labelStyle_1.getLabelStatesModels(itemModel);
      hoverScale = emphasisModel.getShallow('scale');
      cursorStyle = itemModel.getShallow('cursor');
    }

    var symbolRotate = data.getItemVisual(idx, 'symbolRotate');
    symbolPath.attr('rotation', (symbolRotate || 0) * Math.PI / 180 || 0);

    if (symbolOffset) {
      symbolPath.x = number_1.parsePercent(symbolOffset[0], symbolSize[0]);
      symbolPath.y = number_1.parsePercent(symbolOffset[1], symbolSize[1]);
    }

    cursorStyle && symbolPath.attr('cursor', cursorStyle);
    var symbolStyle = data.getItemVisual(idx, 'style');
    var visualColor = symbolStyle.fill;

    if (symbolPath instanceof Image_1["default"]) {
      var pathStyle = symbolPath.style;
      symbolPath.useStyle(util_1.extend({
        image: pathStyle.image,
        x: pathStyle.x,
        y: pathStyle.y,
        width: pathStyle.width,
        height: pathStyle.height
      }, symbolStyle));
    } else {
      if (symbolPath.__isEmptyBrush) {
        symbolPath.useStyle(util_1.extend({}, symbolStyle));
      } else {
        symbolPath.useStyle(symbolStyle);
      }

      symbolPath.style.decal = null;
      symbolPath.setColor(visualColor, opts && opts.symbolInnerColor);
      symbolPath.style.strokeNoScale = true;
    }

    var liftZ = data.getItemVisual(idx, 'liftZ');
    var z2Origin = this._z2;

    if (liftZ != null) {
      if (z2Origin == null) {
        this._z2 = symbolPath.z2;
        symbolPath.z2 += liftZ;
      }
    } else if (z2Origin != null) {
      symbolPath.z2 = z2Origin;
      this._z2 = null;
    }

    var useNameLabel = opts && opts.useNameLabel;
    labelStyle_1.setLabelStyle(symbolPath, labelStatesModels, {
      labelFetcher: seriesModel,
      labelDataIndex: idx,
      defaultText: getLabelDefaultText,
      inheritColor: visualColor,
      defaultOpacity: symbolStyle.opacity
    });

    function getLabelDefaultText(idx) {
      return useNameLabel ? data.getName(idx) : labelHelper_1.getDefaultLabel(data, idx);
    }

    this._sizeX = symbolSize[0] / 2;
    this._sizeY = symbolSize[1] / 2;
    var emphasisState = symbolPath.ensureState('emphasis');
    emphasisState.style = emphasisItemStyle;
    symbolPath.ensureState('select').style = selectItemStyle;
    symbolPath.ensureState('blur').style = blurItemStyle;

    if (hoverScale) {
      var scaleRatio = Math.max(1.1, 3 / this._sizeY);
      emphasisState.scaleX = this._sizeX * scaleRatio;
      emphasisState.scaleY = this._sizeY * scaleRatio;
    }

    this.setSymbolScale(1);
    states_1.enableHoverEmphasis(this, focus, blurScope);
  };

  Symbol.prototype.setSymbolScale = function (scale) {
    this.scaleX = this.scaleY = scale;
  };

  Symbol.prototype.fadeOut = function (cb, opt) {
    var symbolPath = this.childAt(0);
    var seriesModel = this._seriesModel;
    var dataIndex = innerStore_1.getECData(this).dataIndex;
    var animationOpt = opt && opt.animation;
    this.silent = symbolPath.silent = true;

    if (opt && opt.fadeLabel) {
      var textContent = symbolPath.getTextContent();

      if (textContent) {
        graphic.removeElement(textContent, {
          style: {
            opacity: 0
          }
        }, seriesModel, {
          dataIndex: dataIndex,
          removeOpt: animationOpt,
          cb: function () {
            symbolPath.removeTextContent();
          }
        });
      }
    } else {
      symbolPath.removeTextContent();
    }

    graphic.removeElement(symbolPath, {
      style: {
        opacity: 0
      },
      scaleX: 0,
      scaleY: 0
    }, seriesModel, {
      dataIndex: dataIndex,
      cb: cb,
      removeOpt: animationOpt
    });
  };

  Symbol.getSymbolSize = function (data, idx) {
    var symbolSize = data.getItemVisual(idx, 'symbolSize');
    return symbolSize instanceof Array ? symbolSize.slice() : [+symbolSize, +symbolSize];
  };

  return Symbol;
}(graphic.Group);

function driftSymbol(dx, dy) {
  this.parent.drift(dx, dy);
}

exports["default"] = Symbol;