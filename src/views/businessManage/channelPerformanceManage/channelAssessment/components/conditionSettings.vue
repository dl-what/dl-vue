<template>
  <div>
    <div class="vlt-edit-wrap" v-if="showType == 1">
      <el-form ref="conditionForm" :model="conditionDatas" @change="changeForm" :rules="rules" label-position="right" label-width="100px">
        <div v-for="(ele, i) in conditionDatas.targetConditionInfoList" :key="i" class="condition-list">
          <p class="panel-item-title">条件{{i + 1}}</p>
          <el-row :gutter="10" class="condition-content">
            <el-col :span="20" style="padding-left: 0">
              <el-form-item label="条件设置" labelWidth="80px" v-for="(element, n) in ele.conditionSetList" :key="n">
                <el-col :span="6">
                  <el-form-item   :prop="'targetConditionInfoList.'+ i +'.conditionSetList.'+ n +'.conditionId'"  :rules="rules.conditionId">
                    <el-select v-model="element.conditionId" placeholder="请选择条件因素" >
                      <el-option
                        v-for="(items, index) in factorTypeData"
                        :key="index"
                        :label="items.label"
                        :value="items.value"
                        @click.native="changeFactorType(items, i, n)" 
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item  :prop="'targetConditionInfoList.'+ i +'.conditionSetList.'+ n +'.conditionType'"  :rules="rules.conditionType">
                    <el-select v-model="element.conditionType" placeholder="请选择条件值类型">
                      <el-option
                        v-for="(item,index) in element.conditionTypeArr"
                        :key="index"
                        :label="item.label"
                        @click.native="changeCondition(element.conditionType, i, n)"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item  :prop="'targetConditionInfoList.'+ i +'.conditionSetList.'+ n +'.relation'"  :rules="rules.relation">
                    <el-select  v-model="element.relation" placeholder="请选择条件关系" >
                      <el-option
                        v-for="(items,index) in element.relationArr"
                        :key="index"
                        :label="items.label"
                        @click.native="changeRelationship(items, i, n)"
                        :value="items.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="element.conditionType==1 ? 8 : 8" v-if="true">
                  <el-form-item class="input-item" v-if="element.conditionType==1" :prop="'targetConditionInfoList.'+ i +'.conditionSetList.'+ n +'.conditionSetValue'"  :rules="rules.conditionSetValue" >
                    <el-input 
                      v-model="element.conditionSetValue" 
                      placeholder="请输入数值">
                    </el-input>
                  </el-form-item>
                  <el-form-item class="input-item" v-if="element.conditionType==1 && element.relation==5"  :prop="'targetConditionInfoList.'+ i +'.conditionSetList.'+ n +'.conditionSetValue2'"  :rules="rules.conditionSetValue2" >
                      <!-- { validator: validValueCompare(element.conditionSetValue) ,trigger: 'blur' } -->
                    <el-input 
                      v-model="element.conditionSetValue2" 
                      placeholder="请输入数值">
                    </el-input>
                  </el-form-item>
                  <el-form-item v-if=" element.conditionType==2 && element.relation!=3" :prop="'targetConditionInfoList.'+ i +'.conditionSetList.'+ n +'.conditionSetValue'"  :rules="rules.conditionSetValue">
                    <el-date-picker
                      v-model="element.conditionSetValue" 
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item v-if=" element.conditionType==2 && element.relation==3"  :prop="'targetConditionInfoList.'+ i +'.conditionSetList.'+ n +'.conditionSetValue'"  :rules="rules.conditionSetValue">
                    <el-date-picker
                      v-model="element.conditionSetValue"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetimerange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item v-if=" element.conditionType==0"   :prop="'targetConditionInfoList.'+ i +'.conditionSetList.'+ n +'.conditionTypeId'"  :rules="rules.conditionTypeId">
                    <el-select 
                      v-model="element.conditionTypeId" 
                      placeholder="请选择条件因素" >
                      <el-option
                        v-for="items in element.TypeDatas"
                        :key="items.value"
                        :label="items.label"
                        @click.native="changeSelect(items)"
                        :value="items.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col  class="new-indicator-opera" :span="4">
              <el-radio-group v-model="ele.chCondRelation" @change="mode()" size="small">
                <el-radio-button :id="'newIndicator-and'+i" @click.native.prevent="mode(0, i)" :class="ele.bfNum == '0' ? 'is-active':''" label="0">并且</el-radio-button>
                <el-radio-button :id="'newIndicator-or'+i" @click.native.prevent="mode(1, i)" :class="ele.bfNum == '1' ? 'is-active':''" label="1">或者</el-radio-button>
                <el-radio-button :id="'newIndicator-IndicatorDelete'+ i" @click.native.prevent="mode(3, i)" label="3" v-if="i > 0">删除</el-radio-button>
              </el-radio-group>
            </el-col >
          </el-row>
          <el-row>
            <el-form-item label="分值设置" labelWidth="80px" :prop="'targetConditionInfoList.' + i +'.conditionScore'" :rules="rules.conditionScore">
              <el-input placeholder="请输入分值" v-model.number="ele.conditionScore"></el-input>
            </el-form-item>
          </el-row>
        </div>
        <el-button  :id="'newIndicator-add1'" class="addDevice vlt-add-more" @click="addType" icon="el-icon-plus" :disabled="false">新增考核条件</el-button>
      </el-form>
    </div>
    <div class="vlt-edit-wrap" v-if="showType == 2">
      <el-form ref="conditionForm" :rules="rules" :model="conditionDatas" @change="changeForm" label-position="right" label-width="100px">
        <div v-for="(element, index) in conditionDatas.targetConditionInfoList" :key="index" class="condition-list">
          <p class="panel-item-title">条件{{index + 1}}</p>
          <el-row>
            <el-col :span="14">
              <el-row>
                <el-form-item label="条件设置" labelWidth="80px"  :prop="'targetConditionInfoList.'+ index +'.conditionValue'"  :rules="rules.conditionValue">
                  <el-input v-model.trim="element.conditionValue" placeholder="请输入考核条件" maxlength="50" show-word-limit></el-input>
                </el-form-item>
              </el-row>
            </el-col>
            <el-col  :span="10">
              <el-button :id="'newIndicator-IndicatorDeleteTwo'+index" class="btn-clear" label="删除" v-if="index > 0" @click="clear(index)" size="small" >删除</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="分值设置" labelWidth="80px"  :prop="'targetConditionInfoList.'+ index +'.conditionScore'"  :rules="rules.conditionScore">
              <el-input placeholder="请输入分值" v-model.number="element.conditionScore"></el-input>
            </el-form-item>
          </el-row>
        </div>
        <el-button :id="'newIndicator-add2'"  class="addDevice vlt-add-more" @click="addType" icon="el-icon-plus" :disabled="false">新增考核条件</el-button>
      </el-form>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "conditionSettings",
  props: {
    fillData: {
      type: Array
    },
    showTargetType: {
      type: Number,
      default: 0
    }
  },
  data() {
    // var validValueCompare =  (rule, value, callback, source) =>{
    //   console.log(value, source);
    //   // value < prevVal ? callback() : callback(new Error('值不能大于前一个值!')); 
    // }
    var validNumber = (rule, value, callback) => {
      const _value = value;
      const title = rule.title;
      const test = (/^\d+(\.\d{0,2})?$/g.test(_value)) ? true : false
      if (!_value) {
        return callback(new Error(`${title}不能为空`));
      }
      if (!Number(test)) {
        return callback(new Error(`${title}必须为数字且最多保留两位小数`));
      }
      if (_value > 999999999.99) {
        return callback(new Error(`${title}不能超过十亿位数`));
      }
      callback();
    };
  
    return {
      // validValueCompare,
      condConf: {
        index: 0,
        subIndex: 0,
      },
      factorTypeData: [],
      showType: 0,
      conditionDatas: {
        targetConditionInfoList: [{
          chCondRelation: 2,
          conditionSetList: [{
              chCondRelation: 2,  // 从上一级拿取数据， 0并且、1或者、2非关系
              conditionId: null,
              conditionType: null,
              relation: null,
              conditionSetValue: null,
              conditionSetValue2: null, // 在。。与 必填 
              conditionTypeId: null,// 如果是字符型 掉接口  非必填
              selectData: "",
              relationArr: [],
              TypeDatas: [],
              conditionTypeArr: [],
              showModeChange: false,
              isFill: false,
            }],
          conditionValue: "",  //定性值  要 其他不要
          conditionScore: "", 
          targetType: '', // 定性 / 定量指标
          bfNum: '2',
        }]
      },
      rules: {
        conditionId: [{ required: true, message: "请选择条件因素", trigger: ["change",'blur'] }],
        conditionType: [{ required: true, message: "请选择条件值类型", trigger: ['change','blur'] }],
        relation: [{ required: true, message: "请选择条件关系", trigger: ['change','blur'] }],
        conditionSetValue: [{ required: true, message: "请输入对应值", trigger: ['change','blur'] },
        {validator: validNumber, title:'对应值',trigger: ['change','blur']}],
        conditionSetValue2: [{ required: true, message: "请输入对应值", trigger: ['change','blur'] },
        {validator: validNumber, title:'对应值',trigger: ['change','blur']}],
        conditionTypeId: [{ required: true, message: "请选择条件因素", trigger: ['change','blur'] }],
        conditionScore: [ 
          { required: true, message: "请输入分值", trigger: ['change','blur'] },
          {  validator: this.$rules.checkPointRate, title: '分值', trigger: ['change','blur'] }
        ],
        conditionValue: [{ required: true, validator: this.$rules.checkName, title: "考核条件", trigger: ['change','blur'] }]
      }
    };
  },
  watch: {
    conditionDatas: {
      handler (newVal, oldVal) {
        // console.log('要传的值',newVal);
        this.$emit('typeData', newVal);
      
      },
      deep: true
    },
    rules: {
      handler (newVal, oldVal) {
        console.log('this.rule', newVal)
      },
      deep: true
    },
    showTargetType: {
      handler(newVal, oldVal){
        this.showType = newVal;
        // console.log('newval',this.showType);
        this.conditionDatas.targetConditionInfoList  = [{
          chCondRelation: 2,
          conditionSetList: [{
              chCondRelation: 2,  // 从上一级拿取数据， 0并且、1或者、2非关系
              conditionId: null,
              conditionType: null,
              relation: null,
              conditionSetValue: null,
              conditionSetValue2: null, // 在。。与 必填 
              conditionTypeId: null,// 如果是字符型 掉接口  非必填
              selectData: "",
              relationArr: [],
              TypeDatas: [],
              conditionTypeArr: [],
              showModeChange: false,
              isFill: false,
            }],
          conditionValue: "",  //定性值  要 其他不要
          conditionScore: "", 
          targetType: '', // 定性 / 定量指标
          bfNum: '2',
        }]
      },
      deep: true,
      immediate: true
    }
    // condConf: {
    //   handler (condConf) {
    //     this.$set(this.rules, `targetConditionInfoList.${condConf.index}.conditionSetList.${condConf.subIndex}.conditionSetValue2`, [
    //     { validator: this.validValueCompare, trigger: 'blur' }
    //     ])
    //   },
    //   deep: true
    // },
  },
  created() {
    this.getInitList();
    console.log('rules', this.rules);
    // this.$set(this.rules, `targetConditionInfoList.${0}.conditionSetList.${0}.conditionSetValue2`, [
    //   { validator: this.validValueCompare, trigger: 'blur' }
    // ])
  },
  methods: {
    //  validValueCompare (rule, value, callback){
    //   const preValue = this.conditionDatas.targetConditionInfoList[this.condConf.index]
    //   .conditionSetList[this.condConf.subIndex]
    //   .conditionSetValue;
    //   if (value === '') {
    //     callback(new Error('请输入分值'));
    //   } else if (value < preValue) {
    //     callback(new Error('不能小于前一个值!'));
    //   }
    //   callback();
    // },
    changeForm (form) {
      console.log('formmmmmmm',form);
    },
    // 回填数据 
    fillDataList(data) {
      if (data) {
        this.conditionDatas.targetConditionInfoList = [...data];
        this.conditionDatas.targetConditionInfoList.forEach((item, parindex) => {
          item.conditionSetList&& item.conditionSetList.forEach((ele, index) => {
            if (String(ele.chCondRelation)) {
              item.bfNum = String(ele.chCondRelation);
            }
            // 通过每个列表中的因素value 找到相应的typeList, 请求相应数据
            let typeItem = this.getFactorTypeData(ele.conditionId);
              if (typeItem) {
                this.changeFactorType(typeItem, parindex, index);
                this.changeCondition(ele.conditionType, parindex, index);
              }
              if (ele.conditionType== 2 && ele.conditionSetValue && ele.conditionSetValue2) {
                let arr = [ele.conditionSetValue, ele.conditionSetValue2];
                ele.conditionSetValue = [...arr];
                ele.conditionSetValue2 = null;
              }
          })
        }) 
      }
    },
    // 通过 id返回因素数据
    getFactorTypeData (val) {
      let obj = {};
      this.factorTypeData&&this.factorTypeData.forEach(item => {
          // console.log(val, item.value);
        if (val == item.value) {
           obj = {
            ...item
          }
        }
      })
      return obj;
    },
    // 条件因素配置表列表查询
    getInitList() {
      const _this = this;
      (async data => {
        const res = await _this.$api.conditionConfigListAll({ data });
        console.log(res);
        if (res && res.code === 0) {
          if (res.data) {
            res.data &&
              res.data.forEach(element => {
                _this.factorTypeData.push({
                  value: element.id,
                  label: element.name,
                  type: element.type
                });
              });
            if (_this.fillData) {
              _this.fillDataList(_this.fillData);
              // _this.isFill = false;
            } else {
              // _this.isFill = true;
            }
          }
        }
      })({});
    },
    // 条件因素类型对应配置表条件查询
    conditionTypeConfigListAll(data, parindex, index) {
      const _this = this;
      (async (data) => {
        const res = await _this.$api.conditionTypeConfigListAll({ data });
        if (res && res.code === 0) {
          console.log('----',res);
          let TypeDatas = _this.conditionDatas.targetConditionInfoList[parindex].conditionSetList[index].TypeDatas;
          console.log(TypeDatas)
          res.data&&res.data.forEach(item => {
            TypeDatas.push({
              value: item.id,
              label: item.name
            })
          })
        }
      })(data)
    },
    // 根据类型查询对应数据字典
    conditionConfigQueryType(id, parindex, index) {
      const _this = this;
      (async (id) => {
        const res = await _this.$api.conditionConfigQueryType({ data: id });
        if (res && res.code === 0) {
          console.log(res);
          if (res.data && res.data.length) {
            _this.conditionDatas.targetConditionInfoList[parindex].conditionSetList[index].relationArr = res.data;
          }
        }
      })(id)
    },
    changeFactorType(val, parindex, index) {
      let objData = this.conditionDatas.targetConditionInfoList[parindex].conditionSetList[index];
      objData.conditionId = val.value;
      if (objData.isFill) { 
        // 选择 清空数据
        objData.conditionType = null;
        this.$set(objData, 'relation', null),
        this.$set(objData, 'conditionSetValue', null),
        this.$set(objData, 'conditionSetValue2', null);
        this.$set(objData, 'conditionTypeId', null);
      }

      this.$set(objData, 'relationArr', []);
      this.$set(objData, 'TypeDatas', []);
      this.$set(objData, 'conditionTypeArr', []);
      objData.conditionTypeArr = [];
      let arr = val.type.split(',');
      let selectArr = ['字符型','数值型','时间型','真假型'];
      for(let i = 0; i < arr.length; i++) {
        objData.conditionTypeArr.push({
          value: Number(arr[i]),
          label: selectArr[arr[i]]
        });
      }
      objData.isFill = true;
     console.log('objData.conditionTypeArr-----', objData.conditionTypeArr);
    },
    changeCondition (type, parindex, index) {
      console.log(type, parindex, index);
      let  objData = this.conditionDatas.targetConditionInfoList[parindex].conditionSetList[index];
      objData.conditionType = type;
      let data = {
          conditionId: objData.conditionId,
	        conditionType: objData.conditionType
      }
      this.conditionTypeConfigListAll(data,parindex, index);
      this.conditionConfigQueryType(String(data.conditionType),parindex, index);
      // console.log(type, data);
    },
    changeRelationship (type, parindex, index) {
      console.log(type, parindex, index);
    },
    changeSelect (val) {},
    mode (val, index) {
      console.log(index, val, this.conditionDatas.targetConditionInfoList[index].chCondRelation);
      // this.condConf.subIndex += 1;
      if (val === 3) {
        this.conditionDatas.targetConditionInfoList.splice(index, 1);
        console.log(this.conditionDatas.targetConditionInfoList);
        // this.condConf.subIndex--;
      } else {
        const list = this.conditionDatas.targetConditionInfoList[index];
        if (list.bfNum == val) {
          list.bfNum = '2';
          list.conditionSetList[0].chCondRelation = 2;
          list.conditionSetList.splice(1,1);
        } else {
          list.bfNum = val;
          let conditionSetList = list.conditionSetList;
          conditionSetList.forEach(item => {
            item.chCondRelation = val;
          })
          if (conditionSetList.length < 2) {
            let dataObj = {
              chCondRelation: Number(val),  // 从上一级拿取数据， 0并且、1或者、2非关系
              conditionId: null,
              conditionType: null,
              relation: null,
              conditionSetValue: null,
              conditionSetValue2: null, // 在。。与 必填 
              conditionTypeId: null,// 如果是字符型 掉接口  非必填
              selectData: "",
              relationArr: [],
              TypeDatas: [],
              showModeChange: false
            }
            conditionSetList.push(dataObj);
          }
        }
      } 
    },
    addType() {
      // this.condConf.index += 1;
      let data = {
        conditionSetList: [{
            chCondRelation: 2,
            conditionId: null,
            conditionType: null,
            relation: null,
            conditionSetValue: null,
            conditionSetValue2: null, // 在。。与 必填 
            conditionTypeId: null,    // 如果是字符型 掉接口  非必填
            selectData: "",
            relationArr: [],
            TypeDatas: [],
            showModeChange: false
          }],
        conditionScore: "",
        chCondRelation: 2,
        conditionValue: '',
        bfNum: '2',
        targetType: 1
      };
      this.conditionDatas.targetConditionInfoList.push(data);
    },
    clear(index){
       this.conditionDatas.targetConditionInfoList.splice(index, 1);
      //  this.condConf.index--;
      //  this.condConf.subIndex = 0;
    },
    // 子组件表单校验
    validateForm () {
      let flag = null
      this.$refs['conditionForm'].validate(valid => {
        if (valid) {
          flag = true
        } else {
          flag = false
        }
      })
      return flag
    }

  }
};
</script>

<style lang="less" scoped>

.panel-item-title {
  width: 80px;
  margin-bottom: 10px;
  padding-left: 10px;
  font-size: 16px;
}
.addDevice {
  margin-left: 80px;
}
</style>
<style lang="less">
.condition-list {
  position: relative;
  .condition-content {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    // min-width: 1200px;
    max-width: 1600px;
    .el-col-16 {
      padding-left: 0;
    }
    .el-form-item__label {
      padding-right: 7px;
    }
    .el-form-item__content {
      width: auto;
    }
    .input-item {
      display: inline-block;
      vertical-align: center;
      width: 45%;
      margin-right: 10px;
    }
    .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
      -webkit-box-shadow: 0 0 2px 2px  transparent;
      box-shadow: 0 0 2px 2px transparent;
    }
    .is-active .el-radio-button__inner {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
        box-shadow: -1px 0 0 0 #409eff;
    }
  } 

    .btn-clear {
      margin-top: 30px;
    }
  .new-indicator-opera {
    // position: absolute;
    // right: 0;
    // top: 30px;
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 5px;
    margin-left: 10px;
  }
}

    
   
</style>

