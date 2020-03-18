<template>
  <div class="vlt-card">
    <panel :show="true" :title="title">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <el-form
            :rules="rules"
            ref="ruleForm"
            :model="form"
            label-width="100px"
            label-position="right"
            class="demo-ruleForm"
          >
            <el-form-item label="用户账号" prop="account">
              <el-input
                show-word-limit
                type="text"
                maxlength="25"
                v-model.trim="form.account"
                :disabled="title === '新增用户'? false:true "
              ></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="userName">
              <el-input type="text" v-model.trim="form.userName" maxlength="10" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="所属机构" prop="insInfoVo">
              <el-cascader
                @change="handelerChange"
                v-model="form.insInfoVo"
                :options="options"
                :props="setProps"
                clearable
              ></el-cascader>
            </el-form-item>
            <el-form-item label="所属部门" prop="deptInfoList">
              <el-cascader
                v-model="form.deptInfoList"
                :options="userDeptOptions"
                :props="setProps"
                clearable
              ></el-cascader>
            </el-form-item>
            <el-form-item label="用户角色" prop="roleInfoList">
              <el-select v-model="form.roleInfoList" multiple placeholder="请选择角色">
                <el-option
                  v-for="(item,index) in userListOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input type="text" v-model.trim="form.mobile" maxlength="11" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input type="email" v-model.trim="form.email" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item>
              <el-row class="el-form-item vlt-edit-btn">
                <el-button
                  type="primary"
                  v-prevent="1000"
                  size="medium"
                  @click="userSubmit"
                  :id="$route.name+'-create-submit'"
                >提 交</el-button>
                <el-button size="medium" @click="cencle" :id="$route.name+'-create-cencel'">取 消</el-button>
              </el-row> 
            </el-form-item>
          </el-form>
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
import rules from "@/utils/rules";
import storage from "@/utils/storage"
const Base64 = require('js-base64').Base64

