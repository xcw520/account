const db2 = require('../../../libs/db2');
const mypath = require('path');
const getTableName = require('../../../untils/getTableName');
const congfig = require('../../../congfig');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));
module.exports = {
    /**
     * 获取所有角色
     */
    async getAllRole(req) {
        try {
            let result = await db2.select(tablename, ['*'], `role_id IS NOT NULL`);
            return result;
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 添加角色信息
     * @param {*} req 
     */
    async addrole(req) {
        try {
            let result = await db2.add(tablename, { role_name: req.body.role_name });
            await db2.add(congfig.other.table, { b_type: '增加', b_name: '添加角色', admin_id: req.session.admin.admin_id, admin_name: req.session.admin.uname, b_time: new Date().getTime() });
            return result.insertId;
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 删除的角色
     * @param {*} req 
     */
    async deleterole(req) {
        try {
            let deleteid = req.query.id;//删除的id
            await db2.delete(tablename, [{ 'role_id': deleteid }]);
            await db2.add(congfig.other.table, { b_type: '删除', b_name: '删除角色', admin_id: req.session.admin.admin_id, admin_name: req.session.admin.uname, b_time: new Date().getTime() });
            return {
                code: 200,
                msg: '角色删除成功'
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 修改角色信息
     * @param {*} req 
     */
    async changerole(req) {
        try {
            let rid = req.body.rid;
            await db2.save(tablename, { 'role_name': req.body.role_name }, [{ 'role_id': rid }]);
            await db2.add(congfig.other.table, { b_type: '修改', b_name: '修改角色', admin_id: req.session.admin.admin_id, admin_name: req.session.admin.uname, b_time: new Date().getTime() });
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