<template>
  <div class="vlt-card">
    <panel title="回滚信息" :show="true">
      <base-info :infoList="rollBack"></base-info>
    </panel>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
export default {
  name: "",
  data() {
    return {
      rollBack: [
        { title: "回滚名称", value: "", prop: "name" },
        { title: "被回滚计划", value: "", prop: "upgradeName" },
        { title: "计划目标", value: "", prop: "targetType" },
        { title: "计划目标名称", value: "", prop: "targetName" },
        { title: "回滚目标", value: "", prop: "rollbackType" },
        { title: "回滚原因", value: "", prop: "remark" },
        { title: "回滚时间", value: "", prop: "updateTime" }
      ]
    };
  },
  components: {},
  created() {
    const routerQuery = this.$route.query;
    if (routerQuery && routerQuery.id) {
      let upgradeId = routerQuery.id;
      console.log("data是", upgradeId);
      let data = upgradeId;
      this.rollbackListDetail(data);
    }
  },
  methods: {
    async rollbackListDetail(data) {
      let res = await this.$api.rollbackListDetail({ data });
      if (res && res.code == 0) {
        // if (res.data != null && res.data.length > 0) {
        console.log("查看结果", res);
        // res.data.rollbackName=res.data.rollbackName.slice(1)
        console.log(res.data.rollbackName.slice(1))
        this.rollBack.forEach(item => {
          item.value = res.data[item.prop];
          if(item.prop=="targetName"){    //去掉计划目标名称前面逗号
            item.value=res.data[item.prop].slice(1)
          }
          if (item.prop == "updateTime") {
            item.value = this.translateTime(res.data[item.prop]);
          }
          if(item.prop == "rollbackType"){
            item.value = this.translateRollbackType(res.data[item.prop])
          }
          if(item.prop=="targetType"){
            item.value = this.translateTargetType(res.data[item.prop])
          }
        });
        // }
      } else {
        this.$message.warning(res.msg);
      }
    },
    handleSelectionChange() {},
    translateTime(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    translateRollbackType(val){
      let options = {0:"所有目标",1: "指定目标",}
      return options[val]
    },
    translateTargetType(val){
      let options = {0:"机构",1: "渠道",2: "设备"}
      return options[val]
    },
    cancel(){
      this.$router.back()
    }
  }
};
</script>

<style lang="less" scoped>

</style>
