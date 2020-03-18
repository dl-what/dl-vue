<template>
<div class="vlt-card">
  <panel title="新增周参数" :show="true">
    <div class="vlt-edit-single">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="10em" style="margin-top:20px">
        <el-form-item label="年份" prop="year">
          <el-input v-model="form.year" maxlength="4">
            <template slot="append">年</template>
          </el-input>
        </el-form-item>
        <el-form-item label="周序号" prop="week">
          <el-input v-model="form.week" maxlength="2"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="form.startTime" :default-time="defaultTime" :clearable="true" :editable="false" type="datetime" placeholder="请选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="form.endTime" :default-time="defaultTime" :clearable="true" :editable="false" type="datetime" placeholder="请选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-button :id="'weekParamCreate-submit'" type="primary" size="medium" @click="submit">提 交</el-button>
            <el-button :id="'weekParamCreate-cancel'" size="medium" @click="cancel">取 消</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </panel>5fd
</div>
</template>

<script type="text/javascript">
import moment from "moment"
import rules from '@/utils/rules'
export default {
name: "weekParamCreate",
data() {
return {
  rules: {
    year: [
      {required: true, validator: rules.checkYear, trigger: ['blur', 'change'], title: '年份'}
    ],
    week: [
      {required: true, validator: rules.numberCheck, trigger: ['blur', 'change'], title: "周序号"}
    ]
  },
  form: {
    year: "",
    week: "",
    startTime: "",
    endTime: ""
  },
  defaultTime: moment(Date.now()).format('HH:mm:ss'),
}
},
methods: {
  submit() {
    const self = this;
    self.$refs.form.validate(async (valid) =>{
      if (valid) {
        let data = JSON.parse(JSON.stringify(self.form));
        data.year = Number(self.form.year);
        data.week = Number(self.form.week);
        if (data.startTime) {
          data.startTime = self.$moment(self.form.startTime).format("YYYY-MM-DD HH:mm:ss");
        }
        if (data.endTime) {
          data.endTime = self.$moment(self.form.endTime).format("YYYY-MM-DD HH:mm:ss");
        }
        console.log(data)
        let res = await self.$api.addWeekParam({ message: "新增成功", data });
        if (res && res.code == 0) {
          self.$router.push("weekParamSetting")
        }
      }
    })
  },
  cancel() {
    this.$router.back()
  }
},
}
</script>

<style lang="less" scoped>
</style>
