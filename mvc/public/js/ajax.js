    //请求ajax
    function ajax(url, method = "GET", data = {}) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            //句柄
            const handle = function () {
                if (xhr.readyState != 4) {
                    return;
                }
                if (xhr.status == 200) {
                    resolve(xhr.response);
                } else {
                    reject('error')
                }
            }
            xhr.open(method, url, true);
            //数据类型
            xhr.responseType = 'json';
            //设置请求头
            let reqdata = [];
            let requestData = '';
            if (method !== 'GET') {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                for (let x in data) {
                    reqdata.push(x + '=' + data[x]);
                }
            }
            if (reqdata.length > 0) {
                requestData = reqdata.join("&");
            }
          
            xhr.send(requestData);
            xhr.onreadystatechange = handle;
        })

    }