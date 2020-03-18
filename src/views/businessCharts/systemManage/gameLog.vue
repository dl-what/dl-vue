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
        <el-table-column align="center" label="序号" min-width="60">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.$index+1}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="gameName" label="游戏" min-width="120"></el-table-column>
        <el-table-column align="center" prop="issueId" label="周期编号" ></el-table-column>
        <el-table-column align="center" prop="endTime" label="期末时间" min-width="160"></el-table-column>
        <el-table-column align="center" prop="endSaleMoney" label="期末累计销量(元)" min-width="130"></el-table-column>
        <el-table-column align="center" prop="endSaleBonus" label="期末累计奖金(元)" min-width="130"></el-table-column>
        <el-table-column align="center" prop="endSaleBonusPool" label="期末累计奖池(元)" min-width="130"></el-table-column>
        <el-table-column align="center" prop="currentIssueSaleMoney" label="当期销量(元)" min-width="130">  </el-table-column>
        <el-table-column align="center" prop="currentIssueSaleBonus" label="当期奖金(元)" min-width="130"></el-table-column>
        <el-table-column align="center" prop="currentIssueSalePool" label="当期奖池(元)" min-width="130"></el-table-column>
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
          prop: "gameId",
          value: '',
          title: "游戏",
          placeholder: "请选择",
          options: [             
          ]
        },       
      ],
      controlOptions: [{ name: "导出", type: "primary", icon: "download",permission: 'gameLog-export' }],
      activeName: "first",
      totalCount: 100,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        param: {}
      },
      tableData: [
       
      ],
      timeName:null
    };
  },
  methods: {
    search(form){
      this.listQuery.pageNum=1
      this.listQuery.param = {
        gameId: form.gameId,
        timeStart: form.timeList
          ? moment(form.timeList[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        timeEnd: form.timeList
          ? moment(form.timeList[1]).format("YYYY-MM-DD HH:mm:ss")
          : ""
      };
      this.getGameLogList(1)
    },
    selectBtn(val){
      if (val.name == "导出") {
        this.exportExcel();
      }
    },
    async exportExcel(){
      const res = await this.$api.gameLogExport({
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
      aLink.setAttribute("download", "游戏日志数据信息.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    },
    //页数改变事件
    pageSizeChange(pageSize) {
      this.listQuery.pageSize=pageSize
      this.listQuery.pageNum=1
      this.getGameLogList(1)
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum=currentPage
      this.getGameLogList(1)
    },
    // 转换金额 百分
    toMoneyReal(data, val) {
      for(let key in data) {
        if(typeof(data[key])=='object') {
          if(data[key]&&data[key][val]) {
            data[key][val] = data[key][val]/100;
          }
        }
        if(Array.isArray(data[key])) {
          data[key]&&data[key].forEach((item)=>{
            if(item[val]) {
              item[val] = item[val]/100;
            }
          })
        }
      }
      return data;
    },
    //获取游戏日志列表数据 type 1:不关闭加载动画 2:关闭
    async getGameLogList(type){
       const res =await this.$api.getGameLogList(
         {
           data:this.listQuery,
           closeLoading:type!==1
         }
       )
       if(res && res.code == 0){
           let data = res.data;
          // 需要把百分制金额 除于 100 的字段
          let moneyArray = ['endSaleMoney', 'endSaleBonus', 'endSaleBonusPool','currentIssueSaleBonus', 'currentIssueSaleMoney', 'currentIssueSalePool']
          moneyArray.forEach((item)=>{
            data = this.toMoneyReal(data, item)
          })
         this.tableData=res.data.records
        this.totalCount=res.data.total
       }
    },
    //获取游戏下拉框数据
    async getGameLists(options) {
      const self = this;
      const res = await self.$api.getGameLists();
      if (res && res.code == 0) {
         this.searchOptions.forEach(item => {
        if (item.prop == "gameId") {
          res.data.forEach(v=>{
            item.value=item.gameId
            item.label=item.gameName
          })
          item.options = res.data;
        }
      });
      }
    },
    //30s定时刷新(表格数据)
    timer(){
      this.timeName=setInterval(v=>{
        this.getGameLogList()
      },30000)
    },
     // 转换金额 百分
    toMoney(data, val) {
      const self = this;
      for (let key in data) {
        if (typeof data[key] == "object") {
          if (data[key][val]) {
            data[key][val] = self.$common.accMul(data[key][val], 100);
          }
        }
        if (Array.isArray(data[key])) {
          data[key].forEach(item => {
            if (item[val]) {
              item[val] = self.$common.accMul(item[val], 100);
            }
          });
        }
      }
      return data;
    },
  },
  created() {
   
  },
  mounted() {
    this.getGameLogList(1)
    this.getGameLists()
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
/deep/.el-table td,
.el-table th {
  padding: 8px 0;
}
</style>
