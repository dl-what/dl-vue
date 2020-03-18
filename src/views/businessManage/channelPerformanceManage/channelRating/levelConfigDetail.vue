<template>
  <div class="vlt-card">
    <panel :show="true" title="基本信息">
      <base-info :infoList="infoList"></base-info>
    </panel>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "levelConfigDetail",
  data() {
    return {
      infoList: [
        { title: "等级名称", value: "", prop: "chLevelName" },
        { title: "等级分值", value: "", prop: "chGradeScore" },
        { title: "生效日期", value: "", prop: "workTime" },
        { title: "等级描述", value: "", prop: "chGradeDesc" },
        { title: "状态", value: "", prop: "chGradeStatus" }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let res = await this.$api.ChannelGradeInfoDetail({
        data: this.$route.query.id
      });
      if (res && res.code === 0) {
        this.infoList.forEach(item => {
          item.value = res.data[item.prop];
          if (item.prop === "chGradeScore") {
            item.value = res.data.chGradeScoreS + "~" + res.data.chGradeScoreE;
          }
          if (item.prop === "chGradeStatus") {
            item.value = res.data.chGradeStatus === 0 ? "关闭" : "开启";
          }
        });
      }
      console.log(res);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
