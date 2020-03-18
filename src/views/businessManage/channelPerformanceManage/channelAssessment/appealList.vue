<template>
  <!-- 申诉列表 -->
  <div class="vlt-card">
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
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column label="序号" fixed type="index" width="55">
        
      </el-table-column>-->
      <el-table-column label="序号" type="index" fixed width="55">
        <!-- <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template> -->
      </el-table-column>
      <el-table-column prop="channelNo" label="渠道编号" min-width="120px"></el-table-column>
      <el-table-column prop="managerPhone" label="负责人手机号" min-width="120px"></el-table-column>
      <el-table-column prop="channelType" label="渠道类型" min-width="120px">
        <template slot-scope="scope">{{translateChannelType(scope.row.channelType)}}</template>
      </el-table-column>
      <el-table-column prop="reason" label="申诉内容" min-width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="处理状态" min-width="120px">
        <template slot-scope="scope">
          <span
            class="icon-circle"
            :class="{
            blue:scope.row.status=='2',
            green:scope.row.status=='1',
            grey:scope.row.status=='3',
            yellow:scope.row.status=='4',
            red:scope.row.status=='0',
            }"
          >{{scope.row.strStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="appealDate" label="申诉时间" width="180px">
        <template slot-scope="scope">{{translateTime(scope.row.appealDate)}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="100px">
        <template slot-scope="scope">
          <el-button
            v-has="'appealList-detail'"
            size="mini"
            type="primary"
            @click="detail(scope.row, 'appealListDisposeDetail')"
            v-if="scope.row.status==1"
            :id="$route.name+'-'+'detail'+scope.$index"
          >查看</el-button>
          <el-button
            v-has="'appealList-edit'"
            type="primary"
            size="mini"
            @click.native="edit(scope.row)"
            v-if="scope.row.status==0"
            :id="$route.name+'-'+'edit'+scope.$index"
          >处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page"
      :pageSize="params.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "appealList",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      searchOptions: [
        { title: "渠道编号", type: "input", prop: "channelNo", value: "" },
        {
          title: "负责人手机号",
          type: "input",
          prop: "managerPhone",
          value: ""
        },
        {
          title: "处理状态",
          prop: "status",
          type: "select",
          options: [
            { value: 0, label: "未处理" },
            { value: 1, label: "已处理" }
          ]
        }
      ],
      requestOptions: {},
      total: 0,
      searchParams: {},
      params: {
        page: 1,
        pageSize: 20
      }
    };
  },
  created() {
    // this.queryUpgradeList();
  },
  mounted() {
    this.channelAppeallist({});
  },
  methods: {
    translateTime(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    translateStatus(val) {
      let options = { 0: "未处理", 1: "已处理" };
      return options[val];
    },
    translateChannelType(val) {
      let options = { 0: "自营厅", 1: "合作厅" };
      return options[val];
    },
    async channelAppeallist() {
      //分页列表
      const res = await this.$api.channelAppeallist({
        data: {
          ...this.params,
          param: this.searchParams
        }
      });
      if (res && res.code === 0) {
        res.data.records.forEach(item => {
          item.strStatus = item.status == "0" ? "未处理" : "已处理";
        });
        this.tableData = res.data.records || [];
        this.total = res.data.total;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //查看页面跳转
    detail(row, name) {
      this.$router.push({
        name: name,
        query: {
          appealId: row.id,
          examineId: row.examineId,
          status: 0
        }
      });
    },
    edit(val) {
      //处理
      this.$router.push({
        path: "./appealListDispose",
        query: { appealId: val.id, examineId: val.examineId, status: 1 }
      });
    },
    search(val) {
      //搜索
      let list = val;
      this.searchParams = { ...list };
      this.params.page = 1;
      this.channelAppeallist();
    },

    handleSizeChange(size) {
      // console.log(`每页 ${val} 条`);
      this.params.pageSize = size;
      this.channelAppeallist();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.channelAppeallist();
    }
  },
  computed: {},
  components: {}
};
</script>


<style lang="less" scoped>
</style>
