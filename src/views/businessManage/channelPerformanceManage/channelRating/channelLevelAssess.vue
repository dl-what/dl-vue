<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    ></search-bar>

    <el-table :data="tableData" border style="margin-top: 10px;">
      <el-table-column type="index" width="60px" label="序号">
        <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="channelNo" label="渠道编号" min-width="110"></el-table-column>
      <el-table-column prop="channelType" label="渠道类型">
        <template slot-scope="scope">
          <span>{{scope.row.channelType===0?"自营厅":"合作厅"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="chLevelName" label="渠道等级"></el-table-column>
      <el-table-column prop="insName" label="所属机构"></el-table-column>
      <el-table-column prop="quality" label="定性得分"></el-table-column>
      <el-table-column prop="quantity" label="定量得分"></el-table-column>
      <el-table-column prop="totalScore" label="综合得分"></el-table-column>
      <el-table-column prop="dateTime" label="考核年月"></el-table-column>
      <el-table-column label="操作" align="center" min-width="100px">
        <template slot-scope="scope">
          <el-button
            :id="$route.name + '-' + 'detail' + scope.$index"
            v-has="'channelLevelAssess-detail'"
            type="primary"
            size="mini"
            @click="detail(scope.row.id)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "channelLevelAssess",
  data() {
    return {
      total: 0,
      page: 1,
      pageSize: 20,
      param: {},
      searchOptions: [
        {
          title: "渠道编号",
          type: "select",
          prop: "channelNo",
          value: "",
          options: []
        },
        {
          title: "所属机构",
          type: "cascader",
          prop: "insId",
          value: "",
          options: [],
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            checkStrictly: true
          }
        },
        {
          title: "考核年月",
          type: "month",
          prop: "examineTime",
          value: ""
        },
        {
          title: "渠道类型",
          type: "select",
          prop: "channelType",
          value: "",
          options: [
            { label: "合作厅", value: 1 },
            { label: "自营厅", value: 0 }
          ]
        }
      ],
      tableData: []
    };
  },
  created() {
    this.init();
    this.getChannelInfoModifyList();
    this.getInsData();
  },
  methods: {
    async init(val) {
      let res = await this.$api.channelExamineList({
        data: {
          page: val || 1,
          pageSize: this.pageSize,
          param: {
            examineType: 1,
            ...this.param
          }
        }
      });
      console.log(res.data);
      if (res && res.code === 0) {
        res.data.records.forEach(item => {
          item.dateTime = item.examineYear + "-" + item.examineMonth;
        });
        this.page = res.data.current;
        this.total = res.data.total;
        this.tableData = res.data.records;
      }
      // console.log(res);
    },
    search(val) {
      if (val.examineTime) {
        val.examineYear = this.$moment(val.examineTime).format("YYYY");
        val.examineMonth = this.$moment(val.examineTime).format("MM");
      }
      if (val.insId) {
        val.insId = val.insId.pop();
      }
      this.param = val;
      this.init();
    },
    //渠道编号下拉列表
    async getChannelInfoModifyList() {
      let res = await this.$api.getChannelInfoModifyList({
        data: {
          insId: this.$storage.get("userInfo").insId
        }
      });
      if (res && res.code === 0) {
        this.searchOptions[0].options = res.data.map(item => {
          return { value: item.channelNo };
        });
      }
      // console.log(res);
    },
    //机构数据
    async getInsData() {
      const self = this;
      const data = {};
      let res = await self.$api.QueryUserAndInsTree({ data });
      if (res && res.code == 0) {
        let newData = res.data;
        self.$set(self.searchOptions[1], "options", newData);
      } else {
        // self.$message.warning(res.msg)
      }
    },

    detail(id) {
      this.$router.push({ path: "levelAssessDetail", query: { id: id } });
    },

    pageSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    pageCurrentChange(current) {
      this.init(current);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
