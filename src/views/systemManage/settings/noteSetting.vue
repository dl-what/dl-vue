<template>
  <div class="vlt-card">
    <!-- 短信设置 -->
    <div class="vlt-edit-single">
      <div class="vlt-edit-wrap">
        <base-form
          :formData="data1"
          ref="baseForm"
          labelWidth="110px"
          :rules="rules1"
          direction="right"
          @change="changeForm"
          style="border-bottom: 1px solid #e8eaec"
        ></base-form>
        <h2 class="title">发送对象</h2>
        <base-form
          :formData="data2"
          ref="baseForm"
          labelWidth="110px"
          :rules="rules1"
          direction="right"
          @change="changeForm"
          style="border-bottom: 1px solid #e8eaec"
        ></base-form>
        <h2 class="title">消息内容格式</h2>
        <base-form
          :formData="data3"
          ref="baseForm"
          labelWidth="110px"
          :rules="rules1"
          direction="right"
          @change="changeForm"
          style="border-bottom: 1px solid #e8eaec"
        ></base-form>
        <h2 class="title">发送时间</h2>
        <base-form
          :formData="data4"
          ref="baseForm"
          :rules="rules1"
          direction="right"
          @change="changeForm"
        ></base-form>
        <el-row class="vlt-edit-btn">
          <el-button type="primary" v-prevent="1000" size="medium" @click="submit">提交</el-button>
          <el-button size="medium" @click="editShow = !editShow">取消</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import rules from "../../../utils/rules";
export default {
  name: "",
  data() {
    return {
      params: {},
      data1: [
        {
          title: "短信提醒",
          type: "radio",
          prop: "userName",
          value: "",
          options: [{ label:"开启", value: "1" }, { label: "关闭", value: "0" }]
        },
      ],
      data2: [
        {
          title: "部门",
          type: "select",
          prop: "sector",
          value: ""
        },
        {
          title: "角色",
          type: "select",
          prop: "role",
          value: ""
        },
        {
          title: "人员",
          type: "select",
          prop: "person",
          value: ""
        },
      ],
      data3: [
        {
          title: "标题字号",
          type: "select",
          prop: "titleFontSize",
          value: ""
        },
        {
          title: "标题字体",
          type: "select",
          prop: "titleFontType",
          value: ""
        },
        {
          title: "内容字号",
          type: "select",
          prop: "contentFontSzie",
          value: ""
        },
        {
          title: "内容字体",
          type: "select",
          prop: "contentType",
          value: ""
        },
      ],
      data4: [
        {title: "选择日期",type: "datepicker-range",prop: "sendTime",value: "",option:['start','end']},
        {
          title: "定期模式",
          type: "radio",
          prop: "regularPattern",
          value: "",
          options:[
            { label:"每日", value: "0" },
            { label: "每周", value: "1" },
            { label: "每月", value: "2" },
            { label: "指定日期", value: "3" }
          ]
        },
        {
          title: "发送时间",
          type: "datetime",
          prop: "sendTime",
          value: ""
        }
      ],
      radio: "1",
      rules1: {}
    };
  },
  components: {},
  async created() {
   
    let reslt = await this.$api.sms();
    console.log(reslt)
  },
  methods: {
    changeForm(val) {
      Object.assign(this.params, val);
      console.log("派发出来的参数", this.params);
    },
    submit() {
      this.$refs.baseForm.validate(val => {
        console.log(val);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.vlt-edit-single .title {
  border-color: #fff;
}

</style>
