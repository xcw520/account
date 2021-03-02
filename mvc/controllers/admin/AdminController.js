const AdminRole = require('../../model/admin/AdminRole/AdminRole');
const Admin = require('../../model/admin/Admin/Admin');
module.exports = {
    /**
     * 进入管理员列表页
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_adminlist(req, res, next){
        let result = await AdminRole.alladmin(req);
        res.render('admin/adminlist',{
            result:result
        });
    },
    /**
     * 删除管理员
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_delete(req, res, next){
        let result = await Admin.delete(req);
        if (result.code == 200){
            res.redirect('/admin/adminlist');
        }
    }
}