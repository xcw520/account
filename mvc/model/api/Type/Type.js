const db2 = require('../../../libs/db2');
const mypath = require('path');
const getTableName = require('../../../untils/getTableName');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));

module.exports = {
    async getTpye(req) {
        try {
            let kind = req.query.tid;
            let result = await db2.select(tablename, ['t_name'], `t_kind = ${kind} ORDER BY t_order`);
            if (!result[0]) {
                return {
                    code: 404,
                    msg: '分类不存在'
                }
            }
            let list = [];
            result.forEach(item => {
                list.push(item.t_name);
            })
            return {
                code: 200,
                msg: 'ok',
                data: {
                    type: list
                }
            };
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }

    },
    async addtype(req){
        let tid = req.query.tid;//支出类型
        let typename = req.query.typename;//类型名称
        let checktypename  = await db2.select(tablename, ['t_name']);
        for (let i=0; i<checktypename.length; i++){
            if(checktypename[i].t_name == typename) {
                return {
                    code:406,
                    msg:"类别已存在"
                }
            }
        }
        let order = await db2.select(tablename, ['t_order'],` t_kind = ${tid} ORDER BY t_order DESC LIMIT 1` );
        order = order[0].t_order + 1;
        let result = await db2.add(tablename,{'t_name':typename, 't_kind':tid, 't_order':order});
        if(result.affectedRows > 0){
            return {
                code:200,
                msg:'ok'
            }
        } else {
            return {
                code:500,
                msg:'error'
            }
        }
        
    },
    async deltype(req){
        let delid = req.query.tid;
        let delname = req.query.typename;
        let result = await db2.delete(tablename, [{'t_name':delname},{'t_kind':delid}]);
        if(result.affectedRows > 0) {
            return {
                code:200,
                msg:'ok'
            }
        } else {
            return {
                code:500,
                msg:'未找到要删除的目标'
            }
        }
    }
}