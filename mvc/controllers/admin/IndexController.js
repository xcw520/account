const UserMsg = require('../../model/admin/Admin/Admin');
const PowerModel = require('../../model/admin/RolePower/RolePower');
const Role = require('../../model/admin/Role/Role');
const Admin = require('../../model/admin/Admin/Admin');
const Money = require('../../model/admin/money/Money');
const User = require('../../model/admin/UserApp/User');
module.exports = {
    /**
     * 进入首页
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_index(req, res, next) {
        let result = await this.get_getList(req);
        res.render('index/index', {
            menu: result,
            uname: req.session.admin.uname
        });
    },
    /**
     * 后台主页模板
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_welcome(req, res, next) {
        let admiNum = await Admin.admin_num(req);
        let moneyNum = await Money.money_count(req);
        let UserNum = await User.user_num(req);
        let obj = require('../../untils/getTime')();
        let dayactive = await User.user_num(req,obj.daytimeStart,obj.daytimeEnd); //日活
        let weekactive = await User.user_num(req,obj.weektimeStart,obj.weektimeEnd); //周活
        let monthactive = await User.user_num(req,obj.monthtimeStart,obj.monthtimeEnd); //月活
        res.render('index/welcome',{
            admiNum:admiNum.result,
            moneyNum:moneyNum.result,
            UserNum:UserNum.result,
            dayactive:dayactive.result,
            weekactive:weekactive.result,
            monthactive:monthactive.result
        });
    },
    /**
     * 管理员信息管理页
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_msg(req, res, next) {
        let data = await UserMsg.person_msg(req);
        res.render('index/admin_msg', {
            data: data
        })
    },
    /**
     * 管理员修改信息
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async post_msg(req, res, next) {
        let newdata = await UserMsg.acquire_msg(req, res, next);
        res.send(newdata);
    },
    /**
     * 用户退出
     * @param {*} req 
     * @param {*} res 
     */
    get_logout(req, res) {
        req.session.destroy();
        res.redirect('/user/login');
    },
    /**
     * 获取左侧菜单栏数据
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_getList(req, res, next) {
        let result = await PowerModel.getMenu(req);
        return (result);
    },
    /**
     * 进入添加管理员页面
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async get_add(req, res, next){
        let data = await Role.getAllRole(req);
        res.render('index/addadmin',{
            data:data
        });
    },
    /**
     * 提交添加管理员的信息
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async post_add(req, res, next) {
        let result = await Admin.add(req); 
        res.send(result);
    }
}