<template>
  <div class="partner-container">
    <panel title="基本信息" :show="true">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <el-form ref="form" :model="baseInfoForm" :rules="rules" label-width="7em">
            <el-form-item label="规则名称" prop="ruleName">
              <el-input v-model="baseInfoForm.ruleName" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="生效日期" prop="effectiveTime">
              <el-date-picker
                v-model="baseInfoForm.effectiveTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="规则描述">
              <el-input type="textarea" v-model="baseInfoForm.ruleDesc" 
                maxlength="150" 
                :autosize="{minRows: 6}"
                show-word-limit
              >

              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </panel>
    <panel title="考核规则" :show="true" class="mt15">
      <div class="vlt-edit-single add-rule-form">
        <div class="vlt-edit-wrap">
          <el-form ref="form2" :model="ruleInfoForm" :inline="true" :rules="rules" label-width="7em">
            <div v-for="(formItem, index) in ruleInfoForm.ruleCoefficientVO" :key="index">
              <el-form-item label="渠道规模" required>
                <el-col :span="7">
                  <el-form-item :prop="`ruleCoefficientVO.${index}.lowestValue`">
                    <el-input v-model="formItem.lowestValue" placeholder="最低值" maxlength="5"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="text-align: center">-</el-col>
                <el-col :span="7">
                  <el-form-item :prop="`ruleCoefficientVO.${index}.highestValue`">
                    <el-input v-model="formItem.highestValue" placeholder="最高值" maxlength="5"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="color: #999; padding-left: 10px;">&nbsp;(包含最低最高值)</el-col>
              </el-form-item>
              <el-form-item label="计算系数" :prop="`ruleCoefficientVO.${index}.coefficient`">
                <el-col :span="12">
                  <el-input v-model="formItem.coefficient" placeholder="请输入百分比" maxlength="5">
                    <template slot="append">%</template>
                  </el-input>
                </el-col>
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="5" style="padding-left: 15px;">
                  <el-button type="text" @click="removeItem(index)" size="mini" :disabled="ruleInfoForm.ruleCoefficientVO.length == 1">删除</el-button>
                </el-col>
              </el-form-item>
            </div>
          </el-form>
          <add-item-btn @click.native="addFormItem"></add-item-btn>
        </div>
      </div>
    </panel>
    <div class="form-ft-btns">
      <el-button size="medium" type="primary" @click="onSubmit">确 定</el-button>
      <el-button size="medium" @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import storage from '@/utils/storage'
import moment from 'moment'
import rules from '@/utils/rules'

