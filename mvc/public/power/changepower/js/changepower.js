let powerid = window.location.href.slice(window.location.href.lastIndexOf('=') + 1);//权限的id
		//Demo
		layui.use(['form'], function () {
			var form = layui.form();
			form.render();
			//监听提交
			form.on('submit(formDemo)', function (data) {
				data.field['powerid']=powerid;
				ajax('/power/changepower', 'POST', data.field)
					.then(
						res => {
							if (res.code == 200) {
								location.href = '/power/power';
							}
						}
					)
				return false;
			});
			form.on('select(first)', function (data) {
				let id = data.value;
				ajax(`/power/secondMenu?id=${id}`, 'GET')
					.then(
						res => {
							document.querySelector('#secondMenu').innerHTML = '<option value="0">请选择</option>';
							res.forEach(item => {
								document.querySelector('#secondMenu').innerHTML += `<option value=${item.power_id}>${item.power_name}</option>`
							});
							form.render();
						}
					)
			});
		});
