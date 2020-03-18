<template>
  <div class="partner-container">
    <panel title="基本信息" :show="true">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <el-form ref="form" :model="form" :rules="rules"  label-width="7em">
            <el-form-item label="等级名称" prop="gradeName">
              <el-input v-model="form.gradeName" 
                maxlength="30" 
                show-word-limit
              >
              </el-input>
            </el-form-item>
            <el-form-item label="等级分值">
              <el-form-item prop="minScore" class="sub-form-item">
                <el-input v-model="form.minScore" placeholder="请输入最低值"></el-input>
              </el-form-item>
              <span class="form-item-space-line">-</span>
              <el-form-item prop="maxScore" class="sub-form-item">
                <el-input v-model="form.maxScore" placeholder="请输入最高值"></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item label="生效日期" prop="effectiveTime">
              <el-date-picker :picker-options="pickerOptions" v-model="form.effectiveTime" type="date" placeholder="请选择生效日期" >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="等级描述" prop="gradeDesc">
              <el-input type="textarea" v-model="form.gradeDesc"
                maxlength="150" 
                :autosize="{minRows: 6}"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" type="primary" @click="onSubmit">确 定</el-button>
              <el-button size="medium" @click="cancel">取 消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
import storage from '@/utils/storage'
import moment from 'moment'
import rules from '@/utils/rules'

export default {
  name: 'createLevel',
  data() {
    const checkMax = (rule, value, callback) => {
      const _value = Number(value && String(value).trim());
      if (_value > 100) {
        return callback(new Error(rule.errorMessage));
      }
      callback();
    };
    const checkGtMaxScore = (rule, value, callback) => {
      const _value = Number(value && String(value).trim());
      console.log(this.form.maxScore);
      const maxScore = this.form.maxScore;
      if (_value > maxScore && maxScore) {
        return callback(new Error('最低分值不能大于最高分值'));
      }
      callback();
    };
    const checkLtMinScore = (rule, value, callback) => {
      const _value = Number(value && String(value).trim());
      const minScore = this.form.minScore;
      if (_value <= minScore && minScore) {
        return callback(new Error('最高分值不能小于最低分值'));
      }
      callback();
    };
    return {
      insId: storage.get('userInfo').insId,
      id: this.$route.query.id,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      form: {
        gradeName: '',
        effectiveTime: '',
        minScore: '',
        maxScore: '',
        gradeDesc: '',
      },
      rules: {
        gradeName: [
          { required: true,  validator: this.$rules.checkName, title:'请输入等级名称',  trigger: ['blur', 'change']}
        ],
        effectiveTime: [
          { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请选择生效日期'}
        ],
        minScore: [
          { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请输入等级最低分值'},
          { required: true, validator: rules.numberVal2, trigger: ['blur', 'change'], errorMessage: '分值必须为正整数'},
          { required: true, validator: checkMax, trigger: ['blur', 'change'], errorMessage: '分值最大不能超过100'},
          { required: true, validator: checkGtMaxScore, trigger: ['blur', 'change']},
        ],
        maxScore: [
          { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请输入等级最高分值'},
          { required: true, validator: rules.numberVal2, trigger: ['blur', 'change'], errorMessage: '分值必须为正整数'},
          { required: true, validator: checkMax, trigger: ['blur', 'change'], errorMessage: '分值最大不能超过100'},
          { required: true, validator: checkLtMinScore, trigger: ['blur', 'change']},
        ],
        gradeDesc: [
          { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请输入等级描述'}
        ],
      }
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
  },
  methods: {
    // 获取详情
    async getDetail() {
      const res = await this.$api.getPartnerLevelDetail({
        data: {
          id: this.$route.query.id
        }
      })
      if (res && res.code === 0) {
        console.log(res);
        Object.keys(this.form).forEach(prop => {
          this.form[prop] = res.data[prop];
        })

        // if (res.data.startTime) {
        //   this.$set(this.form.effectiveTime, 0, res.data['startTime']);
        //   // this.form.effectiveTime[0] = res.data['startTime'];
        // }
        // if (res.data.endTime) {
        //   this.$set(this.form.effectiveTime, 1, res.data['endTime']);
        //   // this.form.effectiveTime[1] = res.data['endTime'];
        // }
      }
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const apiName = this.isEdit ? 'editPartnerLevel' : 'createPartnerLevel';
          const message = this.isEdit ? '编辑成功' : '新增成功';
          const data = {
            ...this.form,
            insId: this.insId,
            effectiveTime: moment(this.form.effectiveTime).format("YYYY-MM-DD")
          }
          console.log(data);
          if (this.isEdit) {
            data.id = this.id;
          }
          const res = await this.$api[apiName]({
            message,
            data
          })
          if (res && res.code === 0) {
            this.$router.push({
              name: 'partnerLevel'
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      
    },
    cancel() {
      this.$router.back()
    }
  }
}
</script>


<style lang="less">
@import "./less/index.less";
</style>
