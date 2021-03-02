const db2 = require('../../../libs/db2');
const getTableName = require('../../../untils/getTableName');
const mypath = require('path');
const config = require('../../../congfig');
const Type = require('../type/Type');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));
module.exports = {
    /**
     * 获取用户账单翻页类所需要的数据
     * @param {*} req 
     */
    async get_info(req) {
        try {
            let page = req.query.page;
            if (!page) page = 1;
            page = page * 1;
            let where1 = [];
            let timea = (req.query.starttime) ? req.query.starttime : '';
            let timeb = (req.query.endtime) ? req.query.endtime : '';
            let time1 = new Date(req.query.starttime).getTime();
            let time2 = new Date(req.query.endtime).getTime();
            req.query.starttime = isNaN(time1) ? '' : time1;
            req.query.endtime = isNaN(time2) ? '' : time2;
           
            if (req.query.kind == '2') where1.push('m_expenses IS NOT NULL');
            if (req.query.kind == '1') where1.push('m_income IS NOT NULL');
            if (req.query.keyword) where1.push(`u_nick_name LIKE '%${req.query.keyword}%' `);
            if (req.query.type) where1.push({ 't_id': req.query.type });
            if (req.query.starttime) where1.push(`m_time >= '${req.query.starttime}'`);
            if (req.query.endtime) where1.push(`m_time <= '${req.query.endtime}'`);
            if (!req.query.endtime || req.query.endtime == '') req.query.endtime = new Date().getTime();
            let dataresult = await db2.select(tablename, ['COUNT(*) AS count'], where1);
            let datacount = dataresult[0].count;
            let pagesize = config.other.pagesize;
            
            let pageCount = Math.ceil(datacount / pagesize);
            if (page < 1) page = 1;
            if (page > pageCount && pageCount > 1) page = pageCount;
            let start = (page - 1) * pagesize;
            let key = '';
            for (let x in req.query) {
                if (x == 'page') continue;
                if (x == 'starttime') {
                    key += `${x}=${timea}&`;
                } else if (x == 'endtime') {
                    key += `${x}=${timeb}&`;
                } else
                    key += `${x}=${req.query[x]}&`;
            }
            return {
                tablename,
                start,
                page,
                pageCount,
                pagesize,
                key,
                where1
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 生成用户翻页类的a标签
     * @param {*} nowpage //当前页
     * @param {*} pagecount //总页数
     * @param {*} keywords //搜索条件
     */
    async get_a(nowpage, pagecount, keywords = "") {
        try {
            let str = ' <div class="page-wrap"><ul class="pagination">';
            if (pagecount <= config.other.menusize) {
                for (let i = 1; i <= pagecount; i++) {
                    if (i == nowpage) {
                        str += `<li class="active"><a class="menu1 " href="?page=${i}&${keywords}">${i}</a></li>`;
                    } else {
                        str += `<li><a class="menu1" href="?page=${i}&${keywords}">${i}</a></li>`;
                    }
                }
                return str;
            } else {
                if (nowpage == 1) {
                    for (let i = 1; i <= config.other.menusize; i++) {
                        if (i == nowpage) {
                            str += `<li class="active"><a class="menu1 " href="?page=${i}&${keywords}">${i}</a></li>`;
                        } else {
                            str += `<li><a class="menu1" href="?page=${i}&${keywords}">${i}</a></li>`;
                        }
                    }
                    str += `<li><a class="menu1" href="?page=2&${keywords}">&gt;&gt;</a></li>`;
                    str += `</ul></div>`;
                    return str;
                }
                if (nowpage == pagecount) {
                    str += `<li><a class="menu1" href="?page=${nowpage - 1}&${keywords}">&lt;&lt;</a></li>`;
                    for (let i = pagecount - config.other.menusize + 1; i <= pagecount; i++) {
                        if (i == nowpage) {
                            str += `<li class="active"><a class="menu1 " href="?page=${i}&${keywords}">${i}</a></li>`;
                        } else {
                            str += `<li><a class="menu1" href="?page=${i}&${keywords}">${i}</a></li>`;
                        }
                    }
                    str += `</ul></div>`;
                    return str;
                }
                let start = nowpage - Math.ceil(config.other.menusize / 2) + 1;
                let startmax = pagecount - config.other.menusize + 1;
                if (start < 1) start = 1;
                if (start > startmax) start = startmax;
                str += `<li><a class="menu1" href="?page=${nowpage - 1}&${keywords}">&lt;&lt;</a></li>`;
                for (let i = start; i < start + config.other.menusize; i++) {
                    if (i == nowpage) {
                        str += `<li class="active"><a class="menu1 " href="?page=${i}&${keywords}">${i}</a></li>`;
                    } else {
                        str += `<li><a class="menu1" href="?page=${i}&${keywords}">${i}</a></li>`;
                    }
                }
                str += `<li><a class="menu1" href="?page=${nowpage + 1}&${keywords}">&gt;&gt;</a></li>`;
                str += `</ul></div>`;
                return str;
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 获取账单信息
     * @param {*} req 
     */
    async getAllMonryList(req) {
        try {
            let info = await this.get_info(req);
            let html = await this.get_a(info.page, info.pageCount, info.key);
            let result = await db2.select(tablename, ['*'], info.where1, { 'order': 'm_time DESC', 'limit': `${info.start},${config.other.pagesize}` });
            return {
                result: result,
                html: html
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 获取柱状图数据
     * @param {*} req 
     */
    async bar_allData(req) {
        try {
            let uid = req.query.uid;//要查看账单的用户id
            let starttime = req.query.starttime;
            let endtime = req.query.endtime;
            let where = [{ 'u_id': uid }];
            if (starttime && !isNaN(starttime)) {
                where.push(`m_time >= ${starttime}`);
            }
            if (endtime && !isNaN(endtime)) {
                where.push(`m_time <= ${endtime}`);
            }
            let result_incomes = await db2.select(tablename, ['sum(m_income) AS count', 't_name'], where, { 'group': 't_name' });
            let result_expenses = await db2.select(tablename, ['sum(m_expenses) AS count', 't_name'], where, { 'group': 't_name' });
            let incomes = [];//收入
            let expenses = [];//支出
            let type = [];
            result_incomes.forEach(item => {//收入
                type.push(item.t_name);
                incomes.push(item.count);
            });
            result_expenses.forEach(item => {//支出
                expenses.push(item.count);
            });
            return {
                type: type,
                incomes: incomes,
                expenses: expenses
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 获取扇形数据
     * @param {*} req 
     */
    async fun_allday(req) {
        try {
            let uid = req.query.uid;//要查看账单的用户id
            let starttime = "", endtime = "";
            let y = new Date().getFullYear();
            let m = new Date().getMonth() + 1;
            if (req.query && req.query.type) {
                if (req.query.type == "1") {
                    starttime = new Date(`${y}-1-1 0:0:0`).getTime();
                    endtime = new Date(`${y}-12-31 23:59:59`).getTime();
                }
                if (req.query.type == "2") {
                    starttime = new Date(`${y}-${m}-1 0:0:0`).getTime();
                    if (m + 1 == 13) m = 0;
                    endtime = new Date(`${y}-${m + 1}-1 0:0:0`).getTime();
                }
            }
            let result_incomes = '';
            let result_expenses = '';
            let where = [{ 'u_id': uid }];
            if (starttime!=""&&endtime!="") {
                where.push(`m_time >= ${starttime} AND m_time < ${endtime}`);
            }
                
            if (req.query.keyword) {
                where.push({ 't_id': req.query.keyword });
            }
            result_incomes = await db2.select(tablename, ['sum(m_income) AS count'], where);
            result_expenses = await db2.select(tablename, ['sum(m_expenses) AS count'], where);
            let incomes = result_incomes[0].count;//收入
            let expenses = result_expenses[0].count;//支出
            return {
                incomes: incomes,
                expenses: expenses
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 获取折线图数据
     * @param {*} req 
     */
    async line_chart(req) {
        try {
            let uid = req.query.uid;//要查看账单的用户id
            let year = req.query.years;//年份
            if (!year) year = new Date().getFullYear();
            let month_incomes = [];//一年总收入
            let month_expenses = [];//一年总支出
            if (year % 4 == 0 && year % 100 !== 0 || year % 400 == 0) {//闰年
                arr = ['', 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            } else {
                arr = ['', 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            }
            for (let x = 1; x <= 12; x++) {
                let monthstart = `${year}-${x}-1`;//每月1号
                let monthend = `${year}-${x}-${arr[x]}`;//每月最后一天
                monthstart = new Date(monthstart).getTime();//每月的总收入
                monthend = new Date(monthend).getTime();//每月的总支出
                let result_incomes = await db2.select(tablename, ['sum(m_income) AS count'], [` m_time BETWEEN ${monthstart} AND ${monthend}`, { 'u_id': uid }]);
                let result_expenses = await db2.select(tablename, ['sum(m_expenses) AS count'], [` m_time BETWEEN ${monthstart} AND ${monthend}`, { 'u_id': uid }]);
                month_incomes.push((result_incomes[0].count) ? result_incomes[0].count : 0);
                month_expenses.push((result_expenses[0].count) ? result_expenses[0].count : 0);
            }
            return {
                month_incomes: month_incomes,
                month_expenses: month_expenses
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    }
}