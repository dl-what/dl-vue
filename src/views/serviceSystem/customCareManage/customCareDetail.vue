<template>
  <div class="vlt-card">
    <panel title="客户关怀记录详情" :show="true">
      <base-info :infoList="customCareInfo"></base-info>
    </panel>
  </div>
</template>

<script type="text/javascript">

export default {
  name: "",
  data() {
    return {
      customCareInfo: [
        { title: "所属机构", value: "", prop: "insName" },
        { title: "渠道编号", value: "", prop: "channelNo" },
        { title: "发送人", value: "", prop: "accountName" },
        { title: "发送方式", value: "", prop: "sendMode" },
        { title: "发送目标", value: "", prop: "sendTarget" },
        { title: "发送状态", value: "", prop: "status" },
        { title: "发送内容", value: "", prop: "content" },
        { title: "发送时间", value: "", prop: "createTime" },
      ],
    }
  },
  created() {
    let data = this.$route.query.id;
    this.getCustomerCareDetail(data)
  },
  methods: {
    getCustomerCareDetail(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.getCustomerCareDetail({data})
        console.log(res);
				if(res && res.code == 0) {
          let options = {
            0: '未发送',
            1: '发送成功',
            2: '发送失败',
          };
          this.customCareInfo.forEach((item)=>{
            item.value = res.data[item.prop]
            if(item.prop=='status') {
              item.value = options[res.data.status]
            }
            if(item.prop=='sendTarget') {
              item.value = res.data.sendTarget==0?'按客户发送':'按标签发送';
            }
            if(item.prop=='sendMode') {
              item.value = res.data.sendMode==1?'短信':'应用推送'
            }
          })
				}
      })(data)
    },
  },
}
</script>

<style lang="less" scoped>

</style>
