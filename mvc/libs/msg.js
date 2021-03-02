/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */
const md5 = require('../libs/md5')
const SMSClient = require('@alicloud/sms-sdk')
const config = require('../congfig/msg')

module.exports = function (code, ipnum) {

    // ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
    const accessKeyId = config.accessKeyId
    const secretAccessKey = config.secretAccessKey
    return new Promise((resolve, reject) => {
        //初始化sms_client
        let smsClient = new SMSClient({ accessKeyId, secretAccessKey })
        //发送短信
        smsClient.sendSMS({
            PhoneNumbers: ipnum,
            SignName: 'ABC商城',
            TemplateCode: 'SMS_206390192',
            TemplateParam: `{\"code\":${code}}`
        }).then(function (res) {
            let { Code } = res
            if (Code === 'OK') {
                //处理返回参数
                resolve({
                    code: 200,
                    msg: 'ok',
                    data: {
                        captcha: md5(code)
                    }
                });
            }
        }, function (err) {
            reject(err);
        })
    })

}
