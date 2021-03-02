const db2 = require('../../../libs/db2');
const mypath = require('path');
const md5 = require('../../../libs/md5');
const getTableName = require('../../../untils/getTableName');
const newToken = require('../../../libs/newtoken');
const msg = require('../../../libs/msg');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));

module.exports = {
   /**
    * 用户登录
    */
   async login(req) {
      try {
         let date = req.user;
         let uname = req.body.uname;
         let upass = req.body.upass;
         let result = await db2.find(tablename, ['u_id', 'u_allowed', 'u_flag', 'u_password'], `u_name='${uname}' OR u_phone='${uname}'`);
         if (!result[0] || result.length < 0) {
            return {
               code: 404,
               msg: '用户不存在'
            }
         }
         if (result[0].u_password != md5(upass)) {
            return {
               code: 403,
               msg: '密码错误'
            }
         }
         date.username = uname;
         date.uid = result[0].u_id;
         delete date.iat;
         delete date.exp;
         let token = await newToken(date);
         let time = new Date().getTime();
         await db2.save('ac_user', {
            'u_last_entertime': time
         }, `u_id='${result[0].u_id}'`)
         return {
            code: 200,
            msg: 'ok',
            data: {
               token: token,
               flag: true
            }
         }
      } catch (err) {
         return {
            code: 500,
            msg: err
         }
      }
   },
   /**
    * 获取验证码
    */
   async captcha(req, res) {
      // try {
      let regexp = /^1[3-9][0-9]{9}$/;
      let phone = req.query.phone;
      if (phone && !regexp.test(phone)) {
         return {
            code: 401,
            msg: '格式不正确'
         }
      }
      let code6 = '';
      for (var i = 1; i <= 6; i++) {
         let num = Math.floor(Math.random() * 10);
         code6 += num;
      }
      //发送短信 msg(内容,手机)
      // return {
      //    code: 200,
      //    msg: 'ok',
      //    data: {
      //       captcha: md5(code6)
      //    }
      // }
      msg(code6, phone);
      return {
         code: 200,
         msg: 'ok',
         data: {
            captcha: md5(code6)
         }
      }
   },

   /**
     * 获取用户详细信息
     * @param {string} uid 用户id 
     */
   async getinfo(uid) {
      try {
         let tittle = "";
         let result = await db2.find(tablename, ['*'], `u_id='${uid}'`);
         if (!result[0] || result.length < 0) {
            return {
               code: 404,
               msg: '用户不存在'
            }
         }
         tittle = result[0].u_name;
         if (result[0].u_nick_name) {
            tittle = result[0].u_nick_name;
         }
         return {
            code: 200,
            msg: 'ok',
            data: {
               tittleName: tittle,
               nickname: result[0].u_nick_name,
               attar: result[0].u_avant_url,
               sex: result[0].u_sex,
               birthday: result[0].u_birthday,
               phone: result[0].u_phone,
               email: result[0].u_email
            }
         }
      } catch (err) {
         return {
            code: 500,
            msg: err
         }
      }
   }
}