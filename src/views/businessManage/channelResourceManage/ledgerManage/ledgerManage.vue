<template>
<div class="vlt-card">
  <!-- 台账管理 -->
  <div class="content-block">
    <!-- <search @search="search" :total="visiableTotal" labelWidth="80px">
      <control-bar  slot="extend-bar" :options="controlOptions" @select="selectBtn" position="left"></control-bar>
    </search> -->
    <search-bar
        ref="searchForm"
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="total"
        labelWidth="6em"
        @change="changeSearch"
        @searchReset="reset"
      >
      <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions"></control-bar>
    </search-bar>
    <el-table ref="print" :data="tableData" border>
        <el-table-column fixed label="序号"  type="index" width="60px">
          <template slot-scope="scope">
            {{params.pageSize*(params.page-1)+(scope.$index+1)}}
          </template>
        </el-table-column>
        <el-table-column label="仓库名称" prop="warName" min-width="120px"></el-table-column>
        <el-table-column label="仓库类型" prop="warType">
          <template slot-scope="scope">
            {{getWarType(scope.row.warType)}}
          </template>
        </el-table-column>
        <el-table-column label="物品名称" prop="goodsName"></el-table-column>
        <el-table-column label="物品型号" prop="deviceModel" min-width="100px"></el-table-column>
        <el-table-column label="库存数量" prop="reserve"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="100px">
          <template slot-scope="scope">
            <el-button :id="'ledgerManage-detail' + scope.$index" size="mini" type="primary" v-has="'ledgerManage-detail'" @click="toDetailLedger(scope.row)">台账明细</el-button>
          </template>
        </el-table-column>
    </el-table>
  </div>
  <table-paging position="right" :total="total" :currentPage="params.page" :pageSize="params.pageSize" 
  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
  </table-paging>
  <el-dialog
    title="打印预览"
    :visible.sync="isPrint"
    class="print-fullscreen"
    :fullscreen="true">
    <print :data="printData" @cancel="isPrint=false"></print>
  </el-dialog>
</div>
</template>

