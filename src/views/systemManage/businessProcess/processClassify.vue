<template>
  <div class="process-classify-container">
    <div class="tree-content">
      <h6 class="heading">
        流程类别
        <el-button
          v-has="'processClassify-add'"
          class="add-btn"
          type="primary"
          size="mini"
          @click="addSupClass"
        >新增一级类别</el-button>
      </h6>
      <el-tree
        class="el-tree"
        ref="tree"
        :data="treeData"
        node-key="id"
        :default-expanded-keys="expandedKeys"
        :expand-on-click-node="true"
        :props="{
          children: 'children',
          value: 'id',
          label: 'name'
        }"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              v-has="'processClassify-edit'"
              type="text"
              size="mini"
              @click.stop="edit(node, data)"
            >编辑</el-button>
            <el-button
              v-has="'processClassify-add'"
              type="text"
              size="mini"
              :disabled="node.level >= 5"
              @click.stop="add(node, data)"
            >新增</el-button>
            <el-button
              v-has="'processClassify-delete'"
              type="text"
              size="mini"
              @click.stop="remove(node, data)"
            >删除</el-button>
          </span>
        </span>
        <div class="no-data" v-if="isNoData">暂无数据</div>
      </el-tree>
    </div>
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="600px">
      <base-form
        :formData="form"
        labelWidth="90px"
        :rules="rules"
        ref="baseForm"
        direction="right"
        @change="changeForm"
      ></base-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent="1000" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "processClassify",
  data() {
    return {
      dialogFormVisible: false,
      isNoData: false,
      isEdit: false,
      expandedKeys: [],
      treeData: [],
      currentNodeData: {
        id: 0
      },
      formTitle: "新增一级类别",
      form: [
        {
          title: "上级类别",
          type: "input",
          prop: "parentName",
          value: "",
          disabled: true,
          destroy: true
        },
        { title: "类别名称", type: "input", prop: "name", value: "", maxlength: 15},
        { title: "备注", type: "textarea", prop: "remark", value: "" , maxlength: 100}
      ],
      rules: {
        name: [
          {
            required: true,
            validator: this.$rules.checkName, 
            title: "流程类别名称",
            // message: "请输入流程类别名称",
            trigger: ['change','blur']
          }
        ]
      }
    };
  },
  watch: {
    treeData(data) {
      if (!data.length) {
        this.isEdit = false;
        this.isNoData = true;
        return;
      }
      this.isNoData = false;
    },
    isEdit(val) {
      if (val) {
        this.formTitle = "编辑类别";
      }
    }
  },
  created() {
    this.getTreeData();
    this.parentNameOption = this.getFormOption("parentName");
  },
  mounted() {},
  methods: {
    // 获取treeData
    async getTreeData() {
      const res = await this.$api.getProcessTree();
      if (res && res.data) {
        this.treeData = res.data;
      }
    },
    // 获取节点/类别详情
    async getTreeDetail(id) {
      const res = await this.$api.getProcessTreeDetail({
        data: id
      });
      if (res && res.data) {
        this.form.forEach(item => {
          this.$set(item, "value", res.data[item.prop]);
          if (res.data.parentName) {
            this.parentNameOption.destroy = false;
          }
        });
      }
    },
    // 新增一级类别
    addSupClass() {
      this.dialogFormVisible = true;
      this.isEdit = false;
      this.clearForm();
      this.formTitle = "新增一级类别";
      this.parentNameOption.destroy = true;
      this.currentNodeData = {
        id: 0
      };
    },
    // 新增
    async add(node, data) {
      this.formTitle = "新增子类别";
      this.dialogFormVisible = true;
      if (data.id) {
        this.parentNameOption.destroy = false;
        this.$nextTick(() => {
          this.parentNameOption.value = data.name;
        });
      } else {
        this.parentNameOption.destroy = true;
      }
      this.isEdit = false;
      this.currentNodeData = data;
      this.clearForm();
    },
    // 编辑
    async edit(node, data) {
      this.dialogFormVisible = true;
      this.parentNameOption.destroy = true;
      this.getTreeDetail(data.id);
      this.isEdit = true;
      this.currentNodeData = data;
    },
    // 删除
    remove(node, data) {
      this.$confirm(`确认删除类别: ${data.name} ?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const nodes = [node];
          let res = await this.$api.deleteProcessClass({
            message: "删除成功",
            data: data.id
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
    // 确定
    submit() {
      this.$refs.baseForm.validate(async val => {
        if (val === "true") {
          this.dialogFormVisible = false;
          const data = {
            ...this.$refs.baseForm.form,
            parentId: this.currentNodeData.id
          };
          let apiName = "addProcessClass";
          let message = "新增成功";
          if (this.isEdit) {
            delete data.parentId;
            data.id = this.currentNodeData.id;
            apiName = "editProcessClass";
            message = "编辑成功";
          } else {
            delete data.parentName;
          }
          const res = await this.$api[apiName]({
            message,
            data
          });
          if (res && res.code == 0) {
            // 新增/编辑
            if (this.isEdit) {
              this.$set(this.currentNodeData, "name", data.name);
            } else {
              this.$refs.tree.append(res.data, data.parentId);
            }
          }
        }
      });
      
    },
    // 重置
    reset() {
      this.$refs.baseForm.resetForm();
    },
    // 清空表单数据
    clearForm() {
      this.form.forEach(item => {
        item.value = "";
      });
      this.$refs.baseForm && this.$refs.baseForm.resetForm();
    },
    // 获取表单配置项
    getFormOption(propName) {
      return this.form.find(item => item.prop === propName);
    },
    changeForm(form) {
      // console.log(form)
    }
  }
};
</script>

<style lang="less" scoped>
.process-classify-container {
  overflow: hidden;
  padding: 25px;
  .tree-content {
    .heading {
      font-size: 14px;
      line-height: 50px;
      border-bottom: 1px solid #e8eaec;
      margin-bottom: 10px;
    }
    .el-tree {
      width: 400px;
    }
  }
  .no-data {
    padding: 30px;
    color: #999;
    text-align: center;
  }
  /deep/.vlt-edit-single .el-form-item__content,
  .vlt-edit-single .el-cascader {
    width: 50%;
  }
  .add-btn {
    margin-top: 10px;
    margin-left: 225px;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
