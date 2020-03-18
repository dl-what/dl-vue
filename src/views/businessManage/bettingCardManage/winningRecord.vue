<template>
  <!-- 投注卡中奖记录 -->
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="999"
      labelWidth="100px"
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
  name: "winningRecord",
  data() {
    return {
      // 搜索组件配置
      searchOptions: [
        { title: "投注卡ID", type: "input", prop: "inputName", value: "" },
        { title: "投注流水号", type: "input", prop: "inputName2", value: "" },
        {
          title: "客户ID",
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
          type: "datetime-range",
          prop: "date4",
          value: "",
          title: "中奖时间",
          placeholder: ["开始时间", "结束时间"]
        },
        {
          title: "所属大厅",
          type: "select",
          prop: "selectName2",
          value: "",
          options: [
            {
              label: "类型1",
              value: 1
            },
            {
              label: "类型2",
              value: 2
            }
          ]
        }
      ],
      tableDatas: {
        tableData: [
          {
            id: 0,
            cardId: "3464757567",
            ardType: "会员卡",
            flowNumber: "SNG353464444",
            customerId: "111",
            gameName: "武林争霸",
            terminal: "NO01",
            ownHall: "泰安销售厅",
            affiliation: "深圳市",
            betContent: "1,2,3,4,5,6",
            betBalance: "10.00",
            winningAmount: "100.00",
            date: "2019-02-25 01:50:06",
            status: "已兑奖"
          },
          {
            id: 1,
            cardId: "3464757567",
            ardType: "会员卡",
            flowNumber: "SNG353464444",
            customerId: "111",
            gameName: "武林争霸",
            terminal: "NO01",
            ownHall: "泰安销售厅",
            affiliation: "深圳市",
            betContent: "1,2,3,4,5,6",
            betBalance: "10.00",
            winningAmount: "100.00",
            date: "2019-02-25 01:50:06",
            status: "未兑奖"
          },
          {
            id: 2,
            cardId: "3464757567",
            ardType: "会员卡",
            flowNumber: "SNG353464444",
            customerId: "111",
            gameName: "武林争霸",
            terminal: "NO01",
            ownHall: "泰安销售厅",
            affiliation: "深圳市",
            betContent: "1,2,3,4,5,6",
            betBalance: "10.00",
            winningAmount: "100.00",
            date: "2019-02-25 01:50:06",
            status: "未兑奖"
          },
          {
            id: 3,
            cardId: "3464757567",
            ardType: "会员卡",
            flowNumber: "SNG353464444",
            customerId: "111",
            gameName: "武林争霸",
            terminal: "NO01",
            ownHall: "泰安销售厅",
            affiliation: "深圳市",
            betContent: "1,2,3,4,5,6",
            betBalance: "10.00",
            winningAmount: "100.00",
            date: "2019-02-25 01:50:06",
            status: "已兑奖"
          },
          {
            id: 4,
            cardId: "3464757567",
            ardType: "会员卡",
            flowNumber: "SNG353464444",
            customerId: "111",
            gameName: "武林争霸",
            terminal: "NO01",
            ownHall: "泰安销售厅",
            affiliation: "深圳市",
            betContent: "1,2,3,4,5,6",
            betBalance: "10.00",
            winningAmount: "100.00",
            date: "2019-02-25 01:50:06",
            status: "未兑奖"
          },
          {
            id: 5,
            cardId: "3464757567",
            ardType: "会员卡",
            flowNumber: "SNG353464444",
            customerId: "111",
            gameName: "武林争霸",
            terminal: "NO01",
            ownHall: "泰安销售厅",
            affiliation: "深圳市",
            betContent: "1,2,3,4,5,6",
            betBalance: "10.00",
            winningAmount: "100.00",
            date: "2019-02-25 01:50:06",
            status: "已兑奖"
          },
          {
            id: 6,
            cardId: "3464757567",
            ardType: "会员卡",
            flowNumber: "SNG353464444",
            customerId: "111",
            gameName: "武林争霸",
            terminal: "NO01",
            ownHall: "泰安销售厅",
            affiliation: "深圳市",
            betContent: "1,2,3,4,5,6",
            betBalance: "10.00",
            winningAmount: "100.00",
            date: "2019-02-25 01:50:06",
            status: "未兑奖"
          },
          {
            id: 7,
            cardId: "3464757567",
            ardType: "会员卡",
            flowNumber: "SNG353464444",
            customerId: "111",
            gameName: "武林争霸",
            terminal: "NO01",
            ownHall: "泰安销售厅",
            affiliation: "深圳市",
            betContent: "1,2,3,4,5,6",
            betBalance: "10.00",
            winningAmount: "100.00",
            date: "2019-02-25 01:50:06",
            status: "已兑奖"
          },
          {
            id: 8,
            cardId: "3464757567",
            ardType: "会员卡",
            flowNumber: "SNG353464444",
            customerId: "111",
            gameName: "武林争霸",
            terminal: "NO01",
            ownHall: "泰安销售厅",
            affiliation: "深圳市",
            betContent: "1,2,3,4,5,6",
            betBalance: "10.00",
            winningAmount: "100.00",
            date: "2019-02-25 01:50:06",
            status: "未兑奖"
          },
          {
            id: 9,
            cardId: "3464757567",
            ardType: "会员卡",
            flowNumber: "SNG353464444",
            customerId: "111",
            gameName: "武林争霸",
            terminal: "NO01",
            ownHall: "泰安销售厅",
            affiliation: "深圳市",
            betContent: "1,2,3,4,5,6",
            betBalance: "10.00",
            winningAmount: "100.00",
            date: "2019-02-25 01:50:06",
            status: "未兑奖"
          }
        ],
        tableKey: [
          {
            label: "序号",
            value: "id",
            width: "50"
          },
          {
            label: "投注卡ID",
            value: "cardId",
            width: ""
          },
          {
            label: "投注卡类型",
            value: "ardType",
            width: "100"
          },
          {
            label: "投注流水号",
            value: 'flowNumber',
            width: '150'
          },
          {
            label: "客户ID",
            value: 'customerId',
            width: ''
          },
          {
            label: "游戏名称",
            value: 'gameName',
            width: ''
          },
          {
            label: "终端机",
            value: 'terminal',
            width: ''
          },
          {
            label: "所属大厅",
            value: 'ownHall',
            width: ''
          },
          {
            label: "所属机构",
            value: "affiliation",
            width: ""
          },
          {
            label: "投注内容",
            value: 'betContent',
            width: ''
          },
          {
            label: "投注金额",
            value: 'betBalance',
            width: ''
          },{
            label: "中奖金额",
            value: "winningAmount",
            width: "80"
          },
          {
            label: "中奖时间",
            value: "date",
            width: ""
          },
          {
            label: "兑奖状态",
            value: "status",
            width: "80"
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
