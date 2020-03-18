<template>
  <div class="vlt-card ">
    <div class="vlt-edit-single">
      <panel title="编辑年度发展计划" :show="true">
        <div class="vlt-edit-wrap">
          <base-form
            ref="baseForm"
            :formData="formDataCity"
            :rules="rules2"
            direction="right"
            labelWidth="170px"
            @change="changeForm"
            v-if="!showPro"
          ></base-form>
          <base-form
            ref="baseForm"
            :formData="formData"
            :rules="rules"
            direction="right"
            labelWidth="160px"
            @change="changeForm"
            v-else
          ></base-form>
          <el-row class="vlt-edit-btn" style="margin-left: 160px">
            <el-button id="developmentPlanEdit-submit" type="primary" size="medium" @click="submit">提 交</el-button>
            <el-button id="developmentPlanEdit-edit" size="medium" @click="cancel">取 消</el-button>
          </el-row>
        </div>
      </panel>
    </div>
  </div>
</template>

<script type="text/javascript">
import { getCascaderCheckedItem } from "@/utils/getCascaderCheckedItem.js";
import { stringify } from "querystring";

export default {
  name: "developmentPlanEdit",
  data() {
    return {
      showPro: 0,
      requestEdit: {},
      formData: [
        { title: "计划年份", type: "datepicker", prop: "planDate", dateType: "year", value: "", disabled: true },
        { title: "所属机构", type: "input", prop: "insId", value: "", disabled: true },
        { title: "省属自营厅", type: "input", prop: "newSellingHall", value: 0 },
        { title: "市属自营厅", type: "input", prop: "cityNewSellingHall", value: 0 },
        { title: "省属自营厅投注机", type: "input", prop: "sellingMachine", value: 0 },
        { title: "市属自营厅投注机", type: "input", prop: "citySellingMachine", value: 0 },
        { title: "省合作厅", type: "input", prop: "cooperationHall", value: 0 },
        { title: "市合作厅", type: "input", prop: "cityCooperationHall", value: 0 },
        { title: "省合作厅投注机", type: "input", prop: "cooperationMachine", value: 0 },
        { title: "市合作厅投注机", type: "input", prop: "cityCooperationMachine", value: 0 },
        { title: "销量计划", type: "input-number", prop: "salesPlan", value: "", placeholder: '请输入销量计划'},
        { title: "发展预算金额", type: "input-number-point", prop: "developBudget", unit: "元", value: 0 },
        { title: "计划说明", type: "textarea", prop: "planDesc", value: "说明", maxlength: 200  }
      ],
      formDataCity: [
        { title: "计划年份", type: "datepicker", prop: "planDate", dateType: "year", value: "", disabled: true },
        { title: "所属机构",type: "input", prop: "insId",  value: "", disabled: true },
        { title: "市属自营厅", type: "input", prop: "newSellingHall", value: "" },
        { title: "市属自营厅投注机", type: "input", prop: "sellingMachine", value: "" },
        { title: "市合作厅", type: "input", prop: "cooperationHall", value: "" },
        { title: "市合作厅投注机", type: "input", prop: "cooperationMachine", value: "" },
        { title: "销量计划", type: "input-number", prop: "salesPlan", value: "", placeholder: '请输入销量计划'},
        { title: "发展预算金额", type: "input-number-point", prop: "developBudget", unit: "元", value: "" },
        { title: "计划说明", type: "textarea", prop: "planDesc", value: "", maxlength: 200 }
      ],
      rules: {
        // planDate: [ { required: true, validator: this.$rules.checkEmpty, trigger: ['change','blur'],  message:'请选择计划年份' } ],
        // insId: [ { required: true, trigger: "change",  message:'请选择所属机构' } ],
        newSellingHall: [ { required: true, validator: this.$rules.checkEmptyNumber, trigger: ['change','blur'],  title:'省属自营厅'} ],
        sellingMachine: [ { required: true, validator: this.$rules.checkEmptyNumber, trigger: ['change','blur'] , title:'省属自营厅投注机'}],
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
      param: {
        insLevel: 2
      },
      cascaderOptions: [],
      isPrivice: false,
      ins: {
        insId: "",
        insName: ""
      },
      provideRequest: {
        id: 0,
        insLevel: 0,
      }
    };
  },
  created() {
    const routerQuery = this.$route.query;
    if (routerQuery && routerQuery.id) {
      const data = {
        id: routerQuery.id,
        insLevel: parseInt(routerQuery.insLevel)
      };
      this.param.insLevel = parseInt(routerQuery.insLevel)
      this.getDevelopPlanInfo(data);
    }
  },
  methods: {
    // 获取信息 回填到输入框中， 如果此数据是省级数据  则市级数据显示但输入框不能修改， 如果是市级数据 则隐藏省级的数据填写
    getDevelopPlanInfo(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getDevelopPlanInfo({ data });
        if (res && res.code == 0) {
          // 根据返回 返回的数据判断是否是省级所属机构， 然后根据回填数据
          let dataList = this.param.insLevel == 1 ? this.formData : this.formDataCity;
          let dataObj = res.data;
          if (res.data != null) {
            self.ins = {
              insId:  res.data.insId,
              insName: res.data.insName
            }
            // console.log("datassssss", dataObj, self.ins);
            if (this.param.insLevel == 1) {
              // console.log('inslevel-1');
              dataObj = JSON.parse( JSON.stringify(dataObj).replace( /provinceNewSellingHall/g, "newSellingHall" ) );
              dataObj = JSON.parse( JSON.stringify(dataObj).replace( /provinceSellingMachine/g, "sellingMachine" ) );
              dataObj = JSON.parse( JSON.stringify(dataObj).replace( /provinceCooperationHall/g, "cooperationHall" ) );
              dataObj = JSON.parse( JSON.stringify(dataObj).replace( /provinceCooperationMachine/g, "cooperationMachine" ) );
            } else {
              // console.log('inslevel-2');
              dataObj = JSON.parse(JSON.stringify(dataObj).replace(/cityNewSellingHall/g, 'newSellingHall'))
              dataObj = JSON.parse(JSON.stringify(dataObj).replace(/citySellingMachine/g, 'sellingMachine'))
              dataObj = JSON.parse(JSON.stringify(dataObj).replace(/cityCooperationHall/g, 'cooperationHall'))
              dataObj = JSON.parse(JSON.stringify(dataObj).replace(/cityCooperationMachine/g, 'cooperationMachine'))
            }

            // console.log("dataObj", dataObj);
            // dataObj.developBudget = dataObj.developBudget ?  (dataObj.developBudget / 100 ) : 0;
            // console.log('dataList', dataList);
            let dataArr = Object.keys(dataObj);
            for (let i = 0; i < dataList.length; i++) {
              for (let j = 0; j < dataArr.length; j++) {
                if (dataList[i].prop == dataArr[j]) {
                  if (dataObj[dataArr[j]] == 0) {
                    dataList[i].value = '0';
                  } else {
                    dataList[i].value = dataObj[dataArr[j]];
                  }
                }
              }
            }
            self.typeDivision(self.ins);
          }
        } else {
          self.$message.warning(res.msg);
        }
      })(data);
    },
    typeDivision(ins){
      const self = this;
      // 用户所在机构
      if (self.param.insLevel == 1) {
        // console.log('1');
        self.showPro = 1;
        self.provideRequest = {
          id: self.$route.query.id,
          insLevel: self.$route.query.insLevel
        }
        self.formData.forEach(item => {
          if (
            item.prop == "cityNewSellingHall" ||
            item.prop == "citySellingMachine" ||
            item.prop == "cityCooperationHall" ||
            item.prop == "cityCooperationMachine"
          ) {
            item.disabled = true;
          }
        });
        self.$set(self.formData[1], "value", ins.insName);
      } else {
        // console.log('2');
        self.showPro = 0;
        self.$set(self.formDataCity[1], "value", ins.insName);
      }
    },

    // 返回完整数组
    getInsArray(id, key, data, keyBack) {
      // 传入id和key是对应  keyBack是返回想要的key
      const self = this;
      for (var i in data) {
        if (data[i][key] == id) {
          return [data[i][keyBack]];
        }
        if (data[i].children) {
          let ro = self.getInsArray(id, key, data[i].children, keyBack);
          if (ro !== undefined) {
            return ro.concat(data[i][keyBack]);
          }
        }
      }
    },
    changeForm(val) {
      this.requestEdit = Object.assign(this.requestEdit, val);
      if (this.requestEdit.planDate) {
        this.requestEdit.planDate =this.$moment(this.requestEdit.planDate).format("YYYY");
      }
      // console.log('this.requestEdit',  val);
    }, 
    // 修改发展计划
    editDevelopPlan() {
      const self = this;
      this.requestEdit.id = this.$route.query.id;
      this.requestEdit.insLevel = this.$route.query.insLevel;
      this.requestEdit.insId = this.ins.insId;
      this.requestEdit.developBudget = Number(this.requestEdit.developBudget).toFixed(2) * 10000;
      for (let item in this.requestEdit) {
        if (this.requestEdit[item] == '0') {
          this.requestEdit[item] = 0
        }
      }
      console.log('..', this.requestEdit);
      const data = this.requestEdit;
      (async data => {
        let res = await self.$api.editDevelopPlan({ data });
        if (res && res.code == 0) {
          self.$message.success("修改成功");
          setTimeout(() => {
            self.$router.push({ name: "developmentPlanList" });
          }, 500);
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    submit() {
      const self = this;
      self.$refs.baseForm.validate(val => {
        if (val === 'true') {
          self.editDevelopPlan();
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
    cancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
@import "../less/index.less";
</style>
