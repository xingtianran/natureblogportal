<template>
  <div class="portal-total-box">
    <header class="header-nav-box clear-fix border-radius border-shadow">
      <svg class="icon float-left">
        <use xlink:href="#icon-SpringFestival-clic"></use>
      </svg>
      <div class="portal-title-box float-left ">
        <span>天然博客</span>
      </div>
      <client-only>
        <div class="portal-link-box float-right">
          <nuxt-link to="/">
          <span><a :class="{'active-css':activeVar===-1}" @click="activeNav(-1)"
                   class="iconfont-large icon-shouye">首页</a></span>
          </nuxt-link>
          <nuxt-link to="/about">
          <span><a :class="{'active-css':activeVar===1}" @click="activeNav(1)"
                   class="iconfont-large icon-guanyu">关于</a></span>
          </nuxt-link>
          <nuxt-link to="/link" id="last-link-box">
            <span><a :class="{'active-css':activeVar===2}" @click="activeNav(2)" class="iconfont-large icon-charulianjie">友情链接</a></span>
          </nuxt-link>
          <div class="user-button-box float-right">
            <div v-if="isLogin">
              <el-dropdown size="medium" @command="handleCommand">
                <div>
                  <el-avatar :src="'http://8.140.252.56:2023/portal/image/' + userInfo.avatar"></el-avatar>
                  <span class="el-dropdown-link">
                    {{userInfo.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a" icon="el-icon-user">个人信息</el-dropdown-item>
                  <el-dropdown-item v-if="isAdmin" command="b" icon="el-icon-folder-opened">管理中心</el-dropdown-item>
                  <el-dropdown-item v-else command="b" icon="el-icon-folder-opened" disabled>管理中心</el-dropdown-item>
                  <el-dropdown-item command="c" icon="el-icon-unlock">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div v-else>
              <nuxt-link to="/login">
              <span><a :class="{'active-css':activeVar===3}" @click="activeNav(3)"
                       class="iconfont icon-zhiwendenglu">登录</a></span>
              </nuxt-link>
              <nuxt-link to="/register">
                <span><a :class="{'active-css':activeVar===4}" @click="activeNav(4)" class="iconfont icon-zhuce">注册</a></span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </client-only>
    </header>
    <main class="portal-content-box">
      <nuxt/>
    </main>
    <footer class="footer-box">
      <div>
        <span>天然博客 (2023） 本网站由程序猿用爱驱动</span><br/>
        <span><a href="http://www.xtran.top/about">关于我们</a> | <a href="http://www.xtran.top/link">友情链接</a> | <a href="http://beian.mit.gov.cn/">鲁ICP备2023046780</a></span>
      </div>
    </footer>
  </div>
</template>

<script>
import {checkUser, doLogout, success_code} from "@/api/api";
export default {
  data() {
    return {
      activeVar: -1,
      isLogin: false,
      userInfo: '',
      isAdmin: false
    }
  },
  methods: {
    activeNav(index) {
      this.activeVar = index
    },
    handleCommand(command) {
      if (command === 'a') {
        this.$router.push('/info')
      }else if (command === 'b'){
        window.open("http://mp.xtran.top");
      }else if (command === 'c') {
        // 退出登录
        this.doLogout()
      }
    },
    doLogout() {
      doLogout('/user/logout').then(result => {
        if (result.code === success_code) {
          this.$message.success(result.message)
          this.$router.push("/")
          this.$router.go(0)
        } else {
          this.$message.error(result.message)
        }
      })
    }
  },
  mounted() {
    checkUser("/user/parse_token").then(result => {
      if (result.code === success_code) {
        this.isLogin = true
        this.userInfo = result.data
        if (this.userInfo.roles === 'role_admin'){
          this.isAdmin = true
        }else {
          this.isAdmin = false
        }
      } else {
        this.isLogin = false
      }
    })

  }
}
</script>

<style>
.active-css {
  color: #A625FF !important;
}

.icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

body {
  background: #F2F2FA;
}

.border-shadow {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.border-radius {
  border-radius: 4px
}

.header-nav-box {
  height: 35px;
  padding-top: 10px;
  padding-left: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #FFFFFF;
}

.clear-fix {
  overflow: hidden;
  zoom: 1;
}

.float-right {
  float: right;
}

.float-left {
  float: left;
}

* {
  padding: 0;
  margin: 0;
}

.portal-total-box {
  margin: 0 auto;
  width: 1140px;
  height: 750px;
}

.portal-content-box {
  margin-top: 10px;
  background-color: #FFFFFF;
}

.portal-link-box span {
  margin-right: 25px;
}

#last-link-box {
  margin-right: 120px;
}

.portal-link-box a {
  text-decoration: none;
  color: #606266;
}

.portal-link-box a:hover {
  color: #A625FF;
}

.portal-link-box {
  font-size: larger;
  font-weight: 520;
}

.portal-title-box {
  font-family: "阿里妈妈方圆体 VF Regular";
  font-size: larger;
  font-weight: bold;
  margin-left: 8px;
  color: #FF7F0E;
}

.user-button-box {
  margin: 0 auto;
}

.user-button-box a {
  cursor: pointer;
}

.user-button-box span {
  margin-right: 8px;
  font-size: medium;
  font-weight: 520;
}

.footer-box div {
  width: 400px;
  margin: 0 auto;
  text-align: center;
}

.footer-box {
  margin-top: 15px;
}

.footer-box span {
  color: #606266;
}

.user-button-box .el-avatar {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 28px;
  height: 28px;
  cursor: pointer;
}
.el-dropdown-link {
  cursor: pointer;
  color: #909399;
}
.el-dropdown-link:hover{
  color: #A625FF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
