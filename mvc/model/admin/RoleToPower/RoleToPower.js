const db2 = require('../../../libs/db2');
const mypath = require('path');
const getTableName = require('../../../untils/getTableName');
const congfig = require('../../../congfig');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));
module.exports = {
    /**
     * 添加角色与权限过渡表的信息
     * @param {*} req 
     * @param {*} rid //角色id
     */
    async add(req, rid = "") {
        try {
            if (rid != '') {
                let arr = req.body.power.split(',');
                arr.forEach(async e => {
                    await db2.add(tablename, { role_id: rid, power_id: e });
                });
            }
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
     * 删除角色与权限过渡表的信息
     * @param {*} req 
     * @param {*} rid //角色id
     */
    async deletepower(req, rid = '') {
        try {
            let deleteid = '';
            if (rid != '') {
                deleteid = rid;//要删除的id
            } else {
                deleteid = req.query.id;
            }
            await db2.delete(tablename, [{ 'role_id': deleteid }]);
            return {
                code: 200,
                msg: '删除成功'
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    }
}