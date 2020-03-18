<template>
<!-- 入库管理 -->
<div class="vlt-card">
  <div class="content-block">
    <search-bar class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em">
      <control-bar slot="extend-bar" @select="select" :options="controlOptions"></control-bar>
    </search-bar>
    <el-tabs @tab-click="puthandleClick" v-model="activeName" class="tables-content">
      <el-tab-pane
        :label="childItem.label"
        :name="childItem.name"
        v-for="childItem in tabConfigs"
        :key="childItem.name"
      >
        <el-table ref="print" :data="childItem.tableData" border style="width: 100%">
          <el-table-column prop="id" label="序号" type="index" fixed width="55px">
            <template slot-scope="scope">
              {{childItem.pageSize * (childItem.currentPage - 1) + (scope.$index + 1)}}
            </template>
          </el-table-column>
          <el-table-column prop="documentNumber" label="单据编号" min-width="210px"></el-table-column>
          <el-table-column prop="documentToppic" label="申请标题" min-width="180px"></el-table-column>
          <el-table-column
            prop="userName"
            label="申请人员"
            min-width="120px"
            v-if="childItem.label == '待入库'"
          ></el-table-column>
          <el-table-column
            prop="entryWarehouseByName"
            label="入库人员"
            min-width="120px"
            v-if="childItem.label == '已入库'"
          ></el-table-column>
          <el-table-column prop="oplTypeName" label="操作类型" min-width="120px"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="160px" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="entryWarehouseTime"
            label="入库时间"
            min-width="160px"
            v-if="childItem.label == '已入库'"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="申请时间"
            v-if="childItem.label == '待入库'"
            min-width="160px"
          ></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100px">
            <template slot-scope="scope">
              <el-button :id="'putStoreManage-put' + scope.$index" @click="putStore(scope.row)" type="primary" v-has="'putStoreManage-putStore'" size="mini" v-if="childItem.label == '待入库'">入库</el-button>
              <el-button :id="'putStoreManage-detail' + scope.$index" @click="alreadyPutDetail(scope.row)" type="primary" v-prevent="2000" size="mini" v-if="childItem.label == '已入库'">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <table-paging
          position="right"
          :total="total"
          :currentPage="childItem.currentPage"
          :pageSize="childItem.pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></table-paging>
      </el-tab-pane>
    </el-tabs>
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
name: "putStoreManage",
data() {
return {
  activeName: 'waiting',
  searchOptions: [
    { title: "单据编号", type: "input", prop: "documentNumber", value: "" },
    { title: "申请标题", type: "input", prop: "documentToppic", value: "" }
  ],
  controlOptions: [
    { name: "打印", type: "primary", icon: "printer", permission: 'putStoreManage-print'},
    { name: "导出当前", type: "", icon: "s-promotion", permission: 'putStoreManage-exportCurrent'},
    { name: "导出全部", type: "", icon: "s-promotion", permission: 'putStoreManage-exportAll'},
  ],
  tabConfigs: [
    { label: "待入库", name: "waiting", statusCode: 2, tableData: [], totalCount: 0, currentPage: 1, pageSize: 20 },
    { label: "已入库", name: "already", statusCode: 3, tableData: [], totalCount: 0, currentPage: 1, pageSize: 20 }
  ],
  requestData: {
    page: 1,
    pageSize: 20,
    param: {
      // all: false,
      documentNumber: "",
      documentToppic: "",
      status: 1
    }
  },
  isPrint: false,
  printNormalData: {
    title: '入库管理列表',
    params: {
      page: 1,
      pageSize: 20
    },
    props: [
      {prop: 'index', label:'序号', width: "5%"},
      {prop: 'documentNumber', label:'单据编号', width: "10%"},
      {prop: 'documentToppic', label:'申请标题', width: "10%"},
      {prop:'userName', label:'申请人员', width: "9%"}, // 1
      {prop:'entryWarehouseByName', label:'入库人员', width: "10%"}, // 2
      {prop:'oplTypeName', label:'操作类型', width: "10%"},
      {prop:'remark', label:'备注', width: "20%"},
      {prop:'createTime', label:'申请时间', width: "10%"}, // 1
      {prop:'entryWarehouseTime', label:'入库时间', width: "16%"},  // 2
      
    ],
    tableData: [],
  },
  printData: {},
  total: 0,
  index: 0,
}
},
created() {
  this.puthandleClick({index: 0})
},
methods: {
  async getOutPutList(data) {
    console.log(data);
    Object.assign(this.requestData, data);
    const param = data.param || {};
      this.currentSearchParam = {
        ...param,
        status: this.currentTab.statusCode,
        operate: 2
      };
    console.log(this.currentSearchParam);
    let res = await this.$api.getOutPutList({
      data: {
        ...this.requestData,
        param: this.currentSearchParam
      }
    });
    if (res && res.code == 0) {
      this.total = res.data.total;
      this.currentTab.tableData = res.data.records;
      console.log('列表数据',res)

      console.log(this.currentSearchParam.status );
      // 打印数据
      this.printData = JSON.parse(JSON.stringify(this.printNormalData));
      if (this.currentSearchParam.status == 2) {
        this.printData.props = this.printNormalData.props.filter ( (item, index)  => {
          return item.prop != 'entryWarehouseByName' && item.prop != 'entryWarehouseTime';
        })
      } else if (this.currentSearchParam.status == 3) {
        this.printData.props = this.printNormalData.props.filter ( (item, index)  => {
          return item.prop !== 'userName' && item.prop !== 'createTime';
        })
      }
      // console.log(this.printData.props);
      this.printData.tableData = res.data.records;
    }
  },
  search(form) {
    this.requestData.page = 1;
    this.getOutPutList({
      param: form
    });
    this.currentTab.currentPage = 1;
    // this.currentTab.pageSize = 20;
    console.log("search", form);
  },
  puthandleClick(tab) {
    console.log(tab)
    this.index = tab.index
    const currentTab = this.tabConfigs[tab.index];
    console.log("当前tab",currentTab)
    this.currentTab = currentTab;
    this.getOutPutList({
      page: currentTab.currentPage,
      pageSize: currentTab.pageSize,
      param: this.requestData.param
    });
  },
  select(val) {
    if (val.name == "导出当前") {
        this.getOut(false);
    };
    if (val.name == "导出全部") {
      console.log(val.name)
        this.getOut(true);
    };   
    if (val.name == "打印") {
      // this.$print(this.$refs.print[this.index])
      this.isPrint = true;
      this.printData.params.page = this.requestData.page;
      this.printData.params.pageSize = this.requestData.pageSize;
    }
  },
  // 导出
  async getOut(isAll) {
    let data = {
      page: this.requestData.page,
      pageSize: this.requestData.pageSize,
      param: {
        all: isAll,
        ...this.currentSearchParam
      }
    };
    let result = await this.$api.outExport({
      data,
      responseType: "blob"
    });
    var blob = new Blob([result.blob], {
      type: "application/vnd.ms-excel;charset=utf-8"
    });
    var url = window.URL.createObjectURL(blob);
    var aLink = document.createElement("a");
    aLink.style.display = "none";
    aLink.href = url;
    aLink.setAttribute("download", data.param.status == 2 ? "待入库管理数据.xls" : "已入库管理数据.xls");
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
    console.log(result);
    //console.log("res", result);
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
    this.requestData.page = 1;
    this.getOutPutList({
      pageSize: pageSize,
      param: this.requestData.param
    });
    this.currentTab.currentPage = 1;
    this.currentTab.pageSize = pageSize;
    console.log(pageSize);
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
},
}
</script>

<style lang="less" scoped>
</style>

