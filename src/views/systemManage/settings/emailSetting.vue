<template>
  <div class="vlt-card">
    <!-- 邮件设置 -->
    <div class="vlt-edit-single">
      <div class="vlt-edit-wrap">
        <base-form
          :formData="data1"
          ref="baseForm"
          labelWidth="110px"
          :rules="rules1"
          direction="right"
          @change="changeForm"
        ></base-form>
      </div>
    </div>
    <!-- 添加模块 -->
    <div>
      <div>
        <el-form
          label-position="right"
          label-width="90px"
          ref="form"
          :model="formSendContent"
          :rules="rules"
        >
          <!-- 发送内容 -->
          <el-form-item
            v-for="(item,index) in sendContent"
            :key="index"
            :label="`${item.title}${index+1}`"
          >
            <el-select v-model="item.type" placeholder="请选择一个报表" class="sendContent">
              <el-option
                v-for="(list,index) in item.optionsType"
                :key="index"
                :label="list.label"
                :value="list"
              ></el-option>
            </el-select>
            <span>接收人</span>
            <el-select v-model="item.department" placeholder="请选择一个部门" class="sendContent">
              <el-option
                v-for="(list, index) in item.optionsDepartment"
                :key="index"
                :label="list.label"
                :value="list"
              ></el-option>
            </el-select>
            <el-select v-model="item.staff" placeholder="请选择一个员工" class="sendContent">
              <el-option
                v-for="(list, index) in item.optionsStaff"
                :key="index"
                :label="list.label"
                :value="list"
              ></el-option>
            </el-select>
            <el-button size="medium" class="vlt-add-more"  @click="addSendContent" icon="el-icon-plus" type="primary">增加</el-button>
            <el-button
              v-if="index!==0"
              class="delete vlt-delete-more"
              @click="deleteSendContent(index)"
            >删除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row class="vlt-edit-btn">
        <el-button type="primary" v-prevent="1000" size="medium" @click="submit">提交</el-button>
        <el-button size="medium" @click="editShow">取消</el-button>
      </el-row>
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
          title: "邮件发送",
          type: "radio",
          prop: "emailSend",
          value: "",
          options: [{ label:"开启", value: "1" }, { label: "关闭", value: "0" }]
        },
        {
          title: "SMTP服务器地址",
          type: "input",
          prop: "serverSite",
          value: ""
        },
        { title: "SMTP端口号", type: "input", prop: "portNumber", value: "" },
        { title: "SMTP用户名", type: "input", prop: "userName", value: "" },
        { title: "SMTP密码", type: "input", prop: "pwd", value: "" },
        { title: "发信人地址", type: "input", prop: "senderSite", value: "" },
        { title: "发信人名称", type: "input", prop: "senderName", value: "" },
        {
          title: "邮件类型",
          type: "radio",
          prop: "emailType",
          value: "",
          options: [
            { label:  "纯文本邮件", value: "0" },
            { label: "HTML邮件", value: "1" }
          ]
        }
      ],
      radio: "1",
      rules1: {},
      rules: {},
      workerData: {
        region: ""
      },
      sendContent: [
        {
          title: "发送内容",
          propType: "type",
          propDepartment: "department",
          propStaff: "staff",
          optionsType: [
            { label: "类型一", value: 1 },
            { label: "类型二", value: 2 }
          ],
          optionsDepartment: [
            { label: "部门一", value: 1 },
            { label: "部门二", value: 2 }
          ],
          optionsStaff: [
            { label: "张三", value: 1 },
            { label: "李四", value: 2 }
          ]
        }
      ],

      formSendContent: {}
    };
  },
  components: {},
  methods: {
    changeForm(val) {
      Object.assign(this.params, val);
      console.log("派发出来的参数", this.params);
    },
    submit() {
      this.$refs.baseForm.validate(val => {
        console.log(val);
      });
    },
    addSendContent() {
      let cloneData = JSON.parse(JSON.stringify(this.sendContent[0]));
      //console.log(cloneData)
      cloneData.propType = `${cloneData.propType}${this.sendContent.length}`;
      cloneData.propDepartment = `${cloneData.propDepartment}${this.sendContent.length}`;
      cloneData.propStaff = `${cloneData.propStaff}${this.sendContent.length}`;
      this.$set(this.sendContent, this.sendContent.length,cloneData);
      
    },
    deleteSendContent(index) {
      this.sendContent.splice(index, 1);
      console.log("删除成功", this.sendContent[index-1].optionsStaff[1].label);
    },
    editShow(){
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
// .vlt-edit-single .title {
//   border-color: #fff;
// }
// .el-form-item {
//   width: 300px;
// }
.sendContent {
  margin: 0 20px;
}
</style>




