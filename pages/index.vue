<template>
  <div id="index-main-box" class="index-box clear-fix">
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
    <div id="main-left-box" class="content-left-box float-left border-radius border-shadow">
      <div class="user-info-box">
        <div class="avatar-box">
          <el-avatar :src="'http://8.140.252.56:2023/portal/image/' + this.userInfo.avatar"></el-avatar>
        </div>
        <div class="sign-box">
          <span>{{ userInfo.sign }}</span>
        </div>
        <div class="icon-box">
          <el-popover
            placement="bottom-start"
            title="联系方式"
            width="200"
            trigger="hover">
            <el-image src="qq.png">
            </el-image>
            <a slot="reference" class="iconfont-very-large icon-weixin"></a>
          </el-popover>
          <span><a href="https://github.com/xingtianran" target="_blank" class="iconfont-very-large icon-github"></a></span>
          <span><a href="https://space.bilibili.com/1727811460?spm_id_from=333.1007.0.0" target="_blank" class="iconfont-very-large icon-bzhan"></a></span>
        </div>
      </div>
      <div class="left-categories-box">
        <ul>
          <li :class="{'activeCss':activeVar===-1}" @click="findAllArticle"  class="border-radius">
            全部分类
          </li>
          <li :class="{'activeCss':activeVar===index}" @click="handleCategory(category.id, index)" class="border-radius" v-for="(category, index) in categories" :key="category.id">
            {{ category.name }}
          </li>
        </ul>
      </div>
    </div>
    <div id="main-center-box" class="content-main-box float-left">
      <div class="loop-box border-radius border-shadow">
        <div class="loop-image-box border-radius">
          <el-carousel trigger="click" height="320px">
            <el-carousel-item v-for="(loop, index) in loops" :key="index">
              <nuxt-link :to="`/article/${loop.targetUrl}`" target="_blank">
                <el-image :src="'http://8.140.252.56:2023/portal/image/' + loop.imageUrl" class="loop-image border-radius"></el-image>
              </nuxt-link>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="article-box">
        <div class="article-top-box">
          <ul>
            <li class="article-top-item-box border-radius border-shadow clear-fix" v-for="topArticle in topArticles"
                :key="topArticle.id">
              <div class="float-left margin-little clear-fix">
                <div class="top-article-sign-box float-left">
                  <el-tag type="success" size="small" effect="dark">置顶</el-tag>
                </div>
                <nuxt-link :to="`/article/${topArticle.id}`" target="_blank">
                  <div class="top-article-title-box float-left">{{ topArticle.title }}</div>
                </nuxt-link>
              </div>
              <div class="top-article-image-box float-right">
                <el-image fit="cover" class="border-radius" :src="'http://8.140.252.56:2023/portal/image/' + topArticle.cover"></el-image>
              </div>
              <div class="top-article-summary-box float-left">{{ topArticle.summary }}</div>
              <div class="top-article-tag-box float-left">
                <el-tag
                  v-for="label in topArticle.labels"
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
        <div v-loading="loading" element-loading-text="拼命加载中" class="article-normal-box">
          <ul>
            <li class="article-top-item-box border-radius border-shadow clear-fix" v-for="article in articles"
                :key="article.id">
              <nuxt-link :to="`/article/${article.id}`" target="_blank">
                <div class="article-title-box float-left">{{ article.title }}</div>
              </nuxt-link>
              <div class="top-article-image-box float-right">
                <el-image fit="cover" class="border-radius" :src="'http://8.140.252.56:2023/portal/image/' + article.cover"></el-image>
              </div>
              <div class="top-article-summary-box float-left">{{ article.summary }}</div>
              <div class="top-article-tag-box float-left">
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
      <div class="organize-page-box">
        <el-pagination
          background
          @current-change="currentChange"
          layout="prev, pager, next"
          :current-page.sync="pageInfo.currentPage"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total">
        </el-pagination>
      </div>
    </div>

    <div class="content-right-box float-left">
      <div class="search-box border-shadow border-radius">
        <span class="iconfont icon-sousuo">内容搜索</span>
        <el-input
          placeholder="请输入搜索内容"
          prefix-icon="el-icon-search"
          @keyup.native.enter="doSearch"
          size="small"
          v-model="searchInfo">
        </el-input>
      </div>
      <div id="label-box" class="label-cloud-box border-shadow border-radius">
        <client-only>
          <loop></loop>
        </client-only>
      </div>
      <div id="qq-box" class="qq-box border-shadow border-radius">
        <qq></qq>
      </div>
    </div>
  </div>
