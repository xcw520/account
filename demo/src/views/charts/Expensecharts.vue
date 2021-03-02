<template>
  <div id="Expensechart">
    <div class="Echarts">
      <div id="main" style="width: 100vw; height: 35vh"></div>
    </div>
    <div class="ranking-list">
      <p>支出排行榜</p>
      <div class="rank" v-if="expensedata.first.num">
        <span>{{ expensedata.first.name }}:{{ expensedata.first.num }}</span>
        <div class="progress-bar">
          <el-progress
            :text-inside="true"
            :stroke-width="22"
            :percentage="
              Math.round((expensedata.first.num / expensedata.acount) * 100)
            "
            status="warning"
          ></el-progress>
        </div>
      </div>
      <div class="rank" v-if="expensedata.second.num">
        <span>{{ expensedata.second.name }}:{{ expensedata.second.num }}</span>
        <div class="progress-bar">
          <el-progress
            :text-inside="true"
            :stroke-width="22"
            :percentage="
              Math.round((expensedata.second.num / expensedata.acount) * 100)
            "
            status="warning"
          ></el-progress>
        </div>
      </div>
      <div class="rank" v-if="expensedata.third.num">
        <span>{{ expensedata.third.name }}:{{ expensedata.third.num }}</span>
        <div class="progress-bar">
          <el-progress
            :text-inside="true"
            :stroke-width="22"
            :percentage="
              Math.round((expensedata.third.num / expensedata.acount) * 100)
            "
            status="warning"
          ></el-progress>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Echarts",
  methods: {
    onConfirm() {

    },
    myEcharts() {
      var myChart = this.$echarts.init(document.getElementById("main"));
      window.onresize = myChart.resize;
      var option = {
        title: {},
        legend: {
          data: [""],
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            data: this.expensedata.arr,
          },
        ],
        yAxis: [{}],
        series: [
          {
            name: "支出",
            type: "line",
            data: this.expensedata.arr2,
            itemStyle: {
              normal: {
                label: { show: true },
                color: "#FFAA33",
              },
            },
          },
        ],
      };
      myChart.setOption(option);
      myChart.resize();
    },
  },
  props: ["expensedata"],
  mounted() {
    this.myEcharts();
  },
  watch: {
    expensedata: {
      handler() {
        this.myEcharts();
      },
      deep: true,
    },
  },
};
</script>


<style lang="less" scoped>
#Expensechart {
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