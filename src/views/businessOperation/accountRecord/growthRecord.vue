<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    ></search-bar>

    <el-table :data="tableData" border style="width: 100%; margin-top: 10px;">
      <el-table-column type="index" fixed label="序号" width="55">
        <template slot-scope="scope">{{params.pageSize*(params.page-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="recordId" label="成长值编号" min-width="120px"></el-table-column>
      <el-table-column prop="memberName" label="账户名称" min-width="120px"></el-table-column>
      <el-table-column prop="mobile" label="手机号码" min-width="120px"></el-table-column>
      <el-table-column prop="growthType" label="成长值变动类型" min-width="120px">
        <template slot-scope="scope">{{integraType(scope.row.growthType)}}</template>
      </el-table-column>
      <el-table-column prop="insName" label="所属机构" min-width="120px"></el-table-column>
      <el-table-column prop="originalVal" label="原成长值" min-width="120px"></el-table-column>
      <el-table-column label="现成长值" prop="growthBalance" min-width="120px"></el-table-column>
      <el-table-column prop="addGrowth" label="变动成长值" min-width="120px">
        <template slot-scope="scope">{{'+'+scope.row.addGrowth}}</template>
      </el-table-column>
      <el-table-column prop="createdTime" label="变更时间" min-width="160px"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" min-width="90px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            :id="$route.name+'-details-'+scope.$index"
            @click="integralDetail(scope.row)"
            v-has="'integralRecord-details'"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      :current-page="params.page"
      :page-size="params.pageSize"
      :total="total"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from "vuex";
export default {
  name: "integralRecord",
  data() {
    return {
      searchOptions: [
        { title: "手机号码", type: "input", prop: "mobile", value: "" },
        {
          title: "变更时间",
          type: "datepicker-range",
          prop: "date",
          value: ""
        },
        {
          title: "所属机构",
          type: "cascader",
          prop: "insId",
          value: "",
          setProps: {
            value: "id",
            label: "text",
            checkStrictly: true,
            children: "children"
          },
          options: []
        }
      ],
      tableData: [],
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      total: 0,
      searchForm: {}
    };
  },
  computed: {
    ...mapGetters(["insData"])
  },
  created() {
    this.init(this.params);
  },
  methods: {
    init(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getGrowthPage({ data });
        console.log(res, "成长值记录");
        if (res && res.code === 0) {
          self.total = res.data.total;
          res.data.records.forEach(item => {
            item.createdTime = self
              .$moment(item.createdTime)
              .format("YYYY-MM-DD HH:mm:ss");
            item.originalVal =
              Number(item.growthBalance) - Number(item.addGrowth);
          });
          self.tableData = res.data.records;
        }
      })(data);
    },
    integraType(key) {
      let option = {
        1: "充值",
        2: "消费",
        3: "注册",
        4: "登录",
        5: "在线时长",
        6: "建议反馈"
      };
      return option[key];
    },
    integralDetail(account) {
      this.$router.push({
        path: "growthRecordDetails",
        query: { id: account.recordId }
      });
    },
    getArea(val) {
      let data = null;
      (async () => {
        let res = await this.$api.queryChannelById({ data: val });
        console.log(res, "区域信息");
        let name;
        if (res && res.code === 0) {
          if (res.data) {
            name = res.data.insName;
            data = name;
          }
        }
      })();
      return data;
    },
    search(val) {
      this.params.page = 1;
      if (val.date && val.date.length > 0) {
        val.startTime = this.$moment(val.date[0]).format("YYYY-MM-DD");
        val.endTime = this.$moment(val.date[1]).format("YYYY-MM-DD");
        delete val.date;
      }
      if (val.insId) {
        let id = val.insId[val.insId.length - 1];
        val.insId = id;
      }
      this.params.param = val;
      this.init(this.params);
    },
    pageSizeChange(size) {
      this.params.page = 1;
      this.params.pageSize = size;
      this.init(this.params);
    },
    pageCurrentChange(page) {
      this.params.page = page;
      this.init(this.params);
    }
  },
  watch: {
    insData: {
      handler(n, o) {
        this.searchOptions[2].options = this.insData;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
</style>
