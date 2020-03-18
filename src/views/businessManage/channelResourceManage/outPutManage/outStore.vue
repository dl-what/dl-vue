<template>
  <div class="vlt-card outStore-page">
    <panel :show="true" title="基本信息" style="margin-bottom:10px;">
      <base-info :infoList="infoList"></base-info>
    </panel>
    <panel :show="true" title="物品列表">
      <el-table :data="goodsListData" border style="width: 100%">
          <el-table-column  label="序号" type="index" width='80'></el-table-column>
          <el-table-column prop="goodsName" label="物品名称"></el-table-column>
          <el-table-column prop="deviceModel" label="物品型号"></el-table-column>
          <!-- <el-table-column prop="goodsCode" label="物品编号"></el-table-column> -->
          <el-table-column prop="num" label="数量"></el-table-column>
          <el-table-column prop="unitPrice" label="单价（元）"></el-table-column>
          <el-table-column prop="amount" label="金额（元）"></el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
      </el-table>
    </panel>
    <div class="inp-total">
      <span>合计金额：<el-input size="small" :disabled="true"  v-model="totalMoney" placeholder="请输入总金额">
        <template slot="append">元</template>
      </el-input></span>
    </div>
    <el-row class="outStore">
      <el-button :id="'outStore-outStore'" size="small" type="primary" class="mainBtn" @click="outStore">出库</el-button>
      <el-button :id="'outStore-cancel'" size="small" @click="cancel">取消</el-button>
    </el-row>
  </div>
</template>

<script type="text/javascript">
export default {
 name: "outStore",
 data() {
 return {
  totalMoney:0,
  infoList: [
      { title: "单据编号", value: "", prop: "documentNumber" },
      { title: "单据主题", value: "", prop: "documentToppic" },
      { title: "申请人员", value: "", prop: "userName" },
      { title: "申请日期", value: "", prop: "createTime" },
      { title: "出库仓库", value: "", prop: "outWarehouseName" },
      { title: "入库仓库", value: "", prop: "entryWarehouseName" },
      { title: "说明", value: "", prop: "remark" },
  ],
  goodsListData:[],
  
  // documentNumber: this.$route.query.documentNumber,
  warehouseId:10,
  queryRequest: {
    documentNumber: '',
    oplType: ''
  }
 }
 },
 components: {
 },
 created(){
  if (this.$route.query.documentNumber || this.$route.query.oplType) {
    this.queryRequest = this.$route.query;
    this.queryRequest.oplType = parseInt(this.queryRequest.oplType);
  }
  this.getInfoList(this.queryRequest)
 },
 methods: {
  async getInfoList(data){
    const self = this;
    let res = await self.$api.getOutPutDetail({data})
    console.log(res )
    if(res && res.code == 0){
      self.infoList.forEach(item =>{
        self.totalMoney = self.$common.thousandMark(Number(res.data.totalPrice));
        self.warehouseId = res.data.outWarehouseId
        item.value = res.data[item.prop]
      })
      res.data.list.forEach(item =>{
        item.unitPrice = item.unitPrice ? self.$common.thousandMark(item.unitPrice) : 0.00;
        item.amount = item.amount ? self.$common.thousandMark(item.amount) : 0.00;
      })
      self.goodsListData = res.data.list
    }
  },
  //出库
  async outStore(){
    const self = this
    let data = {
      ...self.queryRequest,
      warehouseId: self.warehouseId  
      }
      console.log(data)
    let res = await self.$api.entryAndOut({message: '出库成功',data})
    if(res && res.code == 0){
      this.$router.push({ name: "outStoreManage" });
    }
  },
  cancel(){
    this.$router.back();
  }
},
}
</script>

<style lang="less">
.outStore-page {
  .inp-total {
    margin-top: 20px;
    margin-left: 20px;
    .el-input {
      width: 300px;
    }
  }
  .outStore {
    .el-button {
      margin: 10px;
    }
    .mainBtn {
      margin-top: 80px;
      margin-left: 150px;
      margin-bottom: 150px;
    }
  }
}
</style>
