let path = window.location.href.slice(window.location.href.indexOf('=') + 1);
let myChart1 = echarts.init(document.getElementById('bar_diagram'));
let myChart2 = echarts.init(document.getElementById('fan_diagram'));
let myChart3 = echarts.init(document.getElementById('line_chart'));
let date = new Date();
let y = date.getFullYear();
let m = date.getMonth() + 1;
let d = date.getDate();
let time1, time2, keyword, years, extent;
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
function getEcharts(starttime = "", endtime = "", keyword = "", years = "", extent="") {
    ajax(`/money/alldata?uid=${path}&starttime=${starttime}&endtime=${endtime}&keyword=${keyword}&years=${years}&type=${extent}`, 'GET')
        .then(
            res => {
                //柱状
                let option1 = {
                    "title": {
                        "text": ""
                    },
                    "toolbox": {
                        show: true,
                        feature: {
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                    "tooltip": {},
                    "legend": {
                        "data": ["收入", "支出"]
                    },
                    "xAxis": {
                        "data": res.result1.type
                    },
                    "yAxis": {},
                    "series": [{
                        "name": "收入",
                        "type": "bar",
                        "data": res.result1.incomes,
                        "itemStyle": {
                            normal: {
                                color: '#FFAA33'
                            }
                        }
                    },
                    {
                        "name": "支出",    
                        "type": "bar",
                        "data": res.result1.expenses,
                        "itemStyle": {
                            normal: {
                                color: '#5599FF'
                            }
                        }
                    }]
                };

                // // 使用刚指定的配置项和数据显示图表。
                // myChart1.setOption(option1);

                //饼状
                if (!res.result2.incomes) res.result2.incomes = 0;
                if (!res.result2.expenses) res.result2.expenses = 0;
                let option2 = {
                    color: ['#FFAA33', '#5599FF'],
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',    // 设置图表类型为饼图
                            radius: '55%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                            label: {
                                normal: {
                                    formatter: '{b}: {d}%',
                                    textStyle: {
                                        fontWeight: 'normal',
                                        fontSize: 15
                                    }
                                }
                            },
                            data: [          // 数据数组，name 为数据项名称，value 为数据项值
                                { value: res.result2.incomes, name: '收入' },
                                { value: res.result2.expenses, name: '支出' }

                            ]
                        }
                    ]
                };
                //折线
                let option3 = {
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                    legend: {
                        data: ['收入', '支出'],
                        top: '3%'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    }],
                    yAxis: [{}],
                    series: [{
                        name: '收入',
                        type: 'line',
                        data: res.result3.month_incomes,
                        itemStyle: {
                            normal: {
                                label: { show: true },
                                color: '#FFAA33'

                            }
                        }
                    },
                    {
                        name: '支出',
                        type: 'line',
                        data: res.result3.month_expenses,
                        itemStyle: {
                            normal: {
                                label: { show: true },
                                color: '#5599FF'

                            }
                        }
                    }
                    ]
                };
                myChart1.setOption(option1, true);
                myChart2.setOption(option2, true);
                myChart3.setOption(option3, true);
                // myChart2.setOption({

                // });
            }
        )
}
getEcharts();
function getContent(dp) {
    years = dp.slice(0,4)*1;
    getEcharts(time1, time2, keyword, years, extent);
}
layui.use(['form'], function () {
    var form = layui.form();
    form.render();
    form.on('select(type)', function (data) {
        keyword = data.value;
        getEcharts(time1, time2, keyword, years, extent);
    });
    form.on('radio', function (data) {
        extent = data.value;
        getEcharts(time1, time2, keyword, years, extent);
    })
    form.on('submit', function (data) {
        time1 = new Date(data.field.starttime).getTime();
        time2 = new Date(data.field.endtime).getTime();
        if (keyword == '') keyword = (data.field.keyword) ? data.field.keyword : '';
        if (time1 * 1 > time2 * 1) {
            layer.msg('起始时间晚于截至时间');
            return false;
        } else {
            getEcharts(time1, time2, keyword, years, extent);
            return false;
        }
    });
});