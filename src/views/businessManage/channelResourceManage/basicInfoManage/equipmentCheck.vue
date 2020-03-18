<template>
<!-- 设备查看页面 -->
<div class="vlt-card">
<panel :show="true" title="基本信息">
    <base-info :infoList="infoList"></base-info>
</panel>
</div>
</template>

<script type="text/javascript">
export default {
name: "equipmentCheck",
data() {
return {
  infoList: [
      { title: "设备名称", value: "", prop: "goodsName" },
      { title: "设备单位", value: "", prop: "deviceUnit" },
      { title: "是否标配", value: "", prop: "isStandard" },
      { title: "是否回收", value: "", prop: "isRecovery" },
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
  async getDetail(){
    let isRecovery ={
      1:'是',
      2:'否'
    }
    let isStandard ={
      1:'是',
      2:'否'
    }
    const data = this.$route.query.id
    console.log(data)
    let res = await this.$api.getDetail({data})
    console.log(res)
    if(res && res.code == 0){
      this.infoList.forEach(item=>{
        item.value = res.data[item.prop]
        if(item.prop == 'isStandard'){
          item.value = isStandard[res.data.isStandard]
        }
        if(item.prop == 'isRecovery'){
          item.value = isRecovery[res.data.isRecovery]
        }
      })
    }
  }
},
}
</script>

<style lang="less" scoped>

</style>
