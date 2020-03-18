<template>
<!-- 台账明细 -->
<div class="vlt-card">
  <div class="content-block">
    <search-bar class="search-bar-demo" @search="search" :options="searchOptions" :total="total" labelWidth="6em">
      <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions" position="left"></control-bar>
    </search-bar>
    <el-table ref="print" :data="tableData" border>
        <el-table-column fixed label="序号" type="index" width="60px">
          <template slot-scope="scope">
            {{params.pageSize*(params.page-1)+(scope.$index+1)}}
          </template>
        </el-table-column>
        <el-table-column label="物品名称" prop="goodsName" min-width="140px"></el-table-column>
        <el-table-column label="物品型号" prop="deviceModel" min-width="140px"></el-table-column>
        <!-- <el-table-column label="单据编号" prop="documentNumber"></el-table-column>
        <el-table-column label="单据主题" prop="documentToppic"></el-table-column> -->
        <!-- <el-table-column label="物品编码" prop="sequenceCode"></el-table-column> -->
        <el-table-column label="业务类型" prop="businessType" min-width="120px">
          <template slot-scope="scope">
            {{getBusinessType(scope.row.businessType)}}
          </template>
        </el-table-column>
        <el-table-column label="出入库类型" prop="inOutType" min-width="120px">
          <template slot-scope="scope">
            <span
            class="icon-tag"
            :class="{
            blue:scope.row.inOutType=='0',
            green:scope.row.inOutType=='1',
            grey:scope.row.inOutType=='2',
            yellow:scope.row.inOutType=='3',
            red:scope.row.inOutType=='4',
            }"
            >{{scope.row.strInOutType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="operateAmount" min-width="90px"></el-table-column>
        <el-table-column label="发放位置" prop="dealPlace" min-width="200px"></el-table-column>
        <el-table-column label="剩余库存" prop="reserve" min-width="100px"></el-table-column>
        <el-table-column label="操作时间" prop="operateTime" min-width="160px"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="100px">
          <template slot-scope="scope">
            <el-button :id="'detailLedger-toFlow' + scope.$index" size="mini" type="primary" @click="toDetailFlow(scope.row.documentNumber,scope.row.inOutType)">查看</el-button>
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
export default {
name: "detailLedger",
data() {
return {
  searchOptions:[
    {title:'出入库类型',type:'select',prop:'inOutType',value:'',options:[{label:'出库',value: 0},{label:'入库',value: 1}]},
    {title:'操作时间',type: "datepicker-range", prop: "date", value: "",options: ['start', 'end']}
  ],
  controlOptions:[
    { name: "打印", type: "primary", icon: "printer" ,permission: 'detailLedger-print'},
    { name: "导出当前", type: "", icon: "s-promotion",  permission: 'detailLedger-exportCurrent'},
    { name: "导出全部", type: "", icon: "s-promotion", permission: 'detailLedger-exportAll'},
  ],
  tableData:[],
  params: {
    page: 1,
    pageSize: 20,
    param:{}
  },
  total:0,
  queryParam: this.$route.query,
  requestData:{},
  isPrint: false,
  printData: {
    title: '台账明细',
    params: {
      page: 1,
      pageSize: 20
    },
    props: [
      {prop:'index', label:'序号', width: ""},
      {prop:'goodsName', label:'物品名称', width: ""},
      {prop:'deviceModel', label:'物品型号', width: ""},
      {prop:'businessType', label:'业务类型', width: ""},
      {prop:'inOutType', label:'出入库类型', width: ""},
      {prop:'operateAmount', label:'数量', width: ""},
      {prop:'dealPlace', label:'发放位置', width: ""},
      {prop:'reserve', label:'剩余库存', width: ""},
      {prop:'operateTime', label:'操作时间', width: ""},
    ],
    tableData: [],
  },
}
},
created(){
  this.params.param = this.queryParam;
  delete this.params.param.reserve;
  this.getTableData(this.params)
},
methods: {
  getTableData(data) {
    const self= this;
    (async data =>{
      let res = await self.$api.getTerraceDetail({data})
      console.log(res)
      if (res && res.code == 0) {
        self.total = res.data.total
        res.data.records.forEach((item)=>{
          item.strInOutType = item.inOutType==0?'出库':'入库';

         
        }) 
        self.tableData = res.data.records;
        self.printData.tableData = JSON.parse(JSON.stringify(res.data.records));
        self.printData.tableData.forEach(item => {
          item.businessType = item.businessType ?  self.getBusinessType(item.businessType + 1) : '';
        })
      }
    })(data)
  },
  getBusinessType(val){
    let obj = {
      1: "资源采购",
      2: "资源申请",
      3: "资源发放",
      4: "资源调拨",
      5: "渠道新建",
      6: "渠道关停",
      7: "资源报废",
      8: "渠道退机",
      9: "渠道增机",
      10: "渠道移机",
      11: "渠道变更",
      12: "渠道迁址",
      13: "渠道过户",
      14: "渠道换机"
    }
    return obj[val]
  },
  getOutInType(val) {
    let options = {
      1: '入库',
      0: '出库'
    }
    return options[val]
  },
  search(val) {
    console.log(val)
    if (val.date && val.date.length > 0) {
      val.startTime = this.$moment(val.date[0]).format("YYYY-MM-DD HH:mm:ss");
      val.endTime = this.$moment(val.date[1]).format("YYYY-MM-DD HH:mm:ss");
      delete val.date
    };
    this.params.page = 1;
    this.params.param = {
      ...val,
      ...this.queryParam
    };
    console.log(this.params)
    this.getTableData(this.params)
  },
  selectBtn(val) {
    if ("导出当前" === val.name) {
      this.getOut(false);
    };
    if ("导出全部" === val.name) {
      this.getOut(true);
    }
    if ("打印" == val.name) {
      // this.$print(this.$refs.print);
      this.isPrint = true;
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
    let result = await this.$api.terraceDetailGetOut({
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
    aLink.setAttribute("download", "台账明细数据.xls");
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
    console.log(result);
    //console.log("res", result);
  },
  toDetailFlow(documentNumber,inOutType) {
    this.$router.push({name: 'detailFlow', query:{documentNumber,oplType:inOutType}})
  },
  handleCurrentChange(currentPage) {
    this.params.page = currentPage;
    this.getTableData(this.params)
  },
  handleSizeChange(pageSize) {
    this.params.page = 1;
    this.params.pageSize = pageSize;
    this.getTableData(this.params)
  },
},
}
</script>

<style lang="less" scoped>
</style>
