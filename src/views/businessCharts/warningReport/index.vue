<template>
  <div class="vlt-card">
    <section class="comp-item">
      <search-bar
        :showHandler="true"
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="totalCount"
        labelWidth="80px"
      >
        <control-bar
          @select="selectBtn"
          slot="extend-bar"
          :options="controlOptions"
          position="left"
        ></control-bar>
      </search-bar>
    </section>
    <div class="tab-container">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{background:'rgba(240,240,240,.5)'}"
        :cell-style="{align:'center'}"
      >
        <el-table-column align="center" label="序号" min-width="60">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.$index+1}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="insName" label="区域名称" min-width="140"></el-table-column>
        <el-table-column align="center" prop="source" label="告警源"></el-table-column>
        <el-table-column align="center" prop="alarmLevel" label="告警等级">
          <template slot-scope="scope">
            <span v-if="scope.row.alarmLevel==0">Ⅲ级</span>
            <span v-if="scope.row.alarmLevel==1">Ⅱ级</span>
            <span v-if="scope.row.alarmLevel==2">Ⅰ级</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="告警数量" class-name="warningCount">
          <template slot-scope="scope">
            <div
              :class="scope.row.alarmInfoCount>0?'pointer':''"
              @click="clickWaringCount(scope.row)"
            >{{scope.row.alarmInfoCount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="processingCount"
          class-name="processingCount"
          label="处理数量"
        >
          <template slot-scope="scope">
            <div
              :class="scope.row.processingCount>0?'pointer':''"
              @click="clickWaringHandleCount(scope.row)"
            >{{scope.row.processingCount}}</div>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        :current-page="listQuery.pageNum"
        :page-size="20"
        :total="totalCount"
        @handleSizeChange="pageSizeChange"
        @handleCurrentChange="pageCurrentChange"
      ></table-paging>
    </div>
  </div>
</template>

<script>
import storage from "@/utils/storage";
import moment from "moment";
export default {
  data() {
    return {
      searchOptions: [
        {
          type: "datetime-range",
          prop: "timeList",
          value: "",
          title: "时间选择",
          placeholder: ["开始时间", "结束时间"],
          pickerOptions: {
            disabledDate(time) {
              const minTime = 31 * 24 * 3600 * 1000;
              let endTime = Date.now();
              return (
                time.getTime() > endTime || time.getTime() < endTime - minTime
              );
            }
          }
        },
        {
          type: "select",
          prop: "alarmSource",
          value: "",
          title: "告警源",
          placeholder: "请选择",
          options: [
            {
              label: "奖池风险",
              value: "奖池风险"
            },
            {
              label: "游戏风险",
              value: "游戏风险"
            },
            {
              label: "金额风险",
              value: "金额风险"
            },
            {
              label: "账户风险",
              value: "账户风险"
            },
            {
              label: "数量风险",
              value: "数量风险"
            },
            {
              label: "用户风险",
              value: "用户风险"
            }
          ]
        },
        {
          type: "select",
          prop: "alarmLevel",
          value: "",
          title: "告警等级",
          placeholder: "请选择",
          options: [
            {
              label: "Ⅲ级",
              value: 0
            },
            {
              label: "Ⅱ级",
              value: 1
            },
            {
              label: "Ⅰ级 ",
              value: 2
            }
          ]
        }
      ],
      controlOptions: [
        {
          name: "导出",
          type: "primary",
          icon: "download",
          permission: "warningReport-export"
        }
      ],
      activeName: "first",
      totalCount: 100,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        param: {}
      },
      tableData: []
    };
  },
  methods: {
    //查询
    search(form) {
      this.listQuery.pageNum = 1;
      this.listQuery.param = {
        source: form.alarmSource,
        alarmLevel: form.alarmLevel,
        timeStart: form.timeList
          ? moment(form.timeList[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        timeEnd: form.timeList
          ? moment(form.timeList[1]).format("YYYY-MM-DD HH:mm:ss")
          : ""
      };
      //将时间对象存于浏览器
      var timeObj = {};
      timeObj.timeStart = this.listQuery.param.timeStart;
      timeObj.timeEnd = this.listQuery.param.timeEnd;
      storage.session.set("timeObj", timeObj);
      this.getReportList();
    },
    //导出按钮
    selectBtn(val) {
      if (val.name === "导出") {
        this.exportExcel();
      }
    },
    //导出
    async exportExcel() {
      const res = await this.$api.reportExport({
        data: {
          param: {
            exportStatus: 1
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
      aLink.setAttribute("download", "告警报表数据.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    },
    //页数改变事件
    pageSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.listQuery.pageNum = 1;
      this.getReportList();
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum = currentPage;
      this.getReportList();
    },
    //获取告警报表列表数据
    async getReportList() {
      const res = await this.$api.getReportList({
        data: this.listQuery
      });
      if (res && res.code == 0) {
        console.log(res);
        this.tableData = res.data.dataList;
        this.totalCount = res.data.totalRecord;
      }
    },
    //点击列表告警数量
    clickWaringCount(row) {
      if (row.alarmInfoCount > 0) {
        row.deal = false;
        storage.session.set("waringInfo", row);
        this.$router.push({
          name: "warningWatch"
        });
      }
    },
    //点击列表处理数量
    clickWaringHandleCount(row) {
      if (row.processingCount > 0) {
        row.deal = true;
        storage.session.set("waringInfo", row);
        this.$router.push({
          name: "warningWatch"
        });
      }
    }
  },
  created() {},
  mounted() {
    this.getReportList();
  }
};
</script>

<style lang="less" scoped>
/deep/ .search-bar-comp {
  .el-date-editor--datetimerange {
    width: 325px;
  }
}

.el-table {
  /deep/ td.warningCount > .cell {
    color: red;
  }
  .pointer {
    cursor: pointer;
  }
  /deep/ td.processingCount > .cell {
    color: blue;
  }
}

/deep/.el-table td,
.el-table th {
  padding: 8px 0;
}
</style>
