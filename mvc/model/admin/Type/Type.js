const db2 = require('../../../libs/db2');
const getTableName = require('../../../untils/getTableName');
const mypath = require('path');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));
module.exports = {
    /**
     * 获取账单分类的下拉框信息
     * @param {*} req 
     */
    async getAllSelect(req) {
        try {
            let result = await db2.select(tablename, ['t_id', 't_name'], {});
            return result;
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },
    /**
     * 获取账单分类名称
     * @param {*} req 
     */
    async getAll(req) {
        try {
            let result = await db2.select(tablename, ['t_name'], {});
            return result;
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    }
}