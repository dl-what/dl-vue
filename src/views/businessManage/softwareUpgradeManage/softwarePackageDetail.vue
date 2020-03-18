<template>
  <div class="vlt-card">
    <panel title="升级包信息" :show="true">
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
        { title: "软件名称", value: "", prop: "name" },
        { title: "升级类型", value: "", prop: "packageType" },
        { title: "软件类型", value: "", prop: "softType" },
        { title: "版本号", value: "", prop: "versionCode" },
        { title: "软件大小", value: "", prop: "softwareSize" },
        { title: "新版特性", value: "", prop: "characteristic" },
        { title: "更新字段", value: "", prop: "updateField" },
        { title: "更新时间", value: "", prop: "updateTime" },
        { title: "软件描述", value: "", prop: "remark" },
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
      this.querySoftPackageDetail(data);
    }
  },
  methods: {
    async querySoftPackageDetail(data) {
      let res = await this.$api.querySoftPackageDetail({ data });
      if (res && res.code == 0) {
        // if (res.data != null && res.data.length > 0) {
        console.log("查看结果", res);
        this.rollBack.forEach(item => {
          item.value = res.data[item.prop];
          if (item.prop == "updateTime") {
            item.value = this.translateTime(res.data[item.prop]);
          }
          if (item.prop == "softType") {
            item.value = this.translateSoftType(res.data[item.prop]);
          }
          if (item.prop == "packageType") {
            item.value = this.translatePackageType(res.data[item.prop]);
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
    translateSoftType(val){
      let options = {1:"投注终端",2: "柜员机软件",3:"维护APP"}
      return options[val]
    },
    translatePackageType(val){
      let options ={0:"全量升级",1:"增量升级"}
      return options[val]
    }
    // translateRollbackType(val){
    //   let options = {0:"所有目标",1: "指定目标",}
    //   return options[val]
    // },
  }
};
</script>

<style lang="less" scoped>
</style>
