<template>
  <div class="vlt-card">
    <div class="lotteryTicket">
      <search-bar :options="options" :total="num" @search="search" labelWidth="6em"></search-bar>
      <el-table :data="lotteryTicketTableData" border>
        <el-table-column prop="lotteryTicketNum" label="序号" type="index" width="55px" fixed="left">
          <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="transactionId" label="订单编号" min-width="200"></el-table-column>
        <el-table-column prop="cardCode" label="投注卡ID" min-width="160"></el-table-column>
        <el-table-column prop="userType" label="投注卡类型" min-width="120">
          <template slot-scope="scope">
            <span
              class="icon-tag"
              :class="{
              blue:scope.row.userType=='0',
              green:scope.row.userType=='1',
              grey:scope.row.userType=='4',
              yellow:scope.row.userType=='3',
              red:scope.row.userType=='2',
              }"
            >{{scope.row.strUserType}}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="winAmount" label="中奖金额(元)" min-width="140"></el-table-column>
        <el-table-column prop="cashStatus" label="兑奖状态" min-width="100px">
          <template slot-scope="scope">
            <span
              class="icon-circle"
              :class="{
              blue:scope.row.cashStatus=='3',
              green:scope.row.cashStatus=='1',
              grey:scope.row.cashStatus=='4',
              yellow:scope.row.cashStatus=='5',
              red:scope.row.cashStatus=='2',
              }"
            >{{scope.row.strCashStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="insName" label="所属机构" min-width="120px"></el-table-column>
        <el-table-column prop="gameName" label="游戏名称" min-width="120px"></el-table-column>
        <el-table-column prop="timeWin" label="中奖时间" min-width="160"></el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button 
              type="primary"
              size="mini"
              @click="lotteryTicketExpiry(scope.row)"
              v-if="scope.row.cashStatus=='未兑奖'"
            >兑奖</el-button>-->
            <el-button
              type="primary"
              size="mini"
              @click="lotteryTicketDetail(scope.row)"
              v-has="'lotteryTicket-detail'"
              :id="$route.name + '-' + 'detail' + scope.$index"
            >查看</el-button>
            <el-button
              type=""
              size="mini"
              @click="lotteryTicketPrint(scope.row)"
              :disabled="scope.row.cashStatus!='1'"
              v-has="'lotteryTicket-print'"
              :id="$route.name + '-' + 'print' + scope.$index"
            >打印</el-button>
            <!-- <el-button
              type="primary"
              size="mini"
              @click="lotteryTicketReprint(scope.row)"
              v-if="scope.row.cashStatus=='已兑奖'"
            >补打</el-button>-->
            
          </template>
        </el-table-column>
      </el-table>
      <tablePaging
        :total="num"
        :currentPage="page"
        :pageSize="pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></tablePaging>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "",
  data() {
    const self = this;
    return {
      //搜索总数
      num: "",
      //搜索的表单类型数据
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
            socketUrl: self.$store.state.IDC_SocketUrl,
            disValid: true // 关闭密码验证
          },
          placeholder: "请输入"
        },
        {
          type: "select",
          prop: "cashStatus",
          value: "",
          title: "兑奖状态",
          placeholder: "请输入",
          options: [
            {
              label: "已兑奖",
              value: 1
            },
            {
              label: "已弃奖",
              value: 2
            }
          ]
        },
        {
          type: "cascader",
          prop: "insId",
          value: "",
          title: "所属机构",
          placeholder: "请输入",
          setProps: {
            children: "children",
            value: "id",
            label: "text",
            checkStrictly: true
          }
        },
        {
          type: "datepicker-range",
          prop: "timeWin",
          value: "",
          title: "中奖时间",
          placeholder: ["开始时间", "结束时间"]
        }
      ],
      //表格数据
      lotteryTicketTableData: [],
      //页数
      page: 0,
      //条数
      pageSize: 20,
      current: 0,
      num: 0,
      searchForm: {}
    };
  },

  created() {
    this.init();
  },
  methods: {
    //初始化数据
    async init(val) {
      //机构数据
      let res = await this.$api.getInsTree();
      this.options[2].options = res.data;
      console.log(res);
      let data = {
        page: val || 1,
        pageSize: this.pageSize,
        param: {
          ...this.searchForm
        }
      };
      console.log(data);
      let result = await this.$api.getBigLottery({ data });
      if (result && result.code === 0) {
        this.num = result.data.total;
        this.page = result.data.current;
        // this.pageSize = result.data.size;
        result.data.records.forEach(item => {
          item.timeWin = moment(item.timeWin).format("YYYY-MM-DD HH:mm:ss");
          if (item.cashStatus == 0) {
            item.strCashStatus = "未兑奖";
          } else if (item.cashStatus == 1) {
            item.strCashStatus = "已兑奖"
          }else {
            item.strCashStatus = "已弃奖";
          }
          if (item.winAmount) {
            item.winAmount = this.changeNumber(item.winAmount);
          }
          if (item.userType === 0) {
            item.strUserType = "投注卡";
          } else if (item.userType === 1) {
            item.strUserType = "会员卡";
          } else if (item.userType === 2) {
            item.strUserType = "试玩卡";
          } else {
            item.strUserType = "电子投注卡";
          }
        });
        console.log(result);
        this.lotteryTicketTableData = result.data.records;
      }
    },
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
    handleCurrentChange(val) {
      this.current = val;
      console.log(this.current);
      this.init(val);
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    //点击搜索
    search(val) {
      console.log(val);
      if (val.insId) {
        val.insId = val.insId[val.insId.length - 1];
      }

      if (val.timeWin && val.timeWin.length > 0) {
        val.prizeBeginDate = this.$moment(val.timeWin[0]).format("YYYY-MM-DD");
        val.prizeEndDate = this.$moment(val.timeWin[1]).format("YYYY-MM-DD");
        delete val.timeWin;
      }
      this.searchForm = {
        ...val
      };
      console.log(this.searchForm);
      this.init();
      // console.log(param);
    },
    //formChange(form) {},

    //点击兑奖
    lotteryTicketExpiry(row) {
      this.$router.push({
        name: "lotteryTicketExpiry",
        query: {
          betSn: row.betSn,
          grade: row.grade,
          winGrade: row.winGrade,
          transactionId: row.transactionId
        }
      });
    },
    //点击打印
    lotteryTicketPrint(row) {
      this.$router.push({
        name: "lotteryTicketPrint",
        query: {
          cardCode: row.cardCode,
          transactionId: row.transactionId
        }
      });
    },
    //点击补打
    lotteryTicketReprint(row) {
      this.$router.push({
        name: "lotteryTicketRePrint",
        query: {
          cardCode: row.cardCode,
          transactionId: row.transactionId
        }
      });
    },
    //点击详情
    lotteryTicketDetail(row) {
      this.$router.push({
        name: "lotteryTicketDetail",
        query: {
          cardCode: row.cardCode,
          transactionId: row.transactionId
        }
      });
    },
    //表单change事件
    lotteryTicketchangeForm() {}
  }
};
</script>

<style lang="less" scoped>
</style>
