<template>
<!-- 投注卡提现记录 -->
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
  name: "withdrawalRecord",
  data() {
    return {
      // 搜索组件配置
      searchOptions: [
        { title: "投注卡ID", type: "input", prop: "inputName", value: "" },
        { title: "提现流水号", type: "input", prop: "inputName2", value: "" },
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
          title: "提现时间",
          placeholder: ["开始时间", "结束时间"]
        }
      ],
      tableDatas: {
        tableData: [
          {
            id: 0,
            cardId: "3464757567",
            ardType:"会员卡",
            flowNumber: " SNG353464444",
            withdrawalMethod: "现金",
            customerId: 111,
            withdrawalBalance:"100.00" ,
            date: "2019-02-25 01:50:06",
          },
          {
            id: 1,
            cardId: "3464757567",
            ardType:"会员卡",
            flowNumber: " SNG353464444",
            withdrawalMethod: "银行卡",
            customerId: 111,
            withdrawalBalance:"100.00" ,
            date: "2019-02-25 01:50:06",
          },
          {
            id: 2,
            cardId: "3464757567",
            ardType:"会员卡",
            flowNumber: " SNG353464444",
            withdrawalMethod: "现金",
            customerId: 111,
            withdrawalBalance:"100.00" ,
            date: "2019-02-25 01:50:06",
          },
          {
            id: 3,
            cardId: "3464757567",
            ardType:"匿名卡",
            flowNumber: " SNG353464444",
            withdrawalMethod: "银行卡",
            customerId: 111,
            withdrawalBalance:"100.00" ,
            date: "2019-02-25 01:50:06",
          },
          {
            id: 4,
            cardId: "3464757567",
            ardType:"会员卡",
            flowNumber: " SNG353464444",
            withdrawalMethod: "银行卡",
            customerId: 111,
            withdrawalBalance:"100.00" ,
            date: "2019-02-25 01:50:06",
          },
          {
            id: 5,
            cardId: "3464757567",
            ardType:"会员卡",
            flowNumber: " SNG353464444",
            withdrawalMethod: "现金",
            customerId: 111,
            withdrawalBalance:"100.00" ,
            date: "2019-02-25 01:50:06",
          },
          {
            id: 6,
            cardId: "3464757567",
            ardType:"匿名卡",
            flowNumber: " SNG353464444",
            withdrawalMethod: "现金",
            customerId: 111,
            withdrawalBalance:"100.00" ,
            date: "2019-02-25 01:50:06",
          },
          {
            id: 7,
            cardId: "3464757567",
            ardType:"会员卡",
            flowNumber: " SNG353464444",
            withdrawalMethod: "现金",
            customerId: 111,
            withdrawalBalance:"100.00" ,
            date: "2019-02-25 01:50:06",
          },
          {
            id: 8,
            cardId: "3464757567",
            ardType:"匿名卡",
            flowNumber: " SNG353464444",
            withdrawalMethod: "现金",
            customerId: 111,
            withdrawalBalance:"100.00" ,
            date: "2019-02-25 01:50:06",
          },
          {
            id: 9,
            cardId: "3464757567",
            ardType:"会员卡",
            flowNumber: " SNG353464444",
            withdrawalMethod: "现金",
            customerId: 111,
            withdrawalBalance:"100.00" ,
            date: "2019-02-25 01:50:06",
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
            width: ""
          },
          {
            label: "提现流水号",
            value: 'flowNumber',
            width: '150'
          },
          {
            label: "提现方式",
            value: 'withdrawalMethod',
            width: ''
          },
          {
            label: "客户ID",
            value: 'customerId',
            width: ''
          },
          {
            label: "提现金额",
            value: 'withdrawalBalance',
            width: ''
          },
          {
            label: "提现时间",
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
