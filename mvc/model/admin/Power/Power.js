const db2 = require('../../../libs/db2');
const getTableName = require('../../../untils/getTableName');
const mypath = require('path');
const congfig = require('../../../congfig');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));
module.exports = {
    /**
     * 获取所有权限
     * @param {*} req 
     */
    async getAllPower(req) {
        try {
            async function getDate(parentId) {
                let arr = [];
                let result = await db2.select(tablename, ['power_name', 'power_id', 'power_parent_id'], [{ 'power_parent_id': parentId }]);
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
     * 添加权限
     * @param {*} req 
     */
    async addPower(req) {
        try {
            let power1 = req.body.power1;
            let power2 = req.body.power2;
            let powername = req.body.power_name;
            let powerca = '/' + req.body.power_c_a;
            let flag = req.body.flag;
            let pid = power1;
            if (power2 != 0) pid = power2;
            if (!power1 || !power2 || !powername || !powerca || !flag) {
                return {
                    code: 401,
                    msg: '信息不能为空'
                }
            }
            let result = await db2.add(tablename, {
                'power_name': powername,
                'power_c_a': powerca,
                'power_flag': flag,
                'power_parent_id': pid
            });
            if (result.insertId > 0) {
                await db2.add('ac_role_to_power', {
                    'role_id': req.session.admin.role_id,
                    'power_id': result.insertId
                })
            }
            await db2.add(congfig.other.table, { b_type: '增加', b_name: '添加权限', admin_id: req.session.admin.admin_id, admin_name: req.session.admin.uname, b_time: new Date().getTime() });
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
     * 删除权限
     * @param {*} req 
     */
    async deletePower(req) {
        try {
            let deleteid = req.query.del;//要删除的权限id
            let list = [];
            async function getDate(parentId) {
                let result = await db2.select(tablename, ['power_id'], [{ 'power_parent_id': parentId }]);
                if (result[0] && result.length > 0) {
                    for (let j = 0; j < result.length; j++) {
                        list[list.length] = result[j].power_id;
                    }
                }
                for (let i = 0; i < result.length; i++) {
                    await getDate(result[i].power_id);
                };
                return;
            }
            await getDate(deleteid);
            let sql = `DELETE FROM ${tablename} WHERE power_id=${deleteid}`;
            if (list.length > 0) {
                sql = `DELETE FROM ${tablename} WHERE power_id IN (${list.join(',')})`;
            }
            await db2.query(sql, []);
            await db2.query(`DELETE FROM ${tablename} WHERE power_id=${deleteid}`, []);
            await db2.add(congfig.other.table, { b_type: '删除', b_name: '删除权限', admin_id: req.session.admin.admin_id, admin_name: req.session.admin.uname, b_time: new Date().getTime() });
            return {
                code: 200,
                msg: '权限删除成功'
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 获取下拉框中的权限信息
     * @param {*} req 
     */
    async getPower(req) {
        try {
            let id = req.query.powerid;
            let result = await db2.select(tablename, ['*'], [{ 'power_id': id }]);
            result[0].power_c_a = result[0].power_c_a.slice(result[0].power_c_a.indexOf('/') + 1);
            let arr = [];
            arr['power_name'] = result[0].power_name;
            arr['power_c_a'] = result[0].power_c_a;
            arr['power_flag'] = result[0].power_flag;
            arr['power_id'] = id * 1;
            if (result[0].power_parent_id == 0) {
                arr['power1'] = 0;//一级下拉框
                arr['power2'] = 0;//二级下拉框
            } else {
                let parent = await db2.select(tablename, ['*'], [{ 'power_id': result[0].power_parent_id }]);
                if (parent[0].power_parent_id == 0) {
                    arr['power1'] = parent[0].power_id;
                    arr['power2'] = 0;
                } else {
                    let parent2 = await db2.select(tablename, ['*'], [{ 'power_id': parent[0].power_parent_id }]);
                    arr['power1'] = parent2[0].power_id;
                    arr['power2'] = parent[0].power_id;
                }
            }
            return arr;
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 修改权限
     */
    async changepower(req) {
        try {
            let powername = req.body.power_name;//权限名称
            let powerca = '/' + req.body.power_c_a;//c/a
            let flag = req.body.flag;//是否显示在菜单
            let power_id = req.body.powerid;//权限id
            let pid = req.body.power1;//父级ida
            if (req.body.power2 != 0) {
                pid = req.body.power2;
            }
            await db2.save(tablename, {
                'power_name': powername,
                'power_c_a': powerca,
                'power_flag': flag,
                'power_parent_id': pid
            },
                [
                    {
                        'power_id': power_id
                    }
                ])
                await db2.add(congfig.other.table, { b_type: '修改', b_name: '修改权限', admin_id: req.session.admin.admin_id, admin_name: req.session.admin.uname, b_time: new Date().getTime() });
            return {
                code: 200,
                msg: '权限修改成功'
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    }
}