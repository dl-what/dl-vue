<template>
  <div class="vlt-card alreadyOut-detail">
    <panel :show="true" title="基本信息" style="margin-bottom:10px;">
      <base-info :infoList="infoList"></base-info>
    </panel>
    <panel :show="true" title="物品列表">
      <el-table :data="goodsListData" border style="width: 100%">
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column prop="goodsName" label="物品名称"></el-table-column>
        <el-table-column prop="deviceModel" label="物品型号"></el-table-column>
        <!-- <el-table-column prop="goodsCode" label="物品编号"></el-table-column> -->
        <el-table-column prop="num" label="数量"></el-table-column>
        <el-table-column prop="unitPrice" label="单价（元）"></el-table-column>
        <el-table-column prop="amount" label="金额（元）"></el-table-column>
        <!-- <el-table-column label="序列号">
          <template slot-scope="scope">
            <p v-if="scope.row.goodsSerialNumber!=null">{{scope.row.goodsSerialNumber}}</p>
          <el-input v-else size="small" type="number"  v-model="scope.row.goodsSerialNumberNew" placeholder="请输入序列号"></el-input>
          </template>
        </el-table-column> -->
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
  </div>
</template>

<script type="text/javascript">
export default {
  name: "alreadyOutDetail",
  data() {
    return {
      totalMoney: 0,
      infoList: [
        { title: "单据编号", value: "", prop: "documentNumber" },
        { title: "单据主题", value: "", prop: "documentToppic" },
        { title: "出库人员", value: "", prop: "outWarehouseByName"},
        { title: "出库日期", value: "", prop: "createTime" },
        { title: "出库仓库", value: "", prop: "outWarehouseName" },
        { title: "入库仓库", value: "", prop: "entryWarehouseName" },
        { title: "说明", value: "", prop: "remark" }
      ],
      goodsListData: [],
      // documentNumber: this.$route.query.documentNumber,
      queryRequest: {
        documentNumber: '',
        oplType: ''
      }
    };
  },
  components: {},
  created() {
    if (this.$route.query.documentNumber || this.$route.query.oplType) {
      this.queryRequest = this.$route.query;
      this.queryRequest.oplType = parseInt(this.queryRequest.oplType);
    }
    console.log(this.queryRequest);
    this.outStoreDetail(this.queryRequest);
  },
  methods: {
    async outStoreDetail(data) {
      let res = await this.$api.getOutPutDetail({ data });
      console.log(res);
      if (res && res.code == 0) {
        this.totalMoney = this.$common.thousandMark(Number(res.data.totalPrice));
        this.infoList.forEach(item => {
          item.value = res.data[item.prop];
          this.queryRequest.warehouseId = res.data.entryWarehouseId;
        });
        res.data.list.forEach(item =>{
          item.unitPrice = item.unitPrice ? this.$common.thousandMark(item.unitPrice) : "0.00";
          item.amount = item.amount ? this.$common.thousandMark(item.amount) : "0.00";
        })
        this.goodsListData = res.data.list;
      }
    },
  }
};
</script>

<style lang="less">
.alreadyOut-detail {
  .inp-total {
    margin-top: 20px;
    margin-left: 20px;
    .el-input {
      width: 500px;
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
