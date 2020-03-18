<template>
  <!-- 指标设置 -->
  <div class="vlt-card new-indicator">
    <div class="vlt-edit-single">
      <panel title="基本信息" :show="true" style="margin-bottom:15px">
        <el-form :model="baseForm" ref="baseForm" :rules="rules"  label-position="right" label-width="90px" style="margin-top:20px"> 
          <el-form-item label="指标名称" prop="targetName">
            <el-input v-model="baseForm.targetName"  placeholder="请输入指标名称" maxlength="50" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="指标类别" prop="targetType">
            <el-select v-model="baseForm.targetType" filterable placeholder="请选择课程类型" @change="changeTargetType(baseForm.targetType)" :disabled="true">
              <el-option
                v-for="item in targetTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="考核类型" prop="examineType">
            <el-select v-model="baseForm.examineType" filterable placeholder="请选择课程类型" >
              <el-option
                v-for="item in examineTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="考核类别" prop="targetCategory">
            <el-select v-model="baseForm.targetCategory" filterable placeholder="请选择课程类型" >
              <el-option
                v-for="item in targetCategoryArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="渠道类型" prop="channelType">
            <el-select v-model="baseForm.channelType" filterable placeholder="请选择课程类型" >
              <el-option
                v-for="item in channelTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="vlt-edit-wrap">
        </div>
      </panel>
      <panel title="条件设置" :show="true" style="margin-bottom:15px">
        <condition-setting  ref="conditionForm" v-if="showComponent" :showTargetType="showTargetType" :fillData="fillDataList" @typeData="conditionList"></condition-setting>
      </panel>
      <div class="submit-wrap">
        <el-row class="vlt-edit-btn"  style="margin-left: 100px">
          <el-button id="indicatorEdit-submit" type="primary" v-prevent="1000" size="medium" @click="submit('baseForm')" :loading="showLoading" >提交</el-button>
          <el-button id="indicatorEdit-cancel" size="medium" @click="close">取 消</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { async } from 'q';
