<template>
  <div class="vlt-card">
    <!-- <section class="comp-item">
      <search-bar
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="form.total"
        labelWidth="80px"
      ></search-bar>
    </section>-->
    <el-table
      ref="tabel"
      :data="form.tableData"
      tooltip-effect="dark"
      :row-key="getRowKeys"
      @selection-change="selectionChange"
      border
    >
      <el-table-column prop="equitiesId" type="selection" width="55" :reserve-selection="true"></el-table-column>
      <el-table-column type="index" label="序号" width="60" fixed>
        <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
      </el-table-column>
      <el-table-column prop="questionNumber" label="题目编号"></el-table-column>
      <el-table-column prop="questionType" label="题目类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{scope.row.questionType == 0 ? "单选题" : '多选题'}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="topicCode" label="题目编号" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="questionName" label="题目名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="questionOptionVoList" label="题目选项" show-overflow-tooltip width="200">
        <template slot-scope="scope">
          <div class="topicOption">
            <p
              v-for="(item,i) in scope.row.questionOptionVoList"
              :key="i"
            >{{generateBig_1(Number(i+65))+'.'+item.optionName}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="questionOptionVoList" label="选项分值" min-width="100">
        <template slot-scope="scope">
          <div class="topicOption">
            <p
              v-for="(item,i) in scope.row.questionOptionVoList"
              :key="i"
            >{{generateBig_1(Number(i+65))+'.'+item.score}}分</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="topicPoints" label="题目总分" min-width="100">10分</el-table-column>
    </el-table>
    <section class="comp-item">
      <table-paging
        :total="form.total"
        :currentPage="page"
        :pageSize="pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
    </section>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  model: {
    prop: "form"
  },
  props: {
    form: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      searchOptions: [
        {
          title: "题目类型",
          type: "select",
          prop: "inputName",
          value: "",
          options: [
            { label: "单选题", value: 1 },
            { label: "多选题", value: 2 },
            { label: "填空题", value: 3 }
          ]
        }
      ],
      page: 1,
      pageSize: 20
    };
  },
  created() {
    this.questionList();
    let arr = [];
  },
  components: {},
  methods: {
    selectable(val, index) {
      //:selectable="selectable"
    },
    generateBig_1(val) {
      let a = String.fromCharCode(val);
      return a;
    },
    selectionChange(val) {
      console.log(val);
      this.form.list = val;
    },
    search() {},
    getRowKeys(row) {
      return row.questionId;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.questionList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.questionList(page);
    },
    questionList(val) {
      const self = this;
      (async val => {
        let data = {
          page: val || 1,
          pageSize: self.pageSize,
          param: {}
        };
        let result = await self.$api.memberRiskLevelQuestionPage({ data });
        console.log(result, "题目分页");
        self.form.total = result.data.total;
        self.page = result.data.current;
        self.form.tableData = result.data.records;
      })(val);
    }
  }
};
</script>

<style lang="less" scoped>
.topicOption {
  display: flex;
  width: 100%;
  flex-wrap: wrap;

  justify-content: space-around;
}
</style>
