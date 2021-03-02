const db2 = require('../../../libs/db2');
const getTableName = require('../../../untils/getTableName');
const mypath = require('path');
const congfig = require('../../../congfig');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));
module.exports = {
    /**
     * 删除用户
     * @param {*} req 
     */
    async deluser(req) {
        try {
            let deleteid = req.query.del;//要删除的用户id
            await db2.delete(tablename, [{ 'u_id': deleteid }]);
            await db2.add(congfig.other.table, { b_type: '删除', b_name: '删除用户', admin_id: req.session.admin.admin_id, admin_name: req.session.admin.uname, b_time: new Date().getTime() });
            return {
                code: 200,
                msg: '用户表删除成功'
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 修改用户的屏蔽状态
     * @param {*} req 
     */
    async refuseuser(req) {
        try {
            let uid = req.query.uid;//要屏蔽的用户id
            let allowed = req.query.allowed;//屏蔽状态;
            await db2.save(tablename, { 'u_allowed': allowed }, [{ 'u_id': uid }]);
            await db2.add(congfig.other.table, { b_type: '修改', b_name: '修改用户的屏蔽状态', admin_id: req.session.admin.admin_id, admin_name: req.session.admin.uname, b_time: new Date().getTime() });
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
     * 用户数量
     * @param {*} req 
     */
    async user_num(req, starttime = "", endtime = "") {
        try {
            let result = "";
            if (starttime != "" && endtime != "") {
                result = await db2.find(tablename, ['count(u_id) AS count'], `u_last_entertime BETWEEN ${starttime} AND ${endtime}`);
            } else {
                result = await db2.find(tablename, ['count(u_id) AS count'], [{}]);
            }
            return {
                result: result[0].count
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    }
}