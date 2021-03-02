const db2 = require('../../../libs/db2');
const mypath = require('path');
const getTableName = require('../../../untils/getTableName');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));

module.exports = {
    async getinfo(req, uid) {
        try {
            let daymap = ['', '31', '', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
            if (((req.query.year % 4 == 0) && (req.query.year % 100 != 0)) || (req.query.year % 400 == 0)) {
                daymap[2] = '29';
            } else daymap[2] = '28';
            let startTime = new Date(`${req.query.year}-${req.query.month}-1 0:0:0`).getTime();
            let endTime = new Date(`${req.query.year}-${req.query.month}-${daymap[req.query.month]} 23:59:59`).getTime();
            let budget = await db2.find(tablename, ['p_target_money'], ` u_id=${uid} AND p_push_time >= ${startTime} AND p_push_time <= ${endTime} ORDER BY p_id DESC`);
            if (!budget[0]) {
                budget = 100;
            } else {
                budget = budget[0].p_target_money;
            }
            let allexpenseobj = await db2.query(`SELECT SUM(m_expenses) AS money FROM ac_money WHERE u_id='${uid}' AND m_time >= ${startTime} AND m_time <= ${endTime}`);
            allexpense = allexpenseobj[0].money;
            startTime = new Date(`${req.query.year}-${req.query.month}-${req.query.day} 0:0:0`).getTime();
            endTime = new Date(`${req.query.year}-${req.query.month}-${req.query.day} 23:59:59`).getTime();


            let outobj = await db2.query(`SELECT SUM(m_expenses) AS money FROM ac_money WHERE u_id='${uid}' AND m_time >= ${startTime} AND m_time <= ${endTime} AND m_expenses IS NOT NULL`);
            out = outobj[0].money;

            let outlistobj = await db2.query(`SELECT t_name,m_expenses FROM ac_money_type WHERE u_id='${uid}' AND m_time >= ${startTime} AND m_time <= ${endTime} AND m_expenses IS NOT NULL`);
            let list = [];
            if (outlistobj[0]) {
                outlistobj.forEach(item => {
                    list.push({
                        tname: item.t_name,
                        num: item.m_expenses
                    })
                })
            }
            return {
                code: 200,
                msg: 'ok',
                data: {
                    budget,
                    allexpense,
                    out,
                    detail: list
                }
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }

    },


    async change(req, uid) {
        try {
            let pushtime = new Date(`${req.query.year}-${req.query.month}-${req.query.day}`).getTime();//修改预算时间
            let editbudget = req.query.newbudget;//修改的预算
            let result = await db2.add(tablename, { 'u_id': uid, 'p_target_money': editbudget, 'p_push_time': pushtime })
            if (result.affectedRows > 0) {
                return {
                    code: 200,
                    msg: 'ok'
                }
            } else {
                return {
                    code: 500,
                    msg: '修改失败'
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