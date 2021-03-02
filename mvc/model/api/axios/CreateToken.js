const api = require('../../../congfig/Apiconfig');
const jwt = require('jsonwebtoken');
const db2 = require('../../../libs/db2');
const md5 = require('../../../libs/md5');

module.exports = async function (req, res, next) {
    try {
        let id = req.body.appid;
        let secret = req.body.secrect;
        let result = await db2.find('ac_api', ['AppSecret'], `AppId='${id}'`);
        if (!result[0] || result.length < 0) {
            return {
                code: 503,
                msg: '非法AppId'
            }
        }
        if (result[0].AppSecret != md5(secret)) {
            return {
                code: 504,
                msg: 'AppSecret不正确'
            }
        }
        const token = jwt.sign(
            {
                id: id,
                secret: secret
            },
            api.secrect,
            {
                expiresIn: api.time
            }
        );
        return token;
    } catch (err) {
        return {
            code: 500,
            msg: err
        }
    }
}