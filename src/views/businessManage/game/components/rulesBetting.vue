<template>
  <div>
    <!-- 投注规则 -->
    <el-form label-position="right" 
      label-width="8em" 
      :model="params"
      :rules="rules"
      :disabled="disabled"
      ref="form"
      class="baseInfo">
      <h2 class="title noborder">单注规则设置</h2>
      <el-form-item label="单注最小金额" prop="minAmount">
        <el-input v-model.trim="params.minAmount" placeholder="请输入单注最小金额" maxlength="5">
          <template slot="append">元</template>
        </el-input> 
      </el-form-item>
      <el-form-item label="单注最大金额" prop="maxAmount">
        <el-input v-model.trim="params.maxAmount" placeholder="请输入单注最大金额" maxlength="5">
          <template slot="append">元</template>
        </el-input> 
      </el-form-item>
      <el-form-item label="最小投注数" prop="minBets">
        <el-input v-model.trim="params.minBets" placeholder="请输入最小投注数" maxlength="5"></el-input> 
      </el-form-item>
      <el-form-item label="最大投注数" prop="maxBets">
        <el-input v-model.trim="params.maxBets" placeholder="请输入最大投注数" maxlength="5"></el-input> 
      </el-form-item>
      <h2 class="title">单注加注规则设置</h2>
      <el-form-item :label="`第${index+1}档`" v-for="(item,index) in params.betData" :key="index"
        :prop="'betData.' + index + '.money'"
        :rules="{
          required: true, validator: $rules.donationAmount, title: '单注加注金额', trigger: ['change','blur']
        }">
        <div class="flex-wrap">
          <el-input v-model.trim="item.money" placeholder="请输入金额" maxlength="5">
            <template slot="append">元</template>
          </el-input>
          <el-button class="remove " @click.prevent="removeBetting(index)">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item label="" prop="">
        <el-button @click="addBetting" icon="el-icon-plus" class="add-btn  vlt-add-more"></el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";

export default {
  name: "",
  model: {
    prop: 'form',
    event: 'returnBack'
  },
  props: {
    form: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      params: {
        minAmount: '',
        maxAmount: '',
        minBets: '',
        maxBets: '',
        betData: [],
      },
      rules: {
        minAmount: [
          { required: true, validator: rules.donationAmount, title: '单注最小金额', trigger: ['change','blur'] }
        ],
        maxAmount: [
          { required: true, validator: rules.donationAmount, title: '单注最大金额', trigger: ['change','blur'] }
        ],
        minBets: [
          { required: true, validator: rules.checkNumber, title: '最小投注数', trigger: ['change','blur'] }
        ],
        maxBets: [
          { required: true, validator: rules.checkNumber, title: '最大投注数', trigger: ['change','blur'] }
        ],
      },
      disabled: false,
    }
  },
  watch: {
    params: {
      handler(val) {
        let array = [];
        val.betData.forEach(item => {
          array.push(item.money)
        });
        this.form.minAmount = val.minAmount;
        this.form.maxAmount = val.maxAmount;
        this.form.minBets = val.minBets;
        this.form.maxBets = val.maxBets;
        this.form.minAddBets = array.join(',')
        console.log(this.form)
      },
      deep: true,
    }
  },
  created() {
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == '1' ? true : false;
    
    // 回填数据
    this.$set(this.params, 'minAmount', this.form.minAmount)
    this.$set(this.params, 'maxAmount', this.form.maxAmount)
    this.$set(this.params, 'minBets', this.form.minBets)
    this.$set(this.params, 'maxBets', this.form.maxBets)
    let array = this.form.minAddBets&&this.form.minAddBets.split(',');
    array&&array.forEach((item, index)=>{
      let obj = {money: item}
      this.$set(this.params.betData, index, obj)
    })
  },
  methods: {
    addBetting() {
      let obj = {money: ''};
      if(this.params.betData.length < 30) {
        this.params.betData.push(obj)
      } else  {
        this.$message.warning('单注金额档位不能超过30个')
      }
    },
    removeBetting(index) {
      this.params.betData.splice(index, 1)
    },
    // 校验
    validate(callback) {
      // this.$emit('change', this.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('校验通过')
          // this.$emit('asset')
          callback('true')
        }else{
          console.log('校验不通过')
          callback('false');
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
  .vlt-edit-wrap{
    width: 100%;
  }
  .flex-wrap{
    display: flex;
    align-items: center;
    position: relative;
    .flag{
      margin: 0 10px;
    }
    .remove{
      position: absolute;
      top: 0;
      right: -70px;
      z-index: 1;
      padding: 12px 15px;
    }
  }
  .title{
    font-size: 14px;
    padding: 15px 0;
    border-top: 1px solid #e8eaec;
    border-bottom: none;
  }
  .noborder{
    border: none;
  }
  .add-btn{
    width: 100%;
  }
  .flex-switch{
    width: 150px;
  }
</style>
