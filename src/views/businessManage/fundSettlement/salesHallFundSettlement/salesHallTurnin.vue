<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="80px"
    ></search-bar>
    <el-button type="primary" size="medium " @click="addLevelConfig">打印</el-button>
    <el-button type="primary" size="medium " @click="addLevelConfig">导出</el-button>

    <el-table :data="tableData" border style="margin-top: 10px;">
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="销售厅名称"></el-table-column>
      <el-table-column prop="saleMoney" label="售卡金额"></el-table-column>
      <el-table-column prop="returnMoney" label="退卡金额"></el-table-column>
      <el-table-column prop="a" label="兑付大奖"></el-table-column>
      <el-table-column prop="b" label="销售额"></el-table-column>
      <el-table-column prop="c" label="应缴金额"></el-table-column>
      <el-table-column prop="d" label="缴纳状态"></el-table-column>
      <el-table-column prop="e" label="上缴银行"></el-table-column>
      <el-table-column prop="f" label="上缴时间"></el-table-column>
      <el-table-column prop="g" label="交易流水号"></el-table-column>
      <el-table-column prop="h" label="缴款人"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="detail(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: " salesHallTurnin",
  data() {
    return {
      total: 0,
      page: 1,
      pageSize: 20,
      current: 0,
      param: {},
      searchOptions: [
        {
          title: "选择日期",
          type: "datepicker-range",
          prop: "contentForm",
          value: []
        },
        {
          title: "选择区域",
          type: "select",
          prop: "channelType",
          value: "",
          options: []
        }
      ],
      tableData: []
    };
  },
  components: {},
  methods: {
    init() {},
    search() {},
    addLevelConfig() {
      this.$router.push({ path: "addLevelConfig" });
    },
    detail() {},
    changeTo() {},
    remove() {},
    pageSizeChange(size) {
      // this.pageSize = size;
      // this.init();
    },
    pageCurrentChange(page) {
      // this.current = page;
      // this.init(page);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