import conditionSetting from './components/conditionSettings'
export default {
  name: "indicatorEdit",
  data() {
    // 名称校验
    var channelExamineTargetCheckName = (rule, value, callback) =>{
      const _this = this;
      (async value => {
        const data = {
          targetName: value,
          id: Number(this.$route.query.id)
        };
        const res = await _this.$api.channelExamineTargetCheckName({data});
        console.log(res);
        if (res&&res.code==0) {
          !res.data ? callback() : callback(new Error('指标名称重复！')); 
        }
      })(value)
    };
    return {
      showLoading: false,
      baseForm: { 
        targetName: '',
        targetType: '',
        examineType: '',
        targetCategory: '',
        channelType: '',
      },
      targetTypeArr: [ { label: "定性考核", value: 0 }, { label: "定量考核", value: 1 } ],
      examineTypeArr: [ { label: "绩效考核", value: 0 }, { label: "等级考核", value: 1 } ],
      targetCategoryArr: [ { label: "大厅管理", value: 1 }, { label: "大厅维护", value: 2 }, { label: "业务培训", value: 3 }, { label: "彩民服务", value: 4 } ],
      channelTypeArr: [ { label: "自营厅", value: 0 }, { label: "合作厅", value: 1 } ],
      rules: {
        targetName: [
          { required: true, validator: this.$rules.checkName, title: "指标名称", trigger: ['change','blur'] },
          // { validator: channelExamineTargetCheckName, trigger: ['change','blur']}
        ],
        targetType: [{ required: true, message: "指标类别不能为空", trigger: ['change','blur'] }],
        examineType: [{ required: true, message: "考核类型不能为空", trigger: ['change','blur'] }],
        targetCategory: [{ required: true, message: "考核类别不能为空", trigger: ['change','blur'] }],
        channelType: [{ required: true, message: "渠道类型不能为空", trigger: ['change','blur'] }]
      },
      showTargetType: 0,
      requestForm: {
        indicatorName: null,
        indicatorCategory: 1,
        assessmentType: null,
        assessmentCategory: null,
        channelType: null,
      },
      conditionDatas: {},
      newTableData: [],
      responseData: {},
      fillDataList: [],
      showComponent: false
    };
  },
  components: {
    'condition-setting': conditionSetting
  },
  watch: {
    'requestForm.indicatorCategory': {
      handler (newVal, oldVal) {
        console.log(newVal);
        this.typeList.splice(1, (this.typeList.length - 1));
      },
      deep: true
    },
  },
  created(){
    if (this.$route.query.id) {
      let id = this.$route.query.id;
      this.getInfo(id);
    }
  },
  methods: {
    // 编辑前 回填数据 
    async getInfo(id) {
      const _this = this;
      let res = await _this.$api.channelExamineTargetDetail({ data: id });
      if (res && res.code === 0) {
        console.log(res);
        Object.assign(_this.baseForm, res.data);
        console.log('this.baseform', _this.baseForm);
        _this.responseData = res.data;

        console.log(_this.responseData.targetConditionInfoList);
        _this.changeTargetType (_this.responseData.targetType);
        _this.fillDataList =  _this.responseData.targetConditionInfoList;
        if (_this.fillDataList.length) {
          _this.showComponent = true
        }
        console.log(_this.newTableData);
      }
    },

    changeTargetType (val) {
      console.log('------',String(val));
      String(val) === '1' ? this.showTargetType = 1 : this.showTargetType = 2;
      console.log(this.showTargetType);
      this.showComponent = true;
    },
    conditionList (data) {
      console.log('传过来的值', data);
      this.conditionDatas = JSON.parse(JSON.stringify(data));
    },
    changeForm(val) {
      Object.assign(this.requestForm, val);
    },
    // 考核指标表新增
    channelExamineTargetUpdate (data) {
      console.log('requestData:',data);
      const _this = this;
      (async (data)=> {
        const res = await _this.$api.channelExamineTargetUpdate({ message: '修改成功！', data });
        if (res && res.code === 0) {
          _this.$router.push({
            name: 'indicatorSettings'
          })
        }
      })(data)
    },
    submit (form) {
      let numberFlag = true;
      let flag = this.$refs['conditionForm'].validateForm();
      console.log('子组件的校验', flag);
      this.$refs[form].validate(valid => {
        console.log(valid);
        if (valid && flag) { // 校验成功
          console.log(this.baseForm);
          const _this = this;
          _this.baseForm.targetConditionInfoList = JSON.parse(JSON.stringify(_this.conditionDatas.targetConditionInfoList));
          if (_this.baseForm.targetConditionInfoList) {
            // console.log('this.conditionDatas----', _this.baseForm.targetConditionInfoList);
            _this.baseForm.targetConditionInfoList.forEach((item,index) => {
              if (_this.baseForm.targetType == 1) {
                item.targetType = _this.baseForm.targetType;
                delete item.conditionValue;
                delete item.bfNum;
                item.conditionSetList&&item.conditionSetList.forEach((ele, i) => {
                  // 时间格式化
                  if (ele.conditionType == 2 && ele.conditionSetValue && ele.conditionSetValue2 == null) {
                    if (Array.isArray(ele.conditionSetValue)) {
                      // console.log(ele.conditionSetValue, ele.conditionSetValue[0], ele.conditionSetValue[1]);
                      ele.conditionSetValue2 = _this.$moment(ele.conditionSetValue[1]).format('YYYY-MM-DD HH:mm:ss');
                      ele.conditionSetValue = _this.$moment(ele.conditionSetValue[0]).format('YYYY-MM-DD HH:mm:ss');
                      // console.log(ele.conditionSetValue, ele.conditionSetValue2);
                    } else {
                      ele.conditionSetValue = _this.$moment(ele.conditionSetValue).format('YYYY-MM-DD HH:mm:ss');
                    }
                  } 
                   // 判断 如果是数值 并且有两个值的情况下 ，后值必须大于前一值
                  if (ele.conditionType == 1 && ele.relation == 5 && ele.conditionSetValue && ele.conditionSetValue2 != '') {
                    console.log('----', ele.conditionSetValue,'----', ele.conditionSetValue2);
                    if (Number(ele.conditionSetValue)  >= Number(ele.conditionSetValue2)) {
                      _this.$message.warning(`条件${index + 1}设置${i + 1}的后一数值必须大于前一数值`);
                      numberFlag = false;
                    }
                  }
                  delete ele.selectData; 
                  delete ele.relationArr;
                  delete ele.TypeDatas;
                  delete ele.showModeChange;
                  delete ele.conditionTypeArr;
                  delete ele.isFill;
                })
              } else {
                delete item.conditionSetList;
              }
            })
          }
          if (numberFlag) {
            let data = JSON.parse(JSON.stringify(this.baseForm));
            data.id = _this.$route.query.id;
            // console.log(data);
            this.channelExamineTargetUpdate(data);
          }
        }
      })
    },
    close() {
      this.$router.back();
    }
  }
};
</script>
<style lang="less" scoped>
// .vlt-edit-single {
//       .title {
//         border-bottom: 0;
//       }
//     } 
</style>


