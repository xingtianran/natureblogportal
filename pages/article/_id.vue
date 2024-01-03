<template>
  <div id="article-detail-main-box" class="article-detail-box clear-fix">
    <el-backtop :bottom="100">
      <div
        style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #A625FF;
      }"
      >
        UP
      </div>
    </el-backtop>
    <div class="clear-fix">
      <div id="article-detail-main-box" class="article-detail-main-box float-left border-radius border-shadow">
        <div class="article-detail-title-box">
          <h2>{{ article.title }}</h2>
        </div>
        <div class="article-detail-user-box clear-fix">
          <div class="clear-fix">
            <div class="user-info-box float-left clear-fix">
              <el-avatar class="float-left" :src="'http://8.140.252.56:2023/portal/image/' + this.article.natureUser.avatar"></el-avatar>
              <span class="float-left">{{ article.natureUser.userName }}</span>
            </div>
            <div class="article-time-box float-left">
              <span class="iconfont icon-liuyan">{{ article.createTime | formatDate('yyyy-MM-dd hh:mm:ss') }}</span>
              <span class="el-icon-view">{{ article.viewCount }}</span>
            </div>
          </div>
          <div class="article-label-box">
            <el-tag
              v-for="label in article.labels"
              :key="label"
              size="mini"
              type="info">
              {{ label }}
            </el-tag>
          </div>
        </div>
        <div class="article-detail-nav-box">
          <h3>文章目录</h3>
          <div class="article-outline-box">
            <outline-tree :treeData="navTree" class="tree" ref="tree">
              <div slot-scope="{ data, parentData, level }">
                <div
                  class="node-render-content"
                  @click.stop="jumpToAnchor(data.el)">
                  {{ data.title }}
                </div>
              </div>
            </outline-tree>
          </div>
        </div>
        <div id="article-detail-content-box" class="article-detail-content-box">
        <pre v-highlightjs>
          <div class="main-content-box"
               v-outline="{
                            callback: refreshNavTree,
                            selectors: ['h1', 'h2', 'h3','h4','h5','h6']
                         }" v-html="article.content">

          </div>
        </pre>
        </div>
      </div>
      <div class="right-other-box float-left">
        <div class="right-label-box border-radius border-shadow">
          <client-only>
            <loop></loop>
          </client-only>
        </div>
        <div id="article-qq-box" class="article-qq-box border-radius border-shadow">
          <div>
            <span class="iconfont icon-guanyu1">联系方式</span>
            <el-image src="http://8.140.252.56:2023/portal/image/1700357842060_1175731535337226240.png">
            </el-image>
          </div>
        </div>
        <div id="article-main-nav-box" class="article-float-outline-box border-radius border-shadow">
          <span class="iconfont icon-bzhan">文章目录</span>
          <div class="float-outline-main-box">
            <el-tabs @tab-click="handleClick" v-model="activeName" :tab-position="tabPosition" style="height: 400px">
              <el-tab-pane :name="'tab'+index"
                           :class="item.lev"
                           v-for="(item, index) in navList"
                           :key="index"
                           :label="item.name"></el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <client-only>
      <div class="article-comment-box border-radius border-shadow">
        <div class="article-comment-main-box">
          <h3>评论总数 {{commentCount}}</h3>
          <div class="comment-top-part clear-fix">
            <div class="comment-avatar-box float-left">
              <el-image :src="'http://8.140.252.56:2023/portal/image/' + this.currentUser.avatar"></el-image>
            </div>
            <div class="comment-input-box float-left">
              <el-input @keyup.native.enter="sendComment" :placeholder="'评论' + article.natureUser.userName + '...'" v-model="comment.content" :rows="5" type="textarea" :maxlength="128" show-word-limit></el-input>
              <el-button @click="sendComment" class="float-right" type="success" size="mini">发送</el-button>
            </div>
          </div>
          <div class="comment-main-part-box">
            <div v-for="(parent, index) in comments" :key="index" class="comment-parent-part-box">
              <div class="parent-box">
                <div class="parent-avatar-box float-left">
                  <el-image :src="'http://8.140.252.56:2023/portal/image/' + parent.natureUser.avatar"></el-image>
                </div>
                <div class="parent-username-box float-left">
                  <span>{{parent.natureUser.userName}}</span>
                </div>
                <div class="parent-content-box parent-content-box">
                  <span>{{parent.content}}</span>
                </div>
                <div class="parent-other-box clear-fix">
                  <span class="iconfont icon-liuyan">{{parent.createTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                  <span><el-link @click="sendCommonComment(parent.id, parent.natureUser.userName)" type="primary">回复</el-link></span>
                </div>
              </div>
              <div class="comment-child-part-box">
                <div v-for="(child, index) in parent.childComment" :key="index" class="child-box">
                  <div class="child-avatar-box float-left">
                    <el-image :src="'http://8.140.252.56:2023/portal/image/' + child.natureUser.avatar"></el-image>
                  </div>
                  <div class="child-username-box float-left">
                    <span>{{child.natureUser.userName}}</span>
                    <span>回复</span>
                    <span>{{parentUserName(parent, child.parentId)}}</span>
                  </div>
                  <div class="child-content-box">
                    <span>{{child.content}}</span>
                  </div>
                  <div class="child-other-box">
                    <span class="iconfont icon-liuyan">{{child.createTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                    <span><el-link @click="sendCommonComment(child.id, child.natureUser.userName)" type="primary">回复</el-link></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </client-only>
    <client-only>
      <div class="article-recommend-part-box border-radius border-shadow">
        <h3>推荐文章</h3>
        <div class="article-recommend-main-box">
          <ul>
            <li class="clear-fix" v-for="article in articles"
                :key="article.id">
              <nuxt-link :to="`/article/${article.id}`">
                <div class="recommend-title"><h3>{{ article.title }}</h3></div>
              </nuxt-link>
              <div class="recommend-summary">{{ article.summary }}</div>

              <div class="recommend-other">
                <span class="iconfont icon-liuyan">{{ article.createTime | formatDate('yyyy-MM-dd hh:mm:ss') }}</span>
                <span class="el-icon-view">{{article.viewCount}}</span>
                <el-tag
                  v-for="label in article.labels"
                  :key="label"
                  @click="handleLabel(label)"
                  size="mini"
                  type="info">
                  {{ label }}
                </el-tag>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </client-only>

    <div>
      <el-dialog
        title="回复评论"
        :center="true"
        :visible.sync="commentVisible"
        width="30%"
        :before-close="handleClose">
        <div>
          <el-input @keyup.native.enter="addCommonComment" :placeholder="placeholder" v-model="commonComment.content" :rows="3" type="textarea" :maxlength="128" show-word-limit></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="commentVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="addCommonComment">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  addComment,
  getArticleInfo,
  getCommentCount,
  getComments,
  getCurrentUser,
  getRecommendArticle,
  success_code
} from "@/api/api";

export default {
  data() {
    return {
      articles: [],
      placeholder:'',
      navTree: [],
      activeName: 'tab0',
      tabPosition: 'right',
      scroll: '',
      navList: [],
      currentUser: '',
      comments: [],
      comment:{
        articleId:'',
        content:'',
        parentId:'',
        userId: ''
      },
      commonComment:{
        articleId:'',
        content:'',
        parentId:'',
        userId: ''
      },
      id:'',
      commentVisible: false,
      commentCount: 0,
      isLogin: false,
    }
  },
  head(){
    return{
      title: this.article.title,
      meta: [
        { hid: 'description', name: 'description', content: this.article.summary},
        { hid: 'keywords', name: 'keywords', content: this.article.label}
      ]
    }
  },
  async asyncData({params}) {
    // 文章id
    let { id } = params
    let articleResult = await getArticleInfo(id)
    return {
      article: articleResult.data
    }
  },
  methods: {
    handleLabel(label){
      this.$router.push({path: '/search',query: {keyword: label}})
    },
    handleClose(){
      this.commonComment.content  = ''
      this.commonComment.parentId = ''
    },
    addCommonComment(){
      if (this.commonComment.content === ''){
        this.$message.error("评论内容不能为空")
        return
      }
      addComment(this.commonComment).then( result => {
        if (result.code === success_code){
          this.$message.success(result.message)
          this.commonComment.content  = ''
          this.commonComment.parentId = ''
          this.commentVisible = false
          this.getComments(this.id)
          this.getCommentCount()
        }else {
          this.$message.error(result.message)
        }
      })
    },
    sendCommonComment(parentId, userName){
      if (!this.isLogin){
        this.$confirm('您还没有登录, 是去登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.$router.push('/login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消登录'
          });
        });
        return
      }
      this.commentVisible = true
      this.commonComment.userId = this.currentUser.id
      this.commonComment.parentId = parentId
      this.placeholder= '回复' +  userName + '...'
    },
    sendComment(){
      if (!this.isLogin){
        this.$confirm('您还没有登录, 是去登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.$router.push('/login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消登录'
          });
        });
        return;
      }
      this.comment.articleId = this.id
      this.comment.userId = this.currentUser.id
      if (this.comment.content === ''){
        this.$message.error("评论内容不能为空")
        return
      }
      addComment(this.comment).then( result => {
        if (result.code === success_code){
          this.$message.success(result.message)
          this.comment.content  = ''
          this.getComments(this.id)
          this.getCommentCount()
        }else {
          this.$message.error(result.message)
        }
      })
    },
    parentUserName(parent, parentId){
      let parentName = ''
      if (parent.id === parentId){
        parentName = parent.natureUser.userName
        return parentName
      }
      parent.childComment.forEach(item => {
        if (item.id === parentId){
          parentName = item.natureUser.userName
        }
      })
      return parentName
    },
    jumpToAnchor(element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
    },
    refreshNavTree(treeData) {
      this.navTree = treeData
    },
    handleClick(tab, event) {
      this.jump(tab.index)
    },
    dataScroll: function () {
      this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
    },
    jump(index) {
      let content = document.getElementsByClassName("article-detail-content-box");
      let jump = content[0].querySelectorAll("h1,h2,h3,h4,h5,h6");
      // 获取需要滚动的距离
      let total = jump[index].offsetTop - 80;
      // Chrome
      document.body.scrollTop = total;
      // Firefox
      document.documentElement.scrollTop = total;
      // Safari
      window.pageYOffset = total;
      // $('html, body').animate({
      // 'scrollTop': total
      // }, 400);
    },
    loadScroll: function () {
      let self = this;
      let navs = document.querySelectorAll('.el-tabs__item');
      // var sections = document.getElementsByClassName('section');
      for (var i = self.navList.length - 1; i >= 0; i--) {
        if (self.scroll >= self.navList[i].offsetTop - 120) {
          self.activeName = 'tab' + i
          break;
        }
      }
    },
    selectAllTitle() {
      let content = document.getElementsByClassName("article-detail-content-box");
      let title = content[0].querySelectorAll("h1,h2,h3,h4,h5,h6");
      this.navList = Array.from(title);
      this.navList.forEach(item => {
        item.name = item.innerHTML
      })
      this.navList.forEach(el => {
        let index = el.localName.indexOf('h');
        el.lev = 'lev' + el.localName.substring(index + 1, el.localName.length)
      });
    },
    onWindowScrollNav(){
      let topScroll = document.documentElement.scrollTop;
      let leftScroll = document.documentElement.scrollLeft;
      // 悬浮盒子
      let indexPart = document.getElementById("article-detail-main-box");
      // 悬浮目录盒子
      let navPart = document.getElementById("article-main-nav-box");
      let qqPart = document.getElementById("article-qq-box");
      if (navPart && qqPart){
        let labelBaseTop = qqPart.offsetTop + qqPart.offsetHeight;
        if (topScroll >= labelBaseTop){
          navPart.style.position = "fixed";
          navPart.style.top = "0px";
          navPart.style.width = "271px"
        }else {
          navPart.style.position = "";
          navPart.style.top = "";
        }
        if (leftScroll > 0){
          navPart.style.left = indexPart.offsetWidth + indexPart.offsetLeft - navPart.offsetWidth - leftScroll + 'px';
        }else {
          navPart.style.left = indexPart.offsetWidth + indexPart.offsetLeft - navPart.offsetWidth + 'px';
        }
      }
    },
    getComments(id){
      getComments(id).then(result => {
        this.comments = result.data
      })
    },
    getCommentCount(){
      getCommentCount(this.id).then(result => {
        this.commentCount = result.data
      })
    },
    getRecommendArticle(){
      getRecommendArticle(this.id).then(result => {
        this.articles = result.data
      })
    }
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.onWindowScrollNav)
  },
  watch: {
    scroll: function () {
      this.loadScroll()
    }
  },

  mounted() {
    // 固定页面
    let id = this.$route.params.id
    this.id = id
    this.commonComment.articleId = id
    this.getComments(id)
    this.getCommentCount()
    this.getRecommendArticle()
    getCurrentUser().then(result => {
      if (result.code === success_code){
        this.isLogin = true
        this.currentUser = result.data
      }
    })
    // 控制目录盒子浮动
    this.onWindowScrollNav()
    window.addEventListener("scroll", this.onWindowScrollNav)
    let that = this
    window.onresize = function (){
      that.onWindowScrollNav()
    }
    // scroll代表滚动条距离页面顶部距离
    window.addEventListener('scroll', this.dataScroll);
    this.selectAllTitle();
    this.$nextTick(() => {
      setTimeout(() => {
        let navs = document.querySelectorAll('.el-tabs__item');
        for (let i = navs.length - 1; i >= 0; i--) {
          // console.log($('#'+navs[i].id))
          // 从lev1到lev5分别添加不同到样式
          document.querySelector('#' + navs[i].id).style.padding = "0";
          if (this.navList[i].lev == 'lev1') {
            document.querySelector('#' + navs[i].id).style.paddingLeft = "20px";
          } else if (this.navList[i].lev == 'lev2') {
            document.querySelector('#' + navs[i].id).style.paddingLeft = "35px";
          } else if (this.navList[i].lev == 'lev3') {
            document.querySelector('#' + navs[i].id).style.paddingLeft = "50px";
          } else if (this.navList[i].lev == 'lev4') {
            document.querySelector('#' + navs[i].id).style.paddingLeft = "65px";
            document.querySelector('#' + navs[i].id).style.fontWeight = "400";
          } else if (this.navList[i].lev == 'lev5') {
            document.querySelector('#' + navs[i].id).style.paddingLeft = "80px";
            document.querySelector('#' + navs[i].id).style.fontWeight = "400";
          }
        }
      });
    });
  }
}
</script>
<style>
.article-detail-box {
  background-color: #F2F2FA;
}

