<template>
  <div id="change-info">
    <el-form
      :model="ruleForm"
      :rules="rules"
      status-icon
      ref="ruleForm"
      class="demo-ruleForm"
      label-width="80px"
      style="padding-top: 3vh"
    >
      <el-upload
        class="avatar-uploader"
        action="http://api.lcxcw.club/user/changeinfo"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :on-remove="handleRemove"
        :before-upload="beforeAvatarUpload"
        :headers="myHeaders"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <span
          v-if="imageUrl"
          class="el-upload-action"
          @click.stop="handleRemove()"
        >
          <i class="el-icon-delete"></i>
        </span>
        <i v-else class="el-icon-upload2 avatar-uploader-icon" stop></i>
      </el-upload>
      <el-form-item label="昵称" class="input" prop="nickname">
        <el-input
          v-model="ruleForm.nickname"
          placeholder="请输入昵称"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别" class="input" prop="sex">
        <el-radio-group v-model="ruleForm.sex" class="radio">
          <el-radio border label="0">男</el-radio>
          <el-radio border label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日" class="input" prop="birthday">
        <el-col :span="24">
          <van-field
            readonly
            clickable
            :min-date="minDate"
            :max-date="maxDate"
            name="datetimePicker"
            v-model="ruleForm.birthday"
            placeholder="点击选择日期"
            @click="showCalendar = true"
            style="border: 1px solid #dcdfe6; border-radius: 4px"
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
        </el-col>
      </el-form-item>
      <el-form-item label="电话" class="input" prop="phone">
        <el-input
          placeholder="请输入电话"
          suffix-icon="el-icon-phone"
          v-model="ruleForm.phone"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="邮箱" class="input" prop="email">
        <el-input
          placeholder="请输入邮箱"
          suffix-icon="el-icon-message"
          v-model="ruleForm.email"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <el-button
      type="warning"
      style="width: 40vw; margin-top: 5vh"
      @click="submitForm('ruleForm')"
      >修改</el-button
    >
  </div>
</template>

<script>
export default {
  data() {
    var userphone = (rule, value, callback) => {
      let regexp = /^1[3-9][0-9]{9}$/;
      if (value  && !regexp.test(value)) {
        callback(new Error("电话不正确"));
      } else {
        callback();
      }
    };
    var checkemail = (rule, value, callback) => {
      let regexp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (value && !regexp.test(value)) {
        callback(new Error("邮箱不正确"));
      } else {
        callback();
      }
    };
    return {
      birthdaytime: '',
      ruleForm: {
        nickname: "",
        sex: "",
        birthday: '',
        phone: "",
        email: "",
        avant: "",
      },
      rules: {
        phone: [{ validator: userphone, trigger: "blur" }],
        email: [{ validator: checkemail, trigger: "blur" }],
      },
      myHeaders: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      showCalendar: false,
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(2100, 0, 31),
      currentDate: new Date(),
      imageUrl: "",
    };
  },
  methods: {
    // 移除图片
    handleRemove() {
      this.imageUrl = "";
    },
    // 上传成功回调
    handleAvatarSuccess(res) {
      if (res.code == 200) {
        this.imageUrl = `http://api.lcxcw.club/upload/${res.data.url}`;
      }
      // this.imageUrl = res.data.url;
    },
    // 上传前格式和图片大小限制
    beforeAvatarUpload(file) {
      const type =
        file.type === "image/jpeg" ||
        "image/jpg" ||
        "image/webp" ||
        "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!type) {
        this.$toast("图片格式不正确!(只能包含jpg，png，webp，JPEG)");
      }
      if (!isLt2M) {
        this.$toast("文件大小不能超过 2MB");
      }
      return type && isLt2M;
    },
    onConfirm(date) {
      this.ruleForm.birthday = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      this.birthdaytime = new Date(
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      ).getTime();
      this.showCalendar = false;
    },
    submitForm(formName) {
      let this1 = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http("user/setinfo", "POST", {
            nickname: this1.ruleForm.nickname,
            sex: this1.ruleForm.sex,
            birthday: this1.birthdaytime,
            phone: this1.ruleForm.phone,
            email: this1.ruleForm.email,
            attar: this.imageUrl.slice(this.imageUrl.lastIndexOf("/") + 1),
          }).then((res) => {
            if (res.code == 200) {
              this.$router.push('/me');
              window.location.reload();
            }
          });
        } else {
          return false;
        }
      });
    },
  },
  created() {
    this.$http("user/getinfo", "GET").then((res) => {
      if (res.code == 200) {
        this.ruleForm.nickname = res.data.nickname;
        this.ruleForm.sex = res.data.sex.toString();
        this.ruleForm.birthday =
          new Date(res.data.birthday * 1).getFullYear() +
          "-" +
          (new Date(res.data.birthday * 1).getMonth() + 1) +
          "-" +
          new Date(res.data.birthday * 1).getDate();
        this.ruleForm.phone = res.data.phone;
        this.ruleForm.email = res.data.email;
        if (res.data.attar) {
          this.imageUrl = `http://api.lcxcw.club/upload/${res.data.attar}`;
        }
      } else {
        this.$toast(res.msg);
      }
    });
  },
};
</script>

<style lang="less" scoped>
#change-info {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  text-align: center;
  .input {
    width: 90vw;
  }
  .avant {
    width: 100vw;
    height: 15vh;
    padding-top: 1vh;
  }
  .avatar-uploader {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: url("../../assets/up.jpg") no-repeat;
    background-size: 120%;
    background-position: center;
    margin: 10px auto;
    margin-bottom: 4vh;
    border: 1px solid #888;
  }
  .avatar-uploader-icon {
    font-size: 0;
    color: #fff;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar-uploader-icon:hover {
    font-size: 28px;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .avatar {
    position: relative;
    width: 80px;
    height: 80px;
    display: block;
  }
  .el-upload-action {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 0;
    color: #fff;
    text-align: center;
    line-height: 80px;
    font-size: 20px;
    background-color: rgba(66, 66, 66, 0.3);
  }
}
</style>