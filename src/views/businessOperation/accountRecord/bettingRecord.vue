<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    ></search-bar>

    <el-table :data="tableData" border style="width: 100%; margin-top: 10px;">
      <el-table-column fixed type="index" label="序号" width="55">
        <template slot-scope="scope">{{pageSize*(current-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="transactionId" label="订单编号" min-width="220"></el-table-column>
      <el-table-column prop="userType" label="账户类型" min-width="120">
        <template slot-scope="scope">{{getBettingStatus(scope.row.userType,'userType')}}</template>
      </el-table-column>
      <el-table-column prop="userCode" label="投注卡号" min-width="160"></el-table-column>
      <el-table-column prop="memberName" label="账户名称" min-width="100">
        <template slot-scope="scope">{{scope.row.memberName || '匿名用户'}}</template>
      </el-table-column>
      <el-table-column prop="betAmount" label="投注金额(元)" sortable min-width="140">
        <template slot-scope="scope">{{$common.thousandMark(scope.row.betAmount)}}</template>
      </el-table-column>
      <el-table-column prop="winStatus" label="投注状态" min-width="100">
        <template slot-scope="scope">
          <span
            class="icon-circle"
            :class="{
            blue:scope.row.winStatus=='4',
            green:scope.row.winStatus=='1',
            grey:scope.row.winStatus=='2',
            yellow:scope.row.winStatus=='3',
            red:scope.row.winStatus=='0',
            }"
          >{{scope.row.strWinStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="insName" label="所属机构" min-width="80"></el-table-column>
      <el-table-column prop="gameName" label="游戏名称" min-width="100"></el-table-column>
      <el-table-column prop="mobile" label="手机号码" min-width="140"></el-table-column>
      <el-table-column prop="timeBet" label="投注时间" width="160" sortable>
        <template
          slot-scope="scope"
        >{{scope.row.timeBet ? $moment(scope.row.timeBet).format("YYYY-MM-DD HH:mm:ss"):''}}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" min-width="90px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="betDetail(scope.row)"
            v-has="'bettingRecord-details'"
            :id="$route.name+'-details-'+scope.$index"
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
import { mapGetters } from "vuex";
export default {
  name: "bettingRecord",
  data() {
    return {
      searchOptions: [
        { title: "投注卡号", type: "input", prop: "userCode", value: "" },
        { title: "手机号码", type: "input", prop: "mobile", value: "" },
        {
          title: "账户类型",
          type: "select",
          prop: "userType",
          value: "",
          options: [
            { label: "投注卡", value: 0 },
            { label: "会员卡", value: 1 },
            { label: "试玩卡", value: 2 },
            { label: "电子投注卡", value: 3 }
          ]
        },
        { title: "订单编号", type: "input", prop: "transactionId", value: "" },
        {
          title: "投注时间",
          type: "datepicker-range",
          prop: "orderTime",
          value: ""
        },
        {
          title: "投注状态",
          type: "select",
          prop: "winStatus",
          value: "",
          options: [
            { label: "未中奖", value: 0 },
            { label: "已中奖", value: 1 }
          ]
        },

        {
          title: "所属机构",
          type: "cascader",
          prop: "insId",
          value: "",
          setProps: {
            value: "id",
            label: "text",
            checkStrictly: true,
            children: "children"
          },
          options: []
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
  computed: {
    ...mapGetters(["insData"])
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
        let res = await self.$api.queryGameRecord({ data });
        if (res && res.code === 0) {
          self.total = res.data.total;
          self.current = res.data.current;
          res.data.records.forEach(item => {
            item.strWinStatus = item.winStatus == "0" ? "未中奖" : "已中奖";
          });
          self.tableData = res.data.records;
        }
      })(val);
    },
    betDetail(account) {
      this.$router.push({
        path: "betDetail",
        query: { id: account.transactionId }
      });
    },
    getBettingStatus(key, type) {
      switch (type) {
        case "userType":
          let options = {
            0: "投注卡",
            1: "会员卡",
            2: "试玩卡",
            3: "电子投注卡",
            4: "合作伙伴"
          };
          return options[key];
        case "gameStatus":
          let option = {
            0: "未开奖",
            1: "已兑奖",
            2: "未兑奖",
            3: "未中奖",
            4: "弃奖",
            9: "投注失败"
          };
          return option[key];
        default:
          break;
      }
    },
    search(params) {
      const self = this;
      if (params.insId) {
        params.insId = params.insId[params.insId.length - 1];
      }
      if (params.orderTime) {
        let startTime = this.$moment(params.orderTime[0]).format("YYYY-MM-DD ");
        let endTime = this.$moment(params.orderTime[1]).format("YYYY-MM-DD");
        params.startTime = startTime;
        params.endTime = endTime;
        delete params.orderTime;
      }
      self.searchForm = params;
      self.init();
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
        this.searchOptions[6].options = this.insData;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
</style>
