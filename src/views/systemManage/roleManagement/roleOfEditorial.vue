<template>
  <div class="vlt-card role-editorial">
    <panel :show="true" :title="id?'编辑角色信息':'新增角色信息'">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap" style="padding:20px 20px 40px 20px">
          <el-form
            ref="form"
            label-position="top"
            label-width="120px"
            :rules="rules"
            :model="formParam"
            :disabled="status == 1 ? true:false"
          >
            <el-container>
              <el-aside>
                <!-- <div class="tree-heading">权限管理</div> -->
                <el-tree
                  :data="dataTree"
                  show-checkbox
                  :default-expanded-keys="[27,42]"
                  node-key="id"
                  ref="tree"
                  :props="setProps"
                  @check="checkChange"
                  highlight-current
                  :default-checked-keys="formParam.moduleIds"
                ></el-tree>
              </el-aside>
              <el-main class="side-right">
                <div class="info-header" v-if="status ==1">
                  <div v-for="(item,index) in  detailsList" :key="index" class="info-item">
                    <div style="display:flex">
                      <span class="info-title">{{item.title}}</span>
                      <span class="content">{{item.value}}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <el-form-item label="用户角色" prop="roleName">
                    <el-input
                      type="text"
                      v-model.trim="formParam.roleName"
                      placeholder="请输入用户角色"
                      show-word-limit
                      maxlength="10"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="角色状态" prop="status" v-if="status && status == 1">
                    <el-switch
                      v-model="formParam.status"
                      :active-value="1"
                      :inactive-value="0"
                    ></el-switch>
                  </el-form-item>
                  <el-form-item label="角色编码" prop="roleCode">
                    <el-input
                      type="text"
                      v-model.trim="formParam.roleCode"
                      :disabled="id?true:false"
                      placeholder="请输入角色编码"
                      show-word-limit
                      maxlength="10"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="角色描述" prop="roleDesc">
                    <el-input type="textarea" placeholder="请输入角色描述" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="formParam.roleDesc" maxlength="100"></el-input>
                  </el-form-item>
                  <el-form-item label="">
                    <div class="btn-wrap" >
                      <el-button
                        type="primary"
                        v-prevent="1000"
                        size="small"
                        @click="submit"
                        :id="$route.name+'-create-submit'"
                        v-if="status==1?false:true"
                      >提 交</el-button>
                      <el-button
                        size="small"
                        @click="cancel"
                        :id="$route.name+'-create-cencel'"
                      >{{status==1?'返回':'取消'}}</el-button>
                    </div>
                  </el-form-item>
                </div>
                
              </el-main>
            </el-container>
          </el-form>
          <!-- <div class="btn-group" >
            <el-button
              type="small"
              v-prevent="1000"
              size="medium"
              @click="submit"
              :id="$route.name+'-create-submit'"
              v-if="status==1?false:true"
            >提 交</el-button>
            <el-button
              size="small"
              @click="cancel"
              :id="$route.name+'-create-cencel'"
            >{{status==1?'返回':'取消'}}</el-button>
          </div> -->
        </div>
      </div>
    </panel>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules";
export default {
  name: "roleOfEditorial",
  data() {
    return {
      id: -1,
      detailsList: [
        { title: "创建时间 :", value: "", prop: "createTime" },
        { title: "更新时间 :", value: "", prop: "updateTime" },
        { title: "创建人 :", value: "", prop: "createByName" },
        { title: "更新人 :", value: "", prop: "updateByName" }
      ],
      formParam: {
        roleName: "",
        roleDesc: "",
        roleCode: "",
        status: 1,
        moduleIds: []
      },
      rules: {
        roleName: [
          {
            required: true,
            validator: this.$rules.checkName,
            title: "用户角色",
            trigger: ["change", "blur"]
          }
        ],
        roleCode: [
          {
            required: true,
            validator: this.$rules.checkCode,
            title: "角色编码",
            trigger: ["change", "blur"]
          }
        ]
      },
      dataTree: [],
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        multiple: true
      },
      currentCode: [],
      status: null
    };
  },
  created() {
    const self = this;
    this.id = this.$route.query.id;
    let status = this.$route.query.status;
    this.status = status;
    (async () => {
      let res = await this.$api.QueryModuleTree();
      if (res.code === 0) {
        self.dataTree = res.data;
        if (this.id) {
          (async () => {
            let reslt = await this.$api.QueryRoleInfoDetail({ data: this.id });
            for (let key in self.formParam) {
              if (key !== "moduleIds") {
                self.formParam[key] = reslt.data[key];
              }
            }
            this.detailsList.forEach(item => {
              item.value = reslt.data[item.prop];
              if (item.prop === "createTime" || item.prop === "updateTime") {
                item.value = this.$moment(reslt.data[item.prop]).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              }
            });
            const checkedIds = reslt.data["moduleIds"];
            const result = [];
            if (Array.isArray(checkedIds) && checkedIds.length > 0) {
              (function find(treeData) {
                for (let i = 0, len = treeData.length; i < len; i++) {
                  let children = treeData[i].children || [];
                  if (!children.length) {
                    checkedIds &&
                      checkedIds.forEach(id => {
                        if (id === treeData[i].id) {
                          result.push(id);
                        }
                      });
                  } else {
                    find(children);
                  }
                }
              })(self.dataTree);
              self.$set(self.formParam, "moduleIds", result);
            }
          })();
        }
      }
    })();
  },
  components: {},
  methods: {
    submit() {
      const self = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.id) {
            (async () => {
              self.currentCode = [];
              let arr = this.$refs.tree.getCheckedNodes(false, true);
              arr.forEach(item => {
                self.currentCode.push(item.id);
              });
              self.formParam.moduleIds = [...self.currentCode];
              let data = {
                ...self.formParam,
                roleId: self.id
              };
              let reslt = await this.$api.UpdateRoleInfo({
                message: "保存成功",
                data
              });
              if (reslt.code === 0) {
                self.$router.push({ name: "roleList" });
              }
            })();
          } else {
            (async () => {
              self.formParam.moduleIds = [...self.currentCode];
              let data = {
                ...self.formParam,
                sysCode: "VLT_BMS",
                status: Number(self.formParam.status)
              };
              let reslt = await this.$api.SaveRoleInfo({
                message: "新建成功",
                data
              });
              if (reslt.code === 0) {
                self.$router.push({ name: "roleList" });
              }
            })();
          }
          self.formParam.moduleIds = [];
        } else {
          this.$message({
            type: "error",
            message: "请正确填写表单！"
          });
        }
      });
    },
    cancel() {
      this.$router.go(-1);
    },
    checkChange() {
      this.getCodeId();
    },
    getCodeId() {
      const self = this;
      self.currentCode = [];
      let arr = this.$refs.tree.getCheckedNodes(false, true);
      arr.forEach(item => {
        self.currentCode.push(item.id);
      });
    }
  }
};
</script>

<style lang="less">
.role-editorial {
  .tree-heading{
    padding-bottom: 15px;
    font-size: 1.2em;
  }
  .panel-bd {
    padding-bottom: 0px;
  }
  .btn-wrap{
    margin-top: 15px;
  }
  .btn-group {
    margin-left: 300px;
    margin-top: 30px;
  }
  .el-aside{
    padding-right: 20px;
  }
  .side-right{
    padding: 0;
    margin-top: -5px;
    .info-header{
      border-bottom: 1px solid #e8eaec;
      padding-bottom: 10px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .info-item{
        margin-right: 20px;
        line-height: 2;
        .info-title{
          margin-right: 10px;
        }
        .content{
          color: #333;
        }
      }
    }
  }
}
</style>
