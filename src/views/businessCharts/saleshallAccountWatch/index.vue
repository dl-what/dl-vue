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
        <el-table-column align="center" prop="hallName" label="销售厅" min-width='120'></el-table-column>
        <el-table-column align="center" prop="cityName" min-width='120' label="城市"></el-table-column>
        <el-table-column align="center" prop="provinceName" min-width='120' label="省份"></el-table-column>

        <el-table-column align="center" prop="cardOpenTotal" sortable="custom" min-width='100' label="开卡(张)"></el-table-column>
        <el-table-column align="center" prop="cardWithdrawTotal" sortable="custom" min-width='100' label="退卡(张)"></el-table-column>
        <el-table-column align="center" prop="paymentAmount" sortable="custom" min-width='120' label="缴款(元)"></el-table-column>
        <el-table-column align="center" prop="rechargeAmount" sortable="custom" min-width='120' label="充值(元)"></el-table-column>
        <el-table-column align="center" prop="withdrawAmount" sortable="custom" min-width='120' label="提现(元)"></el-table-column>
        <el-table-column align="center" prop="accountBalance" sortable="custom" min-width='120' label="账户余额(元)"></el-table-column>
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
  name: "saleshallAccountWatch",
  data() {
    const self = this;
    return {
      timeName: null,//定时器
      totalCount: 0,//表格总条数
      insId: null,//机构id
      hallId: null,//销售厅id
      sumList: {},//总计数组
      //搜索参数设置
      searchOptions: [
        {
          type: "cascader",
          prop: "area",
          value: "",
          title: "所在区域",
          options: [],
          setProps: { value: "id", label: "text",checkStrictly: true  },
          change(val) {
            self.getInsId(val);
          }
        },
        {
          type: "select",
          prop: "hallId",
          value: "",
          title: "销售厅",
          placeholder: "请选择",
          options: [
            {
              label: "选项1",
              value: 1
            },
            {
              label: "选项2",
              value: 2
            }
          ],
          change(val) {
            self.getHallId(val);
          }
        }
      ],
      //按钮参数设置
      controlOptions: [
        {
          name: "导出",
          type: "primary",
          icon: "download",
          permission: "accountWatch-export"
        }
      ],
      //搜索请求参数
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        param: {}
      },
      tableData: [],//接收表格数据数组
      showSum:true//默认显示总计一列
    };
  },
  methods: {
     //获取总计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        var value = "";
        for (let item in this.sumList) {
          if (item == column.property) {
            value = this.sumList[item];
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
     //点击表格的升降序
    sortChange(column) {
      //hallAccountSortField 1:开卡;2:推卡;3:缴款;4:充值;5:提现;6:账户余额
      //ascOrDesc 0:升序;1:降序
      var hallAccountSortField, ascOrDesc;
      if (column.prop == "cardOpenTotal") {
        hallAccountSortField = 1;
      } else if (column.prop == "cardWithdrawTotal") {
        hallAccountSortField = 2;
      } else if (column.prop == "paymentAmount") {
        hallAccountSortField = 3;
      } else if (column.prop == "rechargeAmount") {
        hallAccountSortField = 4;
      } else if (column.prop == "withdrawAmount") {
        hallAccountSortField = 5;
      } else if (column.prop == "accountBalance") {
        hallAccountSortField = 6;
      }
      if (column.order == "descending") {
        ascOrDesc = 1;
      } else if (column.order == "ascending") {
        ascOrDesc = 0;
      }
      this.listQuery.param.hallAccountSortField = hallAccountSortField;
      this.listQuery.param.ascOrDesc = ascOrDesc;
      this.getHallAccount(1);
    },
    //30s定时刷新(表格数据、销售厅、设备编码)
    timer() {
      this.timeName = setInterval(item => {
        this.getHallList()
        this.getHallAccount();
      }, 30000);
    },
    //销售厅下拉框改变事件
    getHallId(val) {
      this.hallId = val;
    },
    //区域下拉框改变事件
    getInsId(val) {
      this.insId = val
        ? val[val.length - 1] == 0
          ? val[val.length - 2]
          : val[val.length - 1]
        : "";
        this.getHallList()
    },
    //获取销售厅下拉框列表
    async getHallList() {
      const self = this;
      var insId = this.$storage.get("userInfo").insId;
      const res = await self.$api.getHallList({
        data: {
          hallType: 1,
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
    // 转换金额 百分
    toMoneyReal(data, val) {
      for (let key in data) {
        if (typeof data[key] == "object") {
          if (data[key][val]) {
            data[key][val] = data[key][val] / 100;
          }
        }
        if (Array.isArray(data[key])) {
          data[key].forEach(item => {
            if (item[val]) {
              item[val] = item[val] / 100;
            }
          });
        }
      }
      return data;
    },
    //获取销售厅账户数据列表
    async getHallAccount(type) {
      const self = this;
      const res = await self.$api.getHallAccount({
        data: this.listQuery,
        closeLoading: type!==1
      });
      if (res && res.code == 0) {
        this.showSum=res.data.dataList.length == 1?false:true 
        res.data.dataList.forEach(item => {
          if (item.cityName && item.cityName == item.provinceName) {
            item.cityName = "省直属";
          }
        });
        let data = res.data;
        // 需要把百分制金额 除于 100 的字段
        let moneyArray = [
          "paymentAmount",
          "rechargeAmount",
          "withdrawAmount",
          "accountBalance"
        ];
        moneyArray.forEach(item => {
          data = self.toMoneyReal(data, item);
        });
        self.tableData = res.data.dataList;
        self.totalCount = res.data.totalRecord;
      }
    },
    //递归绑定机构名称
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
    //页数改变事件
    pageSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.listQuery.pageNum = 1;
      this.getHallAccount(1);
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum = currentPage;
      this.getHallAccount(1);
    },
    //点击查询
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
      this.getHallAccount(1);
      this.hallAccountSum()
    },
    //导出
    async exportExcel() {
      const res = await this.$api.hallExport({
        data: {
          param: {
            hallId: this.hallId,
            exportType: 1,
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
      aLink.setAttribute("download", "销售厅账户信息.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    },
    selectBtn(val) {
      if (val.name === "导出") {
        this.exportExcel();
      }
    },
    //总计金额相关的字段/100
    async hallAccountSum() {
      let res = await this.$api.hallAccountSum({
        data: this.listQuery
      });
      if (res && res.code == 0) {
        let data = res;
        // 需要把百分制金额 除于 100 的字段
        let moneyArray = [
          "paymentAmount",
          "rechargeAmount",
          "withdrawAmount",
          "accountBalance"
        ];
        moneyArray.forEach(item => {
          data = this.toMoneyReal(data, item);
        });
        this.sumList = data.data;
        console.log(this.sumList);
      }
    }
  },
  mounted() {
    this.hallAccountSum();
    this.getHallList();
    this.getHallAccount(1);
    this.queryInsTree();
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
