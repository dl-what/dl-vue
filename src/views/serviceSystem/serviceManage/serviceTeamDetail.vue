<template>
  <div class="vlt-card">
    <panel title="客服小组详情" :show="true">
      <base-info :infoList="teamInfo"></base-info>
    </panel>
  </div>
</template>

<script type="text/javascript">

export default {
  name: "",
  data() {
    return {
      teamInfo: [
        { title: "小组名称", value: "", prop: "name" },
        { title: "负责内容", value: "", prop: "jobNames" },
        { title: "小组成员数", value: "", prop: "persons" },
        { title: "小组成员", value: "", prop: "userName" },
        { title: "创建人", value: "", prop: "createByName" },
        { title: "创建时间", value: "", prop: "createTime" },
      ],
    }
  },
  created() {
    let data = this.$route.query.id;
    this.getTeamDetail(data)
  },
  methods: {
    getTeamDetail(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.getTeamDetail({data})
        console.log(res);
				if(res && res.code == 0) {
          this.teamInfo.forEach((item)=>{
            item.value = res.data[item.prop]
            if(item.prop=='jobNames') {
              item.value = res.data.jobNameList.join('；')
            }
            if(item.prop=='createTime') {
              item.value = this.$moment(res.data.createTime).format('YYYY-MM-DD HH:mm:ss')
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
