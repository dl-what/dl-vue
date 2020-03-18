<template>
  <div class="vlt-card duty-detail">
    <panel :show="true" :title="title" style="margin-bottom: 15px;">
      <base-info :infoList="baseInfo"></base-info>
    </panel>
    <panel :show="true" title="非会员责任设置" style="margin-bottom: 15px;">
      <base-info :infoList="infoList" v-if="type==200001"></base-info>
      <base-info :infoList="infoList2" v-if="type==200002"></base-info>
      <base-info :infoList="infoList3" v-if="type==200003"></base-info>
    </panel>
    <panel :show="true" title="会员风险等级责任设置" style="margin-bottom: 15px;">
      <div class="wrapper">
        <el-table :data="tableData" border style="width: 100%;" v-if="type==200001">
          <el-table-column prop="riskLevel" label="风险级别"></el-table-column>
          <el-table-column prop="levelName" label="风险等级名称"></el-table-column>
          <el-table-column prop="perDay" label="每日充值上限(元)" min-width="120"></el-table-column>
          <el-table-column prop="perWeek" label="每周充值上限(元)" min-width="120"></el-table-column>
          <el-table-column prop="perMonth" label="每月充值上限(元)" min-width="120"></el-table-column>
        </el-table>
        <el-table :data="tableData" border style="width: 100%;" v-if="type==200002">
          <el-table-column prop="riskLevel" label="风险级别"></el-table-column>
          <el-table-column prop="levelName" label="风险等级名称"></el-table-column>
          <el-table-column prop="perTimes" label="单次投注上限(元)" min-width="120"></el-table-column>
          <el-table-column prop="perDay" label="每日投注上限(元)" min-width="120"></el-table-column>
          <el-table-column prop="perWeek" label="每周投注上限(元)" min-width="120"></el-table-column>
          <el-table-column prop="perMonth" label="每月投注上限(元)" min-width="120"></el-table-column>
        </el-table>
        <el-table :data="tableData" border style="width: 100%;" v-if="type==200003">
          <el-table-column prop="riskLevel" label="风险级别"></el-table-column>
          <el-table-column prop="levelName" label="风险等级名称" min-width="120"></el-table-column>
          <el-table-column prop="perTimes" label="单次登录时长上限(分钟)" min-width="160"></el-table-column>
          <el-table-column prop="perDay" label="每日登录时长上限(分钟)" min-width="160"></el-table-column>
          <el-table-column prop="perWeek" label="每周登录时长上限(分钟)" min-width="160"></el-table-column>
          <el-table-column prop="perMonth" label="每月登录时长上限(分钟)" min-width="160"></el-table-column>
        </el-table>
      </div>
    </panel>
    <controlBar :options="gobackbtn" @select="goback" position="right" style="margin-right:50px"></controlBar>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
