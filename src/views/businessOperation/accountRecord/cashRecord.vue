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
      <el-table-column prop="transactionId" label="订单编号" min-width="240"></el-table-column>
      <el-table-column prop="memberName" label="账户名称" min-width="120">
        <template slot-scope="scope">{{scope.row.memberName || '匿名用户'}}</template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码" min-width="140px"></el-table-column>
      <el-table-column prop="insName" label="所属机构" min-width="100"></el-table-column>
      <el-table-column prop="cashAmount" label="兑奖金额（元）" min-width="140">
        <!-- <template
          slot-scope="scope"
        >{{scope.row.winGrade==3? scope.row.winAmount/100*0.8:scope.row.winAmount/100}}</template>-->
      </el-table-column>
      <el-table-column prop="winAmount" label="中奖金额（元）" sortable min-width="160px">
        <template slot-scope="scope">{{$common.thousandMark(scope.row.winAmount)}}</template>
      </el-table-column>
      <el-table-column prop="money" label="税额（元）" min-width="100">
        <!-- <template slot-scope="scope">{{scope.row.winGrade==3?scope.row.winAmount*0.2/100:0}}</template> -->
      </el-table-column>
      <el-table-column prop="gameName" label="游戏名称" min-width="120"></el-table-column>
      <el-table-column prop="winGrade" label="中奖类型" min-width="100">
        <template slot-scope="scope">{{cashType(scope.row.winGrade,'winGrade')}}</template>
      </el-table-column>
      <el-table-column prop="type" label="兑奖方式" min-width="100">
        <template slot-scope="scope">{{cashType(scope.row.winGrade,'type')}}</template>
      </el-table-column>
      <el-table-column prop="cashStatus" label="兑奖状态" min-width="100">
        <template slot-scope="scope">{{cashType(scope.row.cashStatus,'cashStatus')}}</template>
      </el-table-column>
      <el-table-column prop="timeCash" label="兑奖时间" width="160" sortable>
        <!-- <template slot-scope="scope">
          {{scope.row.timeCash ? $moment(scope.row.timeCash).format("YYYY-MM-DD HH:mm:ss"):''}}
        </template>-->
      </el-table-column>
      <el-table-column prop="abandonTime" label="弃奖时间" width="160" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" min-width="120px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="cashDetail(scope.row)"
            :id="$route.name+'-details-'+scope.$index"
            v-has="'bettingRecord-details'"
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
//兑奖记录
export default {
  name: "cashRecord",
  data() {
    return {
      searchOptions: [
        { title: "订单编号", type: "input", prop: "transactionId", value: "" },
        { title: "手机号码", type: "input", prop: "mobile", value: "" },
        {
          title: "游戏名称",
          type: "input",
          prop: "gameName",
          value: ""
        },
        {
          title: "兑奖时间",
          type: "datepicker-range",
          prop: "orderTime",
          value: ""
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
        },
        {
          title: "中奖类型",
          value: "",
          type: "select",
          prop: "winGrade",
          options: [
            { label: "小奖", value: 1 },
            { label: "中奖", value: 2 },
            { label: "大奖", value: 3 }
          ]
        }
      ],
      tableData: [],
      pageSize: 20,
      current: 1,
      total: 0,
      searchForm: {},
      channe: ""
    };
  },
  computed: {
    ...mapGetters(["insData"])
  },
  created() {
    this.init();
  },
  methods: {
    init(val) {
      (async val => {
        let data = {
          page: val || 1,
          pageSize: this.pageSize,

          param: {
            ...this.searchForm
          }
        };
        let reslt = await this.$api.queryCashWin({ data });
        console.log(reslt, "兑奖");
        if (reslt && reslt.code === 0) {
          this.total = reslt.data.total;
          this.current = reslt.data.current;
          reslt.data.records.forEach(item => {
            if (item.winGrade == 3) {
              item.cashAmount = this.$common.thousandMark(item.winAmount * 0.8);
              item.money = this.$common.thousandMark(item.winAmount * 0.2);
            } else {
              item.cashAmount = this.$common.thousandMark(item.winAmount);
              // item.winAmount = this.$common.thousandMark(item.winAmount);
              item.money = this.$common.thousandMark(0);
            }
            if (item.cashStatus == 2) {
              item.abandonTime =
                item.timeCash &&
                this.$moment(item.timeCash).format("YYYY-MM-DD HH:mm:ss");
              item.timeCash = "";
            } else {
              item.timeCash =
                item.timeCash &&
                this.$moment(item.timeCash).format("YYYY-MM-DD HH:mm:ss");
              item.abandonTime = "";
            }
          });
          this.tableData = reslt.data.records;
        }
      })(val);
    },
    cashType(val, name) {
      switch (name) {
        case "winGrade":
          let options = {
            1: "小奖",
            2: "中奖",
            3: "大奖"
          };
          return options[val];

        case "type":
          let option = {
            1: "自动兑奖",
            2: "柜员机兑奖",
            3: "指定地点兑奖"
          };
          return option[val];

        case "cashStatus":
          let obj = {
            0: "未兑奖",
            1: "已兑奖",
            2: "弃奖"
          };
          return obj[val];
        default:
          break;
      }
    },
    cashDetail(account) {
      account.activeName = this.$route.query.activeName || ""; // 跨系统菜单激活对应的路由名称
      this.$router.push({
        path: "cashDetail",
        query: { id: account.transactionId, betSn: account.betSn }
      });
    },
    search(params) {
      const self = this;
      if (params.insId) {
        params.insId = params.insId[params.insId.length - 1];
      }
      if (params.orderTime) {
        let beginTime = this.$moment(params.orderTime[0]).format("YYYY-MM-DD ");
        let endTime = this.$moment(params.orderTime[1]).format("YYYY-MM-DD ");
        params.startTime = beginTime;
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
