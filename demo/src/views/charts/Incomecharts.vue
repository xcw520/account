<template>
    <div id="Incomechart">
        <div class="Echarts">
            <div id="main" style="width:100vw; height:35vh;"></div>
        </div>
        <div class="ranking-list">
            <p>收入排行榜</p>
            <div class="rank" v-if="incomedata.first.num">
                <span>{{incomedata.first.name}}:{{incomedata.first.num}}</span>
                <div class="progress-bar">
                    <el-progress :text-inside="true" :stroke-width="22" :percentage="Math.round((incomedata.first.num/incomedata.acount)*100)" status="warning"></el-progress>
                </div>
            </div>
            <div class="rank" v-if="incomedata.second.num">
                <span>{{incomedata.second.name}}:{{incomedata.second.num}}</span>
                <div class="progress-bar">
                    <el-progress :text-inside="true" :stroke-width="22" :percentage="Math.round((incomedata.second.num/incomedata.acount)*100)" status="warning"></el-progress>
                </div>
            </div>
            <div class="rank" v-if="incomedata.third.num">
                <span>{{incomedata.third.name}}:{{incomedata.third.num}}</span>
                <div class="progress-bar">
                    <el-progress :text-inside="true" :stroke-width="22" :percentage=" Math.round((incomedata.third.num/incomedata.acount)*100)" status="warning"></el-progress>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Echarts',
    methods:{
        myEcharts(){
            var myChart = this.$echarts.init(document.getElementById('main'));
            window.onresize = myChart.resize;
            var option = {
                title: {},
                legend: {
                    data: [''],
                    
                },
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    data: this.incomedata.arr
                }],
                yAxis: [{}],
                series:[{
                     name: '收入',
                        type: 'line',
                        data: this.incomedata.arr2,
                        itemStyle: {
                            normal: {
                                label: { show: true },
                                color: '#FFAA33'

                            }
                        }
                }]
               

            }
            myChart.setOption(option);
            myChart.resize();
        }
    },
    props:['incomedata'],
    mounted(){
        this.myEcharts();
    },
    watch: {
        'incomedata': {
            handler() {
                this.myEcharts();
            },
            deep: true
        }
    }
}
</script>

<style lang="less" scoped>
    #Incomechart{
        box-sizing: border-box;
        height: 75vh;
        .Echarts {
            height: 36vh;
            border-bottom: 1px solid #ddd;
        }
        .ranking-list {
            margin-top: 1vh;
            height: 35vh;
            p {
                padding-left: 3vw;
                width: 95vw;
                height: 5vh;
                line-height: 5vh;
                text-align: left;      
                font-size: 1.2rem;
                font-weight: 900;              
            }
            .rank {
                height: 9vh;
                border-bottom: 1px solid #ddd;
                span {
                    display: block;
                    padding-left: 3vw;
                    width: 95vw;
                    height: 4vh;
                    line-height: 4vh;        
                    text-align: left;
                    font-size: 1.1rem;
                }
                .progress-bar {
                    padding-left: 1.5vw;
                    padding-top: 0.5vh;
                    width: 95vw;
                    height: 3.5vh;
                }
            }
        }
    }
</style>