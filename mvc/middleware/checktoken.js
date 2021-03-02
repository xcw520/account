const db = require("../libs/db");
const config = require('../congfig');
const urlLib = require('url');
module.exports = async function (req, res, next) {
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
            let session = req.session.admin;
            let sql = `SELECT admin_last_entertime FROM ac_admin WHERE admin_id=?`;
            let result = await db.query2(sql, [session.admin_id]);
            if (result[0].admin_last_entertime > session.token) {
                req.through = 'no-through';
            } else {
                req.through = 'through';
            }
        }
    }
    next();

}