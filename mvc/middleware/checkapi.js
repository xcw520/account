const db2 = require('../libs/db2');
const md5 = require('../libs/md5');
const urlLib = require('url');
module.exports = async function (req, res, next) {
    let originalPathname = urlLib.parse(req.originalUrl).pathname;
    if (originalPathname.indexOf('.') >= 0) {
        return next();
    }
    if (req.user) {
        let id = req.user.id;
        let secret = req.user.secret;
        let result = await db2.find('ac_api', ['AppSecret'], `AppId='${id}'`);
        if (!result[0] || result.length < 0) {
            return res.send ({
                code: 503,
                msg: '非法AppId'
            })
        } else {
            if (result[0].AppSecret != md5(secret)) {
                return res.send ({
                    code: 504,
                    msg: 'AppSecret不正确'
                })
            }
        }
    }
    next();
}