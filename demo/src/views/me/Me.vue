<template>
  <div id="me">
    <router-view></router-view>
    <el-row>
      <el-col :span="4" class="attar">
        <router-link :to="url">
          <img src="../../assets/logo.png" alt="" />
        </router-link>
      </el-col>
      <el-col :p="20">
        <h3 class="name" @click="test()">
          <span v-if="this.userinfo.birthday.indexOf(this.today)>=0">生日快乐<br></span>
          <span v-else>Hello</span> 
          {{ name }}
        </h3>
      </el-col>
      <el-col class="card">
        <div @click="card($event)">
          <el-col class="card_front" :class="info">
            <i class="el-icon-user-solid" @click="change()">
              <img v-if="flag == true && attarUrl.indexOf('.')>=0" :src="attarUrl" alt="">
            </i>
            <p v-if="flag == false" class="msg">
              <button
                class="btn"
                style="
                  margin-top: 8vh;
                  width: 15vw;
                  height: 10vw;
                  border-radius: 10px;
                  border: 1px solid #e6a23c;
                  outline: none;
                "
              >
                请登录
              </button>
            </p>
            <div v-else class="msg">
              <p>
                <i class="el-icon-postcard"></i>
                <span v-if="!userinfo.nickname">昵称：未定义 </span>
                <span v-else>昵称：{{ userinfo.nickname }}</span>
                <i v-if="userinfo.sex == '0'" class="el-icon-male"></i>
                <i v-else class="el-icon-female" style="color: pink"></i>
              </p>
              <p>
                <i class="el-icon-phone"></i
                ><span>手机：{{ userinfo.phone }}</span>
              </p>
              <p>
                <i class="el-icon-present"></i
                >
                <span v-if="userinfo.birthday=='1970-1-1'">生日：</span>
                <span v-else>生日：{{ userinfo.birthday }}</span>
              </p>
              <p>
                <i class="el-icon-message"></i
                ><span>邮箱：{{ userinfo.email }}</span>
              </p>
            </div>
            <router-link tag="i" to="/me/changeinfo" class="el-icon-edit">
            </router-link>
          </el-col>
        </div>
        <div @click="card($event)" class="weatherbox">
          <el-col class="card_back" :class="card2">
            <i class="el-icon-cloudy"></i>
            <div class="msg">
              <div class="weather">
                  
                <div class="others">
                  <div class="day" v-for="(item, index) in otherweather" :key="index">             
                    <span class="week">
                       {{item.week}}
                    </span>
                    <span class="wea">
                      <img :src="item.wea_img">
                    </span>
                    <span class="max-temperature">
                      {{item.max}}
                    </span>
                    <span class="min-temperature">
                      {{item.min}}
                    </span>
                  </div>
          
                </div>
                <div class="today">
                  <div class="cityname" style="font-size: 1.2rem;">{{city}}</div>
                  <div class="todayweather">
                    <img :src="todayweather.wea_img">
                    <span style="font-weight: 700;font-size: 1.5rem;">{{todayweather.wea}}</span>
                  </div>
                  <div class="todaytemperature">
                    <span class="max">最高：{{todayweather.max}}</span>
                    <span class="min">最低：{{todayweather.min}}</span>
                  </div>
                </div>
                
              </div>
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=59f860a8e34907d5f7c7687478390243"></script>
<script>
import { lazyAMapApiLoaderInstance } from "vue-amap";
export default {
  data() {
    return {
      name: '',
      info: "info change_back",
      card2: "change_front",
      url: "/me/mechoice",
      attarUrl:'',
      flag: true,
      userinfo: {
        attar: "",
        nickname: "",
        sex: "",
        birthday: "",
        phone: "",
        email: "",
      },
      today: '',
      city:'',
      todayweather:{},
      otherweather:[],
    };
  },
  methods: {
    test() {
            
    },
    change() {
      if (this.info.indexOf("change_back") >= 0) {
        if (this.info.indexOf("activeinfo") >= 0) {
          this.info = this.info.replace("activeinfo", "info");
        } else {
          this.info = this.info.replace("info", "activeinfo");
        }
      }
    },
    card(e) {
      if (
        e.target.getAttribute("class") &&
        e.target.getAttribute("class").indexOf("btn") >= 0
      ) {
        if (this.info.indexOf("change_back") >= 0) {
          this.$router.push("/me/login");
        }
      } else {
        if (
          e.target.getAttribute("class") &&
          e.target.getAttribute("class") != "el-icon-user-solid" &&
          this.info.indexOf("activeinfo") < 0 &&
          e.target.getAttribute("class").indexOf("el-icon-edit") < 0
        ) {
          if (this.info.indexOf("change_back") >= 0) {
            this.info = this.info.replace("change_back", "change_front");
          } else {
            this.info = this.info.replace("change_front", "change_back");
          }
          this.card2 =
            this.card2 == "change_front" ? "change_back" : "change_front";
        }
      }
    },
  },
  mounted(){
    this.today = (new Date().getMonth()+1) + '-' + new Date().getDate();
    this.$http('user/getinfo', 'GET')
    .then(
      res=>{
        if (res.code == 200) {
          this.name = res.data.tittleName;
          this.userinfo.nickname = res.data.nickname;
          this.userinfo.sex = res.data.sex;
          this.userinfo.birthday = new Date(res.data.birthday*1).getFullYear() + '-' +  (new Date(res.data.birthday*1).getMonth()+1) + '-' + new Date(res.data.birthday*1).getDate();
          this.userinfo.phone = res.data.phone;
          this.userinfo.email = res.data.email;
          if (res.data.attar)
            this.attarUrl = `http://api.lcxcw.club/upload/${res.data.attar}`;
        } else {
          if (res.msg != '用户不存在') this.$toast(res.msg);
        }
      }
    )
    if(!localStorage.flag || localStorage.flag == '') {
      this.flag = false;
      this.url = "/me/mechoice";
    } else {
      this.url = "/me/mechoice2";
    }
    let this1 = this;
    lazyAMapApiLoaderInstance.load().then(() => {
      var citysearch = new AMap.CitySearch(); // 定位
      citysearch.getLocalCity(function (status, result) {
        if (status === "complete" && result.info === "OK") {
          if (result && result.city && result.bounds) {
            let cityinfo = result.city;
            // console.log(cityinfo);

            this1.$http(`city/weather?city=${cityinfo}`, "GET").then((res) => {
              if (res.code == 200) {
                let cityid = res.data.cityid;
                // console.log(cityid);
                this1.$http(`https://v0.yiketianqi.com/api?version=v9&appid=87576415&appsecret=df19YKXA&cityid=${cityid}`,"GET")
                  .then((res1) => {
                    // console.log(res1.data);
                    res1.data.forEach((item, index)=>{
                      if(index < 1) {
                        // console.log(item);
                        this1.todayweather = {
                          wea:item.wea,
                          wea_img: `http://api.lcxcw.club/img/${item.wea_img}.png`,
                          max: item.tem1,
                          min: item.tem2
                        }
                      } else {
                        this1.otherweather.push({
                          week: item.week,
                          wea_img: `http://api.lcxcw.club/img/${item.wea_img}.png`,
                          max: item.tem1,
                          min: item.tem2
                        })
                        // console.log(item);
                      }
                    })
                    
                    this1.city = res1.city;
                    this1.weather = res1.data;

                  });
                }
            });
          }
        }
      });
    });
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
#me {
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-image: linear-gradient(#fab371, #f59445);
  text-align: center;
  .attar {
    margin: 4vh;
    img {
      position: relative;
      width: 12vh;
      height: 12vh;
      border-radius: 50%;
      border: 2px solid #fff;
      z-index: 99;
    }
  }
  .name {
    color: #fee;
    font-size: 2.5rem;
  }
  .time {
    color: #222;
    font-size: 1.2rem;
    text-align: left;
    margin-top: 2vh;
    margin-left: 5vw;
  }
  .card {
    position: relative;
    transform-style: preserve-3d;
  }
  .change_front {
    transform-style: preserve-3d;
    transform: rotateY(180deg);
  }
  .change_back {
    transform-style: preserve-3d;
    transform: rotateY(0deg);
  }
  .card_back {
    position: absolute;
    width: 80vw;
    height: 45vh;
    margin-left: 10vw;
    margin-top: 5vh;
    border-radius: 15px;
    background-color: #fff;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    .el-icon-cloudy {
      display: block;
      width: 50px;
      height: 50px;
      line-height: 50px;
      font-size: 1.5rem;
      border-radius: 50%;
      color: #5cb6ff;
      border: 1px solid#5CB6FF;
      margin: 1vh;
    }
  }
  // 缩起来的资料卡
  .info {
    width: 80vw;
    height: 45vh;
    margin-left: 10vw;
    margin-top: 5vh;
    border-radius: 15px;
    background-color: #fff;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    .el-icon-user-solid {
      position: relative;
      display: block;
      width: 50px;
      height: 50px;
      line-height: 50px;
      font-size: 1.5rem;
      border-radius: 50%;
      color: #5cb6ff;
      margin: 1vh;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .el-icon-edit {
      position: fixed;
      bottom: 14vh;
      right: 4vw;
      opacity: 0;
    }
    .msg {
      margin: 4% auto;
      width: 85%;
      height: 65%;
      p {
        display: flex;
        margin-left: 5%;
        align-items: center;
        width: 94%;
        font-size: 1.1rem;
        height: 20%;
        i {
          color: #409eff;
        }
        span {
          padding-right: 3%;
          padding-left: 5%;
        }
      }
    }
  }

  .weather {
    margin: 0 auto;
    width: 90%;
    height: 33vh;
    background-image: linear-gradient(to bottom right,  #5cb6ff, rgb(27, 50, 184));
    color: #fff;
    border-radius: 10px;
    box-shadow: 3px 3px 7px #888,
             2px 2px 5px #333;
    .others{
      float: left;
      width: 60%;
      height: 33vh;
      border-right: 2px solid #fff;
      .day {
        margin: 1vh;
        margin-top: 1.2vh;
        width: 100%;
        height: 4vh;

        span{
          display: block;
          float: left;
          height: 4vh;
          line-height: 4vh;
          font-size: 0.8rem;
        }
        .week {   
          margin-left: 1vw;      
          width: 27%;
        }
        .wea {
          margin-left: 2vw;
          width: 20%;
          text-align: center;
          img {
            width: 4vh;
            height: 4vh;
          }
        }
        .max-temperature {
          margin-left: 3vw;
          width: 15%;
        }
        .min-temperature {
          margin-left: 1vw;
          width: 15%;
        }
      
      }
    }
    .today {
      float: left;
      width: 39%;
      height: 33vh;
      font-size: 1.2rem;
      .cityname {
        width: 100%;
        height: 4vh;
        line-height: 4vh;
        text-align: center;
        margin-top: 1vh;
      }
      .todayweather {      
        width: 100%;
        height: 17vh;
        img {
          margin: 0.5vh 0;
          height: 20vw;
          width: 20vw;
        }
        span {
          display: block;
          background: rgba(0, 0, 0, 0.2);
          width: 100%;
        }
      }
      .todaytemperature {
        width: 100%;
        height: 9vh;
        margin-top: 0.5vh;
        span {
          width: 100%;
          display: block;
          height: 4vh;
          line-height: 4vh;

        }
      }
    }
  }
  //放大的资料卡
  .activeinfo {
    width: 100vw;
    height: 80vh;
    margin-top: -13vh;
    border-radius: 15px;
    background-color: #fff;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    .el-icon-user-solid {
      position: relative;
      display: block;
      width: 50px;
      height: 50px;
      line-height: 50px;
      font-size: 1.5rem;
      border-radius: 50%;
      color: #5cb6ff;
      border: 1px solid #5cb6ff;
      margin: 1vh;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .el-icon-edit {
      opacity: 1;
      position: fixed;
      width: 10vw;
      height: 10vw;
      line-height: 10vw;
      color: #5cb6ff;
      border: 1px solid #5cb6ff;
      border-radius: 50%;
      bottom: 14vh;
      right: 4vw;
      transition: opacity 0.1s 0.2s;
    }
    .msg {
      width: 90%;
      height: 50%;
      margin: 10% auto;
      p {
        display: flex;
        margin-left: 5%;
        align-items: center;
        width: 94%;
        font-size: 1.3rem;
        height: 20%;
        i {
          color: #409eff;
        }
        span {
          padding-right: 3%;
          padding-left: 5%;
        }
      }
    }
  }
}
</style>