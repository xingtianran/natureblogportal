<template>
  <div class="friend-link-box border-radius border-shadow">
    <div class="link-top-box">
      友情链接
    </div>
    <div class="link-bottom-box clear-fix">
      <div class="link-main-box float-left" v-for="link in links" :key="link.id">
        <a :href="'http://' + link.url">
          <el-image :title="link.name" :src="'http://8.140.252.56:2023/portal/image/' + link.logo">
          </el-image>
        </a>
      </div>
    </div>
  </div>
</template>

<script>

import {getFriendLink} from "@/api/api";

export default {
  async asyncData({params}) {
    let linkResult = await getFriendLink();
    return{
      links: linkResult.data
    }
  }
}
</script>

<style>
.friend-link-box {
  padding-top: 5px;
  padding-bottom: 25px;
  background-color: #FFFFFF;
}
.link-top-box{
  padding-top: 20px;
  text-align: center;
  font-family: "阿里妈妈方圆体 VF Regular";
  font-size: 25px;
  color: #909399;
}
.link-main-box{
  padding: 10px 25px;
  margin-top: 10px;
  margin-left: 10px;
  border: #E4E7ED solid 1px;
  cursor: pointer;
}
.link-main-box:hover{
  border: #A625FF solid 1px;
}
.link-main-box .el-image{
  width: 125px;
  height: 80px;
}
</style>
