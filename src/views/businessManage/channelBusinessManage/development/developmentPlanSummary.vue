<template>
  <div class="vlt-card">
    <plan-planProvince v-if="active==1" :activePage="active" :insData="insData"></plan-planProvince>
    <plan-planCity v-else :activePage="active" :insData="insData"></plan-planCity>
  </div>
</template>

<script type="text/javascript">
import PlanCity from "./developmentPlanCity";
import PlanProvince from "./developmentPlanProvince";
export default {
  name: "",
  data() {
   return {
     insData: {
       insId: null,
       type: null
     },
     active: null,
   }
  },
 components: {
  'plan-planCity': PlanCity,
  'plan-planProvince': PlanProvince
 },
 created () {
   this.getUserInsInfoList();
 },
 methods: {
    getUserInsInfoList() {
      const _this = this;
      (async data => {
        let res = await _this.$api.getUserInsInfoList({});
        // 返回的data 有0 时 表示有计划列表的权限 那么计划列表的tab显示，反之隐藏，
        // 同理 有一级的时候 则显示省级的数据，市级亦是如此
        if (res.data) {
          this.insData = res.data;
          console.log('insData ... ',this.insData.type,  this.insData);
          if (this.insData.type == '0') { // 如果是 0的话 中福彩 显示省级
            _this.active = 1;
            _this.insData.type = 0;
          } else if (this.insData.type == '1') { // 如果是1  省级 显示 总 市
            _this.active = 2;
            _this.insData.type = 1;
          } else {
            console.log(11);
            _this.active = 0;
             _this.$message({
              message: '您暂无权限访问市属计划汇总页面！',
              type: 'warning'
            });
          }
        }
      })();
    },
 },
}
</script>

<style lang="less" scoped>
</style>
