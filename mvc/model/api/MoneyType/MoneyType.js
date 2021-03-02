const db2 = require('../../../libs/db2');
const mypath = require('path');
const getTableName = require('../../../untils/getTableName');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));

module.exports = {
    getFirstDayOfWeek(date) {
        let weekday = date.getDay() || 7;
        date.setDate(date.getDate() - weekday + 1);
        return date.getDate();
    },
    async getdata(req, startTime, endTime, uid, kind1, kind2, choice) {
        try {
            let name = req.user.username;
            let user = await db2.find('ac_user_user_info', ['u_id'], `u_name='${name}' OR u_phone='${name}'`);
            if (!user[0]) {
                return {
                    code: 404,
                    msg: '用户名不存在'
                }
            }
            let first = {
                name: '',
                num: ''
            }
            let second = {
                name: '',
                num: ''
            }
            let third = {
                name: '',
                num: ''
            }

            let date = new Date();
            if (choice && choice!='周' && choice!='月' && choice!='年' && choice!='支出' && choice!='收入') {
                if (kind1 == '1') {
                    date = new Date(`${date.getFullYear()}-${date.getMonth()+1}-${choice}`);
                }
                if (kind1 == '2') {
                    date = new Date(`${date.getFullYear()}-${choice}-${date.getDate()}`);
                }
                if (kind1 == '3') {
                    date = new Date(`${choice}-${date.getMonth()+1}-${date.getDate()}`);
                }
            }
            let month = date.getMonth() + 1;
            let daymap = ['', '31', '', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
            let year = date.getFullYear();
            if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
                daymap[2] = '29';
            } else daymap[2] = '28';
            let sql = "", where = "", moneyname = "";
            if (kind2 == 'expensecharts') {
                where = ' AND m_expenses IS NOT NULL';
                moneyname = 'm_expenses';

            } else {
                if (kind2 == 'incomecharts') {
                    where = ' AND m_income IS NOT NULL';
                    moneyname = 'm_income';
                }
            }
            sql = `SELECT SUM(${moneyname}) AS count FROM ${tablename} WHERE u_id = '${uid}' AND m_time >= ${startTime} AND m_time <= ${endTime} ${where}`;
            let result = await db2.query(sql);
            let acount = result[0].count;
            sql = `SELECT SUM(${moneyname}) AS money, t_name FROM ${tablename} WHERE u_id = '${uid}' AND m_time >= ${startTime} AND m_time <= ${endTime} ${where} GROUP BY t_name ORDER BY money DESC LIMIT 3`;
            let list = await db2.query(sql);
            if (list[0]) {
                first = {
                    name: list[0].t_name,
                    num: list[0].money
                }
            }
            if (list[1]) {
                second = {
                    name: list[1].t_name,
                    num: list[1].money
                }
            }
            if (list[2]) {
                third = {
                    name: list[2].t_name,
                    num: list[2].money
                }
            }
            let arr = [];
            let arr2 = [];
            switch (kind1) {
                case '1': {
                    arr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
                    let day = this.getFirstDayOfWeek(date);
                    if (day + 6 <= daymap[month]) {
                        for (let i = day; i <= day + 6; i++) {
                            let time1 = new Date(`${year}-${month}-${i} 0:0:0`).getTime();
                            let time2 = new Date(`${year}-${month}-${i} 23:59:59`).getTime();
                            sql = `SELECT SUM(${moneyname}) AS count FROM ${tablename} WHERE u_id = '${uid}' AND m_time >= ${time1} AND m_time <= ${time2}`;
                            let result = await db2.query(sql);
                            if (result.length >= 0) {
                                if (!result[0].count) result[0].count = 0;
                                arr2.push(result[0].count);
                            }
                        }
                    } else {
                        for (let i = day; i <= daymap[month]; i++) {
                            let time1 = new Date(`${year}-${month}-${i} 0:0:0`).getTime();
                            let time2 = new Date(`${year}-${month}-${i} 23:59:59`).getTime();
                            sql = `SELECT SUM(${moneyname}) AS count FROM ${tablename} WHERE u_id = '${uid}' AND m_time >= ${time1} AND m_time <= ${time2}`;
                            let result = await db2.query(sql);
                            if (result.length >= 0) {
                                if (!result[0].count) result[0].count = 0;
                                arr2.push(result[0].count);
                            }
                        }
                        let addyear = year;
                        if (month + 1 > 12) {
                            addyear++;
                            month = 1;
                        }
                        for (let i = 1; i <= day + 6 - daymap[month]; i++) {
                            let time1 = new Date(`${addyear}-${month + 1}-${i} 0:0:0`).getTime();
                            let time2 = new Date(`${addyear}-${month + 1}-${i} 23:59:59`).getTime();
                            sql = `SELECT SUM(${moneyname}) AS count FROM ${tablename} WHERE u_id ='${uid}' AND m_time >= ${time1} AND m_time <= ${time2}`;
                            let result = await db2.query(sql);
                            if (result.length >= 0) {
                                if (!result[0].count) result[0].count = 0;
                                arr2.push(result[0].count);
                            }
                        }
                    }
                    break;
                }
                case '2': {
                    for (let i = 1; i <= daymap[month]; i++) {
                        arr.push(i + '日');
                    }
                    for (let i = 1; i <= daymap[month]; i++) {
                        let time1 = new Date(`${year}-${month}-${i} 0:0:0`).getTime();
                        let time2 = new Date(`${year}-${month}-${i} 23:59:59`).getTime();
                        sql = `SELECT SUM(${moneyname}) AS count FROM ${tablename} WHERE u_id ='${uid}' AND m_time >= ${time1} AND m_time <= ${time2}`;
                        let result = await db2.query(sql);
                        if (result.length >= 0) {
                            if (!result[0].count) result[0].count = 0;
                            arr2.push(result[0].count);
                        }
                    }
                    break;
                }
                case '3': {
                    arr = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
                    for (let i = 1; i <= 12; i++) {
                        let time1 = new Date(`${year}-${i}-${1} 0:0:0`).getTime();
                        let time2 = new Date(`${year}-${i}-${daymap[i]} 23:59:59`).getTime();
                        sql = `SELECT SUM(${moneyname}) AS count FROM ${tablename} WHERE u_id ='${uid}' AND m_time >= ${time1} AND m_time <= ${time2}`;
                        let result = await db2.query(sql);
                        if (result.length >= 0) {
                            if (!result[0].count) result[0].count = 0;
                            arr2.push(result[0].count);
                        }
                    }
                    break;
                }
            }
            return {
                code: 200,
                msg: 'ok',
                data: {
                    arr,
                    arr2,
                    first,
                    second,
                    third,
                    acount
                }
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },


    async getinfo(req) {
        try {
            let name = req.user.username;
            let user = await db2.find('ac_user_user_info', ['u_id'], `u_name='${name}' OR u_phone='${name}'`);
            if (!user[0]) {
                return {
                    code: 404,
                    msg: '用户名不存在'
                }
            }
            let uid = req.user.uid;
            let list = [], list2 = [];
            let allexpense = '';
            let allincome = '';
            let year = req.query.year;
            let month = req.query.month;
            if (month[0] == '0') month = month[1];
            let daymap = ['', '31', '', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
            if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
                daymap[2] = '29';
            } else daymap[2] = '28';
            let startTime, endTime, sql;
            startTime = new Date(`${year}-${month}-1 0:0:0`).getTime();
            endTime = new Date(`${year}-${month}-${daymap[month]} 23:59:59`).getTime();
            sql = `SELECT SUM(m_expenses) AS money FROM ${tablename} WHERE u_id='${uid}' AND m_time >= ${startTime} AND m_time <= ${endTime}`;
            monthm = await db2.query(sql);
            if (monthm[0]) {
                monthexpense = monthm[0].money;
            }
            sql = `SELECT SUM(m_income) AS money FROM ${tablename} WHERE u_id='${uid}' AND m_time >= ${startTime} AND m_time <= ${endTime}`;
            monthm = await db2.query(sql);
            if (monthm[0]) {
                monthincome = monthm[0].money;
            }
            for (let i = 1; i <= daymap[month]; i++) {
                startTime = new Date(`${year}-${month}-${i} 0:0:0`).getTime();
                endTime = new Date(`${year}-${month}-${i} 23:59:59`).getTime();
                sql = `SELECT SUM(m_expenses) AS money FROM ${tablename} WHERE u_id='${uid}'  AND m_time >= ${startTime} AND m_time <= ${endTime}`;
                let expenses = await db2.query(sql);
                if (expenses[0]) {
                    allexpense = expenses[0].money;
                }
                sql = `SELECT SUM(m_income) AS money FROM ${tablename} WHERE u_id='${uid}'  AND m_time >= ${startTime} AND m_time <= ${endTime}`;
                let income = await db2.query(sql);
                if (income[0]) {
                    allincome = income[0].money;
                }
                list.push({
                    date: month + '月' + i + '日',
                    allexpense,
                    allincome,
                    money: []
                });
                sql = `SELECT t_name, m_id, m_expenses, m_income, m_remarkes FROM ${tablename} WHERE u_id='${uid}'  AND m_time >= ${startTime} AND m_time <= ${endTime}`;
                let result = await db2.query(sql);
                if (result[0]) {
                    result.forEach(item => {
                        let title = (item.m_expenses) ? '-' : '+';
                        list[i - 1].money.push({
                            type: item.t_name,
                            num: title + (item.m_expenses + item.m_income),
                            id: item.m_id,
                            msg: item.m_remarkes
                        })
                    })
                }
            }
            for (let i = 0; i < list.length; i++) {
                if (list[i].allexpense || list[i].allincome) {
                    list2.push(list[i]);
                }
            }
            return {
                monthexpense,
                monthincome,
                list2
            };
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    }
}