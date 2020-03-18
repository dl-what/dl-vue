<template>
  <div class="vlt-card">
    <!-- 参数设置 -->
    <div class="vlt-edit-single paramSetting">
      <div class="vlt-edit-wrap">
        <h2 class="title">消息提醒</h2>
        <base-form
          :formData="message"
          ref="message"
          labelWidth="150px"
          :rules="rules"
          direction="left"
          @change="changeForm1"
          style="border-bottom: 1px solid #e8eaec"
        ></base-form>
        <h2 class="title">上缴方式</h2>
        <base-form
          :formData="payWay"
          ref="payWay"
          labelWidth="140px"
          :rules="rules"
          direction="left"
          @change="changeForm2"
          style="border-bottom: 1px solid #e8eaec"
        ></base-form>
        <h2 class="title">财务参数</h2>
        <base-form
          :formData="finance"
          ref="finance"
          labelWidth="140px"
          :rules="rules"
          direction="left"
          @change="changeForm3"
          style="border-bottom: 1px solid #e8eaec"
        ></base-form>
        <h2 class="title">税务参数</h2>
        <base-form
          :formData="tax"
          ref="baseForm"
          labelWidth="140px"
          :rules="rules"
          direction="left"
          @change="changeForm4"
        ></base-form>
        <el-row class="vlt-edit-btn" style="margin-left:138px">
          <el-button type="primary" v-prevent="1000" size="medium" @click="submit">提交</el-button>
          <el-button type="info" v-prevent="1000" size="medium" @click="reset">重置</el-button>
          <!-- <el-button size="medium" @click="cancel">取消</el-button> -->
        </el-row>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import rules from "@/utils/rules";
