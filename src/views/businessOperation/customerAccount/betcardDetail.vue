<template>
  <div class="vlt-card">
    <section class="comp-item">
      <panel title="基本信息" style="margin-top: 10px;" :show="true">
        <base-info :infoList="infoList"></base-info>
      </panel>
      <panel title="客户信息" style="margin-top: 10px;" :show="true">
        <base-info :infoList="infoList2"></base-info>
      </panel>
    </section>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      infoList: [
        { title: "批次", value: "", prop: "batch" },
        { title: "投注卡类型", value: "", prop: "bettingCardType" },
        { title: "所属机构", value: "", prop: "insName" },
        { title: "投注卡编号", value: "", prop: "cardNumber" },
        { title: "有效日期", value: "", prop: "gameCode" },
        { title: "投注卡状态", value: "", prop: "cardStatus" },
        { title: "卡上余额", value: "", prop: "purseId" },
        { title: "累计消费", value: "", prop: "gameName" }
      ],
      infoList2: [
        { title: "姓名", value: "", prop: "memberName" },
        { title: "性别", value: "", prop: "sex" },
        { title: "年龄", value: "", prop: "age" },
        { title: "地址", value: "", prop: "address" },
        { title: "身份证", value: "", prop: "userCode" }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let ins = this.$route.query.cardCode;
      let info = this.$route.query.userId;
      // console.log(this.$route.params.params);
      let data = {
        cardCode: ins,
        userId: info
      };
      // let cardCode = 6016060000000008;
      let result = await this.$api.getMoneyDetai({ data });
      console.log(result);
      this.infoList2.forEach(item => {
        console.log(item);
        item.value = result.data.userInfoVo.user[item.prop];
        if (item.prop === "sex") {
          item.value = item.value === 1 ? "男" : "女";
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
