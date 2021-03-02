 //Demo
 layui.use(['form', 'element'], function (date) {
    var form = layui.form();
    form.render();
    //监听提交
    form.on('submit(adminPassword)', function (data) {
        ajax('/index/add', 'POST', data.field)
            .then(
                res => {
                    layer.msg(res.msg);
                }
            )
        return false;
    });
});