const db2 = require('../../../libs/db2');
const getTableName = require('../../../untils/getTableName');
const mypath = require('path');
const md5 = require('../../../libs/md5');
const congfig = require('../../../congfig');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));
module.exports = {
    /**
     * 添加管理员权限
     * @param {*} req 
     */
    async add(req) {
        try {
            let result = await db2.find(tablename, ['admin_id'], `admin_name='${req.body.admin_name}'`);
            if (result[0] && result[0].admin_id) {
                return {
                    code: 403,
                    msg: 'admin名已存在'
                }
            } else {
                await db2.add(tablename, { admin_name: req.body.admin_name, admin_password: md5(req.body.admin_password), admin_role_id: req.body.role_id });
                await db2.add(congfig.other.table, { b_type: '增加', b_name: '添加管理员', admin_id: req.session.admin.admin_id, admin_name: req.session.admin.uname, b_time: new Date().getTime() });
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
    /**
    * 检验用户信息，登录
    * @param {*} req 
    */
    async check(req) {
        try {
            let uname = req.body.uname;//用户名
            let upassword = req.body.upassword;//密码
            let verity = (req.body.verity).toLowerCase();//验证码
            let last_time = Date.now();//登入时间
            let captcha = req.session.captcha;//session里的验证码
            if (verity && captcha != verity) {
                return ({
                    code: 403,
                    msg: '验证码错误'
                })
            }
            //判断账号密码不能为空
            if (!uname || !upassword || !verity) {
                return {
                    code: 401,
                    msg: '信息不能为空'
                }
            }
            //判断用户名是否存在
            let result = await db2.select(tablename, ['admin_id', 'admin_role_id', 'admin_password'], `admin_name='${uname}'`);
            if (!Array.isArray(result) || result.length <= 0) {
                return {
                    code: 401,
                    msg: '用户名不存在'
                }
            }
            //若用户名存在,判断密码是否正确
            if (md5(upassword) != result[0].admin_password) {
                return ({
                    code: 403,
                    msg: '密码错误'
                })
            }
            let admin_id = result[0].admin_id;//管理员id
            let admin_role_id = result[0].admin_role_id;//管理员角色id
            //用户登入时间存入数据库
            await db2.save(tablename, {
                'admin_last_entertime': last_time
            }, `admin_name='${uname}'`)
            //用户登录信息存入session
            req.session.admin = {
                admin_id: admin_id,
                uname: uname,
                role_id: admin_role_id,
                token: last_time
            };
            await db2.add(congfig.other.table, { b_type: '登录', b_name: '管理员登录', admin_id: req.session.admin.admin_id, admin_name: req.session.admin.uname, b_time: new Date().getTime() });
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
    /**
     * 查询登录的个人信息
     * @param {*} req 
     */
    async person_msg(req) {
        try {
            let admin_id = req.session.admin.admin_id;//管理员id
            let uname = req.session.admin.uname;//管理员用户名
            let role_id = req.session.admin.role_id;//角色id
            let token = req.session.admin.token;//登入时间
            let role_name = await db2.find('ac_role', ['role_name'], `role_id='${role_id}'`);
            return {
                admin_id: admin_id,
                uname: uname,
                role_name: role_name[0].role_name,
                token
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 获得管理员修改账号的新信息
     * @param {*} req 
     */
    async acquire_msg(req) {
        try {
            let admin_id = req.session.admin.admin_id;//管理员的id
            let oldpassword = md5(req.body.oldpassword);//旧密码
            let newpassword = md5(req.body.newpassword);//新密码
            let repeatpassword = md5(req.body.repeatpassword);//再次输入的密码
            let result = await db2.select(tablename, ['admin_password'], `admin_id='${admin_id}'`);
            //判断旧密码是否正确
            if (result[0].admin_password != oldpassword) {
                return {
                    code: 403,
                    msg: '原密码错误'
                }
            }
            //判断再次输入的密码和新密码是否一致
            if (newpassword != repeatpassword) {
                return {
                    code: 403,
                    msg: '两次密码输入不一致'
                }
            }
            //新密码存入数据库
            await db2.save(tablename, {
                'admin_password': newpassword
            }, `admin_id='${admin_id}'`);
            await db2.add(congfig.other.table, { b_type: '修改', b_name: '修改管理员账号的新信息', admin_id: req.session.admin.admin_id, admin_name: req.session.admin.uname, b_time: new Date().getTime() });
            return {
                code: 200,
                msg: '修改成功'
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 管理员的数量
     * @param {*} req 
     */
    async admin_num(req) {
        try {
            let result = await db2.find(tablename, ['count(admin_id) AS count'], [{}]);
            return {
                result: result[0].count
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 删除管理员
     * @param {*} req 
     */
    async delete(req) {
        let delid = req.query.del;//删除的管理员id
        await db2.delete(tablename,[{'admin_id':delid}]);
        return {
            code:200,
            msg:'删除管理员成功'
        }
    }
}