export default {
  name: "dutyDetail",
  data() {
    return {
      baseInfo: [
        { title: "责任类型", value: "", prop: "responsibilityType" },
        { title: "创建人", value: "", prop: "createUser" },
        { title: "责任编号", value: "", prop: "responsibilityCode" },
        { title: "创建时间", value: "", prop: "createTime" },
        { title: "操作人", value: "", prop: "updateUser" }
      ],
      infoList: [
        { title: "每日充值上限", value: "", prop: "perDay" },
        { title: "每周充值上限", value: "", prop: "perWeek" },
        { title: "每月充值上限", value: "", prop: "perMonth" }
      ],
      infoList2: [
        { title: "单次投注上限", value: "", prop: "perTimes" },
        { title: "每日投注上限", value: "", prop: "perDay" },
        { title: "每周投注上限", value: "", prop: "perWeek" },
        { title: "每月投注上限", value: "", prop: "perMonth" }
      ],
      infoList3: [
        { title: "单次登录时长上限", value: "", prop: "perTimes" },
        { title: "每日登录时长上限", value: "", prop: "perDay" },
        { title: "每周登录时长上限", value: "", prop: "perWeek" },
        { title: "每月登录时长上限", value: "", prop: "perMonth" }
      ],
      tableData: [],
      gobackbtn: [{ name: "返回", type: "primary", icon: "" }],
      arr: [],
      obj: {},
      type: "",
      title: "全局登录时长"
    };
  },
  created() {
    if (this.$route.query.id == "200001") {
      this.title = "全局充值限额";
    }
    if (this.$route.query.id == "200002") {
      this.title = "全局投注限额";
    }

    this.init();
  },
  methods: {
    async init() {
      let str = this.$route.query.id;
      let result = await this.$api.getdutyEditDetail({ data: str });
      console.log(result);
      this.type = result.data.responsibleTicket.responsibilityCode;

      let resultData = JSON.parse(JSON.stringify(result));
      if (result && result.code === 0) {
        //责任类型
        if (this.type === 200001) {
          this.baseInfo.push({
            title: "计算账户余额",
            value: "",
            prop: "balance_switch"
          });
        }
        if (this.type === 200002) {
          this.baseInfo.push({
            title: "计算奖金金额",
            value: "",
            prop: "prize_switch"
          });
        }
        this.baseInfo.forEach(item => {
          item.value = resultData.data.responsibleTicket[item.prop] || "";
          if (item.prop === "createTime") {
            item.value = moment(item.value).format("YYYY-MM-DD HH:mm:ss");
          }
          if (item.prop === "prize_switch") {
            item.value = resultData.data.prize_switch === 0 ? "否" : "是";
          }
          if (item.prop === "balance_switch") {
            item.value = resultData.data.balance_switch === 0 ? "否" : "是";
          }
        });

        //非会员
        if (this.type === 200001) {
          this.infoList.forEach(item => {
            item.value = `${this.$common.thousandMark(
              resultData.data.responsibleTicket[item.prop]
            )} 元`;
          });
        } else if (this.type === 200002) {
          this.infoList2.forEach(item => {
            item.value = `${this.$common.thousandMark(
              resultData.data.responsibleTicket[item.prop]
            )} 元`;
          });
        } else {
          // let perTimes = result.data.responsibleTicket.perTimes;
          // let perDay = result.data.responsibleTicket.perDay;
          // let perWeek = result.data.responsibleTicket.perWeek;
          // let perMonth = result.data.responsibleTicket.perMonth;

          let timeData = this.timeStamp([
            resultData.data.responsibleTicket.perTimes,
            resultData.data.responsibleTicket.perDay,
            resultData.data.responsibleTicket.perWeek,
            resultData.data.responsibleTicket.perMonth
          ]);

          this.infoList3.forEach((item, index) => {
            const _time = timeData[index];
            item.value = `${_time[1]}小时${_time[2]}分钟`;
          });
        }

        // this.infoList.forEach(item => {
        //   item.value = resultData.data.responsibleTicket[item.prop];
        // });

        //会员
        if (this.type == 200003) {
          resultData.data.memberRiskLevelVoList.forEach(item => {
            item.perTimes = `${parseInt(
              Number(item.perTimes) / 60
            )} 小时 ${Number(item.perTimes) % 60} 分钟`;
            item.perDay = `${parseInt(Number(item.perDay) / 60)} 小时 ${Number(
              item.perDay
            ) % 60} 分钟`;
            item.perWeek = `${parseInt(
              Number(item.perWeek) / 60
            )} 小时 ${Number(item.perWeek) % 60} 分钟`;
            item.perMonth = `${parseInt(
              Number(item.perMonth) / 60
            )} 小时 ${Number(item.perMonth) % 60} 分钟`;
          });
          this.tableData = resultData.data.memberRiskLevelVoList;
        }

        if (this.type !== 200003) {
          resultData.data.memberRiskLevelVoList.forEach(item => {
            item.perTimes = this.$common.thousandMark(Number(item.perTimes));
            item.perDay = this.$common.thousandMark(Number(item.perDay));
            item.perWeek = this.$common.thousandMark(Number(item.perWeek));
            item.perMonth = this.$common.thousandMark(Number(item.perMonth));
          });
          this.tableData = resultData.data.memberRiskLevelVoList;
        }
      }
    },
    goback() {
      this.$router.go(-1);
    },
    timeStamp(arr) {
      const results = [];
      arr.forEach(minutes => {
        results.push([
          parseInt(minutes / 60 / 24), // 天
          parseInt(minutes / 60), // 小时
          parseInt(minutes % 60) // 分钟
        ]);
      });
      return results;
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  padding: 10px;
}
</style>
