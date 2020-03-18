<template>
  <div class="vlt-card">
    <panel title="积分记录详情" style="margin-top: 10px;" :show="true">
      <base-info :infoList="infoList"></base-info>
    </panel>
  </div>
</template> 

<script type="text/javascript">
export default {
  name: "integralDetail",
  data() {
    return {
      infoList: [
        { title: "积分编号", value: "", prop: "recordId" },
        { title: "投注卡号", value: "", prop: "cardCode", show: true},
        { title: "账户类型", value: "", prop: "cardType", show: true},
        { title: "账户ID", value: "", prop: "purseId" },
        { title: "账户名称", value: "", prop: "memberName" },
        { title: "手机号码", value: "", prop: "mobile" },
        { title: "原积分", value: "", prop: "originalIntegral" }, 
        { title: "现积分", value: "", prop: "integralBalance" },
        { title: "变动积分", value: "", prop: "exchangeIntegral" },
        { title: "积分类型", value: "", prop: "integralType" },
        { title: "变更时间", value: "", prop: "createdTime" },
        { title: "积分规则", value: "", prop: "ruleContent", show: true}
      ]
    };
  },
  components: {},
  methods: {
    getType(val, name) {
      switch (name) {
        case "integralType":
          let option = {
            1: "充值",
            2: "消费",
            3: "注册",
            4: "登录",
            5: "在线时长",
            6: "建议反馈",
            7: "权益兑换",
            8: "试玩游戏点数兑换"
          };
          return option[val];
        case "cardType":
          let options = {
            0: "投注卡",
            1: "会员卡",
            2: "试玩卡"
          };
          return options[val];
        default:
          break;
      }
    },
    getIntegralRecord(val) {
      (async val => {
        let reslt = await this.$api.queryIntegralRecordById({ data: val });
        console.log(reslt, "积分详情");
        if (reslt && reslt.code === 0 && reslt.data) {
          let infoList = this.infoList;
          infoList.forEach(item => {
            item.value = reslt.data[item.prop];
            if (item.prop === "cardType") {
              item.value = this.getType(reslt.data[item.prop], "cardType") || null;
            } else if (item.prop === "integralType") {
              item.value = this.getType(reslt.data[item.prop], "integralType");
            };
            if (item.prop == "originalIntegral") {
              if (reslt.data.integralType == 7 || reslt.data.integralType == 8) {
                item.value = Number(reslt.data.integralBalance) + Number(reslt.data.exchangeIntegral)
              }else {
                item.value = Number(reslt.data.integralBalance) - Number(reslt.data.exchangeIntegral)
              }
            };
            if (item.prop == "createdTime") {
              item.value = reslt.data.createdTime ? this.$moment(reslt.data.createdTime).format('YYYY-MM-DD HH:mm:ss') : null
            }
            if (item.prop == "exchangeRuleId") {
              item.value = null
            };
            if (item.prop == "exchangeIntegral") {
              if (reslt.data.integralType == 7 || reslt.data.integralType == 8) {
                if (reslt.data.exchangeIntegral) {
                  item.value = "-" + reslt.data.exchangeIntegral;
                }else {item.value = 0}
              }else {
                if (reslt.data.exchangeIntegral) {
                  item.value = "+" + reslt.data.exchangeIntegral;
                }else{item.value = 0}
              }
            }
            
            if (reslt.data.integralType == 1 || reslt.data.integralType == 2) {
              if (item.prop == "cardCode") {
                if (reslt.data.cardType == 1) {
                  item.title = "会员卡号";
                } else if (reslt.data.cardType == 2) {
                  item.title = "试玩卡号"
                } else {
                  item.title = "投注卡号"
                }
              }
            }else if (reslt.data.integralType == 8) {
              this.infoList[11].show = false;
            }else {
              this.infoList[1].show = false;
              this.infoList[2].show = false;
            }
          });
        }
      })(val);
    }
  },
  created() {
    let id = this.$route.query.id;
    // if(this.$route.query.integralType!=7) {
    //   this.infoList.push({ title: "积分规则", value: "", prop: "ruleContent" })
    // }
    this.getIntegralRecord(id);
  }
};
</script>

<style lang="less" scoped>
</style>
