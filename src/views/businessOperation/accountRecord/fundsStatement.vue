<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="8em"
    ></search-bar>

    <el-table :data="tableData" border style="width: 100%; margin-top: 10px;">
      <el-table-column type="index" fixed label="序号" width="55">
        <template slot-scope="scope">{{pageSize*(current-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="orderCode" label="订单编号" min-width="250px"></el-table-column>
      <el-table-column prop="accountCode" label="会员卡号/投注卡号" min-width="180px"></el-table-column>
      <el-table-column prop="memberName" label="账户名称" min-width="120px">
        <template slot-scope="scope">{{scope.row.memberName || '匿名用户'}}</template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码" min-width="120px"></el-table-column>
      <el-table-column prop="tradeType" label="流水类型" min-width="120px">
        <template slot-scope="scope">{{typeChange(scope.row.tradeType,'tradeType')}}</template>
      </el-table-column>
      <el-table-column prop="orderAmount" label="交易/结算金额（元）" sortable min-width="180px">
        <template slot-scope="scope">{{$common.thousandMark(scope.row.orderAmount)}}</template>
      </el-table-column>

      <el-table-column prop="balanceAmount" label="账户余额（元）" sortable min-width="150px">
        <template slot-scope="scope">{{$common.thousandMark(scope.row.balanceAmount)}}</template>
      </el-table-column>
      <el-table-column prop="tradeTypeDesc" label="交易描述" min-width="160px">
        <template slot-scope="scope">{{typeChange(scope.row.tradeType,'tradeTypeDesc')}}</template>
      </el-table-column>
      <el-table-column prop="createdTime" label="变更时间" min-width="180px" sortable>
        <template
          slot-scope="scope"
        >{{scope.row.createdTime ? $moment(scope.row.createdTime).format("YYYY-MM-DD HH:mm:ss"):''}}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" min-width="90px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="fundsDetail(scope.row)"
            :id="$route.name+'-details-'+scope.$index"
            v-has="'fundsStatement-details'"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      :current-page="current"
      :page-size="pageSize"
      :total="total"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
//资金流水
export default {
  name: "fundsStatement",
  data() {
    return {
      searchOptions: [
        {
          title: "会员/投注卡号",
          type: "input",
          prop: "accountCode",
          value: ""
        },
        { title: "手机号码", type: "input", prop: "mobile", value: "" },
        {
          title: "流水类型",
          type: "select",
          prop: "tradeType",
          value: "",
          options: [
            { label: "充值", value: 1 },
            { label: "投注", value: 3 },
            { label: "兑奖", value: 4 },
            { label: "提现", value: 2 }
          ]
        },
        {
          title: "变更时间",
          type: "datepicker-range",
          prop: "orderTime",
          value: ""
        }
      ],
      tableData: [],
      pageSize: 20,
      total: 0,
      current: 1,
      searchForm: {},
      channe: ""
    };
  },
  components: {},
  created() {
    this.init();
  },
  methods: {
    init(val) {
      const self = this;
      (async val => {
        let data = {
          page: val || 1,
          pageSize: self.pageSize,
          param: {
            ...self.searchForm
          }
        };
        let reslt = await self.$api.queryFundRecord({ data });
        console.log(reslt, "资金流水");
        if (reslt && reslt.code === 0) {
          self.total = reslt.data.total;
          self.current = data.page;
          self.tableData = reslt.data.records;
        }
      })(val);
    },
    fundsDetail(account) {
      this.$router.push({
        path: "fundsDetail",
        query: { orderCode: account.orderCode, tradeType: account.tradeType }
      });
    },
    typeChange(val, type) {
      switch (type) {
        case "accountType":
          let options = {
            0: "投注卡",
            1: "会员卡",
            2: "试玩卡",
            3: "电子投注卡",
            4: "合作伙伴"
          };
          return options[val];
        case "tradeType":
          let option = {
            1: "充值",
            2: "提现",
            3: "投注",
            4: "兑奖"
          };
          return option[val];
        case "tradeTypeDesc":
          let opt = {
            1: "银联->个人账户",
            2: "个人账户->现金",
            3: "个人账户->平台",
            4: "平台->个人账户"
          };
          return opt[val];
        default:
          break;
      }
    },
    search(params) {
      if (params.orderTime) {
        let beginTime = this.$moment(params.orderTime[0]).format("YYYY-MM-DD ");
        let endTime = this.$moment(params.orderTime[1]).format("YYYY-MM-DD ");
        params.startTime = beginTime;
        params.endTime = endTime;
        delete params.orderTime;
      }

      this.searchForm = { ...params };
      this.init();
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    pageCurrentChange(page) {
      this.current = page;
      this.init(page);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
