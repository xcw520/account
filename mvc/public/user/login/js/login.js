//提交按钮
ajax('/user/getCaptcha', 'GET')
.then(
    res => {
        if (res.code == 200) {
            document.querySelector('.captchaBox').innerHTML = '';
            res.img = res.img.slice(0, res.img.indexOf(' ')) + ' class="captcha" ' + res.img.slice(res.img.indexOf(' ') + 1);
            document.querySelector('.captchaBox').innerHTML = res.img;
        }
    }
)
document.onclick = function (e) {
if (e.target.getAttribute('class') == 'captcha') {
    ajax('/user/getCaptcha', 'GET')
        .then(
            res => { 
                if (res.code == 200) {
                    document.querySelector('.captchaBox').innerHTML = '';
                    res.img = res.img.slice(0, res.img.indexOf(' ')) + ' class="captcha" ' + res.img.slice(res.img.indexOf(' ') + 1);
                    document.querySelector('.captchaBox').innerHTML = res.img;
                }
            }
        )
}

}
layui.use(['form', 'layedit', 'laydate'], function () {
document.getElementById('enter').onclick = function () {
    let uname = document.getElementById('uname').value;//用户名
    let upassword = document.getElementById('upassword').value;//密码
    let verity = document.getElementById('verity').value;//验证码
    if (uname!="" && upassword!="" && verity!="") {
        ajax('/user/login', 'POST', {
            uname: uname,
            upassword: upassword,
            verity: verity
        })
            .then(
                res => {
                    console.log(res);
                    if (res.code == 200) {
                        location.href = '/index/index';
                    } else {
                        layer.alert(res.msg, {
                            title: '错误信息'
                        })
                    }
                },
                err => {
    
                }
            )
    } 
}
});