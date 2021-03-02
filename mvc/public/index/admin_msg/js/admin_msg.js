//Demo
console.log(222);
layui.use(['form', 'element'], function () {
    var form = layui.form();
    form.render();
    form.on('submit', function () {
        let oldpassword = document.getElementById('oldpassword').value;//旧密码
        let newpassword = document.getElementById('newpassword').value;//新密码
        let repeatpassword = document.getElementById('repeatpassword').value;//重复输入的密码
        ajax('/index/msg', 'POST', {
            oldpassword: oldpassword,
            newpassword: newpassword,
            repeatpassword: repeatpassword
        })
            .then(
                res => {
                    layer.msg(res.msg);
                }
            )
    });
});    