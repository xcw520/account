const dataMsg = require('../../../congfig/citymsg');
module.exports = {
    cityweather(req) {
        try {
            let city = req.query.city;
            let cityid = 0;
            city = city.slice(0, city.lastIndexOf('市'));
            for (let x in dataMsg.result.datas) {
                if (city == dataMsg.result.datas[x].citynm) {
                    cityid = dataMsg.result.datas[x].cityid;//对应城市ID             
                }
            }
            if (cityid) {
                return {
                    code: 200,
                    msg: 'ok',
                    data: {
                        cityid: cityid
                    }
                }
            } else {
                return {
                    code: 504,
                    msg: '定位失败',

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