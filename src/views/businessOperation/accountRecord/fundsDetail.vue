<template>
  <div class="vlt-card">
    <panel title="资金流水详情" style="margin-bottom: 15px;" :show="true">
      <base-info :infoList="infoList"></base-info>
    </panel>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "fundsDetail",
  data() {
    return {
      infoList: [
        { title: "流水ID", value: "", prop: "orderCode" },
        { title: "投注卡号", value: "", prop: "accountCode" },
        { title: "账户类型", value: "", prop: "accountType" },
        { title: "账户ID", value: "", prop: "purseId" },
        { title: "账户名称", value: "", prop: "memberName" },
        { title: "手机号码", value: "", prop: "mobile" },
        { title: "账户余额", value: "", prop: "balanceAmount" },
        { title: "变动金额", value: "", prop: "orderAmount" },
        { title: "变动前余额", value: "", prop: "beforeAmount" },
        { title: "流水类型", value: "", prop: "tradeType" },
        { title: "变更时间", value: "", prop: "createdTime" },
        { title: "设备编号", value: "", prop: "deviceCode" },
        { title: "所属机构", value: "", prop: "insName" }
      ]
    };
  },
  components: {},
  methods: {
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
        default:
          break;
      }
    }
  },
  created() {
    let orderCode = this.$route.query.orderCode;
    let tradeType = this.$route.query.tradeType;
    (async () => {
      let data = {
        page: 1,
        pageSize: 1,
        param: {
          orderCode,
          tradeType
        }
      };
      let res = await this.$api.queryFundRecord({ data });
      console.log(res, "资金流水");
      let param = res.data.records[0] || "";
      this.infoList.forEach(item => {
        item.value = param[item.prop];
        if (item.prop === "accountType") {
          item.value = this.typeChange(param[item.prop], "accountType");
        } else if (item.prop === "tradeType") {
          item.value = this.typeChange(param[item.prop], "tradeType");
        } else if (item.prop === "createdTime") {
          item.value = this.$moment(param[item.prop]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else if (item.prop === "balanceAmount") {
          item.value = `${this.$common.thousandMark(param[item.prop])} 元`;
        } else if (item.prop === "orderAmount") {
          item.value = `${this.$common.thousandMark(param[item.prop])} 元`;
        } else if (item.prop === "beforeAmount") {
          item.value = `${this.$common.thousandMark(param[item.prop])} 元`;
        };
        if (item.prop == "memberName") {
          item.value = item.value ? param[item.prop] : "匿名用户";
        };
        if (item.prop == "accountCode") {
          if (param.accountType == 0) {
            item.title = '投注卡号'
          } else if (param.accountType == 1) {
            item.title = '会员卡号'
          } else if(param.accountType == 2) {
            item.title = '试玩卡号'
          } else if (param.accountType == 3) {
            item.title = '电子投注卡号'
          } else {
            item.title = '合作伙伴'
          }
        }
      });
    })();
  }
};
</script>

<style lang="less" scoped>
</style>
