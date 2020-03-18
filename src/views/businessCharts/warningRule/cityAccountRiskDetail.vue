<template>
  <div class="vlt-card plan-check">
    <panel title="账户风险指标详情" :show="true">
      <base-info :infoList="planList"></base-info>
      <p>
        <el-button type="primary" @click.native="goEdit" size="mini">修改</el-button>
        <el-button type="primary" @click.native="gotoList" size="mini">返回</el-button>
      </p>
    </panel>
  </div>
</template>

<script>
import informs from "@/utils/inform.js";
export default {
  name: "cityAccountRiskDetail",
  data() {
    return {
      planList: [
        { title: "区域名称", value: "", prop: "insName", show: false },
        {
          title: "监控频率(分钟/次)",
          value: "",
          prop: "collectFrequency",
          show: false
        },
        { title: "状态", value: "", prop: "collectStatus", show: false },
        {
          title: "最高充值-Ⅲ级",
          value: "",
          prop: "highestRechargeAmountOrdinary",
          show: false
        },
        {
          title: "最高充值-Ⅱ级",
          value: "",
          prop: "highestRechargeAmountSerious",
          show: false
        },
        {
          title: "最高充值-Ⅰ级",
          value: "",
          prop: "highestRechargeAmountMajor",
          show: false
        },
        {
          title: "最低充值-Ⅲ级",
          value: "",
          prop: "minimumRechargeAmountOrdinary",
          show: false
        },
        {
          title: "最低充值-Ⅱ级",
          value: "",
          prop: "minimumRechargeAmountSerious",
          show: false
        },
        {
          title: "最低充值-Ⅰ级",
          value: "",
          prop: "minimumRechargeAmountMajor",
          show: false
        },
        {
          title: "最高提现-Ⅲ级",
          value: "",
          prop: "highestWithdrawAmountOrdinary",
          show: false
        },
        {
          title: "最高提现-Ⅱ级",
          value: "",
          prop: "highestWithdrawAmountSerious",
          show: false
        },
        {
          title: "最高提现-Ⅰ级",
          value: "",
          prop: "highestWithdrawAmountMajor",
          show: false
        },
        {
          title: "最高缴款金额-Ⅲ级",
          value: "",
          prop: "highestPaymentAmountOrdinary",
          show: false
        },
        {
          title: "最高缴款金额-Ⅱ级",
          value: "",
          prop: "highestPaymentAmountSerious",
          show: false
        },
        {
          title: "最高缴款金额-Ⅰ级",
          value: "",
          prop: "highestPaymentAmountMajor",
          show: false
        },
        {
          title: "最低缴款金额-Ⅲ级",
          value: "",
          prop: "minimumPaymentAmountOrdinary",
          show: false
        },
        {
          title: "最低缴款金额-Ⅱ级",
          value: "",
          prop: "minimumPaymentAmountSerious",
          show: false
        },
        {
          title: "最低缴款金额-Ⅰ级",
          value: "",
          prop: "minimumPaymentAmountMajor",
          show: false
        },
        {
          title: "最低单厅余额-Ⅲ级",
          value: "",
          prop: "minimumHallAccountBalanceOrdinary",
          show: false
        },
        {
          title: "最低单厅余额-Ⅱ级",
          value: "",
          prop: "minimumHallAccountBalanceSerious",
          show: false
        },
        {
          title: "最低单厅余额-Ⅰ级",
          value: "",
          prop: "minimumHallAccountBalanceMajor",
          show: false
        },
        {
          title: "投注卡平均最低消费-Ⅲ级",
          value: "",
          prop: "avgConsumptionAmountMinOrdinary",
          show: false
        },
        {
          title: "投注卡平均最低消费-Ⅱ级",
          value: "",
          prop: "avgConsumptionAmountMinSerious",
          show: false
        },
        {
          title: "投注卡平均最低消费-Ⅰ级",
          value: "",
          prop: "avgConsumptionAmountMinMajor",
          show: false
        },
        { title: "Ⅲ级通知方式", value: "", prop: "informWayOrdinary",
          show: false },
        {
          title: "Ⅲ级通知对象",
          value: "",
          prop: "userNameOrdinary",
          show: false
        },
        {
          title: "Ⅲ级通知对象",
          value: "",
          prop: "userNameSeOrdinary",
          show: false
        },
        {
          title: "Ⅲ级通知对象",
          value: "",
          prop: "userNameThOrdinary",
          show: false
        },

        { title: "Ⅱ级通知方式", value: "", prop: "informWaySerious",
          show: false },
        {
          title: "Ⅱ级通知对象",
          value: "",
          prop: "userNameSerious",
          show: false
        },
        {
          title: "Ⅱ级通知对象",
          value: "",
          prop: "userNameSeSerious",
          show: false
        },
        {
          title: "Ⅱ级通知对象",
          value: "",
          prop: "userNameThSerious",
          show: false
        },

        { title: "Ⅰ级通知方式", value: "", prop: "informWayMajor",
          show: false },
        {
          title: "Ⅰ级通知对象",
          value: "",
          prop: "userNameMajor",
          show: false
        },
        {
          title: "Ⅰ级通知对象",
          value: "",
          prop: "userNameSeMajor",
          show: false
        },
        {
          title: "Ⅰ级通知对象",
          value: "",
          prop: "userNameThMajor",
          show: false
        },
        {
          title: "第一次监控时间",
          value: "",
          prop: "timingFirst",
          show: false
        },

        {
          title: "第二次监控时间",
          value: "",
          prop: "timingSecond",
          show: false
        },
        {
          title: "第三次监控时间",
          value: "",
          prop: "timingThird",
          show: false
        },
        {
          title: "第四次监控时间",
          value: "",
          prop: "timingFourth",
          show: false
        },
        {
          title: "第五次监控时间",
          value: "",
          prop: "timingFifth",
          show: false
        },
        { title: "第六次监控时间", value: "", prop: "timingSixth", show: false }
      ]
    };
  },
  components: {},
  methods: {
    //获取游戏风险指标详情.
    async cityAccountRiskDetail() {
      const id = this.$route.query.id;
      const self = this;
      const res = await self.$api.cityAccountRiskDetail({
        data: {
          businessKey: id
        }
      });
      if (res && res.code == 0) {
        let data = res;
        // 需要把百分制金额 除于 100 的字段
        let moneyArray = [
          "highestRechargeAmountOrdinary",
          "highestRechargeAmountSerious",
          "highestRechargeAmountMajor",
          "minimumRechargeAmountOrdinary",
          "minimumRechargeAmountSerious",
          "minimumRechargeAmountMajor",
          "highestWithdrawAmountOrdinary",
          "highestWithdrawAmountSerious",
          "highestWithdrawAmountMajor",
          "highestPaymentAmountOrdinary",
          "highestPaymentAmountSerious",
          "highestPaymentAmountMajor",
          "minimumPaymentAmountOrdinary",
          "minimumPaymentAmountSerious",
          "minimumPaymentAmountMajor",
          "minimumHallAccountBalanceOrdinary",
          "minimumHallAccountBalanceSerious",
          "minimumHallAccountBalanceMajor",
          "avgConsumptionAmountMinOrdinary",
          "avgConsumptionAmountMinSerious",
          "avgConsumptionAmountMinMajor"
        ];
        moneyArray.forEach(item => {
          data = self.toMoneyReal(data, item);
        });
        for (var item in data.data) {
          for (var i = 0; i < this.planList.length; i++) {
            if (item == this.planList[i].prop) {
              this.planList[i].value = data.data[item] ? data.data[item] : "-";

              if (
                item === "informWayOrdinary" ||
                item === "informWaySerious" ||
                item === "informWayMajor" ||
                item === "collectStatus"
              ) {
                var informWay = informs.showTextByType(item, data.data[item]);
                this.planList[i].value = informWay ? informWay : "-";
              }
              console.log(this.planList[i].value,item)  
              if (this.planList[i].value != "-") {
                this.planList[i].show = true;
              }
              break;
            }
          }
        }
      }
      console.log(this.planList);
    },
    // 转换金额 百分
    toMoneyReal(data, val) {
      for (let key in data) {
        if (typeof data[key] == "object") {
          if (data[key][val]) {
            data[key][val] = data[key][val] / 100;
          }
        }
        if (Array.isArray(data[key])) {
          data[key].forEach(item => {
            if (item[val]) {
              item[val] = item[val] / 100;
            }
          });
        }
      }
      return data;
    },
    //跳转账户风险指标编辑页
    goEdit() {
      this.$router.push({
        name: "cityAccountRiskEdit",
        query: {
          id: this.$route.query.id
        }
      });
    },
    //跳转账户风险指标列表页
    gotoList() {
      // this.eventBus.$emit('closeTag', 'cityAccountRiskDetail');
      this.$router.push({
        name: "cityAccountRisk"
      });
    }
  },
  mounted() {
    this.cityAccountRiskDetail();
  }
};
</script>

<style lang="less" scoped>
/deep/ .base-info .info-list .title {
  min-width: unset;
}
p {
  margin-right: 150px;
  margin-bottom: 10px;
  text-align: right;
}
</style>
