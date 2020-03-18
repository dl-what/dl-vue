<template>
  <div class="user-setting-comp">
    <el-upload
      ref="upload"
      class="avatar-upload"
      action
      accept="image/*"
      :show-file-list="false"
      :on-remove="handleRemove"
      :http-request="uploadImg"
      :on-error="uploadError"
    >
      <div class="avatar-box">
        <el-avatar class="avatar" :src="param.userPath" v-if="param.userPath"></el-avatar>
        <el-avatar icon="el-icon-user-solid" class="avatar" v-else></el-avatar>
        <div>
          <el-button type="text" size="small">上传头像</el-button>
        </div>
      </div>
    </el-upload>
    <base-form
      :formData="form"
      labelWidth="8em"
      ref="baseForm"
      :rules="rules"
      direction="right"
      @change="changeForm"
    ></base-form>
    <el-row class="btn-item">
      <el-button
        type="primary"
        v-prevent="1000"
        size="medium"
        @click="submit"
        :id="$route.name+'-setting-submit'"
      >提 交</el-button>
      <el-button size="medium" @click="resetForm" :id="$route.name+'-setting-reset'">重 置</el-button>
    </el-row>
  </div>
</template>

<script>
import rules from "@/utils/rules";
import storage from "@/utils/storage";
import { mapGetters, mapActions } from "vuex";
import {Encrypt} from '@/utils/crypto'
const Base64 = require('js-base64').Base64

