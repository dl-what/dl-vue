 <template>
  <div class="vlt-card">
    <panel :show="true" title="新增角色">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <el-form
            label-width="120px"
            :model="ruleForm"
            :rules="rules"
            ref="formName"
            class="demo-ruleForm"
          >
            <el-form-item label="用户角色" prop="roleName">
              <el-input
                v-model="ruleForm.roleName"
                placeholder="请输入用户角色"
                show-word-limit
                maxlength="10"
              ></el-input>
            </el-form-item>

            <el-form-item label="柜员机权限" prop="shiftList">
              <div class="menu-tree">
                <!--树形结构-->
                <el-tree
                  ref="tree"
                  :data="menuData"
                  show-checkbox
                  node-key="id"
                  @check="handleCheck"
                  @check-change="checkChange"
                  :expand-on-click-node="true"
                  :props="{
                    children: 'childModules',
                    value: 'id',
                    label: 'moduleName'
                  }"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span class="tree-title" style="width:40px">{{ node.label }}</span>
                    <span class="tree-button" @click.stop>
                      <el-switch
                        :disabled="data.childModules!==null || !data.checked"
                        @click.stop
                        style="display: block"
                        v-model="data.isShift"
                        :active-text="data.isShift==1 ? '下班可用' : '下班禁用'"
                        :active-value="1"
                        :inactive-value="0"
                      ></el-switch>
                    </span>
                  </span>
                </el-tree>
              </div>
            </el-form-item>

            <el-form-item label="维护APP权限" prop="appMenuRole">
              <el-checkbox-group v-model="ruleForm.appMenuRole">
                <el-checkbox
                  class="approle-check"
                  v-for="(item,index) in appMenuData"
                  :label="item.label"
                  :key="index"
                >{{item.value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="是否为负责人" prop="isManager">
              <el-radio v-model="ruleForm.isManager" label="1">是</el-radio>
              <el-radio v-model="ruleForm.isManager" label="2">否</el-radio>
            </el-form-item>

            <el-form-item label="描述" prop="remark">
              <el-input
                type="textarea"
                v-model="ruleForm.remark"
                maxlength="150"
                :autosize="{ minRows: 3, maxRows: 10}"
                placeholder="请输入描述"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div style="margin-left:0px;">
                <el-button
                  size="medium"
                  type="primary"
                  @click="submit"
                  :id="$route.name + '-' + 'save'"
                >提 交</el-button>
                <el-button size="medium" @click="cancel" :id="$route.name + '-' + 'cancel'">取 消</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </panel>
  </div>
</template>

 <script type="text/javascript">
export default {
  name: "roleManageAdd",
  data() {
    return {
      rules: {
        roleName: [
          {
            required: true,
            validator: this.$rules.checkName,
            title: "用户角色",
            trigger: ["change", "blur"]
          }
        ],
        shiftList: [
          {
            required: true,
            message: "请至少选择一个角色权限",
            trigger: ["change", "blur"]
          }
        ],
        appMenuRole: [
          {
            required: true,
            message: "请至少选择一个APP权限",
            trigger: ["change", "blur"]
          }
        ]
      },
      ruleForm: {
        roleName: null,
        isManager: "2",
        shiftList: [],
        appMenuRole: [],
        remark: null
      },
      menuData: [],
      appMenuData: []
    };
  },
  watch: {
    checkedNodes(list) {
      this.$nextTick(() => {
        if (list.length) {
          list.forEach(item => {
            this.$set(item, "checked", true);
            if (!item.checked) {
              this.$set(item, "isShift", "0");
            }
          });
        }
      });
      this.ruleForm.shiftList = this.$refs.tree.getCheckedKeys();
    }
  },
  created() {
    //柜员机权限
    this.getChannelLimit();
    //app权限
    this.findAppMenu();
  },
  mounted() {
    this.ruleForm.shiftList = this.$refs.tree.getCheckedKeys();
    this.checkedNodes = this.$refs.tree.getCheckedNodes();
  },

  methods: {
    //柜员机权限数据
    async getChannelLimit() {
      let res = await this.$api.channelLimit();
      console.log(res);
      if (res && res.code === 0) {
        this.menuData = res.data || [];
      }
    },
    //维护app权限数据
    async findAppMenu() {
      let res = await this.$api.findAppMenu();
      if (res && res.code === 0) {
        this.appMenuData = res.data.map(item => {
          return { value: item.menuName, label: item.id };
        });
      }
    },
    checkChange(node, val) {
      const checkedKeys = (this.ruleForm.shiftList = this.$refs.tree.getCheckedKeys());
      const self = this;
      this.$nextTick(() => {
        (function filter(treeData) {
          if (treeData && Array.isArray(treeData)) {
            treeData.forEach((item, i) => {
              if (checkedKeys.findIndex(id => item.id == id) < 0) {
                self.$set(item, "checked", false);
                self.$set(item, "isShift", 0);
              } else {
                self.$set(item, "checked", true);
              }
              filter(item.childModules);
            });
          }
        })(this.menuData);
      });
    },
    handleCheck(data, val) {
      this.$refs.tree.store.nodesMap[data.id].expanded = true;
    },

    //表单提交
    submit() {
      this.$refs.formName.validate(async valid => {
        if (valid) {
          this.ruleForm.shiftList = this.$refs.tree
            .getCheckedNodes()
            .map(item => {
              if (item.isShift === 1 || item.isShift === 0) {
                return {
                  id: item.id,
                  isShift: Number(item.isShift) || 0
                };
              }
            });

          let info = JSON.parse(JSON.stringify(this.ruleForm));
          info.appMenuRole = this.ruleForm.appMenuRole.join(",");
          // console.log(info);
          let resul = await this.$api.roleAdd({
            message: "提交成功",
            data: { ...info }
          });
          if (resul && resul.code === 0) {
            this.$router.push("roleManage");
          }
        }
      });
    },

    //表单取消
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/index";
</style>
