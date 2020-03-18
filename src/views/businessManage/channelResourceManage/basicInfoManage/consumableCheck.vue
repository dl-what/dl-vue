<template>
<!-- 耗材查看页面 -->
<div class="vlt-card consumable-page">
  <panel title="基本信息" :show="true">
    <base-info :infoList="infoList">
    <!-- <div class="base-info infoList">
      <span class="picture">图片:</span>
      <el-image class="image" v-for="(item,index) in urlList" :key="index" style="width: 100px; height: 100px" :src="item.url" fit="contain"></el-image>
    </div> -->
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
name: "consumableCheck",
data() {
return {
  urlList: [],
  showImg: false,
  showImgUrl: null,
  infoList:[
    {title:'耗材名称',value:'',prop:'goodsName'},
    {title:'耗材编号',value:'',prop:'code'},
    {title:'耗材单价',value:'',prop:'unitPrice'},
    {title:'耗材单位',value:'',prop:'deviceUnit'},
    {title:'供应商',value:'',prop:'provider'},
    {title: '厂家信息', value: '', prop: 'manufactorInfo'},
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
    console.log(data)
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
