<template>
  <div id="login">
    <img src="../../assets/logo.png" alt="">
      <el-form :model="ruleForm" label-position="left" status-icon :rules="rules" ref="ruleForm" label-width="18vw" class="demo-ruleForm">
        <div class="msg">
          <el-form-item label="账号" prop="uname">
            <el-input type="text" v-model="ruleForm.uname" autocomplete="off" placeholder="用户名/手机号"></el-input>
          </el-form-item>             
        </div>
        <div class="msg">
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="密码"></el-input>
          </el-form-item>
        </div>

        <div id="btn"> 
          <el-button type="warning" @click="submitForm('ruleForm')">登录</el-button>        
        </div>

      </el-form>

  </div>
</template>

<script>
export default {
    data(){
      var checkuname = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        }
        callback();
      };

      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      return {
        ruleForm: {
          uname: '',
          pass: ''
        },
        rules:{
          uname: [
            { validator: checkuname, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      submitForm(formName) {
        let this1 = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('登录成功');
            this.$http('user/login', 'POST', {
              uname: this1.ruleForm.uname,
              upass: this1.ruleForm.pass
            })
              .then(
                res=> {
                  console.log(res);
                  if (res.code ==200) {    
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
};
</script>

<style lang="less" scoped>
  #login {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    text-align: center;
    img {
      width: 30vw;
      height: 30vw;
      margin: 5vh 0;
      border-radius: 50%;
    }
    .msg {
      width: 75vw;
      height: 9vh;
      padding-top: 2vh;
      margin: 0 auto;
    }
  }
  #btn {
    margin: 6vh auto;
    width: 75vw;
    height: 6vh;
    line-height: 6vh;
  }

</style>

