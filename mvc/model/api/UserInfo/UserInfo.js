const db2 = require('../../../libs/db2');
const mypath = require('path');
const getTableName = require('../../../untils/getTableName');
let xiegang = mypath.sep;
let tablename = getTableName(__filename.slice(__filename.lastIndexOf(xiegang) + 1));
const fs = require('fs');


module.exports = {
    /**
     * 储存手机号
     * @param {string} phone 
     * @param {string} uid 
     */
    async save(phone, uid) {
        try {
            let regexp = /^1[3-9][0-9]{9}$/;
            if (phone && !regexp.test(phone)) {
                return {
                    code: 401,
                    msg: '格式不正确'
                }
            }
            let user = await db2.find('ac_user_user_info', ['u_id'], `u_name='${phone}' OR u_phone='${phone}'`);
            if (user[0]) {
                return {
                    code: 405,
                    msg: '手机已存在'
                }
            }
            let result = await db2.add(tablename, { u_id: uid, u_phone: phone });
            if (result.affectedRows > 0) {
                return {
                    code: 200
                }
            }
        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }

    },

    async createImg(req, filename) {
        try {
            let files = req.files.file;
            if (!fs.existsSync(`./public/upload/${req.user.uid}`) || !fs.statSync(`./public/upload/${req.user.uid}`).isDirectory()) {
                fs.mkdirSync(`./public/upload/${req.user.uid}`, 0777);
            }
            let path = `./public/upload/${req.user.uid}/${filename}` + files.name.slice(files.name.lastIndexOf('.'));
            fs.createReadStream(files.path).pipe(fs.createWriteStream(path));
            if (filename) {
                return {
                    code: 200,
                    msg: 'ok',
                    data: {
                        url: req.user.uid + '/' + filename + files.name.slice(files.name.lastIndexOf('.'))
                    }
                };
            } else {
                return {
                    code: 200,
                    msg: 'ok',
                    data: {
                        url: ''
                    }
                };
            }

        } catch (err) {
            return {
                code: 500,
                msg: err
            }
        }
    },


    async changeinfo(req, uid) {
        try {
            let attar = '';
            if (!fs.existsSync(`./public/upload/${uid}`)) {
                return {
                    code: 404,
                    msg: '文件未找到'
                }
            }
            let files = fs.readdirSync(`./public/upload/${uid}`);
            files.forEach(once => {
                if (once != req.body.attar) {
                    fs.unlinkSync(`./public/upload/${uid}/${once}`);
                }
            })
            let url = '';
            if (req.body.attar) url = uid + '/' + req.body.attar;
            let result = await db2.save(tablename, {
                u_nick_name: req.body.nickname,
                u_sex: req.body.sex,
                u_birthday: req.body.birthday,
                u_phone: req.body.phone,
                u_email: req.body.email,
                u_avant_url: url
            }, `u_id='${uid}'`);
            if (result.affectedRows > 0) {
                return {
                    code: 200,
                    msg: 'ok'
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