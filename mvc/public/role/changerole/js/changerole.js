let rid = window.location.href.slice(window.location.href.lastIndexOf('=') + 1);//角色的id
//Demo
layui.use(['form'], function () {
    var form = layui.form();
    form.render();
    form.on('checkbox', function (data) {
        if (data.elem.checked == true) {
            switch ($(data.elem).attr('class')) {
                case 'k2': {
                    $(data.elem).parent().parent().parent().find('.k1').prop("checked", true);
                    form.render();
                    break;
                }
                case 'k3': {
                    $(data.elem).parent().parent().parent().find('.k2').prop("checked", true);
                    $(data.elem).parent().parent().parent().find('.k2').parent().parent().parent().find('.k1').prop("checked", true);
                    form.render();
                    break;
                }
            }
        }
    })
    //监听提交
    form.on('submit(formDemo)', function (data) {
        let str = '';
        document.querySelectorAll('input[name="power"]:checked').forEach(item => {
            str += (str == '') ? item.value : ',' + item.value;
        })
        ajax('/role/changerole', 'POST', {
            rid: rid,
            role_name: data.field.role_name,
            power: str
        })
            .then(
                res => {
                    if (res.code == 200) {
                        window.location.href = '/role/role';
                    }
                }
            )
        return false;
    });
});