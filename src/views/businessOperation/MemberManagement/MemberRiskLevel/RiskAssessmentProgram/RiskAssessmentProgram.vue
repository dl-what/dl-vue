<template>
  <div class="vlt-card">
    <section class="comp-item">
      <search-bar
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="total"
        labelWidth="6em"
      >
        <control-bar
          slot="extend-bar"
          @select="selectBtn"
          :options="controlOptions"
          position="left"
        ></control-bar>
      </search-bar>
    </section>
    <el-table
      ref="tabel"
      :data="tableData"
      tooltip-effect="dark"
      @selection-change="selectionChange"
      border
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="60" fixed>
        <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="programCode" label="方案编号" min-width="120px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="programName" label="方案名称" min-width="160px"></el-table-column>
      <el-table-column prop="effectiveTime" label="生效时间" min-width="160"></el-table-column>
      <el-table-column prop="programStatus" label="状态" min-width="200">
        <template slot-scope="scope">
          <table-row-status
            statusField="programStatus"
            idField="programId"
            :scope="scope"
            :tableData="tableData"
            :rowName="scope.row.name"
            @change="changeRest"
            :option="{
                'enable': {
                  apiName: 'memberRiskLevelProgramStatusUpdate', // 接口名称
                  label: '启用', // 按钮文字
                  value: 1,// 接口字段传值
                  permission:'RiskAssessmentProgram-enable'
                },
                'disable': {
                  apiName: 'memberRiskLevelProgramStatusUpdate',
                  label: '冻结',
                  value: 0,
                  permission:'RiskAssessmentProgram-disable'
                },
                'logout': {
                  apiName: 'memberRiskLevelProgramStatusUpdate',
                  label: '注销',
                  value: 2,
                  permission:'RiskAssessmentProgram-logout'
                }
              }"
          ></table-row-status>
        </template>
      </el-table-column>
      <el-table-column prop="createName" label="创建人" min-width="120px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
      <el-table-column prop="handles" label="操作" fixed="right" min-width="120">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="lookDetails(scope.row)"
            :id="$route.name+'-detais-'+scope.$index"
            v-has="'RiskAssessmentProgram-detaisl'"
          >查看</el-button>
          <el-button
            type=""
            size="mini"
            @click="handlerChange(scope.row)"
            :id="$route.name+'-edit-'+scope.$index"
            :disabled="scope.row.programStatus == 0 ? false : true"
            v-has="'RiskAssessmentProgram-edit'"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <section class="comp-item">
      <table-paging
        :total="total"
        :currentPage="page"
        :pageSize="pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
    </section>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      searchOptions: [
        { title: "方案编号", type: "input", prop: "programCode", value: "" },
        {
          type: "select",
          prop: "programStatus",
          value: "",
          title: "方案状态",
          options: [
            { label: "启用", value: 1 },
            { label: "冻结", value: 0 }
            // { label: "注销", value: 2 }
          ],
          placeholder: "请输入"
        },
        { title: "创建人", type: "input", prop: "createName", value: "" }
      ],
      controlOptions: [
        {
          name: "新建方案",
          type: "primary",
          icon: "plus",
          permission: "RiskAssessmentProgram-create"
        }
      ],
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      current: 1,
      searchForm: {}
    };
  },
  components: {},
  watch: {
    "scope.row": {
      handler() {
        console.log("123");
      },
      deep: true
    }
  },
  created() {
    this.init();
  },
  methods: {
    init(val) {
      const self = this;
      (async val => {
        let data = {
          page: val || 1,
          pageSize: this.pageSize,
          param: {
            ...this.searchForm
          }
        };
        let res = await self.$api.memberRiskLevelProgramPage({ data });
        console.log(res, "评估方案分页");
        if (res && res.code === 0) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.page = res.data.current;
        }
      })(val);
    },
    changeRest() {
      this.init();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    handleCurrentChange(page) {
      this.current = page;
      this.init(page);
    },
    selectBtn(val) {
      switch (val.name) {
        case "新建方案":
          this.$router.push({
            name: "evaluationProgramAdded",
            query: { status: 1 }
          });
          break;

        default:
          break;
      }
    },
    search(val) {
      this.searchForm = val;
      this.init();
    },
    handlerChange(row) {
      this.$router.push({
        name: "evaluationProgramEdit",
        query: { status: 2, id: row.programId }
      });
    },
    lookDetails(row) {
      console.log(row);
      this.$router.push({
        name: "evaluationProgramDetails",
        query: { status: 0, id: row.programId }
      });
    },
    selectionChange() {}
  }
};
</script>

<style lang="less" scoped>
</style>
