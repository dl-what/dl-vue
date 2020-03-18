<template>
  <div class="vlt-card">
    <section class="comp-item">
       <search-bar  :showHandler='true' 
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
        <el-table-column align="center" label="序号" min-width="5%">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.$index+1}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="alarmType" min-width='10%' label="告警类别" >
          <template slot-scope="scope">
            <div class="color" v-if="scope.row.alarmType=='ERROR'">
               {{scope.row.alarmType}}
            </div>
            <div v-else>
               {{scope.row.alarmType}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updateTime" label="更新时间" min-width="20%">
        </el-table-column>
        <el-table-column align="center" prop="applyLog" label="应用日志" min-width="40%">
          
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
import moment from "moment";
export default {
  data() {
    return {
      timeName:null,
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
          },
        },
        {
          type: "select",
          prop: "alarmType",
          value: 0,
          title: "告警类别",
          placeholder: "请选择",
          options: [
            {
              label: "全部类别",
              value: 0
            },
            {
              label: "ERROR",
              value: "ERROR"
            },
            {
              label: "WARN",
              value: "WARN"
            },
            {
              label: "INFO",
              value:"INFO"
            }
          ]
        },
        
      ],
      controlOptions: [{ name: "导出", type: "primary", icon: "download",permission: 'applyingLog-export' }],
      activeName: "first",
      totalCount: 100,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        param: {}
      },
      tableData: [
       
      ]
    };
  },
  methods: {
    //查询
    search(form){
      this.listQuery.pageNum=1
      this.listQuery.param = {
        alarmType: form.alarmType==0?"":form.alarmType,
        timeStart: form.timeList
          ? moment(form.timeList[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        timeEnd: form.timeList
          ? moment(form.timeList[1]).format("YYYY-MM-DD HH:mm:ss")
          : ""
      };
      this.getApplyLogList(1)
    },
    //导出按钮
    selectBtn(val){
      if (val.name == "导出") {
        this.exportExcel();
      }
    },
    //导出
    async exportExcel(){
      const res = await this.$api.applyLogExport({
        data: {
          param:{
            exportStatus:1
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
      aLink.setAttribute("download", "应用日志数据信息.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    },
    //页数改变事件
    pageSizeChange(pageSize) {
      this.listQuery.pageSize=pageSize
      this.listQuery.pageNum=1
      this.getApplyLogList(1)
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum=currentPage
      this.getApplyLogList(1)
    },
    //获取应用日志列表数据 type 1:不关闭加载动画 2:关闭
    async getApplyLogList(type){
       const res =await this.$api.getApplyLogList(
         {
           data:this.listQuery,
           closeLoading: type!==1
         }
       )
       if(res && res.code == 0){
         this.tableData=res.data.records
        this.totalCount=res.data.total
       }
    },
     //30s定时刷新(表格数据)
    timer(){
      this.timeName=setInterval(v=>{
        this.getApplyLogList()
      },30000)
    }
  },
  created() {
    this.getApplyLogList(1)
    this.timer()
  },
  beforeDestroy(){
    clearInterval(this.timeName);
    this.timeName = null;
  }
};
</script>

<style lang="less" scoped>
/deep/ .search-bar-comp {
  .el-date-editor--datetimerange {
    width: 325px;
  }
  
}
.color{
  color:#F56C6C
}
/deep/.el-table td,
.el-table th {
  padding: 8px 0;
}
</style>
