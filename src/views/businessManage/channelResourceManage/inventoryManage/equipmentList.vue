<template>
<!-- 设备列表 -->
<div class="vlt-card">
  <search-bar class="search-bar-demo" @search = "search" :options="inventoryOptions" :total="total" labelWidth="6em">
    <control-bar slot="extend-bar" :options ="controlOptions" position="left" @select="selectBtn"></control-bar>
  </search-bar>
  <el-table ref="print" :data="tableData" border style="width: 100%" class="table-header-style">
    <el-table-column prop="id" label="序号" type="index" width="60px">
      <template slot-scope="scope">
        {{params.pageSize*(params.page-1)+(scope.$index+1)}}
      </template>
    </el-table-column>
    <el-table-column v-for="(item,key) in tableList" :key="key" :prop="item.value" :label="item.label" :type="item.type" :min-width="item.width"></el-table-column>
    <el-table-column label="操作" fixed="right" min-width="140px">
      <template slot-scope="scope">
        <el-button :id="'equipmentList-detail' + scope.$index" @click="equipmentDetail(scope.row.goodsName,scope.row.deviceModelId)" v-has="'equipmentList-detail'" type="primary" size="mini">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
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
export default {
name: "equipmentList",
data() {
return {
  inventoryOptions: [
    { title: "设备名称", type: "input", prop: "goodsName", value: "" },
    { title: "设备型号", type: "input", prop: "deviceModel", value: ""},
  ],
  tableList:[
    // {label:"序号",value:"",type:"index"},
    {label:"设备名称",value:"goodsName", width: '200px'},
    {label:"设备型号",value:"deviceModel", width: '200px'},
    {label:"数量",value:"inventory", width: '200px'},
    {label:"单位",value:"deviceUnit", width: '200px'},
  ],
  controlOptions: [
    { name: "打印", type: "primary", icon: "printer", permission: 'equipmentList-print'},
    { name: "导出当前", type: "", icon: "s-promotion", permission: 'equipmentList-exportCurrent'},
    { name: "导出全部", type: "", icon: "s-promotion", permission: 'equipmentList-exportAll' },
  ],
  isPrint: false,
  printData: {
    title: '渠道资源管理-设备列表',
    params: {
      page: 1,
      pageSize: 20
    },
    props: [
      {prop: 'index', label:'序号', width: ""},
      {prop: 'goodsName', label:'设备名称', width: ""},
      {prop: 'deviceModel', label:'设备型号', width: ""},
      {prop:'inventory', label:'数量', width: ""},
      {prop:'deviceUnit', label:'单位', width: ""},
      
    ],
    tableData: [],
  },
  tableData: [],
  params:{
    page: 1,
    pageSize: 20,
    param:{
      goodsType: 1
    }
  },
  total: 0
}
},
created() {
  this.getList()
},
methods: {
  getList() {
    const self = this;
    let data = self.params;
    (async data =>{
      let res = await self.$api.inventoryCheck({ data })
      console.log(res)
      if (res && res.code == 0) {
        self.total = res.data.total
        self.tableData = res.data.records;
        self.printData.tableData = self.tableData;
      }
    })(data)
  },
  search(val) {
    this.params.page = 1;
    this.params.param = {...val,goodsType:1}
    console.log(this.params)
    this.getList(this.params)
  },
  selectBtn(val) {
    if ("导出当前" == val.name) {
      this.getOut(false);
    };
    if ("导出全部" == val.name) {
      this.getOut(true);
    };
    if ("打印" == val.name) {
      // this.$print(this.$refs.print);
      this.isPrint = true;
      this.printData.params.page = this.params.page;
      this.printData.params.pageSize = this.params.pageSize;
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
    let result = await this.$api.inventoryGetOut({
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
    aLink.setAttribute("download", "设备库存数据.xls");
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
    console.log(result);
    //console.log("res", result);
  },
  handleCurrentChange(currentPage) {
    this.params.page = currentPage
    this.getList(this.params)
  },
  handleSizeChange(pageSize) {
    this.params.pageSize = pageSize
    this.getList(this.params)
  },
  equipmentDetail (goodsName,deviceModelId) {
    this.$router.push({
      name: 'equipmentDetail',
      query: {goodsName,deviceModelId}
    })
  },
},
}
</script>

<style lang="less">
</style>