.article-detail-main-box {
  width: 800px;
  padding: 20px;
  background-color: #FFFFFF;
}

.article-detail-title-box {
  color: #303133;
}

.article-detail-user-box {
  margin-top: 20px;
}

.article-detail-user-box .user-info-box {
  padding: 0;
  width: 90px;
  height: 25px;
  line-height: 25px;
}

.article-detail-user-box .user-info-box span {
  color: #606266;
  font-weight: bold;
  margin-left: 5px;
}

.article-detail-user-box .el-avatar {
  width: 25px;
  height: 25px;
}

.article-detail-user-box .article-time-box {
  color: #909399;
}

.article-detail-user-box .article-label-box {
  margin-top: 10px;
}

.article-label-box .el-tag {
  cursor: pointer;
  margin-left: 10px;
}

.article-label-box .el-tag:hover {
  color: #A625FF;
}

.article-time-box {
  height: 25px;
  line-height: 25px;
}

.article-detail-nav-box {
  margin-top: 20px;
  padding: 10px;
}

.article-detail-nav-box h3 {
  color: #303133;
}

.article-outline-box {
  width: 40%;
  margin-left: 30px;
}

.article-outline-box .tree-container {
  width: 100%;
}

.article-outline-box .node-render-content {
  margin-top: 8px;
  cursor: pointer;
  color: #909399;
}

