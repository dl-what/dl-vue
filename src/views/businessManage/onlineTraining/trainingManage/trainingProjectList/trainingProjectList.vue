<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="80px"
    >
      <control-bar slot="extend-bar" @select="select" :options="options"></control-bar>
    </search-bar>
    <el-table :data="tableData" border>
      <el-table-column label="序号" fixed type="index" width="60px">
        <template slot-scope="scope">{{pageSize*(current-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column label="项目标题" prop="title" min-width="160px"></el-table-column>
      <el-table-column label="项目级别" prop="rangeName" min-width="140px"></el-table-column>
      <el-table-column label="项目类别" prop="typeName" min-width="140px">
        <template slot-scope="scope">
            <span
              class="icon-tag"
              :class="{
              blue:scope.row.type=='2',
              green:scope.row.type=='1',
              grey:scope.row.type=='0',
              yellow:scope.row.type=='3',
              red:scope.row.type=='4',
              }"
            >{{scope.row.typeName}}</span>
          </template>
      </el-table-column>
      <el-table-column label="培训课程" prop="courseName" min-width="140px" show-overflow-tooltip></el-table-column>
      <el-table-column label="是否关联考试" prop="isExamName" min-width="140px">
        <template slot-scope="scope">
            <span
              class="icon-circle"
              :class="{
              blue:scope.row.isExam=='4',
              green:scope.row.isExam=='0',
              grey:scope.row.isExam=='2',
              yellow:scope.row.isExam=='3',
              red:scope.row.isExam=='1',
              }"
            >{{scope.row.isExamName}}</span>
          </template>
      </el-table-column>
      <el-table-column label="培训说明" prop="introduce" min-width="140px" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="140px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="lookDetail(scope.row.id)"
            v-has="'trainingProjectList-details'"
            :id="$route.name+'-details-'+scope.$index"
          >查看</el-button>
          <el-button
            size="mini"
            :id="$route.name+'-edit-'+scope.$index"
            @click="editorialChange(scope.row.id)"
            v-has="'trainingProjectList-edit'"
          >编辑</el-button>
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
export default {
  name: "",
  data() {
    return {
      searchOptions: [
        { title: "项目标题", type: "input", prop: "title", value: "" },
        {
          title: "培训课程",
          type: "select",
          prop: "courseId",
          value: "",
          options: []
        },
        {
          title: "项目级别",
          type: "select",
          prop: "range",
          value: "",
          options: [{ label: "全国", value: 1 }, { label: "省级", value: 2 }]
        }
      ],
      options: [
        {
          name: "新建培训项目",
          type: "primary",
          icon: "plus",
          permission: "trainingProjectList-create"
        },
        {
          name: "导出当前",
          type: "",
          icon: "s-promotion",
          permission: "trainingProjectList-export"
        },
        {
          name: "导出全部",
          type: "",
          icon: "s-promotion",
          permission: "trainingProjectList-exportAll"
        }
      ],
      tableData: [],
      total: 0,
      pageSize: 10,
      current: 1,
      insId: null
    };
  },
  components: {},
  created() {
    this.insId = this.$storage.get("userInfo").insId;
    this.init();
    this.courseList();
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
        let res = await this.$api.trainItemListAll({ data });
        if (res && res.code === 0) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.current = res.data.current;
        }
      })(val);
    },
    courseList() {
      (async () => {
        let res = await this.$api.queryTrainCourseDownList({
          data: { insId: this.insId }
        });
        if (res && res.code === 0) {
          if (res.data && res.data.length) {
            let option = res.data.map(item => ({
              label: item.name,
              value: item.id
            }));
            this.searchOptions[1].options = option;
          }
        }
      })();
    },
    lookDetail(id) {
      this.$router.push({
        name: "trainingProjectListAddDetails",
        query: { id: id, status: 1 }
      });
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    pageCurrentChange(page) {
      this.init(page);
    },
    select(val) {
      if (val.name == "新建培训项目") {
        this.$router.push({
          name: "trainingProjectListAdd",
          query: { status: 0 }
        });
      }
      if (val.name === "导出当前") {
        this.exportExcel(0);
      }
      if (val.name === "导出全部") {
        this.exportExcel(1);
      }
    },
    editorialChange(id) {
      this.$router.push({
        name: "trainingProjectListEdit",
        query: { id: id, status: 2 }
      });
    },
    search(param) {
      this.searchForm = { ...param };
      this.init();
    },
    exportExcel(val) {
      (async val => {
        let res = await this.$api.trainItemExportExcel({
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
        aLink.setAttribute("download", "培训项目.xls");
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
</style>
