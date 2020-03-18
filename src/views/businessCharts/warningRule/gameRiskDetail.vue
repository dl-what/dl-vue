<template>
  <div class="vlt-card plan-check">
    <panel title="游戏风险指标详情" :show="true">
      <base-info :infoList="planList"></base-info>
      <p>
        <el-button type="primary" @click.native="goEdit" size="mini">修改</el-button>
        <el-button type="primary" @click.native="gotoList" size="mini">返回</el-button>
      </p>
    </panel>
  </div>
</template>

<script type="text/javascript">
import informs from "@/utils/inform.js";
export default {
  name: "warningWatchDetail",
  data() {
    return {
      planList: [
        { title: "区域名称", value: "", prop: "insName" },
        { title: "游戏", value: "", prop: "gameName" },
        { title: "状态", value: "", prop: "collectStatus" },
        {
          title: "最低返奖率-Ⅲ级",
          value: "",
          prop: "minimumReturnRateOrdinary"
        },
        {
          title: "最低返奖率-Ⅱ级",
          value: "",
          prop: "minimumReturnRateSerious"
        },
        {
          title: "最低返奖率-Ⅰ级",
          value: "",
          prop: "minimumReturnRateMajor"
        },
        {
          title: "最高返奖率-Ⅲ级",
          value: "",
          prop: "highestReturnRateOrdinary"
        },
        {
          title: "最高返奖率-Ⅱ级",
          value: "",
          prop: "highestReturnRateSerious"
        },
        {
          title: "最高返奖率-Ⅰ级",
          value: "",
          prop: "highestReturnRateMajor"
        },

        {
          title: "最高大奖数量-Ⅲ级",
          value: "",
          prop: "highestBigPrizeNumOrdinary"
        },
        {
          title: "最高大奖数量-Ⅱ级",
          value: "",
          prop: "highestBigPrizeNumSerious"
        },
        {
          title: "最高大奖数量-Ⅰ级",
          value: "",
          prop: "highestBigPrizeNumMajor"
        },

        {
          title: "最高大奖金额-Ⅲ级",
          value: "",
          prop: "highestBigPrizeAmountOrdinary"
        },
        {
          title: "最高大奖金额-Ⅱ级",
          value: "",
          prop: "highestBigPrizeAmountSerious"
        },
        {
          title: "最高大奖金额-Ⅰ级",
          value: "",
          prop: "highestBigPrizeAmountMajor"
        },

        {
          title: "最高兑奖金额-Ⅲ级",
          value: "",
          prop: "highestCashPrizeAmountOrdinary"
        },
        {
          title: "最高兑奖金额-Ⅱ级",
          value: "",
          prop: "highestCashPrizeAmountSerious"
        },
        {
          title: "最高兑奖金额-Ⅰ级",
          value: "",
          prop: "highestCashPrizeAmountMajor"
        },
 { title: "Ⅲ级通知方式", value: "", prop: "informWayOrdinary" },
        {
          title: "Ⅲ级通知对象",
          value: "",
          prop: "userNameOrdinary"
        },
        {
          title: "Ⅲ级通知对象",
          value: "",
          prop: "userNameSeOrdinary"
        },
        {
          title: "Ⅲ级通知对象",
          value: "",
          prop: "userNameThOrdinary"
        },
       

        { title: "Ⅱ级通知方式", value: "", prop: "informWaySerious" },
        {
          title: "Ⅱ级通知对象",
          value: "",
          prop: "userNameSerious"
        },
       {
          title: "Ⅱ级通知对象",
          value: "",
          prop: "userNameSeSerious"
        },
        {
          title: "Ⅱ级通知对象",
          value: "",
          prop: "userNameThSerious"
        },

        { title: "Ⅰ级通知方式", value: "", prop: "informWayMajor" },
        {
          title: "Ⅰ级通知对象",
          value: "",
          prop: "userNameMajor"
        },
        {
          title: "Ⅰ级通知对象",
          value: "",
          prop: "userNameSeMajor"
        },
        {
          title: "Ⅰ级通知对象",
          value: "",
          prop: "userNameThMajor"
        },
        
        { title: "监控频率(分钟/次)", value: "", prop: "collectFrequency" }
      ]
    };
  },
  components: {},
  methods: {
    //返回游戏风险列表
    gotoList() {
      this.$router.push({
        name: "cityGameRisk"
      });
    },
    //获取游戏风险指标详情.
    async getGameRiskDetail() {
      const id = this.$route.query.id;
      const self = this;
      const res = await self.$api.getGameRiskDetail({
        data: {
          businessKey: id
        }
      });
      if (res && res.code == 0) {
        if (!res.data.informWayMajor) {
          res.data.informTotalCountMajor = null;
        }
        if (!res.data.informWaySerious) {
          res.data.informTotalCountSerious = null;
        }
        if (!res.data.informWayOrdinary) {
          res.data.informTotalCountOrdinary = null;
        }
         let data = res;
          // 需要把百分制金额 除于 100 的字段
          let moneyArray = [
          'highestBigPrizeAmountOrdinary','highestBigPrizeAmountSerious','highestBigPrizeAmountMajor','highestCashPrizeAmountOrdinary','highestCashPrizeAmountSerious','highestCashPrizeAmountMajor',]
          moneyArray.forEach((item)=>{
            data = self.toMoneyReal(data, item)
          })
          
        for (var item in data.data) {
          for (var i = 0; i < this.planList.length; i++) {
            if (item === this.planList[i].prop) {
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
              if (
                item === "minimumReturnRateOrdinary" ||
                item === "minimumReturnRateMajor" ||
                item === "minimumReturnRateSerious" ||
                item === "highestReturnRateOrdinary" ||
                item === "highestReturnRateMajor" ||
                item === "highestReturnRateSerious"
              ) {
                var value = informs.conventToPercent(data.data[item]);
                this.planList[i].value = value ? value : "-";
              }
               if(this.planList[i].value=='-'){
                this.planList[i].show=false
              }
            }
          }
        }
      }
    },
     // 转换金额 百分
    toMoneyReal(data, val) {
      for(let key in data) {
        if(typeof(data[key])=='object') {
          if(data[key]&&data[key][val]) {
            data[key][val] = data[key][val]/100;
          }
        }
        if(Array.isArray(data[key])) {
          data[key]&&data[key].forEach((item)=>{
            if(item[val]) {
              item[val] = item[val]/100;
            }
          })
        }
      }
      return data;
    },
    //返回游戏风险编辑页
    goEdit() {
      this.$router.push({
        name: "gameRiskEdit",
        query: {
          id: this.$route.query.id
        }
      });
    }
  },
  mounted() {
    this.getGameRiskDetail();
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
