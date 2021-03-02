layui.use(['form', 'jquery', 'layer', 'dialog'], function() {
    var $ = layui.jquery;

    //修改状态
    $('#table-list').on('click', '.table-list-status', function() {
        var That = $(this);
        var status = That.attr('data-status');
        var id = That.parent().attr('data-id');
        if(status == 1) {
            That.removeClass('layui-btn-normal').addClass('layui-btn-warm').html('隐藏').attr('data-status', 2);
        } else if(status == 2) {
            That.removeClass('layui-btn-warm').addClass('layui-btn-normal').html('显示').attr('data-status', 1);

        }
    })

});