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
		delmore['onclick'] = function() {
            ajax('/blog/deletemore','GET')
            .then(
                res=>{
                    if (res.code==200) {
                        window.location.reload();
                    }
                }
            )
        }