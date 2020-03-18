<template>
  <div class="partner-container">
    <panel class="info-panel" title="基本信息" :show="true">
      <base-info :infoList="baseInfoList"></base-info>
    </panel>
    <panel class="info-panel" title="考核规则" :show="true">
      <el-form ref="form" :model="ruleInfoForm" :inline="true" size="small" label-width="80px">
        <div v-for="(formItem, index) in ruleInfoForm.ruleCoefficientVO" :key="index" class="mt15">
          <el-form-item label="渠道规模">
            <el-col :span="10">
              <el-input v-model="formItem.lowestValue" placeholder="请输入最低值" disabled></el-input>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="10">
              <el-input v-model="formItem.highestValue" placeholder="请输入最高值" disabled></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="计算系数">
            <el-col :span="14">
              <el-input v-model="formItem.coefficient" placeholder="请输入百分比" disabled>
                <template slot="append">%</template>
              </el-input>
            </el-col>
          </el-form-item>
        </div>
      </el-form>
    </panel>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'partnerRuleDetail',
  data() {
    return {
      baseInfoList: [
        {title: "考核规则名称", value: "", prop: "ruleName" },
        {title: "生效时间", value: "", prop: "effectiveTime" },
        {title: "规则描述", value: "", prop: "ruleDesc" },
        {title: "创建时间", value: "", prop: "createTime" },
        {title: "更新时间", value: "", prop: "updateTime" },
      ],
      ruleInfoForm: {
        ruleCoefficientVO: []
      }
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 获取详情
    async getDetail() {
      const res = await this.$api.getPartnerRuleDetail({
        data: {
          id: this.$route.query.id
        }
      })
      if (res && res.code === 0) {
        this.setInfoList(res.data, 'baseInfoList');
        res.data.ruleCoefficientVO.forEach(item => {
          this.ruleInfoForm.ruleCoefficientVO.push(item);
        })
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
        if(item.prop=='effectiveTime') {
          item.value = `${detail.startTime} ~ ${detail.endTime}`
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
