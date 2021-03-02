const config = require('../congfig');
const db = require('../libs/db');
const db2 = require('../libs/db2');
const urlLib = require('url');
module.exports = async function (req, res, next) {
    if (req.m == 'api') {
        return next();
    }
    let originalPathname = urlLib.parse(req.originalUrl).pathname;
    if (originalPathname.indexOf('.') >= 0) {
        return next();
    }
    if (req.flag == 'pass') {
        let controllerName = req.c + '/' + req.a;
        if (config.public_control.indexOf(controllerName) < 0 && config.common_power.indexOf(controllerName) < 0 && config.master_role_id != req.session.admin.role_id) {
            if (!req.session || !req.session.admin || !req.session.admin.role_id) {//没有session
                req.power = 'no-power';
                return next();
            }
            let result = await db2.select('ac_role_power', ['power_c_a'], `role_id='${req.session.admin.role_id}'`);
            let allow = [];
            if (!Array.isArray(result) || result.length <= 0) {//没有查询结果
                req.power = 'no-power';
                return next();
            }
            //有查询结果
            result.forEach(item => {
                allow.push(item['power_c_a']);
            });
            if (allow.indexOf('/'+controllerName[0].toLowerCase()+controllerName.slice(1)) < 0) {//当前访问的c/a并不属于用户拥有的权限
                req.power = 'no-power';
                return next();
            }
            req.power = 'pass';//有权限
            return next();
        } else {
            return next();
        }
    }
    next();

}