<template>
  <!-- 投注卡余额 -->
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="tableDatas.total"
      labelWidth="6em"
    ></search-bar>
    <el-row class="card-table">
      <el-table
        :data="tableDatas.records"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="table-box"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="(item,key) in tableDatas.tableKey"
          :key="key"
          :prop="item.value"
          :label="item.label"
          :width="item.width"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleClick(scope.row)">查看</el-button>
            <el-button type="primary" size="mini" @click="activation(scope.row)">明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <table-paging
      position="right"
      :total="tableDatas.total"
      :currentPage="tableDatas.current"
      :pageSize="tableDatas.size"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "cardBalance",
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
        tableKey: [
          { label: "序号", value: "id", width: "80" },
          { label: "编号", value: "number", width: "" },
          { label: "余额", value: "balance", width: "100" },
          { label: "累计消费", value: "total", width: "" },
          { label: "状态", value: "status", width: "80" },
          { label: "过期日期", value: "date", width: "" },
          { label: "最后消费时", value: "lastConsumption", width: "" }
        ]
      }
    };
  },
  components: {},
  methods: {
    search(form) {
      console.log("search", form);
    },
    handleClick(row) {
      this.$router.push({
        name: "infoDetail",
        query: {
          id: row.id
        }
      });
    },
    activation(row) {
      console.log(row);
      this.$router.push({
        name: "balanceDetail",
        query: {
          id: row.id
        }
      });
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
