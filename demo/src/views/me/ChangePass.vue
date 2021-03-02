<template>
    <div id="change-pass">
    <img src="../../assets/logo.png" alt="">
      <el-form :model="ruleForm" label-position="left" status-icon :rules="rules" ref="ruleForm" label-width="18vw" class="demo-ruleForm">
        <div class="msg">
          <el-form-item label="旧密码" prop="oldpass">
            <el-input type="password" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
          </el-form-item>             
        </div>
        <div class="msg">
          <el-form-item label="新密码" prop="newpass">
            <el-input type="password" v-model="ruleForm.newpass" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <div class="msg">
          <el-form-item label="确认密码" prop="checkpass">
            <el-input type="password" v-model="ruleForm.checkpass" autocomplete="off"></el-input>
          </el-form-item>             
        </div>
        <div id="btn"> 
          <el-button type="warning" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>           
        </div>

      </el-form>
    </div>
</template>

<script>
export default {
    data(){
      var checkoldPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原密码'));
        }
        callback();
      };
      var checknewPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        }
        callback();
      };
     var checkPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.newpass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        ruleForm: {
          oldpass: '',
          newpass: '',
          checkpass:''
        },
        rules:{
          oldpass: [
            { validator: checkoldPass, trigger: 'blur' }
          ],
          newpass:[
            { validator: checknewPass, trigger: 'blur' }
          ],
          checkpass: [
            { validator: checkPass, trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      submitForm(formName) {
        let this1 = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('修改成功');
            this.$http('user/changepass', 'POST',{
              upass:this1.ruleForm.oldpass,
              newupass:this1.ruleForm.newpass,
              checkpass:this1.ruleForm.checkpass
            })
              .then (
                res=>{
                 
                  if (res.code == 200) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('flag');
                    this.$router.push('/me');
                    window.location.reload();
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
  #change-pass {
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
