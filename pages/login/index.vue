<template>
  <div>
      <div class="login-content-box">
        <div class="login-content">
          <el-row :gutter="20">
            <el-col :span="10">
              <span class="login-top-box">NATURE&nbsp;|&nbsp;登录</span>
              <el-form  id="login-content-from" label-position="right" label-width="100px">
                <el-form-item label="账号" required>
                  <el-input v-model="userinfo.userName" placeholder="请输入用户名/邮箱"></el-input>
                </el-form-item>
                <el-form-item label="密码" required>
                  <el-input v-model="userinfo.password" type="password" placeholder="请输入密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="人类验证码" required>
                  <el-input v-model="loginInfo.captcha" placeholder="请输右侧图片验证码" @keyup.enter.native="doLogin"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="medium" @click="doLogin" round>登 录</el-button>
                  <el-link href="/forget" style="margin-left: 25px" type="primary">找回密码</el-link>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="5">
              <el-image class="login-content-image" :src="captchaPath" @click="updateCaptchaKey"></el-image>
            </el-col>
          </el-row>
        </div>
      </div>
  </div>
</template>

<script>
import {checkUser, doLogin} from "@/api/api";
import {hexMD5} from "@/plugins/md5";

export default {
  beforeRouteEnter(to, from, next){
    if (to.path === '/login'){
      checkUser("/user/parse_token").then(result => {
        if (result.code === 20000){
          next({path: '/'})
        }else {
          next()
        }
      })
    }
  },
  data(){
    return{
      userinfo :{
        userName: '',
        password: '',
      },
      loginInfo: {
        captcha:'',
        captchaKey: '',
        from: ''
      },
      captchaPath:'',
    }
  },
  methods:{
    printError(msg){
      this.$message({
        message: msg,
        type: 'error'
      })
    },
    doLogin(){
      // 检查数据
      if (this.loginInfo.captcha === ''){
        this.printError('验证码不能为空');
        return;
      }
      if (this.userinfo.password === ''){
        this.printError('密码不能为空');
        return;
      }
      if (this.userinfo.userName === ''){
        this.printError('用户名不能为空');
        return;
      }

      this.userinfo.password =  hexMD5(this.userinfo.password)
      doLogin('/user/login/'+ this.loginInfo.captcha + '/' + this.loginInfo.captchaKey, this.userinfo).then(result => {
        if (result.code === 20002){
          this.$message({
            message: result.message,
            type: 'success'
          })
          this.$router.push('/')
          this.$router.go(0)
        }else {
          this.userinfo.password = ''
          this.updateCaptchaKey()
          this.printError(result.message)
        }
      })
    },
    updateCaptchaKey(){
      this.captchaPath = '/user/captcha?captcha_key=' + this.loginInfo.captchaKey + '&random=' + Date.parse(new Date())
    }
  },
  mounted() {
    this.loginInfo.captchaKey = Date.parse(new Date());
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
.login-content-image{
  height: 40px;
  margin-top: 78%;
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
</style>
