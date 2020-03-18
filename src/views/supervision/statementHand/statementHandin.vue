<template>
  <div id="statementHandin">
    <div class="searchCont">
      <div class="statementHandin-list">
        <span>模板名称：</span>
        <el-input size="small" v-model="templateName" placeholder="请输入模板名称"></el-input>
      </div>
      <div class="statementHandin-list">
        <span>报表状态：</span>
        <el-select size="small" v-model="handState" placeholder="请选择模板状态">
          <el-option
            v-for="item in optionsd"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="statementHandin-list">
        <span>报表起止时间：</span>
        <el-date-picker
          size="small"
          v-model="templateDate"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <div class="statementHandin-list operation">
        <el-button type="primary" size="small" @click="statementSearch">查询</el-button>
      </div>
    </div>
    <p class="tips-item" v-if="isResult">
      <i class="el-alert__icon el-icon-info"></i>
      <span>
        共搜索到
        <em>{{resTotal}}</em>条数据
      </span>
    </p>
    <div class="tables">
      <el-table
        :data="tableData"
        border
        :header-cell-style="{background:'#f8f8f9',color:'#333'}"
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" width="60">
          <template slot-scope="scope">{{currentIndex+scope.$index+1}}</template>
        </el-table-column>
        <el-table-column align="center" prop="templateName" label="模板名称" width></el-table-column>
        <el-table-column align="center" prop="beginTime" label="报表开始时间" width></el-table-column>
        <el-table-column align="center" prop="endTime" label="报表结束时间" width></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" width></el-table-column>
        <el-table-column align="center" label="导出状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.exportState==1">已导出</span>
            <span v-if="scope.row.exportState==0">未导出</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="exportTimes" label="导出次数" width="80"></el-table-column>

        <el-table-column align="center" prop="lastModifyedTime" label=" 导出时间" width></el-table-column>
        <el-table-column align="center" prop="lastModifyedBy" label="导出人" width></el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handinDetail(scope.row)">查看</el-button>
            <el-button size="mini" @click="exportList(scope.row)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-show="resTotal>0 && pageshow">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageNum"
        layout="total,prev, pager, next,sizes, jumper"
        :total="resTotal"
      ></el-pagination>
    </div>
  </div>
</template>
<style  scoped>
#statementHandin {
  width: 100%;
}
#statementHandin .searchCont {
  font-size: 0;
  padding-top: 10px;
  margin-bottom: 10px;
}
#statementHandin .statementHandin-list {
  display: inline-block;
  margin-left: 10px;
}
#statementHandin .statementHandin-list span {
  font-size: 14px;
  display: inline-block;
  color: #333;
  text-align: center;
}

