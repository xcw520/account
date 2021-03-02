<template>
  <div id="Charts">
    <div id="top">

      <div id="sort">
        <div class="nav"></div>
        <div class="nav"></div>
        <router-link class="nav" tag="div" to="/charts/expensecharts"
          >支出</router-link
        >
        <router-link class="nav" tag="div" to="/charts/incomecharts"
          >收入</router-link
        >
        <div class="nav">
          
        </div>
        <div class="nav"></div>
      </div>
      
      <div>
        
        <el-radio-group
          v-model="radio"
          @change="getValue"
          size="small"
          fill="#333233"
          class="charts-date"
        >
          <el-radio-button label="周"></el-radio-button>
          <el-radio-button label="月"></el-radio-button>
          <el-radio-button label="年"></el-radio-button>
        </el-radio-group>
      </div>
      <div>
      <van-field
        readonly
        clickable
        :min-date="minDate"
        :max-date="maxDate"
        name="datetimePicker"
        :value="date"
        placeholder="点击切换日期，在周下获取日，在月下获取月，在年下获取年"
        @click="showCalendar = true"
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
    </div>
    </div>

    <div>
      <router-view
        :expensedata="this.expensedata"
        :incomedata="this.incomedata"
      ></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(2100, 0, 31),
      currentDate: new Date(),
      showCalendar: false,
      date:'',
      radio: "周",
      kind: 1,
      accountkind: "expensecharts",
      expensedata: {
        arr: [],
        arr2: [],
        first: { name: "", num: 0 },
        second: { name: "", num: 0 },
        third: { name: "", num: 0 },
        acount: 1,
      },
      incomedata: {
        arr: [],
        arr2: [],
        first: { name: "", num: 0 },
        second: { name: "", num: 0 },
        third: { name: "", num: 0 },
        acount: 1,
      },
    };
  },
  methods: {
    onConfirm(date) {
      this.showCalendar = false;
      let month = date.getMonth()+1;
      let year = date.getFullYear(); //年
      let day = date.getDate(); //日
      this.getValue(day, month, year);
    },
    getValue(day, month, year) {
      /***
       * 1 周
       * 2 月
       * 3 年
       */
      // let kind = '1';
      let choice = ''; 
      switch (this.radio) {
        case "周": {
          this.kind = "1";
          if (day) choice = day;
          break;
        }
        case "月": {
          this.kind = "2";
          if (month) choice = month;
          break;
        }
        case "年": {
          this.kind = "3";
          if (year) choice = year;
          break;
        }
      }
      this.accountkind = this.$route.matched[1].path.slice(
        this.$route.matched[1].path.lastIndexOf("/") + 1
      );
  
      if (localStorage.flag) {
        this.$http(
          `charts/getdata?kind=${this.kind}&accountkind=${this.accountkind}&choice=${choice}`,
          "GET"
        ).then((res) => {
          if (res.code == 200) {
            if (this.accountkind == "expensecharts") {
              this.expensedata = res.data;
            } else {
              this.incomedata = res.data;
            }
          } else {
            this.$toast(res.msg);
          }
        });
      }
    },
  },
  mounted() {
    if (localStorage.flag) {
      this.$http(
        `charts/getdata?kind=${this.kind}&accountkind=${this.accountkind}`,
        "GET"
      ).then((res) => {
      
        if (res.code == 200) {
          if (this.accountkind == "expensecharts") {
            this.expensedata = res.data;
            
          } else {
            this.incomedata = res.data;
          }
        } else {
          this.$toast(res.msg);
        }
      });
    }
  },
  watch: {
    $route: {
      handler() {
        this.getValue();
      },
    },
    // 深度观察监听
    deep: true,
  },
};
</script>

<style lang="less" scoped>
#Charts {
  width: 100vw;
  height: 100vh;
  text-align: center;
  #top {
    background-image: linear-gradient(#fab371, #f59445);
    height: 18vh;
    #sort {
      display: flex;
      width: 100vw;
      height: 6vh;

      .nav {
        height: 6vh;
        line-height: 10vh;
        flex: 1;
        font-size: 1.2rem;
      }
      .router-link-exact-active {
        font-size: 1.6rem;
        margin-top: -0.5vh;
      }
    }
    .charts-date {
      width: 100vw;
      height: 6vh;
      line-height: 6vh;
      span {
        display: inline-block;
        width: 10vw;
        height: 3vh;
        border: 1px solid #000;
      }
    }
  }
}
</style>