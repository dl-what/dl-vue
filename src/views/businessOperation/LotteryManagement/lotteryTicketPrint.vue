<template>
  <div class="vlt-card">
    <div class="lotteryPrint">
      <panel title="打印兑奖单" class="containner" :show="true">
        <div class="print-content" ref="print">
          <h2 class="print-title">中国福利彩票发行中心兑奖单</h2>
          <table class="print-table">
            <thead>
              <tr>
                <th width="33%"></th>
                <th width="33%"></th>
                <th width="33%"></th>
              </tr>
            </thead>
            <tbody>
              <!-- <tr>
                <td colspan="2"></td>
                <td class="tc" colspan="2">NO. 0135131315315</td>
              </tr> -->
              <tr>
                <td></td>
              </tr>
              <tr>
                <td>游戏名称：{{lotteryTicket.gameName}}</td>
                <td>投注卡号：{{lotteryTicket.cardCode}}</td>
                <!-- <td>投注卡类型：{{lotteryTicket.userType}}</td> -->
                <td>流水号：{{lotteryTicket.transactionId}}</td>
              </tr>
              <tr>
                <!-- <td colspan="2">设备编号：{{lotteryTicket.deviceCode}}</td> -->

                <!-- <td>有效性：有效</!-->
              </tr>
              <tr>
                <td>投注卡类型：{{lotteryTicket.userType}}</td>
                <td>中奖时间：{{lotteryTicket.timeWin}}</td>
                <td>兑奖时间：{{lotteryTicket.timeCash}}</td>
              </tr>
              <tr>
                <td class="tl" colspan="4">
                  <span>以下为中奖详情：</span>
                  <span class="text">{{lotteryTicket.winDetail}}</span>
                </td>
              </tr>
              <tr v-for="(item,index) in tableData" :key="index">
                <td>中奖注序号：{{item.betSn}}</td>
                <td >中奖奖等：{{item.gradeType==1?'固定奖':'累计奖'}}({{item.grade}})</td>
                <td>中奖金额：{{changeNumber(item.winAmount)}}元</td>
              </tr>
              <tr>
                <td></td>
              </tr>
              <tr>
                <td class="tl">中奖总金额：{{changeNumber(lotteryTicket.totalAmount)}} 元</td>
                <td>税金：{{changeNumber(lotteryTicket.actualTax)}} 元</td>
                <td class="tl">实兑金额：{{changeNumber(lotteryTicket.actualMoney)}} 元</td>
              </tr>
              <tr>
                <td class="pt" colspan="2">中奖人姓名：{{lotteryTicket.name}}</td>
                <td class="pt" colspan="2">联系电话：{{lotteryTicket.mobile}}</td>
              </tr>
              <tr>
                <td class="dashed" colspan="2">身份证号：{{lotteryTicket.idCard}}</td>
                <td class="dashed" colspan="2">
                  <span>家庭地址：</span>
                  <span class="text">{{lotteryTicket.address}}</span>
                </td>
              </tr>
              <tr>
                <td class="pt20 tl">兑奖操作员：{{lotteryTicket.operatorUser}}</td>
                <!-- <td class="pt20 tc" colspan="2">负责人：</td> -->
              </tr>
              <tr>
                <td class="time" colspan="2"></td>
                <td class="time tr" colspan="2">打印时间：{{printTime}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <p class="btn-print">
            <el-button
              type="primary"
              size="mini"
              @click="print"
              :id="$route.name + '-' + 'print'"
            >打印</el-button>
          </p>
        </div>
      </panel>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      lotteryTicket: {
        gameName: null, // 游戏名称
        cardCode: null, // 投注卡号
        userType: null, // 投注卡类型
        transactionId: null, // 流水号
        deviceCode: null, // 设备编号
        timeWin: null, // 中奖时间
        timeCash: null, // 兑奖时间
        winDetail: null, // 中奖情况
        winAmount: null, // 中奖金额
        actualTax: null, // 实缴税额
        actualMoney: null, // 实兑金额
        name: null, // 中奖人姓名
        mobile: null, // 联系电话
        idCard: null, // 身份证号
        address: null, // 地址
        operatorUser: null, // 操作员
        totalAmount: null, // 中奖总金额
        tableData: null,
      },
      printTime: ""
    };
  },
  created() {
    this.printTime = this.$moment(new Date().getTime()).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    this.init();
  },
  methods: {
    //转化千分符
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
    async init() {
      let data = {
        cardCode: this.$route.query.cardCode,
        transactionId: this.$route.query.transactionId
      };
      let res = await this.$api.InquireDetail({ data });

      this.tableData = res.data.gameWinRecords;
      let count = 0;
      this.tableData.forEach((item)=>{
        count += item.winAmount;
      })
      // 兑奖信息
      let gameWinRecords = res.data.gameWinRecords;
      this.lotteryTicket.operatorUser = res.data.operatorUser
      this.lotteryTicket.totalAmount = count
      this.lotteryTicket.gameName = gameWinRecords[0].gameName; // 游戏名称
      this.lotteryTicket.cardCode = gameWinRecords[0].cardCode; // 投注卡号
      this.lotteryTicket.transactionId = gameWinRecords[0].transactionId; // 流水号
      this.lotteryTicket.deviceCode = gameWinRecords[0].deviceCode; // 设备编号
      this.lotteryTicket.timeWin = gameWinRecords[0].timeWin?this.$moment(gameWinRecords[0].timeWin).format("YYYY-MM-DD HH:mm:ss"):''; // 销售时间
      this.lotteryTicket.timeCash = gameWinRecords[0].timeCash?this.$moment(gameWinRecords[0].timeCash).format("YYYY-MM-DD HH:mm:ss"):''; // 兑奖时间
      let userTypeName;
      if (gameWinRecords[0].userType === 0) {
        userTypeName = "投注卡";
      } else if (gameWinRecords[0].userType === 1) {
        userTypeName = "会员卡";
      } else if (gameWinRecords[0].userType === 2) {
        userTypeName = "试玩卡";
      } else {
        userTypeName = "电子投注卡";
      }
      this.lotteryTicket.userType = userTypeName; // 投注卡类型

      // 兑奖人信息
      let cashPrizePerson = res.data.cashPrizePerson;
      this.lotteryTicket.name = cashPrizePerson.name;
      this.lotteryTicket.idCard = cashPrizePerson.idCard;
      this.lotteryTicket.mobile = cashPrizePerson.mobile;
      this.lotteryTicket.address = cashPrizePerson.address;
      this.lotteryTicket.actualTax = cashPrizePerson.actualTax; // 税金
      this.lotteryTicket.actualMoney = cashPrizePerson.actualMoney; // 实兑金额

    },
    print() {
      this.$print(this.$refs.print); // 使用
    }
    // lineList(name) {
    //   let array = [];
    //   if (name.gameRound) {
    //     array.push(`${name.gameRound}局，`);
    //   } else if (name.gameLevel) {
    //     array.push(`${name.gameLevel}关，`);
    //   } else if (name.gameSpin) {
    //     array.push(`${name.gameSpin}拍，`);
    //   }
    //   return array.join(" ");
    // }
    // translate(val) {
    //   let options = {
    //     0: "投注卡",
    //     1: "会员卡",
    //     2: "试玩卡",
    //     3: "电子投注卡"
    //   };
    //   return options[val];
    // }
  }
};
</script>

<style lang="less" scoped>
.print {
  &-content {
    padding: 0 80px;

    .tr {
      text-align: right;
    }
    .tc {
      text-align: center;
    }
    .tl {
      text-align: left;
    }
    td {
      font-size: 14px;
      padding-bottom: 20px;
    }
    .pt {
      padding: 20px 0 40px;
      border-top: 1px dashed black;
    }
    .dashed {
      border-bottom: 1px dashed black;
    }
    .pt20 {
      padding-top: 20px;
    }
    .time {
      padding: 30px 20px;
    }
  }
  &-title {
    padding: 30px 0 20px;
    font-size: 18px;
    text-align: center;
  }
  &-table {
    width: 100%;
    // padding-left: 20px;
  }
}

.btn-print {
  text-align: center;
  padding: 20px 0 40px;
  .el-button {
    padding: 8px 30px;
  }
}
.text {
  word-break: break-all;
}
</style>
