<template>
  <div class="partner-container">
    <panel class="info-panel" title="基本信息" :show="true">
      <base-info :infoList="baseInfoList"></base-info>
    </panel>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'partnerAssessmentDetail',
  data() {
    return {
      baseInfoList: [
        {title: "等级名称", value: "", prop: "gradeName" },
        {title: "等级最小分值", value: "", prop: "minScore" },
        {title: "等级最大分值", value: "", prop: "maxScore" },
        {title: "生效时间", value: "", prop: "effectiveTime" },
        {title: "等级描述", value: "", prop: "gradeDesc" },
        {title: "创建时间", value: "", prop: "createTime" },
        {title: "更新时间", value: "", prop: "updateTime" },
      ],
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 获取详情
    async getDetail() {
      const res = await this.$api.getPartnerLevelDetail({
        data: {
          id: this.$route.query.id
        }
      })
      if (res && res.code === 0) {
        this.setInfoList(res.data, 'baseInfoList');
      }
    },
    // 设置面板数据
    setInfoList(detail, infoListName) {
      this[infoListName].forEach(item => {
        const val = detail[item.prop];
        this.$set(item, 'value', val);
        if (item.prop === 'createTime') {
          this.$set(item, 'value', moment(detail.createTime).format("YYYY-MM-DD HH:mm:ss"));
        }
        if (item.prop === 'updateTime') {
          this.$set(item, 'value', moment(detail.updateTime).format("YYYY-MM-DD HH:mm:ss"));
        }
      })
    },
  }
}
</script>


<style lang="less" scoped>
@import "./less/index.less";
</style>
