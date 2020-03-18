<template>
  <div class="vlt-card">
    <div class="vlt-edit-single">
      <h2 class="title">编辑</h2>
      <div class="vlt-edit-wrap">
        <el-form label-position="right" label-width="90px" :model="form" ref="form">
          <base-form
            :formData="data2"
            labelWidth="140px"
            ref="baseForm"
            :rules="rules2"
            direction="right"
            @change="changeForm"
          ></base-form>
        </el-form>
        <el-row class="vlt-edit-btn">
          <el-button type="primary" v-prevent="1000" size="medium" @click="submit">提 交</el-button>
          <el-button size="medium" @click="cancel">取 消</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";

export default {
  name: "CreateRule",
  data() {
    return {
      params: {},
      data2: [
        { type: "input", title: "周期", prop: "text" },
        {
          type: "select",
          title: "",
          prop: "status",
          options: [
            { label: "天", value: "0" },
            { label: "周", value: "1" },
            { label: "月", value: "2" },
            { label: "年", value: "3" }
          ]
        },
        { type: "input", title: "笔数", prop: "text1" },
        { type: "input", title: "限额", prop: "text2" },
        { type: "input", title: "限制次数", prop: "mixBet" },
        { type: "switch", title: "是否启用", prop: "isShow" },
        {
          type: "datetime-range",
          prop: "date4",
          value: "",
          title: "生效时间",
          options: ["start", "end"]
        }
      ],

      rules2: {
        mixBet: [
          { required: true, validator: rules.checkEmail, trigger: ['change','blur'] }
        ],
        status: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ]
      },

      form: {
        singleAmount: "",
        minMultiple: "",
        mixBet: "",
        bet: "",
        logOff: "",
        textarea: ""
      }
    };
  },
  components: {},
  methods: {
    submit() {
      console.log('提交的数据', this.params);
      setTimeout(()=>{
       this.$router.back();
      }, 1000)
    },
    cancel() {
      this.$router.back();
    },
    changeForm(val) {
      Object.assign(this.params, val);
    },
    changeSelect(val) {
      console.log(this.form, val);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
