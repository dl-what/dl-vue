<template>
  <div class="vlt-card">
    <div class="tabs-content">
      <h3>出入库管理</h3>
      <el-tabs
        tab-position="left"
        style="height: auto;"
        @tab-click="sideTab"
        v-model="activeName"
      >
        <el-tab-pane
          :label="supItem.label"
          :name="supItem.name"
          v-for="(supItem, supIndex) in tabConfigs"
          :key="supIndex"
        >
          <div v-for="(childItem,index) in supItem.tabConfigs" :key="index">
            <search-bar
              @search="putSearch"
              :options="supItem.options"
              :total="childItem.totalCount"
              labelWidth="80px"
              v-show="supItem.activeName === childItem.name"
            >
              <control-bar
                :options="controlOptions"
                position="left"
                @select="selectBtn"
                v-show="supItem.activeName === childItem.name"
              ></control-bar>
            </search-bar>
            
          </div>
          <el-tabs
            @tab-click="puthandleClick"
            class="tables-content"
            v-model="supItem.activeName"
            :data-sup-active-index="supIndex"
          >
            <el-tab-pane
              :label="childItem.label"
              :name="childItem.name"
              v-for="childItem in supItem.tabConfigs"
              :key="childItem.name"
            >
              <el-table :data="childItem.tableData" border style="width: 100%">
                <el-table-column prop="id" label="序号" type="index">
                  <template slot-scope="scope">
                    {{childItem.pageSize * (childItem.currentPage - 1) + (scope.$index + 1)}}
                  </template>
                </el-table-column>
                <el-table-column prop="documentNumber" label="单据编号"></el-table-column>
                <el-table-column prop="documentToppic" label="申请标题"></el-table-column>
                <el-table-column prop="oplTypeName" label="操作类型"></el-table-column>
                <el-table-column
                  prop="createTime"
                  label="申请时间"
                  v-if="childItem.label == '待入库' || childItem.label == '待出库'"
                ></el-table-column>
                <el-table-column
                  prop="userName"
                  label="申请人员"
                  v-if="childItem.label == '待入库' || childItem.label == '待出库'"
                ></el-table-column>
                <el-table-column
                  prop="entryWarehouseTime"
                  label="入库时间"
                  v-if="childItem.label == '已入库'"
                ></el-table-column>
                <el-table-column
                  prop="entryWarehouseByName"
                  label="入库人员"
                  v-if="childItem.label == '已入库'"
                ></el-table-column>
                <el-table-column
                  prop="outWarehouseTime"
                  label="出库时间"
                  v-if="childItem.label == '已出库'"
                ></el-table-column>
                <el-table-column prop="outWarehouseByName" label="出库人员" v-if="childItem.label == '已出库'"></el-table-column>
                <el-table-column prop="remark" label="说明"></el-table-column>
                <el-table-column label="操作" min-width="140px">
                  <template slot-scope="scope">
                    <el-button
                      @click="putStore(scope.row)"
                      type="primary"
                      v-prevent="2000"
                      size="mini"
                      v-if="childItem.label == '待入库'"
                    >入库</el-button>
                    <el-button
                      @click="outStore(scope.row)"
                      type="primary"
                      v-prevent="2000"
                      size="mini"
                      v-if="childItem.label == '待出库'"
                    >出库</el-button>
                    <el-button
                      @click="alreadyPutDetail(scope.row)"
                      type="primary"
                      v-prevent="2000"
                      size="mini"
                      v-if="childItem.label == '已入库'"
                    >查看</el-button>
                    <el-button
                      @click="alreadyOutDetail(scope.row)"
                      type="primary"
                      v-prevent="2000"
                      size="mini"
                      v-if="childItem.label == '已出库'"
                    >查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <table-paging
                position="right"
                :total="childItem.totalCount"
                :currentPage="childItem.currentPage"
                :pageSize="childItem.pageSize"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"
              ></table-paging>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
