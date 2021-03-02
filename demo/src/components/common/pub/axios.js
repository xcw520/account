import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://api.lcxcw.club/',
    timeout: 2000,
});

//获取tokey
function getTokey() {
    return new Promise(function (resolve, reject) {
        axios({
            url: 'http://api.lcxcw.club/api/getToken',
            method: 'post',
            data: {
                appid: 'admin',
                secrect: '123456'
            }
        })
            .then(
                res => {
                    console.log(res.data)
                    localStorage.token = res.data;
                    resolve('OK')
                },
                err => {
                    reject(err);
                }
            )
    })
}

//拦截器
instance.interceptors.request.use(
    async config => {
        if (localStorage.token) {
            config.headers.Authorization = `Bearer ${localStorage.token}`;
        } else {
            await getTokey();
            config.headers.Authorization = `Bearer ${localStorage.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
)


function ajax(url, method = 'get', data = {}) {
    return new Promise(function (resolve, reject) {
        let qs = '';
        let params = {}
        if (method.toLowerCase() == 'get') {
            params = data;
        } else {
            for (let x in data) {
                qs += x + '=' + data[x] + '&';
            }
        }
        instance({
            method: method.toLowerCase(),
            url: url,
            params: params,
            data: qs
        })
            .then(
                async res => {
                    if (res.data.code && res.data.code == 401) {
                        localStorage.token = '';
                        return;
                    }
                    if (res.data.code && res.data.code == 402 && res.data.msg == 'jwt expired') {
                        await getTokey();
                        ajax(url, method, data)
                            .then(
                                result => {
                                    resolve(result);
                                }
                            )
                    } else {
                        resolve(res.data);
                    }   
                },
                err => {
                    reject(err)
                }

            )
    })


}

export default ajax;