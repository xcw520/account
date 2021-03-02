const db2 = require('../../../libs/db2');
const getTableName = require('../../../untils/getTableName');
const mypath = require('path');
const db = require('../../../libs/db');
const urlLib = require('url');
const querystring = require('querystring');
const config = require('../../../congfig');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));
module.exports = {
    /**
     * 获取用户翻页类所需要的数据
     * @param {*} req 
     */
    async get_info(req) {
        try {
            let page = req.query.page;
            if (!page) page = 1;
            page = page * 1;
            let search = '';
            let searcharr = [];
            let key = req.query.keyword;
            if (key) {
                search = 'AND u_name LIKE ?';
                searcharr.push('%' + key + '%');
            }
            let dataresult = await db.query2(`SELECT COUNT(*) AS count FROM ${tablename} WHERE u_id IS NOT NULL ${search}`, searcharr);
            let datacount = dataresult[0].count;
            let pagesize = config.other.pagesize;
            let pageCount = Math.ceil(datacount / pagesize);
            if (page < 1) page = 1;
            if (page > pageCount && pageCount > 1) page = pageCount;
            let start = (page - 1) * pagesize;
            return {
                tablename,
                search,
                start,
                page,
                pageCount,
                pagesize,
                searcharr
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
        let str = ' <div class="page-wrap"><ul class="pagination">';
        if (pagecount <= config.other.menusize) {
            for (let i = 1; i <= pagecount; i++) {
                if (i == nowpage) {
                    str += `<li class="active"><a class="menu1" href="?page=${i}&${keywords}">${i}</a></li>`;
                } else {
                    str += `<li><a class="menu1" href="?page=${i}&${keywords}">${i}</a></li>`;
                }
            }
            return str;
        } else {
            if (nowpage == 1) {
                for (let i = 1; i <= config.other.menusize; i++) {
                    if (i == nowpage) {
                        str += `<li class="active"><a class="menu1" href="?page=${i}&${keywords}">${i}</a></li>`;
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
                        str += `<li class="active"><a class="menu1" href="?page=${i}&${keywords}">${i}</a></li>`;
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
                    str += `<li class="active"><a class="menu1" href="?page=${i}&${keywords}">${i}</a></li>`;
                } else {
                    str += `<li><a class="menu1" href="?page=${i}&${keywords}">${i}</a></li>`;
                }
            }
            str += `<li><a class="menu1" href="?page=${nowpage + 1}&${keywords}">&gt;&gt;</a></li>`;
            str += `</ul></div>`;
            return str;
        }
    },
    /**
     * 获取用户信息
     * @param {*} req 
     */
    async alluser(req) {
        try {
            let obj = urlLib.parse(req.originalUrl, true).query;
            delete obj['page'];
            let s = querystring.stringify(obj);
            let info = await this.get_info(req);
            let result = await db.query2(`SELECT * FROM ${tablename} WHERE u_id IS NOT NULL ${info.search} LIMIT ${info.start},${info.pagesize}`, info.searcharr);
            let html = await this.get_a(info.page, info.pageCount, s);
            let keyword = req.query.keyword;//关键字
            return {
                result: result,
                querystr: s,
                keyword: keyword,
                html: html
            };
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 查询对应用户信息
     * @param {*} req 
     */
    async usermsg(req) {
        try {
            let userid = req.query.id;//用户id
            let result = await db2.find(tablename, ['*'], [{ 'u_id': userid }]);
            return result[0];
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    }
}