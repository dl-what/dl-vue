<template>
  <!-- 指标设置 -->
  <div class="vlt-card new-indicator">
    
      <panel title="新增指标" :show="true" style="margin-bottom:15px">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <el-form :model="baseForm" ref="baseForm" :rules="rules"  label-position="right" label-width="90px" style="margin-top:10px"> 
              <el-form-item label="指标名称" prop="targetName">
                <el-input v-model.trim="baseForm.targetName" placeholder="请输入指标名称"  maxlength="50" show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="指标类别" prop="targetType">
                <el-select v-model="baseForm.targetType" filterable placeholder="请选择课程类型" @change="changeTargetType(baseForm.targetType)">
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
          </div>
        </div>
      </panel>
      <panel title="条件设置" :show="true" style="margin-bottom:15px; padding-bottom: 20px;" v-if="showTarget">
        <div class="vlt-edit-single">
          <condition-setting ref="conditionForm" :showTargetType="showTargetType" @typeData="conditionList"></condition-setting>
        </div>
      </panel>
      <div class="submit-wrap">
        <el-row class="vlt-edit-btn" style="margin-left: 100px">
          <el-button id="newIndicator-submit" type="primary" v-prevent="1000" size="medium" @click="submit('baseForm')" :loading="showLoading" >提交</el-button>
          <el-button id="newIndicator-cancel" size="medium" @click="close">取 消</el-button>
        </el-row>
      </div>
    
  </div>
</template>

<script type="text/javascript">
import { async } from 'q';
import conditionSetting from './components/conditionSettings'
export default {
  name: "newIndicator",
  data() {
    // 名称校验
    var channelExamineTargetCheckName = (rule, value, callback) =>{
      const _this = this;
      (async value => {
        const data = {
          targetName: value
        };
        const res = await _this.$api.channelExamineTargetCheckName({data});
        if (res&&res.code==0) {
          !res.data ? callback() : callback(new Error('指标名称重复！')); 
        }
      })(value)
    };
    return {
      showLoading: false,
      baseForm: { },
      targetTypeArr: [ { label: "定性考核", value: 0 }, { label: "定量考核", value: 1 } ],
      examineTypeArr: [ { label: "绩效考核", value: 0 }, { label: "等级考核", value: 1 } ],
      targetCategoryArr: [ { label: "大厅管理", value: 1 }, { label: "大厅维护", value: 2 }, { label: "业务培训", value: 3 }, { label: "彩民服务", value: 4 } ],
      channelTypeArr: [ { label: "自营厅", value: 0 }, { label: "合作厅", value: 1 } ],
      rules: {
        targetName: [
          { required: true, validator: this.$rules.checkName, title:  "指标名称", trigger: ['change','blur'] },
          // { validator: channelExamineTargetCheckName, trigger: ['change','blur']}
        ],
        targetType: [{ required: true, message: "指标类别不能为空", trigger: ['change','blur'] }],
        examineType: [{ required: true, message: "考核类型不能为空", trigger: ['change','blur'] }],
        targetCategory: [{ required: true, message: "考核类别不能为空", trigger: ['change','blur'] }],
        channelType: [{ required: true, message: "渠道类型不能为空", trigger: ['change','blur'] }]
      },
      showTarget: false,
      showTargetType: 0,
      requestForm: {
        indicatorName: null,
        indicatorCategory: 1,
        assessmentType: null,
        assessmentCategory: null,
        channelType: null,
      },
      conditionDatas: {},
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
  },
  methods: {
    changeTargetType (val) {
      String(val) === '1' ? this.showTargetType = 1 : this.showTargetType = 2;
      this.showTarget = true;
      console.log(this.showTargetType);
    },
    conditionList (data) {
      console.log('传过来的值', data);
      this.conditionDatas = JSON.parse(JSON.stringify(data));
    },
    changeForm(val) {
      // console.log('表单变化', val);
      Object.assign(this.requestForm, val);
    },
    // 考核指标表新增
    channelExamineTargetCreate (data) {
      console.log('requestData:',data);
      const _this = this;
      (async (data)=> {
        const res = await _this.$api.channelExamineTargetCreate({ message: '新增成功！', data });
        if (res && res.code === 0) {
          _this.$router.push({
            name: 'indicatorSettings'
          })
        }
      })(data)
    },
    submit (form) {
      console.log(this.$refs.conditionForm);
      let numberFlag = true;
      let flag = this.$refs['conditionForm'].validateForm();
      console.log('子组件的校验', flag);
      this.$refs[form].validate(valid => {
        console.log(valid, flag);
        if (valid && flag) {
          // 校验成功
          console.log(this.baseForm);
          const _this = this;
          _this.baseForm.targetConditionInfoList = JSON.parse(JSON.stringify(_this.conditionDatas.targetConditionInfoList));
          if (_this.baseForm.targetConditionInfoList) {
            // console.log('this.conditionDatas----', _this.baseForm.targetConditionInfoList);
            _this.baseForm.targetConditionInfoList.forEach((item, index) => {
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
            // console.log(1111, 'ok');
            let data = JSON.parse(JSON.stringify(this.baseForm));
            this.channelExamineTargetCreate(data);
          }
        }
      })
    },
    close() {
      this.$router.back();
    }
  }
};
// {
// "channelType": 0, // 渠道类型
// "examineType": 0,  //
// "targetCategory": 0,
// "targetConditionInfoList": [
// 	{
// 		"conditionScore": 0, 
// 		"conditionSetList": [ //定量 要 其他不要
// 			{
// 				"chCondRelation": 0,
// 				"conditionId": 0,
// 				"conditionSetValue": "",
// 				"conditionSetValue2": "",  // 在。。与 必填 
// 				"conditionType": 0, 
// 				"conditionTypeId": 0, // 如果是字符型 掉接口  非必填
// 				"relation": 0
// 			},
//      {
// 				"chCondRelation": 0,
// 				"conditionId": 0,
// 				"conditionSetValue": "",
// 				"conditionSetValue2": "",  // 在。。与 必填 
// 				"conditionType": 0, 
// 				"conditionTypeId": 0, // 如果是字符型 掉接口  非必填
// 				"relation": 0
// 			}
// 		],
// 		"conditionValue": "",  //定性 要 其他不要
// 		"targetType": 0  // 定性 / 定量指标
// 	}
// ],
// "targetName": "",
// "targetType": 0
// }
</script>
<style lang="less" scoped>
// .vlt-edit-single {
//       .title {
//         border-bottom: 0;
//       }
//     } 
</style>


