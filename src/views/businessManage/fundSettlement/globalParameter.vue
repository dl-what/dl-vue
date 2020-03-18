<template>
  <!-- 查看页面 -->
  <div class="vlt-card globalParameter-page">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="参数内容" name="first">
        <div class="basic-info">
          <div class="basic-title">
            <h3>基础信息</h3>
            <span @click="toEdit">编辑</span>
          </div>
          <base-info :infoList="basicInfoList"></base-info>
        </div>
        <div class="fund-info basic-info">
          <div class="basic-title">
            <h3>返奖率-调节基金</h3>
          </div>
          <base-info :infoList="fundInfoList" class="column"></base-info>
        </div>
        <div class="issue-info basic-info fund-info">
          <div class="basic-title">
            <h3>发行经费</h3>
          </div>
          <base-info :infoList="issueInfoList"></base-info>
        </div>
        <div class="public-fund basic-info fund-info">
          <div class="basic-title">
            <h3>公益金</h3>
          </div>
          <base-info :infoList="publicInfoList"></base-info>
        </div>
        <div class="pay-taxes basic-info fund-info">
          <div class="basic-title">
            <h3>纳税</h3>
          </div>
          <base-info :infoList="bettingCardInfoList"></base-info>
        </div>
      </el-tab-pane>

      <el-tab-pane label="审核流程" name="second">
        <div class="flow">开始</div>
        <div class="vlt-edit-single new-apply">
          <h2 class="title">新建申请</h2>
          <div class="vlt-edit-wrap">
            <base-form
              :formData="data2"
              labelWidth="140px"
              ref="baseForm"
              :rules="rules2"
              direction="right"
              @change="changeForm"
            ></base-form>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
export default {
  name: "globalParameter",
  data() {
    return {
      activeName: "first",
      params: {},
      basicInfoList: [
        { title: "生效时间", value: "", prop: "effectiveTime" },
        { title: "游戏兑换比例", value: "", prop: "gameConPro" },
        { title: "弃奖规则", value: "", prop: "abandonPrizeRule" },
        { title: "代销费率", value: "", prop: "generationRate" },
        { title: "状态", value: "", prop: "status" },
        { title: "创建人", value: "", prop: "createBy" },
        { title: "创建时间", value: "", prop: "createTime" }
      ],
      fundInfoList: [
        { title: "返奖率", value: "", prop: "returnRate" },
        { title: "调节基金", value: "", prop: "regulationFund" }
      ],
      issueInfoList: [
        { title: "发行经费占比", value: "", prop: "lssueLotteryCenter" },
        { title: "中福彩中心", value: "", prop: "lssueLotteryCenter" },
        { title: "省级福彩中心", value: "", prop: "lssueProCenter" },
        { title: "市级福彩中心", value: "", prop: "lssueMunCenter" },
        { title: "销售厅", value: "", prop: "lssueSalesHall" }
      ],
      publicInfoList: [
        { title: "公益金占比", value: "", prop: "publicFundPro" },
        { title: "中福彩中心", value: "", prop: "publicLotteryCenter" },
        { title: "省级福彩中心", value: "", prop: "publicProCenter" },
        { title: "市级福彩中心", value: "", prop: "publicMunCenter" },
        { title: "销售厅", value: "", prop: "publicSalesHall" }
      ],
      bettingCardInfoList: [
        { title: "1、超过10000元至20000元的部分，税率", value: "", prop: "aa" },
        {
          title: "2、超过20000元至30000元的部分，税率",
          value: "1.2",
          prop: "aa"
        }
      ],
      data2: [
        { title: "处理人", type: "input", prop: "processor", value: "" },
        {
          title: "处理类型",
          type: "select",
          prop: "processType",
          options: [
            { label: "选修一", value: "12" },
            { label: "选项二", value: "12" }
          ]
        },
        { title: "知会", type: "input", prop: "notify", value: "" },
        {
          title: "处理时限类型",
          type: "select",
          prop: "timeLimitType",
          options: [
            { label: "选修一", value: "12" },
            { label: "选项二", value: "12" }
          ]
        },
        {
          title: "处理时限（天）",
          type: "input",
          prop: "processTimeLimit",
          value: ""
        },
        {
          title: "任务类型",
          type: "select",
          prop: "taskType",
          options: [
            { label: "选修一", value: "12" },
            { label: "选项二", value: "12" }
          ]
        },
        {
          title: "消息提醒",
          type: "select",
          prop: "infoRemind",
          options: [
            { label: "选修一", value: "12" },
            { label: "选项二", value: "12" }
          ]
        }
      ],
      rules2: {}
    };
  },
  created() {
    this.init();
  },

  methods: {
    async init() {
      let res = await this.$api.getParameterDetail({ data: "0" });
      console.log(res);
      if (res.code === 0) {
        let keys = Object.keys(res.data);
        let arr = [
          ...this.publicInfoList,
          ...this.issueInfoList,
          ...this.fundInfoList,
          ...this.basicInfoList
        ];
        for (let item of arr) {
          keys.forEach(index => {
            if (index === item.prop) {
              item.value = res.data[index];
            }
          });
        }
      }
    },

    handleClick(tab, event) {},
    //跳转编辑页面
    toEdit() {
      this.$router.push({
        name: "globalParameterEdit"
      });
    },
    changeForm(val) {
      Object.assign(this.params, val);
    }
  },
  components: {}
};
</script>

<style lang="less">
.globalParameter-page {
  position: relative;
  .el-tabs__item {
    font-size: 16px;
    font-weight: 600;
  }
  padding: 30px;
  .basic-title {
    position: relative;
    border-bottom: 1px solid rgb(228, 231, 237);
    margin-top: 20px;
    padding-left: 16px;
    padding-bottom: 16px;
    margin-left: 28px;
    margin-right: 28px;
    h3 {
      font-weight: 500;
      display: inline-block;
    }
    span {
      cursor: pointer;
      color: rgb(59, 59, 255);
      font-size: 16px;
      position: absolute;
      top: 0px;
      right: 22px;
    }
  }
  .basic-info {
    .base-info {
      padding: 0;
      padding-left: 162px;
      .title {
        font-size: 16px;
      }
      .info-item {
        width: 50%;
        padding: 16px 5px;
      }
      .content {
        font-size: 16px;
      }
    }
  }
  .fund-info {
    .base-info {
      .info-item {
        width: 100%;
      }
    }
  }
  .el-tab-pane {
    height: 1200px;
    position: relative;
    .new-apply {
      width: 720px;
      height: 700px;
      border-radius: 6px;
      background: rgb(247, 247, 247);
      position: absolute;
      top: 10px;
      left: 500px;
      .title {
        font-size: 16px;
        font-weight: 900;
      }
      .el-form-item__label {
        font-size: 14px;
        color: #444;
      }
    }
  }
}
</style>