export default {
  name: "outPutManage",
  data() {
    return {
      activeName: "put",
      tabConfigs: [
        {
          label: "入库管理",
          name: "put",
          activeName: "waiting",
          options: [
            {
              title: "单据编号",
              type: "input",
              prop: "documentNumber",
              value: ""
            },
            {
              title: "申请标题",
              type: "input",
              prop: "documentToppic",
              value: ""
            }
          ],
          tabConfigs: [
            {
              label: "待入库",
              name: "waiting",
              statusCode: 2,
              tableData: [],
              totalCount: 0,
              currentPage: 1,
              pageSize: 20
            },
            {
              label: "已入库",
              name: "already",
              statusCode: 3,
              tableData: [],
              totalCount: 0,
              currentPage: 1,
              pageSize: 20
            }
          ]
        },
        {
          label: "出库管理",
          name: "out",
          activeName: "waiting",
          options: [
            {
              title: "单据编号",
              type: "input",
              prop: "documentNumber",
              value: ""
            },
            {
              title: "申请标题",
              type: "input",
              prop: "documentToppic",
              value: ""
            }
          ],
          tabConfigs: [
            {
              label: "待出库",
              name: "waiting",
              statusCode: 1,
              tableData: [],
              totalCount: 0,
              currentPage: 1,
              pageSize: 20
            },
            {
              label: "已出库",
              name: "already",
              statusCode: 2,
              tableData: [],
              totalCount: 0,
              currentPage: 1,
              pageSize: 20
            }
          ]
        }
      ],

      controlOptions: [
        { name: "打印", type: "primary", icon: "printer" },
        { name: "导出", type: "", icon: "s-promotion" },
        
      ],
      requestData: {
        page: 1,
        pageSize: 20,
        param: {
          all: false,
          documentNumber: "",
          documentToppic: "",
          status: 1
        }
      }
      // state:{
      //   1: '待出库',
      //   2: '已出库,待入库',
      //   3: "已入库"
      // }
    };
  },
  components: {},
  created() {
    this.puthandleClick({
      supActiveIndex: 0,
      index: 0
    });
  },
  methods: {
    async getOutPutList(data) {
      console.log(data);
      Object.assign(this.requestData, data);
      const param = data.param || {};
        this.currentSearchParam = {
          ...param,
          status: this.currentTab.statusCode
        };
      console.log(this.currentSearchParam);
      let res = await this.$api.getOutPutList({
        data: {
          ...this.requestData,
          param: this.currentSearchParam
        }
      });
      if (res && res.code == 0) {
        this.currentTab.totalCount = res.data.total;
        this.currentTab.tableData = res.data.records;
        console.log('列表数据',res)
      }
    },
    puthandleClick(tab) {
      console.log(tab)
      const supActiveIndex =
        "supActiveIndex" in tab
          ? tab.supActiveIndex
          : tab.$parent.$el.dataset.supActiveIndex;
      const currentTab = this.tabConfigs[supActiveIndex].tabConfigs[tab.index];
      console.log("当前tab",currentTab)
      this.currentTab = currentTab;
      this.getOutPutList({
        page: currentTab.currentPage,
        pageSize: currentTab.pageSize,
        param: this.requestData.param
      });
    },
    sideTab(tab) {
      this.puthandleClick({
        supActiveIndex: tab.index,
        index: 0
      });
    },
    // 出入库搜索
    putSearch(form) {
      this.requestData.page = 1;
      this.getOutPutList({
        param: form
      });
      this.currentTab.currentPage = 1;
      // this.currentTab.pageSize = 20;
      console.log("search", form);
    },
    handleCurrentChange(currentPage) {
      console.log(currentPage);
      this.getOutPutList({
        page: currentPage,
        pageSize: this.currentTab.pageSize,
        param: this.requestData.param
      });
      this.currentTab.currentPage = currentPage;
    },
    handleSizeChange(pageSize) {
      this.getOutPutList({
        pageSize: pageSize,
        param: this.requestData.param
      });
      this.currentTab.pageSize = pageSize;
      console.log(pageSize);
    },

    changeForm(val) {
      Object.assign(this.params, val);
      console.log("派发出来的参数", this.params);
    },
    selectBtn(val) {
      if (val.name === "导出") {
        this.getOut();
      }
    },
    //
    async getOut() {
      const requestData = JSON.parse(JSON.stringify(this.requestData));
      const param = requestData.param || {};
      //删除param
      //delete requestData.param;
      let result = await this.$api.outExport({
        data: {
          ...requestData,
          param: this.currentSearchParam
        },
        responseType: "blob"
      });
      var blob = new Blob([result], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "入库管理数据.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(result);
      //console.log("res", result);
    },
    //入库跳转
    putStore(row) {
      this.$router.push({
        path: "putStore",
        query: {
          documentNumber: row.documentNumber,
          oplType: 1
        }
      });
    },
    //出库跳转
    outStore(row) {
      this.$router.push({
        path: "outStore",
        query: {
          documentNumber: row.documentNumber,
          oplType: 0
        }
      });
    },
    //  入库详情
    alreadyPutDetail(row) {
      this.$router.push({
        path: "alreadyPutDetail",
        query: {
          documentNumber: row.documentNumber,
          oplType: 1
        }
      });
    },
    //出库详情
    alreadyOutDetail(row) {
      this.$router.push({
        path: "alreadyOutDetail",
        query: {
          documentNumber: row.documentNumber,
          oplType: 0
        }
      });
    }
  }
};
</script>
<style lang="less">
h3 {
  margin-bottom: 20px;
}
.tabs-content {
  padding: 16px 30px;
  .el-tabs__nav {
    margin-right: 100px;
  }
  .el-tabs__item.is-active {
    background: rgb(230, 247, 255);
  }
  .el-tabs--left .el-tabs__active-bar.is-left,
  .el-tabs--left .el-tabs__nav-wrap.is-left::after {
    left: 194px;
    margin-right: 10px;
  }
  .el-tabs--left .el-tabs__nav-wrap.is-left {
    margin-right: -60px;
  }
  .el-tabs__item {
    padding: 0 70px;
  }
  .tables-content .el-tabs__item.is-active {
    background: none;
  }
}
</style>
