<template>
 <div class="vlt-card detailFlow-page"> 
    <panel title="基本信息" style="margin-bottom:10px;" :show="true">
      <base-info :infoList="infoList"></base-info>
    </panel>
    <panel :show="true" title="物品列表">
      <div class="table-wrap">
        <el-table :data="goodsListData" border style="width: 100%">
          <el-table-column prop="id" label="序号" type="index" width='80'></el-table-column>
          <el-table-column prop="goodsName" label="物品名称"></el-table-column>
          <el-table-column prop="deviceModel" label="物品型号"></el-table-column>
          <el-table-column prop="goodsSerialNumber" label="物品序列号"></el-table-column>          
          <el-table-column prop="num" label="数量"></el-table-column>
          <el-table-column prop="unitPrice" label="单价（元）"></el-table-column>
          <el-table-column prop="amount" label="金额（元）"></el-table-column>
          <el-table-column prop="remark" label="备注" width="280px"></el-table-column>
        </el-table>
      </div>
    </panel>
    <div class="inp-total">
      <span>合计金额：<el-input disabled v-model="totalMoney" placeholder="请输入总金额"><template slot="append">元</template></el-input></span>
    </div>
 </div>
</template>

<script type="text/javascript">
export default {
name: "detailFlow",
data() {
return {
  totalMoney:'',
  infoList: [
        { title: "单据编号", value: "", prop: "documentNumber" },
        { title: "单据主题", value: "", prop: "documentToppic" },
        { title: "申请人员", value: "", prop: "userName" },
        { title: "申请日期", value: "", prop: "createTime" },
        { title: "出库仓库", value: "", prop: "outWarehouseName" },
        { title: "入库仓库", value: "", prop: "entryWarehouseName" },
        { title: "备注", value: "", prop: "remark" },
    ],
  goodsListData:[]

}
},
created() {
  if (this.$route.query.documentNumber || this.$route.query.oplType) {
    this.queryRequest = this.$route.query;
    this.queryRequest.oplType = parseInt(this.queryRequest.oplType);
  }
  this.getInfolist(this.queryRequest);
},
methods: {
  async getInfolist(data) {
    const self = this;
    let res = await this.$api.getOutPutDetail({ data });
    console.log(res);
    if (res && res.code == 0) {
      console.log(res)
      this.totalMoney = self.$common.thousandMark(res.data.totalPrice);
      this.entryWarehouseId = res.data.entryWarehouseId;
      this.oplType = res.data.oplBy;
      res.data.list.forEach((item)=>{
        item.unitPrice = self.$common.thousandMark(item.unitPrice)
        item.amount = self.$common.thousandMark(item.amount)
      })
      this.goodsListData = res.data.list
      this.infoList.forEach(item => {
        item.value = res.data[item.prop];
      });
      // let array =[]
      // res.data.list.forEach(item => {
      //   // item.num = 5
      //   for (let i = 0; i < item.num; i++) {
      //     let obj = JSON.parse(JSON.stringify(item));
      //     obj.serialNumber = "";
      //     obj.num = 1;
      //     this.goodsListData.push(obj);
      //   }
      // });
      // // this.goodsListData = array;
      // console.log("array", this.goodsListData);
    }
  },
  confirm(){
    this.$router.push("ledgerManage")
  },
  cancel(){
    this.$router.back();
  }
},
}
</script>

<style lang="less" scoped>
.detailFlow-page{
  .inp-total{
  margin-top: 20px;
  margin-left: 20px;
  .el-input{
    width:500px
  }
}
.putStore{
  .el-button{
    margin:10px;
  }
  .mainBtn{
    margin-top:80px;
    margin-left: 1350px;
    margin-bottom: 150px
  }
}

}
.table-wrap{
  padding: 10px;
}

</style>
