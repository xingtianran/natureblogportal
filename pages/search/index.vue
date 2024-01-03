<template>
  <div class="search-page-box">
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
    <div class="search-top-box border-radius border-shadow">
      <div class="search-other-box clear-fix">
        <div class="search-logo-box float-left">
          NATURE | 搜索
        </div>
        <div class="search-input-box float-left clear-fix">
          <div class="float-left">
            <el-input @keyup.native.enter="doSearchArticle"  v-model="searchInfo.keyword" size="medium"></el-input>
          </div>
          <div class="search-button-box float-left">
            <el-button @click="doSearchArticle" size="medium" type="primary">搜索</el-button>
          </div>
        </div>
      </div>
      <div class="search-select-box">
        <div>
          <el-radio-group @input="selectedSort" size="small" v-model="searchInfo.sort">
            <el-radio-button label="">综合排序</el-radio-button>
            <el-radio-button label="2">时间</el-radio-button>
            <el-radio-button label="4">浏览量</el-radio-button>
          </el-radio-group>
        </div>
        <div>
          <el-radio-group @input="selectedCategory" size="small" v-model="searchInfo.categoryId">
            <el-radio-button label="">全部分类</el-radio-button>
            <el-radio-button :key="category.id" v-for="category in categories" :label="category.id">
              {{category.name}}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="search-main-box clear-fix">
      <div class="search-left-box float-left border-shadow border-radius">
        <el-empty description="暂无数据" :image-size="200"></el-empty>
        <div v-show="false"><span>找到约&nbsp;<span style="color: #F56C6C;">{{articleInfo.total}}&nbsp;</span>条结果</span></div>
        <div class="content-search-main-box">
          <ul>
            <li class="clear-fix" v-for="article in articleInfo.articles"
                :key="article.id">
              <nuxt-link :to="`/article/${article.id}`">
                <div class="search-title"><h3>{{ article.title }}</h3></div>
              </nuxt-link>
              <div class="search-content" v-html="article.content"></div>

              <div class="search-other">
                <span class="iconfont icon-liuyan">{{ article.createTime | formatDate('yyyy-MM-dd hh:mm:ss') }}</span>
                <span class="el-icon-view">{{ article.viewCount }}</span>
                <el-tag
                  v-for="label in article.labels"
                  :key="label"
                  size="mini"
                  type="info">
                  {{ label }}
                </el-tag>
              </div>
            </li>
          </ul>
        </div>
        <div v-show="false" class="search-select-page-box">
          <el-pagination
            background
            @current-change="currentChange"
            layout="prev, pager, next"
            :current-page.sync="articleInfo.currentPage"
            :page-size="articleInfo.pageSize"
            :total="articleInfo.total">
          </el-pagination>
        </div>
      </div>
      <div class="search-right-box float-left">
        <div class="search-right-loop-box border-shadow border-radius">
          <loop></loop>
        </div>
        <div class="search-right-qq-box border-shadow border-radius">
          <qq></qq>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {doSearch, getCategories} from "@/api/api";

