<template>
  <div class="vlt-card alreadyPut-detail">
    <panel :show="true" title="基本信息" style="margin-bottom:10px;">
      <base-info :infoList="infoList"></base-info>
    </panel>
    <panel :show="true" title="物品列表">
      <el-table :data="goodsListData" border style="width: 100%">
        <el-table-column prop="id" label="序号" type="index" width="80"></el-table-column>
        <el-table-column prop="goodsName" label="物品名称"></el-table-column>
        <el-table-column prop="deviceModel" label="物品型号"></el-table-column>
        <!-- <el-table-column prop="goodsCode" label="物品编号"></el-table-column> -->
        <el-table-column prop="num" label="数量"></el-table-column>
        <el-table-column prop="unitPrice" label="单价（元）"></el-table-column>
        <el-table-column prop="amount" label="金额（元）"></el-table-column>
        <el-table-column prop="goodsSerialNumber" label="物品序列号"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
      </el-table>
    </panel>
    <div class="inp-total">
      <span>
        合计金额：
        <el-input :disabled="true" v-model="totalMoney" placeholder="请输入总金额">
          <template slot="append">元</template>
        </el-input>
      </span>
    </div>
    <!-- <el-row class="putStore">
      <el-button type="primary" class="mainBtn" @click="putStoreClick">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-row>-->
  </div>
</template>

<script type="text/javascript">
export default {
  name: "alreadyPutDetail",
  data() {
    return {
      totalMoney: 0,
      infoList: [
        { title: "单据编号", value: "", prop: "documentNumber" },
        { title: "单据主题", value: "", prop: "documentToppic" },
        { title: "入库人员", value: "", prop: "entryWarehouseByName"},
        { title: "入库日期", value: "", prop: "createTime" },
        { title: "出库仓库", value: "", prop: "outWarehouseName" },
        { title: "入库仓库", value: "", prop: "entryWarehouseName" },
        { title: "说明", value: "", prop: "remark" }
      ],
      goodsListData: [],
      // documentNumber: this.$route.query.documentNumber,

      queryRequest: {
        documentNumber: "",
        oplType: ""
      }
    };
  },
  components: {},
  created() {
    if (this.$route.query.documentNumber || this.$route.query.oplType) {
      this.queryRequest = this.$route.query;
      this.queryRequest.oplType = parseInt(this.queryRequest.oplType);
    }
    this.putStoreDetail(this.queryRequest);
  },
  methods: {
    async putStoreDetail(data) {
      let res = await this.$api.getOutPutDetail({ data });
      console.log(res);
      if (res && res.code == 0) {
        this.totalMoney = this.$common.thousandMark(Number(res.data.totalPrice));
        this.infoList.forEach(item => {
          item.value = res.data[item.prop];
        });
        res.data.list.forEach(item =>{
          item.unitPrice = item.unitPrice ? this.$common.thousandMark(item.unitPrice) : "0.00";
          item.amount = item.amount ? this.$common.thousandMark(item.amount) : "0.00";
        })
        this.goodsListData = res.data.list;
      }
    },
    // putStoreClick(){
    //   console.log(32123)
    // },
    cancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less">
.alreadyPut-detail {
  .inp-total {
    margin-top: 20px;
    margin-left: 20px;
    .el-input {
      width: 500px;
    }
  }
  .putStore {
    .el-button {
      margin: 10px;
    }
    .mainBtn {
      margin-top: 80px;
      margin-left: 1350px;
      margin-bottom: 150px;
    }
  }
}
</style>