export default {
  name: "",
  data() {
    return {
      rules: {
        sendReminder: [{ required: true, message: '发送提醒不能为空', trigger: ['change','blur'] }],
        warnWay: [{ required: true, message: '提醒方式不能为空', trigger: ['change','blur'] } ],
        pastWarn: [{ required: true,validator: rules.numberDate, title: '过期预警天数', trigger: ['change','blur'] }],
        realBuckle: [{ required: true, message: '是否实扣不能为空', trigger: ['change','blur'] }],
        // norealBuckle: [{ required: true, message: '选择非实扣方式不能为空', trigger: ['change','blur'] } ],
        autoTransfer: [{ required: true, message: '是否自动转账不能为空', trigger: ['change','blur'] }],
        transferDate: [{ required: true, message: '转账日期不能为空', trigger: ['change','blur'] }],
        transferTime: [
            { required: true, message: '请选择日期时间', trigger: ['change','blur'] }
          ],
        companyName: [
          { required: true, message: "单位名称不能为空", trigger: ['change','blur'] }
        ],
        dutyParagraph: [
          { required: true,message: "税号不能为空", trigger: ['change','blur'] }
        ],
        taxRate: [{ required: true,validator: rules.numberRate, title: '税率', trigger: ['change','blur'] }],

      },
      message: [
        {
          title: "发送提醒",
          type: "radio",
          prop: "sendReminder",
          value: "",
          options: [{ label: "开启", value: 1 }, { label: "关闭", value: 2 }]
        },
        {
          title: "选择提醒方式",
          type: "select",
          prop: "warnWay",
          value: "",
          options: [
            { label: "邮件通知", value: 1 },
            { label: "短信通知", value: 2 }
          ]
        },
        {
          title: "过期预警(提前天数)",  
          type: "input-unit",
          prop: "pastWarn",
          value: "",
          placeholder: "30",
          unit:"天"
        }
      ],
      payWay: [
        {
          title: "是否实扣",
          type: "radio",
          prop: "realBuckle",
          value: "",
          options: [{ label: "是", value: 1 }, { label: "否", value: 2 }]
        },
        {
          title: "选择非实扣方式",
          type: "select",
          disabled: false,
          prop: "norealBuckle",
          value: 2,
          placeholder: "",
          options: [{ label: "周扣", value: 1 }, { label: "月扣", value: 2 }]
        }
      ],
      finance: [
        {
          title: "是否自动转账",
          type: "radio",
          prop: "autoTransfer",
          value: "",
          options: [{ label: "是", value: 1 }, { label: "否", value: 2 }]
        },
        {
          title: "转账日期",
          type: "radio",
          prop: "transferDate",
          value: "",
          options: [
            { label: "每日", value: 1 },
            { label: "每周", value: 2 },
            { label: "每月", value: 3 },
            { label: "指定日期", value: 4 }
          ]
        },
        {
          title: "转账时间",
          type: "datetime",
          prop: "transferTime",
          value: ""
        }
      ],
      tax: [
        {
          title: "单位名称",
          type: "input",
          prop: "companyName",
          value: "",
          placeholder: "中国福彩中心小组"
        },
        {
          title: "税号",
          type: "input-number",
          prop: "dutyParagraph",
          value: "",
          placeholder: "20190007123"
        },
        {
          title: "税率",
          type: "input-unit",
          prop: "taxRate",
          value: "",
          placeholder: "20",
          unit:"%"
        }
      ],
      radio: "1",
      params1: {},
      params2: {},
      params3: {},
      params4: {},
      formall: { sysConfigVoList: [] }
    };
  },
  components: {},
  created() {
    
    // this.configCat();
  },
  methods: {
    async configCat() {
      //查看接口
      
      let res = await this.$api.configCat();
      console.log("查看成功", res);
      let val1 = JSON.parse(res.data[0].value);
      // let arr1 = Object.keys(val1)
      let val2 = JSON.parse(res.data[1].value);
      let val3 = JSON.parse(res.data[2].value);
      let val4 = JSON.parse(res.data[3].value);
      console.log(321, val1);
      this.message.forEach(item => {
        item.value = val1[item.prop];
      });
      this.payWay.forEach(item => {
        item.value = val2[item.prop];
      });
      this.finance.forEach(item => {
        item.value = val3[item.prop];
      });
      this.tax.forEach(item => {
        item.value = val4[item.prop];
      });
    },
    changeForm1(val) {
      // this.params1 = val;
      Object.assign(this.params1, val);
    },
    changeForm2(val) {
      console.log("val是", val);
      // if(val.realBuckle!=""){
      //   if(val.realBuckle==2){
      //     this.$set(this.payWay[1],"disabled",false)
      //   }else if(val.realBuckle==1){
      //     this.$set(this.payWay[1],"disabled",true)
      //   }
      // }
      if(val.realBuckle==2){
          this.payWay[1].disabled=false
        }else if(val.realBuckle==1){
          this.payWay[1].disabled=true
        }
      Object.assign(this.params2, val);
    },
    changeForm3(val) {
      Object.assign(this.params3, val);
    },
    changeForm4(val) {
      Object.assign(this.params4, val);
    },
    submit() {
      let messageInfo = false;
        this.$refs.message.$refs.form.validate((valid)=>{
          if(valid) {
            messageInfo = true;
          }
        })
        let payWayInfo = false;
        this.$refs.payWay.$refs.form.validate((valid)=>{
          if(valid) {
            payWayInfo = true;
          }
        })
        let financeInfo = false;
        this.$refs.finance.$refs.form.validate((valid)=>{
          if(valid) {
            financeInfo = true;
          }
        })
      this.$refs.baseForm.validate(async val => {
        if (val === "true" && financeInfo && messageInfo && payWayInfo) {
          let params1 = this.params1;
          //console.log(123, params1);
          if (params1.pastWarn < 0) {
            this.$message.error("过期预警天数不能为负数");
            return;
          }
          let form1 = {
            key: "msgNotify",
            value: JSON.stringify(this.params1)
          };

          // console.log(999, form1);
          let form2 = {
            key: "paymentMethods",
            value: JSON.stringify(this.params2)
          };
          let form3 = {
            key: "financialParameters",
            value: JSON.stringify(this.params3)
          };
          let form4 = {
            key: "taxParameters",
            value: JSON.stringify(this.params4)
          };
          this.formall.sysConfigVoList.push(form1, form2, form3, form4);
          let data = this.formall;
          console.log(666, data);
          let reslt = await this.$api.configSet({ message: "设置成功", data });
          console.log("提交成功", reslt);
        }
      });
    },
    // cancel() {
    //   this.$router.back();
    // },
    reset(){   
      this.clearForm();   
    },
    clearForm() {   
      if (this.$refs.baseForm) {
        this.$refs.baseForm.resetForm();
      }
      this.message.forEach(option => {
        this.$set(option, "value", ""); 
      });
      this.payWay.forEach(option => {
        this.$set(option, "value", ""); 
      });
      this.finance.forEach(option => {
        this.$set(option, "value", ""); 
      });
    },
  }
};
</script>

<style lang="less" scoped>

.vlt-edit-single{
  .title{
     border-color: #fff;
     margin-left:-10px;
  }
}
</style>