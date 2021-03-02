const config = require('../congfig');
const urlLib = require('url');
module.exports = function (req, res, next) {
    if (req.m == 'api') {
        return next();
    }
    let originalPathname = urlLib.parse(req.originalUrl).pathname;
    if (originalPathname.indexOf('.') >= 0) {
        return next();
    }
    let controllerName = req.c + '/' + req.a;
    if (config.public_control.indexOf(controllerName) < 0) {
        if (req.session && req.session.admin) {
            req.flag = 'pass';//有session
        } else {
            req.flag = 'no-pass';//没有session
        } 
    }
    next();
}