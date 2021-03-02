
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

var Text_1 = require("zrender/lib/graphic/Text");

var tooltipMarkup_1 = require("./tooltipMarkup");

var log_1 = require("../../util/log");

var TooltipRichContent = function () {
  function TooltipRichContent(api) {
    this._show = false;
    this._styleCoord = [0, 0, 0, 0];
    this._enterable = true;
    this._zr = api.getZr();
    makeStyleCoord(this._styleCoord, this._zr, api.getWidth() / 2, api.getHeight() / 2);
  }

  TooltipRichContent.prototype.update = function (tooltipModel) {
    var alwaysShowContent = tooltipModel.get('alwaysShowContent');
    alwaysShowContent && this._moveIfResized();
  };

  TooltipRichContent.prototype.show = function () {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }

    this.el.show();
    this._show = true;
  };

  TooltipRichContent.prototype.setContent = function (content, markupStyleCreator, tooltipModel, borderColor, arrowPosition) {
    if (zrUtil.isObject(content)) {
      log_1.throwError(process.env.NODE_ENV !== 'production' ? 'Passing DOM nodes as content is not supported in richText tooltip!' : '');
    }

    if (this.el) {
      this._zr.remove(this.el);
    }

    var textStyleModel = tooltipModel.getModel('textStyle');
    this.el = new Text_1["default"]({
      style: {
        rich: markupStyleCreator.richTextStyles,
        text: content,
        lineHeight: 22,
        backgroundColor: tooltipModel.get('backgroundColor'),
        borderRadius: tooltipModel.get('borderRadius'),
        borderWidth: 1,
        borderColor: borderColor,
        shadowColor: tooltipModel.get('shadowColor'),
        shadowBlur: tooltipModel.get('shadowBlur'),
        shadowOffsetX: tooltipModel.get('shadowOffsetX'),
        shadowOffsetY: tooltipModel.get('shadowOffsetY'),
        textShadowColor: textStyleModel.get('textShadowColor'),
        textShadowBlur: textStyleModel.get('textShadowBlur') || 0,
        textShadowOffsetX: textStyleModel.get('textShadowOffsetX') || 0,
        textShadowOffsetY: textStyleModel.get('textShadowOffsetY') || 0,
        fill: tooltipModel.get(['textStyle', 'color']),
        padding: tooltipMarkup_1.getPaddingFromTooltipModel(tooltipModel, 'richText'),
        verticalAlign: 'top',
        align: 'left'
      },
      z: tooltipModel.get('z')
    });

    this._zr.add(this.el);

    var self = this;
    this.el.on('mouseover', function () {
      if (self._enterable) {
        clearTimeout(self._hideTimeout);
        self._show = true;
      }

      self._inContent = true;
    });
    this.el.on('mouseout', function () {
      if (self._enterable) {
        if (self._show) {
          self.hideLater(self._hideDelay);
        }
      }

      self._inContent = false;
    });
  };

  TooltipRichContent.prototype.setEnterable = function (enterable) {
    this._enterable = enterable;
  };

  TooltipRichContent.prototype.getSize = function () {
    var el = this.el;
    var bounding = this.el.getBoundingRect();
    var shadowOuterSize = calcShadowOuterSize(el.style);
    return [bounding.width + shadowOuterSize.left + shadowOuterSize.right, bounding.height + shadowOuterSize.top + shadowOuterSize.bottom];
  };

  TooltipRichContent.prototype.moveTo = function (x, y) {
    var el = this.el;

    if (el) {
      var styleCoord = this._styleCoord;
      makeStyleCoord(styleCoord, this._zr, x, y);
      x = styleCoord[0];
      y = styleCoord[1];
      var style = el.style;
      var borderWidth = mathMaxWith0(style.borderWidth || 0);
      var shadowOuterSize = calcShadowOuterSize(style);
      el.x = x + borderWidth + shadowOuterSize.left;
      el.y = y + borderWidth + shadowOuterSize.top;
      el.markRedraw();
    }
  };

  TooltipRichContent.prototype._moveIfResized = function () {
    var ratioX = this._styleCoord[2];
    var ratioY = this._styleCoord[3];
    this.moveTo(ratioX * this._zr.getWidth(), ratioY * this._zr.getHeight());
  };

  TooltipRichContent.prototype.hide = function () {
    if (this.el) {
      this.el.hide();
    }

    this._show = false;
  };

  TooltipRichContent.prototype.hideLater = function (time) {
    if (this._show && !(this._inContent && this._enterable)) {
      if (time) {
        this._hideDelay = time;
        this._show = false;
        this._hideTimeout = setTimeout(zrUtil.bind(this.hide, this), time);
      } else {
        this.hide();
      }
    }
  };

  TooltipRichContent.prototype.isShow = function () {
    return this._show;
  };

  TooltipRichContent.prototype.getOuterSize = function () {
    var size = this.getSize();
    return {
      width: size[0],
      height: size[1]
    };
  };

  TooltipRichContent.prototype.dispose = function () {
    this._zr.remove(this.el);
  };

  return TooltipRichContent;
}();

function mathMaxWith0(val) {
  return Math.max(0, val);
}

function calcShadowOuterSize(style) {
  var shadowBlur = mathMaxWith0(style.shadowBlur || 0);
  var shadowOffsetX = mathMaxWith0(style.shadowOffsetX || 0);
  var shadowOffsetY = mathMaxWith0(style.shadowOffsetY || 0);
  return {
    left: mathMaxWith0(shadowBlur - shadowOffsetX),
    right: mathMaxWith0(shadowBlur + shadowOffsetX),
    top: mathMaxWith0(shadowBlur - shadowOffsetY),
    bottom: mathMaxWith0(shadowBlur + shadowOffsetY)
  };
}

function makeStyleCoord(out, zr, zrX, zrY) {
  out[0] = zrX;
  out[1] = zrY;
  out[2] = out[0] / zr.getWidth();
  out[3] = out[1] / zr.getHeight();
}

exports["default"] = TooltipRichContent;