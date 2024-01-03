import http from "@/api/http";

export const success_code = 20000;

export const base_url = "http://8.140.252.56:2023"
// 获取管理员信息
export const getAdminUserInfo = () => {
  if (process.client){
    return http.requestGet("/user/user_info/1176611157260107776")
  }else {
    return http.requestGet(base_url + "/user/user_info/1176611157260107776")
  }
}
// 获取全部分类信息
export const getCategories = () => {
  if (process.client){
    return http.requestGet("/portal/website/categories")
  }else {
    return http.requestGet(base_url + "/portal/website/categories")
  }
}
// 获取轮播图
export const getLoops = () => {
  if (process.client){
    return http.requestGet("/portal/website/loops")
  }else {
    return http.requestGet(base_url + "/portal/website/loops")
  }
}
// 获取置顶文章
export const getTopArticles = () => {
  if (process.client){
    return http.requestGet("/portal/article/top")
  }else {
    return http.requestGet(base_url + "/portal/article/top")
  }
}
// 获取普通文章
export const getArticles = (currentPage, pageSize, categoryId) => {
  if (process.client){
    return http.requestGet("/portal/article/list/" + currentPage + '/' + pageSize + "?categoryId=" + categoryId)
  }else {
    return http.requestGet(base_url + "/portal/article/list/" + currentPage + '/' + pageSize + "?categoryId=" + categoryId)
  }
}
// 获取标签
export const getLabels = () => {
  if (process.client){
    return http.requestGet("/portal/article/label/15")
  }else {
    return http.requestGet(base_url + "/portal/article/label/15")
  }
}

// 获取文章详情
export const getArticleInfo = (id) => {
  if (process.client){
    return http.requestGet("/portal/article/" + id)
  }else {
    return http.requestGet(base_url + "/portal/article/" + id)
  }
}
// 获取文章id
export const getComments = (id) => {
  if (process.client){
    return http.requestGet("/portal/comment/article/" + id)
  }else {
    return http.requestGet(base_url + "/portal/comment/article/" + id)
  }
}
// 获取当前用户
export const getCurrentUser = () => {
  if (process.client){
    return http.requestGet("/user/parse_token")
  }else {
    return http.requestGet(base_url + "/user/parse_token")
  }
}
// 发送评论
export const addComment = (comment) => {
  if (process.client){
    return http.requestPost("/portal/comment/",comment);
  }else {
    return http.requestPost("/portal/comment/",comment);
  }
}
// 获取评论总数
export const getCommentCount = (articleId) => {
  if (process.client){
    return http.requestGet("/portal/comment/count/" + articleId);
  }else {
    return http.requestGet("/portal/comment/count/" + articleId);
  }

}
// 获取推荐文章
export const getRecommendArticle = (articleId) => {
  if (process.client){
    return http.requestGet("/portal/article/recommend/" + articleId + '/' + '8')
  }else {
    return http.requestGet("/portal/article/recommend/" + articleId + '/' + '8')
  }
}
// 搜索文章
export const doSearch = (keyword, sort, categoryId, page, size) => {
  if (process.client){
    return http.requestGet("/portal/search?keyword=" + encodeURI(keyword) + "&page=" + page+"&size=" + size + "&sort=" + sort + "&category_id=" + categoryId)
  }else {
    return http.requestGet(base_url + "/portal/search?keyword=" + encodeURI(keyword) + "&page=" + page+"&size=" + size + "&sort=" + sort + "&category_id=" + categoryId)
  }
}
// 获取友情链接
export const getFriendLink = () => {
  if (process.client){
    return http.requestGet("/portal/website/friend_links")
  }else {
    return http.requestGet(base_url + "/portal/website/friend_links")
  }
}
// 登录
export const doLogin = (url, userInfo) => {
  return http.requestPost(url, userInfo)
}
// 检查用户
// 解析用户是否登录
export const checkUser = (url) => {
  if (process.client) {
    return http.requestGet(url)
  }else {
    return http.requestGet(base_url + url)
  }
}
// 发送邮件
export const sendVerifyCode = (url) => {
  return http.requestGet(url)
}
// 检查邮箱
export const checkEmail = (url) => {
  return http.requestGet(url)
}
export const registerUser = (url, userInfo) => {
  return http.requestPost(url, userInfo)
}
// 退出登录
export const doLogout = (url) => {
  return http.requestDelete(url)
}

// 检查用户名是否注册
export const checkUsername = (url, userName) => {
  if (process.client){
    return http.requestGet(url, userName)
  }else {
    return http.requestGet(base_url + url, userName)
  }
}
// 获取单个用户信息
export const getUserInfo = (url) =>{
  if (process.client){
    return http.requestGet(url)
  }else {
    return http.requestGet(base_url + url)
  }
}
// 修改用户信息
export const updateUserInfo = (url, user) => {
  if (process.client){
    return http.requestPut(url, user)
  }else {
    return http.requestGet(base_url + url)
  }
}
// 找回密码
export const updatePassword = (verifyCode, userInfo) => {
  if (process.client){
    return http.requestPut("/user/password/" + verifyCode, userInfo)
  }else {
    return http.requestGet(base_url + "/user/password/" + verifyCode, userInfo)
  }
}

export const getWebsiteTitle = () => {
  if (process.client){
    return http.requestGet("/portal/website/title")
  }else {
    return http.requestGet(base_url + "/portal/website/title")
  }
}

export const getWebsiteSeo = () => {
  if (process.client){
    return http.requestGet("/portal/website/seo")
  }else {
    return http.requestGet(base_url + "/portal/website/seo")
  }
}
