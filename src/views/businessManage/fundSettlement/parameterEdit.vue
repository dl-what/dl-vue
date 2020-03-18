<template>
<div class="vlt-card">
  <panel title="编辑参数" :show="true">
    <div class="vlt-edit-single">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="10em" style="margin-top:20px">
        <el-form-item label="参数名称">
          <el-input v-model="form.parameterName" disabled></el-input>
        </el-form-item>
        <el-form-item label="参数编号">
          <el-input v-model="form.parameterCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="特殊资金时间">
          <el-input v-model="form.specialFundTime">
            <template slot="append">大小等于/月</template> 
          </el-input>
        </el-form-item>
        <el-form-item label="参数描述">
          <el-input type="textarea" placeholder="请输入" v-model="form.remark" maxlength="150" :autosize="{minRows: 3}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row class="vlt-edit-btn">
            <el-button :id="'parameterEdit-submit'" type="primary" v-prevent="1000" size="medium" @click="submit">保存</el-button>
            <el-button :id="'parameterEdit-cancel'" size="medium" @click="cancel">取消</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </panel>
</div>
</template>

<script type="text/javascript">
export default {
name: "parameterEdit",
data() {
return {
  rules: {},
  form :{
    parameterName: '',
    parameterCode: '',
    specialFundTime: '',
    remark: ''
  }
}
},
created() {
  this.getDetail()
},
methods: {
  async submit() {
    const self = this;
    let data = JSON.parse(JSON.stringify(self.form))
    if (!self.isNum(self.form.specialFundTime)) {
      self.$message.warning('特殊资金时间必须为一个正整数')
      return
    }
    let res = await self.$api.globalParameterUpdate({message:'修改成功', data })
    if (res && res.code == 0) {
      self.$router.push('fundParameter')
    }
  },
  cancel() {this.$router.back()},
  async getDetail() {
    const self = this;
    let data = String(self.$route.query.id);
    let res = await self.$api.globalParameterDetail({ data })
    if (res && res.code == 0) {
      console.log(res)
      for (let i in self.form) {
        self.form[i] = res.data[i]
      }
      self.form.id = res.data.id;
      console.log(self.form)
    }
  },
  isNum(val) {
    let reNum = /(^[0-9]*[1-9][0-9]*$)/;
    return reNum.test(val)
  },
},
}
</script>

<style lang="less" scoped>
.vlt-edit-btn{
  margin-left: 0;
}
</style>