export default {
  watchQuery: true,
  mounted() {
    this.openNotification()
  },
  async asyncData(params) {
    // 文章id
    let keyword = params.query.keyword
    let sort = ""
    let categoryId = ""
    let page = 1
    if (params.query.sort !== undefined && params.query.sort !== null){
      sort = params.query.sort
    }
    if (params.query.categoryId !== undefined && params.query.categoryId !== null){
      categoryId = params.query.categoryId
    }
    if (params.query.page !== undefined){
      page = params.query.page
    }
    let articleInfo = {
      articles: [],
      total: 0,
      pageSize: 5,
      currentPage: 1,
    }
    articleInfo.currentPage = Number.parseInt(page)
    // 获取全部分类
    let categoriesResult = await getCategories();

    //let articlesResult = await doSearch(keyword, sort, categoryId, articleInfo.currentPage, articleInfo.pageSize)

    //articleInfo.articles = articlesResult.data.content;
    //articleInfo.total = articlesResult.data.totalElements;

    let searchInfo ={
      keyword: '',
      sort: "",
      categoryId: ''
    }
    searchInfo.keyword = keyword
    searchInfo.sort = sort
    searchInfo.categoryId = categoryId
    return {
      articleInfo: articleInfo,
      searchInfo: searchInfo,
      categories: categoriesResult.data,
    }
  },
  methods:{
    openNotification() {
      const h = this.$createElement;
      this.$notify({
        title: '重大通知',
        message: h('i', { style: 'color: teal'}, '由于缺乏经费，只能使用阿里云2核2G服务器，不能上elasticsearch，所以暂停本站搜索模块的使用。')
      });
    },
    currentChange(){
      this.$router.push({path: '/search', query: {keyword: this.searchInfo.keyword, sort: this.searchInfo.sort, categoryId: this.searchInfo.categoryId, page: this.articleInfo.currentPage}})
    },
    selectedSort(){
      this.$router.push({path: '/search', query: {keyword: this.searchInfo.keyword, sort: this.searchInfo.sort, categoryId: this.searchInfo.categoryId}})
    },
    selectedCategory(){
      this.$router.push({path: '/search', query: {keyword: this.searchInfo.keyword, sort: this.searchInfo.sort, categoryId: this.searchInfo.categoryId}})
    },
    doSearchArticle(){
      if (this.searchInfo.keyword === ''){
        this.$message.warning("搜索内容不能为空")
        return
      }
      this.$router.push({path: '/search', query: {keyword: this.searchInfo.keyword}})
    }
  }
}
</script>

<style>
.search-page-box {
  width: 100%;
  background-color: #F2F6FC;
}

.search-top-box {
  margin-top: 15px;
  width: 100%;
  background-color: #FFFFFF;
}

.search-other-box {
  width: 500px;
  line-height: 100px;
  margin: 0 auto;
  border-bottom: #E4E7ED solid 1px;
}

.search-logo-box {
  font-family: "阿里妈妈方圆体 VF Regular";
  font-size: 25px;
  font-weight: bold;
  color: #409EFF;
}

.search-input-box {
  margin-left: 20px;
}

.search-button-box {
  margin-left: 10px;
}

.search-main-box {
  margin-top: 15px;
}

.search-left-box {
  padding: 10px;
  width: 760px;
  background-color: #FFFFFF;
}

.search-right-box {
  width: 330px;
  margin-left: 15px;
}
.search-right-loop-box{
  background-color: #FFFFFF;
  padding: 8px;
  width: 100%;
}
.search-right-qq-box{
  background-color: #FFFFFF;
  margin-top: 10px;
  padding: 8px;
  width: 100%;
}
.content-main-box li {
  padding-bottom: 8px;
  border-bottom: #EBEEF5 solid 1px;
  margin-top: 15px;
}

.search-title {
  color: #303133;
  cursor: pointer;
}

.search-title:hover {
  color: #A625FF;
}

.search-content {
  color: #606266;
  margin-top: 15px;
  max-width: 760px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.search-other {
  margin-top: 15px;
}

.search-other .el-tag {
  margin-left: 10px;
  cursor: pointer;
}

.search-other .el-tag:hover {
  color: #A625FF;
}

.search-other span {
  color: #909399;
  margin-right: 8px;
}
.content-search-main-box{
  margin-top: 20px;
}
.content-search-main-box a {
  text-decoration: none;
}
.content-search-main-box li{
  margin-top: 20px;
  padding-bottom: 20px;
  border-bottom: #EBEEF5 solid 1px;
}
.search-left-box > div:first-child span{
  color: #909399;
}
.search-select-box{
  padding: 25px;
  width: 100%;
}
.search-select-box .el-radio-button{
  margin-right: 15px;
}
.search-select-box .el-radio-button__inner{
  border-radius: 4px;
  border: 0;
}
.search-select-box .el-radio-button:first-child .el-radio-button__inner{
  border: 0;
  border-radius: 4px;
}
.search-select-box .el-radio-button:last-child .el-radio-button__inner{
  border-radius: 4px;
}
.search-select-box > div:last-child{
  margin-top: 15px;
}
.search-select-page-box{
  margin-top: 15px;
  text-align: center;
}
</style>
