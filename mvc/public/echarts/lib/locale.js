
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

var Model_1 = require("./model/Model");

var env_1 = require("zrender/lib/core/env");

var langEN_1 = require("./i18n/langEN");

var langZH_1 = require("./i18n/langZH");

var util_1 = require("zrender/lib/core/util");

var LOCALE_ZH = 'ZH';
var LOCALE_EN = 'EN';
var DEFAULT_LOCALE = LOCALE_EN;
var localeStorage = {};
var localeModels = {};
exports.SYSTEM_LANG = !env_1["default"].domSupported ? DEFAULT_LOCALE : function () {
  var langStr = (document.documentElement.lang || navigator.language || navigator.browserLanguage).toUpperCase();
  return langStr.indexOf(LOCALE_ZH) > -1 ? LOCALE_ZH : DEFAULT_LOCALE;
}();

function registerLocale(locale, localeObj) {
  locale = locale.toUpperCase();
  localeModels[locale] = new Model_1["default"](localeObj);
  localeStorage[locale] = localeObj;
}

exports.registerLocale = registerLocale;

function createLocaleObject(locale) {
  if (util_1.isString(locale)) {
    var localeObj = localeStorage[locale.toUpperCase()] || {};

    if (locale === LOCALE_ZH || locale === LOCALE_EN) {
      return util_1.clone(localeObj);
    } else {
      return util_1.merge(util_1.clone(localeObj), util_1.clone(localeStorage[DEFAULT_LOCALE]), false);
    }
  } else {
    return util_1.merge(util_1.clone(locale), util_1.clone(localeStorage[DEFAULT_LOCALE]), false);
  }
}

exports.createLocaleObject = createLocaleObject;

function getLocaleModel(lang) {
  return localeModels[lang];
}

exports.getLocaleModel = getLocaleModel;

function getDefaultLocaleModel() {
  return localeModels[DEFAULT_LOCALE];
}

exports.getDefaultLocaleModel = getDefaultLocaleModel;
registerLocale(LOCALE_EN, langEN_1["default"]);
registerLocale(LOCALE_ZH, langZH_1["default"]);