<template>
  <div>
    <!-- 游戏规则 -->
    <el-form label-position="top" 
      label-width="90px" 
      :model="form"
      :rules="rules"
      :disabled="disabled"
      ref="form"
      class="baseInfo">
      <!-- <el-form-item label="开售日期" prop="startSaleDate">
        <el-date-picker
          v-model="form.startSaleDate"
          :picker-options="pickerOptions"
          type="date"
          placeholder="请选择开售日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="停售日期" prop="endSaleDate">
        <el-date-picker
          v-model="form.endSaleDate"
          :picker-options="pickerOptions"
          type="date"
          placeholder="请选择停售日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="销售权限" prop="saleAuthority">
        <el-select v-model.number="form.saleAuthority" placeholder="请选择销售权限">
          <el-option v-for="(item,index) in salesData" :key="index" :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="兑奖权限" prop="prizeAuthority">
        <el-select v-model.number="form.prizeAuthority" placeholder="请选择兑奖权限">
          <el-option v-for="(item,index) in cashData" :key="index" :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item v-if="!isPlayGame" label="游戏子类型" prop="gameSubType">
        <el-select v-model="form.gameSubType" placeholder="请选择类型">
          <el-option v-for="(item,index) in gameTypeData" 
            :key="index" 
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="兑换比例">
        <div class="flex-wrap">
          <el-form-item prop="money" class="wrapper">
            <el-input v-model.trim="form.money" placeholder="请输入金额" @blur="check" maxlength="5">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <span class="flag">=</span>
          <el-form-item prop="number" class="wrapper">
            <el-input v-model.trim="form.number" placeholder="请输入数量" @blur="check" maxlength="5">
              <template slot="append">游戏点</template>
            </el-input> 
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="游戏结束时点数的保存天数" prop="endGamePointDays">
        <el-input v-model.trim="form.endGamePointDays" placeholder="请输入数量" maxlength="3">
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="兑换比例(积分)" prop="jackpotRate">
        <div class="flex-wrap">
          <el-input v-model.number="form.jackpotRate" placeholder="请输入数量">
            <template slot="append">积分</template>
          </el-input>
          <span class="flag">=</span>
          <el-input v-model.number="form.jackpotRate" placeholder="请输入数量">
            <template slot="append">游戏点</template>
          </el-input> 
        </div>
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
      gameTypeData: [
        {label:'标准', value: 0},
        {label:'新上市', value: 1},
        {label:'推荐', value: 2},
        {label:'促销', value: 3},
      ],
      pickerOptions: this.beginDate(),
      rules: {
        money: [
          { required: true, validator: rules.checkPositive, title: '金额', trigger: ['change','blur'] }
        ],
        number: [
          { required: true, validator: rules.checkPositive, title: '游戏点数', trigger: ['change','blur'] }
        ],
        startSaleDate: [
          { required: true, message: '开售日期不能为空', trigger: ['change','blur'] }
        ],
        endSaleDate: [
          { required: true, message: '停售日期不能为空', trigger: ['change','blur'] }
        ],
        gameSubType: [
          { required: true, message: '游戏子类型不能为空', trigger: ["change", "blur"] }
        ],
        prizeAuthority: [
          { required: true, message: '兑奖权限不能为空', trigger: ["change", "blur"] }
        ],
        endGamePointDays: [
          { required: true, validator: rules.checkPositive, title: '游戏结束时点数的保存天数', trigger: ['change','blur'] }
        ],
      },
      cashData: [{label:'启用', value:1},{label:'关闭',value:2}],
      salesData: [{label:'启用', value:1},{label:'关闭',value:2}],
      startSaleDate: '',
      endSaleDate: '',
      isPlayGame: true,
    }
  },
  watch: {

  },
  created() {
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == '1' ? true : false;
    // 判断游戏是否是试玩
    this.isPlayGame = this.$route.query.gameStatus == '2' ? true : false;

    this.$set(this.form, 'number', null)
    this.$set(this.form, 'money', null)
    if(this.form.exchangeRate) {
      this.form.money = this.form.exchangeRate.split(':')[0]
      this.form.number = this.form.exchangeRate.split(':')[1]
    }
    
  },
  methods: {
    beginDate(){
      let self = this
      return {
        disabledDate(time)  {
          return time.getTime() < Date.now() - 8.64e7 // 过去时间不可选
        },
        selectableRange: `${this.$moment(Date.now()).format('HH:mm:ss')}-23:59:59`
      }
    },
    check() {
      if(this.form.number&&this.form.money) {
        if(this.form.number%10 != 0) {
          this.form.prizeRate = null;
          this.$message.warning('游戏点数必须为10的倍数')
        }else{
          if(this.form.number%this.form.money == 0) {
            this.form.prizeRate = this.form.number/this.form.money;
            this.form.exchangeRate = `${this.form.money}:${this.form.number}` // 保存用户输入1：100
          }else{
            this.form.prizeRate = null;
            this.$message.warning('游戏点数除于金额必须等于正整数')
          }
        }
      }
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
    .flag{
      margin: 0 15px;
    }
  }
</style>
<style lang="less">
.vlt-edit-double .wrapper .el-form-item__content{
  width: 100%;
}
</style>
