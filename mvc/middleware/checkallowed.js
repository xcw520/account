const db2 = require('../libs/db2');
const urlLib = require('url');
const config = require('../congfig/index');
module.exports = async function (req, res, next) {
    let originalPathname = urlLib.parse(req.originalUrl).pathname;
    if (originalPathname.indexOf('.') >= 0) {
        return next();
    }
    let controllerName = req.c + '/' + req.a;
    if (req.m == "api" && config.public_control.indexOf(controllerName) < 0) {
        if (req.user) {
            if (req.user.uid) {
                let result = await db2.find('ac_user', ['u_allowed'], ` u_id='${req.user.uid}'`);
                if (!result[0]) {
                    return res.send({
                        code: 503,
                        msg: '非法AppId'
                    })
                } else {
                    if (result[0].u_allowed == '1') {
                        return res.send({
                            code: 503,
                            msg: '用户被屏蔽'
                        })
                    }
                }
            }
        }
    }
    next();
}