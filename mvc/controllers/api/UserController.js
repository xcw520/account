const userinfo = require('../../model/api/UserUserInfo/UserUserInfo');
const user = require('../../model/api/User/User');
const uinfo = require('../../model/api/UserInfo/UserInfo');
const newtoken = require('../../libs/newtoken');
let md5 = require('../../libs/md5');

module.exports = {
    /**
     * @api {post} user/login 登录
     * @apiDescription 移动端登录接口
     * @apiName login
     * @apiGroup User
     * @apiParam {string} uname 用户名
     * @apiParam {string} upass 密码
     * @apiSuccess {number} code 状态码
     * @apiSuccess {string} msg 描述
     * @apiSuccess {json} data 数据
     * @apiSuccessExample {json} Success-Response:
     * {
     *      "code": 200,
     *      "msg": "ok",
     *      "data": {
     *          "token": "jhkdsfkjsdhgifhdfuhgjkdfhgkfdjghksdfhg"
     *      }
     * }
     * @apiErrorExample {json} Error-Response:
     * {
     *      "code": 404,
     *      "msg": "用户名不存在"
     * }
     * {
     *      "code": 403,
     *      "msg": "密码错误"
     * }
     * @apiSampleRequest http://api.node.com:3000/user/login
     * @apiVersion 1.0.0
     */
    async post_login(req, res, next) {
        let result = await userinfo.login(req);
        res.send(result);
    },



    /**
     * @api {get} user/captcha 获取验证码
     * @apiDescription 移动端获取验证码接口
     * @apiName Captcha
     * @apiGroup User
     * @apiParam {string} phone 手机号
     * @apiSuccess {number} code 状态码
     * @apiSuccess {string} msg 描述
     * @apiSuccess {json} data 数据(经过md5加密的验证码)
     * @apiSuccessExample {json} Success-Response:
     * {
     *      "code": 200,
     *      "msg": "ok",
     *      "data": {
     *          "captcha": "jhkdsfkjsdhgifhdfuhgjkdfhgkfdjghksdfhg"
     *      }
     * }
     * @apiErrorExample {json} Error-Response:
     * {
     *      "code": 401,
     *      "msg": "格式不正确"
     * }
     * @apiSampleRequest http://api.node.com:3000/user/captcha
     * @apiVersion 1.0.0
     */
    async get_captcha(req, res, next) {
        let result = await userinfo.captcha(req);
        res.send(result);
    },



    /**
     * @api {post} user/logup 注册
     * @apiDescription 移动端注册接口
     * @apiName Logup
     * @apiGroup User
     * @apiParam {string} uname 用户名
     * @apiParam {string} upass 密码
     * @apiParam {string} checkpass 确认密码
     * @apiParam {string} phone 手机号
     * @apiSuccess {number} code 状态码
     * @apiSuccess {string} msg 描述
     * @apiSuccess {json} data 数据
     * @apiSuccessExample {json} Success-Response:
     * {
     *      "code": 200,
     *      "msg": "ok",
     *      "data": {
     *          "token": "jhkdsfkjsdhgifhdfuhgjkdfhgkfdjghksdfhg"
     *      }
     * }
     * @apiErrorExample {json} Error-Response:
     * {
     *      "code": 402,
     *       "msg": "数据为空"
     * }
     * {
     *      "code": 401,
     *      "msg": "格式不正确"
     * }    
     * {
     *      "code": 405,
     *      "msg": "用户已存在"
     * }
     * {
     *      "code": 403,
     *      "msg": "密码不正确"
     * }
     * @apiSampleRequest http://api.node.com:3000/user/logup
     * @apiVersion 1.0.0
     */ 
    async post_logup(req, res, next) {
        let result = await user.save(req.body.uname, req.body.upass, req.body.checkpass);
        if (result.code == 200) {
            let result2 = await uinfo.save(req.body.phone, result.uid);
            if (result2.code == 200) {
                let date = req.user;
                date.username = result.uname;
                date.uid = result.uid;
                delete date.iat;
                delete date.exp;
                let token = await newtoken(date);
                res.send({
                    code: 200,
                    msg: 'ok',
                    data: {
                        token: token
                    }
                })
            } else {
                res.send(result2);
            }
        } else {
            res.send(result);
        }
    },



    /**
     * @api {post} user/changepass 修改密码
     * @apiDescription 移动端修改密码接口
     * @apiName Changepass
     * @apiGroup User
     * @apiParam {string} upass 旧密码
     * @apiParam {string} newupass 新密码
     * @apiParam {string} checkpass 确认密码
     * @apiSuccess {number} code 状态码
     * @apiSuccess {string} msg 描述
     * @apiSuccessExample {json} Success-Response:
     * {
     *      "code": 200,
     *      "msg": "ok"
     * }
     * @apiErrorExample {json} Error-Response:   
     * {
     *      "code": 404,
     *      "msg": "用户不存在"
     * }
     * {
     *      "code": 403,
     *      "msg": "密码不正确"
     * }
     * @apiSampleRequest http://api.node.com:3000/user/changepass
     * @apiVersion 1.0.0
     */
    async post_changepass(req, res) {
        let uid = req.user.uid;
        let result = await user.change(uid, req);
        res.send(result);
    },



    /**
    * @api {get} user/getinfo 获取用户详细资料
    * @apiDescription 移动端获取用户资料接口
    * @apiName Getinfo
    * @apiGroup User
    * @apiSuccess {number} code 状态码
    * @apiSuccess {string} msg 描述
    * @apiSuccess {json} data 数据
    * @apiSuccess {string} nickname 头像路径
    * @apiSuccess {string} tittleName 显示在资料卡上部Hello 后面的名称
    * @apiSuccess {string} attar 头像路径
    * @apiSuccess {number} sex 性别 0为男 1为女
    * @apiSuccess {string} birthday 生日为时间戳
    * @apiSuccess {number} phone 手机号
    * @apiSuccess {string} email 邮箱
    * @apiSuccessExample {json} Success-Response:
    * {
    *      "code": 200,
    *      "msg": "ok"
    *      "data": {
    *          "tittleName": "admin", 
    *          "nickname": "lc",
    *          "attar": "public/1.jpg",
    *          "sex": 0,
    *          "birthday": "18054354558",
    *          "phone": 18046290376,
    *          "email": "1042440753@qq.com"
    *      }
    * }
    * @apiErrorExample {json} Error-Response:   
    * {
    *      "code": 404,
    *      "msg": "用户不存在"
    * }
    * @apiSampleRequest http://api.node.com:3000/user/getinfo
    * @apiVersion 1.0.0
    */
    async get_getinfo(req, res) {
        let uid = req.user.uid;
        let result = await userinfo.getinfo(uid);
        res.send(result);
    },

    /**
    * @api {post} user/changeinfo 上传个人信息的头像
    * @apiDescription 移动端上传个人信息的头像接口
    * @apiName Changeinfo
    * @apiGroup User
    * @apiParam {file} files.file 图片文件
    * @apiSuccess {number} code 状态码
    * @apiSuccess {string} msg 描述
    * @apiSuccess {json} data 数据
    * @apiSuccess {string} url 头像路径
    * @apiSuccessExample {json} Success-Response:
    * {
    *      "code": 200,
    *      "msg": "ok"
    *      "data": {
    *          "url": "public/1.jpg","
    *      }
    * }
    * @apiErrorExample {json} Error-Response:   
    * {
    *      "code": 404,
    *      "msg": "用户不存在"
    * }
    * @apiSampleRequest http://api.node.com:3000/user/changeinfo 
    * @apiVersion 1.0.0
    */
    async post_changeinfo(req, res) {
        let filename = req.user.uid + req.user.username + Math.random();
        let result = await uinfo.createImg(req, md5(filename));
        res.send(result);
    },


    /**
    * @api {post} user/setinfo 上传个人信息
    * @apiDescription 移动端上传个人信息接口
    * @apiName Setinfo
    * @apiGroup User
    * @apiParam {string}  nickname 昵称
    * @apiParam {number}  sex 性别（0为男，1为女）
    * @apiParam {string} birthday 生日（时间戳）
    * @apiParam {string} phone 手机
    * @apiParam {string} email 邮箱
    * @apiParam {string} attar 头像名称
    * @apiSuccess {number} code 状态码
    * @apiSuccess {string} msg 描述
    * @apiSuccessExample {json} Success-Response:
    * {
    *      "code": 200,
    *      "msg": "ok"
    * }
    * @apiErrorExample {json} Error-Response:   
    * {
    *      "code": 404,
    *      "msg": "文件未找到"
    * }
    * @apiSampleRequest http://api.node.com:3000/user/changeinfo 
    * @apiVersion 1.0.0
    */
    async post_setinfo(req, res) {
        let result = await uinfo.changeinfo(req, req.user.uid);
        res.send(result);
    }
}