<template>
  <div class="vlt-card menu-container">
    <el-container>
      <el-aside class="tree-list" style="padding:20px;width:380px">
        <div class="menu-btn">
          <!--顶部按钮-->
          <control-bar :options="controlOptions" @select="operation"></control-bar>
        </div>
        <div class="menu-ipt">
          <div class="menu-tree">
            <!--树形结构-->
            <el-tree
              ref="tree"
              :data="menuData"
              show-checkbox
              node-key="id"
              @check-change="checkChange"
              :default-expanded-keys="expandedKeys"
              :expand-on-click-node="true"
              :props="{
                children: 'children',
                value: 'id',
                label: 'text'
              }"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span @click.stop="edit(node, data)">{{ node.label }}</span>
                <span>
                  <el-button
                    type="text"
                    size="mini"
                    v-has="'Menu-edit'"
                    :id="$route.name+'-tree-edit'+data.id"
                    @click.stop="edit(node, data)"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    v-has="'Menu-add'"
                    :id="$route.name+'-tree-create'+data.id"
                    v-if="data.type != 4"
                    @click.stop="add(node, data)"
                  >新增</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    :id="$route.name+'-tree-delect'+data.id"
                    v-has="'Menu-delect'"
                    @click.stop="remove(node, data)"
                  >删除</el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-aside>
      <el-main style="border-left:1px solid #DCDFE6;">
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <el-form :model="form" :rules="rules" ref="form" label-width="110px" size="medium">
              <el-form-item label="类型" prop="moduleType">
                <el-select v-model="form.moduleType" placeholder="请选择" :disabled="isEdit">
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="(item, index) in typeOptions"
                    :key="index"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="名称" prop="moduleName">
                <el-input
                  v-model="form.moduleName"
                  show-word-limit
                  :maxlength="15"
                  placeholder="请输入名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="根节点编码" prop="moduleCode" v-if="form.moduleType == 1">
                <el-input
                  v-model="form.moduleCode"
                  show-word-limit
                  :maxlength="30"
                  :disabled="isEdit || false"
                  placeholder="请输入根节点编码"
                ></el-input>
              </el-form-item>
              <el-form-item label="子系统编码" prop="sysCode" v-if="form.moduleType == 2">
                <el-input
                  v-model="form.sysCode"
                  show-word-limit
                  :maxlength="30"
                  :disabled="isEdit || false"
                  placeholder="请输入子系统编码"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="路由编码"
                prop="moduleCode"
                v-if="form.moduleType != 4 && form.moduleType != 1"
              >
                <el-input
                  v-model="form.moduleCode"
                  show-word-limit
                  :maxlength="30"
                  :disabled="isEdit || false"
                  placeholder="请输入路由编码"
                ></el-input>
              </el-form-item>
              <el-form-item label="按钮编码" prop="moduleCode" v-if="form.moduleType == 4">
                <el-input
                  v-model="form.moduleCode"
                  show-word-limit
                  :maxlength="30"
                  :disabled="isEdit || false"
                  placeholder="请输入按钮编码"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="图标CSS类名"
                prop="moduleIcon"
                v-if="form.moduleType != 4 && form.moduleType != 1"
              >
                <el-input v-model="form.moduleIcon" show-word-limit placeholder="请输入图标CSS类名" :maxlength="40"></el-input>
              </el-form-item>
              <el-form-item
                label="排序值"
                prop="sort"
                v-if="form.moduleType != 4 && form.moduleType != 1"
              >
                <el-input v-model="form.sort" maxlength="3" placeholder="请输入排序值" show-word-limit></el-input>
              </el-form-item>
              <!-- <el-form-item label="是否敏感操作" prop="isSensitivity" v-if="form.moduleType != 1">
                <el-switch
                  v-model="form.isSensitivity"
                  :active-text="form.isSensitivity ? '开启' : '关闭'"
                  :inactive-value="0"
                  :active-value="1"
                ></el-switch>
              </el-form-item>-->
              <el-form-item label="是否启用" prop="isShow">
                <el-switch
                  v-model="form.isShow"
                  :active-text="form.isShow ? '开启' : '关闭'"
                  :inactive-value="0"
                  :active-value="1"
                ></el-switch>
              </el-form-item>
              <el-form-item label="描述" prop="moduleDesc">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 5}"
                  :maxlength="100"
                  v-model="form.moduleDesc"
                  placeholder="请输入描述"
                ></el-input>
              </el-form-item>
            </el-form>
            <el-row class="vlt-edit-btn">
              <el-button
                type="primary"
                v-prevent="1000"
                size="small"
                @click="submit"
                :id="$route.name+'-menuCreate-submit'"
                v-has="'Menu-submit'"
              >提 交</el-button>
              <el-button
                size="small"
                @click="cancel"
                v-has="'Menu-cencel'"
                :id="$route.name+'-menuCreate-cencel'"
              >取 消</el-button>
            </el-row>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "menuManageMent",
  data() {
    return {
      isEdit: false,
      menuData: [],
      expandedKeys: [],
      controlOptions: [
        //顶部按钮
        {
          name: "添加根节点",
          type: "primary",
          icon: "",
          id: 1,
          permission: "Menu-addRootNode"
        },
        {
          name: "批量删除",
          type: "",
          icon: "",
          id: -1,
          permission: "Menu-batchDelect"
        }
      ],
      form: {
        moduleType: "",
        sysCode: "",
        moduleName: "",
        moduleCode: "",
        isShow: 1,
        sort: "",
        moduleIcon: "",
        // isSensitivity: 0,
        moduleDesc: ""
      },
      typeOptions: [
        {
          value: 1,
          label: "根节点"
        },
        {
          value: 2,
          label: "子系统"
        },
        {
          value: 3,
          label: "菜单"
        },
        {
          value: 4,
          label: "按钮"
        }
      ],
      rules: {
        moduleType: [
          {
            required: true,
            message: "请选择菜单类型",
            trigger: ["change", "blur"]
          }
        ],
        moduleName: [
          {
            required: true,
            validator: this.$rules.checkName,
            title: "名称",
            trigger: ["change", "blur"]
          }
        ],
        sysCode: [
          {
            required: true,
            validator: this.$rules.checkCode,
            title: "子系统编码",
            trigger: ["change", "blur"]
          }
        ],
        moduleCode: [
          {
            required: true,
            validator: this.$rules.checkCode,
            title: "路由编码",
            trigger: ["change", "blur"]
          }
        ],
        sort: [
          {
            required: true,
            validator: this.$rules.checkPositive,
            title: "排序值",
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },
  watch: {
    menuData(menuData) {
      this.setCtrlBtnStatus();
      if (!menuData.length) {
        this.form.moduleType = 1;
        this.isEdit = false;
      }
    },
    "form.moduleType"(val) {
      // 设置菜单类型选择项
      const options = this.typeOptions;
      options.forEach(item => {
        this.$set(item, "disabled", false);
      });
      switch (val) {
        case 1:
          this.$set(options[1], "disabled", true);
          this.$set(options[2], "disabled", true);
          this.$set(options[3], "disabled", true);
          break;
        case 2:
          this.$set(options[0], "disabled", true);
          this.$set(options[2], "disabled", true);
          this.$set(options[3], "disabled", true);
          break;
        case 3:
        case 4:
          this.$set(options[0], "disabled", true);
          this.$set(options[1], "disabled", true);
          break;
      }
    }
  },
  created() {
    (async () => {
      await this.getMenuList();
      if (!this.menuData.length) {
        this.form.moduleType = 1;
        return;
      }
      this.currentMenu = this.menuData[0];
      this.form.moduleType = 2;
      // 设置默认展开
      this.expandedKeys = [this.menuData[0].id];
      if (this.currentMenu.children && this.currentMenu.children.length) {
        this.expandedKeys.push(this.currentMenu.children[0].id);
      }
    })();
  },
  methods: {
    ...mapActions(["getMenuData"]),
    async getMenuList() {
      let res = await this.$api.QueryModuleTree();
      if (res && res.code === 0) {
        this.menuData = res.data || [];
        this.setCtrlBtnStatus();
      }
    },
    // 获取菜单详情
    async getMenuDetail(id) {
      const res = await this.$api.QueryModuleDetail({
        data: id
      });
      if (res && res.code == 0) {
        this.menuDetail = res.data || null;
        Object.keys(this.form).forEach(prop => {
          this.form[prop] = this.menuDetail[prop];
        });
      }
    },

    // 设置头部按钮状态
    setCtrlBtnStatus() {
      if (this.$refs.tree.getCheckedKeys().length) {
        this.$set(this.controlOptions[1], "disabled", false);
      } else {
        this.$set(this.controlOptions[1], "disabled", true);
      }
      if (this.menuData.length) {
        this.$set(this.controlOptions[0], "disabled", true);
      } else {
        this.$refs.tree.getCheckedKeys().length = 0;
        this.$set(this.controlOptions[0], "disabled", false);
      }
    },
    submit() {
      const self = this;
      self.$refs.form.validate(async val => {
        if (val) {
          const data = {
            ...self.form
          };
          if (
            self.currentMenu &&
            (self.form.moduleType === 3 || self.form.moduleType === 4)
          ) {
            data.sysCode = self.currentMenu.extendAttach;
          }
          let apiName = "SaveModule";
          let message = "新增成功";
          if (self.isEdit) {
            data.moduleId = self.currentMenu.id;
            apiName = "UpdateModule";
            message = "编辑成功";
          }
          if (self.form.moduleType !== 1) {
            if (self.isEdit) {
              data.parentId = self.currentMenu.parentId;
            } else {
              data.parentId = self.currentMenu.id;
            }
          }
          const res = await self.$api[apiName]({
            message,
            data
          });
          if (res && res.code == 0) {
            // 更新vuex的菜单数据
            let param = { type: 0 };
            self.getMenuData(param);
            // 无请求更新tree
            // 新增/编辑根节点
            if (self.form.moduleType === 1) {
              if (self.isEdit) {
                self.$set(self.menuData[0], "text", data.moduleName);
              } else {
                self.menuData = [res.data];
              }
              return;
            }
            // 新增/编辑子系统、菜单、按钮
            if (self.isEdit) {
              self.$set(self.currentMenu, "text", data.moduleName);
            } else {
              self.$refs.tree.append(res.data, data.parentId);
            }
            return;
          }
        }
      });
    },
    cancel() {
      if (this.currentMenu && this.isEdit && this.menuDetail) {
        Object.keys(this.form).forEach(prop => {
          this.form[prop] = this.menuDetail[prop];
        });
        return;
      }
      this.clearForm();
    },
    checkChange() {
      this.setCtrlBtnStatus();
    },
    // 清空表单数据
    clearForm() {
      Object.keys(this.form).forEach(prop => {
        this.form[prop] = "";
        if (prop === "isShow") {
          this.form[prop] = 1;
        }
        if (prop === "moduleType") {
          this.form[prop] = (this.currentMenu && this.currentMenu.type) || 1;
          if (!this.isEdit) {
            this.form[prop] = this.form[prop] + 1;
          }
        }
      });
    },
    // 新增
    async add(node, data) {
      this.isEdit = false;
      this.currentMenu = data;
      this.clearForm();
      this.form.moduleType = data.type;
      switch (data.type) {
        case 1:
        case 2:
          this.form.moduleType = data.type + 1;
          break;
      }
    },
    // 编辑
    async edit(node, data) {
      this.$refs.form.resetFields();
      this.getMenuDetail(data.id);
      this.isEdit = true;
      this.currentMenu = data;
      this.form.moduleType = data.type;
    },
    // 移除
    remove(node, data, msg) {
      this.$confirm(msg || "此操作将删除该节点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let moduleIdList, nodes;
          if (data) {
            moduleIdList = [data.id];
            nodes = [node];
            // 获取子节点id
            (function find(_data) {
              const children = _data.children || [];
              if (children.length) {
                children.forEach((item, i) => {
                  moduleIdList.push(children[i].id);
                  find(children[i]);
                });
              } else {
                return false;
              }
            })(data);
          } else {
            moduleIdList = this.$refs.tree.getCheckedKeys();
            nodes = this.$refs.tree.getCheckedNodes();
          }
          let res = await this.$api.DeleteModule({
            message: "删除成功",
            data: {
              moduleIdList
            }
          });
          if (res && res.code == 0) {
            nodes.forEach(item => {
              this.$refs.tree.remove(item);
            });
          }
        })
        .catch(() => {
          console.log("已取消删除");
        });
    },
    // 操作
    operation(val) {
      if (val.id === -1) {
        this.remove(null, null, "此操作将删除所选节点, 是否继续?");
        return;
      }
      this.form.moduleType = val.id;
      this.isEdit = false;
    }
  }
};
</script>

<style lang="less">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.menu-container {
  .vlt-edit-wrap {
    padding: 0;
  }
  .menu-btn {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    margin-bottom: 15px;
  }
  .vlt-edit-btn {
    padding-left: 20px;
  }
}
</style>