<template>
  <div id="logup">
    <div id="register">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="20vw"
        class="demo-ruleForm"
      >
        <div class="msg">
          <el-form-item label="账号" prop="uname">
            <el-input v-model="ruleForm.uname" autocomplete="off"></el-input>
          </el-form-item>
        </div>

        <div class="msg">
          <el-form-item label="密码" prop="pass">
            <el-input
              type="password"
              v-model="ruleForm.pass"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </div>

        <div class="msg">
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm.checkPass"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </div>

        <div class="uphone">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="ruleForm.phone" autocomplete="off">
              <span slot="append" @click="getCaptcha()" :class="showbtn" >{{codemsg}}</span>
            </el-input>
          </el-form-item>
        </div>

        <div class="ucode">
          <el-form-item label="验证码" prop="captcha">
            <el-input v-model="ruleForm.captcha" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <div id="btn">
          <el-button type="warning" @click="submitForm('ruleForm')"
            >注册</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var checkuname = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var userphone = (rule, value, callback) => {
      let regexp = /^1[3-9][0-9]{9}$/;
      if (value === "") {
        callback(new Error("请输入手机号码"));
      } else if (!regexp.test(value)) {
        callback(new Error("手机号码不正确"));
      } else {
        this.flag = true;
        callback();
      }
    };
    var ucaptcha = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (this.$md5(value) != this.rigthcaptcha) {
        callback(new Error('验证码错误'));
      } else {
        callback();
      }
      
    };
    return {
      flag:false,
      rigthcaptcha:'',
      codedisabled:true,
      showbtn: 'blue',
      timedown:60,
      codemsg:"获取验证码",
      timer:null,
      ruleForm: {
        pass: "",
        checkPass: "",
        uname: "",
        phone: "",
        captcha: "",
      },
      rules: {
        uname: [{ validator: checkuname, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        phone: [{ validator: userphone, trigger: "blur" }],
        captcha: [{ validator: ucaptcha, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      let this1 = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("注册成功");
          this.$http('user/logup','POST',{
            uname:this1.ruleForm.uname,
            upass:this1.ruleForm.pass,
            checkpass:this1.ruleForm.checkPass,
            phone:this1.ruleForm.phone
          })
            .then(
              res=>{
                console.log(res);                                                                       
                if (res.code == 200) {
                  localStorage.token = res.data.token;
                  localStorage.flag = res.data.flag; 
                  this.$router.push('/')
                } else {
                  this.$toast(res.msg);
                }
              }
            )
        } else {
          return false;
        }
      });
    },
    getCaptcha(){
      if(this.flag) {
        if(!this.timer){                                                                                                                                                                                                                                                                                                                                                 
          this.showbtn = 'gray';
          this.timer = setInterval(()=>{
            if(this.timedown > 0 && this.timedown <= 60){
              this.timedown--;
            }
            if (this.timedown !== 0){
              this.codemsg = '重新发送(' + this.timedown + ')';
              this.codedisabled = false;

            } else {
              clearInterval(this.timer);
              this.codemsg = '获取验证码';
              this.timedown  = 60;
              this.timer = null;
              this.codedisabled = true;
              this.showbtn = 'blue'
            }
          }, 1000)
        }
      }
      if (this.flag && this.codedisabled){ 
        this.$http(`user/captcha?phone=${this.ruleForm.phone}`, 'GET')
          .then(
            res=>{
              console.log(res);
              if (res.code == 200) {
                this.rigthcaptcha = res.data.captcha;
              } else {
                this.$toast(res.msg)
              }
            }
          )
      }                                                                                                                                                                                                                                                                                                                                     
      
    
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.blue {
  color: #F56C6C;
}
.gray {
  color: #888;
}
#logup {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  text-align: center;
}
#register {
  margin: 0 auto;
  width: 90vw;
  padding-top: 4vh;
}
#register .msg {
  width: 88vw;
  height: 9vh;
  margin: 1vh auto;
}
#btn {
  margin: 6vh auto;
  width: 75vw;
  height: 6vh;
  line-height: 6vh;
}
#register .uphone {
  width: 90vw;
  height: 9vh;
}
#register .ucode {
  width: 90vw;
  height: 9vh;
}
</style>