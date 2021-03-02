const db2 = require('../../../libs/db2');
const mypath = require('path');
const getTableName = require('../../../untils/getTableName');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));

module.exports = {
    async del(mid) {
        try {
            let result = await db2.delete(tablename, `m_id = '${mid}'`);
            if (!result.affectedRows || result.affectedRows <= 0) {
                return {
                    code: 404,
                    msg: '账单不存在'
                }
            }
            if (result.affectedRows > 0) {
                return {
                    code: 200,
                    msg: 'ok'
                }
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }

    },

    async setmoney(req, uid) {
        try {
            let kind = req.body.tid;
            if (!req.body.money) {
                return {
                    code: 402,
                    msg: '数据为空'
                }
            }
            let result = await db2.find('ac_type', ['t_id'], `t_name = '${req.body.type}'`);
            let tid = result[0].t_id;
            let time = '';
            if (!req.body.date) time = new Date().getTime();
            else time = new Date(`${req.body.date}`).getTime();
            if (kind == '1') {
                result = await db2.add(tablename, { 'u_id': uid, 'm_expenses': req.body.money * 1, 'm_type_id': tid, 'm_time': time, 'm_remarkes': req.body.remark });

            } else {
                result = await db2.add(tablename, { 'u_id': uid, 'm_income': req.body.money * 1, 'm_type_id': tid, 'm_time': time, 'm_remarkes': req.body.remark });
            }
            if (result.affectedRows > 0) {
                return {
                    code: 200,
                    msg: 'ok'
                }
            } else {
                return {
                    code: 500,
                    msg: '账单储存失败'
                }
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }

    }
   
}