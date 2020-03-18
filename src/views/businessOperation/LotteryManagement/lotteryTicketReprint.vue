<template>
  <div class="vlt-card">
    <div class="lotteryPrint">
      <panelStatic title="打印兑奖单" class="containner">
        <div class="print-content" ref="print">
          <h2 class="print-title">中国福利彩票发行中心兑奖单</h2>
          <table class="print-table">
            <thead>
              <tr>
                <th width="25%"></th>
                <th width="25%"></th>
                <th width="25%"></th>
                <th width="25%"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="2"></td>
                <td class="tc" colspan="2">NO. 0135131315315</td>
              </tr>
              <tr>
                <td>游戏名称：{{lotteryTicket.gameName}}</td>
                <td>投注卡号：{{lotteryTicket.cardCode}}</td>
                <td>投注卡类型：{{lotteryTicket.userType}}</td>
                <td>流水号：{{lotteryTicket.transactionId}}</td>
              </tr>
              <tr>
                <td colspan="2">设备编号：{{lotteryTicket.deviceCode}}</td>
                <td>兑奖方式：柜员机</td>
                <td>有效性：有效</td>
              </tr>
              <tr>
                <td colspan="2">销售时间：{{lotteryTicket.timeBet}}</td>
                <td colspan="2">兑奖时间：{{lotteryTicket.timeCash}}</td>
              </tr>
              <tr>
                <td class="tl" colspan="4">
                  <span>中奖情况：</span>
                  <span class="text">{{lotteryTicket.winDetail}}</span>
                </td>
              </tr>
              <tr>
                <td class="tl">中奖金额：{{lotteryTicket.winAmount}}元</td>
                <td class="tc" colspan="2">税金：{{lotteryTicket.actualTax}}元</td>
                <td class="tl">实兑金额：{{lotteryTicket.actualMoney}}元</td>
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
                <td class="pt20 tl">兑奖操作员：</td>
                <td class="pt20 tc" colspan="2">技术负责人：</td>
                <td class="pt20 tl">中心负责人：</td>
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
            <el-button type="primary" size="mini" @click="print">打印</el-button>
          </p>
        </div>
      </panelStatic>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      lotteryTicket: "",
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
    async init() {
      let data = {
        cardCode: this.$route.query.cardCode,
        transactionId: this.$route.query.transactionId
      };
      let result = await this.$api.getBigLotteryPrint({ data });
      let res = result.data;
      if (res.userType === 0) {
        res.userType = "投注卡";
      } else if (res.userType === 1) {
        res.userType = "会员卡";
      } else if (res.userType === 2) {
        res.userType = "试玩卡";
      } else {
        res.userType = "电子投注卡";
      }
      // if (res.betTime) {
      //   res.betTime = this.$moment(res.betTime).format("YYYY-MM-DD HH:mm:ss");
      // }
      // if (res.cashMethod === 1) {
      //   res.cashMethod = "柜员机";
      // } else {
      //   res.cashMethod = "销售厅";
      // }
      if (res.timeBet) {
        res.timeBet = this.$moment(res.timeBet).format("YYYY-MM-DD HH:mm:ss");
      }
      if (res.timeCash) {
        res.timeCash = this.$moment(res.timeCash).format("YYYY-MM-DD HH:mm:ss");
      }
      let betAmount = res.betAmount == null ? "" : res.betAmount;
      let winDetail =
        "奖等：" +
        res.grade +
        "，中奖个数：" +
        1 +
        " , " +
        "倍数：" +
        1 +
        " , " +
        "单注投注金额：" +
        betAmount;

      // let arr = res.winDetail.split(";|");
      // let str = "";
      // arr.forEach(list => {
      //   if (list != "") {
      //     str += `奖等: ${list.split(";")[1]}, 中奖个数: ${
      //       list.split(";")[2]
      //     }, 倍数: ${list.split(";")[3]}, 单注中奖金额: ${self.changeNumber(
      //       list.split(";")[4]
      //     )}元; `;
      //   }
      //});
      //self.lotteryData.winDetail = str;
      //}
      console.log(result.data.userType);

      this.lotteryTicket = result.data;
      this.lotteryTicket = {
        ...this.lotteryTicket
      };
      this.lotteryTicket.winDetail = winDetail;
      console.log(this.lotteryTicket);
      //this.lotteryTicket = result.data;

      console.log(result);
    },
    print() {
      this.$print(this.$refs.print); // 使用
    }
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
    padding: 0 95px;

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
