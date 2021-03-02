const create = require('../../model/api/axios/CreateToken');
const out = require('../../model/api/axios/out');
module.exports = {
    /**
* @api {post} api/getToken 获取token
* @apiDescription 移动端axios获取token接口
* @apiName getToken
* @apiGroup Api
* @apiParam {string} appid token_id
* @apiParam {string} secrect token_secrect
* @apiSuccess {string} data token码
* @apiSuccessExample {json} Success-Response:
* {
*      "data": "sfgsfdsfsdfsdf"
* }
* @apiErrorExample {json} Error-Response:   
* {
*      "code": 503,
*      "msg": "非法AppId"
* }，
* {
*      "code": 504,
*      "msg": "AppSecret不正确"
* }
* @apiSampleRequest http://api.node.com:3000/api/getToken
* @apiVersion 1.0.0
*/
    async post_getToken(req, res) {
        let result = await create(req, res);
        res.send(result);
    }
}