</template>

<script>
import {
  checkUser,
  getAdminUserInfo,
  getArticles,
  getCategories,
  getLoops,
  getTopArticles, getWebsiteSeo, getWebsiteTitle,
  success_code
} from "@/api/api";

export default {
  data() {
    return {
      categoryId: '',
      activeVar: -1,
      loading: false,
      articles:[],
      pageInfo:{
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      searchInfo: '',
    }
  },
  head(){
    return{
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.description},
        { hid: 'keywords', name: 'keywords', content: this.keywords}
      ]
    }
  },
  mounted() {
    this.openNotification()
    // 悬浮分类和标签云盒子
    this.onWindowScroll()
    window.addEventListener("scroll", this.onWindowScroll)
    let that = this
    window.onresize = function (){
      that.onWindowScroll()
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onWindowScroll)
  },
  methods: {
    handleLabel(label){
      this.$router.push({path: '/search',query: {keyword: label}})
    },
    doSearch(){
      this.$router.push({path: "/search", query: {keyword: this.searchInfo}})
    },
    findAllArticle(){
      this.activeVar = -1
      this.categoryId = ''
      this.getArticles(1)
    },
    handleCategory(id, index){
      this.activeVar = index
      this.categoryId = id
      this.pageInfo.currentPage = 1
      this.getArticles(1)
    },
    onWindowScroll(){
      let topScroll = document.documentElement.scrollTop;
      let leftScroll = document.documentElement.scrollLeft;
      // 悬浮盒子
      let leftPart = document.getElementById("main-left-box");
      let centerPart = document.getElementById("main-center-box");
      let indexPart = document.getElementById("index-main-box");
      if (leftPart && centerPart && indexPart){
        let userBaseTop = centerPart.offsetTop;
        if (topScroll <= userBaseTop){
          leftPart.style.top = userBaseTop - topScroll + 'px';
        }else {
          leftPart.style.top = '10px'
        }
        if (leftScroll > 0){
          leftPart.style.left = -leftScroll + 'px';
        }else {
          leftPart.style.left = indexPart.offsetLeft + 'px';
        }
      }
      // 悬浮热门标签
      let labelPart = document.getElementById("label-box");
      let qqPart = document.getElementById("qq-box");
      if (labelPart && qqPart){
        let labelBaseTop = qqPart.offsetTop + qqPart.offsetHeight;
        if (topScroll >= labelBaseTop){
          labelPart.style.position = "fixed";
          labelPart.style.top = "0px";
          labelPart.style.width = "248px"
        }else {
          labelPart.style.position = "";
          labelPart.style.top = "";
        }
        if (leftScroll > 0){
          labelPart.style.left = indexPart.offsetWidth + indexPart.offsetLeft - labelPart.offsetWidth - leftScroll + 'px';
        }else {
          labelPart.style.left = indexPart.offsetWidth + indexPart.offsetLeft - labelPart.offsetWidth + 'px';
        }
      }
    },
    getArticles(page){
      this.loading = true
      getArticles(page, this.pageInfo.pageSize, this.categoryId).then(result => {
        if (result.code === success_code){
          this.loading = false
          this.articles = result.data.list
          this.pageInfo.total = result.data.total
        }else {
          this.$message.error(result.message)
        }
      })
    },
    currentChange(val) {
      // 走客户端
      this.getArticles(val)
    },
    openNotification() {
      const h = this.$createElement;
      this.$notify({
        title: '重大通知',
        message: h('i', { style: 'color: teal'}, '由于缺乏经费，只能使用阿里云2核2G服务器，不能上elasticsearch，所以暂停本站搜索模块的使用。')
      });
    },
  },
  async asyncData({params}) {
    let userResult = await getAdminUserInfo();
    let categoryResult = await getCategories();
    let loopResult = await getLoops();
    let topArticleResult = await getTopArticles();
    let titleResult = await getWebsiteTitle();
    let seoResult = await getWebsiteSeo();
    let pageInfo = {
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
    let articleResult = await getArticles(pageInfo.currentPage, pageInfo.pageSize, '');
    pageInfo.total = articleResult.data.total
    return {
      userInfo: userResult.data,
      categories: categoryResult.data,
      loops: loopResult.data,
      topArticles: topArticleResult.data,
      articles: articleResult.data.list,
      pageInfo: pageInfo,
      title: titleResult.data.value,
      keywords: seoResult.data['key_website_keywords'],
      description: seoResult.data['key_website_description']
    }
  }
}
</script>

