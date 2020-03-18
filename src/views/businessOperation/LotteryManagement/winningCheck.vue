<template>
  <div class="vlt-card">
    <div class="winning">
      <search-bar :options="options" :total="num" @search="search" @change="formChange" labelWidth="6em"></search-bar>
      <el-table :data="tableData" border>
        <el-table-column prop="lotteryTicketNum" label="序号" type="index" width="60">
          <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="cardCode" label="投注卡ID" min-width="180"></el-table-column>
        <el-table-column prop="userType" label="投注卡类型" min-width="120"></el-table-column>
        <el-table-column prop="insName" label="所属机构" min-width="120"></el-table-column>
        <el-table-column prop="gameName" label="游戏名称" min-width="120"></el-table-column>
        <el-table-column prop="transactionId" label="订单编号" min-width="250"></el-table-column>
        <el-table-column prop="winAmount" label="中奖金额(元)" min-width="120"></el-table-column>
        <el-table-column prop="timeWin" label="中奖时间" min-width="180"></el-table-column>
        <el-table-column prop="cashStatus" label="兑奖状态" min-width="120"></el-table-column>
        <el-table-column label="操作" fixed="right" min-width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="lotteryTicketExpiry(scope.row)"
              v-has="'winningCheck-expiry'"
              :id="$route.name + '-' + 'expiry' + scope.$index"
            >兑奖</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="lotteryTicketDetail(scope.row)"
              v-has="'winningCheck-detail'"
              :id="$route.name + '-' + 'detail' + scope.$index"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <tablePaging
        :total="num"
        :currentPage="page"
        :pageSize="pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></tablePaging> -->
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'winningCheck',
  data() {
    const self = this;
    return {
      form: {},
      //搜索总数
      num: 0,

      //搜索框数据
      options: [
        {
          type: "input",
          prop: "cardCode",
          value: "",
          title: "投注卡ID",
          bindDevice: {
            // 绑定设备
            type: "IDC",
            label: "设备读取",
            socketUrl: self.$store.state.IDC_SocketUrl
          },
          placeholder: "请输入"
        },
        {
          type: "input",
          prop: "transFlowNo",
          value: "",
          title: "兑奖码",
          bindDevice: {
            // 绑定设备
            type: "SCAN",
            label: "设备扫码",
            socketUrl: self.$store.state.IDC_SocketUrl
          },
          placeholder: "请输入"
        }
      ],
      //表格数据
      tableData: [],
      page: 0,
      pageSize: 20,
      current: 0,
      num: 0,
      searchForm: {},
      param: {}
    };
  },
  created() {
    this.eventBus.$on("idcVerifySuccess", data => {
      //console.log(data);
      let cardCode = data.cardCode;
      let password = data.cardPwd;

      this.param = {
        cardCode,
        password
      };
    });
    this.eventBus.$on("scan_input_complete", code => {
      console.log("scan_input_complete", code);
    });
  },
  watch: {
    "form.cardCode"(val) {
      if (val.length == 16) {
        this.eventBus.$emit("idc_input_complete", val);
      }
    }
  },
  methods: {
    async init(val) {
      let data = {
        page: val || 1,
        pageSize: this.pageSize,
        param: {
          ...this.searchForm
        }
      };
      let result = await this.$api.getLotteryData({ data });
      if (result && result.code == 0) {
        this.num = result.data.total;
        this.page = result.data.current;
        // this.pageSize = result.data.size;
        result.data.records.forEach(item => {
          item.timeWin = this.$moment(item.timeWin).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          item.winAmount = this.changeNumber(item.winAmount);
          if (item.cashStatus == 0) {
            item.cashStatus = "未兑奖";
          } else if (item.cashStatus == 1) {
            item.cashStatus = "已兑奖";
          } else {
            item.cashStatus = "已弃奖";
          }
          if (item.userType == 0) {
            item.userType = "投注卡";
          } else if (item.userType == 1) {
            item.userType = "会员卡";
          } else if (item.userType == 2) {
            item.userType = "试玩卡";
          } else {
            item.userType = "电子投注卡";
          }
        });
        console.log(result);
        this.tableData = result.data.records;
      }
      console.log(result);
    },
    formChange(form) {
      this.form = form;
    },
    //点击查询
    search(param) {
      console.log(param);
      let arr = Object.entries(param);
      console.log(arr);
      if (arr.length >= 2) {
        this.searchForm = {
          ...param,
          ...this.param
        };
        this.$storage.set("carcode", JSON.stringify(this.param));
        this.init();
      } else {
        this.$message.warning("投注卡ID和兑奖码不能为空");

        console.log(this.searchForm);
      }

      //this.init();
    },
    // 转换千分符
    changeNumber(val) {
      let reg = /\d{1,3}(?=(\d{3})+$)/g;
      var arr = (val / 100)
        .toFixed(2)
        .toString()
        .split(".");
      var x = arr[0];
      var y = arr[1];
      return `${x.replace(reg, "$&,")}.${y}`;
    },
    //点击兑奖
    lotteryTicketExpiry(row) {
      this.$router.push({
        name: "lotteryTicketExpiry",
        query: {
          betSn: row.betSn,
          grade: row.grade,
          transactionId: row.transactionId,
          winAmount: row.winAmount
        }
      });
    },
    //点击查看
    lotteryTicketDetail(row) {
      this.$router.push({
        name: "winningCheckDetail",
        query: {
          cardCode: row.cardCode,
          transactionId: row.transactionId
        }
      });
    },
    handleCurrentChange(val) {
      this.current = val;
      console.log(this.current);
      this.init(val);
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.init();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
