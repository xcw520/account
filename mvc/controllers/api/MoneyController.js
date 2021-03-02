const info = require('../../model/api/MoneyType/MoneyType');
const money = require('../../model/api/Money/Money');
const Type = require('../../model/api/Type/Type');
module.exports = {
/**
* @api {get} money/account 获取用户账单资料
* @apiDescription 移动端获取用户账单资料接口
* @apiName account
* @apiGroup Money
* @apiParam {number} year 年
* @apiParam {number} month 月
* @apiSuccess {number} code 状态码
* @apiSuccess {string} msg 描述
* @apiSuccess {json} data 数据
* @apiSuccess {array} list 月度账单列表
* @apiSuccess {string} date 日期
* @apiSuccess {number} allexpense 该日总支出
* @apiSuccess {number} allincome 该日总收入
* @apiSuccess {array} money 该日账单列表
* @apiSuccess {string} type 账单类型
* @apiSuccess {string} num 账单金额 （-为支出 +为收入）
* @apiSuccess {number} id 账单id 
* @apiSuccess {string} msg 账单备注 
* @apiSuccessExample {json} Success-Response:
* {
*      "code": 200,
*      "msg": "ok"
*      "data": {
*          "monthexpense": 5000,
*          "monthincome": 2000,
*          "list": [
*              {
*                  "date": "1月1日",
*                  "allexpense": 100,
*                  "allincome": 50,
*                  "money": [
*                      {
*                          "type": "饮食",
*                          "num": "-80",
*                          "id": 1001,
*                          "msg": "啦啦啦"
*                      },
*                      {
*                          "type": "出行",
*                          "num": "20",
*                          "id": 1002,
*                          "msg": "哦哦哦"
*                      }
*              },
*              {
*                  "date": "1月2日",
*                  "allexpense": 100,
*                  "allincome": 50,
*                  "money": [
*                      {
*                          "type": "饮食",
*                          "num": "-80",
*                          "id": 1003,
*                          "msg": "啦啦啦"
*                      },
*                      {
*                          "type": "出行",
*                          "num": "20",
*                          "id": 1004,
*                          "msg": "哦哦哦"
*                      }
*              }
*          ]
*      }
* }
* @apiErrorExample {json} Error-Response:   
* {
*      "code": 404,
*      "msg": "用户不存在"
* }
* @apiSampleRequest http://api.node.com:3000/money/account
* @apiVersion 1.0.0
*/
    async get_account(req, res) {
        let result = await info.getinfo(req);
        res.send({
            code: 200,
            msg: 'ok',
            data: {
                monthexpense: result.monthexpense,
                monthincome: result.monthincome,
                list: result.list2
            }
        })
    },


/**
* @api {get} money/del 删除账单信息
* @apiDescription 移动端删除账单接口
* @apiName del
* @apiGroup Money
* @apiParam {number} mid 账单id
* @apiSuccess {number} code 状态码
* @apiSuccess {string} msg 描述
* @apiSuccessExample {json} Success-Response:
* {
*      "code": 200,
*      "msg": "ok"
* }
* @apiErrorExample {json} Error-Response:   
* {
*      "code": 404,
*      "msg": "账单不存在"
* }
* @apiSampleRequest http://api.node.com:3000/money/del
* @apiVersion 1.0.0
*/
    async get_del(req, res) {
        let result = await money.del(req.query.mid);
        res.send(result);
    },



/**
 * @api {get} money/type 获取账单类型
 * @apiDescription 移动端获取账单类型接口
 * @apiName type
 * @apiGroup Money
 * @apiParam {string} tid 账单总类型（1.支出 2.收入）
 * @apiSuccess {number} code 状态码
 * @apiSuccess {string} msg 描述
 * @apiSuccess {json} data 数据
 * @apiSuccess {array} list 账单明细分类名
 * @apiSuccessExample {json} Success-Response:
 * {
 *      "code":200,
 *      "msg":"ok",
 *      "data":{
 *          list:['出行', '住宿', '饮食', '教育', '娱乐']
 *      }
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 *      code:404,
 *      msg:"分类不存在"
 * }
 * @apiSampleRequest http://api.node.com:3000/money/type
 * @apiVersion 1.0.0
 */
    async get_type(req, res) {
        let result = await Type.getTpye(req);
        res.send(result);
    },


    
/**
 * @api {post} money/setmoney 存储账单记录
 * @apiDescription 移动端存储账单记录的接口
 * @apiName setmoney
 * @apiGroup Money
 * @apiParam {string} tid 账单总类型（1.支出 2.收入）
 * @apiParam {string} money 账单金额
 * @apiParam {string} remark 账单备注
 * @apiParam {string} date 账单生成日期
 * @apiParam {string} type 账单明细类型
 * @apiSuccess {number} code 状态码
 * @apiSuccess {string} msg 描述
 * @apiSuccessExample {json} Success-Response:
 * {
 *      "code":200,
 *      "msg":"ok"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 *      code: 402,
 *      msg: "数据为空"
 * }
 * {
 *      code:500,
 *      msg:"账单储存失败"
 * }
 * @apiSampleRequest http://api.node.com:3000/money/setmoney
 * @apiVersion 1.0.0
 */
    async post_setmoney(req, res) {
        let uid = req.user.uid;
        let result  = await money.setmoney(req, uid);
        res.send(result);
    },

    /**
 * @api {post} money/add 添加账单分类
 * @apiDescription 移动端添加账单分类的接口
 * @apiName add
 * @apiGroup Money
 * @apiParam {string} tid 账单总类型（1.支出 2.收入）
 * @apiParam {string} typename 账单类型名
 * @apiSuccess {number} code 状态码
 * @apiSuccess {string} msg 描述
 * @apiSuccessExample {json} Success-Response:
 * {
 *      "code":200,
 *      "msg":"ok"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 *      code: 500,
 *      msg: "error"
 * }
 * @apiSampleRequest http://api.node.com:3000/money/add
 * @apiVersion 1.0.0
 */
    async get_add(req, res){
        let result = await Type.addtype(req);
        res.send(result);
    },

       /**
 * @api {post} money/deltype 删除账单分类
 * @apiDescription 移动端删除账单分类的接口
 * @apiName deltype
 * @apiGroup Money
 * @apiParam {string} tid 账单总类型（1.支出 2.收入）
 * @apiParam {string} typename 账单类型名
 * @apiSuccess {number} code 状态码
 * @apiSuccess {string} msg 描述
 * @apiSuccessExample {json} Success-Response:
 * {
 *      "code":200,
 *      "msg":"ok"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 *      code: 500,
 *      msg: "error"
 * }
 * @apiSampleRequest http://api.node.com:3000/money/del
 * @apiVersion 1.0.0
 */
    async get_deltype(req, res){
        console.log(req.query);
        let result = await Type.deltype(req);
        res.send(result);
    }
}