export default {
  name: "userSetting",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      user: {
        avatar: require('@/assets/img/avatar.jpg'),
        institutionName: '',
        lastLoginTime: '2019-10-07',
        loginAddress: '深圳市',
        loginIp: '10.9.0.110',
        name: 'admin'
      },
      newPassword: "",
      param: {},
     
      oldAvatar: "",
      formData: null,
      form: [
        {
          title: "用户账号",
          type: "input",
          prop: "account",
          value: "",
          disabled: true
        },
        {
          title: "用户姓名",
          type: "input",
          prop: "userName",
          value: "",
          disabled: true
        },
        {
          title: "手机号",
          type: "input",
          prop: "mobile",
          value: "",
          disabled: true
        },
        {
          title: "邮箱",
          type: "input",
          prop: "email",
          value: "",
          disabled: true
        },
        {
          title: "请输入旧密码",
          type: "password",
          prop: "password",
          value: "",
          placeholder: "请输入旧密码",
          icon: "lock"
        },
        {
          title: "请输入新密码",
          type: "password",
          prop: "newPassword",
          value: "",
          placeholder: "请输入新密码",
          icon: "lock"
        },
        {
          title: "请重复新密码",
          type: "password",
          prop: "rePassword",
          value: "",
          placeholder: "请重复新密码",
          icon: "lock"
        }
      ],
      rules: {
        password: [
          {
            validator: rules.checkPwd,
            trigger: ['change','blur']
          }
        ],
        newPassword: [
          {
            validator: rules.checkPwd,
            trigger: ['change','blur']
          }
        ],
        rePassword: [
          {
            validator: rules.checkPwd,
            trigger: ['change','blur']
          },
          {
            validator: validatePass2,
            trigger: ['change','blur']
          }
        ]
      },
      // 报表与BI token
      reportUserLogin_token: storage.get('reportUserLogin_token'),
      biUserLogin_token: storage.get('biUserLogin_token')
    };
  },
  watch: {
    formData: {
      handler(form) {
        if (
          form.password === "" &&
          form.newPassword === "" &&
          form.rePassword === ""
        ) {
          this.$nextTick(() => {
            this.$refs.baseForm.$refs.form.clearValidate();
          });
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(["loginInfo"])
  },
  created() {
    this.oldAvatar = this.loginInfo.avatar;
    this.param = {
      userPath: this.oldAvatar
    };
    this.form.forEach(item => {
      if (item.prop in this.loginInfo) {
        item.value = this.loginInfo[item.prop];
      }
    });
  },
  mounted() {
    this.formData = this.$refs.baseForm.form;
  },
  methods: {
    changeForm(val) {
      this.param = {
        ...this.param,
        ...val
      };
      delete this.param.rePassword;
      this.param.type = Number(val.type);
      this.newPassword = val.newPassword;
    },

    // 查询BI与报表用户列表
    async getSyncUserList(apiName, token, keyword) {
      let list = [];
      const res = await this.$api[apiName]({
        token,
        data: {
          page: 1,
          count: 100,
          keyword
        }
      })
      if (typeof res === 'object' && res.data && res.data.items && Array.isArray(res.data.items)) {
        list = res.data.items;
      }
      return list;
    },

    // 查询bi与报表用户id
    async getSyncUserId(apiName, token, keyword) {
      let id;
      let list = await this.getSyncUserList(apiName, token, keyword);
      list.forEach(userItem => {
        if (userItem.username === keyword) {
          id = userItem.id;
        }
      })
      return id;
    },

    // 报表与BI用户编辑
    async syncUserEdit(apiName, token, userInfo) {
      if (!token) {
        console.log('报表/BI token为空')
        return;
      }
      console.log(apiName + '-userInfo', userInfo)
      const data = {
        id: userInfo.id,
        username: userInfo.account,
        realName: userInfo.userName,
        email: userInfo.email,
        mobile: userInfo.mobile,
        roleIds: [],
        departmentPostId: '',
        password: Base64.encode(userInfo.newPassword),
        resetPassword: true
      };
      const res = await this.$api[apiName]({
        token,
        data
      })
    },

    async save(data) {
      const res = await this.$api.updateUserPassword({
        message: "修改成功",
        data
      });
      if (res && res.code === 0) {
        this.$emit('enter');
        if (data.userPath) {
          this.oldAvatar = this.loginInfo.avatar = data.userPath;
          this.setLogin(
            Object.assign(storage.get("userInfo"), { avatar: data.userPath })
          );
        }
        if (data.password) {
          storage.remove("token");
          storage.remove("userInfo");
          this.$router.push({
            name: "login"
          });

          // 报表用户重置密码
          let id = await this.getSyncUserId('reportGetUsers', this.reportUserLogin_token, data.account);
          this.syncUserEdit('reportUserEdit', this.reportUserLogin_token, {...data, id});
          // bi用户重置密码
          id = await this.getSyncUserId('biGetUsers', this.biUserLogin_token, data.account);
          this.syncUserEdit('biUserEdit', this.biUserLogin_token, {...data, id});
          
        }
      }
    },
    async submit() {
      const data = { ...this.param, type: 1 };
      if (data.password || data.newPassword || data.rePassword) {
        this.$refs.baseForm.validate(val => {
          if (val === "true") {
            data.password = Encrypt(data.password);
            data.newPassword = Encrypt(data.newPassword);
            data.rePassword = Encrypt(data.newPassword);
            this.save(data);
          }
        });
      } else {
        delete data.password;
        delete data.newPassword;
        delete data.rePassword;
        this.save(data);
      }
    },
    resetForm() {
      this.$refs.baseForm.resetForm();
      this.param.userPath = this.oldAvatar;
    },
    // 文件上传
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    uploadError() {
      this.$message.error('上传失败')
    },
    async uploadImg(files) {
      const size = files.file.size / 1024 / 1024;
      if (size > 2) {
        this.$message.error('上传文件最大不能超过2M');
        this.$refs.upload.clearFiles();
        return;
      }
      if ('image/gif,image/jpeg,image/png,image/jpg'.indexOf(files.file.type.split('/').reverse()[0]) < 0) {
        this.$message.error(`上传文件格式有误，请重新选择`);
        this.$refs.upload.clearFiles();
        return;
      }
      let formData = new FormData();
      formData.append("file", files.file);
      formData.append("refId", 1);
      formData.append("flag", true);
      formData.append("busType", 1);
      const res = await this.$api.uploadFile({
        loadingText: '正在上传',
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      });
      if (res && res.code === 0) {
        this.$refs.upload.clearFiles();
        this.param.userPath = res.data.filePath;
      }
    },
    ...mapActions(["setLogin"])
  }
};
</script>

<style lang="less">
.user-setting-comp{
  .avatar-upload{
    text-align: center;
    font-size: 12px;
    width: auto;
    padding: 30px;
    .el-avatar{
      width: 80px;
      height: 80px;
      overflow: hidden;
    }
    .el-icon-user-solid{
      font-size: 60px;
      line-height: 80px;
    }
  }
  .btn-item{
    padding: 20px 0;
    padding-left: 100px;
    text-align: right;
  }
}
</style>