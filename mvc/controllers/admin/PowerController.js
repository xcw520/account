const RolePower = require('../../model/admin/RolePower/RolePower');
const Power = require('../../model/admin/Power/Power');
module.exports = {
    /**
     * 进入权限管理
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_power(req, res, next) {
        let data = await Power.getAllPower(req);
        res.render('power/power', {
            data: data
        });
    },
    /**
     * 删除权限
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_delete(req, res, next) {
        let delmsg = await Power.deletePower(req);
        if(delmsg.code == 200) {
            res.redirect('/power/power');
        }
    },
    /**
     * 添加权限
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_addpower(req, res, next) {
        let data = await RolePower.getSelect(req);
        res.render('power/addpower', {
            data: data
        })
    },
    async get_secondMenu(req, res, next) {
        let menu = await RolePower.getSelect(req);
        res.send(menu);
    },
    async post_addpower(req, res, next) {
        let result = await Power.addPower(req);
        res.send(result);
    },
    async get_changepower(req, res, next) {
        let data = await RolePower.getSelect(req);
        let info = await Power.getPower(req);
        let data2 = await RolePower.getSelect(req, info.power1);
        res.render('power/changepower', {
            data: data,
            data2: data2,
            info: info
        });
    },
    async post_changepower(req, res, next){
        let data = await Power.changepower(req);
        res.send(data);
    }
}