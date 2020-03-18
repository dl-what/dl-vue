<template>
  <div class="vlt-card" style="padding:10px">
    <div class="systemLog-title">
      <div class="role-search">
        <search-bar
          class="search-bar-demo"
          @search="search"
          :options="option"
          :total="total"
          labelWidth="6em"
        ></search-bar>
        <control-bar :options="controlOptions" @select="selectBtn" style="margin:0"></control-bar>
      </div>
    </div>

    <div class="systemLog-tab">
      <el-table :data="tableData" border style="width: 100%; margin-top: 10px;" ref="print">
        <el-table-column type="index" fixed label="序号" width="55">
          <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名称" width="120px"></el-table-column>
        <el-table-column prop="strModule" label="功能模块" width="140px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="strType" label="操作类型" width="120px" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作内容" min-width="200px">
          <template slot-scope="scope">
            <div class="content-wrap" v-html="$xss(scope.row.content)"></div>
          </template>
        </el-table-column>
        <el-table-column prop="strResult" label="执行结果" width="100px"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" width="160"></el-table-column>
      </el-table>
      <div class="system-pagintion">
        <table-paging
          :current-page="page"
          :page-size="pageSize"
          :total="total"
          @handleSizeChange="pageSizeChange"
          @handleCurrentChange="pageCurrentChange"
        ></table-paging>
      </div>
      
     <el-dialog
      title="打印预览"
      :visible.sync="isPrint"
      class="print-fullscreen"
      :fullscreen="true">
      <print :data="printData" @cancel="isPrint=false"></print>
    </el-dialog>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "systemLog",
  data() {
    return {
      formInline: {
        userName: "",
        region: []
      },
      option: [
        { type: "input", prop: "userName", value: null, title: "用户名称" },
        {
          type: "datepicker-range",
          prop: "region",
          value: [],
          title: "操作时间",
          placeholder: ["开始时间", "结束时间"]
        }
      ],
      tableData: [],
      isPrint: false,
      printData: {
        title: '系统操作日志',
        params: {
          page: 1,
          pageSize: 20
        },
        props: [
          {prop: 'index', label:'序号', width: ''},
          {prop: 'userName', label:'用户名称', width: ''},
          {prop:'strModule', label:'功能模块', width: ''},
          {prop:'strType', label:'操作类型', width: ''},
          {prop:'content', label:'操作内容', width: ''},
          {prop:'strResult', label:'执行结果', width: ''},
          {prop:'createTime', label:'操作时间', width: ''},
        ],
        tableData: [],
      },
      controlOptions: [
        { name: "导出", type: "primary", icon: "s-promotion", permission: "systemOperationLog-export" },
        // { name: "导出全部", type: "", icon: "s-promotion", permission: "systemOperationLog-exportAll" },
        { name: "打印", type: "", icon: "printer", permission: "systemOperationLog-print" }
      ],
      options: [],
      page: 1,
      pageSize: 20,
      total: 0,
      currentPage: 1,
      searchFrom: {}
    };
  },
  created() {
    const self = this;
    self.init();
  },
  components: {},
  methods: {
    async init(val) {
      const self = this;
      let data = {
        page: val || 1,
        pageSize: self.pageSize,
        param: {
          ...self.searchFrom
        }
      };
      let reslt = await self.$api.systemOperateLogPage({ data }); //分页数据
      console.log(reslt, "系统日志");
      if (reslt && reslt.code === 0 && reslt.data) {
        self.page = reslt.data.current;
        self.total = reslt.data.total;
        self.tableData = reslt.data.records;
        self.printData.tableData = self.tableData;
      }
    },
    print() {
        this.$print(this.$refs.print); // 使用
      },
    cancel() {
      this.isPrint = false;
    },
    search(val) {
      // console.log(val);
      let data = { ...val };
      if (data.region && data.region.length > 0) {
        data.startTime = this.$moment(data.region[0]).format("YYYY-MM-DD");
        data.endTime = this.$moment(data.region[1]).format("YYYY-MM-DD");
      }
      delete data.region;
      this.searchFrom = JSON.parse(JSON.stringify(data));
      this.init();
    },
    async selectBtn(val) {
      if (val.name === "导出当前") {
        this.exportExcel(0);
      }
      if (val.name === "打印") {
        // this.$print(this.$refs.print);
        this.isPrint = true;
        this.printData.params.page = this.page;
        this.printData.params.pageSize = this.pageSize;
      }

      // if (val.name === "导出全部") {
      //   this.exportExcel(1);
      // }
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.init();
    },
    pageCurrentChange(page) {
      this.currentPage = page;
      this.init(page);
    },
    async exportExcel(val) {
      //导出
      const res = await this.$api.systemOperateLogExportExcel({
        data: {
          page: this.page,
          pageSize: this.pageSize,
          param: {
            ...this.searchFrom,
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
      aLink.setAttribute("download", "系统日志.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    }
  }
};
</script>

<style lang="less">
.content-wrap{
  text-align: left;
}
.content-wrap>ul{
  padding-left: 20px;
  text-align: left;
  ul{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding-left: 20px;
  }
  li{
    text-align: left;
    padding-right: 20px;
    flex: none;
    list-style-type: decimal;
  }
}
.print-wrap{
  text-align: right;
}
.print-btn-wrap{
  padding: 10px 0;
}
</style>
