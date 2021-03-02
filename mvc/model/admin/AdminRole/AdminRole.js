const db2 = require('../../../libs/db2');
const getTableName = require('../../../untils/getTableName');
const mypath = require('path');
const config = require('../../../congfig');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));
module.exports = {
    /**
     * 所有管理员信息
     * @param {*} req 
     */
    async alladmin(req){
        let result = await db2.select(tablename,['*'],[{}]);
        return result;
    }
}