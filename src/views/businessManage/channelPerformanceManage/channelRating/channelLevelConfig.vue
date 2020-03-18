<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    >
      <el-button
        :id="$route.name + '-' + 'add' "
        slot="extend-bar"
        v-has="'channelLevelConfig-add'"
        type="primary"
        size="small"
        @click="addLevelConfig"
      >
        <i class="el-icon-plus">新增等级</i>
      </el-button>
    </search-bar>

    <el-table :data="tableData" border style="margin-top: 10px;">
      <el-table-column type="index" width="60px" fixed label="序号">
        <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="chLevelName" label="等级名称" min-width="120px"></el-table-column>
      <el-table-column prop="chGradeScore" label="等级分值" min-width="120px"></el-table-column>
      <el-table-column prop="chGradeStatus" label="状态" min-width="100px">
        <template slot-scope="scope">
          <el-switch
            :id="$route.name + '-' + 'switch' + scope.$index"
            v-has="'channelLevelConfig-switch'"
            v-model="scope.row.chGradeStatus"
            :active-text="scope.row.chGradeStatus?'启用':'停用'"
            :inactive-value="0"
            :active-value="1"
            @change="changeState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="workTime" label="生效日期" min-width="120px"></el-table-column>
      <el-table-column prop="chGradeDesc" label="等级描述" min-width="220px" show-overflow-tooltip></el-table-column>

      <el-table-column label="操作" align="center" fixed="right" min-width="160">
        <template slot-scope="scope">
          <el-button
            :id="$route.name + '-' + 'detail' + scope.$index"
            type="primary"
            size="mini"
            v-has="'channelLevelConfig-detail'"
            @click="detail(scope.row.chGradeId)"
          >查看</el-button>
          <el-button
            :id="$route.name + '-' + 'edit' + scope.$index"
            :disabled="scope.row.chGradeStatus?true:false"
            type
            size="mini"
            v-has="'channelLevelConfig-edit'"
            @click="updata(scope.row.chGradeId)"
          >编辑</el-button>
          <el-button
            :id="$route.name + '-' + 'delete' + scope.$index"
            :disabled="scope.row.chGradeStatus?true:false"
            type="danger"
            size="mini"
            v-has="'channelLevelConfig-remove'"
            @click="remove(scope.row.chGradeId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "channelLevelConfig",
  data() {
    return {
      total: 0,
      page: 1,
      pageSize: 20,
      param: {},
      searchOptions: [
        { title: "等级名称", type: "input", prop: "chLevelName", value: "" },
        {
          title: "等级分值",
          type: "minMax",
          prop: "minMax",
          value: "",
          options: ["chGradeScoreS", "chGradeScoreE"]
        },
        {
          title: "生效日期",
          type: "datepicker-range",
          prop: "workTime",
          value: []
        },
        {
          title: "等级状态",
          type: "select",
          prop: "chGradeStatus",
          value: "",
          options: [{ label: "启用", value: 1 }, { label: "停用", value: 0 }]
        }
      ],
      param: null,
      tableData: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init(val) {
      let res = await this.$api.channelGradeInfoList({
        data: {
          page: val || 1,
          pageSize: this.pageSize,
          param: {
            ...this.param
          }
        }
      });
      if (res && res.code === 0) {
        console.log(res.data);
        this.page = res.data.pages;
        this.total = res.data.total;
        this.tableData = res.data.records;
      }
    },
    search(val) {
      this.param = { ...val };
      if (val.workTime && val.workTime.length) {
        this.param.workTimeStart = this.$moment(val.workTime[0]).format(
          "YYYY-MM-DD"
        );
        this.param.workTimeEnd = this.$moment(val.workTime[1]).format(
          "YYYY-MM-DD"
        );
      }

      delete this.param.workTime;

      this.init();
    },
    addLevelConfig() {
      this.$router.push({ path: "addLevelConfig" });
    },
    detail(id) {
      this.$router.push({ path: "levelConfigDetail", query: { id: id } });
    },
    updata(id) {
      this.$router.push({ path: "levelConfigEdit", query: { id: id } });
    },
    remove(id) {
      this.$confirm("请确认是否删除该等级配置?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$api.deleteChannelGradeInfo({
            message: "删除成功",
            data: id
          });
          if (res && res.code === 0) {
            this.init();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    changeState(row) {
      let msg = row.chGradeStatus == 1 ? "启用" : "停用";
      this.$confirm("请确认是否" + msg + "该等级配置?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$api.updateChannelGradeInfo({
            message: "已" + msg,
            data: row
          });
          if (res && res.code === 0) {
            row.chGradeStatus = row.chGradeStatus;
          } else {
            row.chGradeStatus = Number(!row.chGradeStatus);
            this.$message({
              type: "success",
              message: "状态更改失败!"
            });
          }
        })
        .catch(() => {
          row.chGradeStatus = Number(!row.chGradeStatus);
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    pageCurrentChange(page) {
      this.init(page);
    }
  }
};
</script>

<style lang="less" scoped>
</style>