<style>
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

.index-box {
  background-color: #F2F2FA;
}

.content-left-box {
  background-color: #FFFFFF;
}

.content-main-box {
  background-color: #F2F2FA;
}

.content-right-box {
  width: 248px;
  margin-left: 15px;
  background-color: #F2F2FA;
}

.user-info-box {
  padding: 10px;
}

.avatar-box .el-avatar {
  width: 80px;
  height: 80px;
}

.avatar-box {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  margin-top: 10px;
}

.sign-box {
  color: #909399;
  text-align: center;
  margin: 0 auto;
  margin-top: 30px;
}

.icon-box {
  text-align: center;
  margin: 0 auto;
  margin-top: 30px;
}

.icon-box a {
  text-decoration: none;
  color: #909399;
  cursor: pointer;
}

.icon-box a:hover {
  color: #A625FF;
}
.icon-box a:first-child {
  margin-right: 10px;
}

.icon-box a:last-child {
  margin-left: 10px;
}

.left-categories-box {
  margin: 20px;
  color: #909399;
}

.left-categories-box li:hover {
  background-color: #F2F6FC;
  color: #A625FF;
}
.activeCss{
  background-color: #F2F6FC;
  color: #A625FF;
}
.left-categories-box li {
  cursor: pointer;
  padding-top: 6px;
  padding-bottom: 6px;
  text-align: center;
  list-style: none;
  margin: 0 auto;
}

.content-main-box {
  width: 685px;
  margin-left: 180px;
}

.loop-box {
  background-color: #FFFFFF;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 100%;
  margin: 0 auto;
}

.loop-image-box {
  border: #F2F6FC solid 1px;
  margin: 0 auto;
  width: 98%;
}

.loop-image {
  width: 100%;
}

.article-top-box li {
  list-style: none;
}

.article-top-item-box {
  padding: 10px 6px;
  margin-top: 8px;
  background-color: #FFFFFF;
}

.top-article-image-box .el-image {
  width: 120px;
  height: 100px;
  border: #F2F6FC solid 1px;
}

.top-article-title-box {
  cursor: pointer;
  margin-left: 6px;
  color: #606266;
  font-size: large;
  max-width: 88%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.top-article-title-box:hover {
  color: #A625FF;
}

.article-title-box {
  cursor: pointer;
  color: #606266;
  font-size: large;
  max-width: 88%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.article-title-box:hover {
  color: #A625FF;
}

.top-article-summary-box {
  width: 76%;
  max-width: 76%;
  margin-top: 15px;
  color: #909399;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.top-article-tag-box {
  margin-top: 15px;
}

.top-article-tag-box .el-tag {
  margin-right: 6px;
  cursor: pointer;
}

.top-article-tag-box .el-tag:hover {
  color: #A625FF;
}

.margin-little {
  margin-top: 6px;
}

.organize-page-box {
  text-align: center;
  margin-top: 10px;
}
.search-box{
  width: 100%;
  padding: 10px 6px;
  background-color: #FFFFFF;
}
.search-box span{
  font-weight: bold;
  color: #A625FF;
}
.search-box .el-input{
  margin-top: 8px;
}
.label-cloud-box{
  margin-top: 10px;
  width: 100%;
  padding: 10px 6px;
  background-color: #FFFFFF;
}

#word-cloud{
  cursor: pointer;
  height:280px;
}
.qq-box{
  margin-top: 10px;
  width: 100%;
  padding: 10px 6px;
  background-color: #FFFFFF;
}
.qq-box span{
  font-weight: bold;
  color: #A625FF;
}
.qq-box el-image{
  border-radius: 4px;
}
#main-left-box{
  position: fixed;
}
</style>
