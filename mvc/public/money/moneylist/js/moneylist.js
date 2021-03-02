let date = new Date();
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		let d = date.getDate();
		$("#date").datetime({
			type: "date",
			value: [y, m, d],
			success: function (res) {
				$("#date").val(res.join('-'));
			}
		})
		$("#date2").datetime({
			type: "date",
			value: [y, m, d],
			success: function (res) {
				$("#date2").val(res.join('-'));
			}
		})
		layui.use(['form'], function () {
			var form = layui.form();
			form.render();
			//监听提交
			form.on('submit(search)', function (data) {
				let path = '/money/money?';
				let time1 = new Date(data.field.starttime).getTime();
				let time2 = new Date(data.field.endtime).getTime();
				for (let x in data.field) {
					path += x + '=' + data.field[x] + '&';
				}
				if (time1 * 1 > time2 * 1) {
					layer.msg('起始时间晚于截至时间');
					return false;
				} else {
					ajax(path, 'GET');
				}
			});
		});	