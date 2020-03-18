<template>
<div class="vlt-edit-single wrap">
  <div class="vlt-edit-wrap">
    <el-form :model="baseForm" :disabled="type" label-width="9em" ref="baseForm" :rules="rules" direction="right" class="demo-ruleForm">
      <el-form-item label="规则模板名称" prop="ruleTemplateName" style="margin-top:20px">
        <el-input v-model="baseForm.ruleTemplateName" placeholder="请输入规则模板名称" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="规则类型" prop="ruleType">
        <el-select v-model="baseForm.ruleType" placeholder="请选择规则类型" :disabled="isShow">
          <el-option v-for="(item,index) in ruleOptions" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合计金额(元)" v-if="baseForm.ruleType === 2" prop="totalMoney">
        <el-input v-model="baseForm.totalSum" placeholder="合计金额" disabled></el-input>
      </el-form-item>
      <el-form-item label="规则简介" prop="remark">
        <el-input type="textarea" v-model="baseForm.remark" :autosize="{minRows: 3}" maxlength="150" placeholder="请输入参与活动的规则、要求等"></el-input>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script type="text/javascript">
export default {
name: "basicInfo",
model: {
    prop: 'baseForm',
    event: 'returnBack'
  },
  props: {
    baseForm: {
      type: Object,
      default: ()=>{}
    },
  },
data() {
return {
  rules: { 
    ruleTemplateName: [{required: true,validator: this.$rules.checkName,  title: '规则模板名称', trigger: ['change','blur']},{ min: 5, max: 15, message: '请输入规则模板名称，长度在 5 到 15 个字符', trigger: ['change','blur'] }],
    remark: [{required: true, message: '请输入规则简介', trigger: ['change','blur']}],
    ruleType: [{required: true, message: '请选择规则类型', trigger: ['change','blur']}],
    // totalMoney: [{required: true, message: '请输入合计金额', trigger: ['change','blur']}]
  },
  ruleOptions:[ //规则类型
        {label:'活动规则',value:1},
        {label:'资金规则',value:2},
        {label:'资源规则',value:3},
        {label:'监控规则',value:4},
      ],
  
}
},
computed: {
  type() {
    return this.$route.query.type == 0 ? true:false
  },
  isShow() {
    return this.$route.query.isShow == 0 ? true:false
  }
},
methods: {
  validateForm() {
    let flag = false
    this.$refs['baseForm'].validate((valid) => {
      flag = valid
    })
    return flag
  }
}
}
</script>

<style lang="less" scoped>
</style>
