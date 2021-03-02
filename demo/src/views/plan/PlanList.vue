<template>
  <div id="plan-list">
    <h3>我的存钱计划</h3>
    <div class="nav">
      <p class="nav-title">
        <span class="left">
          <span v-if="month == ''">本</span>{{ month }}月总预算
        </span>
        <span>
          <van-field
            readonly
            clickable
            :min-date="minDate"
            :max-date="maxDate"
            name="datetimePicker"
            :value="month"
            placeholder="点击选择日期"
            @click="showCalendar = true"
            style="margin-top: -3vh; width: 50vw; opacity: 0"
          />
          <van-popup v-model="showCalendar" position="bottom">
            <van-datetime-picker
              type="date"
              @confirm="onConfirm"
              @cancel="showCalendar = false"
              v-model="currentDate"
              :min-date="minDate"
              :max-date="maxDate"
            />
          </van-popup>
        </span>
        <span class="right" @click="showPopup"> 修改每日预算</span>
        <van-popup
          v-model="show"
          round
          position="bottom"
          :style="{ height: '30%' }"
        >
          <van-field
            style="
              margin-top: 5vh;
              height: 8vh;
              line-height: 5vh;
              font-size: 1.5rem;
            "
            v-model="value"
            placeholder="请输入日预算"
          />
          <span class="btn-nav">
            <button class="btn" @click="yes()">确认</button>
          </span>
        </van-popup>
      </p>
      <p class="circle">
        <van-circle
          v-model="currentRate"
          :rate="rate"
          :speed="100"
          :text="text"
        />
      </p>
      <div class="nav-right">
        <p class="top">
          <span class="label"> 剩余预算： </span>
          {{ oddmoney }}
        </p>
        <p class="info">每日预算：{{ budget }}</p>
        <p class="info">今日支出：{{ out }}</p>
      </div>
    </div>
    <div>
      <div class="bill-typemsg">
        <div class="bill-detail" v-for="(item, index) in detail" :key="index">
          <p class="bill-detail-type">{{ item.tname }}</p>
          <p class="bill-detail-money">{{ item.num }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      month: "",
      value: "",
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(2100, 0, 31),
      currentDate: new Date(),
      showCalendar: false,
      currentRate: 0,
      rate: "", //剩下预算的百分比
      allexpense: "", //本月到现在的总消费，
      oddmoney: "", //剩余的预算
      budget: "", //每日预算,
      out: "", //今日支出
      detail: [],
    };
  },
  methods: {
    onConfirm(date) {
      this.month = date.getMonth() + 1; //月
      let month = this.month;
      let year = date.getFullYear(); //年
      let day = date.getDate(); //日
      this.showCalendar = false;
      if (localStorage.flag) {
        this.$http(
          `plan/list?year=${year}&month=${this.month}&day=${day}`,
          "GET"
        ).then((res) => {
         
          this.allexpense = res.data.allexpense; //本月到现在的总消费
          this.budget = res.data.budget; //每日预算

          this.out = res.data.out; //今日支出
          this.detail = res.data.detail; //支出详情
          let dayarr = [
            "",
            "31",
            "",
            "31",
            "30",
            "31",
            "30",
            "31",
            "31",
            "30",
            "31",
            "30",
            "31",
          ];
          if (year % 4 == 0 && year % 100 != 0) {
            dayarr[2] = "29";
          } else {
            dayarr[2] = "28";
          }
          this.oddmoney = this.budget * dayarr[month] - this.allexpense; //剩下的预算

          this.rate = Math.round(
            (this.oddmoney / (this.budget * dayarr[month])) * 100
          ); //剩下的预算百分比
          // this.allexpense = res.data.allexpense; //本月到现在的总消费
          // this.budget = res.data.budget; //每日预算
          // this.out = res.data.out; //今日支出
        });
      }
    },
    showPopup() {
      this.show = true;
    },
    yes() {
      this.show = false;
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      let day = new Date().getDate();
      if (localStorage.flag) {
        this.$http(
          `plan/change?newbudget=${this.value}&year=${year}&month=${month}&day=${day}`,
          "GET"
        ).then((res) => {
          if (res.code == 200) {
            this.$toast("修改成功");
            window.location.reload();
          } else {
            this.$toast(res.msg);
          }
        });
      }
    },
  },
  computed: {
    text() {
      return this.currentRate.toFixed(0) + "%";
    },
  },
  mounted() {
    if (localStorage.flag) {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.$http(
        `plan/list?year=${year}&month=${month}&day=${day}`,
        "GET"
      ).then((res) => {
        if (res.code == 200) {
          this.allexpense = res.data.allexpense; //本月到现在的总消费
          this.budget = res.data.budget; //每日预算
          this.out = res.data.out; //今日支出
          this.detail = res.data.detail; //支出详情
          let dayarr = [
            "",
            "31",
            "",
            "31",
            "30",
            "31",
            "30",
            "31",
            "31",
            "30",
            "31",
            "30",
            "31",
          ];
          if (year % 4 == 0 && year % 100 != 0) {
            dayarr[2] = "29";
          } else {
            dayarr[2] = "28";
          }
          this.oddmoney = this.budget * dayarr[month] - this.allexpense; //剩下的预算

          this.rate = Math.round(
            (this.oddmoney / (this.budget * dayarr[month])) * 100
          ); //剩下的预算百分比
        } else {
          this.$toast(res.msg);
        }
      });
    }
  },
  watch: {
    show: {
      handler(val) {
        if (!val) {
          this.value = "";
        }
      },
    },
  },
};
</script>

<style lang="less" scoped>
#plan-list {
  width: 100vw;
  height: 100vh;
  h3 {
    text-align: center;
    padding: 2vh 0;
    font-size: 1.5rem;
    background-image: linear-gradient(#fab371, #f59445);
  }
  .nav {
    margin: 1vh 0;
    color: #444;
    border-bottom: 1px solid #888;
    .nav-title {
      width: 100vw;
      font-size: 1.2rem;
      .left {
        font-size: 1.35rem;
        margin-left: 2vw;
      }
      .right {
        float: right;
        margin-right: 2vw;
        margin-top: -5.5vh;
      }
      .btn-nav {
        display: inline-block;
        width: 100vw;
        text-align: center;
        .btn {
          width: 20vw;
          height: 6vh;
          margin-top: 5vh;
          background-color: transparent;
          border: 2px solid #fab371;
          border-radius: 10px;
        }
      }
    }
    .circle {
      width: 30vw;
      padding: 5vw;
    }
    .nav-right {
      float: right;
      margin-top: -17vh;
      margin-right: 5vw;
      .top {
        border-bottom: 1px solid #666;
        font-size: 1.6rem;
        margin: 2vh 0;
        .label {
          display: inline-block;
          width: 32vw;
          color: #000;
          font-size: 1.2rem;
        }
      }
      .info {
        margin: 1.5vh 0;
        font-size: 1rem;
      }
    }
  }
  .bill-typemsg {
    height: auto;
    .bill-detail {
      height: 5vh;
      font-size: 1.3rem;
      .bill-detail-type {
        float: left;
        width: 40vw;
        height: 5vh;
        padding-left: 8vw;
        line-height: 5vh;
      }
      .bill-detail-money {
        width: 40vw;
        float: left;
        text-align: right;
        padding-right: 5vw;
        height: 5vh;
        line-height: 5vh;
      }
    }
  }
}
</style>
