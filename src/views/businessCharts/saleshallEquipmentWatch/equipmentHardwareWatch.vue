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
        ref="searchForm"
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
        @cell-click="clicks"
      >
        <el-table-column align="center" label="序号" width="65">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.$index+1}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="terminalNo" min-width="100" label="设备编码"></el-table-column>
        <el-table-column align="center" prop="goodsType" min-width="100" label="设备类型">
          <template slot-scope="scope">
            <div v-if="scope.row.goodsType===1">终端机</div>
            <div v-if="scope.row.goodsType===2">柜员机</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="hallName" min-width="100" label="销售厅"></el-table-column>
        <el-table-column align="center" prop="cityName" label="城市"></el-table-column>
        <el-table-column align="center" prop="provinceName" label="省份"></el-table-column>
        <el-table-column align="center" prop="disk" label="磁盘">
          <template slot-scope="scope">
            <span>{{scope.row.disk}}%</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="cpu" label="CPU">
          <template slot-scope="scope">
            <span v-if="scope.row.cpu>0">{{scope.row.cpu}}%</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="memory" label="系统内存">
          <template slot-scope="scope">
            <span>{{scope.row.memory}}%</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="terminalStatus" label="设备状态">
          <template slot-scope="scope">
            <span v-if="scope.row.terminalStatus === 1">在线</span>
            <span v-if="scope.row.terminalStatus === 0">离线</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="peripheralStatus"
          label="外设状态"
          class-name="peripheralStatus"
          fit
        >
          <template slot-scope="scope">
            <span v-if="scope.row.terminalStatus===1">
              <el-button
                class="peripheralStatus"
                size="mini"
                v-if="scope.row.peripheralStatus === 1"
              >正常</el-button>
              <el-button
                class="unusualStatus"
                size="mini"
                v-if="scope.row.peripheralStatus === 0"
              >异常</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="外设状态" :visible.sync="dialogTableVisibleZDJ" :close-on-click-modal="false">
        <el-table :data="gridData">
          <el-table-column property="terminalNo" label="设备编码"></el-table-column>

          <el-table-column property="cardReaderStatus" label="读卡器">
            <template slot-scope="scope">
              <span v-if="scope.row.cardReaderStatus===1">正常</span>
              <span v-else-if="scope.row.cardReaderStatus===0">异常</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column property="gpsStatus" label="GPS">
            <template slot-scope="scope">
              <span v-if="scope.row.gpsStatus===1">正常</span>
              <span v-else-if="scope.row.gpsStatus===0">异常</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column property="lampControlStatus" label="灯控">
            <template slot-scope="scope">
              <span v-if="scope.row.lampControlStatus===1">正常</span>
              <span v-else-if="scope.row.lampControlStatus===0">异常</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column property="entranceGuardStatus" label="门禁">
            <template slot-scope="scope">
              <span v-if="scope.row.entranceGuardStatus===1">正常</span>
              <span v-else-if="scope.row.entranceGuardStatus===0">异常</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column property="scanModuleStatus" label="扫描模块">
            <template slot-scope="scope">
              <span v-if="scope.row.scanModuleStatus===1">正常</span>
              <span v-else-if="scope.row.scanModuleStatus===0">异常</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column property="codeKeyboardStatus" label="密码键盘">
            <template slot-scope="scope">
              <span v-if="scope.row.codeKeyboardStatus===1">正常</span>
              <span v-else-if="scope.row.codeKeyboardStatus===0">异常</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="外设状态" :visible.sync="dialogTableVisibleGYJ" :close-on-click-modal="false">
        <el-table :data="gridData">
          <el-table-column property="terminalNo" label="设备编码"></el-table-column>

          <el-table-column property="cardReaderStatus" label="读卡器">
            <template slot-scope="scope">
              <span v-if="scope.row.cardReaderStatus===1">正常</span>
              <span v-else-if="scope.row.cardReaderStatus===0">异常</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column property="keyboardStatus" label="键盘">
            <template slot-scope="scope">
              <span v-if="scope.row.keyboardStatus===1">正常</span>
              <span v-else-if="scope.row.keyboardStatus===0">异常</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column property="scanModuleStatus" label="扫描模块">
            <template slot-scope="scope">
              <span v-if="scope.row.scanModuleStatus===1">正常</span>
              <span v-else-if="scope.row.scanModuleStatus===0">异常</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column property="idCardReaderStatus" label="身份证读卡器">
            <template slot-scope="scope">
              <span v-if="scope.row.idCardReaderStatus===1">正常</span>
              <span v-else-if="scope.row.idCardReaderStatus===0">异常</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column property="printerStatus" label="打印机">
            <template slot-scope="scope">
              <span v-if="scope.row.printerStatus===1">正常</span>
              <span v-else-if="scope.row.printerStatus===0">异常</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column property="codeKeyboardStatus" label="密码键盘">
            <template slot-scope="scope">
              <span v-if="scope.row.codeKeyboardStatus===1">正常</span>
              <span v-else-if="scope.row.codeKeyboardStatus===0">异常</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
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
      timeName: null, //定时器
      gridData: [], //外设状态对象
      dialogTableVisibleZDJ: false, //弹出终端机外设表格
      dialogTableVisibleGYJ: false, //显示柜员机外设表格
      totalCount: 0, //表格总条数
      insId: null, //机构id
      hallId: null, //销售厅id
      terminalStatus: null, //设备状态
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
          prop: "hallId",
          value: "",
          title: "销售厅",
          placeholder: "请选择销售厅",
          options: [],
          change(val) {
            self.getHallId(val);
          }
        },
        {
          type: "select",
          prop: "terminalId",
          value: "",
          title: "设备编码",
          placeholder: "请选择",
          options: []
        },
        {
          type: "select",
          prop: "goodsType",
          value: "",
          title: "设备类型",
          placeholder: "请选择",
          options: [
            {
              value: 1,
              label: "终端机"
            },
            {
              value: 2,
              label: "柜员机"
            }
          ]
        },
        {
          type: "select",
          prop: "terminalStatus",
          value: "",
          title: "设备状态",
          placeholder: "请选择销售厅",
          options: [
            {
              value: 1,
              label: "在线"
            },
            {
              value: 0,
              label: "离线"
            }
          ],
          change(val) {
            self.getTerminalStatus(val);
          }
        }
      ],
      //按钮参数配置
      controlOptions: [
        {
          name: "导出",
          type: "primary",
          icon: "download",
          permission: "equipmentHardwareWatch-export"
        }
      ],
      //搜索请求参数
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        param: {}
      },
      //接收表格数据数组
      tableData: [],
    };
  },
  methods: {
    //获取销售厅id
    getHallId(val) {
      this.hallId = val;
    },
    //获取设备状态
    getTerminalStatus(val) {
      this.terminalStatus = val;
    },
    //获取区域id
    getInsId(val) {
      this.insId = val
        ? val[val.length - 1] == 0
          ? val[val.length - 2]
          : val[val.length - 1]
        : "";
      this.getHallList();
      this.getTerminaList();
    },
    //表格点击事件
    clicks(row, column, cell, event) {
      if (row.terminalStatus === 0) return;
      this.gridData = [];
      if (column.label == "外设状态") {
        if (row.goodsType === 1) {
          this.dialogTableVisibleZDJ = true;
        } else if (row.goodsType === 2) {
          this.dialogTableVisibleGYJ = true;
        }

        this.gridData.push(row.allPeripheralStatus);
      }
    },
    //销售厅设备硬件信息列表
    async getHallEqHardware(type) {
      const self = this;
      const res = await self.$api.getHallEqHardware({
        data: this.listQuery,
        closeLoading: type !== 1
      });
      if (res && res.code == 0) {
        if (res.data.dataList) {
          res.data.dataList.forEach(v => {
            if (v.allPeripheralStatus) {
              for (var item in v.allPeripheralStatus) {
                if (v.allPeripheralStatus[item] == 0) {
                  v.peripheralStatus = 0;
                  break;
                }
              }
            }
            if (v.cityName && v.cityName == v.provinceName) {
              v.cityName = "省直属";
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
      this.getHallEqHardware(1);
    },
    //页码改变事件
    pageCurrentChange(currentPage) {
      this.listQuery.pageNum = currentPage;
      this.getHallEqHardware(1);
    },
    //导出
    async exportExcel() {
      const res = await this.$api.hallExport({
        data: {
          param: {
            hallId: this.hallId,
            exportType: 3,
            exportStatus: 1,
            insId: this.insId,
            terminalStatus: this.terminalStatus
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
      aLink.setAttribute("download", "销售厅设备硬件信息.xls");
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
    //查询
    search(form) {
      this.listQuery.pageNum = 1;
      this.listQuery.param = {
        insId: form.area
          ? form.area[form.area.length - 1] == 0
            ? form.area[form.area.length - 2]
            : form.area[form.area.length - 1]
          : "",
        hallId: form.hallId,
        terminalId: form.terminalId,
        terminalStatus: form.terminalStatus,
        goodsType: form.goodsType
      };
      this.getHallEqHardware(1);
    },
    //递归绑定机构名称
    async queryInsTree() {
      let res = await this.$api.queryInsTree();
      if (res && res.code == 0) {
        this.setLabelAndValue(res.data);
      }
    },
    //获取设备下拉框列表
    async getTerminaList() {
      var insId = this.$storage.get("userInfo").insId;
      const self = this;
      const res = await self.$api.getHallList({
        data: {
          hallType: 3,
          scopeType: 1,
          insId: this.insId ? this.insId : insId
        }
      });
      if (res && res.code == 0) {
        this.searchOptions.forEach((v, index) => {
          if (v.prop === "terminalId") {
            res.data.forEach(v => {
              v.value = v.terminalId;
              v.label = v.terminalNo;
            });
            v.options = res.data;
          }
        });
      }
    },
    setLabelAndValue(area) {
      area.forEach(v => {
        if (v.children) {
          this.setLabelAndValue(v.children);
        }
      });
      this.searchOptions.forEach(v => {
        if (v.type === "cascader") {
          v.options = area;
        }
      });
    },
    //获取销售厅下拉框列表
    async getHallList() {
      const self = this;
      var insId = this.$storage.get("userInfo").insId;
      const res = await self.$api.getHallList({
        data: {
          hallType: 3,
          scopeType: 0,
          insId: this.insId ? this.insId : insId
        }
      });
      if (res && res.code == 0) {
        this.searchOptions.forEach((v, index) => {
          if (v.prop === "hallId") {
            res.data.forEach(v => {
              v.value = v.hallId;
              v.label = v.hallName;
            });
            v.options = res.data;
          }
        });
      }
    },
    //30s定时刷新(表格数据、销售厅、设备编码)
    timer() {
      this.timeName = setInterval(v => {
        this.getHallList();
        this.getTerminaList();
        this.getHallEqHardware();
      }, 30000);
    }
  },

  mounted() {
    this.getHallList();
    this.getHallEqHardware(1);
    this.queryInsTree();
    this.timer();
    this.getTerminaList();
  },
  created() {},
  beforeDestroy() {
    //销毁定时器
    clearInterval(this.timeName);
    this.timeName = null;
  }
};
</script>

<style  lang="less" scoped>
.main-body .el-table {
  /deep/ .peripheralStatus {
    color: blue;
    cursor: pointer;
  }
}
.unusualStatus {
  color: red;
  cursor: pointer;
}
/deep/ .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
/deep/ .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
/deep/.el-table td,
.el-table th {
  padding: 8px 0;
}
</style>
