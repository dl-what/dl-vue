<template>
  <div class="vlt-card">
    <div class="vlt-edit-single">
      <panel title="新建年度发展计划" :show="true">
        <div class="vlt-edit-wrap">
          <base-form
            ref="baseForm"
            :formData="formData"
            :rules="rules"
            direction="right"
            labelWidth="170px"
            @change="changeForm"
            v-if="showPro"
          ></base-form>
          <base-form
            ref="baseForm"
            :formData="formDataCity"
            :rules="rules2"
            direction="right"
            labelWidth="160px"
            @change="changeForm"
            v-else
          ></base-form>
          <el-row class="vlt-edit-btn"  style="margin-left: 170px">
            <el-button id="developmentPlanCreate-submit" type="primary"  size="medium" @click="submit()">提 交</el-button>
            <el-button id="developmentPlanCreate-cancel" size="medium" @click="cancel">取 消</el-button>
          </el-row>
        </div>
      </panel>
    </div>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
import { getCascaderCheckedItem } from "@/utils/getCascaderCheckedItem.js";

export default {
  name: "developmentPlanCreate",
  data() {
    return {
      showPro: true,
      formData: [
        {
          title: "计划年份",
          type: "datepicker",
          prop: "planDate",
          dateType: "year",
          value: "",
          pickerOptions: { disabledDate (data ) { return  data.getFullYear() < new Date().getFullYear(); } },
        },
        {
          title: "所属机构",
          type: "cascader",
          prop: "insId",
          value: null,
          options: [],
          disabled: true,
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        },
        { title: "省属自营厅", type: "input", prop: "newSellingHall", value: "", placeholder: '请输入省属自营厅数量' },
        { title: "市属自营厅", type: "input", prop: "cityNewSellingHall", value: "", placeholder: '请输入市属自营厅数量' },
        { title: "省属自营厅投注机", type: "input", prop: "sellingMachine", value: "", placeholder: '请输入省属自营厅投注机数量' },
        { title: "市属自营厅投注机", type: "input", prop: "citySellingMachine", value: "", placeholder: '请输入市属自营厅投注机数量'  },
        { title: "省合作厅", type: "input", prop: "cooperationHall", value: "" , placeholder: '请输入省合作厅数量' },
        { title: "市合作厅", type: "input", prop: "cityCooperationHall", value: "", placeholder: '请输入市合作厅数量'  },
        { title: "省合作厅投注机", type: "input", prop: "cooperationMachine", value: "", placeholder: '请输入省合作厅投注机数量'  },
        { title: "市合作厅投注机", type: "input", prop: "cityCooperationMachine", value: "", placeholder: '请输入市合作厅投注机数量'  },
        { title: "销量计划", type: "input-number", prop: "salesPlan", value: "", placeholder: '请输入销量计划'},
        { title: "发展预算金额", type: "input-number-point", prop: "developBudget", unit:'元', value: "" },
        { title: "计划说明", type: "textarea", prop: "planDesc", value: "", maxlength: 200 }
      ],
      formDataCity: [
        {
          title: "计划年份",
          type: "datepicker",
          prop: "planDate",
          dateType: "year",
          value: "",
          pickerOptions: {
            disabledDate (data ) {
              return  data.getFullYear() < new Date().getFullYear();
            }
          }
        },
        {
          type: "cascader",
          prop: "insId",
          value: "",
          title: "所属机构",
          options: [],
          disabled: true,
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        },
        { title: "市属自营厅", type: "input", prop: "newSellingHall", value: "", placeholder: '请输入市属自营厅数量'  },
        { title: "市属自营厅投注机", type: "input", prop: "sellingMachine", value: "", placeholder: '请输入市属自营厅投注机数量'  },
        { title: "市合作厅", type: "input", prop: "cooperationHall", value: "", placeholder: '请输入市合作厅数量'  },
        { title: "市合作厅投注机", type: "input", prop: "cooperationMachine", value: "", placeholder: '请输入市合作厅投注机数量'  },
        { title: "销量计划", type: "input-number", prop: "salesPlan", value: "", placeholder: '请输入销量计划'},
        { title: "发展预算金额", type: "input-number-point", prop: "developBudget", unit:'元', value: "" },
        { title: "计划说明", type: "textarea", prop: "planDesc", value: "", maxlength: 200 }
      ],
      params: {
        insLevel: 2
      },
      rules: {
        planDate: [ { required: true, validator: this.$rules.checkEmpty, trigger: ['change','blur'],  message:'请选择计划年份' } ],
        insId: [ { required: true, trigger: "change",  message:'请选择所属机构' } ],
        newSellingHall: [ { required: true, validator: this.$rules.checkEmptyNumber, trigger: ['change','blur'],  title:'省属自营厅'} ],
        sellingMachine: [
          // { required: true, validator: rules.checkEmpty, trigger: ['change','blur'], title:'销售厅投注机'},
          { required: true, validator: this.$rules.checkEmptyNumber, trigger: ['change','blur'] , title:'省属自营厅投注机'}],
        cooperationHall: [{ required: true, validator: this.$rules.checkEmptyNumber, trigger: ['change','blur'] , title:'省合作厅'}],
        cooperationMachine: [{ required: true, validator: this.$rules.checkEmptyNumber, trigger: ['change','blur'],title:'省合作厅投注机' }],
        developBudget:[{ required: true, validator: this.$rules.donationAmount, trigger: ['change','blur'],title:'发展预算金额' }],
        planDesc:[ { required: true, trigger: ['change','blur'], message:'计划说明不能为空'}],
        salesPlan:[ { required: true, validator:this.$rules.checkPositive, trigger: ['change','blur'], title:'销量计划'}]
      },
      rules2: {
        planDate: [ { required: true, validator: this.$rules.checkEmpty, trigger: ['change','blur'],  message:'请选择计划年份' } ],
        insId: [ { required: true, trigger: "change",  message:'请选择所属机构' } ],
        newSellingHall: [ { required: true, validator: this.$rules.checkEmptyNumber, trigger: ['change','blur'],  title:'市属自营厅'} ],
        sellingMachine: [ { required: true, validator: this.$rules.checkEmptyNumber, trigger: ['change','blur'] , title:'市属自营厅投注机'}],
        cooperationHall: [{ required: true, validator: this.$rules.checkEmptyNumber, trigger: ['change','blur'] , title:'市合作厅'}],
        cooperationMachine: [{ required: true, validator: this.$rules.checkEmptyNumber, trigger: ['change','blur'],title:'市合作厅投注机' }],
        developBudget:[{ required: true, validator: this.$rules.donationAmount, trigger: ['change','blur'], title:'发展预算金额' }],
        planDesc:[ { required: true, trigger: ['change','blur'], message:'计划说明不能为空'}],
        salesPlan:[ { required: true, validator:this.$rules.checkPositive, trigger: ['change','blur'], title:'销量计划'}]
      },
      cascaderOptions: [],
      listTree: [],
      provincePlanDate: new Date().getFullYear(),
    };
  },
  mounted() {},
  created() {
    // 拿到用户insInfo, insLevel
    const insData = this.$route.query;
    this.getUserInsInfoList();
    // 获取所属机构数据
    this.getInsData(insData);
    // 用户所在机构
    if (insData.insLevel == 1) {
      // 省级用户 调省查市接口
      // 市级数据 不能输入
      let data = {
        insId: insData.insId,
        planDate: new Date().getFullYear()
      };
      this.formData[0].value = '' + new Date().getFullYear()
      this.getProvinceCityPlan(data);
    } else {
      let data = {
        insId: insData.insId,
        planDate: new Date().getFullYear()
      };
      this.showPro = false;
      this.$set(this.formDataCity[0], 'value', '' + new Date().getFullYear());
    }
  },
  methods: {
    getUserInsInfoList() {
      const _this = this;
      (async data => {
        let res = await _this.$api.getUserInsInfoList({});
        // 返回的data 有0 时 表示有计划列表的权限 那么计划列表的tab显示，反之隐藏，
        // 同理 有一级的时候 则显示省级的数据，市级亦是如此
        if (res && res.code == 0) {
          if (res.data) {
            console.log("获取的机构。。。", res);
            _this.listTree = res.data;
            console.log(_this.listTree);
          }
        } else {
          _this.$message.warning(res.msg);
        }
      })();
    },
    // 省级用户查询市级数据
    getProvinceCityPlan(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getProvinceCityPlan({ data });
        console.log("获取省级的数据",data, res);
        if (res && res.code == 0) {
          if (res.data != null) {
            self.cascaderOptions = res.data;
            // 遍历把市的值填到输入框中
            self.formData.forEach(item => {
              if (
                item.prop == "cityNewSellingHall" ||
                item.prop == "citySellingMachine" ||
                item.prop == "cityCooperationHall" ||
                item.prop == "cityCooperationMachine"
              ) {
                self.$set(item, 'value', res.data[item.prop]);
                // item.value = res.data[item.prop];
                self.$set(item, 'disabled', true);
              }
            });
          } else {
            self.formData.forEach(item => {
              if (
                item.prop == "cityNewSellingHall" ||
                item.prop == "citySellingMachine" ||
                item.prop == "cityCooperationHall" ||
                item.prop == "cityCooperationMachine"
              ) {
                self.$set(item, 'disabled', true);
                self.$set(item, 'value', '0');
              }
            });
            // self.$set(self.formData[0], 'value', '' + data.planDate);

            console.log("请先添加市级数据");
          }
        } else {
          self.$message.warning(res.msg);
        }
      })(data);
    },
    // 获取机构数据
    getInsData(insData) {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          let newData = res.data;
          console.log('res.data', res.data);
          if (res.data != null) {
            if (insData.insLevel == 1) {
              res.data.forEach(item => {
                delete item.children
              });
              self.$set(self.formData[1], "options", res.data);
              // self.formData[1].value = insData.insId;
            } else {
              let prov = res.data.filter(a => {
                if (a.id == insData.insId) {
                  console.log('a', a);
                  return a;
                }
              })
              prov.forEach(item => {
                delete item.children
              })
              newData = prov;
              console.log(insData.insLevel);
              self.$set(self.formDataCity[1], "options", newData);
            }
            self.cascaderOptions = res.data;
            self.$set(self.formData[1], "value", self.$route.query.insId*1);
            self.$set(self.formDataCity[1], "value", self.$route.query.insId*1);
            
          }
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    // 新建发展计划
    createDevelopPlan() {
      const self = this;
      this.params.insLevel = parseInt(this.$route.query.insLevel);
      this.params.developBudget = Number(this.params.developBudget).toFixed(2) * 10000;
      const data = this.params;
      console.log("请求的数据", data, parseInt(this.$route.query.insLevel));
       
      (async data => {
        let res = await self.$api.createDevelopPlan({ data });
        if (res && res.code == 0) {
          self.$message.success("提交成功");
          setTimeout(() => {
            self.$router.push({ name: "developmentPlanList" });
          }, 500);
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    changeForm(val) {
      console.log(val.planDate);
      // if (val.planDate) {
      //   this.params.planDate = moment(val.planDate).format("YYYY");
      // }
      // console.log('this.params.planDate', this.params.planDate);
      if (val.planDate != this.provincePlanDate && this.$route.query.insLevel == 1) {
        
        let data = {
          insId: this.$route.query.insId,
          planDate: moment(val.planDate).format("YYYY")
        }
        this.getProvinceCityPlan(data);
        this.$set(this.formData[0], 'value', '' + val.planDate);
        this.provincePlanDate = val.planDate;
      } else if (val.planDate != this.provincePlanDate && this.$route.query.insLevel == 2) {
        console.log('else');
        // for(let i = 2; i < 9; i++) {
        //   console.log(this.formDataCity[i].value);
        //   this.$set(this.formDataCity[i], 'value', null);
          // val.newSellingHall = null;
          // val.sellingMachine = null;
          // val.cooperationHall = null;
          // val.cooperationMachine = null;
          // val.salesPlan = null;
          // val.developBudget = null;
          // val.planDesc = null;
        // }
        this.provincePlanDate = val.planDate;
      }
      this.params = Object.assign(this.params, val);
      // console.log('派发出来的参数',this.params);
      if (this.params.planDate) {
        this.params.planDate = moment(val.planDate).format("YYYY");
      }
      console.log(this.params);
    },
    submit() {
      console.log(this.params);
      const self = this;
      self.$refs.baseForm.validate(val => {
          console.log(val);
        if (val === 'true') {
          self.createDevelopPlan();
        } else {
           self.$message.warning('请正确填写表单'); 
          // setTimeout(()=>{
          //   var isError= document.getElementsByClassName("is-error");
          //   isError[0].querySelector('input').focus();
          // },100);
          return false;
        }
      });
    },
    changeSelect(val) {
      console.log(this.form, val);
    },
    cancel() {
      this.$router.back();
    }
  }
};
</script>
<style lang="less">
.el-cascader-panel {
  #cascader-menu-1956-3 {
    display: none !important;
  }
}
</style>
<style lang="less" scoped>
@import "../less/index.less";
</style>
