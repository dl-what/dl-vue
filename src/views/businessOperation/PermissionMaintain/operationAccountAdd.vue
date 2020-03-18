<!--<template>
  <div class="vlt-card">
    <div class="operationAccountAdd">
      <div class="vlt-edit-double">
        <h2 class="title">新增账号</h2>
        <div class="vlt-edit-wrap">
          <base-form
            :formData="operationAccountAddData"
            ref="baseForm"
            labelWidth="140px"
            :rules="operationAccountAddRules"
            direction="top"
            @change="operationAccountAddChangeForm"
          ></base-form>
          <el-row class="el-form-item vlt-edit-btn">
            <el-button
              type="primary"
              v-prevent="1000"
              size="medium"
              @click="operationAccountAddSubmit"
            >提 交</el-button>
            <el-button size="medium" @click="operationAccountAddCancel">取 消</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>-->

<!-- <script type="text/javascript">-->
// import rules from "@/utils/rules.js";
// export default {
//   name: "",
//   data() {
//     return {
//       // formData: [],
//       // 新增表单类型
//       operationAccountAddData: [
//         {
//           type: "select",
//           title: "所属渠道",
//           prop: "channelId",
//           value: "",
//           options: [
//             {
//               label: "专用存款账户",
//               value: 0
//             },
//             {
//               label: "专用存款账户2",
//               value: 1
//             }
//           ]
//         },
//         {
//           type: "input",
//           title: "账户名称",
//           value: "",
//           prop: "accountName"
//         },
//         {
//           type: "input",
//           title: "员工编号",
//           value: "",
//           prop: "accountCode"
//         },
//         {
//           type: "input",
//           title: "年龄",
//           value: "",
//           prop: "age"
//         },

//         {
//           type: "select",
//           title: "角色名称",
//           prop: "roleId",
//           value: "",
//           options: []
//         },
//         {
//           type: "input",
//           title: "手机号",
//           value: "",
//           prop: "phone"
//         },
//         {
//           type: "input",
//           title: "身份证号",
//           value: "",
//           prop: "channelIdentity"
//         },
//         {
//           type: "input",
//           title: "联系地址",
//           value: "",
//           prop: "address"
//         },
//         {
//           type: "input",
//           title: "账户密码",
//           prop: "password",
//           value: "",
//           //disabled: true,
//           placeholder: "初始密码为123456"
//         }
//         // {
//         //   type: "cascader-multiple",
//         //   prop: "operationManageLimit",
//         //   value: "",
//         //   title: "账号权限",
//         //   placeholder: "请选择",
//         //   value: "",
//         //   options: []
//         // }
//       ],
//       // 新增表单验证
//       operationAccountAddRules: {
//         operationManageBelong: [
//           { required: true, message: "请选择所属渠道", trigger: ['change','blur'] }
//         ],
//         operationManageName: [
//           { required: true, message: "请输入账户名称", trigger: ['change','blur'] }
//         ],
//         operationManageRoleName: [
//           { required: true, message: "请选择账户角色", trigger: ['change','blur'] }
//         ],
//         operationManageStaffNum: [
//           { required: true, message: "请输入员工编号", trigger: ['change','blur'] }
//         ],
//         operationManageAge: [
//           { required: true, message: "请输入年龄", trigger: ['change','blur'] }
//         ],
//         operationManagetelephone: [
//           { required: true, message: "请输入手机号", trigger: ['change','blur'] }
//         ],
//         operationManageIDCard: [
//           { required: true, message: "请输入身份证号", trigger: ['change','blur'] }
//         ],
//         operationManageAdress: [
//           { required: true, message: "请输入联系地址", trigger: ['change','blur'] }
//         ]
//         // operationManageLimit: [
//         //   {
//         //     type: "array",
//         //     required: true,
//         //     message: "请选择账号权限",
//         //     trigger: ['change','blur']
//         //   }
//         // ]
//       },
//       param: null
//     };
//   },
//   created() {
//     this.init();
//   },

//   components: {},
//   methods: {
//     //获得账户角色数据
//     async init() {
//       let resul = await this.$api.accountRole();
//       console.log(resul);
//       this.operationAccountAddData[4].options = resul.data;
//     },
//     // 新增表单change事件
//     operationAccountAddChangeForm(form) {
//       this.param = form;
//       // console.log(this.param);
//     },
//     // 提交按钮
//     async operationAccountAddSubmit() {
//       // console.log(this.formData);
//       let data = this.param;
//       let result = await this.$api.addAccount({ data });
//       this.$router.push("operationAccountManage");
//       console.log(result);
//       //console.log(this.$refs.baseForm.form);
//       //console.log(formdata);
//     },
//     // 取消按钮
//     operationAccountAddCancel() {
//       this.$router.go(-1);
//     }
//   }
// };
// </script>

// <style lang="less" scoped>
//
</style>
