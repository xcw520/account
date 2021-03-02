const db2 = require('../../../libs/db2');
const getTableName = require('../../../untils/getTableName');
const mypath = require('path');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));
module.exports = {
    /**
     * 获取菜单信息
     * @param {*} req 
     */
    async getMenu(req) {
        try {
            let result = await db2.select(tablename, ['power_id', 'power_name', 'power_flag', 'power_c_a'], [{ 'role_id': req.session.admin.role_id }, { 'power_parent_id': 0 }, { 'power_flag': 1 }])
            let menuList = new Array();
            if (result[0]) {
                for (let i = 0; i < result.length; i++) {
                    let childresult = await db2.select(tablename, ['power_id', 'power_name', 'power_flag', 'power_c_a'], [{ 'role_id': req.session.admin.role_id }, { 'power_parent_id': result[i].power_id }, { 'power_flag': 1 }])
                    if (childresult[0]) {
                        for (let i = 0; i < childresult.length; i++) {
                            if (childresult[i].power_flag != 1) {
                                delete childresult[i];
                            } else {
                                childresult[i] = {
                                    id: childresult[i].power_id,
                                    name: childresult[i].power_name,
                                    ca: childresult[i].power_c_a
                                }
                            }
                        }
                    }
                    if (result[i].power_flag == 1) {
                        menuList.push({
                            power: {
                                id: result[i].power_id,
                                name: result[i].power_name,
                                ca: result[i].power_c_a
                            },
                            child: childresult
                        })
                    }
                }
            }
            return menuList;
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 获取当前角色的全部权限
     * @param {*} req 
     */
    async getRolePower(req) {
        try {
            let roleId = req.session.admin.role_id;
            async function getDate(parentId) {
                let arr = [];
                let result = await db2.select(tablename, ['power_name', 'power_id', 'power_parent_id'], [{ 'role_id': roleId }, { 'power_parent_id': parentId }]);
                for (let i = 0; i < result.length; i++) {
                    let child = await getDate(result[i].power_id);
                    arr.push({
                        id: result[i].power_id,
                        name: result[i].power_name,
                        child: child
                    });
                };
                return arr;
            }
            let power = await getDate(0);
            return power;
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 获取二级权限下拉框信息
     * @param {*} req 
     * @param {*} powerid//一级权限id 
     */
    async getSelect(req, powerid = '') {
        try {
            let pid = 0;
            if (req.query && req.query.id != 'undefined') {
                pid = req.query.id
            }
            if (powerid != '') pid = powerid;
            let result = await db2.select(tablename, ['power_name', 'power_id'], [{ 'power_parent_id': pid }, { 'role_id': req.session.admin.role_id }]);
            return result;
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 获取角色和权限
     * @param {*} req 
     */
    async getRoleAndPower(req) {
        try {
            let rid = req.query.id;
            let rolename = await db2.find(tablename, ['role_name'], [{ 'role_id': rid }]);
            let power = await db2.select(tablename, ['power_id'], [{ 'role_id': rid }]);
            let arr = [];
            power.forEach(item => {
                arr[arr.length] = item.power_id;
            })
            let result = {
                name: rolename[0].role_name,
                power: arr
            }
            return result;
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    }
}