const db2 = require('../../../libs/db2');
const getTableName = require('../../../untils/getTableName');
const mypath = require('path');
const congfig = require('../../../congfig');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));
module.exports = {
    /**
     * 删除用户详情表数据
     * @param {*} req 
     */
    async deluserinfo(req) {
        try {
            let deleteid = req.query.del;//要删除的用户id
            await db2.delete(tablename, [{ 'u_id': deleteid }]);
            await db2.add(congfig.other.table, { b_type: '删除', b_name: '删除用户详情表数据', admin_id: req.session.admin.admin_id, admin_name: req.session.admin.uname, b_time: new Date().getTime() });
            return {
                code: 200,
                msg: '用户详情表删除成功'
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 删除用户详情表头像数据
     * @param {*} req 
     */
    async delavatar(req) {
        try {
            let delid = req.query.del;//要删除的头像用户id
            await db2.save(tablename, { 'u_avant_url': '' }, [{ 'u_id': delid }]);
            await db2.add(congfig.other.table, { b_type: '删除', b_name: '删除用户详情表头像数据', admin_id: req.session.admin.admin_id, admin_name: req.session.admin.uname, b_time: new Date().getTime() });
            return {
                code: 200,
                msg: '头像删除成功'
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    }
}
