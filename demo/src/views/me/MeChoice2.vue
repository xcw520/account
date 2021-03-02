<template>
  <div id="me-choice2">
    <router-view></router-view>
    <el-row>
      <el-col :span="2" :offset="21" class="back">
        <router-link to="/me">
          <el-button icon="el-icon-close" type="warning" plain circle></el-button>
        </router-link>
      </el-col>
    </el-row>
    <el-row>
      <el-col :div="24">
        <img src="../../assets/bg_logo.png" />
      </el-col>
    </el-row>
    <el-row>
      <el-col class="title" :div="24">
        <h3>易记 记账</h3>
      </el-col>
      <el-col :div="24">
        <router-link to="/me/changepass">
          <el-button class="btn" type="warning" plain>修改密码</el-button>
        </router-link>
      </el-col>
      <el-col :div="24">
          <el-button class="btn" plain @click="loginout()">退出登录</el-button>
      </el-col>
    </el-row>
  </div>
</template> 

<script>
export default {
  methods:{
    loginout(){
      localStorage.removeItem('token');
      localStorage.removeItem('flag');
      this.$router.push('/me');
      window.location.reload();
    }
  }
}
</script>


<style lang="less" scoped>
#me-choice2 {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  text-align: center;
}
button {
  font-size: 1rem;
}
.back {
  margin-top: 1vh;
}
.title {
  margin-bottom: 14vh;
  h3 {
    margin-top: 0;
  }
}
.el-col {
  img {
    width: 25vw;
    margin-top: 8vh;
    border-radius: 15px;
  }
  .btn {
    width: 65vw;
    height: 6vh;
    margin: 1vh;
    font-size: 1.1rem;
    border-radius: 10px;
  }
}
</style>