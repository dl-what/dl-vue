<template>
<!-- 设施查看页面 -->
<div class="vlt-card facility-page">
  <panel :show="true" title="基本信息">
    <base-info :infoList="infoList">
    <li class="info-item" v-for="(item,index) in urlList" :key="index+item">
      <span class="title">{{`图片${index + 1}：`}}</span>
      <p class="content"><el-link type="primary" :underline="false" tag="p" style="font-size: 12px;" @click="previewImg(item)">查看</el-link></p>
    </li>
    </base-info>
  </panel>
  <el-dialog :visible.sync="showImg">
    <img width="100%" :src="showImgUrl" alt="">
  </el-dialog>
</div>
</template>

<script type="text/javascript">
export default {
name: "facilityCheck",
data() {
return {
  urlList: [],
  showImg: false,
  showImgUrl: null,
  infoList:[
    {title:'设施名称',value:'',prop:'goodsName'},
    {title:'设施编号',value:'',prop:'code'},
    {title:'设施单价',value:'',prop:'unitPrice'},
    {title:'设施单位',value:'',prop:'deviceUnit'},
    {title:'供应商',value:'',prop:'provider'},
    {title:'厂家信息', value: '', prop:'manufactorInfo'},
    // {title:'预警上限',value:'',prop:'upperLimit'},
    // {title:'预警下限',value:'',prop:'lowerLimit'},
    {title:'备注',value:'',prop:'remark'},
  ]

}
},
components: {
},
created(){
  this.getDetail()
},
methods: {
  async getDetail(){
    const data = this.$route.query.id
    console.log(data.id)
    let res = await this.$api.getDetail({data})
    console.log(res)
    if(res && res.code == 0){
      this.infoList.forEach(item=>{
        item.value = res.data[item.prop]
        if (item.prop == "unitPrice") {
          item.value = `${this.$common.thousandMark(res.data[item.prop])} 元`;
        }
      })
      this.urlList = res.data.files && res.data.files.split(",")
    }
  },
  previewImg(val) {
    this.showImg = true;
    this.showImgUrl = val;
  }
},
}
</script>

<style lang="less">
</style>
