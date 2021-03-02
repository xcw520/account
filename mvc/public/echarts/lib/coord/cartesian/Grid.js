
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

var layout_1 = require("../../util/layout");

var axisHelper_1 = require("../../coord/axisHelper");

var Cartesian2D_1 = require("./Cartesian2D");

var Axis2D_1 = require("./Axis2D");

var CoordinateSystem_1 = require("../../CoordinateSystem");

var model_1 = require("../../util/model");

var cartesianAxisHelper_1 = require("./cartesianAxisHelper");

var Grid = function () {
  function Grid(gridModel, ecModel, api) {
    this.type = 'grid';
    this._coordsMap = {};
    this._coordsList = [];
    this._axesMap = {};
    this._axesList = [];
    this.axisPointerEnabled = true;
    this.dimensions = Cartesian2D_1.cartesian2DDimensions;

    this._initCartesian(gridModel, ecModel, api);

    this.model = gridModel;
  }

  Grid.prototype.getRect = function () {
    return this._rect;
  };

  Grid.prototype.update = function (ecModel, api) {
    var axesMap = this._axesMap;

    this._updateScale(ecModel, this.model);

    util_1.each(axesMap.x, function (xAxis) {
      axisHelper_1.niceScaleExtent(xAxis.scale, xAxis.model);
    });
    util_1.each(axesMap.y, function (yAxis) {
      axisHelper_1.niceScaleExtent(yAxis.scale, yAxis.model);
    });
    var onZeroRecords = {};
    util_1.each(axesMap.x, function (xAxis) {
      fixAxisOnZero(axesMap, 'y', xAxis, onZeroRecords);
    });
    util_1.each(axesMap.y, function (yAxis) {
      fixAxisOnZero(axesMap, 'x', yAxis, onZeroRecords);
    });
    this.resize(this.model, api);
  };

  Grid.prototype.resize = function (gridModel, api, ignoreContainLabel) {
    var boxLayoutParams = gridModel.getBoxLayoutParams();
    var isContainLabel = !ignoreContainLabel && gridModel.get('containLabel');
    var gridRect = layout_1.getLayoutRect(boxLayoutParams, {
      width: api.getWidth(),
      height: api.getHeight()
    });
    this._rect = gridRect;
    var axesList = this._axesList;
    adjustAxes();

    if (isContainLabel) {
      util_1.each(axesList, function (axis) {
        if (!axis.model.get(['axisLabel', 'inside'])) {
          var labelUnionRect = axisHelper_1.estimateLabelUnionRect(axis);

          if (labelUnionRect) {
            var dim = axis.isHorizontal() ? 'height' : 'width';
            var margin = axis.model.get(['axisLabel', 'margin']);
            gridRect[dim] -= labelUnionRect[dim] + margin;

            if (axis.position === 'top') {
              gridRect.y += labelUnionRect.height + margin;
            } else if (axis.position === 'left') {
              gridRect.x += labelUnionRect.width + margin;
            }
          }
        }
      });
      adjustAxes();
    }

    util_1.each(this._coordsList, function (coord) {
      coord.calcAffineTransform();
    });

    function adjustAxes() {
      util_1.each(axesList, function (axis) {
        var isHorizontal = axis.isHorizontal();
        var extent = isHorizontal ? [0, gridRect.width] : [0, gridRect.height];
        var idx = axis.inverse ? 1 : 0;
        axis.setExtent(extent[idx], extent[1 - idx]);
        updateAxisTransform(axis, isHorizontal ? gridRect.x : gridRect.y);
      });
    }
  };

  Grid.prototype.getAxis = function (dim, axisIndex) {
    var axesMapOnDim = this._axesMap[dim];

    if (axesMapOnDim != null) {
      return axesMapOnDim[axisIndex || 0];
    }
  };

  Grid.prototype.getAxes = function () {
    return this._axesList.slice();
  };

  Grid.prototype.getCartesian = function (xAxisIndex, yAxisIndex) {
    if (xAxisIndex != null && yAxisIndex != null) {
      var key = 'x' + xAxisIndex + 'y' + yAxisIndex;
      return this._coordsMap[key];
    }

    if (util_1.isObject(xAxisIndex)) {
      yAxisIndex = xAxisIndex.yAxisIndex;
      xAxisIndex = xAxisIndex.xAxisIndex;
    }

    for (var i = 0, coordList = this._coordsList; i < coordList.length; i++) {
      if (coordList[i].getAxis('x').index === xAxisIndex || coordList[i].getAxis('y').index === yAxisIndex) {
        return coordList[i];
      }
    }
  };

  Grid.prototype.getCartesians = function () {
    return this._coordsList.slice();
  };

  Grid.prototype.convertToPixel = function (ecModel, finder, value) {
    var target = this._findConvertTarget(finder);

    return target.cartesian ? target.cartesian.dataToPoint(value) : target.axis ? target.axis.toGlobalCoord(target.axis.dataToCoord(value)) : null;
  };

  Grid.prototype.convertFromPixel = function (ecModel, finder, value) {
    var target = this._findConvertTarget(finder);

    return target.cartesian ? target.cartesian.pointToData(value) : target.axis ? target.axis.coordToData(target.axis.toLocalCoord(value)) : null;
  };

  Grid.prototype._findConvertTarget = function (finder) {
    var seriesModel = finder.seriesModel;
    var xAxisModel = finder.xAxisModel || seriesModel && seriesModel.getReferringComponents('xAxis', model_1.SINGLE_REFERRING).models[0];
    var yAxisModel = finder.yAxisModel || seriesModel && seriesModel.getReferringComponents('yAxis', model_1.SINGLE_REFERRING).models[0];
    var gridModel = finder.gridModel;
    var coordsList = this._coordsList;
    var cartesian;
    var axis;

    if (seriesModel) {
      cartesian = seriesModel.coordinateSystem;
      util_1.indexOf(coordsList, cartesian) < 0 && (cartesian = null);
    } else if (xAxisModel && yAxisModel) {
      cartesian = this.getCartesian(xAxisModel.componentIndex, yAxisModel.componentIndex);
    } else if (xAxisModel) {
      axis = this.getAxis('x', xAxisModel.componentIndex);
    } else if (yAxisModel) {
      axis = this.getAxis('y', yAxisModel.componentIndex);
    } else if (gridModel) {
      var grid = gridModel.coordinateSystem;

      if (grid === this) {
        cartesian = this._coordsList[0];
      }
    }

    return {
      cartesian: cartesian,
      axis: axis
    };
  };

  Grid.prototype.containPoint = function (point) {
    var coord = this._coordsList[0];

    if (coord) {
      return coord.containPoint(point);
    }
  };

  Grid.prototype._initCartesian = function (gridModel, ecModel, api) {
    var _this = this;

    var grid = this;
    var axisPositionUsed = {
      left: false,
      right: false,
      top: false,
      bottom: false
    };
    var axesMap = {
      x: {},
      y: {}
    };
    var axesCount = {
      x: 0,
      y: 0
    };
    ecModel.eachComponent('xAxis', createAxisCreator('x'), this);
    ecModel.eachComponent('yAxis', createAxisCreator('y'), this);

    if (!axesCount.x || !axesCount.y) {
      this._axesMap = {};
      this._axesList = [];
      return;
    }

    this._axesMap = axesMap;
    util_1.each(axesMap.x, function (xAxis, xAxisIndex) {
      util_1.each(axesMap.y, function (yAxis, yAxisIndex) {
        var key = 'x' + xAxisIndex + 'y' + yAxisIndex;
        var cartesian = new Cartesian2D_1["default"](key);
        cartesian.master = _this;
        cartesian.model = gridModel;
        _this._coordsMap[key] = cartesian;

        _this._coordsList.push(cartesian);

        cartesian.addAxis(xAxis);
        cartesian.addAxis(yAxis);
      });
    });

    function createAxisCreator(dimName) {
      return function (axisModel, idx) {
        if (!isAxisUsedInTheGrid(axisModel, gridModel)) {
          return;
        }

        var axisPosition = axisModel.get('position');

        if (dimName === 'x') {
          if (axisPosition !== 'top' && axisPosition !== 'bottom') {
            axisPosition = axisPositionUsed.bottom ? 'top' : 'bottom';
          }
        } else {
          if (axisPosition !== 'left' && axisPosition !== 'right') {
            axisPosition = axisPositionUsed.left ? 'right' : 'left';
          }
        }

        axisPositionUsed[axisPosition] = true;
        var axis = new Axis2D_1["default"](dimName, axisHelper_1.createScaleByModel(axisModel), [0, 0], axisModel.get('type'), axisPosition);
        var isCategory = axis.type === 'category';
        axis.onBand = isCategory && axisModel.get('boundaryGap');
        axis.inverse = axisModel.get('inverse');
        axisModel.axis = axis;
        axis.model = axisModel;
        axis.grid = grid;
        axis.index = idx;

        grid._axesList.push(axis);

        axesMap[dimName][idx] = axis;
        axesCount[dimName]++;
      };
    }
  };

  Grid.prototype._updateScale = function (ecModel, gridModel) {
    util_1.each(this._axesList, function (axis) {
      axis.scale.setExtent(Infinity, -Infinity);

      if (axis.type === 'category') {
        var categorySortInfo = axis.model.get('categorySortInfo');
        axis.scale.setCategorySortInfo(categorySortInfo);
      }
    });
    ecModel.eachSeries(function (seriesModel) {
      if (cartesianAxisHelper_1.isCartesian2DSeries(seriesModel)) {
        var axesModelMap = cartesianAxisHelper_1.findAxisModels(seriesModel);
        var xAxisModel = axesModelMap.xAxisModel;
        var yAxisModel = axesModelMap.yAxisModel;

        if (!isAxisUsedInTheGrid(xAxisModel, gridModel) || !isAxisUsedInTheGrid(yAxisModel, gridModel)) {
          return;
        }

        var cartesian = this.getCartesian(xAxisModel.componentIndex, yAxisModel.componentIndex);
        var data = seriesModel.getData();
        var xAxis = cartesian.getAxis('x');
        var yAxis = cartesian.getAxis('y');

        if (data.type === 'list') {
          unionExtent(data, xAxis);
          unionExtent(data, yAxis);
        }
      }
    }, this);

    function unionExtent(data, axis) {
      util_1.each(axisHelper_1.getDataDimensionsOnAxis(data, axis.dim), function (dim) {
        axis.scale.unionExtentFromData(data, dim);
      });
    }
  };

  Grid.prototype.getTooltipAxes = function (dim) {
    var baseAxes = [];
    var otherAxes = [];
    util_1.each(this.getCartesians(), function (cartesian) {
      var baseAxis = dim != null && dim !== 'auto' ? cartesian.getAxis(dim) : cartesian.getBaseAxis();
      var otherAxis = cartesian.getOtherAxis(baseAxis);
      util_1.indexOf(baseAxes, baseAxis) < 0 && baseAxes.push(baseAxis);
      util_1.indexOf(otherAxes, otherAxis) < 0 && otherAxes.push(otherAxis);
    });
    return {
      baseAxes: baseAxes,
      otherAxes: otherAxes
    };
  };

  Grid.create = function (ecModel, api) {
    var grids = [];
    ecModel.eachComponent('grid', function (gridModel, idx) {
      var grid = new Grid(gridModel, ecModel, api);
      grid.name = 'grid_' + idx;
      grid.resize(gridModel, api, true);
      gridModel.coordinateSystem = grid;
      grids.push(grid);
    });
    ecModel.eachSeries(function (seriesModel) {
      if (!cartesianAxisHelper_1.isCartesian2DSeries(seriesModel)) {
        return;
      }

      var axesModelMap = cartesianAxisHelper_1.findAxisModels(seriesModel);
      var xAxisModel = axesModelMap.xAxisModel;
      var yAxisModel = axesModelMap.yAxisModel;
      var gridModel = xAxisModel.getCoordSysModel();

      if (process.env.NODE_ENV !== 'production') {
        if (!gridModel) {
          throw new Error('Grid "' + util_1.retrieve3(xAxisModel.get('gridIndex'), xAxisModel.get('gridId'), 0) + '" not found');
        }

        if (xAxisModel.getCoordSysModel() !== yAxisModel.getCoordSysModel()) {
          throw new Error('xAxis and yAxis must use the same grid');
        }
      }

      var grid = gridModel.coordinateSystem;
      seriesModel.coordinateSystem = grid.getCartesian(xAxisModel.componentIndex, yAxisModel.componentIndex);
    });
    return grids;
  };

  Grid.dimensions = Cartesian2D_1.cartesian2DDimensions;
  return Grid;
}();

