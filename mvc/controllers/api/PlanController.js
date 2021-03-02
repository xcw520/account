
const plan = require('../../model/api/Plan/Plan');
module.exports = {
    /**
     * @api {get} plan/list 获取存钱计划的数据
     * @apiDescription 移动端获取存钱计划数据接口
     * @apiName list
     * @apiGroup Plan
     * @apiParam {string} year 要显示的存钱计划年份
     * @apiParam {string} month 要显示的存钱计划月份
     * @apiParam {string} day 要显示的存钱计划日期
     * @apiSuccess {number} code 状态码
     * @apiSuccess {string} msg 描述
     * @apiSuccess {json} data 数据
     * @apiSuccess {number} budget 用户存钱计划的每日预算
     * @apiSuccess {number} allexpense 用户本月到现在的总消费
     * @apiSuccess {number} out 用户计划的今日支出
     * @apiSuccess {array} detail 用户计划的支出详情
     * * @apiSuccessExample {json} Success-Response:
     * {
     *      "code": 200,
     *      "msg": "ok",
     *      "data": {
     *          "budget": 100.
     *          "allexpense": 5000,
     *          "out": 300,
     *          "detail": [
     *              {
     *                  "tname": "出行",
     *                  "num": 200
     *              }
     *          ]
     *      }
     * }
     */
    async get_list(req, res) { 
        let result = await plan.getinfo(req, req.user.uid);
        res.send(result);
    },   
    
    /**
     * @api {get} plan/change 修改存钱计划的每日预算
     * @apiDescription 移动端修改每日预算数据接口
     * @apiName change
     * @apiGroup Plan
     * @apiParam {string} newbudget 要修改每日预算的金额
     * @apiParam {string} year 要显示的存钱计划年份
     * @apiParam {string} month 要显示的存钱计划月份
     * @apiParam {string} day 要显示的存钱计划日期
     * @apiSuccess {number} code 状态码
     * @apiSuccess {string} msg 描述
     * @apiSuccessExample {json} Success-Response:
     * {
     *      "code": 200,
     *      "msg": "ok"
     * }
     * @apiErrorExample {json} Error-Response:   
     * {
     *      "code": 500,
     *      "msg": "修改失败"
     * }
     */
    async get_change(req, res){
        let result = await plan.change(req, req.user.uid);
        res.send(result);
    }
}