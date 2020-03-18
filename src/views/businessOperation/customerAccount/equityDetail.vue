<template>
  <div class="vlt-card">
    <section class="comp-item">
      <panel title="会员权益详情" style="margin-top: 10px;" :show="true">
        <base-info :infoList="infoList"></base-info>
      </panel>
    </section>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      infoList: [
        { title: "权益ID", value: "", prop: "rightsId" },
        { title: "权益名称", value: "", prop: "rightsName" },
        { title: "权益编码", value: "", prop: "gameName" },
        { title: "最低级别", value: "", prop: "cycleType" },
        { title: "权益状态", value: "", prop: "rightsStatus" },
        { title: "权益描述", value: "", prop: "gameName" },
        { title: "创建时间", value: "", prop: "createTime" },
        { title: "更新时间", value: "", prop: "updateTime" }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    //数据回显
    init() {
      let data = this.$route.params.param;
      this.infoList.forEach(item => {
        item.value = data[item.prop];
      });
      console.log(data);
    }
  }
};
</script>

<style lang="less" scoped>
</style>

