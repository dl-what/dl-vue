<!-- 首页 - 我的知会 -->
<template>
  <div class="vlt-card pending-review">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="total"
      labelWidth="6em"
    >
      <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions" position="left"></control-bar>
    </search-bar>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column label="序号" fixed width="55">
        <template slot-scope="scope">{{params.pageSize*(params.page - 1) + (scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="title" label="业务标题" min-width="180px"></el-table-column>
      <el-table-column prop="categoryName" label="业务类型" min-width="120px"></el-table-column>
      <el-table-column prop="processName" label="所属流程" min-width="160px"></el-table-column>
      <el-table-column prop="currTaskName" label="当前审批环节" min-width="120px"></el-table-column>
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
      <el-table-column prop="createTime" label="创建时间" min-width="160px"></el-table-column>
      <el-table-column prop="applyTime" label="提交申请时间" min-width="160px"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="180px">
        <template slot-scope="scope">
          <el-button
            v-has="'myKnowledge-detail'"
            type="warning"
            size="mini"
            @click="toApplyDetail(scope.row.procInstId)"
            :id="$route.name + '-' + 'detail'+ scope.$index"
          >审批详情</el-button>
          <el-button
            v-has="'myKnowledge-formData'"
            type="primary"
            size="mini"
            @click="toDetail(scope.row)"
            :id="$route.name + '-' + 'title'+ scope.$index"
          >表单数据</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="total"
      :currentPage="params.page"
      :pageSize="params.pageSize"
      @handleSizeChange="changeSize"
      @handleCurrentChange="changeCurrent"
    ></table-paging>
  </div>
</template>
<script>
export default {
  name: "myKnowledge",
  data() {
    return {
      // 搜索组件配置
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
          title: "申请时间",
          placeholder: ["开始日期", "结束日期"]
        }
      ],
      controlOptions: [
        // { name: "打印", type: "primary", icon: "printer", permission: 'myKnowledge-print' },
        {
          name: "导出",
          type: "primary",
          icon: "s-promotion",
          permission: "myKnowledge-export"
        }
      ],
      tableData: [],
      // currentPage: 1
      total: 0,
      params: {
        page: 1,
        pageSize: 20,
        param: {}
      }
    };
  },
  created() {
    let date = this.$route.params.date;
    if (date) {
      this.params.param.beginDate = this.$route.params.beginDate||date;
      this.params.param.endDate = this.$route.params.endDate||date;
      this.getMyNotify(this.params);
    } else {
      this.getMyNotify(this.params);
    }
    this.getTreeData();
  },
  methods: {
    selectBtn(val) {
      console.log("selectBtn");
      if (val.name == "打印") {
        // this.$router.push({name: "gameCreate",});
      } else {
        // 导出列表
        this.exportNotifyExcel();
      }
    },
    // 导出列表
    async exportNotifyExcel() {
      const res = await this.$api.exportNotifyExcel({
        data: this.params,
        responseType: "blob"
      });
      var blob = new Blob([res.blob], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "我的知会.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(res);
    },
    // 审批详情
    toApplyDetail(id) {
      const self = this;
      if (self.$route.name === "myKnowledge") {
        self.$router.push({ name: "myKnowledgeDetail", query: { id } });
      } else {
        self.$router.push({ name: "myKnowledgeDetails", query: { id } });
      }
    },
    // 表单数据
    toDetail(val) {
      this.$router.push({ name: val.router, query: { type: 1, id: val.id } });
    },
    // 获取业务类型
    async getTreeData() {
      const res = await this.$api.getProcessTree();
      if (res && res.data) {
        this.searchOptions[1].options = res.data;
      }
    },
    // 我的知会
    getMyNotify(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getMyNotify({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.tableData = res.data.records;
          self.total = res.data.total;
          self.tableData.forEach(item => {
            item.createTime = this.$moment(item.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
        } else {
        }
      })(data);
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
      this.getMyNotify(this.params);
    },
    changeSize(val) {
      this.params.page = 1;
      this.params.pageSize = val;
      this.getMyNotify(this.params);
      console.log(`每页 ${val} 条`);
    },
    changeCurrent(val) {
      this.params.page = val;
      this.getMyNotify(this.params);
      console.log(`当前页: ${val}`);
    },
    view(row) {
      const self = this;
      console.log("查看", row);
      this.$router.push({
        name: "pendingReviewEdit",
        query: { id: row.id }
      });
    }
  }
};
</script>

<style lang="less">
.pending-review {
  .el-table--border,
  .el-table--group {
    border-color: #e0e0e0;
  }
  .table-box {
    margin-top: 20px;
  }
}
.tag {
  display: inline-block;
  height: 22px;
  line-height: 20px;
  margin: 2px 4px 2px 0;
  padding: 0 8px;
  border: 1px solid #e8eaec;
  border-radius: 3px;
  background: #f7f7f7;
  font-size: 12px;
  vertical-align: middle;
  opacity: 1;
  overflow: hidden;
  color: #515a6e;
  &.green {
    background: #f6ffed;
    border-color: #b7eb8f;
    color: #52c41a;
  }
  &.red {
    background: #fff1f0;
    border-color: #ffa39e;
    color: #f5222d;
  }

  &.blue {
    background: #e6f7ff;
    border-color: #91d5ff;
    color: #1890ff;
  }
}
</style>