export default {
  name: 'createRule',
  data() {
    return {
      insId: storage.get('userInfo').insId,
      id: this.$route.query.id,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      baseInfoForm: {
        ruleName: '',
        effectiveTime: [],
        ruleDesc: '',
      },
      ruleInfoForm: {
        ruleCoefficientVO: [
          {
            lowestValue: '',
            highestValue: '',
            coefficient: '',
          },
        ]
      },
      rules: {
        ruleName: [
          { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请输入等级名称'}
        ],
        effectiveTime: [
          { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请选择生效日期'}
        ]
      }
    }
  },
  watch: {
    'ruleInfoForm.ruleCoefficientVO': {
      handler(list) {
        list.forEach((item, index) => {
          this.createRuleValidate(index);
        })
      },
      deep: true
    }
  },
  computed: {
    isEdit() {
      return this.id ? true : false;
    }
  },
  created() {
    if (this.isEdit) {
      this.getDetail();
    }
    this.createRuleValidate(0);
  },

  methods: {
    // 创建考核规则验证
    createRuleValidate(index) {
      this.$set(this.rules, `ruleCoefficientVO.${index}.lowestValue`, [
        { required: true, validator: rules.checkEmpty, trigger: ['blur'], message: '最低值不能为空'},
        { required: true, validator: rules.numberCheck, trigger: ['blur'], message: '值必须是正整数'},
        {
          required: true, 
          validator: (rule, value, callback) => {
            const _value = String(value).trim() && Number(value);
            const highestValue = this.ruleInfoForm.ruleCoefficientVO[index].highestValue;
            if (_value > highestValue && highestValue) {
              return callback(rule.message);
            }
            callback();
          },
          trigger: ['blur'], 
          message: '必须小于最高值',
        }
      ])
      this.$set(this.rules, `ruleCoefficientVO.${index}.highestValue`, [
        { required: true, validator: rules.checkEmpty, trigger: ['blur'], message: '最高值不能为空'},
        { required: true, validator: rules.numberCheck, trigger: ['blur'], message: '值必须是正整数'},
        {
          required: true, 
          validator: (rule, value, callback) => {
            const _value = String(value).trim() && Number(value);
            const lowestValue = this.ruleInfoForm.ruleCoefficientVO[index].lowestValue;
            if (_value <= lowestValue && lowestValue) {
              return callback(rule.message);
            }
            callback();
          },
          trigger: ['blur'], 
          message: '必须大于最低值',
        }
      ])
      this.$set(this.rules, `ruleCoefficientVO.${index}.coefficient`, [
        { required: true, validator: rules.checkEmpty, trigger: ['blur'], message: '计算系数不能为空'},
        { required: true, validator: rules.numberCheck, trigger: ['blur'], message: '值必须是正整数'},
      ])
    },
    // 获取详情
    async getDetail() {
      const self = this;
      const res = await self.$api.getPartnerRuleDetail({
        data: {
          id: self.$route.query.id
        }
      })
      if (res && res.code === 0) {

        self.baseInfoForm.ruleName = res.data.ruleName;
        self.baseInfoForm.ruleDesc = res.data.ruleDesc;

        if (res.data.startTime) {
          self.$set(self.baseInfoForm.effectiveTime, 0, res.data['startTime'])
        }
        if (res.data.endTime) {
          self.$set(self.baseInfoForm.effectiveTime, 1, res.data['endTime'])
        }
        console.log(self.baseInfoForm)
        self.ruleInfoForm.ruleCoefficientVO = res.data.ruleCoefficientVO;
      }
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$refs.form2.validate(async valid2 => {
            if (valid2) {
              // 判断规则首尾交叉值
              let isHas = false;
              const ruleCoefficientVO = this.ruleInfoForm.ruleCoefficientVO;
              this.ruleInfoForm.ruleCoefficientVO.forEach((item, i) => {
                if (ruleCoefficientVO[i + 1] && ruleCoefficientVO[i + 1].lowestValue <= item.highestValue) {
                  isHas = true;
                }
              })
              if (isHas) {
                this.$message.error('最低值和最高值不能交叉');
                return;
              }
              const apiName = this.isEdit ? 'editPartnerRule' : 'createPartnerRule';
              const message = this.isEdit ? '编辑成功' : '新增成功';
              const data = {
                ...this.baseInfoForm,
                ...this.ruleInfoForm,
                insId: this.insId,
                startTime: moment(this.baseInfoForm.effectiveTime[0]).format("YYYY-MM-DD"),
                endTime: moment(this.baseInfoForm.effectiveTime[1]).format("YYYY-MM-DD"),
              }
              delete data.effectiveTime;
              if (this.isEdit) {
                data.id = this.id;
              }
              const res = await this.$api[apiName]({
                message,
                data
              })
              if (res && res.code === 0) {
                this.$router.push({
                  name: 'assessmentRules'
                })
              }
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    addFormItem() {
      this.ruleInfoForm.ruleCoefficientVO.push({
        lowestValue: '',
        highestValue: '',
        coefficient: '',
      })
    },
    removeItem(index) {
      if (this.ruleInfoForm.ruleCoefficientVO.length == 1) {
        return;
      }
      this.ruleInfoForm.ruleCoefficientVO.splice(index, 1);
    },
    cancel() {
      this.$router.back();
      this.eventBus.$emit('closeTag', this.$route.name)
    },
  },
  components: {

  },
}
</script>


<style lang="less">
@import "./less/index.less";
</style>
