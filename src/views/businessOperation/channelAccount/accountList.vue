<template>
  <div class="vlt-card">
    <div class="el_box">
      <search-bar :options="options" @search="search" :total="num" labelWidth="6em"></search-bar>
      <div class="el_table">
        <el-table :data="tableData" border>
          <el-table-column prop="accountId" fixed label="序号" type="index" width="60">
            <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
          </el-table-column>
          <el-table-column prop="channelNo" label="渠道编号" min-width="120px"></el-table-column>
          <el-table-column prop="channelType" label="渠道类型" min-width="120px"></el-table-column>
          <el-table-column prop="accountNo" label="账户ID" min-width="120px"></el-table-column>
          <el-table-column prop="accountStatus" label="账户状态" min-width="140px">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.accountStatus"
                :active-text="scope.row.accountStatus?'冻结':'启用'"
                :active-value="0"
                :inactive-value="1"
                @change="change(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="accountManagerName" label="负责人" min-width="120px"></el-table-column>
          <el-table-column prop="phone" label="联系电话" min-width="120px"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
          <el-table-column label="操作" fixed="right" align="center" min-width="120px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="detail(scope.row)"
                v-has="'accountList-detail'"
                :id="$route.name + '-' + 'detail' + scope.$index"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table_paging">
        <tablePaging
          class="table_paging_right"
          :total="num"
          :currentPage="page"
          :pageSize="pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></tablePaging>
      </div>
    </div>
  </div>
</template>

<script>
import rules from "@/utils/rules.js";
export default {
  name: "name",
  data() {
    return {
      //搜索类型
      options: [
        {
          type: "input",
          prop: "accountNo",
          value: "",
          title: "账户ID",
          placeholder: "请输入"
        },
        {
          type: "input",
          prop: "accountManagerName",
          value: "",
          title: "负责人",
          placeholder: "请输入"
        },
        {
          type: "select",
          prop: "accountStatus",
          value: "",
          title: "账户状态",
          placeholder: "请输入",
          options: [
            {
              label: "启用",
              value: 0
            },
            {
              label: "冻结",
              value: 1
            }
          ]
        },
        {
          type: "datepicker-range",
          prop: "createTime",
          value: "",
          title: "创建时间",
          placeholder: ["开始时间", "结束时间"]
        }
      ],
      //搜索条数
      pageSize: 20,
      page: 0,
      current: 0,
      searchForm: {},
      //表格总数
      num: 0,
      // 表格数据
      tableData: [],
      //存储这行id
      id: ""
    };
  },

  created() {
    this.init();
  },
  methods: {
    async init(val) {
      let data = {
        page: val || 1,
        pageSize: this.pageSize,
        param: {
          ...this.searchForm
        }
      };
      let result = await this.$api.getChannelAccoutList({ data });

      console.log(this.pageSize);
      console.log(result);
      if (result && result.code === 0) {
        result.data.records.forEach(item => {
          if (item.createTime) {
            item.createTime = this.$moment(item.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }

          if (item.channelType === 1) {
            item.channelType = "合作渠道";
          }
        });

        this.page = result.data.current;
        // this.pageSize = result.data.size;
        this.num = result.data.total;
        this.tableData = result.data.records;
      }
    },
    //状态值change事件
    async change(row) {
      let data = {
        accountStatus: Number(row.accountStatus),
        id: row.id
      };
      let result = await this.$api.getChannelAccountStatus({ data });
    },
    //点击搜索
    async search(val) {
      if (val.createTime && val.createTime.length > 0) {
        val.startTime = this.$moment(val.createTime[0]).format("YYYY-MM-DD");
        val.endTime = this.$moment(val.createTime[1]).format("YYYY-MM-DD");
        delete val.createTime;
      }
      this.searchForm = {
        ...val
      };
      this.init();
    },

    handleSizeChange(size) {
      console.log(size);
      this.pageSize = size;
      this.init();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.init(val);
    },
    // 详情
    detail(row) {
      console.log(row);
      this.$router.push({
        name: "accountListDetail",
        query: { id: row.id }
      });
    }
  }
};
</script>


<style lang="less" scoped>
@import "./less/index.less";
</style>
<style lang="less">
.el_box {
  .el-table td {
    padding: 11px 0;
  }
}
</style>
