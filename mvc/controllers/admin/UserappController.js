const UserUserInfo = require('../../model/admin/UserUserInfo/UserUserInfo');
const User = require('../../model/admin/UserApp/User');
const UserInfo = require('../../model/admin/UserApp/UserInfo');
module.exports = {
    /**
     * 进入用户列表页
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_list(req, res, next){
        let data = await UserUserInfo.alluser(req);
        res.render('userapp/userlist',{
            data:data.result,
            querystr:data.querystr,
            keyword:data.keyword,
            html:data.html 
        });
    },
    /**
     * 删除用户
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_delete(req, res, next){
        let result1 = await User.deluser(req);
        let result2 = await UserInfo.deluserinfo(req);
        if(result1.code == 200 && result2.code == 200){
            res.redirect('/userapp/list');
        }
    },
    /**
     * 修改用户
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_edit(req, res, next) {
        let data = await UserUserInfo.usermsg(req);
        res.render('userapp/useredit',{
            data:data
        }); 
    },
    /**
     * 删除头像
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_delavatar(req, res, next){
        let result = await UserInfo.delavatar(req);
        res.send(result);
    },
    /**
     * 屏蔽用户
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_refuse(req, res, next){
        let result = await User.refuseuser(req);
        res.send(result);
    }
}