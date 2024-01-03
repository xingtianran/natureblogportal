<template>
  <div>
    <span  class="label-box iconfont icon-charulianjie">热门标签</span>
    <word-cloud
      id="word-cloud"
      :data="labels"
      nameKey="name"
      :margin="margin"
      :fontSize="fontSize"
      :rotate="rotate"
      valueKey="count"
      :wordClick="wordClickHandler"
      :showTooltip="false">
    </word-cloud>
  </div>
</template>

<script>
import {getLabels, success_code} from "@/api/api";

export default {
  data(){
    return{
      rotate:{from: -10, to: 10, numOfOrientation: 10 },
      fontSize: [20, 35],
      margin:{top: 5, right: 5, bottom: 0, left: 5 },
      labels: []
    }
  },
  mounted() {
    this.getLabels()
  },
  methods:{
    getLabels(){
      getLabels().then(result => {
        if (result.code === success_code){
          this.labels = result.data
        }else {
          this.$message.error(result.message)
        }
      })
    },
    wordClickHandler(text){
      this.$router.push({path: '/search', query: {keyword: text}})
    }
  }
}
</script>

<style scoped>
.label-box{
  font-weight: bold;
  color: #A625FF;
}
</style>
