let UserLogin = require('../../model/admin/Admin/Admin');
const getCaptcha = require('../../untils/getCaptcha');
module.exports = {
    /**
     * 登入的首页
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    get_login(req, res, next) {
        res.render('user/login');
    },
    /**
     * 登入页面的验证码
     * @param {*} req 
     * @param {*} res 
     */
    get_getCaptcha(req, res) {
        let captcha = getCaptcha(req);
        res.send({
            code: 200,
            msg: 'ok',
            img: captcha.img
        });
    },
    /**
     * 检验用户名信息
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async post_login(req, res, next) {
        let data = await UserLogin.check(req);
        res.send(data);
    }
}