#statementHandin .statementHandin-list .el-select,
#statementHandin .statementHandin-list .el-input {
  display: inline-block;
  width: 150px;
}
#statementHandin .tips-item {
  height: 34px;
  line-height: 34px;
  background-color: #f0faff;
  border: 1px solid #abdcff;
  font-size: 12px;
  color: #515a6e;
  border-radius: 4px;
  padding: 0 10px;
  margin: 10px 0 0;
  display: flex;
  align-items: center;
  margin: 0 20px 10px;
}
#statementHandin .tips-item em {
  color: #2d8cf0;
  font-style: normal;
  padding: 0 3px;
}
#statementHandin .tips-item i {
  vertical-align: middle;
  color: #2d8cf0;
  margin-right: 5px;
}
#statementHandin .tables {
  padding: 0 5px;
  margin-bottom: 20px;
}
#statementHandin .tables th {
  background: #f8f8f9;
  color: #333;
}
#statementHandin .tables .el-button {
  float: left;
}
#statementHandin .tables .el-button a {
  color: #66b1ff;
}
#statementHandin .pagination {
  text-align: right;
}
</style>
<script  type="text/javascript">
export default {
  data() {
    return {
      templateId: "", //报表id
      templateName: "", //报表名称
      templateState: "", //报表状态
      templateDate: [], //报表时间
      currentPage4: 1, //初始页码
      resTotal: 0, //报表总数
      tableData: [], //报表列表数据
      pageSize: 10, //报表表格显示条数
      pageNum: 10, //报表表格显示条数
      currentSize: 1,
      currentIndex: 0,
      handState: "9", //报表状态
      pageshow: true, //报表分页状态
      isResult: false, //报表查询显示状态
      optionsd: [
        {
          //报表状态数据
          value: "9",
          label: "全部"
        },
        {
          value: "0",
          label: "未导出"
        },
        {
          value: "1",
          label: "已导出"
        }
      ]
    };
  },
  created() {
    this.statementList();
  },
  mounted() {},
  methods: {
    async statementList() {
      //获取报表列表
      let pageSizeNum = localStorage.getItem("staPageSizeNum");
      if (pageSizeNum != undefined) {
        this.pageSize = pageSizeNum;
        this.pageNum = Number(pageSizeNum);
      }
      let data = {
        pageSize: this.pageSize,
        page: this.currentSize
      };
      //调用报表列表接口
      let res = await this.$api.reportLog({ data });
      //根据接口返回值判断
      if (res.status == true) {
        this.tableData = res.result;
        this.resTotal = res.totalCounts;
        this.currentIndex = (this.currentSize - 1) * this.pageSize;
      } else {
        this.masssge.error(res.errmsg);
      }
    },
    async statementSearch() {
      //报表查询
      let currentPage = Math.ceil(this.resTotal / this.pageSize);
      let pageSizeNum = localStorage.getItem("staPageSizeNum");
      this.templateDate == null ? (this.templateDate = []) : this.templateDate;
      if (pageSizeNum != undefined) {
        this.pageSize = pageSizeNum;
        this.pageNum = Number(pageSizeNum);
      }
      if (currentPage == this.currentSize) {
        this.currentSize = 1;
        this.currentPage4 = 1;
      }
      let data = {
        templateName: this.templateName,
        beginTime: this.templateDate[0] ? this.templateDate[0] : "",
        endTime: this.templateDate[1] ? this.templateDate[1] : "",
        exportState: this.handState,
        pageSize: this.pageSize,
        page: this.currentSize
      };
      //调用报表列表接口
      let res = await this.$api.reportLog({ data });
      //根据接口返回值判断
      if (res.status == true) {
        this.tableData = res.result;
        this.resTotal = res.totalCounts;
        this.currentIndex = 0;
        this.isResult = true;
      } else {
        this.masssge.error(res.errmsg);
      }
      //让分页隐藏
      this.pageshow = false;
      //重新渲染分页
      this.$nextTick(() => {
        this.pageshow = true;
      });
    },
    async changeStatement() {
      //页面操作切换调用公共方法
      let pageSizeNum = localStorage.getItem("staPageSizeNum");
      if (this.templateDate == null) {
        this.templateDate = [];
      }
      if (pageSizeNum != undefined) {
        this.pageSize = pageSizeNum;
        this.pageNum = Number(pageSizeNum);
      }
      let data = {
        templateName: this.templateName,
        beginTime: this.templateDate[0] ? this.templateDate[0] : "",
        endTime: this.templateDate[1] ? this.templateDate[1] : "",
        exportState: this.handState,
        pageSize: this.pageSize,
        page: this.currentSize
      };
      //调用报表列表接口
      let res = await this.$api.reportLog({ data });
      //根据接口返回值判断
      if (res.status == true) {
        this.tableData = res.result;
        this.resTotal = res.totalCounts;
        this.currentIndex = (this.currentSize - 1) * this.pageSize;
      } else {
        this.masssge.error(res.errmsg);
      }
    },
    exportList(result) {
      //报表导出
      (async () => {
        let res = await this.$api.getRepExport({
          data: {
            templateId: result.templateId,
            templateName: result.templateName,
            beginTime: result.beginTime,
            endTime: result.endTime
          },
          responseType: "blob"
        });
        var blob = new Blob([res.blob], {
          type: "application/vnd.ms-excel;charset=utf-8"
        });
        var url = window.URL.createObjectURL(blob); //获取下载路径
        var aLink = document.createElement("a"); //创建页面标签
        aLink.style.display = "none"; //设置元素状态
        aLink.href = url; //给元素赋值路径
        aLink.setAttribute("download", result.templateName + "报表.xls"); //设置元素属性
        document.body.appendChild(aLink); //追加到页面中
        aLink.click(); //添加点击事件
        document.body.removeChild(aLink); //下载完成移除元素
        window.URL.revokeObjectURL(url); //释放掉blob对象
      })();
    },
    handinDetail(data) {
      //报表详情方法
      this.$router.push({
        path: "/home/externalSupervision/statementHandinDetail",
        query: {
          beginTime: data.beginTime,
          endTime: data.endTime,
          name: data.templateName,
          id: data.templateId
        }
      });
    },
    handleSizeChange(val) {
      //报表页面条数切换方法
      this.pageSize = val;
      this.pageNum = val;
      localStorage.setItem("staPageSizeNum", val);
      if (this.resTotal < this.pageSize * this.currentSize) {
        this.currentSize = Math.ceil(this.resTotal / this.pageSize);
        this.currentPage4 = Math.ceil(this.resTotal / this.pageSize);
      }
      this.changeStatement(); //调用页面公共方法
    },
    handleCurrentChange(val) {
      //报表页码切换方法
      this.currentSize = val;
      this.changeStatement(); //调用页面公共方法
    }
  }
};
</script>
