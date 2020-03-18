<template>
  <div class="vlt-card account_detail">
    <div class="account_detail_box">
      <panel title="账户资料" :show="true" style="margin-bottom:20px">
        <base-Info :infoList="accountData"></base-Info>
      </panel>
      <panel title="资金账户" :show="true" style="margin-bottom:20px">
        <base-Info :infoList="moneyAccount"></base-Info>
      </panel>

      <panel title="拥有渠道列表" :show="true" style="margin-bottom:20px">
        <div class="wrapper">
          <el-table :data="tableData" border>
            <el-table-column prop="id" label="序号" fixed type="index" width="55px"></el-table-column>
            <el-table-column prop="channelNo" label="渠道编号" min-width="140px"></el-table-column>
            <el-table-column prop="channelType" label="渠道类型" min-width="120px"></el-table-column>
            <el-table-column prop="insName" label="所属机构" min-width="120px"></el-table-column>
            <el-table-column prop="channelLevelName" label="渠道等级" min-width="120px"></el-table-column>
            <el-table-column prop="accountManagerName" label="负责人" min-width="120px"></el-table-column>
            <el-table-column prop="phone" label="联系电话" min-width="120px"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
            <el-table-column label="操作" fixed="right" min-width="100px">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handelListDetail(scope.row)"
                  :id="$route.name + '-' + 'detail' + scope.$index"
                >查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </panel>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accountData: [
        { title: "渠道编号", value: "", prop: "channelNo" },

        { title: "负责人", value: "", prop: "accountManagerName" },
        { title: "渠道类型", value: "", prop: "channelType" },
        { title: "账户状态", value: "", prop: "accountStatus" },
        { title: "联系电话", value: "", prop: "phone" },
        { title: "渠道地址", value: "", prop: "channelAddress" }
      ],
      moneyAccount: [
        { title: "资金账户ID", value: "", prop: "purseId" },
        { title: "账户余额", value: "", prop: "accountBalance" },
        { title: "预交款", value: "", prop: "creditAccount" }
      ],
      tableData: [],
      id: this.$route.query.id,
      haveChannel: {}
    };
  },
  created() {
    this.init();
  },
  methods: {
    //获取账户资料数据
    async init() {
      let id = this.id;
      let result = await this.$api.getChannelAccoutDetail({ data: id });
      console.log(result);
      if (result && result.code === 0) {
        //账户资料数据
        this.accountData.forEach(item => {
          item.value = result.data.accountInfoById[item.prop];
          if (item.prop == "accountStatus") {
            item.value = item.value === 0 ? "启动" : "冻结";
          }
          if (item.prop == "channelType") {
            if (item.value === 1) {
              item.value = "合作渠道";
            }
          }
        });
        //资金账户数据
        this.moneyAccount.forEach(i => {
          i.value = result.data.channelAmount[i.prop];
          if (i.prop == "accountBalance") {
            i.value =
              this.$common.thousandMark(result.data.channelAmount[i.prop]) +
              "元";
          }
          if (i.prop == "creditAccount") {
            i.value =
              this.$common.thousandMark(result.data.channelAmount[i.prop]) +
              "元";
          }
        });

        //拥有渠道列表数据
        if (result.data.channelInfo.createTime) {
          result.data.channelInfo.createTime = this.$moment(
            result.data.channelInfo.createTime
          ).format("YYYY-MM-DD HH:mm:ss");
        }
        if (result.data.channelInfo.channelType) {
          result.data.channelInfo.channelType = "合作渠道";
        }
        this.haveChannel = result.data.channelInfo;
        this.tableData.push(this.haveChannel);
      }
    },

    handelListDetail(row) {
      //console.log(row);
      this.$router.push({
        name: "channelDetails",
        query: { channelId: row.channelId }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/index.less";
.wrapper {
  padding: 10px;
}
</style>