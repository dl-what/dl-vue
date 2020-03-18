<template>
<!-- 全局参数管理查看 -->
<div class="vlt-card">
  <panel title="查看详情" :show="true">
    <base-info :infoList="infoList"></base-info>
  </panel>

</div> 
</template>

<script type="text/javascript">
export default {
name: "",
data() {
return {
  infoList: [
    {title: '参数名称', value: '', prop:'parameterName'},
    {title: '参数编号', value: '', prop:'parameterCode'},
    {title: '特殊资金时间（大于等于/月）', value: '', prop:'specialFundTime'},
    {title: '参数描述', value: '', prop:'remark'},
    {title: '更新人', value: '', prop:'updateName'},
    {title: '更新时间', value: '', prop:'updateTime'},
  ]

}
},
created() {
  this.getDetail()
},
methods: {
  async getDetail() {
    const self = this;
    let data = String(self.$route.query.id);
    console.log(data)
    let res = await self.$api.globalParameterDetail({ data })
    if (res && res.code == 0) {
      console.log(res)
      self.infoList.forEach(item =>{
        item.value = res.data[item.prop]
      })
    }
  }
},
}
</script>

<style lang="less" scoped>
</style>
