<template>
  <div class="vlt-card">
    <div class="search">
      <search-Bar :options="option" :total="total" @search="search" labelWidth="6em">
        <control-bar slot="extend-bar" @select="btnSelect" :options="controlOptions" position="left"></control-bar>
      </search-Bar>
    </div>
    <div class="el_table">
      <el-table :data="tableData" border>
        <el-table-column label="序号" width="80" fixed>
          <template slot-scope="scope">
            <p>{{params.pageSize * (params.page - 1) + scope.$index + 1}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="业务名称" min-width="150"></el-table-column>
        <el-table-column prop="router" label="业务路由" min-width="150"></el-table-column>
        <el-table-column prop="businessTable" label="业务数据表" min-width="170"></el-table-column>
        <el-table-column prop="conditionAttr" label="条件属性" min-width="170"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="150"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="150"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-has="'businessConf-edit'"
              type="primary"
              size="mini"
              @click="edit(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        position="right"
        :total="total"
        :currentPage="params.page"
        :pageSize="params.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="35%">
      <base-form
        :formData="form"
        labelWidth="8em"
        :rules="rules"
        ref="baseForm"
        direction="right"
      ></base-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "businessConf",
  data() {
    return {
      option: [
        {
          title: "业务名称",
          prop: "name",
          type: "input",
          value: ""
        }
      ],
      controlOptions: [
        //按钮组
        {
          name: "新建配置",
          type: "primary",
          icon: "plus",
          permission: "businessConf-add"
        } // type为按钮的五种颜色， icon为具体的图标
      ],
      tableData: [],
      dialogTitle: "新建配置",
      dialogVisible: false,
      total: 0,
      params: {
        page: 1,
        pageSize: 20
      },
      searchParams: {},
      currentRowItem: null,
      form: [
        {
          type: "input",
          title: "业务名称",
          prop: "name",
          maxlength: 15,
        },
        {
          type: "input",
          title: "业务路由",
          prop: "router",
          maxlength: 30,
        },
        {
          type: "input",
          title: "业务数据表",
          prop: "businessTable",
          maxlength: 30,
        },
        {
          type: "textarea",
          title: "条件属性",
          prop: "conditionAttr",
          maxlength: 300,
        }
      ],
      rules: {
        name: [
          {
            required: true,
            validator: this.$rules.checkName, 
            title: "业务名称",
            // message: "请输入业务名称",
            trigger: ['change','blur']
          }
        ],
        router: [
          {
            required: true,
            validator: this.$rules.checkName, 
            title: "业务路由",
            // message: "请输入业务路由",
            trigger: ['change','blur']
          }
        ],
        businessTable: [
          {
            required: true,
            validator: this.$rules.checkName, 
            title: "业务表名",
            // message: "请输入业务表名",
            trigger: ['change','blur']
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 搜索
    search(form) {
      this.searchParams = form;
      this.params.page = 1;
      this.getList();
    },
    // 分页
    handleSizeChange(size) {
      this.params.pageSize = size;
      this.getList();
    },
    handleCurrentChange(currentPage) {
      this.params.page = currentPage;
      this.getList();
    },
    // 获取列表
    async getList() {
      const res = await this.$api.getBusinessList({
        data: {
          ...this.params,
          param: this.searchParams
        }
      });
      if (res && res.code === 0) {
        this.tableData = res.data.records || [];
        this.tableData.forEach(item => {
          if (item.createTime) {
            item.createTime = moment(item.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          if (item.updateTime) {
            item.updateTime = moment(item.updateTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
        });
        this.total = res.data.total;
      }
    },

    btnSelect(option) {
      // 新增
      if (option.name === "新建配置") {
        this.dialogVisible = true;
        this.dialogTitle = "新建配置";
        this.currentRowItem = null;
        this.clearForm();
      }
    },
    clearForm() {
      if (this.$refs.baseForm) {
        this.$refs.baseForm.resetForm();
      }
      this.form.forEach(option => {
        this.$set(option, "value", "");
      });
    },
    // 编辑
    edit(item) {
      this.dialogTitle = "配置信息";
      this.dialogVisible = true;
      this.currentRowItem = item;
      this.clearForm();
      this.form.forEach(option => {
        this.$set(option, "value", item[option.prop]);
      });
    },
    // 提交
    submit() {
      this.$refs.baseForm.validate(async val => {
        if (val === "true") {
          const data = {
            ...this.$refs.baseForm.form
          };
          let apiName = "addBusinessConf";
          let message = "新增成功";
          if (this.currentRowItem) {
            data.id = this.currentRowItem.id;
            apiName = "editBusinessConf";
            message = "编辑成功";
          }
          const res = await this.$api[apiName]({
            message,
            data
          });
          if (res && res.code === 0) {
            this.dialogVisible = false;
            if (!this.currentRowItem) {
              this.getList();
            } else {
              Object.assign(this.currentRowItem, data);
            }
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
  /deep/.el-dialog__body{
    padding-bottom: 0;
  }
</style>
