const urlLib = require('url');
const config = require('../congfig');
let getControllerName = require('../untils/getControllerName');

module.exports = function (req, res, next) {
    let originalPathname = urlLib.parse(req.originalUrl).pathname;
    if (originalPathname.indexOf('.') >= 0) {
        return next();
    }
    let c = '', a = '';
    let moduleName = config.common.default_modelName;
    if (config.host[req.headers.host]) moduleName = config.host[req.headers.host];
    if (originalPathname == '/') {
        c = (req.query[config.common.default_c_name]) ?
            req.query[config.common.default_c_name]
            :
            config.common.default_controller;
        a = (req.query[config.common.default_a_name]) ?
            req.query[config.common.default_a_name]
            :
            config.common.default_action;
        c = getControllerName(c);
    } else {
        let pathArr = originalPathname.split('/');
        if (pathArr.length <= 1) {
            c = config.common.default_controller;
            a = config.common.default_action;
        } else {
            c = getControllerName(pathArr[1]);
            a = (pathArr[2]) ? pathArr[2] : config.common.default_action;
        }
    }
    req.c = c;
    req.a = a;
    req.m = moduleName;
    next();
}