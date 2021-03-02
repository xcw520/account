const db2 = require('../../../libs/db2');
const getTableName = require('../../../untils/getTableName');
const mypath = require('path');
const config = require('../../../congfig');
const Type = require('../type/Type');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));
module.exports = {
    /**
     * 账单的数量
     * @param {*} req 
     */
    async money_count(req) {
        try {
            let result = await db2.find(tablename, ['count(m_id) AS count'], [{}]);
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