<template>
  <div>
    <!-- 大小奖设置 -->
    <el-form label-position="right" 
      label-width="8em" 
      :model="params"
      :rules="rules"
      :disabled="disabled"
      ref="form"
      class="baseInfo">
      <h2 class="title noborder">大小奖设置</h2>
      <el-form-item label="游戏大奖金额" prop="max">
        <el-input v-model.trim="params.max" placeholder="请输入游戏大奖金额" maxlength="10">
          <template slot="prepend"><span class="max-flag">＞</span></template>
          <template slot="append">元</template>
        </el-input> 
      </el-form-item>
      <el-form-item label="游戏中奖金额">
        <el-input disabled v-model.trim="exchangeText" class="exchangeText" placeholder="请输入游戏中奖金额">
          <template slot="prepend"><span class="num-middle">＞</span><span class="num-middle-text">{{params.min}} 元</span></template>
          <template slot="append"><span class="num-middle">≤</span><span class="num-middle-text">{{params.max}} 元</span></template>
        </el-input> 
      </el-form-item>
      <el-form-item label="游戏小奖金额"  prop="min">
        <el-input v-model.trim="params.min" placeholder="请输入游戏小奖金额" maxlength="10">
          <template slot="prepend"><span class="num">0</span><span class="num-flag">≤</span></template>
          <template slot="append">元</template>
        </el-input> 
      </el-form-item>
      <h2 class="title">兑奖提醒设置</h2>
      <el-form-item label="兑奖提醒天数" prop="rewardRemindDays">
        <el-input v-model.trim="params.rewardRemindDays" placeholder="请输入数量" maxlength="3">
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="弃奖天数" prop="endRedeemDays">
        <el-input v-model.trim="params.endRedeemDays" placeholder="请输入数量" maxlength="3">
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="" prop="">
          <el-button plain @click="add" icon="el-icon-plus" class="add-btn"></el-button>
      </el-form-item> -->
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
      exchangeText: '并且',
      params:{
        max: '',
        min: '',
        prizeData: [ // 说明：局游戏小奖自动返奖 不受下面参数控制
          {
            exchangeName: '游戏大奖金额',
            exchangeCode: 3,
            exchangeMoney: '',
          },
          {
            exchangeName: '游戏中奖金额',
            exchangeCode: 2,
            exchangeMoney: '',
          },
          {
            exchangeName: '游戏小奖金额',
            exchangeCode: 1,
            exchangeMoney: '',
          }
        ],
        rewardRemindDays: '',        
        endRedeemDays: '',
      },
      rules: {
        max: [
          {required: true, validator: rules.donationAmount, title: '游戏大奖金额', trigger: ['change','blur']}
        ],
        min: [
          {required: true, validator: rules.donationAmount, title: '游戏小奖金额', trigger: ['change','blur']}
        ],
        rewardRemindDays: [
          { required: true, validator: rules.checkPositive, title: '兑奖提醒天数', trigger: ['change','blur'] }
        ],
        endRedeemDays: [
          { required: true, validator: rules.checkPositive, title: '弃奖天数', trigger: ['change','blur'] }
        ],
      },
      disabled: false,
    }
  },
  watch: {
    params: {
      handler(val) {
        let data = JSON.parse(JSON.stringify(val))
        data.prizeData.forEach(item => {
          if(item.exchangeCode==3) {
            item.exchangeMoney = this.params.max;
          }
          if(item.exchangeCode==2) {
            item.exchangeMoney = this.params.max;
          }
          if(item.exchangeCode==1) {
            item.exchangeMoney = this.params.min;
          }
        });
        data.rewardRemindDays = data.rewardRemindDays;
        this.form.gameExchangeSetVoList = data.prizeData;
        this.form.gameRuleVo.rewardRemindDays = data.rewardRemindDays;
        this.form.gameRuleVo.endRedeemDays = data.endRedeemDays;
      },
      deep: true,
    }
  },
  created() {
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == '1' ? true : false;
    
    this.form.gameExchangeSetVoList.forEach((item,index)=>{
      if(item.exchangeCode==3) {
        item.exchangeMoney = String(item.exchangeMoney)
        this.params.prizeData[0].id = item.id;
        this.$set(this.params, 'max', item.exchangeMoney)
      }
      if(item.exchangeCode==2) {
        this.params.prizeData[1].id = item.id;
      }
      if(item.exchangeCode==1) {
        this.params.prizeData[2].id = item.id;
        item.exchangeMoney = String(item.exchangeMoney)
        this.$set(this.params, 'min', item.exchangeMoney)
      }
    })
    this.params.rewardRemindDays = this.form.gameRuleVo.rewardRemindDays
    this.params.endRedeemDays = this.form.gameRuleVo.endRedeemDays
    // this.params.prizeData = this.form.gameExchangeSetVoList;
  },
  methods: {
    remove(index) {
      this.tipData.splice(index, 1)
    },
    add() {
      let obj={day:''};
      this.tipData.push(obj)
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
      padding: 10px 15px;
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
  .num{
    vertical-align: middle;
    &-flag{
      font-size: 20px;
      margin: 0 20px;
      vertical-align: middle;
    }
  }
  .max-flag{
    font-size: 20px;
    margin: 0 24px;
  }
  .num-middle{
    font-size: 20px;
    vertical-align: middle;
    &-text{
      vertical-align: middle;
    }
  }
  .exchangeText{
    text-align: center;
  }
</style>
<style lang="less">
  .exchangeText{
    .el-input__inner{
      width: 80px;
      text-align: center;
    }
    .el-input-group__append{
      width: 160px;
      .num-middle{
        margin-right: 20px;
      }
    }
    .el-input-group__prepend{
      width: 160px;
      .num-middle{
        margin-right: 20px;
      }
    }
  }
</style>
