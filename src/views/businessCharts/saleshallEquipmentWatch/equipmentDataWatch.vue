<template>
  <div class="vlt-card">
    <section class="comp-item">
       <search-bar  :showHandler='true' 
        ref="searchForm"
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
        @sort-change="sortChange"
        :summary-method="getSummaries"
        :show-summary="showSum"
      >
        <el-table-column align="center" label="序号" min-width="65">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.$index+1}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="hallName" label="销售厅" min-width="100"></el-table-column>
        <el-table-column align="center" prop="cityName" label="城市" min-width="80"></el-table-column>
        <el-table-column align="center" prop="provinceName"  min-width="80" label="省份"></el-table-column>
        <el-table-column align="center" label="柜员机">
          <el-table-column sortable="custom" prop="tellerMachineTotal" align="center" min-width="100" label="柜员机数量"></el-table-column>
          <el-table-column sortable="custom" prop="tellerMachineOnlineTotal" align="center" min-width="120" label="柜员机在线数量"></el-table-column>
        </el-table-column>
        <el-table-column align="center" label="终端机">
          <el-table-column sortable="custom" prop="terminalTotal" align="center" min-width="100"  label="终端机数量"></el-table-column>
          <el-table-column sortable="custom" prop="terminalOnlineTotal" align="center" min-width="120"  label="终端机在线数量"></el-table-column>
          <el-table-column  prop="terminalOnlineRate" align="center" label="终端机在线率" min-width="120"></el-table-column>
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
import city from "@/libs/map/city.json";
export default {
  name: "saleshallEquipmentWatch",
  data() {
    const self = this;
    return {
      timeName: null,//定时器
      totalCount: 0,//表格总条数
      insId: null,//机构id
      hallId: null,//销售厅id
      sumList:{},//总计数组
      showSum:true,//默认显示总计一列
      //搜索参数设置
      searchOptions: [
       {
          type: "cascader",
          prop: "area",
          value:'',
          title: "所在区域",
          options: [],
          setProps: { value: "id", label: "text" ,checkStrictly: true },
          change(val) {
            self.getInsId(val);
          }
        },
        {
          type: "select",
          prop: "hallId",
          value: "",
          title: "销售厅",
          placeholder: "请选择销售厅",
          options: [
          ],
          change(val) {
            self.getHallId(val);
          }
        }
      ],
       //按钮参数配置
      controlOptions: [
        {
          name: "导出",
          type: "primary",
          icon: "download",     
          permission: "equipmentDataWatch-export"
        }
      ],
      //搜索请求参数
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        param: {}
      },
      tableData: []//接收表格数据数组
    };
  },
  methods: {
     //点击表格的升降序
     sortChange(column) {
       //hallDataSortField 1:柜员机数量;2:柜员机在线数量;3:终端机数量;4:终端机在线数量
      //ascOrDesc 0:升序;1:降序
      var hallDataSortField, ascOrDesc;
      if (column.prop == "tellerMachineTotal") {
        hallDataSortField = 1;
      } else if (column.prop == "tellerMachineOnlineTotal") {
        hallDataSortField = 2;
      } else if (column.prop == "terminalTotal") {
        hallDataSortField = 3;
      } else if (column.prop == "terminalOnlineTotal") {
        hallDataSortField = 4;
      }
      if (column.order == "descending") {
        ascOrDesc = 1;
      } else if (column.order == "ascending") {
        ascOrDesc = 0;
      }
      this.listQuery.param.hallDataSortField = hallDataSortField;
      this.listQuery.param.ascOrDesc = ascOrDesc;
      this.getHallEqData(1);
    },
    //获取销售厅id
    getHallId(val) {
      this.hallId = val;
    },
    //获取区域Id
    getInsId(val) {
      this.insId = val
        ? val[val.length - 1] == 0
          ? val[val.length - 2]
          : val[val.length - 1]
        : "";
      this.getHallList()
    },
    //获取设备数据
    async getHallEqData(type) {
      const self = this;
      const res = await self.$api.getHallEqData({
        data: this.listQuery,
        closeLoading: type!==1
      });
      if (res && res.code == 0) {
        if (res.data.dataList.length > 0) { 
          this.showSum=res.data.dataList.length == 1?false:true       
          res.data.dataList.forEach(item => {
            item.terminalOnlineRate =
              Math.round((item.terminalOnlineTotal / item.terminalTotal) * 100) + "%";
            if (item.cityName && item.cityName == item.provinceName) {
              item.cityName = "省直属";
            }
          });
        }
        self.tableData = res.data.dataList;
        self.totalCount = res.data.totalRecord;
      }
    },
    //页数改变事件
    pageSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.listQuery.pageNum = 1;
      this.getHallEqData(1);
    },
    //销售厅下拉列表
    async getHallList() {
      var insId = this.$storage.get("userInfo").insId;
      const self = this;
      const res = await self.$api.getHallList({
        data: {
          hallType: 2,
          scopeType: 0,
          insId: this.insId ? this.insId : insId
        }
      });
      if (res && res.code == 0) {
        this.searchOptions.forEach((item, index) => {
          if (item.prop === "hallId") {
            res.data.forEach(item => {
              item.value = item.hallId;
              item.label = item.hallName;
            });
            item.options = res.data;
          }
        });
      }
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum = currentPage;
      this.getHallEqData(1);
    },
    //导出方法
    async exportExcel() {
      const res = await this.$api.hallExport({
        data: {
          param: {
            hallId: this.hallId,
            exportType: 2,
            exportStatus: 1,
            insId: this.insId
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
      aLink.setAttribute("download", "销售厅设备数据信息.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    },
    //导出
    selectBtn(val) {
      if (val.name === "导出") {
        this.exportExcel();
      }
    },
    //查询
    search(form) {
      this.listQuery.pageNum = 1;
      this.listQuery.param = {
        insId: form.area
          ? form.area[form.area.length - 1] == 0
            ? form.area[form.area.length - 2]
            : form.area[form.area.length - 1]
          : "",
        hallId: form.hallId
      };
      this.getHallEqData(1);
      this.hallTerminalCountSum()
    },
    //递归绑定机构树
    async queryInsTree() {
      let res = await this.$api.queryInsTree();
      if (res && res.code == 0) {
        this.setLabelAndValue(res.data);
      }
    },
    setLabelAndValue(area) {
      area.forEach(item => {
        if (item.children) {
          this.setLabelAndValue(item.children);
        }
      });
      this.searchOptions.forEach(item => {
        if (item.type === "cascader") {
          item.options = area;
        }
      });
    },
    //30s刷新数据
    timer() {
      this.timeName = setInterval(item => {
        this.getHallEqData();
        this.getHallList()
      }, 30000);
    },
    //绑定列表总计
     getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
           if (index === 0) {
            sums[index] = '总计';
            return;
          }
          var value=''
          for(let item in this.sumList){
            if(item==column.property){
               value=this.sumList[item]
            }
          }      
          if(value || value===0){
            sums[index] = value;
          } else{
            sums[index] = "-";
          }              
        });
        return sums;
      },
      //获取列表总计
      async hallTerminalCountSum(){
        let res =await this.$api.hallTerminalCountSum({
          data:this.listQuery
        })
        if(res && res.code==0){
          this.sumList=res.data
        }
      }
  },

  mounted() {
    this.hallTerminalCountSum()
    this.getHallEqData(1);
    this.queryInsTree();
    this.getHallList();
    this.timer();
  },
  created() {  
  },
  beforeDestroy() {
     //销毁定时器
    clearInterval(this.timeName);
    this.timeName = null;
  }
};
</script>

<style  lang="less" scoped>
/deep/.el-table td,
.el-table th {
  padding: 8px 0;
}
.el-table{
 overflow :auto 
}
.el-table--scrollable-x .el-table__body-wrapper{
overflow:visible
}  
/deep/.el-table__body-wrapper,
/deep/.el-table__header-wrapper,
/deep/.el-table__footer-wrapper{
overflow:visible
}
.el-table::after{
    position: relative !important    
}
</style>
