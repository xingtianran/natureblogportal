<template>
  <div class="about-page-box border-shadow border-radius">
    <el-tabs tab-position="left">
      <el-tab-pane label="关于天然博客(about)">
        <h3>关于天然博客</h3>
        <div style="margin-top: 6px">
          <span>
          天然博客创立于2023年10月21日。天然博客是一个学习编程的社区网站。
        </span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我们的使命(mission)">
        <h3>我们的使命</h3>
        <div style="margin-top: 6px">
          <span>
            让学习编程变得更加简单。
          </span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我们的愿景(vision)">
        <h3>我们的愿景</h3>
        <div style="margin-top: 6px">
          <span>
            让每一个热爱编程的年轻人成为优秀的程序员。
          </span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="联系方式(contacts)">
        <h3>联系我们</h3>
        <el-image id="about-image-box" src="qq.png"></el-image>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

</script>

<style>
.about-page-box{
  background-color: #FFFFFF;
  padding: 25px;
}
.about-page-box .el-tabs__item{
  color: #909399;
  line-height: 100px;
 height: 100px;
}
.about-page-box .el-tabs__item:hover{
  color: #A625FF;
}
.about-page-box .el-tabs__active-bar{
  background-color: #A625FF;
}
.about-page-box .el-tabs__item.is-active{
  color: #A625FF;
}
.about-page-box .el-tabs__content{
  color: #606266;
}
#about-image-box{
  height: 300px;
}
</style>
