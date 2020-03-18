<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="7em"
    >
      <control-bar slot="extend-bar" @select="select" :options="options"></control-bar>
    </search-bar>
    <el-table :data="tableData" border>
      <el-table-column label="序号" fixed type="index" width="60px">
        <template slot-scope="scope">{{pageSize*(current-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column label="计划标题" prop="title" min-width="160px"></el-table-column>
      <el-table-column label="培训对象" prop="objects" min-width="140px" show-overflow-tooltip></el-table-column>
      <el-table-column label="计划范围" prop="rangeName" min-width="140px"></el-table-column>
      <el-table-column label="状态" prop="statusName" min-width="140px">
        <template slot-scope="scope">
          <span
            class="icon-circle"
            :class="{
            blue:scope.row.status=='1',
            green:scope.row.status=='2',
            grey:scope.row.status=='5',
            yellow:scope.row.status=='3',
            red:scope.row.status=='4',
            }"
          >{{scope.row.statusName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道等级" prop="channelLevelName" min-width="140px"></el-table-column>
      <el-table-column label="培训项目" prop="trainItemName" min-width="140px" show-overflow-tooltip></el-table-column>
      <el-table-column label="开始培训时间" prop="startDate" min-width="160px"></el-table-column>
      <el-table-column label="结束培训时间" prop="expireDate" min-width="160px"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="140px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="lookDetail(scope.row.id)"
            v-has="'trainingPlanList-details'"
            :id="$route.name+'-details-'+scope.$index"
          >查看</el-button>
          <el-button
            size="mini"
            v-has="'trainingPlanList-stop'"
            :id="$route.name+'-stop-'+scope.$index"
            :disabled="scope.row.statusName==='停用'? true:false"
            @click="delectTraining(scope.row)"
          >停用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      :current-page="current"
      :page-size="pageSize"
      :total="total"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
import training from "./trainingAdd";
export default {
  name: "",
  data() {
    return {
      searchOptions: [
        { title: "计划标题", type: "input", prop: "title", value: "" },
        {
          title: "培训状态",
          type: "select",
          prop: "status",
          value: "",
          options: [
            { label: "未开始", value: 1 },
            { label: "进行中", value: 2 },
            { label: "已过期", value: 3 },
            { label: "停用", value: 4 }
          ]
        },
        {
          title: "培训开始时间",
          type: "datepicker-range",
          prop: "startTrainTime",
          value: ""
        },
        {
          title: "培训结束时间",
          type: "datepicker-range",
          prop: "endTrainTime",
          value: ""
        }
      ],
      options: [
        {
          name: "新建培训计划",
          type: "primary",
          icon: "plus",
          permission: "trainingPlanList-create"
        },
        {
          name: "导出当前",
          type: "",
          icon: "s-promotion",
          permission: "trainingPlanList-export"
        },
        {
          name: "导出全部",
          type: "",
          icon: "s-promotion",
          permission: "trainingPlanList-exportAll"
        }
      ],
      tableData: [],
      dialogVisible: false,
      searchForm: {},
      total: 0,
      pageSize: 20,
      current: 1,
      insId: null
    };
  },
  components: {
    training
  },
  created() {
    this.insId = this.$storage.get("userInfo").insId;
    this.init();
  },
  methods: {
    init(val) {
      (async val => {
        let data = {
          page: val || 1,
          pageSize: this.pageSize,
          param: {
            ...this.searchForm,
            insId: this.insId
          }
        };
        let res = await this.$api.trainOnlineList({ data });
        if (res && res.code === 0) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.current = res.data.current;
        }
      })(val);
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    pageCurrentChange(page) {
      this.init(page);
    },
    search(param) {
      if (param.startTrainTime) {
        let startTimeLeft = this.$moment(param.startTrainTime[0]).format(
          "YYYY-MM-DD "
        );
        let startTimeRight = this.$moment(param.startTrainTime[1]).format(
          "YYYY-MM-DD "
        );
        param = { ...param, startTimeLeft, startTimeRight };
        delete param.startTrainTime;
      }
      if (param.endTrainTime) {
        let endTimeLeft = this.$moment(param.endTrainTime[0]).format(
          "YYYY-MM-DD "
        );
        let endTimeRight = this.$moment(param.endTrainTime[1]).format(
          "YYYY-MM-DD "
        );
        param = { ...param, endTimeLeft, endTimeRight };
        delete param.endTrainTime;
      }
      this.searchForm = { ...param };
      this.init();
    },
    select(val) {
      if (val.name === "新建培训计划") {
        this.$router.push({ name: "trainingAdd" });
      }
      if (val.name === "导出当前") {
        this.exportExcel(0);
      }
      if (val.name === "导出全部") {
        this.exportExcel(1);
      }
    },
    levelType(val) {
      switch (val) {
        case "1":
          return "一级";
        case "2":
          return "二级";
        case "3":
          return "三级";
        case "4":
          return "四级";
        default:
          return val;
      }
    },
    lookDetail(id) {
      this.$router.push({ name: "trainingPlanDetail", query: { id: id } });
    },
    delectTraining(row) {
      this.$confirm("此操作将停用该计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$api.trainOnlineDelect({
            message: "停用成功",
            data: row.id
          });
          if (res && res.code === 0) {
            row.statusName = "停用";
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消当前操作"
          });
        });
    },
    exportExcel(val) {
      (async val => {
        let res = await this.$api.trainOnlineExportExcel({
          data: {
            page: this.current,
            pageSize: this.pageSize,
            param: {
              ...this.searchForm,
              insId: this.insId,
              all: !!val
            }
          },
          responseType: "blob"
        });
        var blob = new Blob([res.blob], {
          type: "application/vnd.ms-excel;charset=utf-8"
        });
        var url = window.URL.createObjectURL(blob);
        var aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.href = url;
        aLink.setAttribute("download", "培训计划.xls");
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink); //下载完成移除元素
        window.URL.revokeObjectURL(url); //释放掉blob对象
      })(val);
    }
  }
};
</script>

<style lang="less" scoped>
.intersest-dialog {
  border-radius: 10px;
}
</style>
