<template>
  <div>
    <div class="login-content-box">
      <div class="login-content">
        <el-row :gutter="20">
          <el-col :span="10">
            <span class="login-top-box">NATURE&nbsp;|&nbsp;注册</span>
            <el-form  id="login-content-from" label-position="right" label-width="100px">
              <el-form-item label="用户名" required>
                <el-input v-model="userInfo.userName" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="密码" required>
                <el-input v-model="userInfo.password" type="password" placeholder="请输入密码" show-password></el-input>
              </el-form-item>
              <el-form-item label="邮箱地址" required>
                <el-input placeholder="请输入邮箱地址" @change="emailChange" v-model="userInfo.email"></el-input>
              </el-form-item>
              <el-form-item id="email-captcha-box" label="邮箱验证码" required>
                <el-input placeholder="请输入邮箱验证码" v-model="registerInfo.verifyCode"></el-input>
              </el-form-item>
              <el-form-item label="人类验证码" required>
                <el-input v-model="registerInfo.captcha" placeholder="请输右侧图片验证码" @keyup.enter.native="register"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="medium" @click="registerUser" round>注&nbsp;册</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="5">
            <el-button v-if="!isVerifyVisible && !checkEmailVisible" id="email-send-box" type="success" size="medium" :key="1" @click="sendVerifyCode" round disabled>发送邮箱验证码</el-button>
            <el-button v-else-if="!isVerifyVisible" id="email-send-box" type="success" size="medium" :key="2" @click="sendVerifyCode" round>发送邮箱验证码</el-button>
            <el-button v-else id="email-send-box" type="success" size="medium" :key="3" round disabled>{{verifyCodeText}}</el-button>
            <el-image class="register-content-image" :src="captchaPath" @click="updateCaptchaKey"></el-image>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import {checkEmail, registerUser, sendVerifyCode, success_code} from "@/api/api";
import {hexMD5} from "@/plugins/md5";

export default {
  data(){
    return{
      userInfo :{
        userName: '',
        password: '',
        email: ''
      },
      registerInfo: {
        captcha:'',
        captchaKey: '',
        from: '',
        verifyCode: '',
      },
      captchaPath:'',
      verifyCodeText : '发送邮箱验证码(60)',
      isVerifyVisible : false,
      checkEmailVisible : false
    }
  },
  methods:{
    registerUser(){
      // 检查数据
      if (this.registerInfo.captcha === ''){
        this.$message.error('验证码不能为空');
        return;
      }
      if (this.registerInfo.verifyCode === ''){
        this.$message.error("邮箱验证码不能为空")
      }
      if (this.userInfo.email === ''){
        this.$message.error("邮箱地址不能为空")
      }
      if (this.userInfo.password === ''){
        this.$message.error('密码不能为空');
        return;
      }
      if (this.userInfo.userName === ''){
        this.$message.error('用户名不能为空');
        return;
      }

      this.userInfo.password = hexMD5(this.userInfo.password)
      registerUser('/user/register?verify_code=' + this.registerInfo.verifyCode + '&captcha_code=' + this.registerInfo.captcha + "&captcha_key=" + this.registerInfo.captchaKey, this.userInfo).then(result => {
        if (result.code === 20001){
          this.$message.success(result.message)
          this.$router.push('/login')
        }else {
          this.userInfo.password = ''
          this.updateCaptchaKey()
          this.$message.error(result.message)
        }
      })
    },
    updateCaptchaKey(){
      this.captchaPath = '/user/captcha?captcha_key=' + this.registerInfo.captchaKey + '&random=' + Date.parse(new Date())
    },
    emailChange(){
      // 当邮箱输入框失去焦点时，检查邮箱是否已经被注册
      if (this.userInfo.email === ''){
        this.$message.error("邮箱地址不能为空")
        return
      }
      let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
      if (!reg.test(this.userInfo.email)){
        this.$message.error("邮箱格式不正确")
        return
      }
      checkEmail('/user/email?email=' + this.userInfo.email).then(result => {
        if (result.code === success_code){
          this.$message.success(result.message)
          this.checkEmailVisible = true
        }else {
          this.$message.error(result.message)
          this.checkEmailVisible = false
        }
      })
    },
    sendVerifyCode(){
      // 检查数据
      if (this.userInfo.email === ''){
        this.$message.error("邮箱地址不能为空")
        return
      }
      let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
      if (!reg.test(this.userInfo.email)){
        this.$message.error("邮箱格式不正确")
        return
      }
      // 将发送验证码设置成倒计时
      // 定时器
      this.isVerifyVisible = true
      let count = 60
      let that = this
      let interval = setInterval( () => {
        count--;
        if (count <= 0){
          that.isVerifyVisible = false
          clearInterval(interval)
        }
        that.verifyCodeText = '发送验证码(' + count + ')'
      }, 1000)
      // 直接发送验证码
      sendVerifyCode('/user/verify_code?email_address='+this.userInfo.email+'&type=update').then(result => {
        if (result.code === success_code){
          this.$message.success(result.message)
        }else {
          this.$message.error(result.message)
        }
      })
    }
  },
  mounted() {
    this.registerInfo.captchaKey = Date.parse(new Date());
    this.updateCaptchaKey()
  }
}
</script>

<style>
.login-content-box{
  width: 1140px;
}
.login-content{
  padding: 30px 10px 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  border-radius: 4px;
  margin: 0 auto;
}


#login-content-from .el-form-item__label{
  border-bottom: solid 1px #e6e6e6;
  border-left: solid 1px #e6e6e6;
  border-top: solid 1px #e6e6e6;
}
#login-content-from .el-input__inner{
  height: 41.6px;
  line-height: 41.6px;
  border-radius: 0;
}
.register-content-image{
  height: 40px;
  margin-top: 41%;
  cursor: pointer;
  border: solid 1px #e6e6e6;
}
.login-top-box{
  font-family: "阿里妈妈方圆体 VF Regular";
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
}
#login-content-from{
  margin-top: 15px;
}
#email-send-box{
  margin-top: 80%;
}
</style>
