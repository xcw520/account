function del(dom) {
    let id = dom.getAttribute('data-id');
    if (confirm('是否删除') == true) {
        ajax(`/userapp/delavatar?del=${id}`, 'GET')
            .then(
                res => {
                    if (res.code == 200) {
                        window.location.reload();
                    }
                }
            )
    }
}
layui.use(['form', 'jquery', 'layer', 'dialog'], function () {
    var $ = layui.jquery;
    var form = layui.form();
    var laypage = layui.laypage;

    form.on('submit(search)', function (data) {
        let keyword = data.field.keyword;//关键字
        ajax(`/userapp/list?keyword=${keyword}`, 'GET');
    });
    //修改状态
    $('#table-list').on('click', '.table-list-status', function () {
        var That = $(this);
        var status = That.attr('data-status');
        var userid = That.attr('data-id')
        var id = That.parent().attr('data-id');
        ajax(`/userapp/refuse?uid=${userid}&allowed=${1 - status}`, 'GET')
            .then(
                res => {
                    console.log(res);
                }
            )
        if (status == 0) {
            That.removeClass('layui-btn-normal').addClass('layui-btn-warm').html('屏蔽').attr('data-status', 1);
        } else if (status == 1) {
            That.removeClass('layui-btn-warm').addClass('layui-btn-normal').html('未屏蔽').attr('data-status', 0);

        }
    })

});