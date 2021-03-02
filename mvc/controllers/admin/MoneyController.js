const getMoneyList = require('../../model/admin/Money/UserUserInfoMoneyType');
const getAllSelect = require('../../model/admin/Type/Type');
module.exports = {
    /**
     * 进入账单页
     * @param {*} req 
     * @param {*} res  
     */
    async get_money(req, res) {
        let time1 = req.query.starttime;
        let time2 = req.query.endtime;
        let result = await getMoneyList.getAllMonryList(req);
        let result2 = await getAllSelect.getAllSelect(req);
        res.render('money/moneylist', {
            data: result.result,
            select: result2,
            keyword: req.query.keyword,
            type: req.query.type,
            kind: req.query.kind,
            starttime: time1,
            endtime: time2,
            html: result.html
        });
    },
    /**
     * 进入统计图页面
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_echarts(req, res, next){
        let result = await getAllSelect.getAllSelect(req);
        res.render('money/echarts', {
            select:result
        });
    },
    /**
     * 统计图选择条件后的查询信息
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_alldata(req, res,next){
        let keyword = '';
        if (req.query.keyword) keyword = req.query.keyword;
        let result1 = await getMoneyList.bar_allData(req);
        let result2 = await getMoneyList.fun_allday(req);
        let result3 = await getMoneyList.line_chart(req);
        res.send({
            result1:result1,
            result2:result2,
            result3:result3
        })
    }
}