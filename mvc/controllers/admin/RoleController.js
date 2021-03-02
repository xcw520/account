const Power = require('../../model/admin/Power/Power');
const Role = require('../../model/admin/Role/Role');
const RoleToPower = require('../../model/admin/RoleToPower/RoleToPower');
const RolePower = require('../../model/admin/RolePower/RolePower');
module.exports = {
    async get_role(req, res, next) {
        let data = await Role.getAllRole(req);
        res.render('role/allrole', {
            data: data
        });
    },
    async get_addrole(req, res, next) {
        let data = await Power.getAllPower(req);
        res.render('role/addrole', {
            data: data
        });
    },
    async post_addrole(req, res, next) {
        let rid = await Role.addrole(req);
        let result2 = await RoleToPower.add(req, rid);
        res.send(result2);
    },
    /**
     * 删除角色
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_delete(req, res, next) {
        let delresult1 = await Role.deleterole(req);
        let delresult2 = await RoleToPower.deletepower(req);
        if (delresult1.code == 200 && delresult2.code == 200)
            res.send({
                code: 200,
                msg: 'ok'
            })
    },
    async get_changerole(req, res, next) {
        let data = await Power.getAllPower(req);
        let result = await RolePower.getRoleAndPower(req);
        res.render('role/changerole', {
            data: data,
            data2: result
        })
    },
    async post_changerole(req, res, next) {
        let rid = req.body.rid;
        let result = await Role.changerole(req);
        let delresult = await RoleToPower.deletepower(req, rid);
        let result2 = await RoleToPower.add(req, rid);
        if (result.code == 200 && result2.code == 200 && delresult.code==200) {
            res.send({
                code: 200,
                msg: 'ok'
            })
        }
    }
}