<template>
  <div class="vlt-card">
    <div class="search">
      <search-Bar :options="searchOptions" :total="total" @search="search" labelWidth="6em">
        <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions"></control-bar>
      </search-Bar>
    </div>
    <div class="el_table">
      <el-table :data="tableData" border>
        <el-table-column label="序号" width="80" fixed>
          <template slot-scope="scope">
            <p>{{params.pageSize * (params.page - 1) + scope.$index + 1}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="流程名称" min-width="120px"></el-table-column>
        <el-table-column prop="categoryName" label="所属类别" min-width="120px"></el-table-column>
        <el-table-column prop="diagramName" label="图表名称" min-width="120px"></el-table-column>
        <el-table-column label="流程状态" min-width="120px">
          <template slot-scope="scope">
            <table-row-status
              :scope="scope"
              idField="id"
              statusField="status"
              :rowName="scope.row.name"
              :option="{
                enable: {
                  label: '启用',
                  apiName: 'setProcessStatus',
                  value: '1',
                  permission:'processSet-enable'
                },
                disable: {
                  label: '冻结',
                  apiName: 'setProcessStatus',
                  value: '0',
                  permission:'processSet-disable'
                }
              }"
            ></table-row-status>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="150px"></el-table-column>
        <!-- <el-table-column prop="updateTime" label="更新时间" min-width="150px"></el-table-column> -->
        
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              v-has="'processSet-view'"
              size="mini"
              @click="detail(scope.row.id, 1)"
            >查看</el-button>
            <el-button
              v-has="'processSet-edit'"
              type=""
              size="mini"
              @click="detail(scope.row.id)"
              :disabled="scope.row.status == 1"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        style="margin-top: 10px;"
        position="right"
        :total="total"
        :currentPage="params.page"
        :pageSize="params.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "processSet",
  data() {
    return {
      searchOptions: [
        {
          title: "流程名称",
          prop: "name",
          type: "input",
          value: ""
        },
        {
          title: "所属类别",
          prop: "categoryId",
          type: "cascader",
          options: [],
          value: "",
          setProps: {
            checkStrictly: true,
            value: "id",
            label: "name"
          }
        }
      ],
      controlOptions: [
        //按钮组
        {
          name: "新建流程",
          type: "primary",
          icon: "plus",
          permission: "processSet-add"
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
      currentRowItem: null
    };
  },
  components: {},
  created() {
    this.getTreeData();
    this.getList();
  },
  mounted() {
    // 流程已更新时，关闭前标签页
    const fromRouteName = this.$route.params.fromRouteName;
    if (fromRouteName) {
      this.eventBus.$emit("closeTag", fromRouteName);
    }
  },
  methods: {
    // 获取表单配置项
    getFormOption(formOptions, propName) {
      return formOptions.find(item => item.prop === propName);
    },
    // 搜索
    search(form) {
      this.searchParams = { ...form };
      if ("categoryId" in form && form.categoryId.length) {
        this.searchParams.categoryId =
          form.categoryId[form.categoryId.length - 1];
      }
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
    // 获取所属类别
    async getTreeData() {
      const res = await this.$api.getProcessTree();
      if (res && res.data) {
        this.getFormOption(this.searchOptions, "categoryId").options = res.data;
      }
    },
    // 获取列表
    async getList() {
      const res = await this.$api.getProcessList({
        data: {
          ...this.params,
          param: this.searchParams
        }
      });
      if (res && res.code === 0) {
        this.tableData = res.data.records || [];
        this.tableData.forEach(item => {
          if (item.createTime) {
            item.createTime = this.$moment(item.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          if (item.updateTime) {
            item.updateTime = this.$moment(item.updateTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
        });
        this.total = res.data.total;
      }
    },
    selectBtn(option) {
      if (option.name === "新建流程") {
        this.eventBus.$emit("removeKeepAlive", "editProcess");
        this.$nextTick(() => {
          this.$router.push({
            name: "addProcess"
          });
        });
      }
    },
    detail(id, view) {
      this.eventBus.$emit("removeKeepAlive", "editProcess");
      const query = {
        id
      }
      // 查看
      if (view) {
        query.view = view;
      }
      this.$nextTick(() => {
        this.$router.push({
          name: "editProcess",
          query
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
