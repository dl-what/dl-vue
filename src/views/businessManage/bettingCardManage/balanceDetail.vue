<template>
  <!-- 投注卡余额 - 明细 -->
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="999"
      labelWidth="100em"
    ></search-bar>
    <el-row class="card-table">
      <el-table
        :data="tableDatas.tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="table-box"
      >
        <el-table-column
          v-for="(item,key) in tableDatas.tableKey"
          :key="key"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
        ></el-table-column>
      </el-table>
    </el-row>
    <table-paging
      position="right"
      :total="999"
      :currentPage="1"
      :pageSize="10"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "balanceDetail",
  data() {
    return {
      // 搜索组件配置
      searchOptions: [
        { title: "投注卡编号", type: "input", prop: "inputName", value: "" },
        {
          title: "所属机构",
          type: "select",
          prop: "selectName",
          value: "",
          options: [
            {
              label: "机构1",
              value: 1
            },
            {
              label: "机构2",
              value: 2
            }
          ]
        },
        {
          title: "投注卡类型",
          type: "select",
          prop: "selectName2",
          value: "",
          options: [{ label: "普通卡", value: 1 }, { label: "会员卡", value: 2 }, {label: "试玩卡", value:3}]
        },
        {
          type: "datetime-range",
          prop: "date4",
          value: "",
          title: "有效日期",
          placeholder: ["开始时间", "结束时间"]
        }
      ],
      tableDatas: {
        tableData: [
          {
            id: 0,
            number: "100000011",
            rechargeAmount: -200.00,
            balance: 210.00,
            FlowType: "消费",
            date: "2019-02-25 01:50:06"
          },
          {
            id: 1,
            number: "100000011",
            rechargeAmount: -200.00,
            balance: 210.00,
            FlowType: "消费",
            date: "2019-02-25 01:50:06"
          },
          {
            id: 2,
            number: "100000011",
            rechargeAmount: -200.00,
            balance: 210.00,
            FlowType: "消费",
            date: "2019-02-25 01:50:06"
          },
          {
            id: 3,
            number: "100000011",
            rechargeAmount: -200.00,
            balance: 210.00,
            FlowType: "消费",
            date: "2019-02-25 01:50:06"
          },
          {
            id: 4,
            number: "100000011",
            rechargeAmount: -200.00,
            balance: 210.00,
            FlowType: "消费",
            date: "2019-02-25 01:50:06"
          },
          {
            id: 5,
            number: "100000011",
            rechargeAmount: -200.00,
            balance: 210.00,
            FlowType: "消费",
            date: "2019-02-25 01:50:06"
          },
          {
            id: 6,
            number: "100000011",
            rechargeAmount: -200.00,
            balance: 210.00,
            FlowType: "消费",
            date: "2019-02-25 01:50:06"
          },
          {
            id: 7,
            number: "100000011",
            rechargeAmount: -200.00,
            balance: 210.00,
            FlowType: "消费",
            date: "2019-02-25 01:50:06"
          },
          {
            id: 8,
            number: "100000011",
            rechargeAmount: -200.00,
            balance: 210.00,
            FlowType: "消费",
            date: "2019-02-25 01:50:06"
          },
          {
            id: 9,
            number: "100000011",
            rechargeAmount: -200.00,
            balance: 210.00,
            FlowType: "消费",
            date: "2019-02-25 01:50:06"
          }
        ],
        tableKey: [
          {
            label: "序号",
            value: "id",
            width: "80"
          },
          {
            label: "订单编号",
            value: "number",
            width: ""
          },
          {
            label: "流水类型",
            value: "FlowType",
            width: "100"
          },
          {
            label: "充值金额",
            value: "rechargeAmount",
            width: ""
          },
          {
            label: "账户余额",
            value: "balance",
            width: "80"
          },
          {
            label: "操作时间",
            value: "date",
            width: ""
          }
        ]
      }
    };
  },
  components: {},
  methods: {
    search(form) {
      console.log("search", form);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      console.log(pageSize);
    },
    handleCurrentChange(currentPage) {
      console.log(currentPage);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
