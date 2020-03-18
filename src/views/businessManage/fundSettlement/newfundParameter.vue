<template>
  <div class="vlt-card">

    <div>111111111111111</div>
    <!-- <fund-parameterForm @new="getData">
      <template v-slot:lastForm>
        <div class="vlt-edit-over">
          <h2 class="title">投注卡资金处理</h2>
          <div class="vlt-edit-wrap">
            <el-form-item label="特殊资金时间">
              <el-input v-model="form.fundTime" placeholder="请输入"></el-input>
            </el-form-item>
          </div>
        </div>
      </template>
    </fund-parameterForm> -->
  </div>
</template>

<script type="text/javascript">
// import fundParameterForm from "@/views/businessManage/fundSettlement/components/fundParameterForm";
export default {
  name: "",
  data() {
    return {
      form: {
        fundTime: ""
      }
    };
  },
  created () {
    
  },
  components: {
    "fund-parameterForm": fundParameterForm
  },
  methods: {
    getData (val) {
      Object.assign(val, this.form)
      console.log('传过来的值', val)
    }
  }
};
</script>

<style lang="less" scoped>
</style>
