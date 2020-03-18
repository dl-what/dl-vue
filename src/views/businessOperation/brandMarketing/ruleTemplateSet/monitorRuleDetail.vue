<template>
<!-- 监控规则详情 -->
<div class="vlt-card monitorRuleDetail-page">
  <panel title="规则模板" :show="true" style="margin-bottom:15px">
    <div class="vlt-edit-single">
      <basic-info v-model="form"></basic-info>
    </div>
  </panel>
  <panel title="规则设置" :show="true">
    <div class="vlt-edit-single">
      <el-form
        style="margin-top:20px;"
        v-model="form.monitorRule"
        labelWidth="10em"
        ref="baseForm"
        direction="right"
        class="active-rule">
        <el-form-item label="维度选择">
          <el-checkbox-group v-model="form.monitorRule.dimensionalityName" class="checkbox-content" disabled>
            <el-checkbox v-for="(item,index) in dimOptions" :label="item.value" :key="index">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="指标选择">
          <el-checkbox-group v-model="form.monitorRule.rationName" disabled>
            <el-checkbox v-for="(item,index) in indexOptions" :label="item.value" :key="index">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
  </panel>
</div>
</template>

<script type="text/javascript">
import basicInfo from "./common/basicInfo"
export default {
name: "monitorRuleDetail",
data() {
return {
  form:{
  //基础信息
      ruleTemplateName:'',
      remark:'',
      ruleType:4,
      totalSum:'',
    monitorRule:{
      // 维度选择
      dimensionalityName:[],
      // 指标选择
      rationName:[]
    },
  },
  // 监控规则多选数据
  dimOptions:[{label: "中心", value: "1"}, {label: "省级", value: "2"}, {label: "市级", value: "3"},{label: "厅级", value: "4"},{label: "游戏终端", value: "5"}],
  indexOptions: [{label: "充值总额", value: "2"},{label: "投注总额", value: "3"},{label: "用户数", value: "4"},{label: "投注用户数", value: "5"},{label: "会员权益兑换次数",value: "6"}],
}
},
components: {basicInfo},
created(){
  this.getDetail();
  console.log(this.form.monitorRule.dimensionalityName)
},
methods: {
  async getDetail(){
    const self = this;
    const data = self.$route.query.id
    let res = await self.$api.getRuleTemplateDetail({ data })
    console.log(res)
    if (res && res.code == 0) {
      self.form = res.data
    }
  }
},
}
</script>

<style lang="less">
.monitorRuleDetail-page{
  .checkbox-content{
    & :nth-child(5){
      position: absolute;
    }
  }
  //  去掉查看時的字体颜色
  // .el-textarea.is-disabled .el-textarea__inner{
	// 	color: #333;
	// }
	// .el-input.is-disabled .el-input__inner {
	// 	color: #333;
  // }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
    border-color: #409EFF;
    background-color: #409EFF
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
    border-color: white
  }
}
</style>
