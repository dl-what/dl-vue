<template>
  <div class="vlt-card plan-check">
    <panel title="用户风险指标详情" :show="true">
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
        { title: "类型", value: "", prop: "type" },
        { title: "状态", value: "", prop: "collectStatus" },
        {
          title: "投注警告用户数-Ⅲ级",
          value: "",
          prop: "betWarnCountOrdinary"
        },
        {
          title: "投注警告用户数-Ⅱ级",
          value: "",
          prop: "betWarnCountSerious"
        },
        {
          title: "投注警告用户数-Ⅰ级",
          value: "",
          prop: "betWarnCountMajor"
        },
        {
          title: "充值警告用户数-Ⅲ级",
          value: "",
          prop: "rechargeWarnCountOrdinary"
        },
        {
          title: "充值警告用户数-Ⅱ级",
          value: "",
          prop: "rechargeWarnCountSerious"
        },
        {
          title: "充值警告用户数-Ⅰ级",
          value: "",
          prop: "rechargeWarnCountMajor"
        },

        {
          title: "投注时长警告用户数-Ⅲ级",
          value: "",
          prop: "betDurationWarnCountOrdinary"
        },
        {
          title: "投注时长警告用户数-Ⅱ级",
          value: "",
          prop: "betDurationWarnCountSerious"
        },
        {
          title: "投注时长警告用户数-Ⅰ级",
          value: "",
          prop: "betDurationWarnCountMajor"
        },

        {
          title: "投注限制用户数-Ⅲ级",
          value: "",
          prop: "betAstrictCountOrdinary"
        },
        {
          title: "投注限制用户数-Ⅱ级",
          value: "",
          prop: "betAstrictCountSerious"
        },
        {
          title: "投注限制用户数-Ⅰ级",
          value: "",
          prop: "betAstrictCountMajor"
        },

        {
          title: "充值限制用户数-Ⅲ级",
          value: "",
          prop: "rechargeAstrictCountOrdinary"
        },
        {
          title: "充值限制用户数-Ⅱ级",
          value: "",
          prop: "rechargeAstrictCountSerious"
        },
        {
          title: "充值限制用户数-Ⅰ级",
          value: "",
          prop: "rechargeAstrictCountMajor"
        },
        {
          title: "投注时长限制用户数-Ⅲ级",
          value: "",
          prop: "betDurationAstrictCountOrdinary"
        },
        {
          title: "投注时长限制用户数-Ⅱ级",
          value: "",
          prop: "betDurationAstrictCountSerious"
        },
        {
          title: "投注时长限制用户数-Ⅰ级",
          value: "",
          prop: "betDurationAstrictCountMajor"
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
       
      ]
    };
  },
  components: {},
  methods: {
    //取消返回列表页面
    gotoList() {
      this.$router.push({
        name: "userRisk"
      });
    },
    //获取游戏风险指标详情.
    async userRiskDetail() {
      const id = this.$route.query.id;
      const self = this;
      const res = await self.$api.userRiskDetail({
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
        for (var item in res.data) {
          for (var i = 0; i < this.planList.length; i++) {
            if (item === this.planList[i].prop) {
              this.planList[i].value = res.data[item] ? res.data[item] : "-";
              if (
                item === "informWayOrdinary" ||
                item === "informWaySerious" ||
                item === "informWayMajor" ||
                item === "collectStatus"||
                item ==='type'
              ) {
                var informWay = informs.showTextByType(item, res.data[item]);
                this.planList[i].value = informWay ? informWay : "-";
              }
              if(this.planList[i].value=='-'){
                this.planList[i].show=false
              }
            }
          }
        }
      }
    },
    //跳转用户风险编辑页
    goEdit() {
      this.$router.push({
        name: "userRiskEdit",
        query: {
          id: this.$route.query.id
        }
      });
    }
  },
  mounted() {
    this.userRiskDetail();
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
