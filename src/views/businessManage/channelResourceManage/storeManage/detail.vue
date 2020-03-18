<template>
<div class="vlt-card store-detail">
  <panel :show="true" title="基本信息">
    <base-info :infoList="infoList"></base-info>
  </panel>
  <!-- <el-row>
    <el-button type="primary" v-prevent="2000" @click= "returnBtn">确 定</el-button>
  </el-row> -->
</div>
</template>

<script type="text/javascript">
export default {
name: "detail",
data() {
return {
    infoList: [
      { title: "仓库名称", value: "", prop: "warName" },
      { title: "所属机构", value: "", prop: "insName" },
      { title: "仓库类型", value: "", prop: "warType" },
      { title: "仓库管理员", value: "", prop: "adminName" },
      { title: "备注", value: "", prop: "remark" }
    ]

}
},
components: {
},
created(){
  this.getDetail()
},
methods: {
  returnBtn(){
    this.$router.back();
  },
  getStoreType(val){
    let optino = {
      "1" : '中彩仓库',
      "2" : '省中心仓库',
      "3" : '地市仓库',
      "4" : '销售大厅'
    };
    return optino[val]
  },
  async getDetail() {
    const data = this.$route.query.id
    console.log(data)
    let res = await this.$api.detailStore({data})
    if(res && res.code == 0){
      this.infoList.forEach(item =>{
        item.value = res.data[item.prop] || '';
        if (item.prop == 'warType'){
          item.value = this.getStoreType(res.data.warType)
        }
      })
    }
      console.log(res)
  }
  }

}
</script>

<style lang="less" scop-ed>
// .store-detail{
//   .el-button{
//     margin-top:100px;
//     margin-bottom: 100px;
//     margin-left: 1400px
//   }
// }
</style>
