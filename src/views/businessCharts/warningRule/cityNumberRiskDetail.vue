<template>
  <div class="vlt-card plan-check">
    <panel title="数量风险指标详情" :show="true">
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
  name: "cityRiskDetail",
  data() {
    return {
      planList: [
        { title: "区域名称", value: "", prop: "insName" },
        { title: "状态", value: "", prop: "collectStatus" },
        { title: "监控频率(分钟/次)", value: "", prop: "collectFrequency" },
        {
          title: "最高退卡数量-Ⅲ级",
          value: "",
          prop: "highestReturnCardNumOrdinary"
        },
        {
          title: "最高退卡数量-Ⅱ级",
          value: "",
          prop: "highestReturnCardNumSerious"
        },
        {
          title: "最高退卡数量-Ⅰ级",
          value: "",
          prop: "highestReturnCardNumMajor"
        },
        {
          title: "最低开卡数量-Ⅲ级",
          value: "",
          prop: "minimumOpenCardNumOrdinary"
        },
        {
          title: "最低开卡数量-Ⅱ级",
          value: "",
          prop: "minimumOpenCardNumSerious"
        },
        {
          title: "最低开卡数量-Ⅰ级",
          value: "",
          prop: "minimumOpenCardNumMajor"
        },
        {
          title: "最低在线数量-Ⅲ级",
          value: "",
          prop: "minimumOnlineNumOrdinary"
        },
        {
          title: "最低在线数量-Ⅱ级",
          value: "",
          prop: "minimumOnlineNumSerious"
        },
        {
          title: "最低在线数量-Ⅰ级",
          value: "",
          prop: "minimumOnlineNumMajor"
        },
        {
          title: "最低开机率-Ⅲ级",
          value: "",
          prop: "minimumOperatingRateOrdinary"
        },
        {
          title: "最低开机率-Ⅱ级",
          value: "",
          prop: "minimumOperatingRateSerious"
        },
        {
          title: "最低开机率-Ⅰ级",
          value: "",
          prop: "minimumOperatingRateMajor"
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
        { title: "第一次监控时间", value: "", prop: "timingFirst" },
        { title: "第二次监控时间", value: "", prop: "timingSecond" },
        { title: "第三次监控时间", value: "", prop: "timingThird" },
        { title: "第四次监控时间", value: "", prop: "timingFourth" },
        { title: "第五次监控时间", value: "", prop: "timingFifth" },
        { title: "第六次监控时间", value: "", prop: "timingSixth" }
      ]
    };
  },
  components: {},
  methods: {
    //获取游戏风险指标详情.
    async cityNumberRiskDetail() {
      const id = this.$route.query.id;
      const self = this;
      const res = await self.$api.cityNumberRiskDetail({
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
                item === "collectStatus"
              ) {
                var informWay = informs.showTextByType(item, res.data[item]);
                this.planList[i].value = informWay ? informWay : "-";
              }
              if (
                item === "minimumOperatingRateOrdinary" ||
                item === "minimumOperatingRateSerious" ||
                item === "minimumOperatingRateMajor"
              ) {
                var value = informs.conventToPercent(res.data[item]);
                this.planList[i].value = value ? value : "-";
              }
               if(this.planList[i].value=='-'){
                this.planList[i].show=false
              }
              break;
            }
          }
        }
      }
    },
    //跳转编辑页
    goEdit() {
      this.$router.push({
        name: "cityNumberRiskEdit",
        query: {
          id: this.$route.query.id
        }
      });
    },
    //返回数量风险列表页面
    gotoList() {
      this.$router.push({
        name: "cityNumberRisk"
      });
    }
  },
  mounted() {
    this.cityNumberRiskDetail();
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
