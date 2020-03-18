
<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      ref="searchForm"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="80px"
    >
      <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions" position="left"></control-bar>
    </search-bar>
    <div class="el_table" ref="print">
      <el-table :data="tableData" ref="multipleTable" border>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="name" label="销售厅名称"></el-table-column>
        <el-table-column prop="saleMoney" label="充值金额"></el-table-column>
        <el-table-column prop="returnMoney" label="提现金额"></el-table-column>
        <el-table-column prop="c" label="应收金额"></el-table-column>
        <el-table-column prop="d" label="状态"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="detail(scope.row.id)">查看</el-button>
            <el-button
              v-if="scope.row.state===2"
              type="text"
              size="mini"
              @click="detail(scope.row.id)"
            >结账</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        :total="total"
        :currentPage="params.page"
        :pageSize="params.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "salesHallDaily",
  data() {
    return {
      // 搜索组件配置
      searchOptions: [
        {
          title: "选择日期",
          type: "datepicker-range",
          prop: "time",
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
      controlOptions: [
        { name: "收银台流水", type: "primary", icon: "" },
        { name: "游戏交易信息", type: "primary", icon: "" },
        { name: "柜员对账", type: "", icon: "" },
        { name: "经理对账", type: "", icon: "" }
      ],
      tableData: [],
      total: 0,
      // pageSize: 10,
      // currentPage1:0,
      searchParams: {
        insId: 1
      },
      params: {
        page: 1,
        pageSize: 20
      },
      modelTreesList: [],
      newGoodsId: "",
      insId: ""
    };
  },
  components: {},
  methods: {
    search() {},
    selectBtn() {},
    handleSizeChange() {},
    handleCurrentChange() {}
  }
};
</script>

<style lang="less" scoped>
</style>
