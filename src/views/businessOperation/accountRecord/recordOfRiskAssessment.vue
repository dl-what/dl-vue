<template>
  <div class="vlt-card game-store-list">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="8em"
    ></search-bar>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <!-- <el-table-column type="selection" width="55" fixed="left"></el-table-column> -->
      <el-table-column label="序号" fixed type="index" width="55">
        <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="bankCardNumber" label="会员卡号/投注卡号" min-width="260px"></el-table-column>
      <el-table-column prop="mobile" label="手机号码" min-width="120px"></el-table-column>
      <el-table-column prop="singleScore" label="单选题得分" min-width="120px"></el-table-column>
      <el-table-column prop="multipleScore" label="多选题得分" min-width="120px"></el-table-column>
      <el-table-column prop="totalScore" label="总得分" min-width="120px">
        <!-- <template slot-scope="scope">
          <div>{{scope.row.singleScore+scope.row.multipleScore}}</div>
        </template>-->
      </el-table-column>
      <el-table-column prop="levelName" label="风险等级" min-width="120px"></el-table-column>
      <el-table-column prop="createdTime" label="评估时间" min-width="160px">
        <template slot-scope="scope">
          <div>{{$moment(scope.row.createdTime).format("YYYY-MM-DD HH:mm:ss")}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="programName" label="评估方案" min-width="160px"></el-table-column>

      <el-table-column fixed="right" label="操作" min-width="90px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            v-prevent="2000"
            @click.native="detail(scope.row)"
            :id="$route.name+'-details-'+scope.$index"
            v-has="'recordOfRiskAssessment- detail'"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
  </div>
</template>

<script>
export default {
  name: "gameStoreManage",
  data() {
    return {
      tableData: [],
      searchOptions: [
        {
          title: "会员/投注卡号",
          type: "input",
          prop: "bankCardNumber",
          value: ""
        },
        {
          title: "手机号码",
          type: "input",
          prop: "mobile",
          value: ""
        },
        {
          title: "风险等级",
          type: "select",
          prop: "riskLevelId",
          value: "",
          options: []
        },
        {
          title: "评估时间",
          type: "datepicker-range",
          prop: "createdTime",
          value: null
        }
      ],
      currentPage: 1,
      page: 1,
      pageSize: 20,
      total: 0,
      searchForm: {}
    };
  },
  created() {
    this.init();
    this.getRiskLevelTree();
  },
  methods: {
    init(val) {
      const self = this;
      (async val => {
        let data = {
          page: val || 1,
          pageSize: self.pageSize,
          param: {
            ...this.searchForm
          }
        };
        let res = await self.$api.queryRiskAssessmentPage({ data });
        console.log(res, "风险处理分页");
        if (res && res.code == 0) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.page = res.data.current;
        }
      })(val);
    },
    getRiskLevelTree() {
      (async () => {
        let res = await this.$api.memberRiskLevelRiskLevelTree();
        console.log(res, "权益等级下拉");
        if (res && res.code === 0) {
          if (res.data) {
            let options = res.data.map(item => ({
              label: item.levelName,
              value: item.riskLevelId
            }));
            this.searchOptions[2].options = options;
          }
        }
      })();
    },
    //查看页面跳转
    detail(id) {
      this.$router.push({
        path: "recordOfRiskAssessmentDetails",
        query: {
          calculateId: id.calculateId,
          memberId: id.memberId,
          userId: id.userId
        }
      });
    },

    search(form) {
      // console.log(form);
      if (form.createdTime) {
        let startTime = this.$moment(form.createdTime[0]).format("YYYY-MM-DD ");
        let endTime = this.$moment(form.createdTime[1]).format("YYYY-MM-DD ");
        form = { ...form, startTime, endTime };
      }
      delete form.createdTime;
      this.searchForm = { ...form };
      this.init();
      console.log("search", form);
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init(val);
    }
  }
};
</script>


<style lang="less">
</style>
