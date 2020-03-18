<template>
  <div class="vlt-card putStore-page">
    <panel :show="true" title="基本信息" style="margin-bottom:10px;">
      <base-info :infoList="infoList"></base-info>
    </panel>
    <panel :show="true" title="物品列表">
      <div class="table-wrap">
        <el-table :data="goodsListData" border style="width: 100%">
          <el-table-column prop="id" label="序号" type="index" width="60"></el-table-column>
          <el-table-column prop="goodsName" label="物品名称"></el-table-column>
          <el-table-column prop="deviceModel" label="物品型号"></el-table-column>
          <!-- <el-table-column prop="goodsCode" label="物品编号"></el-table-column> -->
          <el-table-column prop="num" label="数量"></el-table-column>
          <el-table-column prop="unitPrice" label="单价（元）"></el-table-column>
          <el-table-column prop="amount" label="金额（元）"></el-table-column>
          <el-table-column label="序列号" width="180">
            <template slot-scope="scope">
              <p v-if="scope.row.goodsSerialNumber!=null">{{scope.row.goodsSerialNumber}}</p>
              <el-input type="text" maxlength="20" v-else size="small" :disabled="scope.row.goodsType == 3 || scope.row.goodsType == 4"  v-model="scope.row.goodsSerialNumberNew" placeholder="请输入序列号"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </panel>
    <div class="inp-total">
      <span>
        合计金额：
        <el-input size="small" :disabled="true" v-model="totalMoney" placeholder="请输入总金额">
          <template slot="append">元</template>
        </el-input>
      </span>
    </div>
    <el-row class="putStore">
      <el-button :id="'putStore-putStore'" size="small" type="primary" class="mainBtn" @click="putStore">入库</el-button>
      <el-button :id="'putStore-cancel'" size="small" @click="cancel">取消</el-button>
    </el-row>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "putStore",
  data() {
    return {
      totalMoney: 0,
      infoList: [
        { title: "单据编号", value: "", prop: "documentNumber" },
        { title: "单据主题", value: "", prop: "documentToppic" },
        { title: "申请人员", value: "", prop: "userName" },
        { title: "申请日期", value: "", prop: "createTime" },
        { title: "出库仓库", value: "", prop: "outWarehouseName" },
        { title: "入库仓库", value: "", prop: "entryWarehouseName" },
        { title: "说明", value: "", prop: "remark" }
      ],
      goodsListData: [],
      seriesNum: [],

      requestData: {
        documentNumber: "", //单据编号
        list: {
          goodsCode: "", //物品编号
          goodsInfoId: 0, //  物品详情id
          serialNumber: "" // 物品序列号
        },
        oplBy: "1", // 出入库操作人id
        oplType: 1, // 操作类型
        warehouseId: 10 // 仓库id
      },
      entryWarehouseId: 0,
      // oplType:1,
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
    //  this.$route.query.documentNumber
    this.getInfolist(this.queryRequest);
  },
  methods: {
    async getInfolist(data) {
      const self = this;
      let res = await self.$api.getOutPutDetail({ data });
      console.log("详情",res);
      if (res && res.code == 0) {
        self.totalMoney = self.$common.thousandMark(Number(res.data.totalPrice));
        self.entryWarehouseId = res.data.entryWarehouseId;
        self.oplType = res.data.oplBy;
        self.infoList.forEach(item => {
          item.value = res.data[item.prop];
        });
        res.data.list.forEach(item =>{
          item.unitPrice = item.unitPrice ? self.$common.thousandMark(item.unitPrice) : 0.00;
          item.amount = item.amount ? self.$common.thousandMark(item.amount) : 0.00;
        })
        self.goodsListData = res.data.list;
      }
    },

    //入库
    async putStore() {
      let obj = {};
      let array = [];
      this.goodsListData.forEach(item => {
        console.log(item);
        let param = {
          goodsType: item.goodsType,
          goodsInfoId: item.id,
          goodsSerialNumber: item.goodsSerialNumberNew || item.goodsSerialNumber
        };
        array.push(param);
      });
      // console.log("提交参数", array);
      let data = {
        documentNumber: this.$route.query.documentNumber,
        list: array,
        oplType: 1,
        warehouseId: this.entryWarehouseId,
      };
      for (let item of data.list) {
        if (item.goodsType == 1 || item.goodsType == 2) {
          if (item.goodsSerialNumber == null) {
            this.$message.warning("序列号不能为空");
            return;
          }
        }
      }
      console.log("提交参数2", data);
      let res = await this.$api.entryAndOut({message: "入库成功", data });
      if (res && res.code == 0) {
        this.$router.push({ path: "putStoreManage" });
      }
    },
    cancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.putStore-page {
  .inp-total {
    margin-top: 20px;
    margin-left: 20px;
    .el-input {
      width: 300px;
    }
  }
  .putStore {
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
.table-wrap{
  padding: 10px;
}
</style>
