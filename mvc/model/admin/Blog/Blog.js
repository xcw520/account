const db2 = require('../../../libs/db2');
const getTableName = require('../../../untils/getTableName');
const mypath = require('path');
const config = require('../../../congfig');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));

module.exports = {
    /**
     * 获取日志翻页类所需要的数据
     * @param {*} req 
     */
    async get_info(req) {
        try {
            let page = req.query.page;
            if (!page) page = 1;
            page = page * 1;
            let keyword = req.query.keyword;
            let starttime = new Date(req.query.starttime).getTime();
            let endtime = new Date(req.query.endtime).getTime();
            let where = [];
            if (keyword && keyword != "") where.push(`admin_name LIKE '%${keyword}%'`);
            if (starttime) where.push(`b_time >= ${starttime}`);
            if (endtime) where.push(`b_time <= ${endtime}`);
            if (req.query.kind && req.query.kind != "") where.push(`b_type = '${req.query.kind}'`);
            let dataresult = await db2.select(tablename, ['COUNT(*) AS count'], where);
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
                    key += `${x}=${req.query.starttime}&`;
                } else if (x == 'endtime') {
                    key += `${x}=${req.query.endtime}&`;
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
                where
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    async getList(req) {
        try {
            let info = await this.get_info(req);
            let html = await this.get_a(info.page, info.pageCount, info.key);
            let result = await db2.select(tablename, ['*'], info.where, { 'order': 'b_time', 'limit': `${info.start},${config.other.pagesize}` });
            return {
                result: result,
                keyword: req.query.keyword,
                starttime: req.query.starttime,
                endtime: req.query.endtime,
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
     * 生成日志翻页类的a标签
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
    async delmore(time) {
        try {
            await db2.delete(tablename, [`b_time < ${time}`]);
            return {
                code: 200,
                msg: 'ok'
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    async del(req) {
        try {
            await db2.delete(tablename, [`b_id = ${req.query.del}`]);
            return {
                code: 200,
                msg: 'ok'
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
        
    }
}        