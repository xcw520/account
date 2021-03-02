const time = require('../../untils/getTime');
const money = require('../../model/api/MoneyType/MoneyType');
module.exports = {
    /**
     * @api {get} charts/getdata 获取图表数据
     * @apiDescription 移动端获取图表数据接口
     * @apiName getdata
     * @apiGroup Charts
     * @apiParam {string} kind 时间种类（1.周 2.月 3.年）
     * @apiParam {string} choice 选择数据的范围
     * @apiParam {string} accountkind 收入支出种类 （expensecharts/incomecharts）
     * @apiSuccess {number} code 状态码
     * @apiSuccess {string} msg 描述
     * @apiSuccess {json} data 数据
     * @apiSuccess {array} arr 统计图的横坐标
     * @apiSuccess {array} arr2 统计图的数据点
     * @apiSuccess {object} first 消费排行第一的数据
     * @apiSuccess {object} second 消费排行第二的数据
     * @apiSuccess {object} third 消费排行第三的数据
     * @apiSuccess {string} name 消费排行的分类名称
     * @apiSuccess {number} num 消费排行的分类花费
     * @apiSuccess {number} acount 总消费金额
     * @apiSuccessExample {json} Success-Response:
     * {
     *      "code": 200,
     *      "msg": "ok",
     *      "data": {
     *          "arr": ['1天', '2天', '3天', '4天', '5天','6天', '7天', '8天', '9天', '10天', '11天', '12天','13天','14天','15天','16天', '17天', '18天', '19天', '20天','21天', '22天', '23天', '24天', '25天', '26天', '27天','28天','29天','30天','31天'],
     *          "arr2": ['20','30','50','10','12','30','20','30','50','10','12','30','50','28','100','20','30','50','10','12','30','20','30','50','10','12','30','50','28','100','60'],
     *          "first": {
     *              "name": "购物", 
     *              "num":1000}
     *          },
     *          "second": {
     *              "name": "出行", 
     *              "num": 200
     *          },
     *          "third": {
     *              "name": "教育", 
     *              "num": 100
     *          },
     *          "acount": 5000
     * }
     * @apiErrorExample {json} Error-Response:
     * {
     *      "code": 404,
     *      "msg": "用户不存在"
     * }
     * @apiSampleRequest http://api.node.com:3000/charts/getdata
     * @apiVersion 1.0.0
     */
    async get_getdata(req, res) {

        let timeobj = time(req.query.kind, req.query.choice);
        let startTime = '', endTime = '';
        switch (req.query.kind) {
            case '1': {
                startTime = timeobj.weektimeStart;
                endTime = timeobj.weektimeEnd;
                break;
            }
            case '2': {
                startTime = timeobj.monthtimeStart;
                endTime = timeobj.monthtimeEnd;
                break;
            }
            case '3': {
                startTime = timeobj.yeartimeStart;
                endTime = timeobj.yeartimeEnd;
                break;
            }
        }
        let result = await money.getdata(req, startTime, endTime, req.user.uid, req.query.kind, req.query.accountkind, req.query.choice);
        res.send(result); 
    }
}