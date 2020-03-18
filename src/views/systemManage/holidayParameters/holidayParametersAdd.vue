<template>
  <div class="vlt-card">
    <panel :show="true" :title="title">
      <div class="accountAdd">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <base-form
              :formData="AddData"
              ref="baseForm"
              :rules="rules"
              labelWidth="110px"
              direction="right"
              @change="AddChangeForm"
            ></base-form>
            <el-row class="el-form-item vlt-edit-btn">
              <el-button type="primary" v-prevent="1000" size="medium" @click="AddSubmit" :id="$route.name+'-'+'submit'">提 交</el-button>
              <el-button size="medium" @click="AddCancel" :id="$route.name+'-'+'cancel'">取 消</el-button>
            </el-row>
          </div>
        </div>
      </div>
    </panel>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
import rules from "@/utils/rules.js";
import { constants } from "fs";
export default {
  name: "",
  data() {
    return {
      // formData: [],
      // 新增表单类型
      title: "",
      rules: {
        holidayName: [
          { required: true, message: "请输入假日名称", trigger: ['change','blur'] },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5]+$/,
            message: "假日名称只支持汉字",
            trigger: ['change','blur']
          }
        ],
        beginTime: [
          { required: true, message: "请输入开始时间", trigger: ['change','blur'] }
        ],
        endTime: [
          { required: true, message: "请输入结束时间", trigger: ['change','blur'] }
        ],
        // discardBeginTime: [
        //   { required: true, message: "请输入弃奖开始日期", trigger: ['change','blur'] }
        // ],
        // discardEndTime: [
        //   { required: true, message: "请输入弃奖结束日期", trigger: ['change','blur'] }
        // ]
      },
      AddData: [
        {
          type: "input-limit",
          title: "假日名称",
          value: "",
          prop: "holidayName",
          maxlength: "10"
        },
        {
          type: "datepicker",
          title: "开始日期",
          value: "",
          prop: "beginTime",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7; //禁用以前的日期，今天不禁用
            },
            // selectableRange: `${this.$moment(Date.now()).format('HH:mm:ss')}-23:59:59`
          }
        },
        {
          type: "datepicker",
          title: "结束日期",
          value: "",
          prop: "endTime",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7; //禁用以前的日期，今天不禁用
            },
            // selectableRange: `${this.$moment(Date.now()).format('HH:mm:ss')}-23:59:59`
          }
        },

        // {
        //   type: "datepicker",
        //   title: "弃奖开始日期",
        //   prop: "discardBeginTime",
        //   value: "",
        //   options: []
        // },
        // {
        //   type: "datepicker",
        //   title: "弃奖结束日期",
        //   value: "",
        //   prop: "discardEndTime"
        // },
        {
          type: "switch",
          title: "是否停销",
          value: 1,
          prop: "marketStatus",
          options: [{ label: "是", value: "1" }, { label: "否", value: "0" }]
        },
        {
          type: "switch",
          title: "是否停用",
          value: 1,
          prop: "holidayStatus",
          options: [{ label: "是", value: "1" }, { label: "否", value: "0" }]
        }
      ],
      param: {},
      holidayType: "",
      holidayName: "",
      time: {
        discardBeginTime: "",
        discardEndTime: "",
        beginTime: "",
        endTime: ""
      }
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() < Date.now() - 8.64e7;   //禁用以前的日期，今天不禁用
      //   }
      // },
    };
  },

  created() {
    //this.init();
    // console.log(this.$routes.meta.title)
    this.title = this.$route.query.type==0?'新增':'编辑';
    if (this.$route.query.ifo) {
      console.log("ifo是", this.$route.query.ifo);
      // let arr2 = Object.keys(this.$route.query.ifo);
      this.AddData.forEach(item => {
        item.value = this.$route.query.ifo[item.prop];
        // console.log("item是", item);
      });
      this.$set(this.AddData[1], "value", this.$route.query.ifo.beginTime);
      console.log(this.AddData[1].value);
    }
  },

  components: {},
  methods: {
    // 新增表单change事件
    AddChangeForm(form) {
      this.param = form;
      // this.param.beginTime = Date.parse(this.param.beginTime);
      // this.param.endTime = Date.parse(this.param.endTime);
      // this.param.discardBeginTime = Date.parse(this.param.discardBeginTime);
      // this.param.discardEndTime = Date.parse(this.param.discardEndTime);

      this.holidayName = this.param.holidayName;
      console.log(this.param);
    },
    // pickerOptions: {
    //   disabledDate(time) {
    //     return time.getTime() < Date.now() - 8.64e7;
    //     }
    //  },
    // 提交按钮
    async AddSubmit() {
      this.$refs.baseForm.validate(async val => { 
        if (val === "true") {
          let data = {};
          // data.descr="春节放假"
          // console.log("333", data);

          if (this.title === "新增") {
            // debugger
            data = this.param;
            data.beginTime = Date.parse(this.param.beginTime);
            data.endTime = Date.parse(this.param.endTime);
            // data.discardBeginTime = Date.parse(this.param.discardBeginTime);
            // data.discardEndTime = Date.parse(this.param.discardEndTime);
            if (data.beginTime <= data.endTime) {
              let result = await this.$api.addHolInfo({
                message: "添加成功",
                data: data
              });
              // this.$router.push("operationAccountManage");
              if (result && result.code === 0) {
                this.$router.go(-1);
              }
            } else if (data.beginTime > data.endTime) {
              this.$message.error("结束时间应晚于开始时间");
            } 
            // else if (data.discardBeginTime > data.discardEndTime) {
            //   this.$message.error("弃奖开始时间晚于弃奖结束时间");
            // }
          } else if (this.title === "编辑") {
            
            data = JSON.parse(JSON.stringify(this.param));
            console.log(data, "data");
            for (var i in data) {
              console.log(data[i].length);
              if (data[i].length >= 24) {
                let date = Date.parse(data[i]);
                data[i] = date;
              }
            }
            console.log(data);
            data.id = this.$route.query.ifo.id;
            if (
              data.beginTime <= data.endTime 
              // data.discardBeginTime <= data.discardEndTime
            ) {
              let result = await this.$api.holEdit({
                message: "编辑成功",
                data: data
              });
              // this.$router.push("operationAccountManage");
              // this.$router.go(-1);
              if (result && result.code === 0) {
               this.$router.go(-1);
              }
              console.log("编辑结果", result);
            } else if (data.beginTime >= data.endTime) {
              this.$message.error("结束时间应晚于开始时间");
            }
          }
        }
      });
    },
    // 取消按钮
    AddCancel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.vlt-edit-btn{
  margin-left: 110px;
}
.accountAdd{
  padding-top: 20px;
}
</style>
