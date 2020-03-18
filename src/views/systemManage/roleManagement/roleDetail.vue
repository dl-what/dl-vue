<template>
  <div class="vlt-card role-editorial">
   
      <div class="">
        <div class="" style="padding:20px 0 0 10px;">

            <el-container>
              <el-aside>
                <div class="tree-heading">权限管理</div>
                <el-tree
                  :data="dataTree"
                  show-checkbox
                  :default-expanded-keys="[27,42]"
                  node-key="id"
                  ref="tree"
                  :props="setProps"
                  @check="checkChange"
                  :disabled="true"
                  highlight-current
                  :default-checked-keys="formParam.moduleIds"
                ></el-tree>
              </el-aside>
              <el-main class="side-right">
                <panel :show="true" title="角色详情">
                  <base-info :infoList="detailsList"></base-info>
                </panel>
              </el-main>
            </el-container>
        </div>
      </div>
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
        { title: "用户角色", value: "", prop: "roleName" },
        { title: "角色状态", value: "", prop: "status" },
        { title: "角色编码", value: "", prop: "roleCode" },
        { title: "角色描述", value: "", prop: "roleDesc" },
        { title: "创建时间", value: "", prop: "createTime" },
        { title: "更新时间", value: "", prop: "updateTime" },
        { title: "创建人", value: "", prop: "createByName" },
        { title: "更新人", value: "", prop: "updateByName" }
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
            message: "角色名称不能为空",
            trigger: ["change", "blur"]
          },
          {
            min: 2,
            max: 10,
            message: "长度在2到 30 个字符",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: "角色名不支持特殊字符",
            trigger: ["change", "blur"]
          }
        ],
        roleCode: [
          {
            required: true,
            pattern: /^[a-zA-Z0-9.·-]+$/,
            message: "角色编码不支持汉字及特殊字符",
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
        self.setInsArray(res.data)
        // self.dataTree = res.data;
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
              if(item.prop=='status') {
                item.value = item.value==1?'启用': '禁用'
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
  methods: {
    // 选中福彩-禁用全部的区域
    setInsArray(data) {
      const self = this;
      for (var i in data) {
        if(data[i].id!=1) {
          data[i].disabled = true;
        }
        if(data[i].children) {
          self.setInsArray(data[i].children);
        }
      }
      this.dataTree = data;
      // this.$set(this.dataArray, 0, data);
      console.log('禁用全部', this.dataTree)
    },
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
  .btn-group {
    margin-left: 300px;
    margin-top: 30px;
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
