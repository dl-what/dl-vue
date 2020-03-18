<template>
  <div class="vlt-card">
    <panel title="详细资料" style="margin-top: 10px;" :show="true">
      <base-info :infoList="infoList"></base-info>
    </panel>
  </div>
</template> 

<script type="text/javascript">
export default {
  name: "growthRecordDetails",
  data() {
    return {
      infoList: [
        { title: "积分编号", value: "", prop: "recordId" },
        { title: "投注卡号", value: "", prop: "cardCode" },
        { title: "账户类型", value: "", prop: "cardType" },
        { title: "账户ID", value: "", prop: "purseId" },
        { title: "账户名称", value: "", prop: "memberName" },
        { title: "手机号码", value: "", prop: "mobile" },
        { title: "原成长值", value: "", prop: "originalVal" }, 
        { title: "现成长值", value: "", prop: "growthBalance" },
        { title: "变动成长值", value: "", prop: "addGrowth" },
        { title: "成长值变动类型", value: "", prop: "growthType" },
        { title: "变更时间", value: "", prop: "createdTime" },
        { title: "成长值规则描述", value: "", prop: "ruleContent" }
      ]
    };
  },
  components: {},
  methods: {
    getType(val, name) {
      switch (name) {
        case "growthType":
          let option = {
            1: "充值",
            2: "消费",
            3: "注册",
            4: "登录",
            5: "在线时长",
            6: "建议反馈",
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
        let reslt = await this.$api.getGrowthDetail({ data: val });
        console.log(reslt, "成长值详情");
        if (reslt && reslt.code === 0 && reslt.data) {
          let infoList = this.infoList;
          infoList.forEach(item => {
            item.value = reslt.data[item.prop];
            if (item.prop === "cardType") {
              item.value = this.getType(reslt.data[item.prop], "cardType") || null;
            } else if (item.prop === "growthType") {
              item.value = this.getType(reslt.data[item.prop], "growthType");
            };
            if (item.prop == "createdTime") {
              item.value = reslt.data.createdTime ? this.$moment(reslt.data.createdTime).format('YYYY-MM-DD HH:mm:ss') : null
            }
            if (item.prop == "originalVal") {
              item.value = Number(reslt.data.growthBalance) - Number(reslt.data.addGrowth);
            }
            if (item.prop == "addGrowth") {
              if (reslt.data.addGrowth) {
                item.value = "+" + reslt.data.addGrowth;
              } else {
                item.value = 0;
              }
            }
          });
        }
      })(val);
    }
  },
  created() {
    let id = this.$route.query.id;
    this.getIntegralRecord(id);
  }
};
</script>

<style lang="less" scoped>
</style>
