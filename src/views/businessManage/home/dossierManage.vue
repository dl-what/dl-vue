<template>
  <div class="vlt-card">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    ></search-bar>
    <el-table :data="tableData" border>
      <el-table-column type="index" fixed label="序号" width="60"></el-table-column>
      <el-table-column prop="title" label="业务标题" min-width="180px"></el-table-column>
      <el-table-column prop="categoryName" label="业务类型" min-width="120px"></el-table-column>
      <el-table-column prop="processName" label="所属流程" min-width="160px"></el-table-column>
      <el-table-column label="状态" min-width="120px">
        <template slot-scope="scope">
          <span
            class="tag"
            :class="{
            grey:scope.row.status=='0',
            blue:scope.row.status=='1',
            green:scope.row.status=='2',
            red:scope.row.status=='3',
            }"
          >{{scope.row.strStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结果" min-width="120px">
        <template slot-scope="scope">
          <span
            class="tag"
            :class="{
            grey:scope.row.result=='0',
            blue:scope.row.result=='1',
            green:scope.row.result=='2',
            red:scope.row.result=='3',
            }"
          >{{scope.row.strResult}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="applyer" label="流程发起人" min-width="140px"></el-table-column> -->
      <el-table-column prop="applyTime" label="发起时间" min-width="160px"></el-table-column>
      <el-table-column prop="updateTime" label="完成时间" min-width="160px"></el-table-column>
      <el-table-column label="耗时" min-width="100">
        <template slot-scope="scope">{{countTime(scope.row)}}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="180px">
        <template slot-scope="scope">
          <el-button
            v-has="'dossierManage-detail'"
            type="warning"
            size="mini"
            @click="toApplyDetail(scope.row.procInstId)"
            :id="$route.name + '-' + 'detail'+ scope.$index"
          >审批详情</el-button>
          <el-button
            v-has="'dossierManage-formData'"
            type="primary"
            size="mini"
            @click="toDetail(scope.row)"
            :id="$route.name + '-' + 'title'+ scope.$index"
          >表单数据</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="system-pagintion">
      <table-paging
        :current-page="params.page"
        :page-size="params.pageSize"
        :total="total"
        @handleSizeChange="changeSize"
        @handleCurrentChange="changeCurrent"
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
        {
          type: "input",
          prop: "title",
          value: "",
          title: "业务标题",
          placeholder: "请输入"
        },
        {
          title: "业务类型",
          type: "cascader",
          prop: "categoryId",
          value: "",
          setProps: {
            children: "children",
            value: "id",
            label: "name",
            checkStrictly: true
          },
          options: []
        },
        {
          type: "datepicker-range",
          prop: "date",
          value: "",
          title: "完成时间",
          placeholder: ["开始日期", "结束日期"]
        }
      ],
      tableData: [],
      total: 0,
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      }
    };
  },
  created() {
    this.getDossierList(this.params);
    this.getTreeData();
  },
  methods: {
    // 耗时
    countTime(val) {
      if (!val.updateTime) {
        return "";
      }
      let usedTime =
        new Date(val.updateTime).getTime() - new Date(val.applyTime).getTime();
      let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
      let leavel = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的时间
      let hours = Math.floor(leavel / (3600 * 1000)); // 计算剩余的小时数
      let leavel2 = leavel % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
      let minutes = Math.floor(leavel2 / (60 * 1000)); // 计算剩余的分钟数
      return days + "天" + hours + "时" + minutes + "分";
    },
    detail(val) {
      this.$router.push({ name: "dossierDestails", query: { id: val.DOSSID } });
    },
    // 获取业务类型
    async getTreeData() {
      const res = await this.$api.getProcessTree();
      if (res && res.data) {
        this.searchOptions[1].options = res.data;
      }
    },
    search(val) {
      this.params.page = 1;
      this.params.param = val;
      let categoryId = val.categoryId;
      if (categoryId && categoryId.length > 0) {
        this.params.param.categoryId = categoryId[categoryId.length - 1];
      }
      if (val.date && val.date.length > 0) {
        this.params.param.beginDate = this.$moment(val.date[0]).format(
          "YYYY-MM-DD"
        );
        this.params.param.endDate = this.$moment(val.date[1]).format(
          "YYYY-MM-DD"
        );
        delete this.params.param.date;
      }
      this.getDossierList(this.params);
    },
    changeSize(val) {
      this.params.pageSize = val;
      this.params.size = 1;
      this.getDossierList(this.params);
    },
    changeCurrent(val) {
      this.params.page = val;
      this.getDossierList(this.params);
    },
    // 表单详情
    toApplyDetail(id) {
      const self = this;
      if (self.$route.name === "dossierManage") {
        self.$router.push({ name: "dossierDetail", query: { id } });
      } else {
        self.$router.push({ name: "dossierDetails", query: { id } });
      }
    },
    // 表单数据 不可编辑
    toDetail(val) {
      this.$router.push({ name: val.router, query: { type: 1, id: val.id } });
    },
    getDossierList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getDossierList({ data });
        if (res && res.code == 0) {
          self.total = res.data.total;
          self.tableData = res.data.records;
          self.tableData.forEach(item => {
            item.updateTime = self
              .$moment(item.updateTime)
              .format("YYYY-MM-DD HH:mm:ss");
          });
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/index.less";
</style>