function isAxisUsedInTheGrid(axisModel, gridModel) {
  return axisModel.getCoordSysModel() === gridModel;
}

function fixAxisOnZero(axesMap, otherAxisDim, axis, onZeroRecords) {
  axis.getAxesOnZeroOf = function () {
    return otherAxisOnZeroOf ? [otherAxisOnZeroOf] : [];
  };

  var otherAxes = axesMap[otherAxisDim];
  var otherAxisOnZeroOf;
  var axisModel = axis.model;
  var onZero = axisModel.get(['axisLine', 'onZero']);
  var onZeroAxisIndex = axisModel.get(['axisLine', 'onZeroAxisIndex']);

  if (!onZero) {
    return;
  }

  if (onZeroAxisIndex != null) {
    if (canOnZeroToAxis(otherAxes[onZeroAxisIndex])) {
      otherAxisOnZeroOf = otherAxes[onZeroAxisIndex];
    }
  } else {
    for (var idx in otherAxes) {
      if (otherAxes.hasOwnProperty(idx) && canOnZeroToAxis(otherAxes[idx]) && !onZeroRecords[getOnZeroRecordKey(otherAxes[idx])]) {
        otherAxisOnZeroOf = otherAxes[idx];
        break;
      }
    }
  }

  if (otherAxisOnZeroOf) {
    onZeroRecords[getOnZeroRecordKey(otherAxisOnZeroOf)] = true;
  }

  function getOnZeroRecordKey(axis) {
    return axis.dim + '_' + axis.index;
  }
}

function canOnZeroToAxis(axis) {
  return axis && axis.type !== 'category' && axis.type !== 'time' && axisHelper_1.ifAxisCrossZero(axis);
}

function updateAxisTransform(axis, coordBase) {
  var axisExtent = axis.getExtent();
  var axisExtentSum = axisExtent[0] + axisExtent[1];
  axis.toGlobalCoord = axis.dim === 'x' ? function (coord) {
    return coord + coordBase;
  } : function (coord) {
    return axisExtentSum - coord + coordBase;
  };
  axis.toLocalCoord = axis.dim === 'x' ? function (coord) {
    return coord - coordBase;
  } : function (coord) {
    return axisExtentSum - coord + coordBase;
  };
}

CoordinateSystem_1["default"].register('cartesian2d', Grid);
exports["default"] = Grid;