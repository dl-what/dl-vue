<template>
  <div class="vlt-card">
    <section class="comp-item">
      <search-bar
        :showHandler="true"
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
        <el-table-column align="center" prop="gameName" min-width="120" v-if="showGame" label="游戏"></el-table-column>
        <el-table-column
          align="center"
          prop="terminalNo"
          min-width="120"
          v-if="showTerminal"
          label="设备编码"
        ></el-table-column>
        <el-table-column align="center" prop="hallName" min-width="120" v-if="showHall" label="销售厅"></el-table-column>
        <el-table-column align="center" prop="cityName" v-if="showCity" label="城市"></el-table-column>
        <el-table-column align="center" prop="provinceName" label="省份"></el-table-column>

        <el-table-column
          align="center"
          prop="saleAmount"
          min-width="120"
          sortable="custom"
          label="销售额(元)"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="theoryReturnRate"
          min-width="100"
          v-if="showGame"
          label="理论返奖率"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="realityReturnRate"
          min-width="100"
          v-if="showGame"
          label="实际返奖率"
        ></el-table-column>
        <el-table-column align="center" label="中奖金额(元)">
          <el-table-column
            prop="smallWinAmount"
            sortable="custom"
            align="center"
            min-width="100"
            label="小奖中奖"
          ></el-table-column>
          <el-table-column
            prop="middleWinAmount"
            sortable="custom"
            align="center"
            min-width="100"
            label="中奖中奖"
          ></el-table-column>
          <el-table-column
            prop="bigWinAmount"
            sortable="custom"
            align="center"
            min-width="100"
            label="大奖中奖"
          ></el-table-column>
          <el-table-column
            prop="winTotalAmount"
            sortable="custom"
            align="center"
            min-width="100"
            label="中奖合计"
          ></el-table-column>
        </el-table-column>
        <el-table-column align="center" label="兑奖金额(元)">
          <el-table-column
            prop="smallCashAmount"
            align="center"
            sortable="custom"
            min-width="100"
            label="小奖兑奖"
          ></el-table-column>
          <el-table-column
            prop="middleCashAmount"
            align="center"
            sortable="custom"
            min-width="100"
            label="中奖兑奖"
          ></el-table-column>
          <el-table-column
            prop="bigCashAmount"
            align="center"
            sortable="custom"
            min-width="100"
            label="大奖兑奖"
          ></el-table-column>
          <el-table-column
            prop="cashTotalAmount"
            align="center"
            sortable="custom"
            min-width="100"
            label="兑奖合计"
          ></el-table-column>
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
  name: "gameDeal",
  data() {
    const self = this;
    return {      
      showGame: false,//表格显示游戏一列:默认false
      showCity: false,//表格显示城市一列:默认false
      showHall: false,//表格显示销售厅一列:默认false
      showTerminal: false,//表格显示设备编码一列:默认false
      queryType: 0,
      timeName: null,//定时器
      showSum: true,//默认显示总计一列
      gameId: null,//游戏Id
      insId: null,//机构id
      terminalId: null,//设备编码
      hallId: null,//销售厅id
      totalCount: 0,//表格总条数
      sumList: [],//总计数组
      //搜索参数设置
      searchOptions: [
        {
          type: "cascader",
          prop: "area",
          value: "",
          title: "所在区域",
          options: [],
          setProps: { value: "id", label: "text", checkStrictly: true },
          change(val) {
            self.getInsId(val);
          }
        },
        {
          type: "select",
          prop: "selectType",
          value: 0,
          title: "查询方式",
          placeholder: "请选择",
          options: [
            {
              label: "统计",
              value: 0
            },
            {
              label: "游戏",
              value: 1
            }
          ],
          change(val) {
            self.chooseDimension(val);
          }
        },
        {
          type: "select",
          prop: "game",
          value: "",
          title: "游戏",
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
          disabled: true,
          change(val) {
            self.getGame(val);
          }
        },
        {
          type: "select",
          prop: "dimension",
          value: "",
          title: "维度",
          placeholder: "请选择",
          options: [
            {
              label: "全国",
              value: 5
            },
            {
              label: "省级",
              value: 1
            },
            {
              label: "市级",
              value: 2
            },

            {
              label: "厅级",
              value: 3
            },
            {
              label: "终端",
              value: 4
            }
          ],
          change(val) {
            self.changeDimension(val);
          },
          show: true
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
          },
          show: false
        },
        {
          type: "select",
          prop: "terminalId",
          value: "",
          title: "设备编码",
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
            self.getTerminalId(val);
          },
          show: false
        }
      ],
      //省级对象数组
      proviceOptions: [
        {
          label: "省级",
          value: 1
        },
        {
          label: "市级",
          value: 2
        },

        {
          label: "厅级",
          value: 3
        },
        {
          label: "终端",
          value: 4
        }
      ],
      //市级对象数组
      cityOptions: [
        {
          label: "市级",
          value: 2
        },
        {
          label: "厅级",
          value: 3
        },
        {
          label: "终端",
          value: 4
        }
      ],
      //中央对象数组
      centerOptions: [
        {
          label: "全国",
          value: 5
        },
        {
          label: "省级",
          value: 1
        },
        {
          label: "市级",
          value: 2
        },

        {
          label: "厅级",
          value: 3
        },
        {
          label: "终端",
          value: 4
        }
      ],
      //按钮参数配置
      controlOptions: [
        {
          name: "导出",
          type: "primary",
          icon: "download",
          permission: "areaDeal-export"
        }
      ],
      insGrade: null,//机构等级
      //搜索请求参数
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        param: {
          queryType: null
        }
      },
      //接收表格数据数组
      tableData: [],
    };
  },
  methods: {
    //获取总计
    getSummaries(param) {
      var index = 1;
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
        if (value || value === 0) {
          sums[index] = value;
        } else {
          sums[index] = "-";
        }
      });
      return sums;
    },
    //点击表格的升降序
    sortChange(column) {
      //dealSortField 1:销售额;2:小奖中将;3:中奖中奖;4:大奖中奖;5:中奖合计;6:小奖兑奖;7:中将兑奖;8:大奖兑奖;9兑奖合计
      //ascOrDesc 0:升序;1:降序
      var dealSortField, ascOrDesc;
      if (column.prop == "saleAmount") {
        dealSortField = 1;
      } else if (column.prop == "smallWinAmount") {
        dealSortField = 2;
      } else if (column.prop == "middleWinAmount") {
        dealSortField = 3;
      } else if (column.prop == "bigWinAmount") {
        dealSortField = 4;
      } else if (column.prop == "winTotalAmount") {
        dealSortField = 5;
      } else if (column.prop == "smallCashAmount") {
        dealSortField = 6;
      } else if (column.prop == "middleCashAmount") {
        dealSortField = 7;
      } else if (column.prop == "bigCashAmount") {
        dealSortField = 8;
      } else if (column.prop == "cashTotalAmount") {
        dealSortField = 9;
      }
      if (column.order == "descending") {
        ascOrDesc = 1;
      } else if (column.order == "ascending") {
        ascOrDesc = 0;
      }
      this.listQuery.param.dealSortField = dealSortField;
      this.listQuery.param.ascOrDesc = ascOrDesc;
      this.getGameDeal(1);
    },
    //30s定时刷新(表格数据、销售厅、设备编码)
    timer() {
      this.timeName = setInterval(item => {
        this.getHallList()
        this.getTerminaList()
        this.getGameDeal();
      }, 30000);
    },
    //获取中央交易数据列表
    async getGameDeal(type) {
      const self = this;
      const res = await self.$api.getGameDeal({
        data: this.listQuery,
        closeLoading: type !== 1
      });
      if (res && res.code == 0) {
        if (res.data.dataList && res.data.dataList.length > 0) {
          //返回列表大于1条时显示合计
          this.showSum = res.data.dataList.length == 1 ? false : true;
          res.data.dataList.forEach(item => {
            if (item.cityName && item.cityName == item.provinceName) {
              item.cityName = "省直属";
            }
          });
          let data = res.data;
          // 需要把百分制金额 除于 100 的字段
          let moneyArray = [
            "saleAmount",
            "smallWinAmount",
            "middleWinAmount",
            "bigWinAmount",
            "winTotalAmount",
            ,
            "smallCashAmount",
            "middleCashAmount",
            "bigCashAmount",
            "cashTotalAmount"
          ];
          moneyArray.forEach(item => {
            data = self.toMoneyReal(data, item);
          });
          self.tableData = data.dataList;
          self.totalCount = data.totalRecord;
        } else {
          self.tableData = [];
          self.totalCount = 0;
        }
      }
    },
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
    //获取中央交易数据列表
    async getInsLevel(options) {
      const insId = this.$storage.get("userInfo").insId;
      const self = this;
      const res = await self.$api.getInsLevel({
        data: {
          insId
        }
      });
      if (res && res.code == 0) {
        this.insGrade = res.data.insGrade;
        var parentId = res.data.parentId;
        this.$refs.searchForm.form["area"] = [insId];
        if (this.insGrade == "中央") {
          this.listQuery.param.queryType = 5;
          this.searchOptions.forEach(item => {
            this.$refs.searchForm.form["dimension"] = 5;
          });
        } else if (this.insGrade == "省级") {
          this.listQuery.param.queryType = 1;
          this.$refs.searchForm.form["dimension"] = 1;
          this.searchOptions.forEach(item => {
            if (item.prop == "dimension") {
              item.options.splice(0, 1);
            }
          });
        } else {
          this.listQuery.param.queryType = 2;
          this.showCity = true;
          this.$refs.searchForm.form["dimension"] = 2;
          this.searchOptions.forEach(item => {
            if (item.prop == "dimension") {
              item.options.splice(0, 2);
            }
          });
        }
      }
    },
    //游戏下拉框改变事件
    getGame(val) {
      this.gameId = val;
    },
    //区域级联选择改变事件
    getInsId(val) {
      if (val) {
        this.$refs.searchForm.form["terminalId"] = "";
        this.$refs.searchForm.form["hallId"] = "";
        this.insId = val
          ? val[val.length - 1] == 0
            ? val[val.length - 2]
            : val[val.length - 1]
          : "";
        if (this.insGrade == "市级") {
          this.$refs.searchForm.form["dimension"] = 2;
        } else if (this.insGrade == "省级") {
          this.$refs.searchForm.form["dimension"] = 2;
          this.searchOptions.forEach(item => {
            if (item.prop == "dimension") {
              item.options = this.cityOptions;
            }
            if (item.prop == "hallId") {
              item.show = false;
            }
            if (item.prop == "terminalId") {
              item.show = false;
            }
          });
        } else {
          console.log(val);
          if (val.length == 2) {
            this.$refs.searchForm.form["dimension"] = 1;
            this.searchOptions.forEach(item => {
              if (item.prop == "dimension") {
                item.options = this.proviceOptions;
              }
              if (item.prop == "hallId") {
                item.show = false;
              }
              if (item.prop == "terminalId") {
                item.show = false;
              }
            });
          } else if (val.length == 3) {
            this.$refs.searchForm.form["dimension"] = 2;
            this.searchOptions.forEach(item => {
              if (item.prop == "hallId") {
                item.show = false;
              }
              if (item.prop == "dimension") {
                item.options = this.cityOptions;
              }
              if (item.prop == "terminalId") {
                item.show = false;
              }
            });
          } else {
            this.$refs.searchForm.form["dimension"] = 5;
            this.searchOptions.forEach(item => {
              if (item.prop == "hallId") {
                item.show = false;
              }
              if (item.prop == "dimension") {
                item.options = this.centerOptions;
              }
              if (item.prop == "terminalId") {
                item.show = false;
              }
            });
          }
        }
        this.getTerminaList()
        this.getHallList()
      }
    },
    //获取销售厅id
    getHallId(val) {
      this.hallId = val;
    },
    //获取设备id
    getTerminalId(val) {
      this.terminalId = val;
    },
    //查询方式选择:1游戏 2统计
    chooseDimension(val) {
      this.queryType = val;
      console.log(this.queryType);
      if (val === 1) {
        this.searchOptions.forEach(item => {
          if (item.prop == "game") {
            item.disabled = false;
            this.$refs.searchForm.form["game"] = 0;
          }
        });
      } else {
        this.$refs.searchForm.form["game"] = "";
        this.searchOptions.forEach(item => {
          if (item.prop == "game") {
            item.disabled = true;
          }
        });
      }
    },
    //查询方式改变事件
    changeDimension(val) {
      this.listQuery.param.queryType = val;
      if (val == 1 || val == 2) {
        this.$refs.searchForm.form["terminalId"] = "";
        this.$refs.searchForm.form["hallId"] = "";
        this.searchOptions.forEach(item => {
          if (item.prop == "hallId" || item.prop == "terminalId") {
            item.show = false;
          }
        });
      }
      if (val == 3) {
        this.$refs.searchForm["terminalId"] = "";
        this.searchOptions.forEach(item => {
          if (item.prop == "terminalId") {
            item.show = false;
          }
          if (item.prop == "hallId") {
            item.show = true;
          }
        });
      }
      if (val == 4) {
        this.searchOptions.forEach(item => {
          if (item.prop == "terminalId") {
            item.show = true;
          }
          if (item.prop == "hallId") {
            item.show = true;
          }
        });
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
      this.getGameDeal(1);
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum = currentPage;
      this.getGameDeal(1);
    },
    //获取游戏下拉框列表
    async getGameLists(options) {
      const self = this;
      const res = await self.$api.getGameLists();
      if (res && res.code == 0 && res.data.length > 0) {
        res.data.unshift({
          gameId: 0,
          gameName: "全部"
        });
        this.searchOptions.forEach(item => {
          if (item.prop === "game") {
            res.data.forEach(item => {
              item.value = item.gameId;
              item.label = item.gameName;
            });
            item.options = res.data;
          }
        });
      }
    },
    //获取销售厅下拉框列表
    async getHallList(options) {
      var insId = this.$storage.get("userInfo").insId;
      const self = this;
      const res = await self.$api.getHallList({
        data: {
          hallType: 0,
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
    //获取设备下拉框列表
    async getTerminaList(options) {
      const self = this;
      var insId = this.$storage.get("userInfo").insId;
      const res = await self.$api.getHallList({
        data: {
          hallType: 0,
          scopeType: 1,
          insId: this.insId ? this.insId : insId
        }
      });
      if (res && res.code == 0) {
        this.searchOptions.forEach((item, index) => {
          if (item.prop === "terminalId") {
            res.data.forEach(item => {
              item.value = item.terminalId;
              item.label = item.terminalNo;
            });
            item.options = res.data;
          }
        });
      }
    },
    //点击查询
    search(form) {
      if (!form.dimension) {
        if (this.insGrade == "中央") {
          form.dimension = 1;
        } else if (this.insGrade == "省级") {
          form.dimension = 2;
        } else {
          form.dimension = 3;
        }
      }
      console.log(form);
      this.listQuery.pageNum = 1;
      if (form.game || form.game == 0) {
        this.showGame = true;
      } else {
        this.showGame = false;
      }
      //根据维度显示对应的列
      if (form.dimension == 1 || form.dimension == 5) {
        this.showCity = false;
        this.showHall = false;
        this.showTerminal = false;
      }
      if (form.dimension == 2) {
        this.showCity = true;
        this.showHall = false;
        this.showTerminal = false;
      }
      if (form.dimension == 3) {
        this.showCity = true;
        this.showHall = true;
        this.showTerminal = false;
      }
      if (form.dimension == 4) {
        this.showCity = true;
        this.showHall = true;
        this.showTerminal = true;
      }

      if (form.selectType) {
        if (form.selectType === 1) {
          var gameId = form.game;
        }
      }
      this.listQuery.param = {
        insId: form.area
          ? form.area[form.area.length - 1] == 0
            ? form.area[form.area.length - 2]
            : form.area[form.area.length - 1]
          : "",
        hallId: form.hallId,
        gameId: gameId,
        terminalId: form.terminalId,
        queryType: form.dimension
      };
      this.dealSum();
      this.getGameDeal(1);
    },
    //导出
    async exportExcel() {
      const res = await this.$api.dealExport({
        data: {
          param: {
            exportStatus: 1,
            queryType: this.queryType,
            gameId: this.gameId,
            hallId: this.hallId,
            insId: this.insId,
            terminalId: this.terminalId,
            exportType: this.listQuery.param.queryType
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
      aLink.setAttribute("download", "交易数据信息.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    },
    
    selectBtn(val) {
      if (val.name === "导出") {
        this.exportExcel(this);
      }
    },
    //总计金额相关字段/100
    async dealSum() {
      let res = await this.$api.dealSum({
        data: this.listQuery
      });
      if (res && res.code == 0) {
        let data = res;
        // 需要把百分制金额 除于 100 的字段
        let moneyArray = [
          "saleAmount",
          "smallWinAmount",
          "middleWinAmount",
          "bigWinAmount",
          "winTotalAmount",
          ,
          "smallCashAmount",
          "middleCashAmount",
          "bigCashAmount",
          "cashTotalAmount"
        ];
        moneyArray.forEach(item => {
          data = this.toMoneyReal(data, item);
        });
        this.sumList = data.data;
      }
    }
  },
  mounted() {
    this.queryInsTree();
    this.getGameLists();
    this.getHallList();
    this.getTerminaList();
    this.getInsLevel().then(item => {
      this.dealSum();
      this.getGameDeal(1);
    });
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


