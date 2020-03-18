<template>
  <div class="vlt-card">
    <!-- 参数设置 -->
    <div class="vlt-edit-single paramSetting"> 
      <div class="vlt-edit-wrap">
        <!-- <h2 class="title">消息提醒</h2>
          <el-form :label-position="labelPosition" :model="form1" :rules="rules" ref="form1" label-width="140px" class="demo-ruleForm">
            <el-form-item label="发送提醒" prop="sendReminder">
              <el-radio-group v-model="form1.sendReminder" @change="handleSend">
                <el-radio v-model="form1.sendReminder" :label="1">开启</el-radio>
                <el-radio v-model="form1.sendReminder" :label="2">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="选择提醒方式" prop="warnWay">
              <el-select v-model="form1.warnWay" placeholder="请选择提醒方式" :disabled="dis" >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option> 
              </el-select>
            </el-form-item>
            <el-form-item label="过期预警(提前天数)" prop="pastWarn">
              <el-input v-model="form1.pastWarn" :disabled="dis" placeholder="请输入过期预警天数"><template slot="append">天</template></el-input>
            </el-form-item>
          </el-form>
        <h2 class="title">上缴方式</h2>
          <el-form :label-position="labelPosition"  :model="form2" :rules="rules" ref="form2" label-width="140px" class="demo-ruleForm">
            <el-form-item label="是否实扣" prop="realBuckle">
              <el-radio-group v-model="form2.realBuckle" @change="handlePayWay">
                <el-radio v-model="form2.realBuckle" :label="1">是</el-radio>
                <el-radio v-model="form2.realBuckle" :label="2">否</el-radio>
              </el-radio-group> 
            </el-form-item>
            <el-form-item label="选择非实扣方式" prop="norealBuckle">
              <el-select v-model="form2.norealBuckle" placeholder="请选择实扣方式" :disabled="disab">
                <el-option label="周扣" value=1></el-option>
                <el-option label="月扣" value=2></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        <h2 class="title">财务参数</h2>
          <el-form  :label-position="labelPosition" :model="form3" :rules="rules" ref="form3" label-width="140px" class="demo-ruleForm">
            <el-form-item label="是否自动转账" prop="autoTransfer">
              <el-radio v-model="form3.autoTransfer" :label="1">是</el-radio>
              <el-radio v-model="form3.autoTransfer" :label="2">否</el-radio>
            </el-form-item>
            <el-form-item label="转账日期" prop="transferDate">
              <el-radio v-model="form3.transferDate" :label="1">每日</el-radio>
              <el-radio v-model="form3.transferDate" :label='2'>每周</el-radio>
              <el-radio v-model="form3.transferDate" :label="3">每月</el-radio>
              <el-radio v-model="form3.transferDate" :label="4">指定日期</el-radio>
            </el-form-item>
            <el-form-item prop="transferTime" label="转账时间">
              <el-date-picker type="datetime" placeholder="选择日期" :picker-options="pickerOptions" v-model="form3.transferTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-form>
        <h2 class="title">税务参数</h2>
          <el-form  :label-position="labelPosition" :model="form4" :rules="rules" ref="form4" label-width="140px" class="demo-ruleForm">
            <el-form-item label="单位名称" prop="companyName">
              <el-input v-model="form4.companyName" placeholder="中国福彩中心小组" show-word-limit  maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="税号" prop="dutyParagraph">
              <el-input v-model="form4.dutyParagraph" placeholder="20190007123" show-word-limit maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="税率" prop="taxRate" >
              <el-input v-model="form4.taxRate" placeholder="20"><template slot="append">%</template></el-input>
            </el-form-item> 
          </el-form> -->
        <h2 class="title">主题参数</h2>
        <el-form  :label-position="labelPosition" :model="formTheme" :rules="rules" ref="formTheme" label-width="8em" class="demo-ruleForm">
          <el-form-item label="选择主题类型" prop="themeKey">
            <el-select v-model="formTheme.themeKey" placeholder="请选择主题类型">
              <el-option 
                v-for="(item, index) in themeData" 
                :key="index" 
                @click.native="selectTheme(item)"
                :label="item.label" 
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="submit" v-has="'paramSetting-submit'" :id="$route.name+'-'+'submit'">提交</el-button>
            <el-button type="info" size="medium" @click="reset" v-has="'paramSetting-reset'" :id="$route.name+'-'+'reset'">重置</el-button>
          </el-form-item>
        </el-form>
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
      // options: [
      //   { label: "邮件通知", value: 1 },
      //   { label: "短信通知", value: 2 }
      // ],
      // form1: {
      //   sendReminder: "",
      //   warnWay: "",
      //   pastWarn: ""
      // },
      // dis: false,
      // disab: false,
      // form2: {
      //   realBuckle: "",
      //   norealBuckle: ""
      // },
      // form3: {
      //   autoTransfer: "",
      //   transferDate: "",
      //   transferTime: ""
      // },
      // form4: {
      //   companyName: "",
      //   dutyParagraph: "",
      //   taxRate: ""
      // },
      formTheme: {
        themeKey: "",
        themeName: ""
      },
      themeData: [],
      rules: {
        themeKey: [
          {
            required: true,
            message: "主题类型不能为空",
            trigger: ["change", "blur"]
          }
        ],
        // sendReminder: [
        //   { required: true, message: "发送提醒不能为空", trigger: ['change','blur'] }
        // ],
        // warnWay: [
        //   { required: true, message: "提醒方式不能为空", trigger: ['change','blur'] }
        // ],
        // pastWarn: [
        //   {
        //     required: true,
        //     validator: rules.numberDate,
        //     title: "过期预警天数",
        //     trigger: ['change','blur']
        //   }
        // ],
        // realBuckle: [
        //   { required: true, message: "是否实扣不能为空", trigger: ['change','blur'] }
        // ],
        // norealBuckle: [
        //   {
        //     required: true,
        //     message: "选择非实扣方式不能为空",
        //     trigger: ['change','blur']
        //   }
        // ],
        // autoTransfer: [
        //   { required: true, message: "是否自动转账不能为空", trigger: ['change','blur'] }
        // ],
        // transferDate: [
        //   { required: true, message: "转账日期不能为空", trigger: ['change','blur'] }
        // ],
        // transferTime: [
        //   { required: true, message: "请选择日期时间", trigger: ['change','blur'] }
        // ],
        // companyName: [
        //   { required: true, message: "单位名称不能为空", trigger: ['change','blur'] }
        // ],
        // dutyParagraph: [
        //   {
        //     required: true,
        //     validator: rules.numberCheck,
        //     title: "税号",
        //     trigger: ['change','blur']
        //   }
        // ],
        // taxRate: [
        //   {
        //     required: true,
        //     validator: rules.donationLimitRate,
        //     title: "税率",
        //     trigger: ['change','blur']
        //   }
        // ]
      },
      labelPosition: "left",
      radio: "1",
      formall: { sysConfigVoList: [] },
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() < Date.now() - 8.64e7;
      //   },
      //   // selectableRange: `${this.$moment(Date.now()).format('HH:mm:ss')}-23:59:59`
      // },
    };
  },
  components: {},
  created() {
    //查看接口
    this.configCat();
    // 获取主题数据
    this.configTheme();
  },
  methods: {
    selectTheme(val) {
      this.formTheme.themeKey = val.value;
      this.formTheme.themeName = val.label;
    },
    // 获取主题数据
    configTheme() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.configTheme({ data });
        if (res && res.code == 0) {
          self.themeData = res.data;
        }
      })(data);
    },
    async configCat() {
      //查看接口

      let res = await this.$api.configCat();
      console.log("查看成功", res);
      // let val1;
      // let val2;
      // let val3;
      // let val4;
      res.data.forEach(item => {
        // if (item.key == "msgNotify") {
        //   val1 = JSON.parse(item.value);
        // }
        // if (item.key == "paymentMethods") {
        //   val2 = JSON.parse(item.value);
        // }
        // if (item.key == "financialParameters") {
        //   val3 = JSON.parse(item.value);
        // }
        // if (item.key == "taxParameters") {
        //   val4 = JSON.parse(item.value);
        // }
        if (item.key == "themeConfiguration") {
          this.formTheme.themeName = JSON.parse(item.value).themeName;
          this.formTheme.themeKey = JSON.parse(item.value).themeKey;
        }
      });
      // for (var i in this.form1) {
      //   this.form1[i] = val1[i];
      //   if (this.form1.sendReminder == 2) {
      //     this.dis = true;
      //   } else {
      //     this.dis = false;
      //   }
      // }
      // for (var i in this.form2) {
      //   this.form2[i] = val2[i];
      //   if (this.form2.realBuckle == 1) {
      //     this.disab = true;
      //   } else {
      //     this.disab = false;
      //   }
      // }
      // for (var i in this.form3) {
      //   this.form3[i] = val3[i];
      // }
      // for (var i in this.form4) {
      //   this.form4[i] = val4[i];
      // }
    },
    // handleSend(val) {
    //   console.log(val);
    //   if (val == 2) {
    //     this.dis = true;
    //   } else {
    //     this.dis = false;
    //   }
    // },
    // handlePayWay(val) {
    //   if (val == 1) {
    //     this.disab = true;
    //   } else {
    //     this.disab = false;
    //   }
    // },
    async submit() {
      // let formInfo1 = false;
      // this.$refs.form1.validate(valid => {
      //   if (valid) {
      //     formInfo1 = true;
      //   }
      // });
      // let formInfo2 = false;
      // this.$refs.form2.validate(valid => {
      //   if (valid) {
      //     formInfo2 = true;
      //   }
      // });
      // let formInfo3 = false;
      // this.$refs.form3.validate(valid => {
      //   if (valid) {
      //     formInfo3 = true;
      //   }
      // });
      // let formTheme = false;
      // this.$refs.formTheme.validate(valid => {
      //   if (valid) {
      //     formTheme = true;
      //   }
      // });
      // this.$refs.form4.validate(async valid => {
      //   if (valid && formInfo1 && formInfo2 && formInfo3 && formTheme) {
        this.$refs.formTheme.validate(async valid => {
        if (valid) {
          // let form1 = {
          //   key: "msgNotify",
          //   value: JSON.stringify(this.form1)
          // };

          // console.log(999, form1);
          // let form2 = {
          //   key: "paymentMethods",
          //   value: JSON.stringify(this.form2)
          // };
          // let form3 = {
          //   key: "financialParameters",
          //   value: JSON.stringify(this.form3)
          // };
          // let form4 = {
          //   key: "taxParameters",
          //   value: JSON.stringify(this.form4)
          // };
          let formTheme = {
            key: "themeConfiguration",
            value: JSON.stringify(this.formTheme)
          };
          this.formall.sysConfigVoList = [formTheme];
          let data = this.formall;
          console.log(666, data);
          let reslt = await this.$api.configSet({ message: "设置成功", data });
          console.log("提交成功", reslt);
        }
      });
    },
    reset() {
      //重置
      this.configCat();
      // this.$refs.form4.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.vlt-edit-single {
  .title {
    border-color: #fff;
    margin-left: -10px;
  }
}
</style>