<script type="text/javascript">
import search from "./components/searchs";
export default {
name: "ledgerManage",
components: {search},
data() {
return {
  searchOptions: [
    {title: "仓库名称", type: "input", value: "", prop: 'warName'},
    {title: "仓库类型", type: "select", value: "", prop: 'warType',options:[{label:'中彩仓库',value: 1},{label:'省中心仓库',value: 2},{label:'地市仓库',value: 3},{label:'销售大厅',value: 4}]},
    {title: "物品类型", type: "select", value: "", prop: 'goodsType', options: [{label:'设备',value:1},{label:'配件',value:2},{label:'耗材',value: 3},{label:'设施',value:4}]},
    {title: "物品名称", type: "select", value: "", prop: 'goodsName', options: []},
    {title: "物品型号", type: "select", value: "", prop: 'deviceModel', options: []},
  ],
  controlOptions: [
      { name: "打印", type: "primary", icon: "printer", permission: 'ledgerManage-print'},
      { name: "导出当前", type: "", icon: "s-promotion", permission: 'ledgerManage-exportCurrent'},
      { name: "导出全部", type: "", icon: "s-promotion", permission: 'ledgerManage-exportAll'}
    ],
  tableData:[],
  params: {
    page: 1,
    pageSize: 20,
    param:{}
  },
  total:0,
  requestData:{},
  resourceDatas: [],
  optionsName: [],
  optionsModel: [],
  startGoodsId: null,
  startgoodsType: null,
  isPrint: false,
  printData: {
    title: '台账管理',
    params: {
      page: 1,
      pageSize: 20
    },
    props: [
      {prop: 'index', label:'序号', width: ""},
      {prop: 'warName', label:'仓库名称', width: ""},
      {prop: 'warType', label:'仓库类型', width: ""},
      {prop: 'goodsName', label:'物品名称', width: ""},
      {prop:'deviceModel', label:'物品型号', width: ""},
      {prop:'reserve', label:'库存数量', width: ""},
    ],
    tableData: [],
  },
}
},
created(){
  this.getLedgerList(this.params)
},
methods: {
  getLedgerList(data) {
    const self = this;
    (async data =>{
      let res = await self.$api.terraceAccountPage({ data })
      console.log(res)
      if (res && res.code == 0) {
        self.total = res.data.total;
        self.tableData = res.data.records;
        self.printData.tableData = JSON.parse(JSON.stringify(res.data.records));
        self.printData.tableData.forEach(item => {
          item.warType = item.warType ?  this.getWarType(item.warType) : '';
        })
      }
    })(data)
  },
  getWarType(val) {
    let options = {
      1: "中彩仓库",
      2: "省中心仓库",
      3: "地市仓库",
      4: "销售大厅"
    }
    return options[val]
  },
  search(val) {
    this.params.page = 1;
    this.params.param = {...val}
    this.getLedgerList(this.params)
    console.log(this.params);
  },
  // 根据资源类型获取资源名称
  getModelTrees(data) {
    const self = this;
    // 重置后面下拉框的数据 清空 
    self.optionsModel =[];
    self.optionsName = [];
    (async (data)=>{
      let res = await self.$api.getModelTrees({data})
      if(res && res.code == 0) {
        this.resourceDatas = res.data;
        res.data.forEach((item, index)=>{
          let obj = {};
          obj.label = item.goodsName;
          obj.value = item.id;
          self.optionsName.push(obj)
        })
        self.$set(self.searchOptions[3], "options", self.optionsName)
      }
    })(data)
  },
  changeSearch(val) {
    console.log(val)
    const self = this;
    if (val.goodsType) {
      if (self.startgoodsType != val.goodsType) {
        let data = {
          goodsType: val.goodsType
        };
        self.getModelTrees(data);
        self.$set(self.$refs.searchForm.form, "goodsName", '');
        self.$set(self.$refs.searchForm.form, "deviceModel", '');
        self.$set(self.$refs.searchForm.options[3], "options", [] )
        self.$set(self.$refs.searchForm.options[4], "options", [] )
        self.startgoodsType = val.goodsType;
      }        
      if (val.goodsName) {
        if (self.startGoodsId != val.goodsName) {
          console.log(self.resourceDatas)
          self.resourceDatas.forEach((item,index) =>{
            // debugger
            if (val.goodsName == item.id) {
              self.optionsModel = [];
              item.modelInfoVoList.forEach(el =>{
                let obj = {};
                obj.label = el.deviceModel
                obj.value = el.modelId
                self.optionsModel.push(obj)
              });
              self.$set(self.searchOptions[4], "options", self.optionsModel);
              self.$set(self.$refs.searchForm.form, "deviceModel", '');
              self.startGoodsId = val.goodsName;
            }
          })
        }
      }
    }
  },
  reset() {
    this.startGoodsId =  null;
    this.startgoodsType = null;
    this.$set(this.$refs.searchForm.options[3], "options", [] )
    this.$set(this.$refs.searchForm.options[4], "options", [] )
  },
  selectBtn(val) {
    if ("导出当前" == val.name) {
      this.getOut(false);
    }
    if ("导出全部" == val.name) {
      this.getOut(true);
    }
    
    if ("打印" == val.name) {
      // this.$print(this.$refs.print);
      this.isPrint = true;
      this.printData.params.page = this.params.page;
      this.printData.params.pageSize = this.params.pageSize;
      console.log(this.params);
    }
  },
  async getOut(isAll) {
    this.requestData = {
      page: this.params.page,
      pageSize: this.params.pageSize,
      param: {
        all: isAll,
        ...this.params.param
      }
    }
    const data = JSON.parse(JSON.stringify(this.requestData))
    let result = await this.$api.terraceGetOut({
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
    aLink.setAttribute("download", "台账管理数据.xls");
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
    console.log(result);
    //console.log("res", result);
  },
  toDetailLedger(row) {
    console.log(row)
    this.$router.push({name: 'detailLedger', query:row})
  },
  handleCurrentChange(currentPage) {
    this.params.page = currentPage;
    this.getLedgerList(this.params)
  },
  handleSizeChange(pageSize) {
    this.params.page = 1;
    this.params.pageSize = pageSize;
    this.getLedgerList(this.params)
  },
},
}
</script>

<style lang="less" scoped>
</style>