export default {
  name: "userInformed",
  data() {
    return {
      insData: {},
      title: "",
      nowId: null,
      userFo: {},
      rules: {
        userName: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: ["change", "blur"]
          },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: "用户名不支持特殊字符",
            trigger: ["change", "blur"]
          }
        ],
        mobile: [
          {
            required: true,
            validator: rules.checkPhone,
            trigger: ["change", "blur"]
          }
        ],
        email: [
          {
            required: false,
            validator: rules.checkUnEmail,
            trigger: ["change", "blur"]
          }
        ],
        account: [
          {
            required: true,
            validator: rules.checkAccount,
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[_a-zA-Z0-9.·-]+$/,
            message: "账号不支持汉字及特殊字符",
            trigger: ["change", "blur"]
          }
        ],
        roleInfoList: [
          {
            required: true,
            message: "用户角色不能为空",
            trigger: ["change", "blur"]
          }
        ],
        insInfoVo: [
          {
            required: true,
            message: "用户机构选择不能为空",
            trigger: ["change", "blur"]
          }
        ]
      },
      options: [],
      userListOptions: [],
      userDeptOptions: [],
      setProps: {
        value: "id",
        label: "text",
        checkStrictly: true,
        children: "children"
      },
      form: {
        userName: "",
        mobile: "",
        email: "",
        userStatus: 0,
        deptInfoList: [],
        account: "",
        insInfoVo: [],
        roleInfoList: []
      },
      ifoData: {},

      // 报表与BI token
      reportUserLogin_token: storage.get('reportUserLogin_token'),
      biUserLogin_token: storage.get('biUserLogin_token')
    };
  },
  async created() {
    this.title = this.$route.query.type=='0'?'新增用户':'编辑用户';
    let reslt = await this.$api.QueryUserAndInsTree();
    if (reslt && reslt.code === 0) {
      this.options = reslt.data;
      this.insData = reslt.data;
    }

    let reslt3 = await this.$api.QueryAllRole();
    if (reslt3 && reslt3.code === 0) {
      let arr3 = reslt3.data.map((item, index) => {
        return { label: item.roleName, value: item.roleId };
      });
      this.userListOptions = JSON.parse(JSON.stringify(arr3));
    }
    this.userFo = this.$storage.get("userInfo");
    let id = this.$route.query.id;
    if (id) {
      let arr = Object.keys(this.form);
      let reslt = await this.$api.getUserDestils({ data: id });
      if (reslt && reslt.code === 0) {
        this.ifoData = reslt.data;
        let data = reslt.data;
        arr.forEach(item => {
          if (
            item != "userStatus" &&
            item != "insInfoVo" &&
            item != "deptInfoList" &&
            item != "roleInfoList"
          ) {
            this.form[item] = data[item] || "";
          }
          if (item === "userStatus") {
            this.form[item] = data[item];
          }
          if (item === "insInfoVo" && data["insInfoVo"]) {
            this.form[item] = data[item]["insId"] || [];
            this.nowId = data[item]["insId"];
            this.getdepment(data[item]["insId"]);
          }
          if (item === "deptInfoList") {
            let arr = [];
            if (data[item].length) {
              data[item].forEach(i => {
                if (i) {
                  arr.push(i.departmentId);
                }
              });
            }
            this.form[item] = arr;
          }
          if (item === "roleInfoList") {
            let arr = [];
            if (data[item].length) {
              data[item].map(i => {
                if (i) {
                  arr.push(i.roleId);
                }
              });
            }
            this.form[item] = arr;
          }
        });
      }
    }
  },
  methods: {
    handelerChange(val) {
      this.$set(this.form, 'deptInfoList', []);
      if (val.length > 0) {
        let num = val[val.length - 1];
        this.getdepment(num);
      }
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
    // 报表与BI第三方接口同步创建与编辑
    async syncUserCreate(apiName, token, userInfo) {
      if (!token) {
        console.log('报表/BI-token为空')
        return;
      }
      console.log(apiName + '-userInfo', userInfo)
      const data = {
        username: userInfo.account,
        realName: userInfo.userName,
        email: userInfo.email,
        mobile: userInfo.mobile,
        roleIds: [], // userInfo.roleInfoList.map(item => String(item.roleId)),
        departmentPostId: '', // userInfo.deptInfoList.map(item => item.departmentId).join('@@@'),
        password: Base64.encode('123456')
      };
      // 编辑
      if (userInfo.userId) {
        // 查询bi与报表用户id
        let list = [];
        switch (apiName) {
          case 'reportUserEdit':
            list = await this.getSyncUserList('reportGetUsers', this.reportUserLogin_token, data.username);
            break;
          case 'biUserEdit':
            list = await this.getSyncUserList('biGetUsers', this.biUserLogin_token, data.username);
            break;
        }
        list.forEach(userItem => {
          if (userItem.username === data.username) {
            data.id = userItem.id;
          }
        })
        delete data.password;
      }
      const res = await this.$api[apiName]({
        token,
        data
      })
    },
    // 提交
    userSubmit() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          let insInfoVos = JSON.parse(JSON.stringify(this.form.insInfoVo));
          let insInfoVo;
          if (Array.isArray(insInfoVos)) {
            insInfoVo = insInfoVos[insInfoVos.length - 1];
          } else {
            insInfoVo = insInfoVos;
          }
          if (Object.keys(insInfoVo).includes("insId")) {
            insInfoVo = insInfoVo;
          } else {
            insInfoVo = { insId: insInfoVo };
          }
          const roleInfoList = this.form.roleInfoList.map(item => {
            if (Object.keys(this.form.roleInfoList).includes("roleId")) {
              return { ...item };
            } else {
              return { roleId: item };
            }
          });
          const deptInfoList = this.form.deptInfoList.map(item => {
            if (Object.keys(item).includes("departmentId")) {
              return { ...item };
            } else {
              return { departmentId: item };
            }
          });
          let form = JSON.parse(JSON.stringify(this.form));
          let data = {
            ...form,
            insInfoVo,
            roleInfoList,
            deptInfoList
          };
          if (this.$route.query.type == "0") {

            this.syncUserCreate('reportUserCreate', this.reportUserLogin_token, data);// 新增报表用户
            this.syncUserCreate('biUserCreate', this.biUserLogin_token, data); // 新增BI用户
           
            let reslt = await this.$api.userRegist({
              message: "新建成功",
              data
            });
            if (reslt && reslt.code === 0) {
              this.$router.push({ name: "userList" });
            }
          } else if (this.$route.query.type == "1") {
            data.userId = this.ifoData.userId;

            this.syncUserCreate('reportUserEdit', this.reportUserLogin_token, data);// 编辑报表用户
            this.syncUserCreate('biUserEdit', this.biUserLogin_token, data); // 编辑BI用户
            
            if (data.mobile == this.ifoData.mobile) {
              delete data.mobile;
            }
            let reslt = await this.$api.userEdit({ message: "编辑成功", data });
            if (reslt && reslt.code == 0) {
              if (
                this.userFo.account === data.account &&
                this.userFo.insId != data.insInfoVo.insId
              ) {
                this.userFo.insId = Number(data.insInfoVo.insId);
                let str = JSON.parse(JSON.stringify(this.userFo));
                this.$storage.set("userInfo", str);
                this.$router.push({ name: "userList" });
              } else {
                this.$router.push({ name: "userList" });
              }
            }
          }
        } else {
          this.$message({
            type: "error",
            message: "请正确填写表单！"
          });
        }
      });
    },
    cencle() {
      this.$router.go(-1);
    },
    async getdepment(val) {
      let reslt = await this.$api.FindDeptTreeRoots({ data: val });
      if (reslt && reslt.code === 0) {
        this.userDeptOptions = reslt.data;
      }
    }
  }
};
</script>



<style lang="less">
.vlt-edit-single .vlt-edit-btn {
  margin-left: 0px;
}
</style>