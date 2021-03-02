<template>
  <div id="home">
    <div class="top">
      <h2 class="title">易记 记账</h2>
      <el-row>
        <el-col :span="6">
          <div class="alldate">
            <p style="padding-left: 1.5vw">{{ year }}年</p>
            <div class="date-info">
              <span style="font-size: 2rem">{{ month }}</span>
              <span> 月 </span>
              <i class="el-icon-caret-bottom"></i>
              <van-field
                readonly
                clickable
                :min-date="minDate"
                :max-date="maxDate"
                name="datetimePicker"
                placeholder="点击选择日期"
                @click="showCalendar = true"
                style="
                  position: absolute;
                  left: 0;
                  top: 2vh;
                  width: 25vw;
                  height: 7vh;
                  opacity: 0;
                "
              />

              <van-popup v-model="showCalendar" position="bottom">
                <van-datetime-picker
                  type="year-month"
                  @confirm="onConfirm"
                  @cancel="showCalendar = false"
                  v-model="currentDate"
                  :min-date="minDate"
                  :max-date="maxDate"
                />
              </van-popup>
            </div>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="account-sort">
            <p>收入</p>
            <span>{{ monthincome }}</span>
          </div>
        </el-col>

        <el-col :span="9">
          <div class="account-sort">
            <p>支出</p>
            <span>{{ monthexpense }}</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <div id="bill">
      <div v-for="(item, index) in list" :key="index" class="bill-msg">
        <div class="date-type">
          <p class="bill-date">{{ item.date }}</p>
          <p class="bill-alltype">
            <span v-if="item.allexpense != ''">
              支出:{{ item.allexpense }}
            </span>
            <span v-if="item.allincome != ''"> 收入:{{ item.allincome }} </span>
          </p>
        </div>
        <div
          class="bill-typemsg"
          v-for="(item1, index1) in item.money"
          :key="index1"
        >
          <!-- {{item1}} -->
          <div class="bill-detail" @click="showPopup(item1.id)">
            <p class="bill-detail-type">{{ item1.type }}</p>
            <p class="bill-detail-money">{{ item1.num }}</p>
          </div>
        </div>
      </div>
      <van-popup
        class="pop"
        v-model="show"
        round
        position="bottom"
        :style="{ height: '30%' }"
      >
        <p v-if="remark">备注:{{ remark }}</p>
        <p v-else>备注:无</p>
        <a @click="del(delid)">删除账单</a>
      </van-popup>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      monthincome: "",
      monthexpense: "",
      year: new Date().getFullYear(),
      month:
        new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1,
      showCalendar: false,
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(2100, 0, 31),
      currentDate: new Date(),
      show: false,
      remark: "",
      delid: "",
      list: [
        {
          date: "",
          allexpense: "",
          allincome: "",
          money: [],
        },
      ],
    };
  },
  methods: {
    onConfirm(date) {
      this.year = `${date.getFullYear()}`;
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      this.month = `${month}`;
      this.showCalendar = false;
   
      if (localStorage.flag) {
        this.$http(
          `money/account?year=${this.year}&month=${this.month}`,
          "GET"
        ).then((res) => {
         
          if (res.code == 200) {
            this.list = res.data.list;
            this.monthexpense = res.data.monthexpense;
            this.monthincome = res.data.monthincome;
          } else {
            this.$toast(res.msg);
          }
        });
      }
    },
    showPopup(id) {
      // if(localStorage.flag) {
      this.list.forEach((item) => {
        item.money.forEach((el) => {
          if (el.id == id) {
            this.remark = el.msg;
            this.delid = id;
          }
        });
      });
      // }
      this.show = true;
    },
    del(delid) {
      this.$dialog
        .confirm({
          title: "确认删除",
          message: "你确认要删除么",
        })
        .then(() => {
          if (localStorage.flag) {
            this.$http(`money/del?mid=${delid}`, "GET").then((res) => {
        
              if (res.code == 200) {
                window.location.reload();
              }
            });
          }
        })
        .catch(() => {
          // on cancel
        });
    },
  },
  mounted() {
    let nowyear = new Date().getFullYear();
    let nowmonth = new Date().getMonth() + 1;
    if (localStorage.flag) {
      this.$http(`money/account?year=${nowyear}&month=${nowmonth}`, "GET").then(
        (res) => {
      
          if (res.code == 200) {
            this.list = res.data.list;
            this.monthexpense = res.data.monthexpense;
            this.monthincome = res.data.monthincome;
          } else {
            this.$toast(res.msg);
          }
        }
      );
    }
  },
};
</script>

<style lang="less" scoped>
.top {
  width: 100vw;
  height: 16vh;
  background-image: linear-gradient(#fab371, #f59445);
  .title {
    width: 100vw;
    height: 5vh;
    line-height: 5vh;
    text-align: center;
    padding: 1vh 0;
  }
  .date-info {
    padding-left: 3vw;
    border-right: 1px solid;
  }
  #alldate {
    position: relative;
  }
  .account-sort {
    padding-left: 3vw;
    span {
      font-size: 1.8rem;
      line-height: 6.5vh;
    }
  }
}
#home #bill {
  height: 72vh;
  width: 100vw;
  overflow: hidden;
  overflow-y: visible;
  .bill-msg {
    margin-top: 3vh;
    height: auto;
    .date-type {
      height: 3vh;
      color: #969696;
      border-bottom: 1px solid #ebebeb;
      .bill-date {
        float: left;
        padding-left: 1.5vw;
        width: 40vw;
      }
      .bill-alltype {
        float: left;
        width: 55vw;
        padding-right: 1.5vw;
        text-align: right;
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
          padding-left: 5vw;
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
  .pop {
    p {
      margin: 3vh auto;
      padding-left: 3vw;
      width: 80%;
      height: 55%;
      line-height: 12vh;
      font-size: 1.3rem;
    }
    a {
      display: block;
      margin: 0 auto;
      width: 90%;
      text-align: center;
      height: 15%;
      line-height: 4.5vh;
      color: #fff;
      background-color: #f56c6c;
      border-radius: 5px;
    }
  }
}
</style>
