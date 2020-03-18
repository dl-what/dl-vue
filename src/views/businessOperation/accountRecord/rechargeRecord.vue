<template>
  <div class="vlt-card">
    <search-bar @search="search" :options="searchOptions" :total="total" labelWidth="6em"></search-bar>
    <el-table :data="rechargeList" border style="width: 100%; margin-top: 10px;">
      <el-table-column type="index" fixed label="序号" width="55">
        <template slot-scope="scope">{{pageSize*(current-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="orderCode" label="订单编号" min-width="240px"></el-table-column>
      <el-table-column prop="accountType" label="账户类型" min-width="120px">
        <template slot-scope="scope">{{typeChange(scope.row.accountType,'accountType')}}</template>
      </el-table-column>
      <el-table-column prop="accountCode" label="充值账号" min-width="180px"></el-table-column>
      <el-table-column prop="memberName" label="账户名称" min-width="120px">
        <template slot-scope="scope">{{scope.row.memberName || '匿名用户'}}</template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码" min-width="120px"></el-table-column>
      <el-table-column prop="insName" label="所属机构" min-width="120px"></el-table-column>
      <el-table-column prop="orderAmount" label="充值金额（元）" min-width="170" sortable>
        <template slot-scope="scope">{{$common.thousandMark(scope.row.orderAmount)}}</template>
      </el-table-column>
      <el-table-column prop="balanceAmount" label="账户余额（元）" min-width="170">
        <template slot-scope="scope">{{$common.thousandMark(scope.row.balanceAmount)}}</template>
      </el-table-column>
      <el-table-column prop="payType" label="充值方式" min-width="120px">
        <template slot-scope="scope">{{typeChange(scope.row.payType,'payType')}}</template>
      </el-table-column>
      <el-table-column prop="createdTime" label="操作时间" min-width="160" sortable>
        <template
          slot-scope="scope"
        >{{scope.row.createdTime ? $moment(scope.row.createdTime).format("YYYY-MM-DD HH:mm:ss"):''}}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" min-width="90px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            :id="$route.name+'-details-'+scope.$index"
            @click="rechargeDetail(scope.row)"
            v-has="'rechargeRecord-details'"
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
import { mapGetters, mapState, mapMutations } from "vuex";
//充值记录
export default {
  name: "rechargeRecord",
  data() {
    return {
      searchOptions: [
        { title: "充值账号", type: "input", prop: "accountCode", value: "" },
        { title: "手机号码", type: "input", prop: "mobile", value: "" },
        {
          title: "账户类型",
          type: "select",
          prop: "accountType",
          value: "",
          options: [
            { label: "投注卡", value: 0 },
            { label: "会员卡", value: 1 },
            { label: "电子投注卡", value: 3 },
            { label: "合作伙伴", value: 4 }
          ]
        },
        { title: "订单编号", type: "input", prop: "orderCode", value: "" },
        {
          type: "cascader",
          prop: "insId",
          value: "",
          title: "所属机构",
          setProps: {
            value: "id",
            label: "text",
            checkStrictly: true,
            children: "children"
          },
          options: []
        },
        {
          title: "操作时间",
          type: "datepicker-range",
          prop: "orderTime",
          value: ""
        }
      ],
      rechargeList: [],
      page: 1,
      pageSize: 20,
      total: 0,
      current: 1,
      searchForm: {},
      // channe: "",
      num: ""
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["insData"])
  },
  methods: {
    async init(val) {
      let data = {
        page: val || 1,
        pageSize: this.pageSize,
        param: {
          tradeType: 1,
          ...this.searchForm
        }
      };
      let res = await this.$api.queryRechargeRecord({ data });
      console.log(res, "r投注卡冲值");
      if (res && res.code === 0) {
        this.total = res.data.total;
        this.current = res.data.current;
        this.rechargeList = res.data.records;
      }
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
        case "payType":
          let option = {
            1: "现金",
            2: "微信",
            3: "支付宝",
            4: "银行",
            5: "会员资金账户",
            6: "其他电子支付",
            7: "生产交易系统"
          };
          return option[val];
        default:
          break;
      }
    },
    rechargeDetail(account) {
      let obj = {};
      account.activeName = this.$route.query.activeName || ""; // 跨系统菜单激活对应的路由名称
      this.$router.push({
        path: "rechargeDetail",
        query: { id: account.orderId }
      });
    },
    search(params) {
      if (params.insId) {
        params.insId = params.insId[params.insId.length - 1];
      }
      if (params.orderTime) {
        let startTime = this.$moment(params.orderTime[0]).format("YYYY-MM-DD ");
        let endTime = this.$moment(params.orderTime[1]).format("YYYY-MM-DD ");
        params.startTime = startTime;
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
  },
  watch: {
    insData: {
      handler(n, o) {
        this.searchOptions[4].options = this.insData;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
</style>
