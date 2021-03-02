
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

var graphic = require("../../util/graphic");

var Symbol_1 = require("./Symbol");

var util_1 = require("zrender/lib/core/util");

var labelStyle_1 = require("../../label/labelStyle");

function symbolNeedsDraw(data, point, idx, opt) {
  return point && !isNaN(point[0]) && !isNaN(point[1]) && !(opt.isIgnore && opt.isIgnore(idx)) && !(opt.clipShape && !opt.clipShape.contain(point[0], point[1])) && data.getItemVisual(idx, 'symbol') !== 'none';
}

function normalizeUpdateOpt(opt) {
  if (opt != null && !util_1.isObject(opt)) {
    opt = {
      isIgnore: opt
    };
  }

  return opt || {};
}

function makeSeriesScope(data) {
  var seriesModel = data.hostModel;
  var emphasisModel = seriesModel.getModel('emphasis');
  return {
    emphasisItemStyle: emphasisModel.getModel('itemStyle').getItemStyle(),
    blurItemStyle: seriesModel.getModel(['blur', 'itemStyle']).getItemStyle(),
    selectItemStyle: seriesModel.getModel(['select', 'itemStyle']).getItemStyle(),
    focus: emphasisModel.get('focus'),
    blurScope: emphasisModel.get('blurScope'),
    symbolRotate: seriesModel.get('symbolRotate'),
    symbolOffset: seriesModel.get('symbolOffset'),
    hoverScale: emphasisModel.get('scale'),
    labelStatesModels: labelStyle_1.getLabelStatesModels(seriesModel),
    cursorStyle: seriesModel.get('cursor')
  };
}

var SymbolDraw = function () {
  function SymbolDraw(SymbolCtor) {
    this.group = new graphic.Group();
    this._SymbolCtor = SymbolCtor || Symbol_1["default"];
  }

  SymbolDraw.prototype.updateData = function (data, opt) {
    opt = normalizeUpdateOpt(opt);
    var group = this.group;
    var seriesModel = data.hostModel;
    var oldData = this._data;
    var SymbolCtor = this._SymbolCtor;
    var disableAnimation = opt.disableAnimation;
    var seriesScope = makeSeriesScope(data);
    var symbolUpdateOpt = {
      disableAnimation: disableAnimation
    };

    var getSymbolPoint = opt.getSymbolPoint || function (idx) {
      return data.getItemLayout(idx);
    };

    if (!oldData) {
      group.removeAll();
    }

    data.diff(oldData).add(function (newIdx) {
      var point = getSymbolPoint(newIdx);

      if (symbolNeedsDraw(data, point, newIdx, opt)) {
        var symbolEl = new SymbolCtor(data, newIdx, seriesScope, symbolUpdateOpt);
        symbolEl.setPosition(point);
        data.setItemGraphicEl(newIdx, symbolEl);
        group.add(symbolEl);
      }
    }).update(function (newIdx, oldIdx) {
      var symbolEl = oldData.getItemGraphicEl(oldIdx);
      var point = getSymbolPoint(newIdx);

      if (!symbolNeedsDraw(data, point, newIdx, opt)) {
        group.remove(symbolEl);
        return;
      }

      if (!symbolEl) {
        symbolEl = new SymbolCtor(data, newIdx);
        symbolEl.setPosition(point);
      } else {
        symbolEl.updateData(data, newIdx, seriesScope, symbolUpdateOpt);
        var target = {
          x: point[0],
          y: point[1]
        };
        disableAnimation ? symbolEl.attr(target) : graphic.updateProps(symbolEl, target, seriesModel);
      }

      group.add(symbolEl);
      data.setItemGraphicEl(newIdx, symbolEl);
    }).remove(function (oldIdx) {
      var el = oldData.getItemGraphicEl(oldIdx);
      el && el.fadeOut(function () {
        group.remove(el);
      });
    }).execute();
    this._getSymbolPoint = getSymbolPoint;
    this._data = data;
  };

  ;

  SymbolDraw.prototype.isPersistent = function () {
    return true;
  };

  ;

  SymbolDraw.prototype.updateLayout = function () {
    var _this = this;

    var data = this._data;

    if (data) {
      data.eachItemGraphicEl(function (el, idx) {
        var point = _this._getSymbolPoint(idx);

        el.setPosition(point);
        el.markRedraw();
      });
    }
  };

  ;

  SymbolDraw.prototype.incrementalPrepareUpdate = function (data) {
    this._seriesScope = makeSeriesScope(data);
    this._data = null;
    this.group.removeAll();
  };

  ;

  SymbolDraw.prototype.incrementalUpdate = function (taskParams, data, opt) {
    opt = normalizeUpdateOpt(opt);

    function updateIncrementalAndHover(el) {
      if (!el.isGroup) {
        el.incremental = true;
        el.ensureState('emphasis').hoverLayer = true;
      }
    }

    for (var idx = taskParams.start; idx < taskParams.end; idx++) {
      var point = data.getItemLayout(idx);

      if (symbolNeedsDraw(data, point, idx, opt)) {
        var el = new this._SymbolCtor(data, idx, this._seriesScope);
        el.traverse(updateIncrementalAndHover);
        el.setPosition(point);
        this.group.add(el);
        data.setItemGraphicEl(idx, el);
      }
    }
  };

  ;

  SymbolDraw.prototype.remove = function (enableAnimation) {
    var group = this.group;
    var data = this._data;

    if (data && enableAnimation) {
      data.eachItemGraphicEl(function (el) {
        el.fadeOut(function () {
          group.remove(el);
        });
      });
    } else {
      group.removeAll();
    }
  };

  ;
  return SymbolDraw;
}();

exports["default"] = SymbolDraw;