<template>
  <div>
    <el-table
      :data="form.tabelList"
      border
      @selection-change="selectionChange"
      ref="multipleTable"
      :row-key="getRowKeys"
    >
      <el-table-column type="selection" width="55px" :reserve-selection="true"></el-table-column>
      <el-table-column label="序号" fixed type="index" width="55px"></el-table-column>
      <el-table-column label="项目标题" prop="title" min-width="100px"></el-table-column>
      <el-table-column label="项目级别" prop="rangeName" min-width="70px"></el-table-column>
      <el-table-column label="项目类型" prop="typeName" min-width="70px"></el-table-column>
      <el-table-column label="培训课程" prop="courseName" min-width="100px"></el-table-column>
      <el-table-column label="是否关联考试" prop="isExamName" min-width="80px"></el-table-column>
      <el-table-column label="培训说明" prop="introduce" min-width="160px"></el-table-column>
    </el-table>
    <table-paging
      :current-page="form.current"
      :page-size="form.pageSize"
      :total="form.total"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>
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
    return {};
  },
  components: {},
  created() {},
  methods: {
    selectionChange(data) {
      this.$emit("selectionChange", data);
    },
    pageSizeChange(size) {
      this.form.pageSize = size;
      this.$parent.$parent.trainItemListAll();
    },
    pageCurrentChange(page) {
      // this.form.current = page;
      this.$parent.$parent.trainItemListAll(page);
    },
    getRowKeys(row) {
      return row.id;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
