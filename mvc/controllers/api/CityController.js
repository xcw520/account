const City = require('../../model/api/City/City')
module.exports = {
    /**
     * @api {get} city/weather 获得天气api城市的id
     * @apiDescription 移动端定位城市获取城市id的接口
     * @apiName weather
     * @apiGroup City
     * @apiParam {string} city 城市名
     * @apiSuccess {number} code 状态码
     * @apiSuccess {string} msg 描述
     * @apiSuccess {json} data 数据
     * @apiSuccess {string} cityid 城市id
     * @apiSuccessExample {json} Success-Response:
     * {
     *      "code":200,
     *      "msg":"ok",
     *      "data":{
     *          cityid:"101230201"
     *       }
     * }
     * @apiErrorExample {json} Error-Response:
     * {
     *      "code":"504",
     *      "msg":"定位失败"
     * }
     * @apiSampleRequest http://api.node.com:3000/city/weather
     * @apiVersion 1.0.0
     */
    get_weather(req,res){
        let result = City.cityweather(req);
        res.send(result);
    }
}