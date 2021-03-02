const db2 = require('../../../libs/db2');
const mypath = require('path');
const md5 = require('../../../libs/md5');
const getTableName = require('../../../untils/getTableName');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));

module.exports = {
    /**
     * 用户注册储存用户名和密码
     * @param {string} name 用户名 
     * @param {string} pass 密码 
     * @param {string} repass 确认密码 
     */
    async save(name, pass, repass) {
        try {
            let user = await db2.find('ac_user_user_info', ['u_id'], `u_name='${name}' OR u_phone='${name}'`);
            if (user[0]) {
                return {
                    code: 405,
                    msg: '用户名已存在'
                }
            }
            if (!name || !pass) {
                return {
                    code: 402,
                    msg: '数据为空'
                }
            }
            if (pass != repass) {
                return {
                    code: 403,
                    msg: '密码不正确'
                }
            }
            let time = new Date().getTime();
            let result = await db2.add(tablename, { u_name: name, u_password: md5(pass), u_reg_time: time, u_last_entertime: time });
            if (result.affectedRows > 0) {
                return {
                    code: 200,
                    uid: result.insertId,
                    uname: name
                }
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }

    },

    /**
     * 修改密码
     * @param {string} uid 用户id 
     * @param {*} req 
     */
    async change(uid, req) {
        try {
            let user = await db2.find('ac_user_user_info', ['u_password'], `u_id='${uid}'`);
            if (!user[0] || user.length < 0) {
                return {
                    code: 404,
                    msg: '用户不存在'
                }
            }
            if (md5(req.body.upass) != user[0].u_password) {
                return {
                    code: 403,
                    msg: '密码错误'
                }
            }
            if (req.body.newupass != req.body.checkpass) {
                return {
                    code: 403,
                    msg: '密码不一致'
                }
            }
            let re = await db2.save(tablename, { 'u_password': md5(req.body.newupass) }, `u_id=${uid}`);
            if (re.affectedRows > 0) {
                return {
                    code: 200,
                    msg: 'ok'
                }
            }
        }catch(err) {
            return {
                code: 500,
                msg: err
            }
        }
    }
}