<template>
<!-- 活动规则详情 -->
<div class="vlt-card activityRuleDetail-page">
  <panel title="基本信息" class="vlt-edit-single" :show="true" style="margin-bottom:15px">
    <basic-info v-model="form"></basic-info>
  </panel>
  <panel title="规则设置" class="vlt-edit-single" :show="true">
    <el-form
      style="margin-top:20px;"
      v-model="form.activityRule"
      labelWidth="10em"
      ref="baseForm"
      :rules="rules"
      direction="right"
      class="active-rule">
      <el-form-item label="规则对象">
        <el-select v-model="form.activityRule.ruleObject" :disabled="true">
          <el-option label="会员" value= 1></el-option>
        </el-select>
      </el-form-item>
      <el-table :data="form.activityRule.exchangeRuleList" border style="margin-left:82px;margin-top:20px;margin-bottom:20px; width:1000px" class="table-content">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="integralNum" label="积分数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.integralNum" placeholder="请输入积分数量" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="rightsId" label="兑换权益">
          <template slot-scope="scope">
            <el-select v-model="scope.row.rightsId" placeholder="请选择兑换权益" disabled>
              <el-option v-for="(item,index) in interestsOptions" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.num" placeholder="请输入数量" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="300px">
          <template slot-scope="scope">
            <el-input type="textarea" v-model="scope.row.remark" placeholder="备注" disabled maxlength="150"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="是否成为会员权益">
        <el-radio-group v-model="form.activityRule.isMemberBenefits" disabled>
          <el-radio :label="1">否</el-radio>
          <el-radio :label="2">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="会员等级" v-if="this.form.activityRule.isMemberBenefits != 1">
        <el-select v-model="form.activityRule.memberLevelName" multiple placeholder="请选择会员等级" disabled>
          <el-option v-for="(item,index) in memberLevelOptions" :key="index" :label=item.label :value=item.value></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否发布消息">
        <el-radio-group v-model="form.activityRule.isMessage" class="radio-content" disabled>
          <el-radio :label="1">不发送</el-radio>
          <el-radio :label="2">发送短信</el-radio>
          <el-radio :label="3">终端/APP推送</el-radio>
          <el-radio :label="4" style="position: absolute;">发送短信与终端/APP推送</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="消息内容" v-if="this.form.activityRule.isMessage != 1">
        <el-input type="textarea" v-model="form.activityRule.messageInfo" disabled></el-input>
      </el-form-item> -->
    </el-form>
  </panel> 
  <!-- <div class="btn-box">
    <el-button type="primary" size="medium" @click="submit">提 交</el-button>
    <el-button size="medium" @click="cancel">取 消</el-button>
  </div> -->
</div>
</template>

<script type="text/javascript">
import basicInfo from "./common/basicInfo"
export default {
name: "activityRuleDetail",
data() {
return {
  rules: {},
  // 名称  型号
  options: [],
  memberLevelOptions: [],   //会员等级
  form:{
  //基础信息
    ruleTemplateName:'',
    remark:'',
    ruleType:'',
    totalSum:'',
    activityRule: {
      ruleObject:"",
      isMemberBenefits:'',
      memberLevelName:'',
      isMessage:'',
      messageInfo:'',
      exchangeRuleList:[{integralNum: "",rightsId: '',num:"", remark:''}],
    }
  },
  // 兑换规则表格数据
    interestsOptions:[],      //兑换权益选项

}
},
components: {basicInfo},
created(){
  this.getDetail();
  this.getRightsTree();
  this.getLevelTree();
},
methods: {
  // 获取会员权益
    async getRightsTree() {
      let res = await this.$api.getRightsTreeOffLine();
      if (res && res.code == 0) {
        let list = res.data
        console.log(list)
        let arr = list.map(item =>{return {"label": item.rightsName,"value": item.rightsId}})
        this.interestsOptions = arr
      }
    },
  // 获取会员等级
  async getLevelTree() {
    let res = await this.$api.memberLevelProgramLevelTree();
    if (res && res.code == 0) {
      console.log("等级",res)
      let options = res.data.map(item =>{return {label: item.memberLevelStr, value: String(item.levelId)}});
      this.memberLevelOptions = options;
      console.log(options)
    }
  },
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
.activityRuleDetail-page{
  .btn-box{
    margin: 20px 0 80px 60px
  }
  .add-content {
		width: 1000px;
		height: 40px;
		margin: 20px 0 40px 82px;
		background: rgb(243, 239, 239);
		border: 1px dashed #aaa;
		cursor: pointer;
  }
  //  去掉查看時的字体颜色
  // .el-textarea.is-disabled .el-textarea__inner{
	// 	color: #333;
	// }
	// .el-input.is-disabled .el-input__inner {
	// 	color: #333;
  // }

}
</style>
