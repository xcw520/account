
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

var helper_1 = require("./helper");

var vendor_1 = require("../../util/vendor");

function diffData(oldData, newData) {
  var diffResult = [];
  newData.diff(oldData).add(function (idx) {
    diffResult.push({
      cmd: '+',
      idx: idx
    });
  }).update(function (newIdx, oldIdx) {
    diffResult.push({
      cmd: '=',
      idx: oldIdx,
      idx1: newIdx
    });
  }).remove(function (idx) {
    diffResult.push({
      cmd: '-',
      idx: idx
    });
  }).execute();
  return diffResult;
}

function lineAnimationDiff(oldData, newData, oldStackedOnPoints, newStackedOnPoints, oldCoordSys, newCoordSys, oldValueOrigin, newValueOrigin) {
  var diff = diffData(oldData, newData);
  var currPoints = [];
  var nextPoints = [];
  var currStackedPoints = [];
  var nextStackedPoints = [];
  var status = [];
  var sortedIndices = [];
  var rawIndices = [];
  var newDataOldCoordInfo = helper_1.prepareDataCoordInfo(oldCoordSys, newData, oldValueOrigin);
  var oldDataNewCoordInfo = helper_1.prepareDataCoordInfo(newCoordSys, oldData, newValueOrigin);
  var oldPoints = oldData.getLayout('points') || [];
  var newPoints = newData.getLayout('points') || [];

  for (var i = 0; i < diff.length; i++) {
    var diffItem = diff[i];
    var pointAdded = true;
    var oldIdx2 = void 0;
    var newIdx2 = void 0;

    switch (diffItem.cmd) {
      case '=':
        oldIdx2 = diffItem.idx * 2;
        newIdx2 = diffItem.idx1 * 2;
        var currentX = oldPoints[oldIdx2];
        var currentY = oldPoints[oldIdx2 + 1];
        var nextX = newPoints[newIdx2];
        var nextY = newPoints[newIdx2 + 1];

        if (isNaN(currentX) || isNaN(currentY)) {
          currentX = nextX;
          currentY = nextY;
        }

        currPoints.push(currentX, currentY);
        nextPoints.push(nextX, nextY);
        currStackedPoints.push(oldStackedOnPoints[oldIdx2], oldStackedOnPoints[oldIdx2 + 1]);
        nextStackedPoints.push(newStackedOnPoints[newIdx2], newStackedOnPoints[newIdx2 + 1]);
        rawIndices.push(newData.getRawIndex(diffItem.idx1));
        break;

      case '+':
        var newIdx = diffItem.idx;
        var newDataDimsForPoint = newDataOldCoordInfo.dataDimsForPoint;
        var oldPt = oldCoordSys.dataToPoint([newData.get(newDataDimsForPoint[0], newIdx), newData.get(newDataDimsForPoint[1], newIdx)]);
        newIdx2 = newIdx * 2;
        currPoints.push(oldPt[0], oldPt[1]);
        nextPoints.push(newPoints[newIdx2], newPoints[newIdx2 + 1]);
        var stackedOnPoint = helper_1.getStackedOnPoint(newDataOldCoordInfo, oldCoordSys, newData, newIdx);
        currStackedPoints.push(stackedOnPoint[0], stackedOnPoint[1]);
        nextStackedPoints.push(newStackedOnPoints[newIdx2], newStackedOnPoints[newIdx2 + 1]);
        rawIndices.push(newData.getRawIndex(newIdx));
        break;

      case '-':
        var oldIdx = diffItem.idx;
        var rawIndex = oldData.getRawIndex(oldIdx);
        var oldDataDimsForPoint = oldDataNewCoordInfo.dataDimsForPoint;
        oldIdx2 = oldIdx * 2;

        if (rawIndex !== oldIdx) {
          var newPt = newCoordSys.dataToPoint([oldData.get(oldDataDimsForPoint[0], oldIdx), oldData.get(oldDataDimsForPoint[1], oldIdx)]);
          var newStackedOnPt = helper_1.getStackedOnPoint(oldDataNewCoordInfo, newCoordSys, oldData, oldIdx);
          currPoints.push(oldPoints[oldIdx2], oldPoints[oldIdx2 + 1]);
          nextPoints.push(newPt[0], newPt[1]);
          currStackedPoints.push(oldStackedOnPoints[oldIdx2], oldStackedOnPoints[oldIdx2 + 1]);
          nextStackedPoints.push(newStackedOnPt[0], newStackedOnPt[1]);
          rawIndices.push(rawIndex);
        } else {
          pointAdded = false;
        }

    }

    if (pointAdded) {
      status.push(diffItem);
      sortedIndices.push(sortedIndices.length);
    }
  }

  sortedIndices.sort(function (a, b) {
    return rawIndices[a] - rawIndices[b];
  });
  var len = currPoints.length;
  var sortedCurrPoints = vendor_1.createFloat32Array(len);
  var sortedNextPoints = vendor_1.createFloat32Array(len);
  var sortedCurrStackedPoints = vendor_1.createFloat32Array(len);
  var sortedNextStackedPoints = vendor_1.createFloat32Array(len);
  var sortedStatus = [];

  for (var i = 0; i < sortedIndices.length; i++) {
    var idx = sortedIndices[i];
    var i2 = i * 2;
    var idx2 = idx * 2;
    sortedCurrPoints[i2] = currPoints[idx2];
    sortedCurrPoints[i2 + 1] = currPoints[idx2 + 1];
    sortedNextPoints[i2] = nextPoints[idx2];
    sortedNextPoints[i2 + 1] = nextPoints[idx2 + 1];
    sortedCurrStackedPoints[i2] = currStackedPoints[idx2];
    sortedCurrStackedPoints[i2 + 1] = currStackedPoints[idx2 + 1];
    sortedNextStackedPoints[i2] = nextStackedPoints[idx2];
    sortedNextStackedPoints[i2 + 1] = nextStackedPoints[idx2 + 1];
    sortedStatus[i] = status[idx];
  }

  return {
    current: sortedCurrPoints,
    next: sortedNextPoints,
    stackedOnCurrent: sortedCurrStackedPoints,
    stackedOnNext: sortedNextStackedPoints,
    status: sortedStatus
  };
}

exports["default"] = lineAnimationDiff;