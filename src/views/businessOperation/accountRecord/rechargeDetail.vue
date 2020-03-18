<template>
  <div class="vlt-card">
    <panel title="充值记录详情" style="margin-top: 10px;" :show="true">
      <base-info :infoList="infoList"></base-info>
      <!-- <div style="display:flex; justify-content:flex-end">
        <el-button type="primary" style="margin:10px;" @click="()=>$router.go(-1)">返回</el-button>
      </div>-->
    </panel>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "rechargeDetail",
  data() {
    return {
      infoList: [
        { title: "订单编号", value: "", prop: "orderCode" },
        { title: "投注卡号", value: "", prop: "accountCode" },
        { title: "账户类型", value: "", prop: "accountType" },
        { title: "账户ID", value: "", prop: "accountId" },
        { title: "账户名称", value: "", prop: "memberName" },
        { title: "手机号码", value: "", prop: "mobile" },
        { title: "充值金额", value: "", prop: "orderAmount" },
        { title: "充值方式", value: "", prop: "payType" },
        { title: "账户余额", value: "", prop: "balanceAmount" },
        { title: "设备编号", value: "", prop: "deviceCode" },
        { title: "所属机构", value: "", prop: "insName" },
        { title: "操作人ID", value: "", prop: "operatorId" },
        { title: "操作人姓名", value: "", prop: "operatorName" },
        { title: "操作时间", value: "", prop: "createdTime" },
        { title: "交易描述", value: "", prop: "tradeTypeDesc" }
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
    }
  },
  created() {
    let id = this.$route.query.id;

    (async id => {
      let data = {
        page: 1,
        pageSize: 1,
        param: {
          orderId: id
        }
      };
      let res = await this.$api.queryRechargeRecord({ data: data });
      console.log(res, "获取区域信息");
      if (res && res.code === 0 && res.data) {
        let param = res.data.records[0];
        this.infoList.forEach(item => {
          item.value = param[item.prop] || "";
          if (item.prop === "accountType") {
            item.value = this.typeChange(param[item.prop], "accountType");
          } else if (item.prop === "payType") {
            item.value = this.typeChange(param[item.prop], "payType");
          } else if (item.prop === "orderAmount") {
            item.value = `${this.$common.thousandMark(param[item.prop])} 元`;
          } else if (item.prop === "balanceAmount") {
            item.value = `${this.$common.thousandMark(param[item.prop])} 元`;
          } else if (item.prop === "tradeTypeDesc") {
            item.value =
              (param["memberName"] || "匿名用户") +
              "于" +
              this.$moment(param["createdTime"]).format("YYYY-MM-DD HH:mm:ss") +
              "充值人民币" +
              param["orderAmount"] / 100 +
              "元";
          } else if (item.prop === "memberName") {
            item.value = param[item.prop] || "匿名用户";
          } else if (item.prop === "createdTime") {
            item.value = this.$moment(param[item.prop]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
        });
      }
    })(id);
  }
};
</script>

<style lang="less" scoped>
</style>
