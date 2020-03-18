<template>
  <div class="vlt-card developrnt-plan-info">
    <panel title="基本信息" :show="true">
      <base-info :infoList="gameData"></base-info>
    </panel>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      gameData: [
        { title: "计划时间", value: "", prop: "planDate" },
        { title: "所属机构", value: "", prop: "insName" },
        { title: "新建省级销售厅", value: "", prop: "provinceNewSellingHall"  , unit:' 个'}, // 如果获取的是市级的信息 则需要隐藏省级的信息
        { title: "新建市级销售厅", value: "", prop: "cityNewSellingHall"  , unit:' 个'}, // 如果获取的是市级的信息 则需要隐藏省级的信息
        {
          title: "省属自营厅投注机",
          value: "",
          prop: "provinceSellingMachine", unit:' 台'
        }, // 如果获取的是市级的信息 则需要隐藏省级的信息
        { title: "市级销售厅投注机", value: "", prop: "citySellingMachine", unit:' 台' },

        { title: "市属合作厅", value: "", prop: "cityCooperationHall"  , unit:' 个'},
        {
          title: "市属合作厅投注机",
          value: "",
          prop: "cityCooperationMachine", unit:' 台'
        },
        { title: "省属合作厅", value: "", prop: "provinceCooperationHall"  , unit:' 个'}, // 如果获取的是市级的信息 则需要隐藏省级的信息
        {
          title: "省属合作厅投注机",
          value: "",
          prop: "provinceCooperationMachine", unit:' 台'
        }, // 如果获取的是市级的信息 则需要隐藏省级的信息
        { title: "发展预算金额", value: "", prop: "developBudget", unit:' 元'  },
        { title: "状态", value: "", prop: "status" },
        { title: "销量计划", value: "", prop: "salesPlan"},
        { title: "计划说明", value: "", prop: "planDesc" },
        { title: '审批意见', value: '', prop: 'approvalComments'}
      ],

      planStatus: ["计划中", "已通过"]
    };
  },
  components: {},
  created() {
    const routerQuery = this.$route.query;
    if (routerQuery && routerQuery.id) {
      const data = {
        id: routerQuery.id
      };
      this.getQueryDevelopPlanInfo(data);
    }
  },
  methods: {
    getQueryDevelopPlanInfo(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getProvincePlanInfo({ data });
        if (res && res.code == 0) {
          // if (res.data != null && res.data.length > 0) {
            console.log(res);
            if (res.data != null) {
              this.gameData.forEach(item => {
                item.value = res.data[item.prop];
                if (item.prop == 'salesPlan') {
                  item.value = '' + res.data[item.prop];
                }
                if (item.prop == 'developBudget') {
                  item.value = this.$common.thousandMark(item.value*100);
                }
              })
            }
          // }
        } else {
          self.$message.warning(res.msg);
        }
      })(data);
    },
    handleSelectionChange() {}
  }
};
</script>

<style lang="less">
.developrnt-plan-info .base-info .info-list .title{
  min-width: 10em !important;
}
</style>
