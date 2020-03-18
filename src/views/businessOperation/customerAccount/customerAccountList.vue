<template>
  <div class="vlt-card">
    <div class="customer">
      <search-bar @search="search" :options="searchOptions" :total="num" labelWidth="8em"></search-bar>
      <el-table :data="accountList" border style="width: 100%; margin-top: 10px;">
        <el-table-column type="index" label="序号" width="60">
          <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="userType" label="账户类型" min-width="120px"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" min-width="120px"></el-table-column>
        <el-table-column prop="userStatus" label="账户状态" align="center" min-width="120">
          <template slot-scope="scope">
            <span
              class="icon-circle"
              :class="{
              blue:scope.row.userStatus=='3',
              green:scope.row.userStatus=='1',
              grey:scope.row.userStatus=='4',
              yellow:scope.row.userStatus=='5',
              red:scope.row.userStatus=='2',
              }"
            >{{scope.row.strUserStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cardCode" label="会员卡号/投注卡号" min-width="150px"></el-table-column>
        <el-table-column prop="channelCode" label="注册/开卡渠道编号" min-width="140px"></el-table-column>
        <el-table-column prop="userScope" label="使用范围" min-width="120px"></el-table-column>
        <el-table-column prop="createTime" label="注册/开卡时间" min-width="160"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="accountDetail(scope.row)"
              v-has="'customerAccountList-detail'"
              :id="$route.name + '-' + 'detail' + scope.$index"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        :current-page="page"
        :page-size="pageSize"
        :total="num"
        @handleSizeChange="pageSizeChange"
        @handleCurrentChange="pageCurrentChange"
      ></table-paging>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      searchOptions: [
        { title: "会员/投注卡号", type: "input", prop: "cardCode", value: "" },
        { title: "手机号码", type: "input", prop: "mobile", value: "" },
        {
          title: "账户类型",
          type: "select",
          prop: "userType",
          value: "",
          options: [
            {
              label: "普通购彩者",
              value: "1"
            },
            {
              label: "已识别用户",
              value: "2"
            },
            {
              label: "会员账户",
              value: "3"
            }
          ]
        },

        {
          type: "datepicker-range",
          prop: "timeWin",
          value: "",
          title: "创建时间",
          placeholder: ["开始时间", "结束时间"]
        }
      ],
      accountList: [],
      num: 0,
      page: 0,
      pageSize: 20,
      current: 0,
      searchForm: {}
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
      let result = await this.$api.getcusList({ data });
      if (result && result.code === 0) {
        this.num = result.data.total;
        this.page = result.data.current;
        result.data.records.forEach(item => {
          if (item.userStatus === 1) {
            item.strUserStatus = "启用";
          } else {
            item.strUserStatus = "冻结";
          }
          if (item.userType === 1) {
            item.userType = "普通购彩者";
          } else if (item.userType === 2) {
            item.userType = "已识别用户";
          } else {
            item.userType = "会员账户";
          }
          if (item.userScope === 1) {
            item.userScope = "销售厅使用";
          } else if (item.userScope === 2) {
            item.userScope = "销售厅使用";
          } else {
            item.userScope = "全国通用";
          }
          if (item.createTime) {
            item.createTime = this.$moment(item.createdTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
        });
        console.log(result);
        this.accountList = result.data.records;
      }
    },
    accountDetail(row) {
      this.$router.push({
        name: "accountDetail",
        query: { 
          id: row.userId, 
          status: row.userType,
          activeName: this.$route.query.activeName || '' // 跨系统菜单激活对应的路由名称
        }
      });
    },
    //搜索
    search(val) {
      if (val.timeWin && val.timeWin.length > 0) {
        val.startTime = this.$moment(val.timeWin[0]).format("YYYY-MM-DD");
        val.endTime = this.$moment(val.timeWin[1]).format("YYYY-MM-DD");
        delete val.timeWin;
      }
      console.log(val);
      this.searchForm = {
        ...val
      };

      this.init();
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    pageCurrentChange(page) {
      this.current = page;
      this.init(page);
    },
    changeSwitchCash(row) {
      console.log(row.type);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