.article-outline-box .node-render-content:hover {
  color: #A625FF;
}

.article-detail-content-box {
  margin-top: 20px;
}

.main-content-box {
  padding: 10px;
}

.right-other-box {
  margin-left: 15px;
  width: 284px;
}

.right-label-box {
  padding: 8px;
  background-color: #FFFFFF;
}

.article-qq-box {
  background-color: #FFFFFF;
  margin-top: 15px;
  padding: 10px 6px;
}

.article-float-outline-box {
  background-color: #FFFFFF;
  margin-top: 15px;
  padding: 10px 6px;
}

.article-float-outline-box span {
  color: #A625FF;
  font-weight: bold;
}

.float-outline-main-box {
  margin-top: 20px;
}
.float-outline-main-box .el-tabs__item{
  color: #909399;
}

.float-outline-main-box .el-tabs__item:hover{
  color: #A625FF;
}
.float-outline-main-box .el-tabs__item.is-active{
  color: #A625FF;
}
.float-outline-main-box .el-tabs__active-bar{
  background-color: #A625FF;
}
.article-comment-box{
  margin-top: 15px;
  clear: both;
  background-color: #FFFFFF;
  width: 800px;
  padding: 20px;
}
.article-comment-main-box .el-image{
  width: 35px;
  height: 35px;
  border-radius: 50%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.comment-avatar-box{
  margin-right: 5px;
}

.comment-input-box{
  margin-left: 8px;
  width: 90%;
}
.comment-top-part{
  width: 90%;
  margin: 0 auto;
  margin-top: 20px;
}
.article-comment-main-box h3{
  font-weight: bold;
  color: #A625FF;
}
.comment-input-box .el-button{
  margin-top: 5px;
}
.comment-main-part-box{
  padding: 10px;
  margin-top: 20px;
}
.parent-content-box{
  clear: both;
}
.parent-box{
  margin-top: 25px;
}
.parent-box .el-image{
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
.parent-box .parent-username-box {
  margin: 0 auto;
  margin-top: 8px;
  margin-left: 8px;
  color: #909399;
}
.parent-box .parent-content-box{
  margin-left: 50px;
  margin-top: 10px;
  color: #606266;
}
.parent-box .parent-other-box{
  margin-left: 50px;
  margin-top: 10px;
  color: #909399;
}
.comment-child-part-box{
  margin-top: 25px;
  margin-left: 80px;
}
.child-username-box {
  margin: 0 auto;
  margin-top: 8px;
  margin-left: 8px;
  color: #909399;
}
.child-content-box{
  clear: both;
  margin-left: 50px;
  margin-top: 10px;
  color: #606266;
}
.child-other-box{
  margin-left: 50px;
  margin-top: 10px;
  color: #909399;
}
.parent-other-box .el-link{
  margin-left: 5px;
  margin-bottom: 3px;
}
.child-other-box .el-link{
  margin-left: 5px;
  margin-bottom: 3px;
}
.article-detail-box .el-dialog__header{
  padding: 0;
}
.article-detail-box .el-dialog__body{
  margin-top: 10px;
  padding: 0;
}
.article-detail-box .el-dialog__footer{
  margin-top: 10px;
  padding: 0;
}
.article-detail-box .el-dialog__title{
  color: #409EFF;
}
.article-detail-box .el-dialog{
  padding: 12px;
}
.article-detail-box .el-dialog__headerbtn .el-dialog__close{
  display: none;
}
.article-recommend-part-box{
  margin-top: 15px;
  background-color: #FFFFFF;
  width: 800px;
  padding: 20px;
}
.article-recommend-part-box > h3{
  font-weight: bold;
  color: #A625FF;
}
.article-recommend-main-box{
  margin-top: 20px;
}
.article-recommend-main-box li{
  padding-bottom: 8px;
  border-bottom: #EBEEF5 solid 1px;
  margin-top: 15px;
}
.recommend-title{
  color: #303133;
cursor: pointer;
}
.recommend-title:hover{
color: #A625FF;
}
.recommend-summary{
  color: #606266;
  margin-top: 15px;
}
.recommend-other{
  margin-top: 15px;
}
.recommend-other .el-tag{
  margin-left: 10px;
  cursor: pointer;
}
.recommend-other .el-tag:hover{
  color: #A625FF;
}
.recommend-other span{
  color: #909399;
  margin-right: 8px;
}
.article-recommend-main-box a{
  text-decoration: none;
}
.article-qq-box span{
  font-weight: bold;
  color: #A625FF;
}
.article-qq-box .el-image{
  border-radius: 4px;
}
</style>
